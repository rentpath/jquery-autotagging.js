describe('select element data gotten from ids and classes', function() {
  var finder;

  beforeEach(function() {
    var ready = false;

    require(['../../dist/shared/select_data_without_data_attributes'], function(selectDataFinder) {
      finder = selectDataFinder;
      ready = true;
    });

    waitsFor(function(){
      return ready;
    });
  });

  describe('#item', function() {
    it('returns the select menu option value if it exists', function() {
      var $select = {
        find: function(_) {
          return { val: function() { return 'boo'; } };
        }
      };
      var item = finder.item($select);

      expect(item).toEqual('boo');
    });

    it('returns an empty string if a value does not exist', function() {
      var $select = {
        find: function(_) {
          return { val: function() { return undefined; } };
        }
      };
      var item = finder.item($select);

      expect(item).toEqual('');
    });
  });

  describe('#value', function() {
    it('returns the select menu option value if it exists', function() {
      var $select = {
        find: function(_) {
          return { val: function() { return 'boo'; } };
        }
      };
      var value = finder.value($select);

      expect(value).toEqual('boo');
    });

    it('returns an empty string if a value does not exist', function() {
      var $select = {
        find: function(_) {
          return { val: function() { return undefined; } };
        }
      };
      var value = finder.value($select);

      expect(value).toEqual('');
    });
  });

  describe('#subgroup', function() {
    it('returns a subgroup if one exists', function() {
      $testElement = $("<div id='bar'></div>");
      expect(finder.subgroup($testElement)).toEqual('bar');
    });

    it('crawls up the DOM until it finds an id', function() {
      $dom = $("<div id='bar'><p>Hi</p></div>");
      $testElement = $dom.find('p');
      expect(finder.subgroup($testElement)).toEqual('bar');
    });

    it('returns an empty string if there is no subgroup', function () {
      $testElement = $('<div></div>');
      expect(finder.subgroup($testElement)).toEqual('');
    });
  });

  describe('#text', function() {
    it('returns the select menu option text', function() {
      var $select = {
        find: function(_) {
          return { text: function() { return 'hi'; } };
        }
      };
      var text = finder.text($select);

      expect(text).toEqual('hi');
    });
  });
});
