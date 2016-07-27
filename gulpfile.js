"use strict";
// 定义
const gulp = require('gulp'),
    babel = require('gulp-babel'),
    less = require('gulp-less'),
    cssmin = require('gulp-clean-css'),
    sourceMap = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    util = require('gulp-util'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
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
    // getRepoInfo = require("libs/repoInfo"),
    argv = require("yargs").argv;
// repoInfo = getRepoInfo(argv);

//fn
var isAbsolutePath = function(filePath) {
    //path.resolve(filePath) 返回的是源路径 //path.noemalize()返回的是符合规范的路径字符串
    return path.resolve(filePath) === path.normalize(filePath);
};

// 任务
gulp.task('default', ['brow', 'watch']);

// console.log( process.cwd())


//参数
var options = {
    transport: {
        total: null,
        success: null,
        fail: function(result) {
            if (result.error.level === 'error') {
                process.exit(1);
            }
        }
    },
    debug: {
        total: null,
        success: null,
        fail: null
    },
    concat: {
        total: null,
        success: null,
        fail: null
    },
    sourcePath: argv.src || "src",
    distPath: argv.dist || "dist"
};
//暂时没有以下2个对象
if (argv.lessSource) {
    argv.lessSource = argv.lessSource.replace(/^\//, '');
}
if (argv.config) {
    argv.config = argv.config.replace(/^\//, '');
}

var sourcePath = options.sourcePath;

var distPath = options.distPath;
//过滤路径
if (!isAbsolutePath(sourcePath)) {
    sourcePath = path.normalize(path.join(process.cwd(), sourcePath));
    // d:\MyRflux\wu-xiao-wen.github.com\src
}
if (!isAbsolutePath(distPath)) {
    distPath = path.normalize(path.join(process.cwd(), distPath));
    // d:\MyRflux\wu-xiao-wen.github.com\dist
}
// seajs的别名和路径
var configFileContent = {
    alias: {},
    paths: {}
};
//获取seajs的配置项文件
var seaCfgUrl = "src/js/libs/seaConfig.js";
var configFile = path.join(__dirname, seaCfgUrl);
var  alias,paths;

//fs.existsSync方法判断configFile的路径下的文件是否存在，返回boolean值 true/false;
var isConfigFileExist = fs.existsSync(configFile);
//如果存在
if (isConfigFileExist) {
    configFileContent = fs.readFileSync(configFile, 'utf-8');
    configFileContent = eval(configFileContent);
        alias = configFileContent.alias = configFileContent.alias || {};
        paths = configFileContent.paths = configFileContent.paths || {};
    
}
//依赖注入
// var dependencyUtils = new CmdNice.DependencyUtils({
//     rootPath: sourcePath,
//     alias: configFileContent.alias,
//     aliasPaths: configFileContent.paths
// });
//观察者
var matchRex = /(src.*)\/.*\.*/;
var babelTask = (e) => {
    var match = e.path.replace(/\\/g, "/").match(matchRex),
        files = match[0],
        paths = match[1];
    gulp.src(files)
        .pipe(babel({ presets: ['es2015', 'react', 'stage-0'] }).on("error", (e) => {
            console.error("error" + e.message);
        })).pipe(gulp.dest(paths));

}
gulp.task("watch", () => {
    gulp.watch(['src/**/*.babel', 'src/**/*.jsx']).on('change', (e) => {
        console.log('files:' + e.path + 'was' + e.type + ',running tasks ....[babel]');
        babelTask(e);
    })
    gulp.watch('./src/css/**/*.less', ['less'])
})

//less
gulp.task('less', () => {
    return gulp.src('./src/css/**/*.less')
        .pipe(less())
        .on('error', (error) => {
            util.log('less error:' + error.message);
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
