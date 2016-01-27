define(['jquery', './text_formatter'], function($, textFormatter) {
  return {
    subgroup: function($elem) {
      return $elem.closest('[id]').attr('id') || '';
    },
    item: function($elem) {
      return this.value($elem);
    },
    value: function($elem) {
      var value;
      value = $elem.find(':selected').val() || '';
      return textFormatter.replaceDoubleByteChars(value);
    },
    text: function($target) {
      var text;
      text = $target.find(':selected').text();
      return textFormatter.replaceDoubleByteChars(text);
    }
  };
});
