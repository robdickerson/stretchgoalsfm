var child = require('child_process');
var browserSync = require('browser-sync').create();
var fs = require('fs');

const siteRoot = '_site';

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

gulp.task('jekyll', function () {

    var jekyll_process = process.platform === "win32" ? "jekyll.bat" : "jekyll";

    const jekyll = child.spawn(jekyll_process, ['build',
        '--watch',
        '--incremental' /*,
        '--drafts'*/
    ]);

    const jekyllLogger = function(buffer) {
        buffer.toString()
            .split(/\n/)
            .forEach(function(message) { plugins.util.log('Jekyll: ' + message)});
    };

    jekyll.stdout.on('data', jekyllLogger);
    jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', function() {
    browserSync.init({
        files: [siteRoot + '/**', '!'+siteRoot + 'feed.xml','!'+siteRoot + 'feed.xslt.xml'],
        port: 4000,
        server: {
            baseDir: siteRoot
        }
    });

    gulp.watch('assets/**/*.scss', ['styles']);
    gulp.watch('assets/components/bootstrap/sass/**/*.scss', ['bootstrap']);
});

var aws = JSON.parse(fs.readFileSync('aws.json'));
var publisher = plugins.awspublish.create(aws);

gulp.task('deploy', ['styles', 'jekyll'], function () {

    var headers = { 'Cache-Control': 'max-age=3600, no-transform, public' };

    return gulp.src(siteRoot+'/**')
        .pipe(publisher.publish(headers))
        .pipe(publisher.sync())
        .pipe(plugins.awspublish.reporter());

});

gulp.task('default', ['styles','jekyll','serve']);

