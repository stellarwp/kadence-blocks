import { uniqueId, get, has } from 'lodash';
import { useSelect, useDispatch } from '@wordpress/data';
import getPostOrWidgetId from '../get-post-or-widget-id';
import hashString from '../hash-string';
import { useEffect, useMemo } from '@wordpress/element';
/**
 * Creates or keeps a uniqueId for a block depending on it's status.
 * requires the current block unique Id, client id, and the useSelect functions for isUniqueId and isUniqueBlock
 */
export default function uniqueIdHelper(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const { uniqueID } = attributes;
	const { addUniqueID } = useDispatch('kadenceblocks/data');

	// Get the select function once
	const select = useSelect((select) => select, []);

	// Memoize the functions to prevent unnecessary re-renders
	const { isUniqueID, isUniqueBlock, parentData } = useMemo(
		() => ({
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
		}),
		[select, clientId]
	);

	const updateUniqueID = (newUniqueID) => {
		if (!isUniqueID(newUniqueID)) {
			newUniqueID = uniqueId(newUniqueID);
		}
		attributes.uniqueID = newUniqueID;
		setAttributes({ uniqueID: newUniqueID });
		addUniqueID(newUniqueID, clientId);
	};
	useEffect(() => {
		const { postId, reusableParent, rootBlock, editedPostId } = parentData;
		let blockPostId = getPostOrWidgetId(props, postId, reusableParent, 0);
		if (blockPostId === 0) {
			// Try getting the FSE template slug.
			if (get(rootBlock, 'name') === 'core/template-part' && has(rootBlock, ['attributes', 'slug'])) {
				blockPostId = hashString(rootBlock.attributes.slug) % 1000000;
			} else if (editedPostId) {
				blockPostId = hashString(editedPostId) % 1000000;
			}
		}

		const hasBlockPostIdPrefix = uniqueID && uniqueID.split('_').length === 2;
		const blockPostIdPrefix = blockPostId ? blockPostId + '_' : '';
		const newUniqueID = blockPostIdPrefix + clientId.substr(2, 9);

		if (!uniqueID || (hasBlockPostIdPrefix && uniqueID.split('_')[0] !== blockPostId.toString())) {
			// New block
			return updateUniqueID(newUniqueID);
		} else if (!isUniqueID(uniqueID) && !isUniqueBlock(uniqueID, clientId)) {
			// This checks if we are just switching views, client ID the same means we don't need to update but otherwise we assume it's a duplicate block.
			return updateUniqueID(newUniqueID);
		}
		addUniqueID(uniqueID, clientId);
	}, [clientId]);

	return;
}
