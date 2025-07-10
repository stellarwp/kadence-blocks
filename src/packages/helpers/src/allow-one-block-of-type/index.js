import { dispatch, select } from '@wordpress/data';
import { useCallback } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

export const allowOneBlockOfType = () => {
	return useCallback(function filterDuplicateBlocks(innerBlocks = [], blockName, blockTitle) {
		const foundBlocks = [];

		const isBlockEmpty = (block) => {
			if (block.name === 'kadence/advanced-form-submit') {
				return !block.attributes?.text || block.attributes.text === '';
			}
			if (block.name === 'kadence/advanced-form-captcha') {
				return block.attributes?.recaptchaSiteKey === '-' ||
					   block.attributes?.hCaptchaSiteKey === '-' ||
					   block.attributes?.turnstileSiteKey === '-';
			}
			return false;
		};

		const findBlocks = (blocks) => {
			blocks.forEach(block => {
				if (block.name === blockName) {
					foundBlocks.push({
						clientId: block.clientId,
						isEmpty: isBlockEmpty(block)
					});
				}

				if (block.innerBlocks && block.innerBlocks.length > 0) {
					findBlocks(block.innerBlocks);
				}
			});
		};

		findBlocks(innerBlocks);

		if (foundBlocks.length > 1) {
			// Sort blocks: empty/unconfigured blocks first, then by order found
			foundBlocks.sort((a, b) => {
				if (a.isEmpty && !b.isEmpty) return -1;
				if (!a.isEmpty && b.isEmpty) return 1;
				return 0;
			});

			// Keep the first non-empty block if possible, otherwise keep the first block
			const blockToKeep = foundBlocks.find(block => !block.isEmpty) || foundBlocks[0];

			const blocksToRemove = foundBlocks.filter(block => block.clientId !== blockToKeep.clientId);

			if (blocksToRemove.length > 0) {
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

				blocksToRemove.forEach(block => {
					dispatch('core/block-editor').removeBlock(block.clientId, false);
				});
			}
		}
	}, []);
};
