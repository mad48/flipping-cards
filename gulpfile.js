'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require("gulp-rename");


gulp.task('default', ['watch'], function () {
    console.log('Watch task started')
});


function scss(file) {

    return gulp.src(file)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions', '> 5%'],
            cascade: false
        }))
        .pipe(gulp.dest('./demo/css'))

}


gulp.task('js', function () {

    return gulp.src('./src/js/flipping.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(rename("flipping.min.js"))
        .pipe(gulp.dest('./demo/js'));

});


gulp.task('watch', function () {

    gulp.watch('./src/css/*.scss').on("change", function (file) {
        scss(file.path)
    });

    gulp.watch('./src/js/*.js', ['js'])
});


gulp.task('build', ['js'], function () {

    gulp.src('./demo/css/flipping.css')
        .pipe(gulp.dest('./dist/css'));

    gulp.src('./src/js/flipping.js')
        .pipe(gulp.dest('./dist/js'));

    gulp.src('./demo/js/flipping.min.js')
        .pipe(gulp.dest('./dist/js'));
});