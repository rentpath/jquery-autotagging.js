/*
 * Most of the methods in ClickHandler are tested indirectly through the WH
 * specs. Once you no longer need to support a handful of WH methods, move
 * the WH specs over to this file.
 */
describe('Click handler', function() {
  var clickHandler;

  beforeEach(function() {
    var ready = false;

    require(['../../click_handler', '../../jquery.autotagging'],
      function(ClickHandler, WH) {
        wh = new WH();
        wh.platform = {OS: 'OS', browser: 'dummy', version: ''};
        wh.metaData = {cg: 'test'};
        wh.followHref = true;
        testWindow = $('<div></div>');
        clickHandler = new ClickHandler(wh);
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

  describe('should redirect to href', function () {
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

    it('should be false when event sets followHref to false', function() {
      expect(clickHandler._followHrefConfigured({ data: { followHref: false } }, null, null)).toEqual(false);
    });

    it('should be true when wh followHref', function() {
      expect(clickHandler._followHrefConfigured(null, null, {followHref: true})).toEqual(true);
    });

    it('should be false when wh sets followHref to false', function() {
      expect(clickHandler._followHrefConfigured(null, null, {followHref: true})).toEqual(true);
    });

    it('should be false when options sets followHref to false', function() {
      expect(clickHandler._followHrefConfigured(null, null, {followHref: false})).toEqual(false);
    });

    it('should let passed options followHref override wh followHref', function() {
      expect(clickHandler._followHrefConfigured(null, {followHref: true}, {followHref: false})).toEqual(true);
    });

    it('should let event options followHref override other followHref options', function() {
      expect(clickHandler._followHrefConfigured({data: {followHref: true}}, {followHref: false}, {followHref: false})).toEqual(true);
    });
  });

  describe("#elemClicked", function() {
    describe("same window link", function() {
      beforeEach(function() {
        setFixtures('<meta name="WH.cg" content="test"/><div id="nav_menu"><span class="icon_home sprite">Stuff</span><a class="trap" href="#to_the_past"><img class="photo" src="#"></a></div>');
      });

      describe('when not nested', function() {
        it('does not open in new window', function() {
          spyOn(clickHandler, '_openNewWindow');
          spyOn(clickHandler, '_setDocumentLocation');
          clickHandler.bind(document);
          $(document).find('a.trap').click();
          waitsFor(function() {
            return clickHandler._setDocumentLocation.wasCalled;
          });
          runs(function() {
            expect(clickHandler._openNewWindow).not.toHaveBeenCalled();
          });
        });
      });

      describe('when nested', function() {
        it('does not open in new window', function() {
          spyOn(clickHandler, '_openNewWindow');
          spyOn(clickHandler, '_setDocumentLocation');
          clickHandler.bind(document);
          $(document).find('img.photo').click();
          waitsFor(function() {
            return clickHandler._setDocumentLocation.wasCalled;
          });
          runs(function() {
            expect(clickHandler._openNewWindow).not.toHaveBeenCalled();
          });
        });
      });

      describe('when not nested', function() {
        it('goes to clicked link', function() {
          spyOn(clickHandler, '_setDocumentLocation');
          clickHandler.bind(document);
          $(document).find('a.trap').click();
          waitsFor(function() {
            return clickHandler._setDocumentLocation.wasCalled;
          });
          runs(function() {
            expect(clickHandler._setDocumentLocation).toHaveBeenCalledWith('#to_the_past');
          });
        });
      });

      describe('when nested', function() {
        it('goes to clicked link', function() {
          spyOn(clickHandler, '_setDocumentLocation');
          clickHandler.bind(document);
          $(document).find('img.photo').click();
          waitsFor(function() {
            return clickHandler._setDocumentLocation.wasCalled;
          });
          runs(function() {
            expect(clickHandler._setDocumentLocation).toHaveBeenCalledWith('#to_the_past');
          });
        });
      });

      describe('when metaKey + key', function() {
        beforeEach(function(){
          spyOn(clickHandler, '_openNewWindow');
          spyOn(clickHandler, '_setDocumentLocation');
          spyOn(wh, 'fire');
          clickHandler.bind(document);
          customEvent = $.Event('click', { metaKey: true })
          $(document).find('img.photo').trigger(customEvent);
          waitsFor(function() {
            return clickHandler._openNewWindow.wasCalled;
          });
        });

        it('goes to clicked link', function() {
          runs(function() {
            expect(clickHandler._setDocumentLocation).not.toHaveBeenCalled();
          });
        });

        it('fires tag', function() {
          runs(function() {
            expect(wh.fire).toHaveBeenCalled();
          });
        });
      });

      describe('when ctrlKey + key', function() {
        beforeEach(function() {
          spyOn(clickHandler, '_openNewWindow');
          spyOn(clickHandler, '_setDocumentLocation');
          spyOn(wh, 'fire')
          clickHandler.bind(document);
          customEvent = $.Event('click', { ctrlKey: true })
          $(document).find('img.photo').trigger(customEvent);
          waitsFor(function() {
            return clickHandler._openNewWindow.wasCalled;
          });
        });

        it('goes to clicked link', function() {
          runs(function() {
            expect(clickHandler._setDocumentLocation).not.toHaveBeenCalled();
          });
        });

        it('fires tag', function() {
          runs(function() {
            expect(wh.fire).toHaveBeenCalled();
          });
        });
      });
    });

    describe("new window link (target='_blank')", function() {
      beforeEach(function() {
        setFixtures('<meta name="WH.cg" content="test"/><div id="nav_menu"><span class="icon_home sprite">Stuff</span><a class="trap" href="#to_the_past" target="_blank"><img class="photo" src="#"></a></div>');
      });

      describe('when not nested', function() {
        it('does not open in same window', function() {
          spyOn(clickHandler, '_openNewWindow');
          spyOn(clickHandler, '_setDocumentLocation');
          clickHandler.bind(document);
          $(document).find('a.trap').click();
          waitsFor(function() {
            return clickHandler._openNewWindow.wasCalled;
          });
          runs(function() {
            expect(clickHandler._setDocumentLocation).not.toHaveBeenCalled();
          });
        });
      });

      describe('when nested', function() {
        it('does not open in same window', function() {
          spyOn(clickHandler, '_openNewWindow');
          spyOn(clickHandler, '_setDocumentLocation');
          clickHandler.bind(document);
          $(document).find('img.photo').click();
          waitsFor(function() {
            return clickHandler._openNewWindow.wasCalled;
          });
          runs(function() {
            expect(clickHandler._setDocumentLocation).not.toHaveBeenCalled();
          });
        });
      });

      describe('when not nested', function() {
        it('opens link in new window', function() {
          spyOn(clickHandler, '_openNewWindow');
          clickHandler.bind(document);
          $(document).find('a.trap').click();
          waitsFor(function() {
            return clickHandler._openNewWindow.wasCalled;
          });
          runs(function() {
            expect(clickHandler._openNewWindow).toHaveBeenCalledWith('#to_the_past');
          });
        });
      });

      describe('when nested', function() {
        it('does not open in same window', function() {
          spyOn(clickHandler, '_openNewWindow');
          clickHandler.bind(document);
          $(document).find('img.photo').click();
          waitsFor(function() {
            return clickHandler._openNewWindow.wasCalled;
          });
          runs(function() {
            expect(clickHandler._openNewWindow).toHaveBeenCalledWith('#to_the_past');
          });
        });
      });
    });
  });
});
