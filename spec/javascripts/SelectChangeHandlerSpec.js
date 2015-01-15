describe('Select element change event handler', function() {
  var changeHandler;

  beforeEach(function() {
    var ready = false;

    require(['../../dist/shared/select_change_handler'], function(SelectChangeHandler) {
      changeHandler = new SelectChangeHandler();
      ready = true;
    });

    waitsFor(function(){
      return ready;
    });
  });

  describe('#bind', function() {
    it('binds the event handler to an event for a selector', function() {
      spyOn($.fn, 'on');
      changeHandler.bind(document);
      expect($.fn.on).toHaveBeenCalled()
    });
  });

  describe('#item', function() {
    var wh;

    beforeEach(function() {
      wh = {
        replaceDoubleByteChars: function(text) {
          return text;
        }
      };
    });

    it('returns the select menu option value if it exists', function() {
      var $select = {
        find: function(_) {
          return {
            val: function() {
              return 'boo';
            }
          };
        }
      };
      var item = changeHandler.item($select, wh);

      expect(item).toEqual('boo');
    });

    it('returns an empty string if a value does not exist', function() {
      var $select = {
        find: function(_) {
          return {
            val: function() {
              return undefined;
            }
          };
        }
      };
      var item = changeHandler.item($select, wh);

      expect(item).toEqual('');
    });
  });


  describe('#subgroup', function() {
    it('returns a subgroup if one exists', function() {
      var wh = {
        getSubgroupId: function(_) {
          return 42;
        }
      };
      var subgroup = changeHandler.subgroup('test', wh)

      expect(subgroup).toEqual(42);
    });

    it('returns an empty string if a subgroup does not exist', function() {
      var wh = {
        getSubgroupId: function(_) {
          return null;
        }
      };
      var subgroup = changeHandler.subgroup('test', wh)

      expect(subgroup).toEqual('');
    });
  });

  describe('#value', function() {
    var wh;

    beforeEach(function() {
      wh = {
        replaceDoubleByteChars: function(text) {
          return text;
        }
      };
    });

    it('returns the select menu option value if it exists', function() {
      var $select = {
        find: function(_) {
          return {
            val: function() {
              return 'boo';
            }
          };
        }
      };
      var value = changeHandler.value($select, wh);

      expect(value).toEqual('boo');
    });

    it('returns an empty string if a value does not exist', function() {
      var $select = {
        find: function(_) {
          return {
            val: function() {
              return undefined;
            }
          };
        }
      };
      var value = changeHandler.value($select, wh);

      expect(value).toEqual('');
    });
  });

  describe('#text', function() {
    it('returns the select menu option text', function() {
      var wh = {
        replaceDoubleByteChars: function(text) {
          return text;
        }
      };
      var $select = {
        find: function(_) {
          return {
            text: function() {
              return 'hi';
            }
          };
        }
      };
      var text = changeHandler.text($select, wh);

      expect(text).toEqual('hi');
    });
  });
});
