var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(['jquery'], function($) {
  var ClickHandler;
  ClickHandler = (function() {
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
        this.clickBindSelector = this.clickBindSelector.replace(/,\s+/g, ":not(" + opts.exclusions + "), ");
      }
    }

    ClickHandler.prototype.bind = function(elem) {
      return $(elem).on('click', this.clickBindSelector, this.elemClicked);
    };

    ClickHandler.prototype.elemClicked = function(evt) {
      var $target, attr, i, len, realName, ref, ref1, trackingData;
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

  })();
  return ClickHandler;
});
