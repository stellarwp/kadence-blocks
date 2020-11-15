/**
 * BLOCK: Kadence Restaurant Menu
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { Component, Fragment } = wp.element;
const { InnerBlocks }         = wp.blockEditor

/**
 * Build the restaurant menu save
 */
const save = ( { attributes } ) => {

	const {
		fullWidth
	} = attributes

	return (
		<Fragment>
			<div className={
				classnames( {
					'kt-restaurent-menu': true,
					'full-width': fullWidth
				} )
			}>
				<InnerBlocks.Content />
			</div>
		</Fragment>
	);
};

export default save;
