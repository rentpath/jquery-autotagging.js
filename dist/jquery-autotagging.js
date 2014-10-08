(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('click-handler',['jquery'], function($) {
    var ClickHandler;
    ClickHandler = (function() {
      function ClickHandler(wh, opts) {
        this.wh = wh;
        if (opts == null) {
          opts = {};
        }
        this.elemClicked = __bind(this.elemClicked, this);
        this.clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img';
        if (opts.exclusions != null) {
          this.clickBindSelector = this.clickBindSelector.replace(/,\s+/g, ":not(" + opts.exclusions + "), ");
        }
      }

      ClickHandler.prototype.bind = function(elem) {
        return $(elem).on('click', this.clickBindSelector, this.elemClicked);
      };

      ClickHandler.prototype._shouldRedirect = function(href) {
        return (href != null) && (href.indexOf != null) && href.indexOf('javascript:') === -1;
      };

      ClickHandler.prototype._followHrefConfigured = function(event, options, wh) {
        var _ref, _ref1;
        if ((event != null ? (_ref = event.data) != null ? _ref.followHref : void 0 : void 0) != null) {
          return event != null ? (_ref1 = event.data) != null ? _ref1.followHref : void 0 : void 0;
        } else if ((options != null ? options.followHref : void 0) != null) {
          return options != null ? options.followHref : void 0;
        } else if ((wh != null ? wh.followHref : void 0) != null) {
          return wh != null ? wh.followHref : void 0;
        } else {
          return false;
        }
      };

      ClickHandler.prototype._setDocumentLocation = function(href) {
        return document.location = href;
      };

      ClickHandler.prototype._openNewWindow = function(href) {
        return window.open(href);
      };

      ClickHandler.prototype.elemClicked = function(e, options) {
        var attr, attrs, domTarget, getClosestAttr, href, item, jQTarget, realName, subGroup, target, trackingData, value, _i, _len, _ref;
        if (options == null) {
          options = {};
        }
        domTarget = e.target;
        attrs = domTarget.attributes;
        jQTarget = $(e.target);
        if (!jQTarget.is(this.clickBindSelector)) {
          jQTarget = jQTarget.parent();
        }
        item = this.wh.getItemId(jQTarget) || '';
        subGroup = this.wh.getSubgroupId(jQTarget) || '';
        value = this.wh.replaceDoubleByteChars(jQTarget.text()) || '';
        trackingData = {
          sg: subGroup,
          item: item,
          value: value,
          type: 'click',
          x: e.clientX,
          y: e.clientY
        };
        for (_i = 0, _len = attrs.length; _i < _len; _i++) {
          attr = attrs[_i];
          if (attr.name.indexOf('data-') === 0 && (_ref = attr.name, __indexOf.call(this.wh.exclusionList, _ref) < 0)) {
            realName = attr.name.replace('data-', '');
            trackingData[realName] = attr.value;
          }
        }
        getClosestAttr = function(attr) {
          return jQTarget.attr(attr) || jQTarget.closest('a').attr(attr);
        };
        href = getClosestAttr('href');
        target = getClosestAttr('target');
        if (this._followHrefConfigured(e, options, this.wh) && this._shouldRedirect(href)) {
          e.preventDefault();
          if (target === "_blank") {
            this._openNewWindow(href);
          } else {
            trackingData.afterFireCallback = (function(_this) {
              return function() {
                return _this._setDocumentLocation(href);
              };
            })(this);
          }
        }
        this.wh.fire(trackingData);
        return e.stopPropagation();
      };

      return ClickHandler;

    })();
    return ClickHandler;
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define('select-change-handler',['jquery'], function($) {
    var SelectChangeHandler;
    SelectChangeHandler = (function() {
      function SelectChangeHandler(wh) {
        this.wh = wh;
        this.recordChange = __bind(this.recordChange, this);
      }

      SelectChangeHandler.prototype.bind = function(doc) {
        return $(doc).on('change', 'select', this.recordChange);
      };

      SelectChangeHandler.prototype.recordChange = function(evt) {
        var $target, attributes, domTarget;
        domTarget = evt.target;
        attributes = domTarget.attributes;
        $target = $(evt.target);
        this.wh.fire(this.trackingData(evt, $target, attributes, this.wh), $target);
        return evt.stopPropagation();
      };

      SelectChangeHandler.prototype.item = function($target, wh) {
        return this.value($target, wh);
      };

      SelectChangeHandler.prototype.subgroup = function($target, wh) {
        return wh.getSubgroupId($target) || '';
      };

      SelectChangeHandler.prototype.value = function($target, wh) {
        var value;
        value = $target.find(':selected').val();
        return wh.replaceDoubleByteChars(value) || '';
      };

      SelectChangeHandler.prototype.text = function($target, wh) {
        var text;
        text = $target.find(':selected').text();
        return wh.replaceDoubleByteChars(text);
      };

      SelectChangeHandler.prototype.trackingData = function(evt, $target, attributes, wh) {
        var attribute, data, realName, _i, _len, _ref;
        data = {
          sg: this.subgroup($target, wh),
          item: this.item($target, wh),
          value: this.value($target, wh),
          text: this.text($target, wh),
          type: 'change',
          x: evt.clientX,
          y: evt.clientY
        };
        for (_i = 0, _len = attributes.length; _i < _len; _i++) {
          attribute = attributes[_i];
          if (attribute.name.indexOf('data-') === 0 && (_ref = attribute.name, __indexOf.call(this.wh.exclusionList, _ref) < 0)) {
            realName = attribute.name.replace('data-', '');
            data[realName] = attribute.value;
          }
        }
        return data;
      };

      return SelectChangeHandler;

    })();
    return SelectChangeHandler;
  });

}).call(this);

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  define('jquery-autotagging',['jquery', 'browserdetect', 'underscore', 'click-handler', 'select-change-handler', 'jquery.cookie'], function($, browserdetect, _, ClickEventHandler, SelectChangeHandler) {
    var WH;
    return WH = (function() {
      var DESKTOP_WIDTH, MOBILE_WIDTH;

      function WH() {
        this.obj2query = __bind(this.obj2query, this);
        this.firedTime = __bind(this.firedTime, this);
        this.fire = __bind(this.fire, this);
        this.elemClicked = __bind(this.elemClicked, this);
        this.clearOneTimeData = __bind(this.clearOneTimeData, this);
        this.init = __bind(this.init, this);
      }

      WH.prototype.WH_SESSION_ID = 'WHSessionID';

      WH.prototype.WH_LAST_ACCESS_TIME = 'WHLastAccessTime';

      WH.prototype.WH_USER_ID = 'WHUserID';

      WH.prototype.THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;

      WH.prototype.TEN_YEARS_IN_DAYS = 3650;

      MOBILE_WIDTH = 768;

      DESKTOP_WIDTH = 1023;

      WH.prototype.cacheBuster = 0;

      WH.prototype.domain = '';

      WH.prototype.firstVisit = null;

      WH.prototype.metaData = null;

      WH.prototype.oneTimeData = null;

      WH.prototype.path = '';

      WH.prototype.performance = window.performance || {};

      WH.prototype.sessionID = '';

      WH.prototype.userID = '';

      WH.prototype.warehouseTag = null;

      WH.prototype.charMap = {
        8482: '(tm)',
        169: '(c)',
        174: '(r)'
      };

      WH.prototype.init = function(opts) {
        var handler, _i, _len, _ref, _results;
        if (opts == null) {
          opts = {};
        }
        this.domain = document.location.host;
        this.setSiteVersion(opts);
        this.exclusionList = opts.exclusionList || [];
        this.fireCallback = opts.fireCallback;
        this.path = "" + document.location.pathname + document.location.search;
        this.warehouseURL = opts.warehouseURL;
        this.opts = opts;
        this.followHref = opts.followHref != null ? opts.followHref : true;
        this.setCookies();
        this.determineDocumentDimensions(document);
        this.determineWindowDimensions(window);
        this.determinePlatform(window);
        opts.metaData || (opts.metaData = {});
        _.extend(opts.metaData, this.getDataFromMetaTags(document));
        this.metaData = opts.metaData;
        this.firePageViewTag();
        _ref = this.eventHandlers(opts);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          handler = _ref[_i];
          _results.push(handler.bind(document));
        }
        return _results;
      };

      WH.prototype.clearOneTimeData = function() {
        return this.oneTimeData = void 0;
      };

      WH.prototype.getSubgroupId = function(elem) {
        var closestId;
        closestId = elem.closest('[id]').attr('id');
        return closestId || null;
      };

      WH.prototype.determineWindowDimensions = function(obj) {
        obj = $(obj);
        return this.windowDimensions = "" + (obj.width()) + "x" + (obj.height());
      };

      WH.prototype.determineDocumentDimensions = function(obj) {
        obj = $(obj);
        return this.browserDimensions = "" + (obj.width()) + "x" + (obj.height());
      };

      WH.prototype.determinePlatform = function(win) {
        return this.platform = browserdetect.platform(win);
      };

      WH.prototype.determineReferrer = function(doc, win) {
        if (win.location.href.match(/\?use_real_referrer\=true/)) {
          return $.cookie('real_referrer');
        } else {
          return doc.referrer;
        }
      };

      WH.prototype.elemClicked = function(e, options) {
        if (options == null) {
          options = {};
        }
        return this.clickHandler.elemClicked(e, options);
      };

      WH.prototype.setSiteVersion = function(opts) {
        if (opts.metaData) {
          return this.siteVersion = "" + (opts.metaData.site_version || this.domain) + "_" + (this.deviceType());
        } else {
          return this.siteVersion = "" + this.domain + "_" + (this.deviceType());
        }
      };

      WH.prototype.deviceType = function() {
        return this.device || (this.device = this.desktopOrMobile());
      };

      WH.prototype.desktopOrMobile = function(deviceWidth) {
        if (deviceWidth == null) {
          deviceWidth = $(window).width();
        }
        switch (false) {
          case !this.desktop(deviceWidth):
            return 'kilo';
          case !this.tablet(deviceWidth):
            return 'deca';
          case !this.mobile(deviceWidth):
            return 'nano';
        }
      };

      WH.prototype.desktop = function(deviceWidth) {
        return deviceWidth > DESKTOP_WIDTH;
      };

      WH.prototype.tablet = function(deviceWidth) {
        return deviceWidth >= MOBILE_WIDTH && deviceWidth <= DESKTOP_WIDTH;
      };

      WH.prototype.mobile = function(deviceWidth) {
        return deviceWidth < MOBILE_WIDTH;
      };

      WH.prototype.fire = function(obj, $element) {
        var key;
        obj.ft = this.firedTime();
        obj.cb = this.cacheBuster++;
        obj.sess = "" + this.userID + "." + this.sessionID;
        obj.fpc = this.userID;
        obj.site = this.domain;
        obj.path = this.path;
        obj.title = $('title').text();
        obj.bs = this.windowDimensions;
        obj.sr = this.browserDimensions;
        obj.os = this.platform.OS;
        obj.browser = this.platform.browser;
        obj.ver = this.platform.version;
        obj.ref = obj.ref || this.determineReferrer(document, window);
        obj.registration = $.cookie('sgn') === '1' ? 1 : 0;
        if ($.cookie('sgn') != null) {
          obj.person_id = $.cookie('zid');
        }
        if ($.cookie('campaign_id') != null) {
          obj.campaign_id = $.cookie('campaign_id');
        }
        obj.site_version = this.siteVersion;
        if (obj.site_version != null) {
          this.metaData.site_version = obj.site_version;
        }
        if (obj.cg != null) {
          this.metaData.cg = obj.cg;
        }
        if (this.metaData.cg == null) {
          this.metaData.cg = '';
        }
        if (typeof this.fireCallback === "function") {
          this.fireCallback(obj);
        }
        if (this.oneTimeData != null) {
          for (key in this.oneTimeData) {
            obj[key] = this.oneTimeData[key];
          }
          this.clearOneTimeData();
        }
        if (this.firstVisit) {
          obj.firstVisit = this.firstVisit;
          this.firstVisit = null;
        }
        return this.obj2query($.extend(obj, this.metaData), (function(_this) {
          return function(query) {
            var requestURL;
            requestURL = _this.warehouseURL + query;
            if (requestURL.length > 2048 && navigator.userAgent.indexOf('MSIE') >= 0) {
              requestURL = requestURL.substring(0, 2043) + "&tu=1";
            }
            if (!_this.warehouseTag) {
              _this.warehouseTag = $('<img/>', {
                id: 'PRMWarehouseTag',
                border: '0',
                width: '1',
                height: '1'
              });
            }
            $element = $element || $('body');
            _this.warehouseTag.unbind('load').load(function() {
              return $element.trigger('WH_pixel_success_' + obj.type);
            });
            _this.warehouseTag.unbind('error').error(function() {
              return $element.trigger('WH_pixel_error_' + obj.type);
            });
            if (obj.afterFireCallback) {
              _this.warehouseTag.unbind('load').unbind('error').bind('load', obj.afterFireCallback).bind('error', obj.afterFireCallback);
            }
            return _this.warehouseTag[0].src = requestURL;
          };
        })(this));
      };

      WH.prototype.firedTime = function() {
        var now;
        now = this.performance.now || this.performance.webkitNow || this.performance.msNow || this.performance.oNow || this.performance.mozNow;
        return ((now != null) && now.call(this.performance)) || new Date().getTime();
      };

      WH.prototype.firePageViewTag = function(options) {
        if (options == null) {
          options = {};
        }
        options.type = 'pageview';
        return this.fire(options);
      };

      WH.prototype.getItemId = function(elem) {
        return elem.attr('id') || this.firstClass(elem);
      };

      WH.prototype.firstClass = function(elem) {
        var klasses;
        if (!(klasses = elem.attr('class'))) {
          return;
        }
        return klasses.split(' ')[0];
      };

      WH.prototype.getDataFromMetaTags = function(obj) {
        var metaTag, metas, name, retObj, _i, _len;
        retObj = {};
        metas = $(obj).find('meta');
        for (_i = 0, _len = metas.length; _i < _len; _i++) {
          metaTag = metas[_i];
          metaTag = $(metaTag);
          if (metaTag.attr('name') && metaTag.attr('name').indexOf('WH.') === 0) {
            name = metaTag.attr('name').replace('WH.', '');
            retObj[name] = metaTag.attr('content');
          }
        }
        return retObj;
      };

      WH.prototype.getOneTimeData = function() {
        return this.oneTimeData;
      };

      WH.prototype.sort_order_array = ["site", "site_version", "firstvisit", "tu", "cg", "listingid", "dpg", "type", "sg", "item", "value", "ssSiteName", "ssTestName", "ssVariationGroupName", "spg", "lpp", "path", "logged_in", "ft"];

      WH.prototype.setTagOrder = function(obj) {
        var elem, index, key, prop_key_array, result_array;
        prop_key_array = [];
        result_array = [];
        for (key in obj) {
          prop_key_array.push(key);
        }
        for (elem in this.sort_order_array) {
          index = $.inArray(this.sort_order_array[elem], prop_key_array);
          if (index > 0) {
            result_array.push(prop_key_array[index]);
            prop_key_array.splice(index, 1);
          }
        }
        result_array = result_array.concat(prop_key_array);
        return result_array;
      };

      WH.prototype.obj2query = function(obj, cb) {
        var elem, key, rv, tag_order, val;
        tag_order = this.setTagOrder(obj);
        rv = [];
        for (elem in tag_order) {
          key = tag_order[elem];
          if (obj.hasOwnProperty(key) && ((val = obj[key]) != null)) {
            rv.push("&" + key + "=" + (encodeURIComponent(val)));
          }
        }
        cb(rv.join('').replace(/^&/, '?'));
      };

      WH.prototype.getSessionID = function(currentTime) {
        if ($.cookie(this.WH_SESSION_ID) != null) {
          return $.cookie(this.WH_SESSION_ID);
        } else {
          this.firstVisit = currentTime;
          return this.firstVisit;
        }
      };

      WH.prototype.setCookies = function() {
        var sessionID, timestamp, userID;
        userID = $.cookie(this.WH_USER_ID);
        timestamp = (new Date()).getTime();
        if (!userID) {
          userID = timestamp;
          $.cookie(this.WH_USER_ID, userID, {
            expires: this.TEN_YEARS_IN_DAYS,
            path: '/'
          });
        }
        sessionID = this.getSessionID(timestamp);
        $.cookie(this.WH_SESSION_ID, sessionID, {
          path: '/'
        });
        $.cookie(this.WH_LAST_ACCESS_TIME, timestamp, {
          path: '/'
        });
        this.sessionID = sessionID;
        return this.userID = userID;
      };

      WH.prototype.setOneTimeData = function(obj) {
        var key, _results;
        this.oneTimeData || (this.oneTimeData = {});
        _results = [];
        for (key in obj) {
          _results.push(this.oneTimeData[key] = obj[key]);
        }
        return _results;
      };

      WH.prototype.replaceDoubleByteChars = function(str) {
        var char, result;
        result = (function() {
          var _i, _len, _ref, _results;
          _ref = str.split('');
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            char = _ref[_i];
            _results.push(this.charMap[char.charCodeAt(0)] || char);
          }
          return _results;
        }).call(this);
        return result.join('');
      };

      WH.prototype.eventHandlers = function(options) {
        var selectChangeHandler;
        this.clickHandler = new ClickEventHandler(this, options);
        selectChangeHandler = new SelectChangeHandler(this);
        return [this.clickHandler, selectChangeHandler];
      };

      return WH;

    })();
  });

}).call(this);

