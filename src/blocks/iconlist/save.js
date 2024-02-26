/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
/**
 * External dependencies
 */
import { KadenceColorOutput } from '@kadence/helpers';
import { times } from 'lodash';

function Save({ attributes }) {
	const { items, listCount, columns, blockAlignment, iconAlign, uniqueID, tabletColumns, mobileColumns } = attributes;

	const blockProps = useBlockProps.save({
		className: `wp-block-kadence-iconlist kt-svg-icon-list-items kt-svg-icon-list-items${uniqueID} kt-svg-icon-list-columns-${columns} align${
			blockAlignment ? blockAlignment : 'none'
		}${undefined !== iconAlign && 'middle' !== iconAlign ? ' kt-list-icon-align' + iconAlign : ''}${
			undefined !== tabletColumns && '' !== tabletColumns
				? ' kt-tablet-svg-icon-list-columns-' + tabletColumns
				: ''
		}${
			undefined !== mobileColumns && '' !== mobileColumns
				? ' kt-mobile-svg-icon-list-columns-' + mobileColumns
				: ''
		}`,
	});

	return (
		<div {...blockProps}>
			<ul className="kt-svg-icon-list">
				<InnerBlocks.Content />
			</ul>
		</div>
	);
}

export default Save;
