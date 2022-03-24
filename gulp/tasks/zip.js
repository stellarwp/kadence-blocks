const { src, dest } = require('gulp');
const zip = require('gulp-zip');

function createZip() {
    return src([
        'dist/**/*',
        'languages/**/*',
        'readme.txt',
        'kadence-blocks.php',
        'wpml-config.xml'
    ], {base: './'})
        .pipe(zip('kadence-blocks.zip'))
        .pipe(dest('zip'));
}

exports.zip = createZip;