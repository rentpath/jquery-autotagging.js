define [
  'jquery'
  './text_formatter'
], (
  $
  textFormatter
) ->
  subgroup: ($elem) ->
    $elem.closest('[id]').attr('id') or ''

  item: ($elem) ->
    @value($elem)

  value: ($elem) ->
    value = $elem.find(':selected').val() or ''
    textFormatter.replaceDoubleByteChars(value)

  text: ($target) ->
    text = $target.find(':selected').text()
    textFormatter.replaceDoubleByteChars(text)
