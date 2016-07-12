// 定义
const gulp = require('gulp'),
    babel = require('gulp-babel');
    
 
// 任务
gulp.task('default', ['watch']);

//观察者
// var matchRex = /(src.*)\/.*\..*/;
// gulp.task('watch', () => {
//     gulp.watch(['src/**/*.babel', 'src/**/*.jsx'])
//         .on('change', (e) => {
//             var match = e.path.replace(/\\/g, '/').match( matchRex ),
//                 file = match[0];
//                 console.log(e)
//             gulp.src( file )
//                 .pipe( babel( { presets: ['es2015', 'react'] } ).on('error', (e) => {
//                     console.error( "error", e.message);
//                 }) )
//                 .pipe(gulp.dest( match[1] ));
             
//         });
// });
//babel
 // gulp.task('babel',() => {
 //     gulp.src('src/**/*.jsx')
 //     .pipe(babel({presets:['es2015','react']}).on("error",function(e){
 //            console.error("error",e.message);
 //     }))
 //     .pipe(gulp.dest('src'))

 // });
 // gulp.task('watch',() => {
 //   gulp.watch(['src/**/*.babel','src/**/*.jsx'],['babel'])
 //   .on('change',(e) => {
 //    console.log(e.path+" was "+e.type+',running tasks....[babel]')
 //   })

 // })
 // //观察者
 var matchRex = /(src.*)\/.*\.*/;
   gulp.task("watch",() =>{
     gulp.watch(['src/**/*.babel','src/**/*.jsx']).on('change',(e)=>{
         var match = e.path.replace(/\\/g,"/").match(matchRex),
            files = match[0];
            console.log(files,match[1])
            gulp.src(files)
            .pipe(babel({presets:['es2015','react','stage-0']}).on('error',(e) =>{
              console.error('error:'+e.message);
            }))
            .pipe(gulp.dest(match[1]));
     })

   })  

// // 静态服务
// gulp.task('brow', () => {
//     browserSync({
//         files: ['src/css/**/*.css', 'src/js/**/*.js', 'src/html/**/*.html'],
//         server: {
//             baseDir: "./"
//         }
//     });
// });