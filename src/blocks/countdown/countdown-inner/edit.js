/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import { useEffect } from '@wordpress/element';

import { useSelect, useDispatch } from '@wordpress/data';

import { getUniqueId, getPostOrFseId } from '@kadence/helpers';

/**
 * Build the spacer edit
 */

function KadenceCountdownInner(props) {
	const { attributes, clientId, setAttributes } = props;
	const { location, uniqueID } = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);

	useEffect(() => {
		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);

	const hasChildBlocks = wp.data.select('core/block-editor').getBlockOrder(clientId).length > 0;

	const blockProps = useBlockProps({
		className: `kb-countdown-inner kb-countdown-inner-${location} kb-countdown-inner-${uniqueID}`,
	});

	return (
		<div {...blockProps}>
			<InnerBlocks
				templateLock={false}
				renderAppender={hasChildBlocks ? undefined : InnerBlocks.ButtonBlockAppender}
			/>
		</div>
	);
}
export default KadenceCountdownInner;
