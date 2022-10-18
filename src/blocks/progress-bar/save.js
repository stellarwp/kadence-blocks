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
		'kb-progress-bar-container': true,
		[ `kb-progress-bar-container${ uniqueID }` ] : true
	} );

	return (
		<div className={ classes }>
			<div id={ "kb-progressbar-" + uniqueID }></div>
		</div>
	);
}
export default Save;
