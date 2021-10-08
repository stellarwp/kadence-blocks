/**
 * BLOCK: Kadence Info Box
 */
import { __ } from '@wordpress/i18n';
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	link: {
		type: 'string',
		source: 'attribute',
		attribute: 'href',
		selector: 'a.info-box-link',
	},
	linkProperty: {
		type: 'string',
		default: 'box',
	},
	target: {
		type: 'string',
		source: 'attribute',
		attribute: 'target',
		selector: 'a.info-box-link',
		default: '_self',
	},
	hAlign: {
		type: 'string',
		default: 'center',
	},
	hAlignTablet: {
		type: 'string',
		default: '',
	},
	hAlignMobile: {
		type: 'string',
		default: '',
	},
	containerBackground: {
		type: 'string',
		default: '#f2f2f2',
	},
	containerBackgroundOpacity: {
		type: 'number',
		default: 1,
	},
	containerHoverBackground: {
		type: 'string',
		default: '#f2f2f2',
	},
	containerHoverBackgroundOpacity: {
		type: 'number',
		default: 1,
	},
	containerBorder: {
		type: 'string',
		default: '#eeeeee',
	},
	containerBorderOpacity: {
		type: 'number',
		default: 1,
	},
	containerHoverBorder: {
		type: 'string',
		default: '#eeeeee',
	},
	containerHoverBorderOpacity: {
		type: 'number',
		default: 1,
	},
	containerBorderWidth: {
		type: 'array',
		default: [ 0, 0, 0, 0 ],
	},
	containerBorderRadius: {
		type: 'number',
		default: 0,
	},
	containerPadding: {
		type: 'array',
		default: [ 20, 20, 20, 20 ],
	},
	containerTabletPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerMobilePadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerPaddingType: {
		type: 'string',
		default: 'px',
	},
	mediaType: {
		type: 'string',
		default: 'icon',
	},
	mediaAlign: {
		type: 'string',
		default: 'top',
	},
	mediaImage: {
		type: 'array',
		default: [ {
			url: '',
			id: '',
			alt: '',
			width: '',
			height: '',
			maxWidth: '',
			hoverAnimation: 'none',
			flipUrl: '',
			flipId: '',
			flipAlt: '',
			flipWidth: '',
			flipHeight: '',
			subtype: '',
			flipSubtype: '',
		} ],
	},
	mediaIcon: {
		type: 'array',
		default: [ {
			icon: 'fe_aperture',
			size: 50,
			width: 2,
			title: '',
			color: '#444444',
			hoverColor: '#444444',
			hoverAnimation: 'none',
			flipIcon: '',
			tabletSize: '',
			mobileSize: '',
		} ],
	},
	mediaStyle: {
		type: 'array',
		default: [ {
			background: 'transparent',
			hoverBackground: 'transparent',
			border: '#444444',
			hoverBorder: '#444444',
			borderRadius: 0,
			borderWidth: [ 0, 0, 0, 0 ],
			padding: [ 10, 10, 10, 10 ],
			margin: [ 0, 15, 0, 15 ],
		} ],
	},
	displayTitle: {
		type: 'bool',
		default: true,
	},
	title: {
		type: 'array',
		source: 'children',
		selector: 'h1,h2,h3,h4,h5,h6',
		default: __( 'Title' ),
	},
	titleColor: {
		type: 'string',
		default: '',
	},
	titleHoverColor: {
		type: 'string',
		default: '',
	},
	titleMinHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	titleFont: {
		type: 'array',
		default: [ {
			level: 2,
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 0, 0, 0, 0 ],
			paddingControl: 'linked',
			margin: [ 5, 0, 10, 0 ],
			marginControl: 'individual',
		} ],
	},
	displayText: {
		type: 'bool',
		default: true,
	},
	contentText: {
		type: 'array',
		source: 'children',
		selector: 'p',
		default: __( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean diam dolor, accumsan sed rutrum vel, dapibus et leo.' ),
	},
	textColor: {
		type: 'string',
		default: '#555555',
	},
	textHoverColor: {
		type: 'string',
		default: '',
	},
	textMinHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	textFont: {
		type: 'array',
		default: [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ],
	},
	textSpacing: {
		type: 'array',
		default: [ {
			padding: [ '', '', '', '' ],
			paddingControl: 'linked',
			margin: [ '', '', '', '' ],
			marginControl: 'linked',
		} ],
	},
	displayLearnMore: {
		type: 'bool',
		default: false,
	},
	learnMore: {
		type: 'array',
		source: 'children',
		selector: '.kt-blocks-info-box-learnmore',
		default: __( 'Learn More' ),
	},
	learnMoreStyles: {
		type: 'array',
		default: [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 4, 8, 4, 8 ],
			paddingControl: 'individual',
			margin: [ 10, 0, 10, 0 ],
			marginControl: 'individual',
			color: '',
			background: 'transparent',
			border: '#555555',
			borderRadius: 0,
			borderWidth: [ 0, 0, 0, 0 ],
			borderControl: 'linked',
			colorHover: '#ffffff',
			backgroundHover: '#444444',
			borderHover: '#444444',
			hoverEffect: 'revealBorder',
			paddingTablet: [ '', '', '', '' ],
			paddingMobile: [ '', '', '', '' ],
			paddingType: 'px',
		} ],
	},
	displayShadow: {
		type: 'bool',
		default: false,
	},
	shadow: {
		type: 'array',
		default: [ {
			color: '#000000',
			opacity: 0,
			spread: 0,
			blur: 0,
			hOffset: 0,
			vOffset: 0,
		} ],
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
		} ],
	},
	showPresets: {
		type: 'bool',
		default: true,
	},
	mediaVAlign: {
		type: 'string',
		default: 'middle',
	},
	mediaAlignMobile: {
		type: 'string',
		default: '',
	},
	mediaAlignTablet: {
		type: 'string',
		default: '',
	},
	maxWidth: {
		type: 'number',
		default: '',
	},
	maxWidthUnit: {
		type: 'string',
		default: 'px',
	},
	containerMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerMarginUnit: {
		type: 'string',
		default: 'px',
	},
	linkNoFollow: {
		type: 'bool',
		default: false,
	},
	linkSponsored: {
		type: 'bool',
		default: false,
	},
	number: {
		type: 'array',
		source: 'children',
		selector: 'div.kt-blocks-info-box-number',
		default: '',
	},
	mediaNumber: {
		type: 'array',
		default: [ {
			family: '',
			google: false,
			hoverAnimation: 'none',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ],
	},
	imageRatio: {
		type: 'string',
		default: 'inherit',
	},
	linkTitle: {
		type: 'string',
		default: '',
	},
	inQueryBlock: {
		type: 'bool',
		default: false,
	},
};
export default attributes;
