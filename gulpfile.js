/*global -$ */
'use strict';
// generated on 2015-03-12 using generator-gulp-webapp 0.3.0
var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var argv = require('yargs').argv;
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var serve = argv._.length ? argv._[0] === 'serve' : true;
var reload = browserSync.reload;

// ----------------------------
// Error notification methods
// ----------------------------

var handleError = function(task) {
  return function(err) {
      notify.onError({
        message: task + ' failed, check the logs..',
        sound: false
      })(err);
    
    gutil.log(gutil.colors.bgRed(task + ' error:'), gutil.colors.red(err));
  };
};

gulp.task('styles', function () {
  return gulp.src('app/styles/mobile.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.postcss([
      require('autoprefixer-core')({browsers: ['last 1 version']})
    ]))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/styles'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(reload({stream: true}));
});



gulp.task('html', ['styles'], function () {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});

  return gulp.src('app/*.html')
    .pipe(assets)
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest('dist'));
});

gulp.task('browserify', function () {
  
 var bundler = browserify('./app/scripts/mobile.js', {
      debug: true,
      cache: {}
    });
    if (serve) {
      bundler = watchify(bundler);
    }
    var rebundle = function() {
      return bundler.bundle()
        .on('error', handleError('Browserify'))
        .pipe(source('mobile.js'))    
        .pipe(gulp.dest('.tmp/scripts'))    
        .pipe(gulp.dest('dist/scripts/'));
    };
    bundler.on('update', rebundle);
    return rebundle();
});





gulp.task('extras', function () {
  return gulp.src([
    'app/*.*',
    '!app/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
  return gulp.src([
    'app/images/*.*'    
  ]).pipe(gulp.dest('dist/images/'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'browserify'], function () {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['.tmp', 'app']
    }
  });

  // watch for changes
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*'
  ]).on('change', reload);

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/scripts/**/*.js', ['browserify']);
});



gulp.task('build', ['html', 'browserify', 'extras'], function () {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
