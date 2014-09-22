define ['jquery'], ($) ->
  class ClickHandler
    constructor: (@wh, opts={}) ->
      @clickBindSelector = opts.clickBindSelector || 'a, input[type=submit], input[type=button], img'
      if opts.exclusions?
        @clickBindSelector = @clickBindSelector.replace(/,\s+/g, ":not(#{opts.exclusions}), ")

    bind: (elem) ->
      $(elem).on 'click', @clickBindSelector, @elemClicked

    shouldRedirect: (href) ->
      href? &&
      href.indexOf? &&
      # ignore obtrusive JS in an href attribute
      href.indexOf('javascript:') == -1

    # TODO: Decouple this method from the @wh object. I don't like how we mutate
    # the state of @wh. Creating an elemClicked method in the ClickHandler class
    # was a good move, but we should do more work to make the separation between
    # it and the WH class a bit cleaner.
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

      followHref = if e.data? && e.data.followHref?
        e.data.followHref
      else
        @wh.followHref

      getClosestAttr = (attr) ->
        jQTarget.attr(attr) || jQTarget.closest('a').attr(attr)

      href = getClosestAttr('href')
      @wh.lastLinkClicked = href
      target = getClosestAttr('target')
      if href && followHref && @shouldRedirect(href)
        if target == "_blank"
          window.open(href)
        else
          trackingData.afterFireCallback = ->
            document.location = href

      @wh.fire trackingData
      e.preventDefault()

  ClickHandler
