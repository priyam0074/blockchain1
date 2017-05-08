'use strict';

(function() {

    var del = require('del');

    module.exports = function(gulp, config) {
        gulp.task('clean', function() {
            return del(config.targetDir, {
                force: true
            });
        });
    };

})();
