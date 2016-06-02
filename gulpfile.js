var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var jslint = require('gulp-jslint');
var browserSync = require('browser-sync').create();

var sassPaths = [
  './app/sass'
];

gulp.task('sass', function () {
  return gulp.src('./app/sass/*.scss')
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
    .pipe(gulp.dest('./app/css'));
});

gulp.task('css', function () {
  return gulp.src(['./app/css/main.css'])
    .pipe(concatCss("bundled.css"))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./app/css'));
});

gulp.task('scripts', function () {
  return gulp.src(['./app/js/custom/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('production.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/js/dist'));
});

gulp.task('lint', function () {
    return gulp.src(['./app/js/**/*.js'])
            .pipe(jslint())
            // .pipe(jslint.reporter('default', errorsOnly)) // Default Reporter
            // .pipe(jslint.reporter('stylish', options)); // Stylish Reporter
            .pipe(jslint.reporter('stylish')); // Basic setup using 'Stylish'
});

// Static server
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });
});

gulp.task('serve', ['sass', 'css', 'scripts', 'lint', 'browser-sync'], function() {
  gulp.watch(['./app/sass/*.scss'], ['sass']);
  gulp.watch(['./app/css/*.css'], ['css']);
  gulp.watch(['./app/*.html', './app/css/*.css']).on('change', browserSync.reload); // Watch HTML/CSS
});
