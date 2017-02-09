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
import stylus from 'gulp-stylus'

function compile(watch) {
    var bundler = watchify(browserify('./src/js/index.js', { debug: true }).transform(babel))

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end') })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({ loadMaps: true }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.stream())
    }

    if (watch) {
        bundler.on('update', function() {
            console.log('-> bundling...')
            rebundle()
        })
    }

    rebundle()
}

function watch() {
    return compile(true);
};

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        open : false
    })

    gulp.watch('./src/js/**/*.js', ['build'])
    gulp.watch('./src/style/*.styl', ['stylus'])

})

gulp.task('stylus', function () {
    return gulp.src('./src/style/*.styl')
        .pipe(stylus())
        .pipe(gulp.dest('./build/style'))
        .pipe(browserSync.stream())
})


gulp.task('compress', function (cb) {
    pump([
            gulp.src('build/*.js'),
            uglify(),
            gulp.dest('compressed')
        ],
        cb
    )
})

gulp.task('build', function() { return compile() })
gulp.task('watch', function() { return watch() })

gulp.task('default', ['watch', 'browser-sync'])
gulp.task('minify', ['compress'])