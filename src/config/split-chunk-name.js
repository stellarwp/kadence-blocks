const crypto = require('crypto');

class SplitChunksName {
	constructor() {
		this.cache = new WeakMap();
	}

	name(module, chunks, cacheGroup) {
		const automaticNamePrefix = cacheGroup === 'vendors' ? 'vendors' : '',
			automaticNameDelimiter = '-';

		let cacheEntry = this.cache.get(chunks);
		if (cacheEntry === undefined) {
			cacheEntry = {};
			this.cache.set(chunks, cacheEntry);
		} else if (cacheGroup in cacheEntry) {
			return cacheEntry[cacheGroup];
		}
		const names = chunks.filter((c) => !!c.name).map((c) => c.name.split('/'));
		if (!names.length || !names.every(Boolean)) {
			cacheEntry[cacheGroup] = undefined;
			return;
		}
		names.sort((a, b) => b.length - a.length);
		const prefix = typeof automaticNamePrefix === 'string' ? automaticNamePrefix : cacheGroup;
		const namePrefix = prefix ? prefix + '/' : '';

		/*
		[
			[ 'dashboard', 'dashboard' ]
			[ 'dashboard', 'widget' ],
		]
		-> 'dashboard/dashboard~widget'

		[
			[ 'dashboard', 'dashboard' ]
			[ 'fingerprinting', 'manager' ],
		]
		-> 'dist/dashboard-dist-dashboard~fingerprinting-dist-manager'
		 */

		let name = '';
		const max = names[0].length;

		for (let i = 0; i < max; i++) {
			if (this.allAtPosSame(names, i)) {
				name += names[0][i] + '/';
			} else {
				name = '';
				name += names[0].slice(0, i).join('/') + '/';
				name +=
					names
						.map((parts) => parts[i])
						.filter((part) => typeof part === 'string')
						.join(automaticNameDelimiter) + '/';
			}
		}

		name = namePrefix + name;

		if ('/' === name.charAt(name.length - 1)) {
			name = name.substring(0, name.length - 1);
		}

		if (name.length > 100) {
			name = name.slice(0, 100) + automaticNameDelimiter + this.hashFilename(name);
		}

		cacheEntry[cacheGroup] = name;
		return name;
	}

	allAtPosSame(list, pos) {
		let prev = null;

		for (const item of list) {
			if (prev === null) {
				prev = item[pos];
			} else if (prev !== item[pos]) {
				return false;
			}
		}

		return true;
	}

	hashFilename(name) {
		return crypto.createHash('md4').update(name).digest('hex').slice(0, 8);
	}
}

module.exports = SplitChunksName;
