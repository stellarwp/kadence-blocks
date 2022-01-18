/**
 * BLOCK: Section Attributes.
 */
import { __ } from '@wordpress/i18n';
const attributes = {
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
	wrapContent: {
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
	link: {
		type: 'string',
		default: '',
	},
	linkTitle: {
		type: 'string',
		default: '',
	},
	linkTarget: {
		type: 'boolean',
		default: false,
	},
	linkNoFollow: {
		type: 'boolean',
		default: false,
	},
	linkSponsored: {
		type: 'boolean',
		default: false,
	},
	inQueryBlock: {
		type: 'bool',
		default: false,
	},
};
export default attributes;