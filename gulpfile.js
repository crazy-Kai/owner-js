// 定义
const gulp = require('gulp'),
    babel = require('gulp-babel');
    
 
// 任务
gulp.task('default', ['watch']);

// 观察者
var matchRex = /(src.*)\/.*\.*/;
gulp.task('watch', () => {
    gulp.watch(['src/**/*.babel', 'src/**/*.jsx'])
        .on('change', (e) => {
            var match = e.path.replace(/\\/g, '/').match( matchRex ),
                file = match[0];
            // console.log('File ' + file + ' was ' + e.type);
            gulp.src( file )
                .pipe( babel( { presets: ['es2015', 'react'] } ).on('error', (e) => {
                    console.error('error', e.message);
                }) )
                .pipe(gulp.dest( match[1] ));
        });
});

// // 静态服务
// gulp.task('brow', () => {
//     browserSync({
//         files: ['src/css/**/*.css', 'src/js/**/*.js', 'src/html/**/*.html'],
//         server: {
//             baseDir: "./"
//         }
//     });
// });