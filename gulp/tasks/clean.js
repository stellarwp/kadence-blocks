const { src, dest } = require('gulp');
const del  = require('del');

function clean() {
    return del(['dist/**', '!dist'], { force: true });
}

exports.clean = clean;