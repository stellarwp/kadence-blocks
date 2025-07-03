/**
 * BLOCK: Kadence Header Container for a size (Desktop or Tablet)
 */

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
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export default function ChildContainer(props, size = 'Desktop') {
	const { attributes, setAttributes, clientId } = props;

	const { uniqueID } = attributes;

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
		['wp-block-kadence-header-' + size.toLowerCase()]: true,
		'kb-header-container': true,
		['wp-block-kadence-header-' + size.toLowerCase() + uniqueID]: uniqueID,
	});

	const active = previewDevice === size || (previewDevice == 'Mobile' && size == 'Tablet');

	const { children, ...innerBlocksProps } = useInnerBlocksProps(
		{
			className: innerBlockClasses,
			style: {
				display: active ? 'block' : 'none',
			},
		},
		{
			renderAppender: false,
			templateLock: 'all',
		}
	);

	return (
		<>
			<InspectorControls>
				<SelectParentBlock
					label={__('View Header Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/header'}
				/>
			</InspectorControls>
			<div {...innerBlocksProps}>{active && children}</div>
		</>
	);
}
