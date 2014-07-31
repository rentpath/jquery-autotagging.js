# Most of the methods in ClickHandler are tested indirectly through the WH
# specs. Once you no longer need to support a handful of WH methods, move
# the WH specs over to this file.
describe('Click handler', function() {
  var clickHandler;

  beforeEach(function() {
    var ready = false;

    require(['../../click_handler'], function(ClickHandler) {
      clickHandler = new ClickHandler();
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
});
