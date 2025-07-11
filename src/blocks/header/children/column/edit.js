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

import { uniqueIdHelper } from '@kadence/helpers';
import { SelectParentBlock } from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect, Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function Edit(props) {
	const { attributes, setAttributes, clientId } = props;

	const { uniqueID, location } = attributes;

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	uniqueIdHelper(props);

	const hasChildBlocks = wp.data.select('core/block-editor').getBlockOrder(clientId).length > 0;

	const innerBlocksClasses = classnames({
		'wp-block-kadence-header-column': true,
		[`wp-block-kadence-header-column-${location}`]: location,
		[`wp-block-kadence-header-column${uniqueID}`]: uniqueID,
		'no-content': !hasChildBlocks,
		'no-content-column-center': !hasChildBlocks && ('center' === location || 'tablet-center' === location),
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
