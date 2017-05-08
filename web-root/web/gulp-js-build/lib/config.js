'use strict';

(function() {

    module.exports = {
        appDir: './app',
        targetDir: '../../public',
        source: {
            sassPaths: ['./app/**/*', './node_modules/bootstrap/'],
            fontPaths: ['./fonts/**/*', './node_modules/bootstrap-sass/assets/fonts/**/*','./node_modules/font-awesome/fonts/**/*'],
            imagePaths: ['./images/**/*'],
            stylesDir: './styles'
        },
        target: {
            cssFileName: 'main',
            fontDir: ['fonts'],
            imageDir: ['images']
        }
    };

})();
