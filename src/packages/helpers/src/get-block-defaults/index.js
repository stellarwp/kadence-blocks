/**
 * Returns just the default attributes for a block type.
 * This is used by uniqueIdHelper to get defaults for new blocks.
 */
export default function getBlockDefaults(blockSlug, attributes) {
    const defaults = {};

    if ( undefined === attributes.noCustomDefaults || ! attributes.noCustomDefaults ) {
        const oldBlockConfig = kadence_blocks_params.config && kadence_blocks_params.config[blockSlug] ? kadence_blocks_params.config[blockSlug] : undefined;
        const blockConfigObject = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : []);
        if (blockConfigObject[blockSlug] !== undefined && typeof blockConfigObject[blockSlug] === 'object') {
            // hack to make icon list block work with old attributes.
            if ( blockSlug === 'kadence/iconlist' ) {
                if ( undefined !== blockConfigObject[blockSlug]?.items?.[0]?.icon && blockConfigObject[blockSlug]?.items?.[0]?.icon && ! blockConfigObject[blockSlug]?.icon ) {
                    defaults.icon = blockConfigObject[blockSlug]?.items?.[0]?.icon
                }
            }
            Object.keys(blockConfigObject[blockSlug]).map((attribute) => {
                defaults[attribute] = blockConfigObject[blockSlug][attribute];
            });
        } else if (oldBlockConfig !== undefined && typeof oldBlockConfig === 'object') {
            Object.keys(oldBlockConfig).map((attribute) => {
                defaults[attribute] = oldBlockConfig[attribute];
            });
        }
    }

	return defaults;
}