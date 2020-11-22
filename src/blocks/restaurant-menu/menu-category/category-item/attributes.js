/**
 * BLOCK: Kadence Restaurant Menu Category Item
 */

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

/**
 * Set default state
 */
export default {
	uniqueID: {
		type: 'string',
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
		default: __( 'Details about food' ),
	},
	textColor: {
		type: 'string',
		default: '',
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
	displayAmount: {
		type: 'bool',
		default: true,
	},
	amount: {
		type: 'String',
		default: ''
	},
	priceColor: {
		type: 'string',
		default: '',
	},
	priceHoverColor: {
		type: 'string',
		default: '',
	},
	priceMinHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	priceFont: {
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
	currency: {
		type: 'String',
		default: ''
	},
	containerBackground: {
		type: 'string',
		default: 'transparent',
	},
	containerBackgroundOpacity: {
		type: 'number',
		default: 1,
	},
	containerHoverBackground: {
		type: 'string',
		default: 'transparent',
	},
	containerHoverBackgroundOpacity: {
		type: 'number',
		default: 1,
	},
	containerBorder: {
		type: 'string',
		default: 'transparent',
	},
	containerBorderOpacity: {
		type: 'number',
		default: 1,
	},
	containerHoverBorder: {
		type: 'string',
		default: 'transparent',
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
		default: [ 0, 0, 0, 0 ],
	},
}
