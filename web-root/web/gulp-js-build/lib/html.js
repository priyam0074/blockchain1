'use strict';

(function() {

    module.exports = function(gulp, config) {
        gulp.task('html', function() {
            gulp.src([config.appDir + '/*.html'])
                .pipe(gulp.dest(config.targetDir));
        });
    };
})();
