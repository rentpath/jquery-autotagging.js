define [
  'jquery',
], ($) ->

  (itemDataAttribute, sectionDataAttribute) ->
    isSelect = (node) -> node.nodeName is 'SELECT'

    isInput = (node) ->
      isSelect(node) || node.nodeName is 'INPUT' || node.nodeName is 'TEXTAREA'

    nodeText = (node) ->
      if isInput(node)
        node.value
      else if $(node).children().length
        $(node).filter(':visible').text()
      else
        $(node).text()

    value: (node) ->
      nodeText(node).substring(0, 100)

    subgroup: ($elem) ->
      $elem.closest("[#{sectionDataAttribute}]").attr(sectionDataAttribute) or ''

    item: ($elem) ->
      $elem.attr(itemDataAttribute) or ''
