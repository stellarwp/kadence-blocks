/**
 * BLOCK: Kadence Show More Block
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';

function Save({ attributes, innerBlocks }) {
	const { uniqueID } = attributes;
	const classes = classnames({
		'kb-block-show-more-container': true,
		[`kb-block-show-more-container${uniqueID}`]: true,
		'wp-block-kadence-show-more': true,
	});

	return (
		<div {...useBlockProps.save({ className: classes })}>
			<div className="kb-show-more-sr-excerpt" aria-live="polite" aria-atomic="true"></div>
			<InnerBlocks.Content />
		</div>
	);
}
export default Save;
