'use strict';

(function() {

    module.exports = function(gulp, config) {
        gulp.task('images', function() {
            gulp.src(config.source.imagePaths)
                .pipe(gulp.dest(config.targetDir + '/' + config.target.imageDir));
        });
    };
})();
