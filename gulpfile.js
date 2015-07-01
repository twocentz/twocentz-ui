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
var nodemon = require('gulp-nodemon')

var templateCache = require('gulp-angular-templatecache');

var bases = {
 app: 'public/',
 dist: 'dist/',
};

var paths = {
 scripts: ['scripts/**/*.js'],
 bower_libs: ['bower_components/'],
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

gulp.task('start', function () {
  nodemon({
    script: 'server/server.js'
    , ext: 'js html'
    , env: { 'NODE_ENV': 'development' }
  })
});


gulp.task('watch', function() {
  gulp.watch('public/stylesheets/*.less', ['less','copy']);
  gulp.watch('public/views/**/*.html', ['templates','copy']);
  gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/vendor'], ['compress','copy']);
});

gulp.task('default', ['less', 'compress', 'templates', 'copy']);
gulp.task('build', ['less', 'compress', 'templates', 'copy']);
gulp.task('serve', ['set-env', 'less', 'compress', 'templates', 'copy', 'server','watch']);

/* Added an additional start mechanism to ensure HTML and JS files are watched using nodemon */
gulp.task('nodemon', ['set-env', 'start']);