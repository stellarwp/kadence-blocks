/**
 * BLOCK: Kadence Spacer
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import files
 */
import icons from './icon';
import edit from './edit';
/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	registerBlockType,
	createBlock,
} = wp.blocks;

function kadenceHexToRGB( hex, alpha ) {
	hex = hex.replace( '#', '' );
	const r = parseInt( hex.length === 3 ? hex.slice( 0, 1 ).repeat( 2 ) : hex.slice( 0, 2 ), 16 );
	const g = parseInt( hex.length === 3 ? hex.slice( 1, 2 ).repeat( 2 ) : hex.slice( 2, 4 ), 16 );
	const b = parseInt( hex.length === 3 ? hex.slice( 2, 3 ).repeat( 2 ) : hex.slice( 4, 6 ), 16 );
	let alp;
	if ( alpha < 10 ) {
		alp = '0.0' + alpha;
	} else if ( alpha >= 100 ) {
		alp = '1';
	} else {
		alp = '0.' + alpha;
	}
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alp + ')';
}
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
		src: icons.block,
	},
	category: 'kadence-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'spacer' ),
		__( 'divider' ),
		__( 'KT' ),
	],
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
		const { attributes: { blockAlignment, spacerHeight, dividerEnable, dividerStyle, hAlign, dividerColor, dividerOpacity, dividerHeight, dividerWidth, uniqueID } } = props;
		const dividerBorderColor = ( ! dividerColor ? kadenceHexToRGB( '#eee', dividerOpacity ) : kadenceHexToRGB( dividerColor, dividerOpacity ) );
		return (
			<div className={ `align${ ( blockAlignment ? blockAlignment : 'none' ) } kt-block-spacer-${ uniqueID }` }>
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
				const dividerBorderColor = ( ! dividerColor ? kadenceHexToRGB( '#eee', dividerOpacity ) : kadenceHexToRGB( dividerColor, dividerOpacity ) );
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
				const dividerBorderColor = ( ! dividerColor ? kadenceHexToRGB( '#eee', dividerOpacity ) : kadenceHexToRGB( dividerColor, dividerOpacity ) );
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
