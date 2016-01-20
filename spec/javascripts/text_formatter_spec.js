describe('text formatter', function() {
  var formatter;

  beforeEach(function() {
    var ready = false;

    require(['../../dist/shared/text_formatter'], function(textFormatter) {
      formatter = textFormatter;
      ready = true;
    });

    waitsFor(function() {
      return ready;
    });
  });

  describe("#replaceDoubleByteChars", function() {
    it('should replace double-byte characters', function() {
      badText = 'Download Android™ App©'
      goodText = 'Download Android(tm) App(c)'
      expect(formatter.replaceDoubleByteChars(badText)).toEqual(goodText);
    });
  });
});
