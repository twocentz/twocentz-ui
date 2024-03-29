var gulp = require('gulp');
var less = require('gulp-less');
var csso = require('gulp-csso');
var env = require('gulp-env');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var del = require('del');
var server = require('gulp-express');
var sourcemaps = require('gulp-sourcemaps');
var inject = require('gulp-inject');
var angularFilesort = require('gulp-angular-filesort');
var merge = require('merge-stream');
var psi = require('psi');
var jshint = require('gulp-jshint');
var rev = require('gulp-rev');
var revReplace = require("gulp-rev-replace");

var site = 'https://twocentz-ui-stage.herokuapp.com/';
var key = '';




var templateCache = require('gulp-angular-templatecache');

var bases = {
 app: 'public/',
 dist: 'dist/'
};

var paths = {
  scripts: ['scripts/**/*.js'],
  bower_libs: [
    "bower_components/angular/angular.min.js",
    "bower_components/angular-toastr/dist/angular-toastr.tpls.min.js",
    "bower_components/angular-local-storage/dist/angular-local-storage.min.js",
    "bower_components/angular-busy/dist/angular-busy.min.js",
    "bower_components/angular-masonry-directive/src/angular-masonry-directive.js",
    "bower_components/stormpath-sdk-angularjs/dist/stormpath-sdk-angularjs.min.js",
    "bower_components/stormpath-sdk-angularjs/dist/stormpath-sdk-angularjs.tpls.min.js",
    "bower_components/jqcloud2/dist/jqcloud.min.js",
    "bower_components/angular-jqcloud/angular-jqcloud.js",
    "bower_components/cloudinary_js/js/jquery.cloudinary.js",
    "bower_components/ng-file-upload/ng-file-upload-shim.min.js",
    "bower_components/cloudinary_ng/js/angular.cloudinary.js",
    "bower_components/ng-file-upload/ng-file-upload.min.js",
    "bower_components/rrssb/js/rrssb.min.js",
    "bower_components/ng-mfb/mfb/dist/lib/modernizr.touch.js",
    "bower_components/ng-mfb/src/mfb-directive.js"
  ],
  bower_css:  [
    "bower_components/angular-motion/dist/angular-motion.min.css",
    "bower_components/angular-toastr/dist/angular-toastr.min.css",
    "bower_components/angular-busy/dist/angular-busy.min.css",
    "bower_components/bootstrap-additions/dist/bootstrap-additions.css",
    "bower_components/jqcloud2/dist/jqcloud.min.css",
    "bower_components/rrssb/css/rrssb.css",
    "bower_components/ng-mfb/mfb/dist/mfb.min.css"
  ],
  vendor: ['vendor/*.js'],
  minified: ['*.min.js','*.map','templates.js'],
  style: ['style/']
};

// Delete the dist directory
gulp.task('clean', function() {
  return del([
     // here we use a globbing pattern to match everything inside the `mobile` folder
     bases.dist + '**/*',
   ]);
});

gulp.task('set-env', function () {
  env({
       file: "./server/config/local.env",
       vars: {
           //any vars you want to overwrite
       }
   });
});

gulp.task('less', function() {
  return gulp.src(paths.style + '*.less', {cwd: bases.app})
    .pipe(plumber())
    .pipe(less())
    .pipe(csso())
    .pipe(gulp.dest(bases.app + "/style"));
});

gulp.task('lint', function() {
  return gulp.src(paths.scripts, {cwd: bases.app})
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('compress', function() {
  return gulp.src(paths.scripts, {cwd: bases.app})
    .pipe(sourcemaps.init())
    .pipe(concat('app.js', {newLine: ';'}))
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

  var html = gulp.src('*.html', {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));

  return merge(style, libs, css, img, html);
});


gulp.task('minify',['copy'], function () {

  var concat_lib = gulp.src([bases.dist + 'libs/**/*.js', '!' + bases.dist + 'libs/angular.min.js'])
    .pipe(angularFilesort())
    .pipe(concat('libs.js'))
    //.pipe(uglify())
    .pipe(gulp.dest(bases.dist));

  var concat_css = gulp.src([bases.dist + 'css/**/*.css'])
    .pipe(concat('style.css'))
    .pipe(gulp.dest(bases.dist));

  var copy_index = gulp.src('index.html',  {cwd: bases.app})
      .pipe(gulp.dest(bases.dist));


  return merge(concat_lib, concat_css, copy_index);
});


gulp.task("revision", ["minify"], function(){
  return gulp.src([bases.dist + '*.js', bases.dist + '*.css'])
    .pipe(rev())
    .pipe(gulp.dest(bases.dist))
    .pipe(rev.manifest())
    .pipe(gulp.dest(bases.dist))
})

gulp.task("complete", ["revision"], function(){
  var manifest = gulp.src(bases.dist + "rev-manifest.json");

  return gulp.src(bases.dist + "index.html")
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest(bases.dist));
});

gulp.task('server', function() {
  server.run(['server/server.js']);
});

gulp.task('watch', function() {
  gulp.watch('public/style/*.less', ['complete']);
  gulp.watch('public/scripts/templates/**/*.html', ['complete']);
  gulp.watch(['public/**/*.js', '!public/bower_components'], ['complete']);
});


// runnable gulp tasks:

gulp.task('default', ['build']);

gulp.task('serve', ['set-env', 'lint', 'complete', 'server', 'watch']);

gulp.task('prod', ['complete', 'server']);

gulp.task('build', ['lint', 'complete']);

//google psi score task https://developers.google.com/speed/pagespeed/insights/
gulp.task('psi-score', function () {
    return psi(site, {
        // key: key
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
        console.log('Speed score (max 100): ' + data.ruleGroups.SPEED.score);
        console.log('Usability score (max 100): ' + data.ruleGroups.USABILITY.score);
    });
});
