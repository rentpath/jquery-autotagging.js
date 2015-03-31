require.config({
  baseUrl: '../vendor/javascripts',
  shim: {

  },
  paths: {
    requirejs:       'requirejs/require',
    browserdetect:   'browser-detect/dist/browser-detect',
    jquery:          'jquery/dist/jquery',
    'jquery.cookie': 'jquery.cookie/jquery.cookie'
  }
  ,
  packages: [
    {
      name: 'jquery-autotagging',
      main: 'jquery.autotagging.js',
      location: '../../dist/shared'
    }
  ]
});