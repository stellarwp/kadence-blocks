const { src, dest } = require('gulp');
const zip = require('gulp-zip');
const config = require('../config');

function createZip() {
    return src([
        config.dirs.dist + '/**/*',
        'languages/**/*',
        'readme.txt',
        'kadence-blocks.php',
        'wpml-config.xml'
    ], {base: './'})
        .pipe(zip('kadence-blocks.zip'))
        .pipe(dest('zip'));
}

exports.zip = createZip;