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
			htmlTag: 'div',
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
		} ],
	},
	titlePaddingType: {
		type: 'string',
		default: 'px',
	},
	titlePadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	titleTabletPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	titleMobilePadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	titleMarginType: {
		type: 'string',
		default: 'px',
	},
	titleMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	titleTabletMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	titleMobileMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	titleAlign: {
		type: 'array',
		default: [ '', '', '' ],
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
			size: [ '50', '', '' ],
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
		} ],
	},
	numberPaddingType: {
		type: 'string',
		default: 'px',
	},
	numberPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	numberTabletPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	numberMobilePadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	numberMarginType: {
		type: 'string',
		default: 'px',
	},
	numberMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	numberTabletMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	numberMobileMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	numberAlign: {
		type: 'array',
		default: [ '', '', '' ],
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
		default: 2.5,
	},
	separator: {
		type: 'string',
		default: '',
	}
};
export default attributes;
