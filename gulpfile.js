// var config = {
//   src: "src", // 要搬运的目录
//   moveTo: "daka",  // 搬运去的目录
//   scss: "yjzx",  // 要编译的scss目录
//   dest: "yjzx",  // 编译scss输出的目录
//   server: "src", // 服务器根目录
//   // server: "./", // 服务器根目录
//   target: "index.html" // 要监视(执行)的html文件
//
// };
var config = {
  src: "src", // 要搬运的目录
  moveTo: "dest",  // 搬运去的目录

  scss: "src",  // 要编译的scss目录
  dest: "src",  // 编译scss输出的目录
  server: "src", // 服务器根目录
  target: "index.html" // 要监视(执行)的html文件

  // scss: "h5/mobile/snjc",  // 要编译的scss目录
  // dest: "h5/mobile/snjc",  // 编译scss输出的目录
  // server: "h5", // 服务器根目录
  // target: "index.html" // 要监视(执行)的html文件

};
// 一次安装
// npm install pump gulp-sass gulp-clean gulp-autoprefixer gulp-clean-css gulp-imagemin gulp-changed gulp-sourcemaps gulp-uglify run-sequence gulp-rename gulp-htmlmin gulp-postcss imagemin-pngquant gulp-cache gulp-concat del browser-sync --save-dev
var gulp = require('gulp'),
  // clean = require('gulp-clean'),
  pump = require('pump'),
  autoprefixer = require('gulp-autoprefixer'),
  runSequence = require('run-sequence'),
  postcss = require('gulp-postcss'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps');
  // babel = require('gulp-babel');
  browserSync = require('browser-sync').create(),
  fileinclude  = require('gulp-file-include');

  // 合并html文件
  gulp.task('htmlInclude', function() {
    gulp.src(config.src + '/html/**.html')
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
      }))
      .pipe(gulp.dest(config.src));
  });

var reload = browserSync.reload;
// 同步更新浏览器
gulp.task('browser', function () {
  browserSync.init({
    // files: ['**'],  // 修改HTML也刷新
    server: {
      baseDir: config.server,  // 设置服务器的根目录
      index: config.target // 指定默认打开的文件
    },
    port: 8050  // 指定访问服务器的端口号
  });

});

// 清理目标目录
gulp.task('clean', function (cb) {
  pump([
    gulp.src(config.moveTo),
    clean()
  ], cb);
});

// 编译es6
gulp.task('es6', function () {
    return gulp.src(config.scss + '/js/index.js')
      .pipe(babel())
      .pipe(gulp.dest(config.src + '/js2/'))
});


// 编译,合并,重命名,加前缀,压缩
gulp.task('scss', [], function (cb) {
  pump([
      gulp.src([config.scss + '/scss/*.scss', 'style/*.scss']),
      sass(),
      // concat('index.css'),  //合并后的文件名
      // rename({suffix: '.min'}),
      // changed(config.src, { extension: '.css'}),
      sourcemaps.init(),
      postcss(
        autoprefixer() // 已在postcss.config.js 配置
      ),
      // minifyCss(
      //   {keepSpecialComments: '*'}
      //   //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
      // ),
      sourcemaps.write('.'),
      gulp.dest(config.dest + '/css')
    ], cb
  );
});

// 搬运文件
gulp.task('move', function () {
  return gulp.src([config.src + '/**/*.{css,js,html}', config.src + '/**/*.{png,jpg}', config.src + '/**/*.{ttf,woff}','!' + config.src + '/*/views/*/scss/', '!' + config.src + '/styles/'])
    .pipe(gulp.dest(config.moveTo));
});

// 监听文件变改
gulp.task('watch', [], function(cb) {
  gulp.watch([config.scss + "/scss/*.scss", config.scss + "/style/*.scss"], ['scss']);
  gulp.watch([config.src + '/html/**.html', config.src + '/include/**.html'], ['htmlInclude']);
  gulp.watch(config.src + '/css/*.css').on('change',reload);
  gulp.watch(config.src + '/*.html').on('change',reload);
});

// 默认任务, 编译scss,浏览器同步,监听scss
gulp.task('default', ['bw']);

// 先清除 后移动文件
gulp.task('cm', function (cb) {
  runSequence('clean', 'move', cb);
});

// 合并html,编译scss,开启浏览器,监听
gulp.task('bw', function (cb) {
  runSequence('htmlInclude', 'scss', 'browser', 'watch', cb);
});