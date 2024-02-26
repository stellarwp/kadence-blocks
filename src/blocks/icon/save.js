/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
/**
 * External dependencies
 */
import { IconSpanTag } from '@kadence/components';
/**
 * External dependencies
 */
import classnames from 'classnames';
import { times } from 'lodash';

function Save({ attributes, className }) {
	const { blockAlignment, uniqueID, verticalAlignment } = attributes;

	const classes = classnames({
		'kt-svg-icons': true,
		[`kt-svg-icons${uniqueID}`]: uniqueID,
		[`align${blockAlignment ? blockAlignment : 'none'}`]: true,
		[`kb-icon-valign-${verticalAlignment}`]: verticalAlignment,
	});

	const blockProps = useBlockProps.save({
		className: classes,
	});

	return (
		<div {...blockProps}>
			<InnerBlocks.Content />
		</div>
	);
}

export default Save;
