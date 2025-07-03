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

import { uniqueIdHelper } from '@kadence/helpers';
import { SelectParentBlock } from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect } from '@wordpress/element';
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
