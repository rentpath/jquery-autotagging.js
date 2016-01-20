define [
  'jquery',
], ($) ->

  (itemDataAttribute, sectionDataAttribute) ->
    isSelect = (node) -> node.nodeName is 'SELECT'

    isInput = (node) ->
      isSelect(node) || node.nodeName is 'INPUT' || node.nodeName is 'TEXTAREA'

    value: (node) ->
      if isInput(node)
        text = node.value
      else if $(node).children().length
        text = $(node).filter(':visible').text()
      else
        text = $(node).text()
      (text || '').substring(0, 100)

    subgroup: ($elem) ->
      $elem.closest("[#{sectionDataAttribute}]").attr(sectionDataAttribute) or ''

    item: ($elem) ->
      $elem.attr(itemDataAttribute) or ''
