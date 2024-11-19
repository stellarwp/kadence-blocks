export function blockExists (blocks, blockName, maxDepth = 50, depth = 0) {
	for (const block of blocks) {
		if (block.name === blockName) {
			return true;
		}
		if (
			block.innerBlocks &&
			block.innerBlocks.length > 0 &&
			depth < maxDepth &&
			blockExists(block.innerBlocks, blockName, maxDepth, depth + 1)
		) {
			return true;
		}
	}
	return false;
};
