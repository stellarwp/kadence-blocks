const { src, dest } = require("gulp");
const config = require('../config');

function php() {
    return src('static/**/*', { base: 'static' })
        .pipe(dest(config.dirs.dist));
}

exports.php = php;