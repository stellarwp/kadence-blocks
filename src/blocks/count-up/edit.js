/**
 * BLOCK: Kadence Count Up
 */

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import KadenceColorOutput from '../../components/color/kadence-color-output';
import WebfontLoader from '../../components/typography/fontloader';

/**
 * Import External
 */
import CountUp from 'react-countup';
import classnames from 'classnames';

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { Component, Fragment } = wp.element;
const { RichText } = wp.blockEditor;
const { __ } = wp.i18n;
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
const kbCountUpUniqueIDs = [];
/**
 * Build the count up edit
 */
class KadenceCounterUp extends Component {
	constructor() {
		super( ...arguments );
	}

	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			// Before applying defaults lets check to see if the user wants it.
			if ( undefined === this.props.attributes.noCustomDefaults || ! this.props.attributes.noCustomDefaults ) {
				if ( blockConfigObject[ 'kadence/countup' ] !== undefined && typeof blockConfigObject[ 'kadence/countup' ] === 'object' ) {
					Object.keys( blockConfigObject[ 'kadence/countup' ] ).map( ( attribute ) => {
						this.props.attributes[ attribute ] = blockConfigObject[ 'kadence/countup' ][ attribute ];
					} );
				}
			}
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
				numberFont: [...this.props.attributes.numberFont],
			} );
			kbCountUpUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kbCountUpUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.attributes.uniqueID = '_' + this.props.clientId.substr( 2, 9 );
			kbCountUpUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kbCountUpUniqueIDs.push( this.props.attributes.uniqueID );
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
			uniqueID,
			title,
			start,
			end,
			prefix,
			suffix,
			duration,
			separator,
			displayTitle,
			titleFont,
			titleAlign,
			titleColor,
			titleMinHeight,
			numberFont,
			numberAlign,
			numberColor,
			numberMinHeight,
			numberPadding,
			numberMobilePadding,
			numberMobileMargin,
			numberTabletMargin,
			numberTabletPadding,
			numberMargin,
			numberPaddingType,
			numberMarginType,
			titlePadding,
			titleMobilePadding,
			titleMobileMargin,
			titleTabletMargin,
			titleTabletPadding,
			titleMargin,
			titlePaddingType,
			titleMarginType,
		} = attributes
		const tagName = titleFont[ 0 ].htmlTag && titleFont[ 0 ].htmlTag !== 'heading' ? titleFont[ 0 ].htmlTag : 'h' + titleFont[ 0 ].level;

		const gconfig = {
			google: {
				families: [ titleFont[ 0 ].family + ( titleFont[ 0 ].variant ? ':' + titleFont[ 0 ].variant : '' ) ],
			},
		};
		const config = ( titleFont[ 0 ].google ? gconfig : '' );
		const ngconfig = {
			google: {
				families: [ numberFont[ 0 ].family + ( numberFont[ 0 ].variant ? ':' + numberFont[ 0 ].variant : '' ) ],
			},
		};
		const nconfig = ( numberFont[ 0 ].google ? ngconfig : '' );

		const getPreviewSize = ( device, desktopSize, tabletSize, mobileSize ) => {
			if ( device === 'Mobile' ) {
				if ( undefined !== mobileSize && '' !== mobileSize && null !== mobileSize ) {
					return mobileSize;
				} else if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
					return tabletSize;
				}
			} else if ( device === 'Tablet' ) {
				if ( undefined !== tabletSize && '' !== tabletSize && null !== tabletSize ) {
					return tabletSize;
				}
			}
			return desktopSize;
		}

		const previewTitleAlign = getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleAlign[0] ? titleAlign[0] : '' ), ( undefined !== titleAlign[1] ? titleAlign[1] : '' ), ( undefined !== titleAlign[2] ? titleAlign[2] : '' ) );
		const previewNumberAlign = getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberAlign[0] ? numberAlign[0] : '' ), ( undefined !== numberAlign[1] ? numberAlign[1] : '' ), ( undefined !== numberAlign[2] ? numberAlign[2] : '' ) );

		const previewNumberMarginTop = getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberMargin && undefined !== numberMargin[0] ? numberMargin[0] : '' ), ( undefined !== numberTabletMargin && undefined !== numberTabletMargin[0] ? numberTabletMargin[0] : '' ), ( undefined !== numberMobileMargin && undefined !== numberMobileMargin[0] ? numberMobileMargin[0] : '' ) );
		const previewNumberMarginRight = getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberMargin && undefined !== numberMargin[1] ? numberMargin[1] : '' ), ( undefined !== numberTabletMargin && undefined !== numberTabletMargin[1] ? numberTabletMargin[1] : '' ), ( undefined !== numberMobileMargin && undefined !== numberMobileMargin[1] ? numberMobileMargin[1] : '' ) );
		const previewNumberMarginBottom = getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberMargin && undefined !== numberMargin[2] ? numberMargin[2] : '' ), ( undefined !== numberTabletMargin && undefined !== numberTabletMargin[2] ? numberTabletMargin[2] : '' ), ( undefined !== numberMobileMargin && undefined !== numberMobileMargin[2] ? numberMobileMargin[2] : '' ) );
		const previewNumberMarginLeft = getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberMargin && undefined !== numberMargin[3] ? numberMargin[3] : '' ), ( undefined !== numberTabletMargin && undefined !== numberTabletMargin[3] ? numberTabletMargin[3] : '' ), ( undefined !== numberMobileMargin && undefined !== numberMobileMargin[3] ? numberMobileMargin[3] : '' ) );
		const previewNumberPaddingTop = getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberPadding && undefined !== numberPadding[0] ? numberPadding[0] : '' ), ( undefined !== numberTabletPadding && undefined !== numberTabletPadding[0] ? numberTabletPadding[0] : '' ), ( undefined !== numberMobilePadding && undefined !== numberMobilePadding[0] ? numberMobilePadding[0] : '' ) );
		const previewNumberPaddingRight= getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberPadding && undefined !== numberPadding[1] ? numberPadding[1] : '' ), ( undefined !== numberTabletPadding && undefined !== numberTabletPadding[1] ? numberTabletPadding[1] : '' ), ( undefined !== numberMobilePadding && undefined !== numberMobilePadding[1] ? numberMobilePadding[1] : '' ) );
		const previewNumberPaddingBottom = getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberPadding && undefined !== numberPadding[2] ? numberPadding[2] : '' ), ( undefined !== numberTabletPadding && undefined !== numberTabletPadding[2] ? numberTabletPadding[2] : '' ), ( undefined !== numberMobilePadding && undefined !== numberMobilePadding[2] ? numberMobilePadding[2] : '' ) );
		const previewNumberPaddingLeft = getPreviewSize( this.props.getPreviewDevice, ( undefined !== numberPadding && undefined !== numberPadding[3] ? numberPadding[3] : '' ), ( undefined !== numberTabletPadding && undefined !== numberTabletPadding[3] ? numberTabletPadding[3] : '' ), ( undefined !== numberMobilePadding && undefined !== numberMobilePadding[3] ? numberMobilePadding[3] : '' ) );

		const previewTitleMarginTop = getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleMargin && undefined !== titleMargin[0] ? titleMargin[0] : '' ), ( undefined !== titleTabletMargin && undefined !== titleTabletMargin[0] ? titleTabletMargin[0] : '' ), ( undefined !== titleMobileMargin && undefined !== titleMobileMargin[0] ? titleMobileMargin[0] : '' ) );
		const previewTitleMarginRight = getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleMargin && undefined !== titleMargin[1] ? titleMargin[1] : '' ), ( undefined !== titleTabletMargin && undefined !== titleTabletMargin[1] ? titleTabletMargin[1] : '' ), ( undefined !== titleMobileMargin && undefined !== titleMobileMargin[1] ? titleMobileMargin[1] : '' ) );
		const previewTitleMarginBottom = getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleMargin && undefined !== titleMargin[2] ? titleMargin[2] : '' ), ( undefined !== titleTabletMargin && undefined !== titleTabletMargin[2] ? titleTabletMargin[2] : '' ), ( undefined !== titleMobileMargin && undefined !== titleMobileMargin[2] ? titleMobileMargin[2] : '' ) );
		const previewTitleMarginLeft = getPreviewSize( this.props.getPreviewDevice, ( undefined !== titleMargin && undefined !== titleMargin[3] ? titleMargin[3] : '' ), ( undefined !== titleTabletMargin && undefined !== titleTabletMargin[3] ? titleTabletMargin[3] : '' ), ( undefined !== titleMobileMargin && undefined !== titleMobileMargin[3] ? titleMobileMargin[3] : '' ) );
		const previewTitlePaddingTop = getPreviewSize( this.props.getPreviewDevice, ( undefined !== titlePadding && undefined !== titlePadding[0] ? titlePadding[0] : '' ), ( undefined !== titleTabletPadding && undefined !== titleTabletPadding[0] ? titleTabletPadding[0] : '' ), ( undefined !== titleMobilePadding && undefined !== titleMobilePadding[0] ? titleMobilePadding[0] : '' ) );
		const previewTitlePaddingRight= getPreviewSize( this.props.getPreviewDevice, ( undefined !== titlePadding && undefined !== titlePadding[1] ? titlePadding[1] : '' ), ( undefined !== titleTabletPadding && undefined !== titleTabletPadding[1] ? titleTabletPadding[1] : '' ), ( undefined !== titleMobilePadding && undefined !== titleMobilePadding[1] ? titleMobilePadding[1] : '' ) );
		const previewTitlePaddingBottom = getPreviewSize( this.props.getPreviewDevice, ( undefined !== titlePadding && undefined !== titlePadding[2] ? titlePadding[2] : '' ), ( undefined !== titleTabletPadding && undefined !== titleTabletPadding[2] ? titleTabletPadding[2] : '' ), ( undefined !== titleMobilePadding && undefined !== titleMobilePadding[2] ? titleMobilePadding[2] : '' ) );
		const previewTitlePaddingLeft = getPreviewSize( this.props.getPreviewDevice, ( undefined !== titlePadding && undefined !== titlePadding[3] ? titlePadding[3] : '' ), ( undefined !== titleTabletPadding && undefined !== titleTabletPadding[3] ? titleTabletPadding[3] : '' ), ( undefined !== titleMobilePadding && undefined !== titleMobilePadding[3] ? titleMobilePadding[3] : '' ) );

		const classes = classnames( {
			[ `kb-count-up-${ uniqueID }` ]: uniqueID,
			'kb-count-up': true
		} );
		let theSeparator = ( separator === true ? ',' : separator );
		theSeparator = ( theSeparator === false ? '' : theSeparator );
		return (
			<Fragment>
				{ isSelected && <Inspector {...this.props} /> }

				{ displayTitle && titleFont[ 0 ].google && (
					<WebfontLoader config={ config } />
				) }

				{ numberFont[ 0 ].google && (
					<WebfontLoader config={ nconfig } />
				) }
				<div className={ classes }>
					<div
						className={ 'kb-count-up-number' }
						style={ {
							fontWeight: numberFont[ 0 ].weight,
							fontStyle: numberFont[ 0 ].style,
							color: KadenceColorOutput( numberColor ),
							fontSize: numberFont[ 0 ].size[ 0 ] + numberFont[ 0 ].sizeType,
							lineHeight: ( numberFont[ 0 ].lineHeight && numberFont[ 0 ].lineHeight[ 0 ] ? numberFont[ 0 ].lineHeight[ 0 ] + numberFont[ 0 ].lineType : undefined ),
							letterSpacing: numberFont[ 0 ].letterSpacing + 'px',
							fontFamily: ( numberFont[ 0 ].family ? numberFont[ 0 ].family : '' ),
							minHeight: ( undefined !== numberMinHeight && undefined !== numberMinHeight[ 0 ] ? numberMinHeight[ 0 ] + 'px' : undefined ),
							textAlign: previewNumberAlign,
							paddingTop: ( '' !== previewNumberPaddingTop ? previewNumberPaddingTop + numberPaddingType : undefined ),
							paddingRight: ( '' !== previewNumberPaddingRight ? previewNumberPaddingRight + numberPaddingType : undefined ),
							paddingBottom: ( '' !== previewNumberPaddingBottom ? previewNumberPaddingBottom + numberPaddingType : undefined ),
							paddingLeft: ( '' !== previewNumberPaddingLeft ? previewNumberPaddingLeft + numberPaddingType : undefined ),
							marginTop: ( previewNumberMarginTop ? previewNumberMarginTop + numberMarginType : undefined ),
							marginRight: ( previewNumberMarginRight ? previewNumberMarginRight + numberMarginType : undefined ),
							marginBottom: ( previewNumberMarginBottom ? previewNumberMarginBottom + numberMarginType : undefined ),
							marginLeft: ( previewNumberMarginLeft ? previewNumberMarginLeft + numberMarginType : undefined ),
						} }
					>
						<CountUp
							start={ start }
							end={ end }
							duration={ duration }
							separator={ theSeparator }
							prefix={ prefix }
							suffix={ suffix }
						/>
					</div>

					{ 	displayTitle &&
						<RichText
							tagName={ tagName }
							className={ 'kb-count-up-title' }
							value={ title }
							onChange={ (content) => setAttributes({ title: content }) }
							placeholder={ __( 'Type Here...', 'kadence-blocks' ) }
							style={ {
								fontWeight: titleFont[ 0 ].weight,
								fontStyle: titleFont[ 0 ].style,
								color: KadenceColorOutput( titleColor ),
								fontSize: titleFont[ 0 ].size[ 0 ] + titleFont[ 0 ].sizeType,
								lineHeight: ( titleFont[ 0 ].lineHeight && titleFont[ 0 ].lineHeight[ 0 ] ? titleFont[ 0 ].lineHeight[ 0 ] + titleFont[ 0 ].lineType : undefined ),
								letterSpacing: titleFont[ 0 ].letterSpacing + 'px',
								fontFamily: ( titleFont[ 0 ].family ? titleFont[ 0 ].family : '' ),
								minHeight: ( undefined !== titleMinHeight && undefined !== titleMinHeight[ 0 ] ? titleMinHeight[ 0 ] + 'px' : undefined ),
								textAlign: previewTitleAlign,
								paddingTop: ( '' !== previewTitlePaddingTop ? previewTitlePaddingTop + titlePaddingType : undefined ),
								paddingRight: ( '' !== previewTitlePaddingRight ? previewTitlePaddingRight + titlePaddingType : undefined ),
								paddingBottom: ( '' !== previewTitlePaddingBottom ? previewTitlePaddingBottom + titlePaddingType : undefined ),
								paddingLeft: ( '' !== previewTitlePaddingLeft ? previewTitlePaddingLeft + titlePaddingType : undefined ),
								marginTop: ( previewTitleMarginTop ? previewTitleMarginTop + titleMarginType : undefined ),
								marginRight: ( previewTitleMarginRight ? previewTitleMarginRight + titleMarginType : undefined ),
								marginBottom: ( previewTitleMarginBottom ? previewTitleMarginBottom + titleMarginType : undefined ),
								marginLeft: ( previewTitleMarginLeft ? previewTitleMarginLeft + titleMarginType : undefined ),
							} }
						/>
					}
				</div>
			</Fragment>
		)
	}
}

export default compose( [
	withSelect( ( select, ownProps ) => {
		return {
			getPreviewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
		};
	} ),
] )( KadenceCounterUp );
