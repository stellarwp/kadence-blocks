/**
 * BLOCK: Kadence Section
 *
 * Registering Deprecations.
 */
/**
 * External dependencies
 */
 import classnames from 'classnames';
import hexToRGBA from '../../components/color/hex-to-rgba';
import KadenceColorOutput from '../../components/color/deprecated-kadence-color-output';
/**
 * Internal dependencies
 */
 import KadenceColorOutputNEW from '../../components/color/kadence-color-output';
import {
	InnerBlocks,
} from '@wordpress/block-editor';
export default [
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
			bgColorClass: {
				type: 'string',
				default: '',
			},
			templateLock: {
				type: 'string',
			},
			direction: {
				type: 'array',
				default: [ '', '', '' ],
			},
			justifyContent: {
				type: 'array',
				default: [ '', '', '' ],
			},
			gutter: {
				type: 'array',
				default: [ '', '', '' ],
			},
			gutterUnit: {
				type: 'string',
				default: 'px',
			},
			verticalAlignment: {
				type: 'string',
			},
			backgroundImgHover: {
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
			backgroundHover: {
				type: 'string',
				default: '',
			},
			borderHover: {
				type: 'string',
				default: '',
			},
			borderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			tabletBorderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			mobileBorderHoverWidth: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			borderHoverRadius: {
				type: 'array',
				default: [ '', '', '', '' ],
			},
			displayHoverShadow: {
				type: 'bool',
				default: false,
			},
			shadowHover: {
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
			textColorHover: {
				type: 'string',
				default: '',
			},
			linkColorHover: {
				type: 'string',
				default: '',
			},
			linkHoverColorHover: {
				type: 'string',
				default: '',
			},
			inQueryBlock: {
				type: 'bool',
				default: false,
			},
			kadenceBlockCSS: {
				type: 'string',
				default: '',
			},
			kadenceAnimation: {
				type: 'string',
			},
			kadenceAOSOptions: {
				type: 'array',
				default: [ {
					duration: '',
					offset: '',
					easing: '',
					once: '',
					delay: '',
					delayOffset: '',
				} ],
			},
			kadenceDynamic: {
				type: 'object',
			},
			kadenceConditional: {
				type: 'object',
			},
		},
		save: ( { attributes } ) => {
			const { id, background, backgroundOpacity, backgroundImg, uniqueID, vsdesk, vstablet, vsmobile, bgColorClass } = attributes;
			const bgImg = ( backgroundImg && backgroundImg[ 0 ] && backgroundImg[ 0 ].bgImg ? backgroundImg[ 0 ].bgImg : '' );
			const backgroundString = ( background && '' === bgImg ? KadenceColorOutputNEW( background, backgroundOpacity ) : undefined );
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
		}
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
			bgColorClass: {
				type: 'string',
				default: '',
			},
			templateLock: {
				type: 'string',
			}
		},
		save: ( { attributes } ) => {
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
];
