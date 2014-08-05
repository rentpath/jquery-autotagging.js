define [
  'jquery'
  'browserdetect'
  'underscore'
  './click_handler'
  './select_change_handler'
  'jquery.cookie'
], ($, browserdetect, _, ClickEventHandler, SelectChangeHandler) ->
  class WH
    WH_SESSION_ID: 'WHSessionID'
    WH_LAST_ACCESS_TIME: 'WHLastAccessTime'
    WH_USER_ID: 'WHUserID'
    THIRTY_MINUTES_IN_MS: 30 * 60 * 1000
    TEN_YEARS_IN_DAYS: 3650
    MOBILE_WIDTH  = 768
    DESKTOP_WIDTH = 1023

    cacheBuster:  0
    domain:       ''
    firstVisit:   null
    metaData:     null
    oneTimeData:  null
    path:         ''
    performance:  window.performance || {}
    sessionID:    ''
    userID:       ''
    warehouseTag: null
    charMap: {
      8482: '(tm)',
      169: '(c)',
      174: '(r)'
    }


    init: (opts={}) =>
      @domain            = document.location.host
      @setSiteVersion(opts)
      @exclusionList     = opts.exclusionList || []
      @fireCallback      = opts.fireCallback
      @path              = "#{document.location.pathname}#{document.location.search}"
      @warehouseURL      = opts.warehouseURL
      @opts              = opts

      @setFollowHref(opts)
      @setCookies()
      @determineDocumentDimensions(document)
      @determineWindowDimensions(window)
      @determinePlatform(window)

      opts.metaData ||= {}
      _.extend(opts.metaData, @getDataFromMetaTags(document))
      @metaData = opts.metaData
      @firePageViewTag()

      # This currently has a side effect to support backwards compatibility.
      for handler in @eventHandlers(opts)
        handler.bind(document)

    clearOneTimeData: =>
      @oneTimeData = undefined

    getSubgroupId: (elem) ->
      closestId = elem.closest('[id]').attr('id')
      closestId || null

    determineWindowDimensions: (obj) ->
      obj = $(obj)
      @windowDimensions = "#{obj.width()}x#{obj.height()}"

    determineDocumentDimensions: (obj) ->
      obj = $(obj)
      @browserDimensions = "#{obj.width()}x#{obj.height()}"

    determinePlatform: (win) ->
      @platform = browserdetect.platform(win)

    determineReferrer: (doc, win) ->
      if win.location.href.match(/\?use_real_referrer\=true/)
        $.cookie('real_referrer')
      else
        doc.referrer

    # TODO: Delegating this method to @clickHandler will mutate the state of
    # the WH instance! Change this at some point.
    # I'm keeping this method here for backwards compatibility. Remove it once
    # you don't care whether client code calls this method.
    elemClicked: (e, options={}) =>
      @clickHandler.elemClicked(e, options)

    fire: (obj, $element) =>


    setSiteVersion: (opts) ->
      if opts.metaData
        @siteVersion     = "#{opts.metaData.site_version || @domain}_#{@deviceType()}"
      else
        @siteVersion     = "#{@domain}_#{@deviceType()}"

    deviceType: -> @device ||= @desktopOrMobile()

    desktopOrMobile: (deviceWidth = $(window).width()) ->
      switch
        when @desktop(deviceWidth) then 'kilo'
        when @tablet(deviceWidth)  then 'deca'
        when @mobile(deviceWidth)  then 'nano'

    desktop: (deviceWidth) -> deviceWidth >  DESKTOP_WIDTH
    tablet:  (deviceWidth) -> deviceWidth >= MOBILE_WIDTH and deviceWidth <= DESKTOP_WIDTH
    mobile:  (deviceWidth) -> deviceWidth <  MOBILE_WIDTH

    fire: (obj) =>
      obj.ft                      = @firedTime()
      obj.cb                      = @cacheBuster++
      obj.sess                    = "#{@userID}.#{@sessionID}"
      obj.fpc                     = @userID
      obj.site                    = @domain
      obj.path                    = @path
      obj.title                   = $('title').text()
      obj.bs                      = @windowDimensions
      obj.sr                      = @browserDimensions
      obj.os                      = @platform.OS
      obj.browser                 = @platform.browser
      obj.ver                     = @platform.version
      obj.ref                     = obj.ref || @determineReferrer(document, window)
      obj.registration            = if $.cookie('sgn') == '1' then 1 else 0
      obj.person_id               = $.cookie('zid') if $.cookie('sgn')?
      obj.campaign_id             = $.cookie('campaign_id') if $.cookie('campaign_id')?
      obj.site_version            = @siteVersion
      @metaData.site_version = obj.site_version if obj.site_version?
      @metaData.cg = obj.cg if obj.cg?
      @metaData.cg = '' if !@metaData.cg?

      @fireCallback?(obj)

      if @oneTimeData?
        for key of @oneTimeData
          obj[key] = @oneTimeData[key]
        @clearOneTimeData()

      if @firstVisit
        obj.firstVisit = @firstVisit
        @firstVisit = null

      @obj2query($.extend(obj, @metaData), (query) =>
        requestURL = @warehouseURL + query

        # handle IE url length limit
        if requestURL.length > 2048 and navigator.userAgent.indexOf('MSIE') >= 0
          requestURL = requestURL.substring(0,2043) + "&tu=1"

        unless @warehouseTag
          @warehouseTag = $('<img/>',
            {id:'PRMWarehouseTag', border:'0', width:'1', height:'1'})

        $element = $element || $('body')
        @warehouseTag.load ->
          $element.trigger('WH_pixel_success_' + obj.type)
        @warehouseTag.error ->
          $element.trigger('WH_pixel_error_' + obj.type)

        # The request for the tracking pixel happens here.
        @warehouseTag[0].src = requestURL

        if @lastLinkClicked?
          lastLinkRedirect = (e) =>
            return unless @lastLinkClicked? && @lastLinkClicked.indexOf?
            # ignore obtrusive JS in an href attribute
            document.location = @lastLinkClicked if @lastLinkClicked.indexOf('javascript:') == -1

          @warehouseTag.unbind('load').unbind('error').
            bind('load',  lastLinkRedirect).
            bind('error', lastLinkRedirect)
      )

    firedTime: =>
      now =
        @performance.now        or
        @performance.webkitNow  or
        @performance.msNow      or
        @performance.oNow       or
        @performance.mozNow
      (now? and now.call(@performance)) || new Date().getTime()

    firePageViewTag: (options = {}) ->
      options.type = 'pageview'
      @fire options

    getItemId: (elem) ->
      elem.attr('id') or @firstClass(elem)

    firstClass: (elem) ->
      return unless klasses = elem.attr('class')
      klasses.split(' ')[0]

    getDataFromMetaTags: (obj) ->
      retObj = { }
      metas = $(obj).find('meta')

      for metaTag in metas
        metaTag = $(metaTag)
        if metaTag.attr('name') and metaTag.attr('name').indexOf('WH.') is 0
          name = metaTag.attr('name').replace('WH.', '')
          retObj[name] = metaTag.attr('content')
      retObj

    getOneTimeData: -> @oneTimeData

    # we are putting the tags ina predefined order before firing.  This will have
    # a performance hit - mocked in jsfiddle
    sort_order_array:  ["site" , "site_version","firstvisit","tu","cg","listingid","dpg","type"
                        ,"sg","item","value","ssSiteName","ssTestName","ssVariationGroupName"
                        ,"spg","lpp","path","logged_in","ft"]
    setTagOrder: (obj) ->
      prop_key_array = []
      result_array = []

      for key of obj
        prop_key_array.push key

      for elem of @sort_order_array
        index = $.inArray(@sort_order_array[elem], prop_key_array)
        if index > 0
          result_array.push prop_key_array[index]
          prop_key_array.splice(index,1)

      result_array = result_array.concat(prop_key_array)

      return result_array

    obj2query: (obj, cb) =>
      tag_order = @setTagOrder(obj)
      rv = []
      for elem of tag_order
        key = tag_order[elem]
        if obj.hasOwnProperty(key) and (val = obj[key])?
          rv.push "&#{key}=#{encodeURIComponent(val)}"
      cb(rv.join('').replace(/^&/,'?'))
      return

    getSessionID: (currentTime) ->
      if $.cookie(@WH_SESSION_ID)?
        $.cookie(@WH_SESSION_ID)
      else
        @firstVisit = currentTime
        @firstVisit

    setCookies: ->
      userID    = $.cookie(@WH_USER_ID)
      timestamp = (new Date()).getTime()

      unless userID
        userID = timestamp
        $.cookie(@WH_USER_ID, userID, { expires: @TEN_YEARS_IN_DAYS, path: '/' })

      sessionID = @getSessionID(timestamp)

      $.cookie(@WH_SESSION_ID, sessionID, { path: '/' })
      $.cookie(@WH_LAST_ACCESS_TIME, timestamp, { path: '/' })

      @sessionID = sessionID
      @userID = userID

    setOneTimeData: (obj) ->
      @oneTimeData ||= {}
      for key of obj
        @oneTimeData[key] = obj[key]

    # TODO: Move this to ClickHandler
    setFollowHref: (opts={}) ->
      @lastLinkClicked = null
      @followHref = if opts.followHref? then opts.followHref else true

    replaceDoubleByteChars: (str) ->
      result = for char in str.split('')
        @charMap[char.charCodeAt(0)] || char
      result.join('')

    # TODO: Remove the side effect of assigning to an instance variable once we
    # don't have to worry about backwards compatibility.
    eventHandlers: (options) ->
      @clickHandler = new ClickEventHandler(@, options)
      selectChangeHandler = new SelectChangeHandler(@)

      [@clickHandler, selectChangeHandler]
