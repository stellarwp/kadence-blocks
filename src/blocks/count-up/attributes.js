/**
 * BLOCK: Kadence Conter Up Attributes
 */

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;

/**
 * Set default state
 */
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	title: {
		type: 'string',
		default: '',
	},
	displayTitle: {
		type: 'bool',
		default: true,
	},
	titleFont: {
		type: 'array',
		default: [ {
			level: 4,
			size: [ '50', '', '' ],
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
	titleAlign: {
		type: 'object',
		default: {
			desktop: '',
			tablet: '',
			mobile: ''
		}
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
	numberFont: {
		type: 'array',
		default: [ {
			level: 4,
			size: [ '50', '', '' ],
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
	numberAlign: {
		type: 'object',
		default: {
			desktop: '',
			tablet: '',
			mobile: ''
		}
	},
	numberColor: {
		type: 'string',
		default: '',
	},
	numberHoverColor: {
		type: 'string',
		default: '',
	},
	numberMinHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	start: {
		type: 'number',
		default: 0
	},
	end: {
		type: 'number',
		default: 100
	},
	prefix: {
		type: 'string',
		default: '',
	},
	suffix: {
		type: 'string',
		default: '',
	},
	duration: {
		type: 'number',
		default: 2.75,
	},
	separator: {
		type: 'boolean',
		default: false,
	}
};
export default attributes;
