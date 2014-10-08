{
  name: 'jquery-autotagging',
  baseUrl: '',
  paths: {
    requirejs: 'vendor/bower/requirejs/require',
    browserdetect: 'vendor/bower/browserdetect/browserdetect',
    jquery: 'vendor/bower/jquery/dist/jquery',
    'jquery.cookie': 'vendor/bower/jquery.cookie/jquery.cookie',
    underscore: 'vendor/bower/underscore/underscore',
    'jquery-autotagging': 'dist/shared/jquery-autotagging',
    'click-handler': 'dist/shared/click-handler',
    'select-change-handler': 'dist/shared/select-change-handler',
  },
  // Exclude files from the build that you expect to be included in the parent project, eg jquery
  exclude: ['jquery', 'jquery.cookie', 'underscore', 'browserdetect'],
  out: 'dist/jquery-autotagging.js'
}

