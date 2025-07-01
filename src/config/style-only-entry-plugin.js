function StyleOnlyEntryPlugin(styleTests) {
	let list = [];

	if (styleTests instanceof RegExp) {
		list.push(styleTests);
	} else if (Array.isArray(styleTests) && styleTests.length) {
		list = styleTests;
	} else {
		list = [/\.s?css$/];
	}

	Object.assign(this, {
		styleTests: list,
	});
}

StyleOnlyEntryPlugin.prototype.isFileStyle = function (file) {
	for (const test of this.styleTests) {
		if (test.test(file)) {
			return true;
		}
	}

	return false;
};

StyleOnlyEntryPlugin.prototype.apply = function (compiler) {
	compiler.hooks.emit.tap('style-only-entry-plugin', (compilation) => {
		const chunkGraph = compilation.chunkGraph;

		for (const chunk of compilation.chunks) {
			const entryModules = chunkGraph.getChunkEntryModulesIterable(chunk);

			for (const entryModule of entryModules) {
				if (entryModule && entryModule.userRequest && this.isFileStyle(entryModule.userRequest)) {
					for (const file of chunk.files) {
						if (!this.isFileStyle(file)) {
							delete compilation.assets[file];
						}
					}
				}
			}
		}
	});
};

module.exports = StyleOnlyEntryPlugin;
