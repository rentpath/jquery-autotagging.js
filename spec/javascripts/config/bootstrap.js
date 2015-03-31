var root = '../../../';
require.config({
  shim: {},
  paths: {
    "browser-detect": root + 'vendor/javascripts/browser-detect/dist/browser-detect',
    jquery: root + 'vendor/javascripts/jquery/dist/jquery',
    underscore: root + 'vendor/javascripts/underscore/underscore',
    'jquery.cookie': root + 'vendor/javascripts/jquery.cookie/jquery.cookie',
    requirejs: root + 'vendor/javascripts/requirejs/require'
  }
});
