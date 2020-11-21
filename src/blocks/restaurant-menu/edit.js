/**
 * BLOCK: Kadence Restaurant Menu
 */

/**
 * Internal dependencies
 */
import Controls from './controls';
import Inspector from './inspector';
import KadenceColorOutput from '../../kadence-color-output';
import templates from './templates';

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
const { IconButton }    = wp.components;
const { InnerBlocks }         = wp.blockEditor
const { select, dispatch }    = wp.data;

/**
 * Build the restaurant menu edit
 */
class KadenceRestaurantMenu extends Component {
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
			hAlign,
			hAlignTablet,
			hAlignMobile,
			containerBackground,
			containerBackgroundOpacity,
			containerHoverBackground,
			containerHoverBackgroundOpacity,
			containerBorder,
			containerBorderOpacity,
			containerHoverBorder,
			containerHoverBorderOpacity,
			containerBorderWidth,
			containerBorderRadius,
			containerPadding,
			containerMargin,
			containerMarginUnit,
			maxWidthUnit,
			maxWidth,
			uniqueID
		} = attributes;

		const renderCSS = (
			<style>
				{ ( containerHoverBackground ? `.kt-restaurent-menu-id-${uniqueID}.kt-restaurent-menu:hover { background: ${ ( containerHoverBackground ? KadenceColorOutput( containerHoverBackground, ( undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1 ) ) ) } !important; }` : '' ) }
				{ ( containerHoverBorder ? `.kt-restaurent-menu-id-${uniqueID}.kt-restaurent-menu:hover { border-color: ${ ( containerHoverBorder ? KadenceColorOutput( containerHoverBorder, ( undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1 ) ) ) } !important; }` : '' ) }

			</style>
		);

		return (
			<Fragment>
				<style>{`
					.kt-restaurent-menu-id-${uniqueID}.kt-restaurent-menu-halign-right .kt-menu-category-title {
						text-align: right;
					}
					.kt-restaurent-menu-id-${uniqueID}.kt-restaurent-menu-halign-right .block-editor-block-list__layout {
						justify-content: flex-end;
					}

					.kt-restaurent-menu-id-${uniqueID}.kt-restaurent-menu-halign-left .kt-menu-category-title {
						text-align: left;
					}
					.kt-restaurent-menu-id-${uniqueID}.kt-restaurent-menu-halign-left .block-editor-block-list__layout {
						justify-content: flex-start;
					}

					.kt-restaurent-menu-id-${uniqueID}.kt-restaurent-menu-halign-center .kt-menu-category-title {
						text-align: center;
					}
					.kt-restaurent-menu-id-${uniqueID}.kt-restaurent-menu-halign-center .block-editor-block-list__layout {
						justify-content: center;
					}
				`}</style>

				{ isSelected && <Controls {...this.props} /> }
				{ isSelected && <Inspector {...this.props} /> }

				{ renderCSS }

				<div
					className={ classnames(
						`kt-restaurent-menu-id-${uniqueID}`,
						`kt-restaurent-menu-halign-${ hAlign }`,
						'kt-restaurent-menu'
					) }
					style={ {
						borderColor: ( containerBorder ? KadenceColorOutput( containerBorder, ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) : KadenceColorOutput( '#eeeeee', ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) ),
						background: ( containerBackground ? KadenceColorOutput( containerBackground, ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) ),
						borderRadius: containerBorderRadius + 'px',
						borderWidth: ( containerBorderWidth ? containerBorderWidth[ 0 ] + 'px ' + containerBorderWidth[ 1 ] + 'px ' + containerBorderWidth[ 2 ] + 'px ' + containerBorderWidth[ 3 ] + 'px' : '' ),
						padding: ( containerPadding ? containerPadding[ 0 ] + 'px ' + containerPadding[ 1 ] + 'px ' + containerPadding[ 2 ] + 'px ' + containerPadding[ 3 ] + 'px' : '' ),
						maxWidth: ( maxWidth ? maxWidth + maxWidthUnit : undefined ),
						marginTop: ( containerMargin && '' !== containerMargin[ 0 ] ? containerMargin[ 0 ] + containerMarginUnit : undefined ),
						marginRight: ( containerMargin && '' !== containerMargin[ 1 ] ? containerMargin[ 1 ] + containerMarginUnit : undefined ),
						marginBottom: ( containerMargin && '' !== containerMargin[ 2 ] ? containerMargin[ 2 ] + containerMarginUnit : undefined ),
						marginLeft: ( containerMargin && '' !== containerMargin[ 3 ] ? containerMargin[ 3 ] + containerMarginUnit : undefined ),
						borderStyle: 'solid'
					} }
				>
					<InnerBlocks
						allowedBlocks={['kadence/restaurantmenucategory']}
						template={ templates }
						templateLock={ false }
						renderAppender={ () => (
							<IconButton
					        icon="insert"
					        label={ __('Add New Menu') }
					        onClick={ () => {
								const innerCount = select("core/editor").getBlocksByClientId(clientId)[0].innerBlocks.length;
								let block = createBlock("kadence/restaurantmenucategory");
								dispatch("core/block-editor").insertBlock(block, innerCount, clientId);
							} }
					    /> ) }
					/>
				</div>

			</Fragment>
		)
	}
}

export default KadenceRestaurantMenu;
