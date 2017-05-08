'use strict';

(function() {

    var ngTemplateCache = require('gulp-angular-templatecache');
    var del = require('del');

    module.exports = function(gulp, config) {
        gulp.task('ngTemplateCache', function() {
            return gulp.src(config.appDir + '/components/**/*.html')
                .pipe(ngTemplateCache())
                .pipe(gulp.dest(config.appDir + '/templates'));
        });

        gulp.task('cleanNgTemplateCache', function() {
            return del(config.appDir + '/templates');
        });
    };
})();
