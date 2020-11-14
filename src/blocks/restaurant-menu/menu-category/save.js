/**
 * BLOCK: Kadence Restaurant Menu Category
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { Fragment }              = wp.element;
const { InnerBlocks, RichText } = wp.blockEditor

/**
 * Build the restaurant menu category save
 */
const save = ( { attributes } ) => {

	const {
		menuTitle
	} = attributes;

	return (
		<Fragment>
			<div className={ classnames( 'kt-menu-category' ) } >
				<RichText.Content
					tagName="h1"
					className={ classnames( 'kt-menu-category-title' ) }
					value={ menuTitle }
				/>
				<div className={ classnames( 'kt-category-content' ) }>
					<InnerBlocks.Content />
				</div>
			</div>
		</Fragment>
	);
};

export default save;
