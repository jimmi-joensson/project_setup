var gulp = require('gulp');
var gulpsass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var gutil = require('gulp-util');
var browsersync = require('browser-sync').create();

var reportError = function (error) {
    var lineNumber = (error.lineNumber) ? 'LINE ' + error.lineNumber + ' -- ' : '';

    notify({
        title: 'Task Failed [' + error.plugin + ']',
        message: lineNumber + 'See console.',
        sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
    }).write(error);

    gutil.beep(); // Beep 'sosumi' again

    // Inspect the error object
    //console.log(error);

    // Easy error reporting
    //console.log(error.toString());

    // Pretty error reporting
    var report = '';
    var chalk = gutil.colors.white.bgRed;

    report += chalk('TASK:') + ' [' + error.plugin + ']\n';
    report += chalk('PROB:') + ' ' + error.message + '\n';
    if (error.lineNumber) { report += chalk('LINE:') + ' ' + error.lineNumber + '\n'; }
    if (error.fileName)   { report += chalk('FILE:') + ' ' + error.fileName + '\n'; }
    console.error(report);

    // Prevent the 'watch' task from stopping
    this.emit('end');
};

gulp.task('sass', function() {
  return gulp.src('my_project/assets/sass/i.scss')
      .pipe(plumber({
          errorHandler: reportError
      }))
      .pipe(sourcemaps.init())
        .pipe(gulpsass())
        .pipe(cssnano())
      .pipe(sourcemaps.write())
      .pipe(plumber.stop())
      .pipe(gulp.dest('my_project/css'))
      .pipe(browsersync.stream());
});

gulp.task('js', function() {
    return gulp.src([
        'bower_components/jquery/dist/jquery.js',
        'bower_components/bootstrap-sass/assets/javascripts/bootstrap.js',
        'my_project/assets/js/main.js'
    ])
        .pipe(plumber({
            errorHandler: reportError
        }))
    .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(uglify())
    .pipe(sourcemaps.write())
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