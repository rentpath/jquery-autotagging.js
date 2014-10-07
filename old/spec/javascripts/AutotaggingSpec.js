describe("Autotagging Suite", function() {
  var wh, simulPlatform, testDocument, testWindow;

  beforeEach(function() {
    var ready = false;

    require(['jquery.autotagging'], function(WH) {
      wh = new WH();
      wh.platform = {OS: 'OS', browser: 'dummy', version: ''};
      testWindow = $('<div></div>');
      ready = true;
    });

    waitsFor(function(){
      return ready;
    });
  });

  describe("Instance Methods", function() {
    describe('#determineWindowDimensions', function() {
      it('returns a string for window dimensions', function() {
        testWindow.width(100).height(100);
        expect(wh.determineWindowDimensions(testWindow)).toEqual('100x100');
      });
    });

    describe("#fire", function() {
      var callback;
      var obj;

      beforeEach(function() {
        obj = {};
        wh.init()
        callback = {
          fightFire: function(obj) {
            obj.blaze = true;
            return obj;
          }
        };

        wh.fireCallback = callback.fightFire;
        spyOn(wh, 'fireCallback').andCallThrough();
      });

      it('calls the given callback', function () {
        wh.fire(obj);
        expect(obj.blaze).toEqual(true);
        expect(wh.fireCallback).toHaveBeenCalled();
      });

      it('amends the object with the one time data ONCE', function() {
        wh.setOneTimeData({auxiliary: 'secret'});
        wh.fire(obj);
        expect(obj.auxiliary).toEqual('secret');

        next = {};
        wh.fire(next);
        expect(next.auxiliary).toEqual(undefined);
      });

      describe('records campaign id', function() {
        afterEach(function() {
          $.removeCookie('campaign_id');
        });

        it("returns the user's campaign ID if a campaign cookie is set", function() {
          $.cookie('campaign_id', '1234', {path: '/'});
          wh.fire(obj);
          expect(obj.campaign_id).toEqual('1234');
        });

        it("does not return the user's campaign ID if a campaign cookie is not present", function() {
          wh.fire(obj);
          expect(obj.campaign_id).toBeUndefined();
        });
      });

      describe('records login information', function() {
        var signon_cookie;
        var provider_cookie;
        var zid_cookie;

        beforeEach(function() {
          provider_cookie = $.cookie('provider');
          signon_cookie   = $.cookie('sgn');
          zid_cookie      = $.cookie('zid');
        });

        afterEach(function() {
          $.cookie('provider', provider_cookie, {expires: 3650, path: '/'});
          $.cookie('sgn', signon_cookie, {expires: 3650, path: '/'});
          $.cookie('zid', zid_cookie, {expires: 3650, path: '/'});
        });

        it('returns "0" if not registered', function() {
          $.cookie('sgn', 0, {expires: 3650, path: '/'});
          wh.fire(obj);
          expect(obj.registration).toEqual(0);
        });

        it('returns "1" if registered', function() {
          $.cookie('sgn', 1, {expires: 3650, path: '/'});
          wh.fire(obj);
          expect(obj.registration).toEqual(1);
        });
      });

      it('sets the firing time', function () {
        wh.fire(obj);
        expect(obj.ft).toNotEqual(undefined);
      });
    });

    describe('#firstClass', function() {
      it('yields the first class name of the element', function() {
        testElement = $("<div class='first second third'></div>");
        expect(wh.firstClass(testElement)).toEqual('first');
      });
    });

    describe('#getDataFromMetaTags', function() {
      it('extracts WH meta tags', function() {
        testDoc = $("<div><meta name='WH.cg' content=''/><meta name='WH.test' content='dummy'/><meta name='WH.quiz' content='placeholder'</div>");
        result = { cg : '', test : 'dummy', quiz : 'placeholder' };
        expect(wh.getDataFromMetaTags(testDoc)).toEqual(result);
      });
    });

    describe("#getSubgroupId", function() {
      it('yields the id of the first parent element', function() {
        loadFixtures("autotagging.html")
        link = $("a:contains('Browse New Homes')");
        expect(wh.getSubgroupId(link)).toEqual('nav_menu');
      });

      it('yields null when no id present', function() {
        loadFixtures("autotagging.html")
        link = $("html");
        expect(wh.getSubgroupId(link)).toEqual(null);
      });
    });

    describe("#getItemId", function() {
      it('yields the id of the element', function() {
        testElement = $("<div id='foo'></div>");
        expect(wh.getItemId(testElement)).toEqual('foo');
      });

      it('yields the first class of the element when no id present', function() {
        testElement = $("<div class='first second third'></div>");
        expect(wh.getItemId(testElement)).toEqual('first');
      });
    });

    describe("#init", function() {
      var targets;

      beforeEach(function() {
        setFixtures('<div id="nav_menu"><span class="icon_home sprite">Stuff</span><a class="trap" href="#">Privacy Policy</a><a class="x">X</a></div>');
        targets = 'a.trap, span.icon_home';
        wh.init({clickBindSelector: targets});
        spyOn(wh, 'fire');
      });

      it('binds to the named elements', function() {
        $(document).find('a.trap').click();
        expect(wh.fire).toHaveBeenCalled();
      });

      it('binds to multiple elements', function() {
        $(document).find('span.icon_home').click();
        expect(wh.fire).toHaveBeenCalled();
      });

      it('does not bind to other elements', function() {
        $(document).find('a.x').click();
        expect(wh.fire).not.toHaveBeenCalled();
      });

      describe ("with config object", function() {
        var configObject, opts;

        beforeEach(function() {
          configObject = {cg: 'test', lpp: "1"};
          opts = {metaData: configObject};
        });

        it('should use the config object', function() {
          wh.init(opts);
          expect(wh.metaData).toEqual(configObject);
        });
      });

      describe ("without config object", function() {
        it('should fallback to meta tags when config object is missing', function() {
          spyOn(wh, 'getDataFromMetaTags')
          wh.init();
          expect(wh.getDataFromMetaTags).toHaveBeenCalled();
        });
      });
    });

    describe("default clickBindSelector", function() {
      var newContent;

      beforeEach(function() {
        setFixtures("<div><input type=submit><input type=button><a class='trap' href='#'>O</a><img src='http://www.example.com' title='Image'><a class='x' href='#'>O</a></div>");
        targets = 'a.trap, img, input[type=submit], input[type=button]';
        wh.init({clickBindSelector: targets});
        spyOn(wh, 'fire');
      });

      it('binds to the named elements', function() {
        $(document).find('a.trap').click();
        expect(wh.fire).toHaveBeenCalled();
      });

      it('binds to img elements', function() {
        $(document).find('img').click();
        expect(wh.fire).toHaveBeenCalled();
      });

      it('binds to input submit elements', function() {
        $(document).find('input[type=submit]').click();
        expect(wh.fire).toHaveBeenCalled();
      });

      it('binds to input button elements', function() {
        $(document).find('input[type=button]').click();
        expect(wh.fire).toHaveBeenCalled();
      });
    });

    describe("#getSessionID", function() {
      var time = 123;

      beforeEach(function () {
        $.cookie('WHSessionID','');
      });

      it('uses the cookie when present', function() {
        $.cookie('WHSessionID',111222);
        expect(wh.getSessionID(time)).toEqual('111222');
      });

      it('uses the time when cookie is null', function() {
        spyOn($, 'cookie').andReturn(null);
        expect(wh.getSessionID(time)).toEqual(time);
      });

      it('uses the time when cookie is undefined', function() {
        spyOn($, 'cookie').andReturn(undefined);
        expect(wh.getSessionID(time)).toEqual(time);
      });

      it('sets firstVisit to time when cookie is null', function() {
        spyOn($, 'cookie').andReturn(null);
        wh.getSessionID(time)
        expect(wh.firstVisit).toEqual(time);
      });
    });

    describe('#setOneTimeData', function() {
      it('records attributes', function() {
        once = {a: 'Apple', b: 'Banana'};
        wh.setOneTimeData(once);
        data = wh.getOneTimeData();
        expect(data.a).toEqual('Apple');
        expect(data.b).toEqual('Banana');
      });
    });

    describe("followHref", function() {
      it('defaults to true', function() {
        wh.init();
        expect(wh.followHref).toEqual(true);
      });

      it('overrides default with argument', function() {
        wh.init({followHref: false});
        expect(wh.followHref).toEqual(false);
      });
    });

    describe("#desktopOrMobile", function() {
      it('recognizes desktop', function() {
        expect(wh.desktopOrMobile(1025)).toEqual('kilo');
      });
      it('recognizes tablets', function() {
        expect(wh.desktopOrMobile(768)).toEqual('deca');
      });
     it('recognizes mobile', function() {
        expect(wh.desktopOrMobile(767)).toEqual('nano');
      });
    });

    describe("#determineReferrer", function() {
      beforeEach(function() {
        testDocument = $('<div></div>');
        testDocument.referrer = "rawr";
        testWindow = $('<div></div>');
        testWindow.location = {
          href: ""
        };
      });

      it('should use real_referrer when use_real_referrer is true', function() {
        $.cookie('real_referrer', 'woof');
        testWindow.location.href = "http://www.rentpathsite.com/?use_real_referrer=true"
        expect(wh.determineReferrer(testDocument, testWindow)).toEqual("woof");
      });

      it('should use document.referrer when use_real_referrer is false', function() {
        $.cookie('real_referrer', 'woof');
        testWindow.location.href = "http://www.rentpathsite.com/?use_real_referrer=false"
        expect(wh.determineReferrer(testDocument, testWindow)).toEqual("rawr");
      });
    });

    describe("#replaceDoubleByteChars", function() {
      it('should replace double-byte chars', function() {
        wh.init();
        expect(wh.replaceDoubleByteChars("Download Android™ App©")).toEqual("Download Android(tm) App(c)");
      });
    });

    describe('#eventHandlers', function() {
      it('should set an instance variable for backwards compatibility', function() {
        wh.eventHandlers({});
        expect(wh.clickHandler).toBeDefined();
      });
    });
  });
});
