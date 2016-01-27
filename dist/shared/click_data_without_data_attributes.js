define(['jquery', './text_formatter'], function($, textFormatter) {
  var firstClass;
  firstClass = function($elem) {
    var klasses;
    if (!(klasses = $elem.attr('class'))) {
      return;
    }
    return klasses.split(' ')[0];
  };
  return {
    value: function($target, dataAttributePrefix) {
      var string;
      string = $target.data(dataAttributePrefix + "-value") || $target.text();
      return textFormatter.replaceDoubleByteChars(string);
    },
    subgroup: function($elem) {
      return $elem.closest('[id]').attr('id') || '';
    },
    item: function($elem) {
      return $elem.attr('id') || firstClass($elem) || '';
    }
  };
});
