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
const { Button, IconButton }  = wp.components;
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
			menuTitle,
			title,
			description,
			currency,
			price
		} = attributes;

		return (
			<Fragment>
				<div className={ classnames( 'kt-menu-category' ) } >
					<RichText
						tagName="h1"
						className={ classnames( 'kt-menu-category-title' ) }
						value={ menuTitle }
						onChange={ menuTitle => setAttributes( { menuTitle } ) }
						placeholder={ __( 'MENU TITLE' ) }
					/>
					<div className={ classnames( 'kt-category-content' ) }>
						<InnerBlocks
							allowedBlocks={['kadence/restaurantmenuitem']}
							template={ [
								[
									'kadence/restaurantmenuitem', {
										title,
										description,
										currency,
										price
									}
								]
							] }
							templateLock={ false }
							renderAppender={ () => ( <IconButton
							        icon="insert"
							        label={ __('Add New Food Item') }
							        onClick={ () => {
										const innerCount = select("core/editor").getBlocksByClientId(clientId)[0].innerBlocks.length;
										let block = createBlock("kadence/restaurantmenuitem");
										console.log(block, innerCount, clientId)
										dispatch("core/block-editor").insertBlock(block, innerCount, clientId);
									} }
							    /> ) }
						/>
					</div>
				</div>
			</Fragment>
		)
	}
}

export default KadenceRestaurantMenuCategory;
