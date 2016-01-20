var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(['jquery', './text_formatter'], function($, textFormatter) {
  var SelectChangeHandler;
  SelectChangeHandler = (function() {
    var textData;

    textData = function($target) {
      var text;
      text = $target.find(':selected').text();
      return textFormatter.replaceDoubleByteChars(text);
    };

    function SelectChangeHandler(wh, finder) {
      this.wh = wh;
      this.finder = finder;
      this.recordChange = bind(this.recordChange, this);
    }

    SelectChangeHandler.prototype.bind = function(doc) {
      return $(doc).on('change', 'select', this.recordChange);
    };

    SelectChangeHandler.prototype.recordChange = function(evt) {
      var $target, attributes, domTarget;
      domTarget = evt.target;
      attributes = domTarget.attributes;
      $target = $(evt.target);
      this.wh.fire(this.trackingData(evt, $target, attributes), $target);
      return evt.stopPropagation();
    };

    SelectChangeHandler.prototype.trackingData = function(evt, $target, attributes) {
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

  })();
  return SelectChangeHandler;
});
