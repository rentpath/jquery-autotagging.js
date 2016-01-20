gulp     = require 'gulp'
amdclean = require 'gulp-amdclean'
coffee   = require 'gulp-coffee'
rjs      = require 'gulp-requirejs'

coffee_files  = ['src/*.coffee']

gulp.task 'coffee', ->
  gulp
    .src coffee_files
    .pipe coffee(bare: true)
    .pipe gulp.dest('./dist/shared/')

gulp.task 'non-amd', ->
  rjs
    baseUrl: './vendor/javascripts'
    out: 'jquery.autotagging.js'
    paths:
      'browser-detect':   'browser-detect/dist/browser-detect'
      'jquery.cookie': 'jquery.cookie/jquery.cookie'
      jquery:          'jquery/dist/jquery'
    packages: [
      {
        name: 'jquery-autotagging'
        main: 'jquery.autotagging.js'
        location: '../../dist/shared'
      }
    ]
    exclude: ['jquery']
    include: ['jquery-autotagging']
  .pipe amdclean.gulp
    prefixMode: 'standard'
    globalModules: ['jquery_autotagging']
    prefixTransform: (postName, preName)->
      switch preName
        # renaming jquery module to global jQuery
        when "jquery" then "jQuery"
        else postName
  .pipe gulp.dest('./dist/non-amd/')

gulp.task 'build', ->
  gulp.watch(coffee_files, ['coffee'])
  gulp.watch(coffee_files, ['non-amd'])

gulp.task 'watch', ['build'], ->
  gulp.watch(coffee_files, ['build'])

gulp.task 'default', ['watch']
