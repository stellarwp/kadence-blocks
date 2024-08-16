class StyleOnlyEntryPlugin {
	constructor(styleTests) {
		if (styleTests instanceof RegExp) {
			this.styleTests = [styleTests];
		} else if (Array.isArray(styleTests) && styleTests.length) {
			this.styleTests = styleTests;
		} else {
			this.styleTests = [/\.s?css$/];
		}
	}

	isFileStyle(file) {
		// Use some() for early exit if a match is found
		return this.styleTests.some((test) => test.test(file));
	}

	apply(compiler) {
		compiler.hooks.emit.tap('StyleOnlyEntryPlugin', (compilation) => {
			const chunkGraph = compilation.chunkGraph;

			for (const chunk of compilation.chunks) {
				// Use the ChunkGraph API to get the entry modules for this chunk
				const entryModules = chunkGraph.getChunkEntryModulesIterable(chunk);

				for (const module of entryModules) {
					if (this.isFileStyle(module.userRequest)) {
						// Collect all style files in a Set for quick lookup
						const styleFiles = new Set(chunk.files.filter((file) => this.isFileStyle(file)));

						// Only delete non-style assets
						for (const file of chunk.files) {
							if (!styleFiles.has(file)) {
								delete compilation.assets[file];
							}
						}
						// Break after processing the first style entry module
						break;
					}
				}
			}
		});
	}
}

module.exports = StyleOnlyEntryPlugin;
