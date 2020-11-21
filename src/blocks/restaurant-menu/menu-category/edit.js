/**
 * BLOCK: Kadence Restaurant Menu Category
 */

/**
 * Internal dependencies
 */
import Inspector from './inspector';

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

	componentDidMount() {
		const { attributes } = this.props;
		const { images, uniqueID } = attributes;

		if ( ! uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}
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
			price,
			columns,
			uniqueID,
			gutter
		} = attributes;

		return (
			<Fragment>

				{ isSelected && <Inspector {...this.props} /> }

				<style>
					{ `
						.wp-block[data-type="kadence/restaurantmenucategory"]  .kt-menu-category-id-${uniqueID} .kt-category-content {
							${ ( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'margin: -' + ( gutter[ 0 ] / 2 ) + 'px;' : '' ) }
						}
						.wp-block[data-type="kadence/restaurantmenucategory"]  .kt-menu-category-id-${uniqueID} .kt-category-content-item {
							${ ( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'padding:' + ( gutter[ 0 ] / 2 ) + 'px;' : '' ) }
						}

						.wp-block[data-type="kadence/restaurantmenucategory"]  .kt-menu-category-id-${uniqueID} .block-list-appender {
							${ ( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'padding-left:' + ( gutter[ 0 ] / 2 ) + 'px;' : '' ) }
							${ ( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'padding-bottom:' + ( gutter[ 0 ] / 2 ) + 'px;' : '' ) }
							${ ( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'margin-top:' + ( -( gutter[ 0 ] / 2 - 8 ) ) + 'px;' : '' ) }
						}
					`}
				</style>

				<div className={ classnames(
					'kt-menu-category',
					`kt-menu-category-id-${uniqueID}`
				) } >
					<RichText
						tagName="h1"
						className={ classnames( 'kt-menu-category-title' ) }
						value={ menuTitle }
						onChange={ menuTitle => setAttributes( { menuTitle } ) }
						placeholder={ __( 'MENU TITLE' ) }
					/>
					<div
						className={ classnames( 'kt-category-content' ) }
						data-columns-xxl={ columns[ 0 ] }
						data-columns-xl={ columns[ 1 ] }
						data-columns-lg={ columns[ 2 ] }
						data-columns-md={ columns[ 3 ] }
						data-columns-sm={ columns[ 4 ] }
						data-columns-xs={ columns[ 5 ] }
					>
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
