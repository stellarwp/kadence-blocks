import { uniqueId, get, has } from 'lodash';
import { useSelect, useDispatch } from '@wordpress/data';
import getPostOrWidgetId from '../get-post-or-widget-id';
import { useEffect, useMemo } from '@wordpress/element';
import { default as hashString } from '../hash-string';
import getBlockDefaults from '../set-block-defaults';

/**
 * Creates or keeps a uniqueId for a block depending on it's status.
 * requires the current block unique Id, client id, and the useSelect functions for isUniqueId and isUniqueBlock
 */
export default function uniqueIdHelper(props) {
	const { attributes, setAttributes, isSelected, clientId, context, className } = props;
	const { addUniqueID } = useDispatch('kadenceblocks/data');

	// Get the select function once
	const select = useSelect((select) => select, [clientId]);

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

	const updateUniqueID = (newUniqueID, isNewBlock = false) => {
		if (!isUniqueID(newUniqueID)) {
			// Solves for rare case where the client id matches enough that our unique id is not unique.
			newUniqueID = uniqueId(newUniqueID);
		}
		
		let updatedAttributes = { uniqueID: newUniqueID };
		
		// Apply block defaults for new blocks
		if (isNewBlock) {
			const defaultedAttributes = getBlockDefaults(props.name, attributes);
			updatedAttributes = {
				...defaultedAttributes,
				uniqueID: newUniqueID
			};
		}
		
		// Update attributes on the object for race conditions
		Object.assign(attributes, updatedAttributes);
		
		// Set all attributes in one call
		setAttributes(updatedAttributes);
		
		// Add to store
		addUniqueID(newUniqueID, clientId);
	};
	const getBlockPostId = (parentData) => {
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
		
		return blockPostId;
	};

	// Set uniqueID immediately if not defined
	if (!attributes?.uniqueID ) {
		const blockPostId = getBlockPostId(parentData);
		const blockPostIdPrefix = blockPostId ? blockPostId + '_' : '';
		const newUniqueID = blockPostIdPrefix + clientId.substr(2, 9);
		
		// This is a new block
		updateUniqueID(newUniqueID, true);
	}

	useEffect(() => {
		const blockPostId = getBlockPostId(parentData);
		const hasBlockPostIdPrefix = attributes?.uniqueID && attributes?.uniqueID.split('_').length === 2;
		const blockPostIdPrefix = blockPostId ? blockPostId + '_' : '';
		const newUniqueID = blockPostIdPrefix + clientId.substr(2, 9);

		if (
			!attributes?.uniqueID ||
			(hasBlockPostIdPrefix && attributes?.uniqueID.split('_')[0] !== blockPostId.toString())
		) {
			// New block
			return updateUniqueID(newUniqueID, true);
		} else if (!isUniqueID(attributes?.uniqueID) && !isUniqueBlock(attributes?.uniqueID, clientId)) {
			// This checks if we are just switching views, client ID the same means we don't need to update but otherwise we assume it's a duplicate block.
			return updateUniqueID(newUniqueID, false);
		}
		// This just logs the block in the store and it doesn't need to be updated.
		addUniqueID(attributes?.uniqueID, clientId);
	}, [clientId]);

	
}
