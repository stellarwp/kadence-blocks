/**
 * BLOCK: Kadence Restaurant Menu Category
 */

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import Controls from './controls';
import WebfontLoader from '../../../fontloader';
import KadenceColorOutput from '../../../kadence-color-output';

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

		this.props.setAttributes( {
			titleFont: [...this.props.attributes.titleFont]
		} );

		this.props.setAttributes( {
			gutter: [...this.props.attributes.gutter]
		} );

		this.props.setAttributes( {
			columns: [...this.props.attributes.columns]
		} );
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
			gutter,
			displayTitle,
			titleFont,
			titleMinHeight,
			titleColor
		} = attributes;

		const gconfig = {
			google: {
				families: [ titleFont[ 0 ].family + ( titleFont[ 0 ].variant ? ':' + titleFont[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );
		const titleTagName = 'h' + titleFont[ 0 ].level;

		return (
			<Fragment>

				{ isSelected && <Inspector {...this.props} /> }
				{ isSelected && <Controls {...this.props} /> }

				<style>
					{ `
						.wp-block[data-type="kadence/restaurantmenucategory"]  .kt-menu-category-id-${uniqueID} .kt-category-content {
							${ ( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'margin: -' + ( gutter[ 0 ] / 2 ) + 'px;' : '' ) }
						}
						.wp-block[data-type="kadence/restaurantmenucategory"]  .kt-menu-category-id-${uniqueID} .gutter {
							${ ( gutter && undefined !== gutter[ 0 ] && '' !== gutter[ 0 ] ? 'padding: ' + ( gutter[ 0 ] / 2 ) + 'px;' : '' ) }
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

					{ displayTitle && titleFont[ 0 ].google && (
						<WebfontLoader config={ config }>
						</WebfontLoader>
					) }
					{ displayTitle && (
						<RichText
							className="kt-menu-category-title"
							tagName={ titleTagName }
							placeholder={ __( 'Menu Title' ) }
							onChange={ (value) => setAttributes( { menuTitle: value } ) }
							value={ menuTitle }
							style={ {
								fontWeight: titleFont[ 0 ].weight,
								fontStyle: titleFont[ 0 ].style,
								color: KadenceColorOutput( titleColor ),
								fontSize: titleFont[ 0 ].size[ 0 ] + titleFont[ 0 ].sizeType,
								lineHeight: ( titleFont[ 0 ].lineHeight && titleFont[ 0 ].lineHeight[ 0 ] ? titleFont[ 0 ].lineHeight[ 0 ] + titleFont[ 0 ].lineType : undefined ),
								letterSpacing: titleFont[ 0 ].letterSpacing + 'px',
								fontFamily: ( titleFont[ 0 ].family ? titleFont[ 0 ].family : '' ),
								padding: ( titleFont[ 0 ].padding ? titleFont[ 0 ].padding[ 0 ] + 'px ' + titleFont[ 0 ].padding[ 1 ] + 'px ' + titleFont[ 0 ].padding[ 2 ] + 'px ' + titleFont[ 0 ].padding[ 3 ] + 'px' : '' ),
								margin: ( titleFont[ 0 ].margin ? titleFont[ 0 ].margin[ 0 ] + 'px ' + titleFont[ 0 ].margin[ 1 ] + 'px ' + titleFont[ 0 ].margin[ 2 ] + 'px ' + titleFont[ 0 ].margin[ 3 ] + 'px' : '' ),
								minHeight: ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] + 'px' : undefined ),
							} }
							keepPlaceholderOnFocus
						/>
					) }

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
							renderAppender={ () =>  null

								// (
								// 	<IconButton
								//         icon="insert"
								//         label={ __('Add New Food Item') }
								//         onClick={ () => {
								// 			const innerCount = select("core/editor").getBlocksByClientId(clientId)[0].innerBlocks.length;
								// 			let block = createBlock("kadence/restaurantmenuitem");
								// 			dispatch("core/block-editor").insertBlock(block, innerCount, clientId);
								// 		} }
								//     />
								// )

							}
						/>
					</div>
				</div>
			</Fragment>
		)
	}
}

export default KadenceRestaurantMenuCategory;
