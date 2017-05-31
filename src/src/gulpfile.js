/* 
 * @Author: caoke
 * @Date:   2015-06-10 14:03:32
 * @Last Modified by:   caoke
 * @Last Modified time: 2015-06-29 13:34:09
 */

var gulp = require('gulp');
var builder = require('builder-alinw');


gulp.task('hephaistos', ['transport', 'cssmin', 'copy'], function() {
    gulp.src('src/hephaistos/**/*.*') //压缩的文件
        .pipe(gulp.dest('dist/hephaistos')) //输出文件夹
    gulp.src('src/assets/**/*.*') //压缩的文件
        .pipe(gulp.dest('dist/assets')) //输出文件夹
});

gulp.tasks.default.dep.push('hephaistos');

gulp.tasks = builder.tasks;

// sass
var sass = require('gulp-ruby-sass');
gulp.task('sass', function() {
    sass('src/**/*.scss')
        .on('error', function(err) {
            console.error('Error!', err.message);
        })
        .pipe(gulp.dest('src'));
});

// hbs
var rename = require("gulp-rename"),
    replace = require('gulp-replace'),
    wrap = require('gulp-wrap');
gulp.task('hbs', function() {
    gulp.src('src/**/*.hbs')
    .pipe(rename(function(path) {
        path.extname = '-hbs.js';
    }))
    .pipe(replace(/##.*/g, ''))
    .pipe(replace(/\r\n/g, ''))
    .pipe(replace(/"/g, '\\\"'))
    .pipe(replace(/'/g, '\\\''))
    .pipe(wrap('define(function(require, exports, module) { var Handlerbars = require("common/handlerbars"); var compile = Handlerbars.compile("<%= contents %>"); compile.source="<%= contents %>"; return compile; });'))
    .pipe(gulp.dest('src'));
});

// babel
var matchRex = /(src.*)\/.*\.*/;
var babel = require('gulp-babel');
var babelTask = (e) => {
    var match = e.path.replace(/\\/g, '/').match( matchRex ),
        file = match[0];
    gulp.src( file )
        .pipe( babel( { presets: ['es2015', 'react'] } ).on('error', (e) => {
            console.error('error', e.message);
        }) )
        .pipe(gulp.dest( match[1] ));
};

// watch
gulp.task('watch', function() {
    // sass
    gulp.watch('src/**/*.scss', ['sass']).on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...[sass]');
    });
    // hbs
    gulp.watch('src/**/*.hbs', ['hbs']).on('change', function(event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...[hbs]');
    });
    // babel & jsx
    gulp.watch(['src/**/*.jsx', 'src/**/*.es6']).on('change', (event) => {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...[babel]');
        babelTask(event);
    });
});
