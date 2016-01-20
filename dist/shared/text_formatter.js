define([], function() {
  var charMap;
  charMap = {
    8482: '(tm)',
    169: '(c)',
    174: '(r)'
  };
  return {
    replaceDoubleByteChars: function(str) {
      var char, result;
      result = (function() {
        var i, len, ref, results;
        ref = str.split('');
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          char = ref[i];
          results.push(charMap[char.charCodeAt(0)] || char);
        }
        return results;
      })();
      return result.join('');
    }
  };
});
