define(['jquery'], function($) {
  return function(itemDataAttribute, sectionDataAttribute) {
    var isInput, isSelect, nodeText;
    isSelect = function(node) {
      return node.nodeName === 'SELECT';
    };
    isInput = function(node) {
      return isSelect(node) || node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA';
    };
    nodeText = function(node) {
      if (isInput(node)) {
        return node.value;
      } else if ($(node).children().length) {
        return $(node).filter(':visible').text();
      } else {
        return $(node).text();
      }
    };
    return {
      value: function(node) {
        return nodeText(node).substring(0, 100);
      },
      subgroup: function($elem) {
        return $elem.closest("[" + sectionDataAttribute + "]").attr(sectionDataAttribute) || '';
      },
      item: function($elem) {
        return $elem.attr(itemDataAttribute) || '';
      }
    };
  };
});
