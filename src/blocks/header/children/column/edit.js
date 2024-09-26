/**
 * BLOCK: Kadence Header Column
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useBlockProps, InnerBlocks, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';

import { getUniqueId, getPostOrFseId } from '@kadence/helpers';
import { SelectParentBlock } from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect, Fragment } from '@wordpress/element';
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

	const hasChildBlocks = wp.data.select('core/block-editor').getBlockOrder(clientId).length > 0;

	const innerBlocksClasses = classnames({
		'wp-block-kadence-header-column': true,
		[`wp-block-kadence-header-column-${location}`]: location,
		[`wp-block-kadence-header-column${uniqueID}`]: uniqueID,
		'no-content': !hasChildBlocks,
		'no-content-column-center': !hasChildBlocks && 'center' === location,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerBlocksClasses,
		},
		{
			renderAppender: false, // This will get set to false, leaving on for testing until visual editor is done.
			templateLock: false,
			orientation: 'horizontal',
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

			{/* append a fake column to tablet left and right to better match desktop styling */}
			{location === 'center-left' ||
			location === 'center-right' ||
			location === 'center' ||
			location === 'tablet-center' ? (
				<div {...innerBlocksProps} />
			) : location === 'tablet-left' ? (
				<div className={innerBlocksClasses}>
					<Fragment {...innerBlocksProps} />
					<div className="wp-block-kadence-header-column wp-block-kadence-header-column-center-left" />
				</div>
			) : location === 'tablet-right' ? (
				<div className={innerBlocksClasses}>
					<div className="wp-block-kadence-header-column wp-block-kadence-header-column-center-right" />
					<Fragment {...innerBlocksProps} />
				</div>
			) : (
				<Fragment {...innerBlocksProps} />
			)}
		</>
	);
}

export default Edit;
