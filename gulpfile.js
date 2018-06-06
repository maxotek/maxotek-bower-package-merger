"use strict";

var gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    config = require("./build.conf.js"),
    plugins = require("gulp-load-plugins")();

var uglify = require("gulp-uglify-es").default;

gulp.task("clean", function () {
    return gulp
        .src(config.buildFolder, { read: false })
        .pipe(plugins.clean());
});

gulp.task("lint", () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(["**/*.js", "!dist/**", "!bower_components/**", "!node_modules/**"])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

gulp.task("scripts", function () {
    return gulp.src(config.srcJs)

        // package
        .pipe(plugins.concat(config.buildJsFilename))
        .pipe(plugins.header(config.closureStart))
        .pipe(plugins.footer(config.closureEnd))
        .pipe(plugins.header(config.banner))
        .pipe(gulp.dest(config.buildFolder))
        .pipe(plugins.filesize())

        // minify
        .pipe(uglify())
        .pipe(plugins.rename({ extname: ".min.js" }))
        .pipe(gulp.dest(config.buildFolder))
        .pipe(plugins.filesize())
        .on("error", plugins.util.log);
});

gulp.task("default", ["lint", "scripts"]);