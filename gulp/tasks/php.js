const { src, dest } = require("gulp");

function php() {
    return src('static/**/*', { base: 'static' })
        .pipe(dest('dist/'));
}

exports.php = php;