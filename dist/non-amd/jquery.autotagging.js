;(function() {
var browserdetect, click_handler, select_change_handler, WH;
browserdetect = function () {
  var BrowserDetect;
  return BrowserDetect = function () {
    function BrowserDetect() {
    }
    BrowserDetect.platform = function () {
      var browserName, browserVersion, os, result, versionLabel;
      os = BrowserDetect.searchString(BrowserDetect.dataOS()) || 'An unknown OS';
      result = BrowserDetect.searchString(BrowserDetect.dataBrowser());
      browserName = result.identity || 'An unknown browser';
      versionLabel = result.version;
      browserVersion = BrowserDetect.searchVersion(versionLabel, navigator.userAgent) || BrowserDetect.searchVersion(versionLabel, navigator.appVersion) || 'an unknown version';
      return {
        browser: browserName,
        version: browserVersion,
        OS: os.identity
      };
    };
    BrowserDetect.searchString = function (data) {
      var dataProp, dataString, datum, _i, _len;
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        datum = data[_i];
        dataString = typeof datum.string === 'undefined' ? null : datum.string;
        dataProp = typeof datum.prop === 'undefined' ? null : datum.prop;
        if (dataString) {
          if (dataString.indexOf(datum.subString) !== -1) {
            return {
              identity: datum.identity,
              version: datum.versionSearch || datum.identity
            };
          }
        } else if (dataProp) {
          return {
            identity: datum.identity,
            version: datum.versionSearch || datum.identity
          };
        }
      }
      return {
        identity: '',
        version: ''
      };
    };
    BrowserDetect.searchVersion = function (versionLabel, dataString) {
      var index;
      index = dataString.indexOf(versionLabel);
      if (index === -1) {
        return;
      }
      return parseFloat(dataString.substring(index + versionLabel.length + 1));
    };
    BrowserDetect.dataBrowser = function (data) {
      return data || [
        {
          string: navigator.userAgent,
          subString: 'Chrome',
          identity: 'Chrome'
        },
        {
          string: navigator.userAgent,
          subString: 'OmniWeb',
          versionSearch: 'OmniWeb/',
          identity: 'OmniWeb'
        },
        {
          string: navigator.vendor,
          subString: 'Apple',
          identity: 'Safari',
          versionSearch: 'Version'
        },
        {
          prop: window.opera,
          identity: 'Opera'
        },
        {
          string: navigator.vendor,
          subString: 'iCab',
          identity: 'iCab'
        },
        {
          string: navigator.vendor,
          subString: 'KDE',
          identity: 'Konqueror'
        },
        {
          string: navigator.userAgent,
          subString: 'Firefox',
          identity: 'Firefox'
        },
        {
          string: navigator.vendor,
          subString: 'Camino',
          identity: 'Camino'
        },
        {
          string: navigator.userAgent,
          subString: 'Netscape',
          identity: 'Netscape'
        },
        {
          string: navigator.userAgent,
          subString: 'MSIE',
          identity: 'Explorer',
          versionSearch: 'MSIE'
        },
        {
          string: navigator.userAgent,
          subString: 'Gecko',
          identity: 'Mozilla',
          versionSearch: 'rv'
        },
        {
          string: navigator.userAgent,
          subString: 'Mozilla',
          identity: 'Netscape',
          versionSearch: 'Mozilla'
        }
      ];
    };
    BrowserDetect.dataOS = function (data) {
      return data || [
        {
          string: navigator.platform,
          subString: 'Win',
          identity: 'Windows'
        },
        {
          string: navigator.platform,
          subString: 'Mac',
          identity: 'Mac'
        },
        {
          string: navigator.userAgent,
          subString: 'iPhone',
          identity: 'iPhone/iPod'
        },
        {
          string: navigator.platform,
          subString: 'Linux',
          identity: 'Linux'
        }
      ];
    };
    return BrowserDetect;
  }();
}();
var __bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  }, __indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item)
        return i;
    }
    return -1;
  };
click_handler = function ($) {
  var ClickHandler;
  ClickHandler = function () {
    function ClickHandler(wh, opts) {
      this.wh = wh;
      if (opts == null) {
        opts = {};
      }
      this.elemClicked = __bind(this.elemClicked, this);
      this.clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img';
      this.dataAttributePrefix = opts.dataAttributePrefix || 'autotag';
      if (opts.exclusions != null) {
        this.clickBindSelector = this.clickBindSelector.replace(/,\s+/g, ':not(' + opts.exclusions + '), ');
      }
    }
    ClickHandler.prototype.bind = function (elem) {
      return $(elem).on('click', this.clickBindSelector, this.elemClicked);
    };
    ClickHandler.prototype._shouldRedirect = function (href) {
      return href != null && href.indexOf != null && href.indexOf('javascript:') === -1;
    };
    ClickHandler.prototype._followHrefConfigured = function (event, options, wh) {
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
    ClickHandler.prototype._setDocumentLocation = function (href) {
      return document.location = href;
    };
    ClickHandler.prototype._openNewWindow = function (href) {
      return window.open(href);
    };
    ClickHandler.prototype.elemClicked = function (e, options) {
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
      value = this.wh.replaceDoubleByteChars(jQTarget.data('' + this.dataAttributePrefix + '-value') || jQTarget.text()) || '';
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
      getClosestAttr = function (attr) {
        return jQTarget.attr(attr) || jQTarget.closest('a').attr(attr);
      };
      href = getClosestAttr('href');
      target = getClosestAttr('target');
      if (this._followHrefConfigured(e, options, this.wh) && this._shouldRedirect(href)) {
        e.preventDefault();
        if (target === '_blank') {
          this._openNewWindow(href);
        } else {
          trackingData.afterFireCallback = function (_this) {
            return function () {
              return _this._setDocumentLocation(href);
            };
          }(this);
        }
      }
      this.wh.fire(trackingData);
      return e.stopPropagation();
    };
    return ClickHandler;
  }();
  return ClickHandler;
}(jQuery);
var __bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  }, __indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item)
        return i;
    }
    return -1;
  };
select_change_handler = function ($) {
  var SelectChangeHandler;
  SelectChangeHandler = function () {
    function SelectChangeHandler(wh) {
      this.wh = wh;
      this.recordChange = __bind(this.recordChange, this);
    }
    SelectChangeHandler.prototype.bind = function (doc) {
      return $(doc).on('change', 'select', this.recordChange);
    };
    SelectChangeHandler.prototype.recordChange = function (evt) {
      var $target, attributes, domTarget;
      domTarget = evt.target;
      attributes = domTarget.attributes;
      $target = $(evt.target);
      this.wh.fire(this.trackingData(evt, $target, attributes, this.wh), $target);
      return evt.stopPropagation();
    };
    SelectChangeHandler.prototype.item = function ($target, wh) {
      return this.value($target, wh);
    };
    SelectChangeHandler.prototype.subgroup = function ($target, wh) {
      return wh.getSubgroupId($target) || '';
    };
    SelectChangeHandler.prototype.value = function ($target, wh) {
      var value;
      value = $target.find(':selected').val();
      return wh.replaceDoubleByteChars(value) || '';
    };
    SelectChangeHandler.prototype.text = function ($target, wh) {
      var text;
      text = $target.find(':selected').text();
      return wh.replaceDoubleByteChars(text);
    };
    SelectChangeHandler.prototype.trackingData = function (evt, $target, attributes, wh) {
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
  }();
  return SelectChangeHandler;
}(jQuery);
var __bind = function (fn, me) {
  return function () {
    return fn.apply(me, arguments);
  };
};
WH = function ($, browserdetect, ClickEventHandler, SelectChangeHandler) {
  return new (function () {
    var DESKTOP_WIDTH, MOBILE_WIDTH;
    function _Class() {
      this.obj2query = __bind(this.obj2query, this);
      this.firedTime = __bind(this.firedTime, this);
      this.fire = __bind(this.fire, this);
      this.elemClicked = __bind(this.elemClicked, this);
      this.clearOneTimeData = __bind(this.clearOneTimeData, this);
      this.init = __bind(this.init, this);
    }
    _Class.prototype.WH_SESSION_ID = 'WHSessionID';
    _Class.prototype.WH_LAST_ACCESS_TIME = 'WHLastAccessTime';
    _Class.prototype.WH_USER_ID = 'WHUserID';
    _Class.prototype.THIRTY_MINUTES_IN_MS = 30 * 60 * 1000;
    _Class.prototype.TEN_YEARS_IN_DAYS = 3650;
    MOBILE_WIDTH = 768;
    DESKTOP_WIDTH = 1023;
    _Class.prototype.cacheBuster = 0;
    _Class.prototype.domain = '';
    _Class.prototype.firstVisit = null;
    _Class.prototype.metaData = null;
    _Class.prototype.oneTimeData = null;
    _Class.prototype.path = '';
    _Class.prototype.performance = window.performance || {};
    _Class.prototype.sessionID = '';
    _Class.prototype.userID = '';
    _Class.prototype.warehouseTag = null;
    _Class.prototype.charMap = {
      8482: '(tm)',
      169: '(c)',
      174: '(r)'
    };
    _Class.prototype.init = function (opts) {
      var handler, _i, _len, _ref, _results;
      if (opts == null) {
        opts = {};
      }
      this.domain = document.location.host;
      this.setSiteVersion(opts);
      this.exclusionList = opts.exclusionList || [];
      this.fireCallback = opts.fireCallback;
      this.path = '' + document.location.pathname + document.location.search;
      this.warehouseURL = opts.warehouseURL;
      this.opts = opts;
      this.followHref = opts.followHref != null ? opts.followHref : true;
      this.setCookies();
      this.determineDocumentDimensions(document);
      this.determineWindowDimensions(window);
      this.determinePlatform(window);
      opts.metaData || (opts.metaData = {});
      $.extend(opts.metaData, this.getDataFromMetaTags(document));
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
    _Class.prototype.clearOneTimeData = function () {
      return this.oneTimeData = void 0;
    };
    _Class.prototype.getSubgroupId = function (elem) {
      var closestId;
      closestId = elem.closest('[id]').attr('id');
      return closestId || null;
    };
    _Class.prototype.determineWindowDimensions = function (obj) {
      obj = $(obj);
      return this.windowDimensions = '' + obj.width() + 'x' + obj.height();
    };
    _Class.prototype.determineDocumentDimensions = function (obj) {
      obj = $(obj);
      return this.browserDimensions = '' + obj.width() + 'x' + obj.height();
    };
    _Class.prototype.determinePlatform = function (win) {
      return this.platform = browserdetect.platform(win);
    };
    _Class.prototype.determineReferrer = function (doc, win) {
      if (win.location.href.match(/\?use_real_referrer\=true/)) {
        return $.cookie('real_referrer');
      } else {
        return doc.referrer;
      }
    };
    _Class.prototype.elemClicked = function (e, options) {
      if (options == null) {
        options = {};
      }
      return this.clickHandler.elemClicked(e, options);
    };
    _Class.prototype.setSiteVersion = function (opts) {
      if (opts.metaData) {
        return this.siteVersion = '' + (opts.metaData.site_version || this.domain) + '_' + this.deviceType();
      } else {
        return this.siteVersion = '' + this.domain + '_' + this.deviceType();
      }
    };
    _Class.prototype.deviceType = function () {
      return this.device || (this.device = this.desktopOrMobile());
    };
    _Class.prototype.desktopOrMobile = function (deviceWidth) {
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
    _Class.prototype.desktop = function (deviceWidth) {
      return deviceWidth > DESKTOP_WIDTH;
    };
    _Class.prototype.tablet = function (deviceWidth) {
      return deviceWidth >= MOBILE_WIDTH && deviceWidth <= DESKTOP_WIDTH;
    };
    _Class.prototype.mobile = function (deviceWidth) {
      return deviceWidth < MOBILE_WIDTH;
    };
    _Class.prototype.fire = function (obj, $element) {
      var key;
      obj.ft = this.firedTime();
      obj.cb = this.cacheBuster++;
      obj.sess = '' + this.userID + '.' + this.sessionID;
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
      if (typeof this.fireCallback === 'function') {
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
      return this.obj2query($.extend(obj, this.metaData), function (_this) {
        return function (query) {
          var requestURL;
          requestURL = _this.warehouseURL + query;
          if (requestURL.length > 2048 && navigator.userAgent.indexOf('MSIE') >= 0) {
            requestURL = requestURL.substring(0, 2043) + '&tu=1';
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
          _this.warehouseTag.unbind('load').load(function () {
            return $element.trigger('WH_pixel_success_' + obj.type);
          });
          _this.warehouseTag.unbind('error').error(function () {
            return $element.trigger('WH_pixel_error_' + obj.type);
          });
          if (obj.afterFireCallback) {
            _this.warehouseTag.unbind('load').unbind('error').bind('load', obj.afterFireCallback).bind('error', obj.afterFireCallback);
          }
          return _this.warehouseTag[0].src = requestURL;
        };
      }(this));
    };
    _Class.prototype.firedTime = function () {
      var now;
      now = this.performance.now || this.performance.webkitNow || this.performance.msNow || this.performance.oNow || this.performance.mozNow;
      return now != null && now.call(this.performance) || new Date().getTime();
    };
    _Class.prototype.firePageViewTag = function (options) {
      if (options == null) {
        options = {};
      }
      options.type = 'pageview';
      return this.fire(options);
    };
    _Class.prototype.getItemId = function (elem) {
      return elem.attr('id') || this.firstClass(elem);
    };
    _Class.prototype.firstClass = function (elem) {
      var klasses;
      if (!(klasses = elem.attr('class'))) {
        return;
      }
      return klasses.split(' ')[0];
    };
    _Class.prototype.getDataFromMetaTags = function (obj) {
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
    _Class.prototype.getOneTimeData = function () {
      return this.oneTimeData;
    };
    _Class.prototype.sort_order_array = [
      'site',
      'site_version',
      'firstvisit',
      'tu',
      'cg',
      'listingid',
      'dpg',
      'type',
      'sg',
      'item',
      'value',
      'ssSiteName',
      'ssTestName',
      'ssVariationGroupName',
      'spg',
      'lpp',
      'path',
      'logged_in',
      'ft'
    ];
    _Class.prototype.setTagOrder = function (obj) {
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
    _Class.prototype.obj2query = function (obj, cb) {
      var elem, key, rv, tag_order, val;
      tag_order = this.setTagOrder(obj);
      rv = [];
      for (elem in tag_order) {
        key = tag_order[elem];
        if (obj.hasOwnProperty(key) && (val = obj[key]) != null) {
          rv.push('&' + key + '=' + encodeURIComponent(val));
        }
      }
      cb(rv.join('').replace(/^&/, '?'));
    };
    _Class.prototype.getSessionID = function (currentTime) {
      if ($.cookie(this.WH_SESSION_ID) != null) {
        return $.cookie(this.WH_SESSION_ID);
      } else {
        this.firstVisit = currentTime;
        return this.firstVisit;
      }
    };
    _Class.prototype.setCookies = function () {
      var sessionID, timestamp, userID;
      userID = $.cookie(this.WH_USER_ID);
      timestamp = new Date().getTime();
      if (!userID) {
        userID = timestamp;
        $.cookie(this.WH_USER_ID, userID, {
          expires: this.TEN_YEARS_IN_DAYS,
          path: '/'
        });
      }
      sessionID = this.getSessionID(timestamp);
      $.cookie(this.WH_SESSION_ID, sessionID, { path: '/' });
      $.cookie(this.WH_LAST_ACCESS_TIME, timestamp, { path: '/' });
      this.sessionID = sessionID;
      return this.userID = userID;
    };
    _Class.prototype.setOneTimeData = function (obj) {
      var key, _results;
      this.oneTimeData || (this.oneTimeData = {});
      _results = [];
      for (key in obj) {
        _results.push(this.oneTimeData[key] = obj[key]);
      }
      return _results;
    };
    _Class.prototype.replaceDoubleByteChars = function (str) {
      var char, result;
      result = function () {
        var _i, _len, _ref, _results;
        _ref = str.split('');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          char = _ref[_i];
          _results.push(this.charMap[char.charCodeAt(0)] || char);
        }
        return _results;
      }.call(this);
      return result.join('');
    };
    _Class.prototype.eventHandlers = function (options) {
      var selectChangeHandler;
      this.clickHandler = new ClickEventHandler(this, options);
      selectChangeHandler = new SelectChangeHandler(this);
      return [
        this.clickHandler,
        selectChangeHandler
      ];
    };
    return _Class;
  }())();
}(jQuery, browserdetect, click_handler, select_change_handler);
window.WH = WH;
}());