import gulp from 'gulp'
import sourcemaps from 'gulp-sourcemaps'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import browserify from 'browserify'
import watchify from 'watchify'
import babel from 'babelify'
import uglify from 'gulp-uglify'
import pump from 'pump'
import browserSync from 'browser-sync'


function compile(watch) {
    var bundler = watchify(browserify('./src/index.js', { debug: true }).transform(babel));

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build'));
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...');
            rebundle();
        });
    }

    rebundle();
}

function watch() {
    return compile(true);
};

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('compress', function (cb) {
    pump([
            gulp.src('build/*.js'),
            uglify(),
            gulp.dest('compressed')
        ],
        cb
    );
});
gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['watch', 'browser-sync', 'compress']);