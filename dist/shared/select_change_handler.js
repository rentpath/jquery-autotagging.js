var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(['jquery'], function($) {
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
