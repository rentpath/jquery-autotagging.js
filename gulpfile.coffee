gulp    = require 'gulp'

p = require('./package.json')

git    = require('gulp-git')
bump   = require('gulp-bump')
filter = require('gulp-filter')
prompt = require('gulp-prompt')
tag_version = require('gulp-tag-version')

paths =
  scripts: ['*.js']
  versionToBump: ['./package.json', './bower.json']
  versionToCheck: 'bower.json'
  dest: './'

inc = (importance, initials) ->
  gulp.src(paths.versionToBump)
    .pipe(bump(type: importance))
    .pipe(gulp.dest(paths.dest))
    .pipe(git.commit('Version bump'))
    .pipe(filter(paths.versionToCheck))
    .pipe tag_version()
    .pipe(git.push('origin', 'master', { args: '--tags' }))

gulp.task 'patch',   -> inc 'patch'
gulp.task 'feature', -> inc 'minor'
gulp.task 'release', -> inc 'major'

