/*
 * Most of the methods in ClickHandler are tested indirectly through the WH
 * specs. Once you no longer need to support a handful of WH methods, move
 * the WH specs over to this file.
 */
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

  describe('#shouldRedirectToLastLinkClicked', function () {
    it('should when present', function () {
      expect(clickHandler._shouldRedirect('/')).toEqual(true);
    });

    it('should not when null', function () {
      expect(clickHandler._shouldRedirect(null)).toEqual(false);
    });

    it('should not when javascript:', function () {
      expect(clickHandler._shouldRedirect('javascript: void(0);')).toEqual(false);
    });
  });

  describe('#followHrefConfigured', function() {
    it('should be false when not configured in any way', function() {
      expect(clickHandler._followHrefConfigured(null, null, null)).toEqual(false);
    });

    it('should be true when wh followHref', function() {
      expect(clickHandler._followHrefConfigured(null, null, {followHref: true})).toEqual(true);
    });

    it('should let passed options followHref override wh followHref', function() {
      expect(clickHandler._followHrefConfigured(null, {followHref: true}, {followHref: false})).toEqual(true);
    });

    it('should let event options followHref override other followHref options', function() {
      expect(clickHandler._followHrefConfigured({data: {followHref: true}}, {followHref: false}, {followHref: false})).toEqual(true);
    });
  });
});
