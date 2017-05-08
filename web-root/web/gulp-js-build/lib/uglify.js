'use strict';
/*
	Gulp task "uglify" uses 'index.js' and minifies it into 'index.min.js'
*/
(function() {

    var uglify = require('gulp-uglify');
    var rename = require('gulp-rename');
    var sourcemaps = require('gulp-sourcemaps');

    module.exports = function(gulp, config) {
        gulp.task('uglify', function() {
            return gulp.src(config.targetDir + '/' + config.main)
                .pipe(sourcemaps.init())
                .pipe(rename('index.min.js'))
                .pipe(uglify())
                .pipe(sourcemaps.write('./'))
                .pipe(gulp.dest(config.targetDir + '/'));
        });
    };

})();
