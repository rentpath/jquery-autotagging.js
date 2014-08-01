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

@initials = ''
inc = (importance, initials) ->
  gulp.src(paths.versionToBump)
    .pipe(bump(type: importance))
    .pipe(gulp.dest(paths.dest))

  gulp.src(paths.versionToCheck)
    .pipe prompt.prompt({
      name: 'initials'
      type: 'input'
      message: 'Enter Your Initials:'
    }, (initials) -> @user = initials)
    .pipe(git.commit "[#{@user.initials}] [000000] Bump version" )
    .pipe(filter(paths.versionToCheck))
    .pipe tag_version()
    .pipe(git.push('origin', 'master', { args: '--tags' }))

gulp.task 'patch',   -> inc 'patch'
gulp.task 'feature', -> inc 'minor'
gulp.task 'release', -> inc 'major'

