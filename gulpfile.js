"use strict";

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    sourcemaps = require("gulp-sourcemaps"),
    minify = require("gulp-clean-css"),
    prefix = require("gulp-autoprefixer"),
    del = require("del"),
    plumber = require("gulp-plumber"),
    notify = require("gulp-notify"),
    babel = require("gulp-babel"),
    concat = require("gulp-concat"),
    minifyJS = require("gulp-minify");


var autoprefixerOptions = {
    browsers: []
};

// CSS
gulp.task("clean:sass", function () {
    return del([
        "assets/css/**/*.css",
        "assets/css/**/*.css.map"
    ]);
});

gulp.task("compile:sass", function () {
    return gulp
        .src("assets/scss/**/*.scss")
        .pipe(plumber({
            errorHandler: notify.onError(function (error) {
                return {
                    title: "Failed to compile CSS-files!",
                    message: error
                }
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: "assets/scss"
        }))
        /*.pipe(minify({ debug: true }, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
        }))*/
        .pipe(prefix())
        .pipe(sourcemaps.write(".", { sourceRoot: "assets/scss" }))
        .pipe(gulp.dest("assets/dist/css"));
        //.pipe(notify("Succesfully compiled CSS-files!"));
});


// JS
gulp.task("clean:js", function () {
    return del([
        "assets/dist/js/core/*.js",
        "assets/dist/js/core/*.js.map",
        "assets/dist/js/custom/*.js",
        "assets/dist/js/custom/*.js.map"
    ]);
});

gulp.task("compileCore:js",
    function () {
        return gulp
            .src(["assets/vendors/core/**/*.js", "assets/js/core/**/*.js"])
            .pipe(sourcemaps.init())
            .pipe(concat("core.js"))
            //.pipe(minifyJS())
            .pipe(sourcemaps.write("."))
            .pipe(gulp.dest("assets/dist/js/core"));
    });

gulp.task("compileCustom:js",
    function () {
        return gulp
            .src("assets/js/custom/**/*.js")
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets: ["@babel/env"]
            }))
            .pipe(sourcemaps.write("."))
            //.pipe(minifyJS())
            .pipe(gulp.dest("assets/dist/js/custom"));
    });

gulp.task("compile:js", gulp.parallel(["compileCore:js", "compileCustom:js"]));

// Series
gulp.task("build:sass", gulp.series(["clean:sass", "compile:sass"]));
gulp.task("build:js", gulp.series(["clean:js", "compile:js"]));

gulp.task("watch:sass", function () {
    gulp.watch("assets/scss/**/*.scss", gulp.series(["build:sass"]));
});

gulp.task("watch:js", function () {
    gulp.watch("assets/js/**/*.js", gulp.series(["build:js"]));
});

gulp.task("clean", gulp.parallel(["clean:sass", "clean:js"]));
gulp.task("build", gulp.parallel(["build:sass", "build:js"]));
gulp.task("watch", gulp.parallel(["watch:sass", "watch:js"]));