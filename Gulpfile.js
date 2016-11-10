//Init variables
var gulp = require('gulp'),

    firstRun = true,
    cleanOnce = true,

    // Load all the gulp Plugins
    plugins = require('gulp-load-plugins')(
    {
        pattern: ['gulp-*', 'gulp.*', 'karma'],
        replaceString: /\bgulp[\-.]/
    });

// Compile SASS to CSS
gulp.task('styles', ['clean'], function () {

    return gulp.src('assets/sass/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))

        // Init the sourcemaps
        .pipe(plugins.sourcemaps.init())

        // Concat the files
        .pipe(plugins.concat('site.css'))

        // Finalize the sourcemaps
        .pipe(plugins.sourcemaps.write('./'))

        //.pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('assets/css'))

});

gulp.task('bootstrap', function() {

    return gulp.src('assets/components/bootstrap/sass/*.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(gulp.dest('assets/components/bootstrap/css'))
});

// // Clean the build directories
gulp.task('clean', function () {

    if (cleanOnce) {

        cleanOnce = false;

        return gulp.src([
            'assets/css/*'
        ]).pipe(plugins.clean());

    }

});


gulp.task('default', [], function () {
    gulp.watch('assets/**/*.scss', ['styles']);
    gulp.watch('assets/components/bootstrap/sass/**/*.scss', ['bootstrap']);
});

