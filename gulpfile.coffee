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

promptOpts = [
  {
    type: 'input',
    message: 'Enter Your Initials'
  }
]

inc = (importance, initials) ->
  gulp.src(paths.versionToBump)
    .pipe(bump(type: importance))
    .pipe(gulp.dest(paths.dest))
    .pipe(prompt.prompt(promptOpts, (initials) -> @user_name = initials))
    .pipe(git.commit("[#{@user_name}] [000000] Version Bump"))
    .pipe(filter(paths.versionToCheck))
    .pipe tag_version()
    .pipe prompt.confirm promptOpts
    .pipe(git.push('origin', 'master', { args: '--tags' }))

gulp.task 'patch',   -> inc 'patch'
gulp.task 'feature', -> inc 'minor'
gulp.task 'release', -> inc 'major'

