define [
  'jquery'
  './text_formatter'
], (
  $
  textFormatter
) ->
  class SelectChangeHandler
    textData = ($target) ->
      text = $target.find(':selected').text()
      textFormatter.replaceDoubleByteChars(text)

    constructor: (@wh, @finder) ->

    bind: (doc) ->
      $(doc).on 'change', 'select', @recordChange

    recordChange: (evt) =>
      domTarget = evt.target
      attributes = domTarget.attributes
      $target = $(evt.target)

      @wh.fire(@trackingData(evt, $target, attributes), $target)
      evt.stopPropagation()

    trackingData: (evt, $target, attributes) ->
      data =
        # cg, a.k.a. contentGroup, should come from meta tag with name "WH.cg"
        sg:    @finder.subgroup($target)
        item:  @finder.item($target)
        value: @finder.value($target)
        text:  textData($target)
        type:  'change'
        x:     evt.clientX
        y:     evt.clientY

      for attribute in attributes
        if attribute.name.indexOf('data-') == 0 and attribute.name not in @wh.exclusionList
          realName = attribute.name.replace('data-', '')
          data[realName] = attribute.value

      data

  SelectChangeHandler
