/**
 * Returns new attributes object with defaults applied.
 */
export default (blockSlug, attributes) => {
    if ( ! attributes.uniqueID ) {
        if ( undefined === attributes.noCustomDefaults || ! attributes.noCustomDefaults ) {
            const oldBlockConfig = kadence_blocks_params.config && kadence_blocks_params.config[blockSlug] ? kadence_blocks_params.config[blockSlug] : undefined;
            const blockConfigObject = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : []);
        
            if (blockConfigObject[blockSlug] !== undefined && typeof blockConfigObject[blockSlug] === 'object') {
                Object.keys(blockConfigObject[blockSlug]).map((attribute) => {
                    attributes[attribute] = blockConfigObject[blockSlug][attribute];
                });
            } else if (oldBlockConfig !== undefined && typeof oldBlockConfig === 'object') {
                Object.keys(oldBlockConfig).map((attribute) => {
                    attributes[attribute] = oldBlockConfig[attribute];
                });
            }
        }
    }

	return attributes;
}
