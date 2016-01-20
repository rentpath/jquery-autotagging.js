describe('Select element change event handler', function() {
  var changeHandler;

  beforeEach(function() {
    var ready = false;

    require(['../../dist/shared/select_change_handler'], function(SelectChangeHandler) {
      changeHandler = new SelectChangeHandler();
      ready = true;
    });

    waitsFor(function(){
      return ready;
    });
  });

  describe('#bind', function() {
    it('binds the event handler to an event for a selector', function() {
      spyOn($.fn, 'on');
      changeHandler.bind(document);
      expect($.fn.on).toHaveBeenCalled()
    });
  });

  describe('#trackingData', function() {
    it('asks the finder for a subgroup', function() {
      var finder = {
        subgroup: function(_) { return 'subgroup' },
        item: function(_) { return 'item' },
        value: function(_) { return 'value' },
      };
      var event = {clientX: 1, clientY: 2};
      changeHandler.finder = finder;
      $testElement = $('<select><option selected>text</option></select>');
      actualData = changeHandler.trackingData(event, $testElement, []);
      expectedData = {
        sg: 'subgroup',
        item: 'item',
        value: 'value',
        text: 'text',
        type: 'change',
        x: 1,
        y: 2
      };
      expect(actualData).toEqual(expectedData)
    });
  });
});
