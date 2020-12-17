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
		type: 'String',
	},
	displayTitle: {
		type: 'Boolean',
		default: true,
	},
	title: {
		type: 'Array',
		source: 'children',
		selector: 'h1,h2,h3,h4,h5,h6',
		default: __( 'Title' ),
	},
	titleColor: {
		type: 'String',
		default: '',
	},
	titleHoverColor: {
		type: 'String',
		default: '',
	},
	titleMinHeight: {
		type: 'Array',
		default: [ '', '', '' ],
	},
	titleFont: {
		type: 'Array',
		default: [ {
			level: 2,
			size: [ '16', '16', '16' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: "'Open Sans', sans-serif",
			google: false,
			style: '',
			weight: '600',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 0, 0, 0, 0 ],
			paddingControl: 'linked',
			margin: [ 0, 0, 0, 0 ],
			marginControl: 'linked',
		} ],
	},
	displayText: {
		type: 'Boolean',
		default: true,
	},
	contentText: {
		type: 'Array',
		source: 'children',
		selector: 'p',
		default: __( 'Details about food' ),
	},
	textColor: {
		type: 'String',
		default: '',
	},
	textHoverColor: {
		type: 'String',
		default: '',
	},
	textMinHeight: {
		type: 'Array',
		default: [ '', '', '' ],
	},
	textFont: {
		type: 'Array',
		default: [ {
			level: 2,
			size: [ '16', '16', '16' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: "'Open Sans', sans-serif",
			google: false,
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 0, 0, 0, 0 ],
			paddingControl: 'linked',
			margin: [ 0, 0, 0, 0 ],
			marginControl: 'linked',
		} ],
	},
	displayAmount: {
		type: 'bool',
		default: true,
	},
	amount: {
		type: 'String',
		default: '$4.6'
	},
	priceColor: {
		type: 'String',
		default: '',
	},
	priceHoverColor: {
		type: 'String',
		default: '',
	},
	priceMinHeight: {
		type: 'Array',
		default: [ '', '', '' ],
	},
	priceFont: {
		type: 'Array',
		default: [ {
			level: 2,
			size: [ '16', '16', '16' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: "'Open Sans', sans-serif",
			google: false,
			style: '',
			weight: '600',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 0, 0, 0, 0 ],
			paddingControl: 'linked',
			margin: [ 0, 0, 0, 0 ],
			marginControl: 'linked',
		} ],
	},
	currency: {
		type: 'String',
		default: ''
	},
	containerBackground: {
		type: 'String',
		default: 'transparent',
	},
	containerBackgroundOpacity: {
		type: 'number',
		default: 1,
	},
	containerHoverBackground: {
		type: 'String',
		default: 'transparent',
	},
	containerHoverBackgroundOpacity: {
		type: 'number',
		default: 1,
	},
	containerBorder: {
		type: 'String',
		default: 'transparent',
	},
	containerBorderOpacity: {
		type: 'number',
		default: 1,
	},
	containerHoverBorder: {
		type: 'String',
		default: 'transparent',
	},
	containerHoverBorderOpacity: {
		type: 'number',
		default: 1,
	},
	containerBorderWidth: {
		type: 'Array',
		default: [ 0, 0, 0, 0 ],
	},
	containerBorderRadius: {
		type: 'number',
		default: 0,
	},
	containerPadding: {
		type: 'Array',
		default: [ 0, 0, 0, 0 ],
	},
}
