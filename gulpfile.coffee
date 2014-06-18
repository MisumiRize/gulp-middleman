gulp = require "gulp"
gulpLoadPlugins = require "gulp-load-plugins"
{coffeelint, coffee} = gulpLoadPlugins()

gulp.task "coffee", ->
  gulp.src "src/*.coffee"
    .pipe do coffeelint
    .pipe do coffee
    .pipe gulp.dest "./"

gulp.task "watch", ->
  gulp.watch "src/*.coffee", ["coffee"]

gulp.task "default", ["watch"]
