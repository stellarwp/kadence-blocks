/**
 * BLOCK: Kadence Restaurant Menu Category Item
 */

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import WebfontLoader from '../../../../fontloader';
import KadenceColorOutput from '../../../../kadence-color-output';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { RichText } = wp.blockEditor;
const { Component, Fragment } = wp.element;

/**
 * Build the restaurant menu category item edit
 */
class KadenceCategoryItem extends Component {
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
			textFont: [...this.props.attributes.textFont]
		} );

		this.props.setAttributes( {
			priceFont: [...this.props.attributes.priceFont]
		} );

		this.props.setAttributes( {
			containerPadding: [...this.props.attributes.containerPadding]
		} );

		this.props.setAttributes( {
			containerBorderWidth: [...this.props.attributes.containerBorderWidth]
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
			uniqueID,

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

			displayTitle,
			title,
			titleFont,
			titleMinHeight,
			titleColor,
			titleHoverColor,

			displayText,
			contentText,
			textFont,
			textMinHeight,
			textColor,
			textHoverColor,

			displayAmount,
			amount,
			priceFont,
			priceMinHeight,
			priceColor,
			priceHoverColor

		} = attributes;

		const gconfig = {
			google: {
				families: [ titleFont[ 0 ].family + ( titleFont[ 0 ].variant ? ':' + titleFont[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );

		const tgconfig = {
			google: {
				families: [ textFont[ 0 ].family + ( textFont[ 0 ].variant ? ':' + textFont[ 0 ].variant : '' ) ],
			},
		};
		const tconfig = ( textFont[ 0 ].google ? tgconfig : '' );

		const pgconfig = {
			google: {
				families: [ priceFont[ 0 ].family + ( priceFont[ 0 ].variant ? ':' + priceFont[ 0 ].variant : '' ) ],
			},
		};
		const pconfig = ( priceFont[ 0 ].google ? pgconfig : '' );

		const hasContetnt = displayTitle || displayText ? true : false;
		const hasAmount = displayAmount && amount != '' ? true : false;

		if ( !hasContetnt && !displayAmount ) {
			return ( <Fragment>{ isSelected && <Inspector {...this.props} /> }</Fragment> )
		}

		const renderCSS = (
			<style>
				{ ( containerHoverBackground ? `.kt-category-content-item-id-${uniqueID} .kt-category-content-item:hover { background: ${ ( containerHoverBackground ? KadenceColorOutput( containerHoverBackground, ( undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerHoverBackgroundOpacity ? containerHoverBackgroundOpacity : 1 ) ) ) } !important; }` : '' ) }
				{ ( containerHoverBorder ? `.kt-category-content-item-id-${uniqueID} .kt-category-content-item:hover { border-color: ${ ( containerHoverBorder ? KadenceColorOutput( containerHoverBorder, ( undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerHoverBorderOpacity ? containerHoverBorderOpacity : 1 ) ) ) } !important; }` : '' ) }
				{ ( titleHoverColor ? `.kt-category-content-item-id-${uniqueID} .kt-category-content-item:hover .kt-item-title { color: ${ KadenceColorOutput( titleHoverColor ) } !important; }` : '' ) }
				{ ( textHoverColor ? `.kt-category-content-item-id-${uniqueID} .kt-category-content-item:hover .kt-item-text { color: ${ KadenceColorOutput( textHoverColor ) } !important; }` : '' ) }
				{ ( priceHoverColor ? `.kt-category-content-item-id-${uniqueID} .kt-category-content-item:hover .kt-item-amount { color: ${ KadenceColorOutput( priceHoverColor ) } !important; }` : '' ) }
			</style>
		);

		const titleTagName = 'h' + titleFont[ 0 ].level;
		const textTagName = 'h' + textFont[ 0 ].level;
		const priceTagName = 'h' + priceFont[ 0 ].level;

		return (
			<Fragment>

				{ isSelected && <Inspector {...this.props} /> }

				{ displayTitle && titleFont[ 0 ].google && (
					<WebfontLoader config={ config }>
					</WebfontLoader>
				) }

				{ displayText && textFont[ 0 ].google && (
					<WebfontLoader config={ tconfig }>
					</WebfontLoader>
				) }

				{ displayAmount && priceFont[ 0 ].google && (
					<WebfontLoader config={ pconfig }>
					</WebfontLoader>
				) }

				{ renderCSS }
				<div className={ classnames( `kt-category-content-item-id-${uniqueID} kt-category-content-item-wrap  gutter` ) }>
					<div
						className={ classnames( 'kt-category-content-item' ) }

						style={ {
							borderColor: ( containerBorder ? KadenceColorOutput( containerBorder, ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) : KadenceColorOutput( '#eeeeee', ( undefined !== containerBorderOpacity ? containerBorderOpacity : 1 ) ) ),
							background: ( containerBackground ? KadenceColorOutput( containerBackground, ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) : KadenceColorOutput( '#f2f2f2', ( undefined !== containerBackgroundOpacity ? containerBackgroundOpacity : 1 ) ) ),
							borderRadius: containerBorderRadius + 'px',
							borderWidth: ( containerBorderWidth ? containerBorderWidth[ 0 ] + 'px ' + containerBorderWidth[ 1 ] + 'px ' + containerBorderWidth[ 2 ] + 'px ' + containerBorderWidth[ 3 ] + 'px' : '' ),
							padding: ( containerPadding ? containerPadding[ 0 ] + 'px ' + containerPadding[ 1 ] + 'px ' + containerPadding[ 2 ] + 'px ' + containerPadding[ 3 ] + 'px' : '' ),
							borderStyle: 'solid'
						} }
						>
						<div className={ classnames( 'kt-item-content' ) }>
							{ 	hasContetnt &&
								<div className={ classnames( 'kt-item-left' ) }>
									{ 	displayTitle &&
										<RichText
											tagName={ titleTagName }
											className={ classnames( className, 'kt-item-title' ) }
											value={ title }
											onChange={ title => setAttributes( { title } ) }
											placeholder={__( 'Food Title' )}
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
										/>
									}

									{ 	displayText &&
										<RichText
											tagName={ textTagName }
											className={ classnames( className, 'kt-item-text' ) }
											value={ contentText }
											onChange={ contentText => setAttributes( { contentText } ) }
											placeholder={__( 'Your sample text' )}
											style={ {
												fontWeight: textFont[ 0 ].weight,
												fontStyle: textFont[ 0 ].style,
												color: KadenceColorOutput( textColor ),
												fontSize: textFont[ 0 ].size[ 0 ] + textFont[ 0 ].sizeType,
												lineHeight: ( textFont[ 0 ].lineHeight && textFont[ 0 ].lineHeight[ 0 ] ? textFont[ 0 ].lineHeight[ 0 ] + textFont[ 0 ].lineType : undefined ),
												letterSpacing: textFont[ 0 ].letterSpacing + 'px',
												fontFamily: ( textFont[ 0 ].family ? textFont[ 0 ].family : '' ),
												padding: ( textFont[ 0 ].padding ? textFont[ 0 ].padding[ 0 ] + 'px ' + textFont[ 0 ].padding[ 1 ] + 'px ' + textFont[ 0 ].padding[ 2 ] + 'px ' + textFont[ 0 ].padding[ 3 ] + 'px' : '' ),
												margin: ( textFont[ 0 ].margin ? textFont[ 0 ].margin[ 0 ] + 'px ' + textFont[ 0 ].margin[ 1 ] + 'px ' + textFont[ 0 ].margin[ 2 ] + 'px ' + textFont[ 0 ].margin[ 3 ] + 'px' : '' ),
												minHeight: ( undefined !== textMinHeight && undefined !== textMinHeight[ 0 ] ? textMinHeight[ 0 ] + 'px' : undefined ),
											} }
										/>
									}
								</div>
							}

							{ 	displayAmount &&
								<div className={ classnames( 'kt-item-right kt-item-price' ) }>

									<RichText
										tagName={ priceTagName }
										className={ classnames( className, 'kt-item-amount' ) }
										value={ amount }
										onChange={ amount => setAttributes( { amount } ) }
										placeholder="$10"
										style={ {
											fontWeight: priceFont[ 0 ].weight,
											fontStyle: priceFont[ 0 ].style,
											color: KadenceColorOutput( priceColor ),
											fontSize: priceFont[ 0 ].size[ 0 ] + priceFont[ 0 ].sizeType,
											lineHeight: ( priceFont[ 0 ].lineHeight && priceFont[ 0 ].lineHeight[ 0 ] ? priceFont[ 0 ].lineHeight[ 0 ] + priceFont[ 0 ].lineType : undefined ),
											letterSpacing: priceFont[ 0 ].letterSpacing + 'px',
											fontFamily: ( priceFont[ 0 ].family ? priceFont[ 0 ].family : '' ),
											padding: ( priceFont[ 0 ].padding ? priceFont[ 0 ].padding[ 0 ] + 'px ' + priceFont[ 0 ].padding[ 1 ] + 'px ' + priceFont[ 0 ].padding[ 2 ] + 'px ' + priceFont[ 0 ].padding[ 3 ] + 'px' : '' ),
											margin: ( priceFont[ 0 ].margin ? priceFont[ 0 ].margin[ 0 ] + 'px ' + priceFont[ 0 ].margin[ 1 ] + 'px ' + priceFont[ 0 ].margin[ 2 ] + 'px ' + priceFont[ 0 ].margin[ 3 ] + 'px' : '' ),
											minHeight: ( undefined !== priceMinHeight && undefined !== priceMinHeight[ 0 ] ? priceMinHeight[ 0 ] + 'px' : undefined ),
										} }
									/>
								</div>
							}
						</div>
					</div>
				</div>
			</Fragment>
		)
	}
}

export default KadenceCategoryItem;
