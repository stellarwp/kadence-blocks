/**
 * BLOCK: Kadence Column
 *
 * Registering a basic block with Gutenberg.
 */

/**
 * Import Icons
 */
import icons from '../../icons';

import hexToRGBA from '../../hex-to-rgba';
import classnames from 'classnames';
import KadenceColorOutput from '../../kadence-color-output';
/**
 * Internal dependencies
 */
import edit from './edit';
import deprecated from './deprecated';
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
const { registerBlockType } = wp.blocks;
const {
	InnerBlocks,
} = wp.blockEditor;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/column', {
	title: __( 'Section', 'kadence-blocks' ),
	description: __( 'An inner section of content.', 'kadence-blocks' ),
	icon: icons.blockColumn,
	category: 'kadence-blocks',
	parent: [ 'kadence/rowlayout' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
		},
		topPadding: {
			type: 'number',
			default: '',
		},
		bottomPadding: {
			type: 'number',
			default: '',
		},
		leftPadding: {
			type: 'number',
			default: '',
		},
		rightPadding: {
			type: 'number',
			default: '',
		},
		topPaddingM: {
			type: 'number',
			default: '',
		},
		bottomPaddingM: {
			type: 'number',
			default: '',
		},
		leftPaddingM: {
			type: 'number',
			default: '',
		},
		rightPaddingM: {
			type: 'number',
			default: '',
		},
		topMargin: {
			type: 'number',
			default: '',
		},
		bottomMargin: {
			type: 'number',
			default: '',
		},
		topMarginM: {
			type: 'number',
			default: '',
		},
		bottomMarginM: {
			type: 'number',
			default: '',
		},
		leftMargin: {
			type: 'number',
			default: '',
		},
		rightMargin: {
			type: 'number',
			default: '',
		},
		leftMarginM: {
			type: 'number',
			default: '',
		},
		rightMarginM: {
			type: 'number',
			default: '',
		},
		zIndex: {
			type: 'number',
			default: '',
		},
		background: {
			type: 'string',
			default: '',
		},
		backgroundOpacity: {
			type: 'number',
			default: 1,
		},
		border: {
			type: 'string',
			default: '',
		},
		borderOpacity: {
			type: 'number',
			default: 1,
		},
		borderWidth: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		tabletBorderWidth: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		mobileBorderWidth: {
			type: 'array',
			default: [ '', '', '', '' ],
		},
		borderRadius: {
			type: 'array',
			default: [ 0, 0, 0, 0 ],
		},
		uniqueID: {
			type: 'string',
			default: '',
		},
		collapseOrder: {
			type: 'number',
		},
		backgroundImg: {
			type: 'array',
			default: [ {
				bgImg: '',
				bgImgID: '',
				bgImgSize: 'cover',
				bgImgPosition: 'center center',
				bgImgAttachment: 'scroll',
				bgImgRepeat: 'no-repeat',
			} ],
		},
		textAlign: {
			type: 'array',
			default: [ '', '', '' ],
		},
		textColor: {
			type: 'string',
			default: '',
		},
		linkColor: {
			type: 'string',
			default: '',
		},
		linkHoverColor: {
			type: 'string',
			default: '',
		},
		topPaddingT: {
			type: 'number',
			default: '',
		},
		bottomPaddingT: {
			type: 'number',
			default: '',
		},
		leftPaddingT: {
			type: 'number',
			default: '',
		},
		rightPaddingT: {
			type: 'number',
			default: '',
		},
		topMarginT: {
			type: 'number',
			default: '',
		},
		bottomMarginT: {
			type: 'number',
			default: '',
		},
		leftMarginT: {
			type: 'number',
			default: '',
		},
		rightMarginT: {
			type: 'number',
			default: '',
		},
		displayShadow: {
			type: 'bool',
			default: false,
		},
		shadow: {
			type: 'array',
			default: [ {
				color: '#000000',
				opacity: 0.2,
				spread: 0,
				blur: 14,
				hOffset: 0,
				vOffset: 0,
				inset: false,
			} ],
		},
		noCustomDefaults: {
			type: 'bool',
			default: false,
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
		paddingType: {
			type: 'string',
			default: 'px',
		},
		marginType: {
			type: 'string',
			default: 'px',
		},
	},
	supports: {
		inserter: false,
		reusable: false,
		html: false,
		ktanimate: true,
		ktanimateadd: true,
		ktanimatepreview: true,
		ktanimateswipe: true,
		// Add EditorsKit block navigator toolbar
		editorsKitBlockNavigator: true,
	},
	edit,

	save( { attributes } ) {
		const { id, background, backgroundOpacity, backgroundImg, uniqueID, vsdesk, vstablet, vsmobile } = attributes;
		const bgImg = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' );
		const backgroundString = ( background && '' === bgImg ? KadenceColorOutput( background, backgroundOpacity ) : undefined );
		const classes = classnames( {
			[ `inner-column-${ id }` ]: id,
			[ `kadence-column${ uniqueID }` ]: uniqueID,
			'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
			'kvs-md-false': vstablet !== 'undefined' && vstablet,
			'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
		} );
		return (
			<div className={ classes }>
				<div className={ 'kt-inside-inner-col' } style={ {
					background: backgroundString,
				} } >
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes: {
				id: {
					type: 'number',
					default: 1,
				},
				topPadding: {
					type: 'number',
					default: '',
				},
				bottomPadding: {
					type: 'number',
					default: '',
				},
				leftPadding: {
					type: 'number',
					default: '',
				},
				rightPadding: {
					type: 'number',
					default: '',
				},
				topPaddingM: {
					type: 'number',
					default: '',
				},
				bottomPaddingM: {
					type: 'number',
					default: '',
				},
				leftPaddingM: {
					type: 'number',
					default: '',
				},
				rightPaddingM: {
					type: 'number',
					default: '',
				},
				topMargin: {
					type: 'number',
					default: '',
				},
				bottomMargin: {
					type: 'number',
					default: '',
				},
				topMarginM: {
					type: 'number',
					default: '',
				},
				bottomMarginM: {
					type: 'number',
					default: '',
				},
				leftMargin: {
					type: 'number',
					default: '',
				},
				rightMargin: {
					type: 'number',
					default: '',
				},
				leftMarginM: {
					type: 'number',
					default: '',
				},
				rightMarginM: {
					type: 'number',
					default: '',
				},
				zIndex: {
					type: 'number',
					default: '',
				},
				background: {
					type: 'string',
					default: '',
				},
				backgroundOpacity: {
					type: 'number',
					default: 1,
				},
				border: {
					type: 'string',
					default: '',
				},
				borderOpacity: {
					type: 'number',
					default: 1,
				},
				borderWidth: {
					type: 'array',
					default: [ 0, 0, 0, 0 ],
				},
				borderRadius: {
					type: 'array',
					default: [ 0, 0, 0, 0 ],
				},
				uniqueID: {
					type: 'string',
					default: '',
				},
				collapseOrder: {
					type: 'number',
				},
				backgroundImg: {
					type: 'array',
					default: [ {
						bgImg: '',
						bgImgID: '',
						bgImgSize: 'cover',
						bgImgPosition: 'center center',
						bgImgAttachment: 'scroll',
						bgImgRepeat: 'no-repeat',
					} ],
				},
				textAlign: {
					type: 'array',
					default: [ '', '', '' ],
				},
				textColor: {
					type: 'string',
					default: '',
				},
				linkColor: {
					type: 'string',
					default: '',
				},
				linkHoverColor: {
					type: 'string',
					default: '',
				},
				topPaddingT: {
					type: 'number',
					default: '',
				},
				bottomPaddingT: {
					type: 'number',
					default: '',
				},
				leftPaddingT: {
					type: 'number',
					default: '',
				},
				rightPaddingT: {
					type: 'number',
					default: '',
				},
				topMarginT: {
					type: 'number',
					default: '',
				},
				bottomMarginT: {
					type: 'number',
					default: '',
				},
				leftMarginT: {
					type: 'number',
					default: '',
				},
				rightMarginT: {
					type: 'number',
					default: '',
				},
				displayShadow: {
					type: 'bool',
					default: false,
				},
				shadow: {
					type: 'array',
					default: [ {
						color: '#000000',
						opacity: 0.2,
						spread: 0,
						blur: 14,
						hOffset: 0,
						vOffset: 0,
						inset: false,
					} ],
				},
				noCustomDefaults: {
					type: 'bool',
					default: false,
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
				}
			},
			save: ( { attributes } ) => {
				const { id, background, backgroundOpacity, backgroundImg, uniqueID } = attributes;
				const bgImg = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' );
				const backgroundString = ( background && '' === bgImg ? KadenceColorOutput( background, backgroundOpacity ) : undefined );
				return (
					<div className={ `inner-column-${ id } kadence-column${ uniqueID }` }>
						<div className={ 'kt-inside-inner-col' } style={ {
							background: backgroundString,
						} } >
							<InnerBlocks.Content />
						</div>
					</div>
				);
			},
		},
		{
			attributes: {
				id: {
					type: 'number',
					default: 1,
				},
				topPadding: {
					type: 'number',
					default: '',
				},
				bottomPadding: {
					type: 'number',
					default: '',
				},
				leftPadding: {
					type: 'number',
					default: '',
				},
				rightPadding: {
					type: 'number',
					default: '',
				},
				topPaddingM: {
					type: 'number',
					default: '',
				},
				bottomPaddingM: {
					type: 'number',
					default: '',
				},
				leftPaddingM: {
					type: 'number',
					default: '',
				},
				rightPaddingM: {
					type: 'number',
					default: '',
				},
				topMargin: {
					type: 'number',
					default: '',
				},
				bottomMargin: {
					type: 'number',
					default: '',
				},
				topMarginM: {
					type: 'number',
					default: '',
				},
				bottomMarginM: {
					type: 'number',
					default: '',
				},
				leftMargin: {
					type: 'number',
					default: '',
				},
				rightMargin: {
					type: 'number',
					default: '',
				},
				leftMarginM: {
					type: 'number',
					default: '',
				},
				rightMarginM: {
					type: 'number',
					default: '',
				},
				zIndex: {
					type: 'number',
					default: '',
				},
				background: {
					type: 'string',
					default: '',
				},
				backgroundOpacity: {
					type: 'number',
					default: 1,
				},
			},
			save: ( { attributes } ) => {
				const { id, background, backgroundOpacity } = attributes;
				const backgroundString = ( background ? hexToRGBA( background, backgroundOpacity ) : undefined );
				return (
					<div className={ `inner-column-${ id }` }>
						<div className={ 'kt-inside-inner-col' } style={ {
							background: backgroundString,
						} } >
							<InnerBlocks.Content />
						</div>
					</div>
				);
			},
		},
		{
			attributes: {
				id: {
					type: 'number',
					default: 1,
				},
			},
			save: ( { attributes } ) => {
				const { id } = attributes;
				return (
					<div className={ `inner-column-${ id }` }>
						<div className={ 'kt-inside-inner-col' } >
							<InnerBlocks.Content />
						</div>
					</div>
				);
			},
		},
		{
			attributes: {
				id: {
					type: 'number',
					default: 1,
				},
			},
			save: ( { attributes } ) => {
				const { id } = attributes;
				return (
					<div className={ `inner-column-${ id }` }>
						<InnerBlocks.Content />
					</div>
				);
			},
		},
	],
} );
