/*
 * Most of the methods in ClickHandler are tested indirectly through the WH
 * specs. Once you no longer need to support a handful of WH methods, move
 * the WH specs over to this file.
 */
describe('Click handler', function() {
  var clickHandler;
  var wh;
  var finder = {
    item: function() { return 'foo' },
    subgroup: function() { return 'hans' },
    value: function() { return 'test' }
  };

  beforeEach(function() {
    var ready = false;

    require(['../../dist/shared/click_handler', '../../dist/shared/jquery.autotagging'], function(ClickHandler, WH) {
      wh = new WH();
      testWindow = $('<div></div>');
      clickHandler = new ClickHandler(wh, finder);
      ready = true;
    });

    waitsFor(function(){
      return ready;
    });
  });

  describe('#bind', function() {
    it('should bind the event handler to an event for a selector', function() {
      spyOn($.fn, 'on');
      clickHandler.bind(document);
      expect($.fn.on).toHaveBeenCalled()
    });
  });


  describe("#elemClicked", function() {
    it('sets the tracking data', function() {
      wh.init();
      event = {
        clientX: 1,
        clientY: 2,
        target: $("<a id='foo'>test</a>")[0]
      };

      spyOn(wh, 'fire');
      clickHandler.elemClicked(event);

      trackingData = {
        sg: 'hans',
        item: 'foo',
        value: 'test',
        type: 'click',
        x: 1,
        y: 2
      };
      expect(wh.fire).toHaveBeenCalledWith(trackingData);
    });
  });
});
