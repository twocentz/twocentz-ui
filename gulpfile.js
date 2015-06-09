var gulp = require('gulp');
var less = require('gulp-less');
var csso = require('gulp-csso');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var clean = require('gulp-clean');
var server = require('gulp-express');

var templateCache = require('gulp-angular-templatecache');

var bases = {
 app: 'public/',
 dist: 'dist/',
};

var paths = {
 scripts: ['scripts/**/*.js'],
 bower_libs: ['bower_modules/jquery/dist/jquery.js'],
 vendor: ['vendor/*.js'],
 minified: ['*.min.js','templates.js'],
 style: ['style/']
};

// Delete the dist directory
gulp.task('clean', function() {
 return gulp.src(bases.dist)
 .pipe(clean());
});

gulp.task('less', function() {
  gulp.src(paths.style + '*.less', {cwd: bases.app})
    .pipe(plumber())
    .pipe(less())
    .pipe(csso())
    .pipe(gulp.dest(bases.app + "/style"));
});

gulp.task('compress', function() {
  gulp.src(paths.scripts, {cwd: bases.app})
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(gulp.dest(bases.app));
});

gulp.task('templates', function() {
  gulp.src('public/scripts/views/**/*.html')
    .pipe(templateCache({ root: 'views', module: 'MyApp' }))
    .pipe(gulp.dest(bases.app));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
 
 // Copy styles
 gulp.src(paths.style + "*.css", {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'css'));
 
 // Copy lib scripts, maintaining the original directory structure
 //gulp.src(paths.libs, {cwd: bases.app +'vendor**'})
 gulp.src(paths.vendor, {cwd: bases.app +'**'})
 .pipe(gulp.dest(bases.dist));
 

 gulp.src(paths.minified, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));
});

gulp.task('server', function() {
  server.run(['server/server.js']);
});

gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.less', ['less','copy']);
  gulp.watch('public/views/**/*.html', ['templates','copy']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/vendor'], ['compress','copy']);
});

gulp.task('default', ['less', 'compress', 'templates', 'copy']);
gulp.task('build', ['less', 'compress', 'templates', 'copy']);
gulp.task('serve', ['less', 'compress', 'templates', 'copy', 'server','watch']);

