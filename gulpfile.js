var gulp = require('gulp');
var gulpsass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browsersync = require('browser-sync').create();

function errorLog(error) {
    console.error.bind(console);
    this.emit('end');
}

gulp.task('sass', function() {
  gulp.src('my_project/assets/sass/i.scss')
      .pipe(gulpsass()
          .on('error', gulpsass.logError))
      .pipe(cssnano())
      .pipe(gulp.dest('my_project/css'))
      .pipe(browsersync.stream());
});

gulp.task('js', function() {
    gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
        'my_project/assets/js/main.js'
    ])
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest('my_project/js'));
});

gulp.task('browser-sync', function() {
    browsersync.init({
        proxy: 'localhost/project_setup/my_project'
    });
});

gulp.task('watch', function() {
    gulp.watch('my_project/assets/sass/*.scss', ['sass']);
    gulp.watch('my_project/assets/js/*.js', ['js']);
    gulp.watch('my_project/**/*.php').on('change', browsersync.reload);
});

gulp.task('default', ['sass', 'js', 'browser-sync', 'watch']);