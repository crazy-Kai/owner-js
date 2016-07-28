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
    fs = require("fs"),//读取文件模块
    path = require("path"),//读取路径模块
    _ = require("underscore"),//此模块中包含了javascript的一些常用方法
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
var filterByRequire = function(filePath, dependencyUtils, rootPath) {
    var keywords = StringUtils.lstrip(fs.realpathSync(filePath), {source: rootPath});
    keywords = StringUtils.lstrip(keywords, {source: "/"});
    var whoDepend = dependencyUtils.analyseWhoDepend(keywords);
    return whoDepend.length > 0;
};
// 任务
gulp.task('default', ['transport','concat_scripts','brow', 'watch']);

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
var seaCfgUrl = "/js/bus/libs/seaConfig.js";

var configFile = path.join(sourcePath, seaCfgUrl);
var  alias,paths;

//fs.existsSync方法判断configFile的路径下的文件是否存在，返回boolean值 true/false;
var isConfigFileExist = fs.existsSync(configFile);
      
//如果存在
if (isConfigFileExist) {

    configFileContent = fs.readFileSync(configFile, 'utf-8');
    configFileContent = eval(configFileContent);
        alias = configFileContent.alias = configFileContent.alias || {};
        paths = configFileContent.paths = configFileContent.paths || {};
        console.log(alias,paths)
    //去掉path中配置的绝对路径
    var keys = [];
    var paths = configFileContent.paths = configFileContent.paths || {};
    for (var key in paths) {
        if (/^(https?:)?\/\//.test(paths[key])) {
            keys.push(key);
        }
    }
    for (var i = 0; i < keys.length; i++) {
        delete paths[keys[i]];
    }
}

//依赖注入
var dependencyUtils = new CmdNice.DependencyUtils({
    rootPath: sourcePath,
    alias: configFileContent.alias,
    aliasPaths: configFileContent.paths
});

console.log(configFileContent.paths)
//transportConfig 配置参数
var transportConfig = {
    debug: true,
    useCache: true,
    rootPath: sourcePath,
    paths: [
        sourcePath
    ],
    ignoreTplCompile: !!argv.ignoreTplCompile,
    alias: configFileContent.alias,
    aliasPaths: configFileContent.paths,
    handlebars: {
        id: configFileContent.alias.handlebars || "alinw/handlebars/1.3.0/runtime"
    },
    lessOptions: {
        paths: '/src/css/**/*.less'
    },
    cssOptions: {
        paths: '/src/css/**/*.css'
    },
    total: options.transport.total,
    success: options.transport.success,
    fail: options.transport.fail
};
//debugOptions配置
var debugOptions = {
    paths: [
        distPath
    ],
    total: options.debug.total,
    success: options.debug.success,
    fail: options.debug.fail
};
var getTransportSource = function() {
    return gulp.src([
        sourcePath + "/**/*.js",
        '!'+sourcePath+"/assets/**/*.js",
        '!'+sourcePath+"/hephaistos/**/*.js",
        // sourcePath + "/**/*.jsx", 把这个暂时限制掉
        '!'+sourcePath + "/**/*.handlebars",
        '!'+sourcePath + "/**/*.tpl"
    ]);
};
var handleTransport = function(source) {
    return source
        // 可能导致重复 concat
        // .pipe(GulpChanged(distPath, {
        //     extensions: {
        //         '.handlebars': '.handlebars.js'
        //     }
        // }))
        .pipe(gulpFilter(function(file) {
            var extName = path.extname(file.path);
            if (extName === ".js" || extName === ".jsx" || extName === ".handlebars" || extName === ".tpl"){
                return true;
            }else{
                if(extName === ".css") return false;
            }
            return filterByRequire(file.path, dependencyUtils, transportConfig.rootPath);
        }))
        .pipe(GulpCmdNice.cmdTransport(transportConfig))
        .pipe(uglify({
            mangle: false,
            compress: {
                warnings: false,
                drop_console: true
            },
            beautify: false,
            report: "min",
            preserveComments: false
        }))
        .pipe(rename(function(file) {
            var extName = file.extname;
            if(extName == ".handlebars"){
                file.extname = ".handlebars.js";
            }else if(extName == ".tpl"){
                file.extname = ".tpl.js";
            }else{
                file.extname = ".js";
            }
        }))
        .pipe(gulp.dest(distPath))
        .pipe(GulpCmdNice.cmdDebug(debugOptions))
        .pipe(rename(function(file) {
            var extName = path.extname(file.basename);
            if (!extName) {
                file.extname = "-debug.js"
            }
            else {
                file.basename = StringUtils.rstrip(file.basename, {source: extName});
                file.extname = "-debug" + extName + file.extname;
            }
        }))
        .pipe(gulp.dest(distPath))
};

gulp.task("transport", function() {
    return handleTransport(getTransportSource());
});
//合并
gulp.task("concat_scripts", ["transport"], function() {
    var source = distPath + "/**/*.js";
    
    return gulp.src(source, { base: distPath + "/" })
        .pipe(gulpFilter(function(file) {
            return path.extname(file.path) === ".js";
        }))
        .pipe(GulpCmdNice.cmdConcat({
            paths: [
                distPath
            ],
            useCache: true,
            // idExtractor: function(name) {
            //     var pattern = new RegExp(idRule("(.*)", true), "g");
            //     var matched = pattern.exec(name);
            //     if (matched) {
            //         return matched[1];
            //     } else {
            //         return name;
            //     }
            // },
            total: options.concat.total,
            success: options.concat.success,
            fail: options.concat.fail
        }))
       
        .pipe(gulp.dest(distPath));
});

gulp.task("copy", function() {
    return gulp.src([
        sourcePath + "/**/*.jpg",
        sourcePath + "/**/*.jpeg",
        sourcePath + "/**/*.gif",
        sourcePath + "/**/*.png",
        sourcePath + "/**/*.eot",
        sourcePath + "/**/*.svg",
        sourcePath + "/**/*.ttf",
        sourcePath + "/**/*.woff",
        sourcePath + "/**/*.swf",
        sourcePath + "/**/*.html",
        sourcePath + "/../sea-modules/**/*"
    ]).pipe(gulp.dest(distPath));
});

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
//css压缩
gulp.task("cssmin", ["less"], function() {
    return gulp.src("./src/css/**/*.css")
        .pipe(minifyCSS({
            keepBreaks:false,
            keepSpecialComments: 0,
            benchmark: false,
            debug: false,
            compatibility: true,
            noAdvanced: true,
            processImport: true
        }))
        .pipe(rename({suffix: '-min'}))
        .pipe(gulp.dest(distPath));
});
//css 压缩
// 静态服务
gulp.task('brow', () => {
    browserSync({
        files: ['./src/css/**/*.css', './src/js/**/*.js', './src/html/**/*.html'],
        server: {
            baseDir: "./"
        }
    });
});
