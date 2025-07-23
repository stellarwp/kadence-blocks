const { src, dest } = require('gulp');
const config = require('../config');

async function clean() {
	const { deleteAsync } = await import('del');
	return deleteAsync([config.dirs.dist + '/js/**', config.dirs.dist + '/css/**'], { force: true });
}

exports.clean = clean;
