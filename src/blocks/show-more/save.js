/**
 * BLOCK: Kadence Block Template
 */
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';

function Save( { attributes, innerBlocks } ) {
	const { uniqueID } = attributes;
	const classes = classnames( {
		'kb-block-template-container': true,
		[ `kb-block-template-container${ uniqueID }` ] : true
	} );

	return (
		<div className={ classes }>
			<InnerBlocks.Content />
		</div>
	);
}
export default Save;
