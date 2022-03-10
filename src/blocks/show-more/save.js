/**
 * BLOCK: Kadence Block Template
 */
import { InnerBlocks } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';

function Save( { attributes, innerBlocks } ) {
	const { uniqueID } = attributes;
	const classes = classnames( {
		'kb-block-show-more-container': true,
		[ `kb-block-show-more-container${ uniqueID }` ] : true
	} );

	return (
		<div className={ classes }>
			<InnerBlocks.Content />
		</div>
	);
}
export default Save;
