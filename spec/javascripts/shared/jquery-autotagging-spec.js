(function() {
  describe('jqueryAutotagging', function() {
    var module;
    module = null;
    beforeEach(function(done) {
      return require(["jquery-autotagging"], function(mod) {
        module = new mod();
        return done();
      });
    });
    afterEach(function() {
      return module = null;
    });
    return it('exists', function() {
      return expect(module).toBeTruthy();
    });
  });

}).call(this);
