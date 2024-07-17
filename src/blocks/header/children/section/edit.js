/**
 * BLOCK: Kadence Header section
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
import { createBlock } from '@wordpress/blocks';
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, InnerBlocks, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';

import { getUniqueId, getPostOrFseId } from '@kadence/helpers';
import { SelectParentBlock } from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function Edit(props) {
	const { attributes, setAttributes, clientId } = props;

	const { uniqueID, location } = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData, previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
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
			addUniqueID(uniqueId, clientId);
		}
	}, []);

	const innerBlockClasses = classnames({
		'wp-block-kadence-header-section': true,
		[`wp-block-kadence-header-section-${location}`]: location,
		[`wp-block-kadence-header-section${uniqueID}`]: uniqueID,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerBlockClasses,
		},
		{
			templateLock: 'all',
		}
	);

	return (
		<>
			<InspectorControls>
				<SelectParentBlock
					label={__('View Header Row Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/header-row'}
				/>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
}

export default Edit;
