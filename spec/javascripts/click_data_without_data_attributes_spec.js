describe('click data gotten from ids and classes', function() {
  var finder;

  beforeEach(function() {
    var ready = false;

    require(['../../dist/shared/click_data_without_data_attributes'], function(clickDataFinder) {
      finder = clickDataFinder;
      ready = true;
    });

    waitsFor(function(){
      return ready;
    });
  });

  describe('#item', function() {
    it('yields the id if one is present', function() {
      $testElement = $("<div id='bar' class='item'></div>");
      expect(finder.item($testElement)).toEqual('bar');
    });

    it('yields the the first class if no id is present', function() {
      $testElement = $("<div class='tyler hans michael'></div>");
      expect(finder.item($testElement)).toEqual('tyler');
    });

    it('yields an empty string if no id or class are present', function() {
      $testElement = $('<div></div>');
      expect(finder.item($testElement)).toEqual('');
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

  describe('#value', function() {
    it('returns a data attribute value if it can find the data attribute', function() {
      $testElement = $("<div data-autotag-value='bar'></div>");
      expect(finder.value($testElement, 'autotag')).toEqual('bar');
    });

    it('returns the target element text if the expected data attribute is not present', function() {
      $testElement = $("<div>Hi there</div>");
      expect(finder.value($testElement)).toEqual('Hi there');
    });
  });
});
