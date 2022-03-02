/**
 * BLOCK: Kadence Block Template
 */
const { rest_url } = kadence_blocks_params;

/**
 * External dependencies
 */
import classnames from 'classnames';

function Save( { attributes } ) {
	const { uniqueID } = attributes;
	const classes = classnames( {
		'kb-block-template-container': true,
		[ `kb-block-template-container${ uniqueID }` ] : true
	} );

	return (
		<div className={ classes }>
			Block template content
		</div>
	);
}
export default Save;
