'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var rename = require("gulp-rename");
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const pkg = require('./package.json');
const gutil = require('gulp-util');
const eslint = require('gulp-eslint');

var filehead = "/**" +
    "\n * " + pkg.description + " " + pkg.version +
    "\n * " + pkg.homepage +
    "\n *" +
    "\n * Copyright 2017-" + new Date().getFullYear() + " " + pkg.author +
    "\n *" +
    "\n * Released on: " + ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()] + " " + new Date().getDate() + ", " + new Date().getFullYear() +
    "\n * " + pkg.license + " License" +
    "\n*/\n\n";

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
        .on('error', (err) => {
            console.log(err.toString());
        })
        /* .pipe(cleanCSS({
         advanced: false,
         aggressiveMerging: false
         }))
         .pipe(rename((filePath) => {
         filePath.basename += '.min';
         }))*/
        .pipe(header(filehead))
        .pipe(gulp.dest('./demo/css'))

}


gulp.task('js', function () {

    return gulp.src('./src/js/flipping.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(header(filehead))
        .pipe(rename("flipping.min.js"))
        .pipe(gulp.dest('./dist/js'));

});


gulp.task('watch', function () {

    gulp.watch(['./src/css/*.scss', './demo/css/*.scss']).on("change", function (file) {
        scss(file.path)
    });

    gulp.watch('./src/js/*.js', ['js', 'lint'])
});


gulp.task('lint', () => {

    return gulp.src(['src/js/*.js', '!node_modules/**'])

        .pipe(eslint({
                // fix: true,
                configFile: '.eslintrc.json'
            }
        ))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task('build', ['js'], function () {
    scss('./src/css/flipping.scss');
    scss('./demo/css/card.scss');

    gulp.src('./demo/css/flipping.css')
        .pipe(gulp.dest('./dist/css'));

    gulp.src('./src/js/flipping.js')
        .pipe(gulp.dest('./dist/js'));

});