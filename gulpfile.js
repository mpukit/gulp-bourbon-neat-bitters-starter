var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();

var sassPaths = [
  './src/sass'
];

gulp.task('sass', function () {
  return gulp.src('./src/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: sassPaths
    })
      .on('error', function (err) {
        console.log(err.message + ' on line ' + err.lineNumber + ' in file : ' + err.fileName);
      })
    )
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie >= 9']
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./src/css'));
});

gulp.task('scripts', function () {
  return gulp.src(['./src/js/custom/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('production.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./src/js/dist'));
});

gulp.task('jshint', function () {
    return gulp.src(['./src/js/custom/*.js'])
            .pipe(jshint())
            .pipe(jshint.reporter(stylish));
});

gulp.task('compress', function() {
  return gulp.src('./src/js/custom/*.js')
    .pipe(uglify())
    .pipe(concat('production.min.js'))
    .pipe(gulp.dest('./src/js/dist/compressed'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./src"
        }
    });
});

gulp.task('serve', ['sass', 'scripts', 'jshint', 'compress', 'browser-sync'], function() {
  gulp.watch(['./src/sass/**/*.scss'], ['sass']);
  gulp.watch(['./src/css/*.css'], ['css']);
  gulp.watch(['./src/*.html', './src/css/*.css']).on('change', browserSync.reload); // Watch HTML/CSS
});
