import { dispatch, select } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { has } from 'lodash';

export const allowOneBlockOfType = () => {
	const [existingUniqueIds, setExistingUniqueIds] = useState({});

	return function filterDuplicateBlocks(innerBlocks = [], blockName, blockTitle ) {

		const filterBlocks = (blocks) => {
			return blocks.map(block => {
				if (block.name === blockName) {
					if (!has(existingUniqueIds, blockName)) {
						console.log( existingUniqueIds );
						setExistingUniqueIds({ ...existingUniqueIds, [blockName]: block.attributes.uniqueID });
					} else if( existingUniqueIds[blockName] != block.attributes.uniqueID ) {
						dispatch('core/block-editor').removeBlock(block.clientId);

						dispatch('core/notices').createNotice(
							'warning',
							sprintf(
								__('Only one %s block is allowed.', 'kadence-blocks'),
								blockTitle
							),
							{
								type: 'snackbar',
								isDismissible: true,
							}
						);
						return null;
					}
				}

				if (block.innerBlocks && block.innerBlocks.length > 0) {
					block.innerBlocks = filterBlocks(block.innerBlocks);
				}

				return block;
			}).filter(Boolean);
		};

		return filterBlocks(innerBlocks);
	};
};
