/**
 * BLOCK: Kadence Spacer
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import files
 */
import { spacerBlockIcon } from '@kadence/icons';
import edit from './edit';
import deprecated from './deprecated';
import SvgPattern from './svg-pattern';
import { KadenceColorOutput } from '@kadence/helpers';
import classnames from 'classnames';
/**
 * Import Css
 */
// import './style.scss';
//import './editor.scss';
const {
	Fragment,
} = wp.element;
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
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
	title: __( 'Spacer/Divider', 'kadence-blocks' ), // Block title.
	icon: {
		src: spacerBlockIcon,
	},
	category: 'kadence-blocks', // Block category — Group blocks together based on common traits E.g. common, formatting, layout widgets, embed.
	keywords: [
		__( 'spacer', 'kadence-blocks' ),
		__( 'divider', 'kadence-blocks' ),
		__( 'separator', 'kadence-blocks' ),
		'kb',
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
		dividerWidthUnits: {
			type: 'string',
			default: '%',
		},
		tabletDividerWidth: {
			type: 'number',
		},
		mobileDividerWidth: {
			type: 'number',
		},
		dividerHeight: {
			type: 'number',
			default: 1,
		},
		tabletDividerHeight: {
			type: 'number',
		},
		mobileDividerHeight: {
			type: 'number',
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
		const { attributes: { blockAlignment, dividerEnable, dividerStyle, hAlign, dividerColor, dividerOpacity, uniqueID, rotate, strokeWidth, strokeGap, tabletHAlign, mobileHAlign, vsdesk, vstablet, vsmobile } } = props;
		let alp;
		if ( dividerOpacity < 10 ) {
			alp = '0.0' + dividerOpacity;
		} else if ( dividerOpacity >= 100 ) {
			alp = '1';
		} else {
			alp = '0.' + dividerOpacity;
		}
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
				<div className={ innerSpacerClasses }>
					{ dividerEnable && (
						<Fragment>
							{ dividerStyle === 'stripe' && (
								<span className="kt-divider-stripe">
									<SvgPattern uniqueID={ uniqueID } color={ KadenceColorOutput( dividerColor ) } opacity={ dividerOpacity } rotate={ rotate } strokeWidth={ strokeWidth } strokeGap={ strokeGap } />
								</span>
							) }
							{ dividerStyle !== 'stripe' && (
								<hr className="kt-divider"/>
							) }
						</Fragment>
					) }
				</div>
			</div>
		);
	},
	deprecated,
} );
