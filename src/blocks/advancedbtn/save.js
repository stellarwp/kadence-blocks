/**
 * BLOCK: Kadence Spacer
 */

import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
/**
 * External dependencies
 */
import classnames from 'classnames';

function Save({ attributes }) {
	const { uniqueID } = attributes;

	const classes = classnames({
		[`kb-buttons-wrap`]: true,
		[`kb-btns${uniqueID}`]: uniqueID,
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
