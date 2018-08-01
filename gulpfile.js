const gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify-es').default;

gulp.task('default', function(){
    'use strict';
    gulp.watch(["src/**/*.js"], ["build"]);
    return gutil.log("gulp watch task running")
});

gulp.task('build', function () {
    return gulp.src(['src/config.js', 'src/parts/*.js', 'src/parts/classes/*.js', 'src/parts/classes/**/*.js', 'src/bot.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./'));
});

gulp.task("prod", function () {
    return gulp.src(['src/config.js', 'src/parts/*.js', 'src/parts/classes/*.js', 'src/parts/classes/**/*.js', 'src/bot.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./'));
});