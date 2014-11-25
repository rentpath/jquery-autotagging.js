gulp     = require 'gulp'
coffee   = require 'gulp-coffee'
concat   = require 'gulp-concat'
amdclean = require 'gulp-amdclean'
es       = require 'event-stream'

gulp.task 'default', ->
  coffee_files = ['src/click_handler.coffee', 'src/select_change_handler.coffee', 'src/jquery.autotagging.coffee']
  js_files     = ['vendor/javascripts/browserdetect/browserdetect.js']

  es.concat(
      gulp.src(js_files),
      gulp.src(coffee_files).pipe(coffee(bare: true))
    )
    .pipe concat('jquery.autotagging.js')
    .pipe amdclean.gulp(
      prefixMode: 'standard'
      globalModules: ["BrowserDetect", "jqueryautotagging"]
      prefixTransform: (postName, preName)->
        switch preName
          when "jquery" then "jQuery"
          when "browserdetect" then "BrowserDetect"
          else postName
    )
    .pipe gulp.dest('./dist/non-amd/')