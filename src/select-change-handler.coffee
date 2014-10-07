define ['jquery'], ($) ->
  class SelectChangeHandler
    constructor: (@wh) ->

    bind: (doc) ->
      $(doc).on 'change', 'select', @recordChange

    recordChange: (evt) =>
      domTarget = evt.target
      attributes = domTarget.attributes
      $target = $(evt.target)

      @wh.fire(@trackingData(evt, $target, attributes, @wh), $target)
      evt.stopPropagation()

    item: ($target, wh) ->
      @value($target, wh)

    subgroup: ($target, wh) ->
      wh.getSubgroupId($target) or ''

    value: ($target, wh) ->
      value = $target.find(':selected').val()
      wh.replaceDoubleByteChars(value) or ''

    text: ($target, wh) ->
      text = $target.find(':selected').text()
      wh.replaceDoubleByteChars(text)

    trackingData: (evt, $target, attributes, wh) ->
      data =
        # cg, a.k.a. contentGroup, should come from meta tag with name "WH.cg"
        sg:     @subgroup($target, wh)
        item:   @item($target, wh)
        value:  @value($target, wh)
        text:   @text($target, wh)
        type:   'change'
        x:      evt.clientX
        y:      evt.clientY

      for attribute in attributes
        if attribute.name.indexOf('data-') == 0 and attribute.name not in @wh.exclusionList
          realName = attribute.name.replace('data-', '')
          data[realName] = attribute.value

      data

  SelectChangeHandler
