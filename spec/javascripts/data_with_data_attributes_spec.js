describe('tracking data gotten from data attributes', function() {
  var finder;

  beforeEach(function() {
    var ready = false;

    require(['../../dist/shared/data_with_data_attributes'], function(clickDataFinder) {
      finder = clickDataFinder('data-tag_item', 'data-tag_section');
      ready = true;
    });

    waitsFor(function(){
      return ready;
    });
  });

  describe('#item', function() {
    it('yields a data attribute value if an appropriate one is present', function() {
      $testElement = $("<div data-tag_item='bar'></div>");
      expect(finder.item($testElement)).toEqual('bar');
    });

    it('yields an empty string if an appropriate data attribute is not present', function() {
      $testElement = $('<div></div>');
      expect(finder.item($testElement)).toEqual('');
    });
  });

  describe('#subgroup', function() {
    it('returns a subgroup if one exists', function() {
      $testElement = $("<div data-tag_section='bar'></div>");
      expect(finder.subgroup($testElement)).toEqual('bar');
    });

    it('returns an empty string if there is no subgroup', function () {
      $testElement = $('<div></div>');
      expect(finder.subgroup($testElement)).toEqual('');
    });

    it('cralws up the DOM in search of a subgroup if one exists, returns it', function() {
      $parentElement = $("<div data-tag_section='bar'><p></p></div>");
      $childElement = $parentElement.find('p');
      expect(finder.subgroup($childElement)).toEqual('bar');
    });
  });

  describe('#value', function() {
    describe('when the element is an imput', function() {
      it('returns the input value', function() {
        testElement = $('<input value="test">')[0];
        expect(finder.value(testElement)).toEqual('test');
      });
    });

    describe('when the element is not an input', function() {
      it('returns the element text if there are no children', function() {
        testElement = $('<div>test</div>')[0];
        expect(finder.value(testElement)).toEqual('test');
      });

      it('returns the text of visible children if children exist', function() {
        testElement = $('<div><p>Hi</p><p>Bye</p></div>')[0];
        document.body.appendChild(testElement);
        expect(finder.value(testElement)).toEqual('HiBye');
      });
    });

    describe('truncation', function() {
      it('truncates the value to 100 characters', function() {
        testElement = $('<div>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa\
                        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>')[0];
        expect(finder.value(testElement).length).toEqual(100);
      });
    });
  });
});
