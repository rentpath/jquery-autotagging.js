define [], () ->
  charMap = {
    8482: '(tm)',
    169: '(c)',
    174: '(r)'
  }

  replaceDoubleByteChars: (str) ->
    result = for char in str.split('')
      charMap[char.charCodeAt(0)] || char
    result.join('')
