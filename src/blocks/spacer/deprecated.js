/**
 * BLOCK: Spacer
 *
 * Depreciated.
 */
 import SvgPattern from './svg-pattern';
 import KadenceColorOutputOld from '../../components/color/deprecated-kadence-color-output';
 import KadenceColorOutput from '../../components/color/kadence-color-output';
 import classnames from 'classnames';
import {
	Fragment,
	renderToString,
} from '@wordpress/element';

/**
 * Internal block libraries
 */
 import { __ } from '@wordpress/i18n';
 
 export default [
	{
		attributes: {
			blockAlignment: {
				type: 'string',
				default: 'center',
			},
			hAlign: {
				type: 'string',
				default: 'center',
			},
			spacerHeight: {
				type: 'number',
				default: 60,
			},
			spacerHeightUnits: {
				type: 'string',
				default: 'px',
			},
			tabletSpacerHeight: {
				type: 'number',
				default: '',
			},
			mobileSpacerHeight: {
				type: 'number',
				default: '',
			},
			dividerEnable: {
				type: 'boolean',
				default: true,
			},
			dividerStyle: {
				type: 'string',
				default: 'solid',
			},
			dividerOpacity: {
				type: 'number',
				default: 100,
			},
			dividerColor: {
				type: 'string',
				default: '#eee',
			},
			dividerWidth: {
				type: 'number',
				default: 80,
			},
			dividerHeight: {
				type: 'number',
				default: 1,
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
			rotate: {
				type: 'number',
				default: 40,
			},
			strokeWidth: {
				type: 'number',
				default: 4,
			},
			strokeGap: {
				type: 'number',
				default: 5,
			},
			tabletHAlign: {
				type: 'string',
				default: '',
			},
			mobileHAlign: {
				type: 'string',
				default: '',
			},
			vsdesk: {
				type: 'bool',
				default: false,
			},
			vstablet: {
				type: 'bool',
				default: false,
			},
			vsmobile: {
				type: 'bool',
				default: false,
			},
		},
		save: ( { attributes } ) => {
			const { blockAlignment, spacerHeight, dividerEnable, dividerStyle, hAlign, dividerColor, dividerOpacity, dividerHeight, dividerWidth, uniqueID, spacerHeightUnits, rotate, strokeWidth, strokeGap, tabletHAlign, mobileHAlign, vsdesk, vstablet, vsmobile } = attributes;
			let alp;
			if ( dividerOpacity < 10 ) {
				alp = '0.0' + dividerOpacity;
			} else if ( dividerOpacity >= 100 ) {
				alp = '1';
			} else {
				alp = '0.' + dividerOpacity;
			}
			const dividerBorderColor = ( ! dividerColor ? KadenceColorOutput( '#eeeeee', alp ) : KadenceColorOutput( dividerColor, alp ) );
			const classes = classnames( {
				[ `align${ ( blockAlignment ? blockAlignment : 'none' ) }` ]: true,
				[ `kt-block-spacer-${ uniqueID }` ]: uniqueID,
				'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
				'kvs-md-false': vstablet !== 'undefined' && vstablet,
				'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
			} );
			const innerSpacerClasses = classnames( {
				'kt-block-spacer': true,
				[ `kt-block-spacer-halign-${ hAlign }` ]: hAlign,
				[ `kt-block-spacer-thalign-${ tabletHAlign }` ]: tabletHAlign,
				[ `kt-block-spacer-malign-${ mobileHAlign }` ]: mobileHAlign,
			} );
			return (
				<div className={ classes }>
					<div className={ innerSpacerClasses } style={ {
						height: spacerHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ),
					} } >
						{ dividerEnable && (
							<Fragment>
								{ dividerStyle === 'stripe' && (
									<span className="kt-divider-stripe" style={ {
										height: ( dividerHeight < 10 ? 10 : dividerHeight ) + 'px',
										width: dividerWidth + '%',
									} }>
										<SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutput( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } />
									</span>
								) }
								{ dividerStyle !== 'stripe' && (
									<hr className="kt-divider" style={ {
										borderTopColor: dividerBorderColor,
										borderTopWidth: dividerHeight + 'px',
										width: dividerWidth + '%',
										borderTopStyle: dividerStyle,
									} } />
								) }
							</Fragment>
						) }
					</div>
				</div>
			);
		}
	},
	{
		attributes: {
			blockAlignment: {
				type: 'string',
				default: 'center',
			},
			hAlign: {
				type: 'string',
				default: 'center',
			},
			spacerHeight: {
				type: 'number',
				default: 60,
			},
			spacerHeightUnits: {
				type: 'string',
				default: 'px',
			},
			tabletSpacerHeight: {
				type: 'number',
				default: '',
			},
			mobileSpacerHeight: {
				type: 'number',
				default: '',
			},
			dividerEnable: {
				type: 'boolean',
				default: true,
			},
			dividerStyle: {
				type: 'string',
				default: 'solid',
			},
			dividerOpacity: {
				type: 'number',
				default: 100,
			},
			dividerColor: {
				type: 'string',
				default: '#eee',
			},
			dividerWidth: {
				type: 'number',
				default: 80,
			},
			dividerHeight: {
				type: 'number',
				default: 1,
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
			rotate: {
				type: 'number',
				default: 40,
			},
			strokeWidth: {
				type: 'number',
				default: 4,
			},
			strokeGap: {
				type: 'number',
				default: 5,
			},
			tabletHAlign: {
				type: 'string',
				default: '',
			},
			mobileHAlign: {
				type: 'string',
				default: '',
			},
			vsdesk: {
				type: 'bool',
				default: false,
			},
			vstablet: {
				type: 'bool',
				default: false,
			},
			vsmobile: {
				type: 'bool',
				default: false,
			},
		},
		save: ( { attributes } ) => {
			const { blockAlignment, spacerHeight, dividerEnable, dividerStyle, hAlign, dividerColor, dividerOpacity, dividerHeight, dividerWidth, uniqueID, spacerHeightUnits, rotate, strokeWidth, strokeGap, tabletHAlign, mobileHAlign, vsdesk, vstablet, vsmobile } = attributes;
			let alp;
			if ( dividerOpacity < 10 ) {
				alp = '0.0' + dividerOpacity;
			} else if ( dividerOpacity >= 100 ) {
				alp = '1';
			} else {
				alp = '0.' + dividerOpacity;
			}
			const dividerBorderColor = ( ! dividerColor ? KadenceColorOutputOld( '#eeeeee', alp ) : KadenceColorOutputOld( dividerColor, alp ) );
			const getDataUri = () => {
				let svgStringPre = renderToString( <SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutputOld( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } /> );
				svgStringPre = svgStringPre.replace( 'patterntransform', 'patternTransform' );
				svgStringPre = svgStringPre.replace( 'patternunits', 'patternUnits' );
				const dataUri = `url("data:image/svg+xml;base64,${btoa(svgStringPre)}")`;
				return dataUri;
			};
			const classes = classnames( {
				[ `align${ ( blockAlignment ? blockAlignment : 'none' ) }` ]: true,
				[ `kt-block-spacer-${ uniqueID }` ]: uniqueID,
				'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
				'kvs-md-false': vstablet !== 'undefined' && vstablet,
				'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
			} );
			const innerSpacerClasses = classnames( {
				'kt-block-spacer': true,
				[ `kt-block-spacer-halign-${ hAlign }` ]: hAlign,
				[ `kt-block-spacer-thalign-${ tabletHAlign }` ]: tabletHAlign,
				[ `kt-block-spacer-malign-${ mobileHAlign }` ]: mobileHAlign,
			} );
			return (
				<div className={ classes }>
					<div className={ innerSpacerClasses } style={ {
						height: spacerHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ),
					} } >
						{ dividerEnable && (
							<Fragment>
								{ dividerStyle === 'stripe' && (
									<span className="kt-divider-stripe" style={ {
										height: ( dividerHeight < 10 ? 10 : dividerHeight ) + 'px',
										width: dividerWidth + '%',
									} }>
										<SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutputOld( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } />
									</span>
								) }
								{ dividerStyle !== 'stripe' && (
									<hr className="kt-divider" style={ {
										borderTopColor: dividerBorderColor,
										borderTopWidth: dividerHeight + 'px',
										width: dividerWidth + '%',
										borderTopStyle: dividerStyle,
									} } />
								) }
							</Fragment>
						) }
					</div>
				</div>
			);
		},
	},
	{
		attributes: {
			blockAlignment: {
				type: 'string',
				default: 'center',
			},
			hAlign: {
				type: 'string',
				default: 'center',
			},
			spacerHeight: {
				type: 'number',
				default: 60,
			},
			spacerHeightUnits: {
				type: 'string',
				default: 'px',
			},
			tabletSpacerHeight: {
				type: 'number',
				default: '',
			},
			mobileSpacerHeight: {
				type: 'number',
				default: '',
			},
			dividerEnable: {
				type: 'boolean',
				default: true,
			},
			dividerStyle: {
				type: 'string',
				default: 'solid',
			},
			dividerOpacity: {
				type: 'number',
				default: 100,
			},
			dividerColor: {
				type: 'string',
				default: '#eee',
			},
			dividerWidth: {
				type: 'number',
				default: 80,
			},
			dividerHeight: {
				type: 'number',
				default: 1,
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
		},
		save: ( { attributes } ) => {
			const { blockAlignment, spacerHeight, dividerEnable, dividerStyle, hAlign, dividerHeight, dividerWidth, uniqueID, spacerHeightUnits } = attributes;
			return (
				<div className={ `align${ ( blockAlignment ? blockAlignment : 'none' ) } kt-block-spacer-${ uniqueID }` }>
					<div className={ `kt-block-spacer kt-block-spacer-halign-${ hAlign }` } style={ {
						height: spacerHeight + ( spacerHeightUnits ? spacerHeightUnits : 'px' ),
					} } >
						{ dividerEnable && (
							<hr className="kt-divider" style={ {
								borderTopWidth: dividerHeight + 'px',
								width: dividerWidth + '%',
								borderTopStyle: dividerStyle,
							} } />
						) }
					</div>
				</div>
			);
		},
	},
	{
		attributes: {
			blockAlignment: {
				type: 'string',
				default: 'center',
			},
			hAlign: {
				type: 'string',
				default: 'center',
			},
			spacerHeight: {
				type: 'number',
				default: '60',
			},
			dividerEnable: {
				type: 'boolean',
				default: true,
			},
			dividerStyle: {
				type: 'string',
				default: 'solid',
			},
			dividerOpacity: {
				type: 'number',
				default: '100',
			},
			dividerColor: {
				type: 'string',
				default: '#eee',
			},
			dividerWidth: {
				type: 'number',
				default: '80',
			},
			dividerHeight: {
				type: 'number',
				default: '1',
			},
			uniqueID: {
				type: 'string',
				default: '',
			},
		},
		save: ( { attributes } ) => {
			const { blockAlignment, spacerHeight, dividerEnable, dividerStyle, hAlign, dividerColor, dividerOpacity, dividerHeight, dividerWidth } = attributes;
			const dividerBorderColor = ( ! dividerColor ? KadenceColorOutputOld( '#eeeeee', dividerOpacity ) : KadenceColorOutputOld( dividerColor, dividerOpacity ) );
			return (
				<div className={ `align${ blockAlignment }` }>
					<div className={ `kt-block-spacer kt-block-spacer-halign-${ hAlign }` } style={ {
						height: spacerHeight + 'px',
					} } >
						{ dividerEnable && (
							<hr className="kt-divider" style={ {
								borderTopColor: dividerBorderColor,
								borderTopWidth: dividerHeight + 'px',
								width: dividerWidth + '%',
								borderTopStyle: dividerStyle,
							} } />
						) }
					</div>
				</div>
			);
		},
	},
	{
		attributes: {
			blockAlignment: {
				type: 'string',
				default: 'center',
			},
			hAlign: {
				type: 'string',
				default: 'center',
			},
			spacerHeight: {
				type: 'number',
				default: '60',
			},
			dividerEnable: {
				type: 'boolean',
				default: true,
			},
			dividerStyle: {
				type: 'string',
				default: 'solid',
			},
			dividerOpacity: {
				type: 'number',
				default: '100',
			},
			dividerColor: {
				type: 'string',
				default: '#eee',
			},
			dividerWidth: {
				type: 'number',
				default: '80',
			},
			dividerHeight: {
				type: 'number',
				default: '1',
			},
		},
		save: ( { attributes } ) => {
			const { blockAlignment, spacerHeight, dividerEnable, dividerStyle, dividerColor, dividerOpacity, dividerHeight, dividerWidth } = attributes;
			const dividerBorderColor = ( ! dividerColor ? KadenceColorOutputOld( '#eee', dividerOpacity ) : KadenceColorOutputOld( dividerColor, dividerOpacity ) );
			return (
				<div className={ `align${ blockAlignment }` }>
					<div className="kt-block-spacer" style={ {
						height: spacerHeight + 'px',
					} } >
						{ dividerEnable && (
							<hr className="kt-divider" style={ {
								borderTopColor: dividerBorderColor,
								borderTopWidth: dividerHeight + 'px',
								width: dividerWidth + '%',
								borderTopStyle: dividerStyle,
							} } />
						) }
					</div>
				</div>
			);
		},
	},
];
	