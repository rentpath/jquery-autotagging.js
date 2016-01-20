define [
  'jquery'
  './text_formatter'
], (
  $
  textFormatter
) ->
  firstClass = ($elem) ->
    return unless klasses = $elem.attr('class')
    klasses.split(' ')[0]

  value: ($target, dataAttributePrefix) ->
    string = $target.data("#{dataAttributePrefix}-value") || $target.text()
    textFormatter.replaceDoubleByteChars(string)

  subgroup: ($elem) ->
    $elem.closest('[id]').attr('id') or ''

  item: ($elem) ->
    $elem.attr('id') or firstClass($elem) or ''
