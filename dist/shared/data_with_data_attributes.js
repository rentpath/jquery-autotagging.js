define(['jquery'], function($) {
  return function(itemDataAttribute, sectionDataAttribute) {
    var isInput, isSelect;
    isSelect = function(node) {
      return node.nodeName === 'SELECT';
    };
    isInput = function(node) {
      return isSelect(node) || node.nodeName === 'INPUT' || node.nodeName === 'TEXTAREA';
    };
    return {
      value: function(node) {
        var text;
        if (isInput(node)) {
          text = node.value;
        } else if ($(node).children().length) {
          text = $(node).filter(':visible').text();
        } else {
          text = $(node).text();
        }
        return (text || '').substring(0, 100);
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
