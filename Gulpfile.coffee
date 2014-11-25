gulp     = require 'gulp'
coffee   = require 'gulp-coffee'
concat   = require 'gulp-concat'
amdclean = require 'gulp-amdclean'

gulp.task 'default', ->
  coffee_files = [
    'vendor/javascripts/browserdetect/browserdetect.coffee',
    'src/click_handler.coffee',
    'src/select_change_handler.coffee',
    'src/jquery.autotagging.coffee'
  ]

  gulp
    .src coffee_files
    .pipe coffee(bare: true)
    .pipe concat('jquery.autotagging.js')
    .pipe amdclean.gulp(
      prefixMode: 'standard'
      globalModules: ["WH"]
      prefixTransform: (postName, preName)->
        switch preName
          when "jquery" then "jQuery"
          else postName
    )
    .pipe gulp.dest('./dist/non-amd/')