const { src, dest } = require('gulp');
const babel = require('gulp-babel')

function buildJs() {
    return src('src/blocks/**/*.js')
        .pipe(babel({
            presets: [
                '@babel/preset-env',
                '@babel/preset-react'
            ]
        }))
        .pipe(dest('dist/'));
}

exports.js = buildJs;