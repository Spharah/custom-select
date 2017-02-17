// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var templateCache = require('gulp-angular-templatecache');
var del = require('del');

//Clean dist folder
gulp.task('clean:dist', function(){
    return del([
        'dist/**/*'
    ]);
});

//Cache template files
gulp.task('templates',function(){
   return gulp.src(['app/core/**/*.html'])
   .pipe(templateCache('templates.js', {module:'app.core',standalone:false, root:'core', transformUrl:function(url){
       return url.replace(url.substring(0, url.lastIndexOf('\\')+1),'core.tpl.');       
   }}))
   .pipe(gulp.dest('dist/tpl'))
});

// Lint Task
gulp.task('lint', function() {
    return gulp.src([
        'app/core/*.js',
        'app/core/**/*.js'])
        .pipe(jshint({asi:true}))
        .pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
        'app/core/core.module.js',
        'app/core/**/*.js',
        'dist/tpl/*.js'])
        .pipe(concat('core.all.js', {newLine : '\n;'}))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('core.all.min.js'))
        .pipe(uglify({output:{beautify:false}}))
        .pipe(gulp.dest('dist/js'));
});

//Concatenate && Minify CSS
gulp.task('css', function(){
  return gulp.src(['app/core/**/*.css'])
    .pipe(concat('core.all.css', {newLine : '\n'}))
  .pipe(gulp.dest('dist/css'))
    .pipe(cssmin())
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('dist/css'))    
});

// Watch Files For Changes
gulp.task('watch', function() {    
    gulp.watch('app/**/*.js', ['lint', 'scripts']);
    gulp.watch('app/core/**/*.css', ['css']);
    gulp.watch('app/core/**/*.html', ['lint', 'templates', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'templates', 'scripts', 'css', 'watch']);