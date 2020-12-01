/**
 * BLOCK: Kadence Restaurant Menu category
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
	menuTitle: {
		type: 'String',
		default: ''
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
			textTransform: 'uppercase',
			family: "'Open Sans', sans-serif",
			google: false,
			style: '',
			weight: '600',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 0, 0, 35, 0 ],
			paddingControl: 'linked',
			margin: [ 0, 0, 0, 0 ],
			marginControl: 'linked',
		} ],
	},
	description: {
		type: 'String',
		default: ''
	},
	currency: {
		type: 'String',
		default: ''
	},
	price: {
		type: 'String',
		default: ''
	},
	columns: {
		type: 'Array',
		default: [ 2, 2, 2, 2, 1, 1 ],
	},
	columnControl: {
		type: 'string',
		default: 'linked',
	},
	gutter: {
		type: 'Array',
		default: [ 50, '', '' ],
	},
	catTitle: {
		type: 'Boolean',
		default: true,
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
}
