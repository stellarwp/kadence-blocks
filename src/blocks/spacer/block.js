/**
 * BLOCK: Kadence Spacer
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import files
 */
import icons from '../../icons';
import edit from './edit';
import SvgPattern from './svg-pattern';
import KadenceColorOutput from '../../kadence-color-output';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';
const {
	Fragment,
	renderToString,
} = wp.element;
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	registerBlockType,
	createBlock,
} = wp.blocks;
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/spacer', {
	title: __( 'Spacer/Divider' ), // Block title.
	icon: {
		src: icons.spacerblock,
	},
	category: 'kadence-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'spacer' ),
		__( 'divider' ),
		__( 'KT' ),
	],
	supports: {
		anchor: true,
	},
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
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/spacer' ],
				transform: ( { height } ) => {
					return createBlock( 'kadence/spacer', {
						spacerHeight: height,
						divider: false,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/separator' ],
				transform: () => {
					return createBlock( 'kadence/spacer', {
						spacerHeight: 30,
						divider: true,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/spacer' ],
				transform: ( { spacerHeight } ) => {
					return createBlock( 'core/spacer', {
						height: spacerHeight,
					} );
				},
			},
			{
				type: 'block',
				blocks: [ 'core/separator' ],
				transform: () => {
					return createBlock( 'core/separator' );
				},
			},
		],
	},
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,
	save: props => {
		const { attributes: { blockAlignment, spacerHeight, dividerEnable, dividerStyle, hAlign, dividerColor, dividerOpacity, dividerHeight, dividerWidth, uniqueID, spacerHeightUnits, rotate, strokeWidth, strokeGap } } = props;
		let alp;
		if ( dividerOpacity < 10 ) {
			alp = '0.0' + dividerOpacity;
		} else if ( dividerOpacity >= 100 ) {
			alp = '1';
		} else {
			alp = '0.' + dividerOpacity;
		}
		const dividerBorderColor = ( ! dividerColor ? KadenceColorOutput( '#eeeeee', alp ) : KadenceColorOutput( dividerColor, alp ) );
		const getDataUri = () => {
			let svgStringPre = renderToString( <SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutput( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } /> );
			svgStringPre = svgStringPre.replace( 'patterntransform', 'patternTransform' );
			svgStringPre = svgStringPre.replace( 'patternunits', 'patternUnits' );
			const dataUri = `url("data:image/svg+xml;base64,${btoa(svgStringPre)}")`;
			return dataUri;
		};
		return (
			<div className={ `align${ ( blockAlignment ? blockAlignment : 'none' ) } kt-block-spacer-${ uniqueID }` }>
				<div className={ `kt-block-spacer kt-block-spacer-halign-${ hAlign }` } style={ {
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
	},
	deprecated: [
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
				const dividerBorderColor = ( ! dividerColor ? KadenceColorOutput( '#eeeeee', dividerOpacity ) : KadenceColorOutput( dividerColor, dividerOpacity ) );
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
				const dividerBorderColor = ( ! dividerColor ? KadenceColorOutput( '#eee', dividerOpacity ) : KadenceColorOutput( dividerColor, dividerOpacity ) );
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
	],
} );
