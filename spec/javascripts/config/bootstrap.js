var root = '../../../';
require.config({
  shim: {},
  paths: {
    'browser-detect': root + 'node_modules/browser-detect/dist/browser-detect',
    jquery: root + 'node_modules/jquery/dist/jquery',
    'jquery.cookie': root + 'node_modules/jquery.cookie/jquery.cookie'
  }
});
