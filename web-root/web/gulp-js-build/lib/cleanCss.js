'use strict';
/*
	Gulp task "cleanCss" uses 'main.css' and minifies it into 'main.min.css'
*/
(function() {

    var cleanCss = require('gulp-clean-css');
    var rename = require('gulp-rename');

    module.exports = function(gulp, config) {
        gulp.task('cleanCss', function() {
            return gulp.src(config.targetDir + '/' + config.target.cssFileName + '.css')
                .pipe(rename(config.target.cssFileName + '.min.css'))
                .pipe(cleanCss())
                .pipe(gulp.dest(config.targetDir));
        });
    };

})();
