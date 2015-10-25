var gulp = require('gulp');
var less = require('gulp-less');
var csso = require('gulp-csso');
var env = require('gulp-env');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var server = require('gulp-express');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var merge = require('merge-stream');

var templateCache = require('gulp-angular-templatecache');

var bases = {
 app: 'public/',
 dist: 'dist/'
};

var paths = {
  scripts: ['scripts/**/*.js'],
  bower_libs: [
    // "bower_components/jquery/dist/jquery.js",
    "bower_components/angular/angular.min.js",
    "bower_components/angular-strap/dist/angular-strap.js",
    "bower_components/angular-strap/dist/angular-strap.tpl.js",
    "bower_components/angular-animate/angular-animate.js",
    "bower_components/angular-cookies/angular-cookies.js",
    "bower_components/angular-messages/angular-messages.js",
    "bower_components/angular-resource/angular-resource.js",
    "bower_components/angular-ui-router/release/angular-ui-router.js",
    "bower_components/angular-animate/angular-animate.js",
    "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
    "bower_components/moment/min/moment.min.js",
    "bower_components/stormpath-sdk-angularjs/dist/stormpath-sdk-angularjs.js",
    "bower_components/stormpath-sdk-angularjs/dist/stormpath-sdk-angularjs.tpls.js",
    "bower_components/jqcloud2/dist/jqcloud.min.js",
    "bower_components/angular-jqcloud/angular-jqcloud.js"
  ],
  bower_css:  [
    "bower_components/angular-motion/dist/angular-motion.min.css",
    "bower_components/bootstrap-additions/dist/bootstrap-additions.css",
    "bower_components/jqcloud2/dist/jqcloud.min.css"
  ],
  vendor: ['vendor/*.js'],
  minified: ['*.min.js','*.map','templates.js'],
  style: ['style/']
};


gulp.task('set-env', function () {
    env({
        file: "./server/config/local.env",
        vars: {
            //any vars you want to overwrite
        }
    });
});

// Delete the dist directory
gulp.task('clean', function() {
 return gulp.src(bases.dist)
 .pipe(clean());
});

gulp.task('less', function() {
  return gulp.src(paths.style + '*.less', {cwd: bases.app})
    .pipe(plumber())
    .pipe(less())
    .pipe(csso())
    .pipe(gulp.dest(bases.app + "/style"));
});

gulp.task('compress', function() {
  return gulp.src(paths.scripts, {cwd: bases.app})
    .pipe(sourcemaps.init())
    .pipe(concat('app.min.js', {newLine: ';'}))
    .pipe(ngAnnotate({add:true}))
    .pipe(uglify({compress: {sequences: false, join_vars: false}}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(bases.dist));
});

gulp.task('templates', function() {
  return gulp.src('public/scripts/templates/**/*.html')
    .pipe(templateCache({ root: 'html', module: 'TwoCentzWeb' }))
    .pipe(gulp.dest(bases.dist));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean', 'compress', 'less', 'templates'], function() {
 
 // Copy styles
  var style = gulp.src(paths.style + "*.css", {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'css'));

  var libs = gulp.src(paths.bower_libs,  {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'libs'));

  var css = gulp.src(paths.bower_css,  {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'css'));
    
  var img = gulp.src('*.png', {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));


  return merge(style, libs, css, img);
});


gulp.task('indexCopy',['copy'], function () {
  return gulp
      .src('index.html',  {cwd: bases.app})
      .pipe(gulp.dest(bases.dist))
});

gulp.task('inject', ['indexCopy'], function() {
  var target = gulp.src('index.html',  {cwd: bases.dist});
  return target
      .pipe(inject(
          gulp.src([bases.dist + 'libs/**/*.js', '!' + bases.dist + 'libs/angular.min.js']).pipe(angularFilesort()), {relative: true}
      ))
      .pipe(gulp.dest(bases.dist));
});

gulp.task('server', function() {
  server.run(['server/server.js']);
});

gulp.task('watch', function() {
  gulp.watch('public/style/*.less', ['inject']);
  gulp.watch('public/scripts/templates/**/*.html', ['inject']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/bower_components'], ['inject']);
});


// runnable gulp tasks:

gulp.task('default', ['build']);

gulp.task('serve', ['set-env', 'inject', 'server', 'watch']);

gulp.task('prod', ['inject', 'server']);

gulp.task('build', ['inject']);



