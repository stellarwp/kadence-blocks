const { src, dest } = require('gulp');
const { rm } = require('fs/promises');
const config = require('../config');

async function clean() {
	await Promise.all([
		rm(config.dirs.dist + '/js', { recursive: true, force: true }),
		rm(config.dirs.dist + '/css', { recursive: true, force: true }),
	]);
	return Promise.resolve();
}

exports.clean = clean;
