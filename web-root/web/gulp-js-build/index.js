'use strict';

(function() {

    var gulp = require('gulp');
    var pkg = require('../package.json');
    var runSequence = require('run-sequence');
    var gulpConfig = require('./lib/config');
    var _ = require('lodash');
    var config = _.merge(gulpConfig, pkg.config);

    config.name = pkg.name;
    config.main = pkg.main;

    require('./lib/lint')(gulp, config);
    require('./lib/ngTemplateCache')(gulp, config);
    require('./lib/browserify')(gulp, config);
    require('./lib/html')(gulp, config);
    require('./lib/fonts')(gulp, config);
    require('./lib/images')(gulp, config);
    require('./lib/sass')(gulp, config);
    require('./lib/uglify')(gulp, config);
    require('./lib/cleanCss')(gulp, config);
    require('./lib/clean')(gulp, config);

    gulp.task('default', ['build']);

    gulp.task('buildjs', function() {
        return runSequence('ngTemplateCache', 'browserify', 'cleanNgTemplateCache');
    });

    gulp.task('compile', function() {
        return runSequence('lint', 'buildjs', ['html', 'fonts', 'images', 'sass']);
    });

    gulp.task('build', function() {
        return runSequence('clean', 'lint', 'ngTemplateCache', 'browserify', 'cleanNgTemplateCache', ['html', 'fonts', 'images', 'sass'], ['uglify', 'cleanCss']);
    });

    gulp.task('watch', function() {
        gulp.watch([config.appDir + '/**/*.js', config.sourceDir + '/**/*.html'], function() {
            runSequence('ngTemplateCache', 'browserify', 'cleanNgTemplateCache');
        });
        gulp.watch(config.stylesDir + '/**/*.scss', ['sass']);

        gulp.watch(config.fontsDir + '/**/*', ['fonts']);
        gulp.watch(config.imagesDir + '/**/*', ['images']);
        gulp.watch(config.sourceDir + '/index.html', ['html']);
    });

    module.exports = function() {};



})();
