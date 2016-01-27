define [
  'jquery'
], ($) ->
  class ClickHandler
    constructor: (@wh, @finder, opts = {}) ->
      @clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img'
      @dataAttributePrefix = opts.dataAttributePrefix || 'autotag'
      if opts.exclusions?
        @clickBindSelector = @clickBindSelector.replace(/,\s+/g, ":not(#{opts.exclusions}), ")

    bind: (elem) ->
      $(elem).on 'click', @clickBindSelector, @elemClicked

    elemClicked: (evt) =>
      $target = $(evt.target)

      # Handle links with internal elements, such as <span> tags
      if !$target.is(@clickBindSelector)
        $target = $target.parent()

      # The cg property (the contentGroup), should come from meta tag with name 'WH.cg'
      trackingData =
        sg:    @finder.subgroup($target)
        item:  @finder.item($target)
        value: @finder.value($target, @dataAttributePrefix)
        type:  'click'
        x:     evt.clientX
        y:     evt.clientY

      for attr in evt.target.attributes
        if attr.name.indexOf('data-') == 0 and attr.name not in @wh.exclusionList
          realName = attr.name.replace('data-', '')
          trackingData[realName] = attr.value

      @wh.fire trackingData

  ClickHandler
