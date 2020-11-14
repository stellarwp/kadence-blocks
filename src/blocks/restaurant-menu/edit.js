/**
 * BLOCK: Kadence Restaurant Menu
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Import Css
 */
import './style.scss';

/**
 * Internal block libraries
 */
const { __ }                  = wp.i18n;
const { createBlock }         = wp.blocks;
const { Component, Fragment } = wp.element;
const { Button }              = wp.components;
const { InnerBlocks }         = wp.blockEditor
const { select, dispatch }    = wp.data;

/**
 * Build the restaurant menu edit
 */
class KadenceRestaurantMenu extends Component {
	constructor() {
		super( ...arguments );
	}

	render() {
		const {
			clientId,
			attributes,
			className,
			isSelected,
			setAttributes
		} = this.props;

		return (
			<Fragment>
				<div className={ classnames( 'kt-restaurent-menu' ) }>
					<InnerBlocks
						template={ [
							[
								'kadence/restaurantmenucategory'
							]
						] }
						templateLock={ false }
						renderAppender={ () => ( null ) }
					/>
				</div>

				<Button
					onClick={ () => {

						const block = select( 'core/block-editor' ).getBlock( clientId );

						const newItem = createBlock(
							'kadence/restaurantmenucategory'
						);

						const newInnerBlocks = [ ...block.innerBlocks, { ...newItem } ];
						dispatch( 'core/block-editor' ).replaceInnerBlocks( clientId, newInnerBlocks, false );
					} }
				>
					{__('Add New Menu')}
				</Button>
			</Fragment>
		)
	}
}

export default KadenceRestaurantMenu;
