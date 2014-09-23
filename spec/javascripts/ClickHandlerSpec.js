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
