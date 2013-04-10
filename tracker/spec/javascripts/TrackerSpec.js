describe("Tracker Suite", function() {
  var tracker, key;

  var checkStorage = function(field) {
    var item = JSON.parse(localStorage.getItem(key));
    if(field) return item[field] || null;
    return item;
  };

  beforeEach(function() {
    var ready = false;
    var key = "/apartments/Alaska/Yakutat/";

    require(['../../tracker'], function(localTracker) {
      tracker = localTracker;

      tracker.key = function() { key };

      ready = true;
    });

    waitsFor(function(){
      return ready;
    });
  });

  describe("Public Module Functions", function() {
    describe("#track", function() {
      localStorage.clear();

      it('should start the count', function () {
        tracker.track();
        expect(checkStorage('count')).toEqual(1);
      });
      it('should increase the count', function () {
        tracker.track();
        expect(checkStorage('count')).toEqual(2);
      });
    });

    describe("#save", function() {
      localStorage.clear();

      it('should save page info', function () {
        tracker.track('something', 12);
        var page = checkStorage();
        expect(page['nodes']).toEqual(['some', 'nodes', 'here']);
      });

      it('should save an arbitrary item', function () {
        tracker.save('something', 12);
        expect(checkStorage('something')).toEqual(12);
      });
    });

    describe("#peek", function() {
      localStorage.clear();

      it('should return 0 (by default) for a missing item', function () {
        localStorage.clear();
        expect(tracker.peek('something')).toEqual(0);
      });

      it('should return passed-in for a missing item', function () {
        var default_value = "nothing";
        expect(tracker.peek('something', default_value)).toEqual(default_value);
      });

      it('should return an existent item', function () {
        var str = JSON.stringify({'something':1});
        localStorage.setItem(key, str)

        expect(tracker.peek('something')).toEqual(1);
      });
    });

    describe("#number_of_visits", function() {
      it('should return 0 for an unstarted count', function () {
        localStorage.clear();
        expect(tracker.peek('count')).toEqual(0);
      });

      it('should return the count of visits', function () {
        tracker.track();
        expect(tracker.number_of_visits()).toEqual(1);
      });
    });

    describe("#refinements", function() {
      it('should return [] for absent nodes', function () {
        localStorage.clear();
        expect(tracker.refinements()).toEqual([]);
      });

      it('should return the list of nodes', function () {
        tracker.track();
        expect(tracker.refinements()).toEqual(1);
      });
    });

    describe("#number_of_refinements", function() {
      it('should return 0 for absent nodes', function () {
        localStorage.clear();
        expect(tracker.number_of_refinements()).toEqual(0);
      });

      it('should only return the number of nodes', function () {
        tracker.track();
        expect(tracker.number_of_refinements()).toEqual(3);
      });
    });


    describe("#type", function() {
      it('should return an empty string for a missing field', function () {
        localStorage.clear();
        expect(tracker.type()).toEqual('');
      });

      it('should return the type', function () {
        tracker.track();
        expect(tracker.type()).toEqual('');
      });
    });

    describe("#searchType", function() {
      it('should return an empty string for a missing field', function () {
        localStorage.clear();
        expect(tracker.searchType()).toEqual('');
      });

      it('should return the search type', function () {
        tracker.track();
        expect(tracker.searchType()).toEqual('');
      });
    });

  });
});
