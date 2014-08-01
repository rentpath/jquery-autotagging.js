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

  gulp.src(paths.versionToCheck)
    .pipe prompt.prompt({
      name: 'initials'
      type: 'input'
      message: 'Enter your initials:'
    }, (initials) ->
    @user = initials
    gulp.src(paths.versionToCheck)
    .pipe(git.add())
    .pipe(git.commit "[#{@user.initials}] [000000] Bump version" )
    .pipe(filter(paths.versionToCheck))
    .pipe tag_version()
    .pipe(git.push('origin', git.revParse({args: '--abbrev-ref HEAD'}), { args: '--tags' }))

    )
# TODO: Waiting for revParse feature: https://github.com/stevelacy/gulp-git/pull/27/files
# gulp.task 'patch',   -> inc 'patch'
# gulp.task 'feature', -> inc 'minor'
# gulp.task 'release', -> inc 'major'

