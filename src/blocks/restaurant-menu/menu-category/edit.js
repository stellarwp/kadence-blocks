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
const { __ }                  = wp.i18n;
const { createBlock }         = wp.blocks;
const { RichText }            = wp.blockEditor;
const { Component, Fragment } = wp.element;
const { Button }              = wp.components;
const { InnerBlocks }         = wp.blockEditor;
const { select, dispatch }    = wp.data;

/**
 * Build the restaurant menu category edit
 */
class KadenceRestaurantMenuCategory extends Component {
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

		const {
			menuTitle
		} = attributes;

		return (
			<Fragment>
				<div className={ classnames( 'kt-menu-category' ) } >
					<RichText
						tagName="h1"
						className={ classnames( 'kt-menu-category-title' ) }
						value={ menuTitle }
						onChange={ menuTitle => setAttributes( menuTitle ) }
					/>
					<div className={ classnames( 'kt-category-content' ) }>
						<InnerBlocks
							template={ [
								[
									'kadence/restaurantmenuitem'
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
								'kadence/restaurantmenuitem'
							);

							const newInnerBlocks = [ ...block.innerBlocks, { ...newItem } ];
							dispatch( 'core/block-editor' ).replaceInnerBlocks( clientId, newInnerBlocks, false );
						} }
					>
						{__('Add New Menu Item')}
					</Button>
				</div>
			</Fragment>
		)
	}
}

export default KadenceRestaurantMenuCategory;
