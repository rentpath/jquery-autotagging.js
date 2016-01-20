;(function() {
var browser_detect, jquery_autotagging_click_handler, jquery_autotagging_text_formatter, jquery_autotagging_select_change_handler, jquery_autotagging_data_with_data_attributes, jquery_autotagging_click_data_without_data_attributes, jquery_autotagging_select_data_without_data_attributes, jquerycookie, jquery_autotagging_jqueryautotagging, jquery_autotagging;
browser_detect = function () {
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
      var dataProp, dataString, datum, i, len;
      for (i = 0, len = data.length; i < len; i++) {
        datum = data[i];
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
    BrowserDetect.isExplorer = function () {
      return this.platform().browser === 'explorer';
    };
    BrowserDetect.isExplorer8 = function () {
      return this.isExplorer() && this.platform().version === '8.0';
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
var bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  }, indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item)
        return i;
    }
    return -1;
  };
jquery_autotagging_click_handler = function ($) {
  var ClickHandler;
  ClickHandler = function () {
    function ClickHandler(wh, finder, opts) {
      this.wh = wh;
      this.finder = finder;
      if (opts == null) {
        opts = {};
      }
      this.elemClicked = bind(this.elemClicked, this);
      this.clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img';
      this.dataAttributePrefix = opts.dataAttributePrefix || 'autotag';
      if (opts.exclusions != null) {
        this.clickBindSelector = this.clickBindSelector.replace(/,\s+/g, ':not(' + opts.exclusions + '), ');
      }
    }
    ClickHandler.prototype.bind = function (elem) {
      return $(elem).on('click', this.clickBindSelector, this.elemClicked);
    };
    ClickHandler.prototype.elemClicked = function (evt, options) {
      var $target, attr, i, len, realName, ref, ref1, trackingData;
      if (options == null) {
        options = {};
      }
      $target = $(evt.target);
      if (!$target.is(this.clickBindSelector)) {
        $target = $target.parent();
      }
      trackingData = {
        sg: this.finder.subgroup($target),
        item: this.finder.item($target),
        value: this.finder.value($target, this.dataAttributePrefix),
        type: 'click',
        x: evt.clientX,
        y: evt.clientY
      };
      ref = evt.target.attributes;
      for (i = 0, len = ref.length; i < len; i++) {
        attr = ref[i];
        if (attr.name.indexOf('data-') === 0 && (ref1 = attr.name, indexOf.call(this.wh.exclusionList, ref1) < 0)) {
          realName = attr.name.replace('data-', '');
          trackingData[realName] = attr.value;
        }
      }
      return this.wh.fire(trackingData);
    };
    return ClickHandler;
  }();
  return ClickHandler;
}(jQuery);
jquery_autotagging_text_formatter = function () {
  var charMap;
  charMap = {
    8482: '(tm)',
    169: '(c)',
    174: '(r)'
  };
  return {
    replaceDoubleByteChars: function (str) {
      var char, result;
      result = function () {
        var i, len, ref, results;
        ref = str.split('');
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          char = ref[i];
          results.push(charMap[char.charCodeAt(0)] || char);
        }
        return results;
      }();
      return result.join('');
    }
  };
}();
var bind = function (fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  }, indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item)
        return i;
    }
    return -1;
  };
jquery_autotagging_select_change_handler = function ($, textFormatter) {
  var SelectChangeHandler;
  SelectChangeHandler = function () {
    var textData;
    textData = function ($target) {
      var text;
      text = $target.find(':selected').text();
      return textFormatter.replaceDoubleByteChars(text);
    };
    function SelectChangeHandler(wh, finder) {
      this.wh = wh;
      this.finder = finder;
      this.recordChange = bind(this.recordChange, this);
    }
    SelectChangeHandler.prototype.bind = function (doc) {
      return $(doc).on('change', 'select', this.recordChange);
    };
    SelectChangeHandler.prototype.recordChange = function (evt) {
      var $target, attributes, domTarget;
      domTarget = evt.target;
      attributes = domTarget.attributes;
      $target = $(evt.target);
      this.wh.fire(this.trackingData(evt, $target, attributes), $target);
      return evt.stopPropagation();
    };
    SelectChangeHandler.prototype.trackingData = function (evt, $target, attributes) {
      var attribute, data, i, len, realName, ref;
      data = {
        sg: this.finder.subgroup($target),
        item: this.finder.item($target),
        value: this.finder.value($target),
        text: textData($target),
        type: 'change',
        x: evt.clientX,
        y: evt.clientY
      };
      for (i = 0, len = attributes.length; i < len; i++) {
        attribute = attributes[i];
        if (attribute.name.indexOf('data-') === 0 && (ref = attribute.name, indexOf.call(this.wh.exclusionList, ref) < 0)) {
          realName = attribute.name.replace('data-', '');
          data[realName] = attribute.value;
        }
      }
      return data;
    };
    return SelectChangeHandler;
  }();
  return SelectChangeHandler;
}(jQuery, jquery_autotagging_text_formatter);
jquery_autotagging_data_with_data_attributes = function ($) {
  return function (itemDataAttribute, sectionDataAttribute) {
    var isInput, isSelect;
    isSelect = function (node) {
      return node.nodeName === 'SELECT';
    };
    isInput = function (node) {
      return isSelect(node) || node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA';
    };
    return {
      value: function (node) {
        var text;
        if (isInput(node)) {
          text = node.value;
        } else if ($(node).children().length) {
          text = $(node).filter(':visible').text();
        } else {
          text = $(node).text();
        }
        return (text || '').substring(0, 100);
      },
      subgroup: function ($elem) {
        return $elem.closest('[' + sectionDataAttribute + ']').attr(sectionDataAttribute) || '';
      },
      item: function ($elem) {
        return $elem.attr(itemDataAttribute) || '';
      }
    };
  };
}(jQuery);
jquery_autotagging_click_data_without_data_attributes = function ($, textFormatter) {
  var firstClass;
  firstClass = function ($elem) {
    var klasses;
    if (!(klasses = $elem.attr('class'))) {
      return;
    }
    return klasses.split(' ')[0];
  };
  return {
    value: function ($target, dataAttributePrefix) {
      var string;
      string = $target.data(dataAttributePrefix + '-value') || $target.text();
      return textFormatter.replaceDoubleByteChars(string);
    },
    subgroup: function ($elem) {
      return $elem.closest('[id]').attr('id') || '';
    },
    item: function ($elem) {
      return $elem.attr('id') || firstClass($elem) || '';
    }
  };
}(jQuery, jquery_autotagging_text_formatter);
jquery_autotagging_select_data_without_data_attributes = function ($, textFormatter) {
  return {
    subgroup: function ($elem) {
      return $elem.closest('[id]').attr('id') || '';
    },
    item: function ($elem) {
      var value;
      value = $elem.find(':selected').val() || '';
      return textFormatter.replaceDoubleByteChars(value);
    },
    value: function ($elem) {
      var value;
      value = $elem.find(':selected').val() || '';
      return textFormatter.replaceDoubleByteChars(value);
    },
    text: function ($target) {
      var text;
      text = $target.find(':selected').text();
      return textFormatter.replaceDoubleByteChars(text);
    }
  };
}(jQuery, jquery_autotagging_text_formatter);
/*!
 * jQuery Cookie Plugin v1.4.0
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
  if (true) {
    jquerycookie = function (jQuery) {
      return typeof factory === 'function' ? factory(jQuery) : factory;
    }(jQuery);
  } else {
    // Browser globals.
    factory(jQuery);
  }
}(function ($) {
  var pluses = /\+/g;
  function encode(s) {
    return config.raw ? s : encodeURIComponent(s);
  }
  function decode(s) {
    return config.raw ? s : decodeURIComponent(s);
  }
  function stringifyCookieValue(value) {
    return encode(config.json ? JSON.stringify(value) : String(value));
  }
  function parseCookieValue(s) {
    if (s.indexOf('"') === 0) {
      // This is a quoted cookie as according to RFC2068, unescape...
      s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }
    try {
      // Replace server-side written pluses with spaces.
      // If we can't decode the cookie, ignore it, it's unusable.
      s = decodeURIComponent(s.replace(pluses, ' '));
    } catch (e) {
      return;
    }
    try {
      // If we can't parse the cookie, ignore it, it's unusable.
      return config.json ? JSON.parse(s) : s;
    } catch (e) {
    }
  }
  function read(s, converter) {
    var value = config.raw ? s : parseCookieValue(s);
    return $.isFunction(converter) ? converter(value) : value;
  }
  var config = $.cookie = function (key, value, options) {
    // Write
    if (value !== undefined && !$.isFunction(value)) {
      options = $.extend({}, config.defaults, options);
      if (typeof options.expires === 'number') {
        var days = options.expires, t = options.expires = new Date();
        t.setDate(t.getDate() + days);
      }
      return document.cookie = [
        encode(key),
        '=',
        stringifyCookieValue(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '',
        // use expires attribute, max-age is not supported by IE
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
      ].join('');
    }
    // Read
    var result = key ? undefined : {};
    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all. Also prevents odd result when
    // calling $.cookie().
    var cookies = document.cookie ? document.cookie.split('; ') : [];
    for (var i = 0, l = cookies.length; i < l; i++) {
      var parts = cookies[i].split('=');
      var name = decode(parts.shift());
      var cookie = parts.join('=');
      if (key && key === name) {
        // If second argument (value) is a function it's a converter...
        result = read(cookie, value);
        break;
      }
      // Prevent storing a cookie that we couldn't decode.
      if (!key && (cookie = read(cookie)) !== undefined) {
        result[name] = cookie;
      }
    }
    return result;
  };
  config.defaults = {};
  $.removeCookie = function (key, options) {
    if ($.cookie(key) !== undefined) {
      // Must not alter options, thus extending a fresh object...
      $.cookie(key, '', $.extend({}, options, { expires: -1 }));
      return true;
    }
    return false;
  };
}));
var bind = function (fn, me) {
  return function () {
    return fn.apply(me, arguments);
  };
};
jquery_autotagging_jqueryautotagging = function ($, browserdetect, ClickEventHandler, SelectChangeHandler, dataWithDataAttributes, clickDataWithoutDataAttributes, selectDataWithoutDataAttributes) {
  return function () {
    var DESKTOP_WIDTH, MOBILE_WIDTH;
    function _Class() {
      this.obj2query = bind(this.obj2query, this);
      this.firedTime = bind(this.firedTime, this);
      this.fire = bind(this.fire, this);
      this.elemClicked = bind(this.elemClicked, this);
      this.clearOneTimeData = bind(this.clearOneTimeData, this);
      this.init = bind(this.init, this);
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
    _Class.prototype.init = function (opts) {
      var handler, i, itemDataAttribute, len, ref, results, sectionDataAttribute, useDataTags;
      if (opts == null) {
        opts = {};
      }
      this.domain = document.location.host;
      this.setSiteVersion(opts);
      this.exclusionList = opts.exclusionList || [];
      this.fireCallback = opts.fireCallback;
      this.path = '' + document.location.pathname + document.location.search;
      this.warehouseURL = opts.warehouseURL;
      this.followHref = opts.followHref != null ? opts.followHref : true;
      useDataTags = opts.useDataTags || false;
      itemDataAttribute = opts.itemDataAttribute;
      sectionDataAttribute = opts.sectionDataAttribute;
      if (useDataTags) {
        this.clickFinder = dataWithDataAttributes(itemDataAttribute, sectionDataAttribute);
        this.selectFinder = this.clickFinder;
      } else {
        this.clickFinder = clickDataWithoutDataAttributes;
        this.selectFinder = selectDataWithoutDataAttributes;
      }
      this.setCookies();
      this.determineDocumentDimensions(document);
      this.determineWindowDimensions(window);
      this.determinePlatform(window);
      opts.metaData || (opts.metaData = {});
      $.extend(opts.metaData, this.getDataFromMetaTags(document));
      this.metaData = opts.metaData;
      this.firePageViewTag();
      ref = this.eventHandlers(opts);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        handler = ref[i];
        results.push(handler.bind(document));
      }
      return results;
    };
    _Class.prototype.clearOneTimeData = function () {
      return this.oneTimeData = void 0;
    };
    _Class.prototype.determineWindowDimensions = function (obj) {
      obj = $(obj);
      return this.windowDimensions = obj.width() + 'x' + obj.height();
    };
    _Class.prototype.determineDocumentDimensions = function (obj) {
      obj = $(obj);
      return this.browserDimensions = obj.width() + 'x' + obj.height();
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
        return this.siteVersion = (opts.metaData.site_version || this.domain) + '_' + this.deviceType();
      } else {
        return this.siteVersion = this.domain + '_' + this.deviceType();
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
      obj.sess = this.userID + '.' + this.sessionID;
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
          var requestURL, warehouseTag;
          requestURL = _this.warehouseURL + query;
          if (requestURL.length > 2048 && navigator.userAgent.indexOf('MSIE') >= 0) {
            requestURL = requestURL.substring(0, 2043) + '&tu=1';
          }
          warehouseTag = document.createElement('img');
          warehouseTag.setAttribute('src', requestURL);
          document.body.appendChild(warehouseTag);
          return typeof obj.afterFireCallback === 'function' ? obj.afterFireCallback() : void 0;
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
    _Class.prototype.getDataFromMetaTags = function (obj) {
      var i, len, metaTag, metas, name, retObj;
      retObj = {};
      metas = $(obj).find('meta');
      for (i = 0, len = metas.length; i < len; i++) {
        metaTag = metas[i];
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
      var key, results;
      this.oneTimeData || (this.oneTimeData = {});
      results = [];
      for (key in obj) {
        results.push(this.oneTimeData[key] = obj[key]);
      }
      return results;
    };
    _Class.prototype.eventHandlers = function (options) {
      var selectChangeHandler;
      this.clickHandler = new ClickEventHandler(this, this.clickFinder, options);
      selectChangeHandler = new SelectChangeHandler(this, this.selectFinder);
      return [
        this.clickHandler,
        selectChangeHandler
      ];
    };
    return _Class;
  }();
}(jQuery, browser_detect, jquery_autotagging_click_handler, jquery_autotagging_select_change_handler, jquery_autotagging_data_with_data_attributes, jquery_autotagging_click_data_without_data_attributes, jquery_autotagging_select_data_without_data_attributes);
jquery_autotagging = function (main) {
  return main;
}(jquery_autotagging_jqueryautotagging);
window.jquery_autotagging = jquery_autotagging;
}());