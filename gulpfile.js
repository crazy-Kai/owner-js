// 定义
const gulp = require('gulp'),
      babel = require('gulp-babel'),
      less = require('gulp-less'),
      cssmin = require('gulp-clean-css'),
      sourceMap = require('gulp-sourcemaps'),
      browserSync = require('browser-sync'),
      util = require('gulp-util'),
      notify = require('gulp-notify'),
      plumber = require('gulp-plumber');
      fs = require("fs"),
      path = require("path"),
      _ = require("underscore"),
      shutils = require("shutils"),
      filesystem = shutils.filesystem,
      StringUtils = require("underscore.string"),
      uglify = require("gulp-uglify"),
      GulpCmdNice = require("gulp-cmd-nice"),
      rename = require("gulp-rename"),
      gulpFilter = require("gulp-filter"),
      gulpif = require("gulp-if"),
      minifyCSS = require("gulp-minify-css"),
      // GulpChanged = require("@ali/gulp-changed"),
      CmdNice = require("cmd-nice"),
      getRepoInfo = require("libs/repoInfo"),
      argv = require("yargs").argv,
      repoInfo = getRepoInfo(argv);

    
 
// 任务
gulp.task('default', ['brow','watch']);

  //观察者
var matchRex = /(src.*)\/.*\.*/ ;
 var babelTask = (e) => {
    var match = e.path.replace(/\\/g,"/").match(matchRex),
       files = match[0],
       paths = match[1];
       gulp.src(files)
       .pipe(babel({presets:['es2015','react','stage-0']}).on("error",(e) =>{
         console.error("error"+e.message);
       })).pipe(gulp.dest(paths));
       
 }
   gulp.task("watch",() =>{
     gulp.watch(['src/**/*.babel','src/**/*.jsx']).on('change',(e)=>{
         console.log('files:'+e.path+'was'+e.type+',running tasks ....[babel]');
         babelTask(e);
     })
     gulp.watch('./src/css/**/*.less',['less'])
   }) 

//less
gulp.task('less',()=>{
  return gulp.src('./src/css/**/*.less')
         .pipe(less())
         .on('error',(error)=>{
          util.log('less error:'+error.message);
         })
         .pipe(gulp.dest('./src/css'))
        
})

// 静态服务
gulp.task('brow', () => {
    browserSync({
        files: ['./src/css/**/*.css', './src/js/**/*.js', './src/html/**/*.html'],
        server: {
            baseDir: "./"
        }
    });
});