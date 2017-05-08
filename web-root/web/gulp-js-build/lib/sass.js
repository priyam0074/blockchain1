'use strict';

(function() {

    var sass = require('gulp-sass');
    var sourcemaps = require('gulp-sourcemaps');

    module.exports = function(gulp, config) {
        gulp.task('sass', function() {
            return gulp.src(config.source.stylesDir + '/' + config.target.cssFileName + '.scss')
                .pipe(sourcemaps.init())
                .pipe(sass().on('error', sass.logError))
                .pipe(sourcemaps.write())
                .pipe(gulp.dest(config.targetDir));
        });
    };
})();
