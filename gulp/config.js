const path = require('path');

module.exports = {
    modulesDir: path.resolve('./node_modules'),
    baseDir: path.resolve('./'),
    distDir: path.resolve('./dist'),
    sass: {},
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