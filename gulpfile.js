// Root folder for everything
var models = "./app/models/",
  collections = "./app/collections/",
  views = "./app/views/",
  dist = "./dist/",
  gulp = require('gulp'),
  concat = require('gulp-concat');

  gulp.task('default', function (cb) {
    gulp.src(['./index.js', models + '**/*.js', collections + '**/*.js', views + '**/*.js'])
      .pipe(concat('sampleapp.js'))
      .pipe(gulp.dest(dist));
  });