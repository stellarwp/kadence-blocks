const path = require('path');

module.exports = {
    dirs: {
        modules: path.resolve('./node_modules'),
        base: path.resolve('./'),
        dist: path.resolve('./includes/assets')
    },
    sass: {},
    cleancss: {},
    babel: {
        presets: [
            '@babel/preset-env',
            '@babel/preset-react'
        ]
    },
    minify: {
        ext: {
            min: '.min.js'
        },
        noSource: true
    }
};