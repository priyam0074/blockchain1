'use strict';

(function() {
    module.exports = function(gulp, config) {
        gulp.task('fonts', function() {
            gulp.src(config.source.fontPaths)
                .pipe(gulp.dest(config.targetDir + '/' + config.target.fontDir));
        });
    };
})();
