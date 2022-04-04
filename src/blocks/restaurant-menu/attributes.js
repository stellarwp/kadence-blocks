/**
 * BLOCK: Kadence Restaurant Menu Attributes
 */

/**
 * Set default state
 */
export default {
	uniqueID: {
		type: 'string',
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
	cAlign: {
		type: 'string',
		default: 'left',
	},
	cAlignTablet: {
		type: 'string',
		default: '',
	},
	cAlignMobile: {
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
		default: [ 30, 30, 30, 30 ],
	},
	containerMargin: {
		type: 'array',
		default: [ '0', '0', '0', '0' ],
	},
	containerMarginUnit: {
		type: 'string',
		default: 'px',
	},
	maxWidth: {
		type: 'number',
		default: '',
	},
	maxWidthUnit: {
		type: 'string',
		default: 'px',
	},
}
