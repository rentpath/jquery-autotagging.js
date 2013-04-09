
define(['jquery', 'common/events', 'common/utils', 'third-party/storage-polyfill'], function($, events, utils) {
  var _read, _write;
  _read = function(key) {
    var data, value;
    data = localStorage.getItem(key);
    return value = data != null ? JSON.parse(data) : null;
  };
  _write = function(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  };
  return {
    track: function() {
      var data, key, record;
      key = window.location.pathname;
      data = utils.getPageInfo();
      record = _read(key);
      if (record != null) {
        record['count']++;
        _write(key, record);
      } else {
        record = data;
        record['count'] = 1;
        _write(key, record);
      }
      return record;
    },
    save: function(item, value) {
      var data, key, record;
      key = window.location.pathname;
      data = utils.getPageInfo(key);
      record = _read(key);
      if (record != null) {
        record[item] = value;
        _write(key, record);
      } else {
        record = data;
        record[item] = value;
        _write(key, record);
      }
      return record;
    },
    peek: function(item) {
      var v;
      v = _read(window.location.pathname);
      if (v[item] != null) {
        return parseInt(v[item]);
      } else {
        return 0;
      }
    },
    number_of_visits: function() {
      var v;
      v = _read(window.location.pathname).count;
      if (v != null) {
        return parseInt(v);
      } else {
        return 0;
      }
    },
    refinements: function() {
      return _read(window.location.pathname).nodes;
    },
    number_of_refinements: function() {
      var r;
      r = _read(window.location.pathname).nodes.length;
      if (r != null) {
        return parseInt(r);
      } else {
        return 0;
      }
    },
    type: function() {
      return _read(window.location.pathname).type;
    },
    searchType: function() {
      return _read(window.location.pathname).searchType;
    }
  };
});
