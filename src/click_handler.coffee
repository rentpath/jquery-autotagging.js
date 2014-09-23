define ['jquery'], ($) ->
  class ClickHandler
    constructor: (@wh, opts={}) ->
      @clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img'
      if opts.exclusions?
        @clickBindSelector = @clickBindSelector.replace(/,\s+/g, ":not(#{opts.exclusions}), ")

    bind: (elem) ->
      $(elem).on 'click', @clickBindSelector, @elemClicked

    _shouldRedirect: (href) ->
      href? &&
      href.indexOf? &&
      # ignore obtrusive JS in an href attribute
      href.indexOf('javascript:') == -1

    # Event and data should be as passed to the elemClicked handler
    _followHrefConfigured: (event, options, wh) ->
      if event && event.data? && event.data.followHref?
        event.data.followHref
      else if options? && options.followHref?
        options.followHref
      else
        if wh? then wh.followHref else false

    _setDocumentLocation: (href) ->
      document.location = href

    _openNewWindow: (href) ->
      window.open(href)

    elemClicked: (e, options={}) =>
      domTarget = e.target
      attrs = domTarget.attributes
      jQTarget = $(e.target)

      # to handle links with internal elements, such as <span> tags.
      if !jQTarget.is(@clickBindSelector)
        jQTarget = jQTarget.parent()

      item = @wh.getItemId(jQTarget) or ''
      subGroup = @wh.getSubgroupId(jQTarget) or ''
      value = @wh.replaceDoubleByteChars(jQTarget.text()) or ''

      trackingData =
        # cg, a.k.a. contentGroup, should come from meta tag with name "WH.cg"
        sg:     subGroup
        item:   item
        value:  value
        type:   'click'
        x:      e.clientX
        y:      e.clientY

      for attr in attrs
        if attr.name.indexOf('data-') == 0 and attr.name not in @wh.exclusionList
          realName = attr.name.replace('data-', '')
          trackingData[realName] = attr.value

      getClosestAttr = (attr) ->
        jQTarget.attr(attr) || jQTarget.closest('a').attr(attr)

      href = getClosestAttr('href')
      target = getClosestAttr('target')
      if @_followHrefConfigured(e, options, @wh) && @_shouldRedirect(href)
        e.preventDefault()
        if target == "_blank"
          @_openNewWindow(href)
        else
          trackingData.afterFireCallback = =>
            @_setDocumentLocation(href)

      @wh.fire trackingData
      e.stopPropagation()

  ClickHandler
