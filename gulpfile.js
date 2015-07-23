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

var templateCache = require('gulp-angular-templatecache');

var bases = {
 app: 'public/',
 dist: 'dist/'
};

var paths = {
  scripts: ['scripts/**/*.js'],
  bower_libs: [
    "bower_components/jquery/dist/jquery.js",
    "bower_components/angular/angular.js",
    "bower_components/angular-strap/dist/angular-strap.js",
    "bower_components/angular-strap/dist/angular-strap.tpl.js",
    "bower_components/angular-animate/angular-animate.js",
    "bower_components/angular-cookies/angular-cookies.js",
    "bower_components/angular-messages/angular-messages.js",
    "bower_components/angular-resource/angular-resource.js",
    "bower_components/angular-ui-router/release/angular-ui-router.js",
    "bower_components/angular-animate/angular-animate.js",
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
  minified: ['*.min.js','templates.js'],
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
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(bases.app));
});

gulp.task('templates', function() {
  return gulp.src('public/scripts/templates/**/*.html')
    .pipe(templateCache({ root: 'html', module: 'MyApp' }))
    .pipe(gulp.dest(bases.app));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean', 'compress', 'less', 'templates'], function() {
 
 // Copy styles
  gulp.src(paths.style + "*.css", {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'css'));
 
  gulp.src(paths.minified, {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));

  gulp.src(paths.bower_libs,  {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'libs'));

  gulp.src(paths.bower_css,  {cwd: bases.app})
    .pipe(gulp.dest(bases.dist + 'css'));
    
  gulp.src('*.png', {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));

  gulp.src('index.html',  {cwd: bases.app})
    .pipe(gulp.dest(bases.dist));
});

gulp.task('server', function() {
  server.run(['server/server.js']);
});

gulp.task('watch', function() {
  gulp.watch('public/style/*.less', ['copy']);
  gulp.watch('public/scripts/templates/**/*.html', ['copy']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/bower_components'], ['copy']);
});

gulp.task('default', ['less', 'compress', 'templates', 'copy']);
gulp.task('build', ['copy']);
gulp.task('serve', ['set-env', 'copy', 'server','watch']);
gulp.task('prod', ['copy', 'server']);