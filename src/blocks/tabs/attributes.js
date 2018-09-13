/**
 * BLOCK: Kadence Tabs Attributes
 */
const { __ } = wp.i18n;
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	tabCount: {
		type: 'number',
		default: 3,
	},
	layout: {
		type: 'string',
		default: 'tabs',
	},
	mobileLayout: {
		type: 'string',
		default: 'inherit',
	},
	tabletLayout: {
		type: 'string',
		default: 'inherit',
	},
	currentTab: {
		type: 'number',
		default: 1,
	},
	minHeight: {
		type: 'number',
		default: '',
	},
	maxWidth: {
		type: 'number',
		default: '',
	},
	contentBgColor: {
		type: 'string',
		default: '',
	},
	contentBorderColor: {
		type: 'string',
		default: '',
	},
	contentBorder: {
		type: 'array',
		default: [ 1, 1, 1, 1 ],
	},
	contentBorderControl: {
		type: 'string',
		default: 'linked',
	},
	innerPadding: {
		type: 'array',
		default: [ 20, 20, 20, 20 ],
	},
	innerPaddingControl: {
		type: 'string',
		default: 'linked',
	},
	innerPaddingM: {
		type: 'array',
	},
	tabAlignment: {
		type: 'string',
		default: 'left',
	},
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	titles: {
		type: 'array',
		default: [ {
			text: __( 'Tab 1' ),
			icon: '',
			iconSide: 'right',
			onlyIcon: false,
		}, {
			text: __( 'Tab 2' ),
			icon: '',
			iconSide: 'right',
			onlyIcon: false,
		}, {
			text: __( 'Tab 3' ),
			icon: '',
			iconSide: 'right',
			onlyIcon: false,
		} ],
	},
	titleColor: {
		type: 'string',
	},
	titleColorHover: {
		type: 'string',
	},
	titleColorActive: {
		type: 'string',
	},
	titleBg: {
		type: 'string',
	},
	titleBgHover: {
		type: 'string',
	},
	titleBgActive: {
		type: 'string',
	},
	titleBorder: {
		type: 'string',
	},
	titleBorderHover: {
		type: 'string',
	},
	titleBorderActive: {
		type: 'string',
	},
	titleBorderWidth: {
		type: 'array',
		default: [ 1, 1, 1, 1 ],
	},
	titleBorderControl: {
		type: 'string',
		default: 'linked',
	},
	titlePadding: {
		type: 'array',
		default: [ 8, 16, 8, 16 ],
	},
	titlePaddingControl: {
		type: 'string',
		default: 'individual',
	},
	titleMargin: {
		type: 'array',
		default: [ 0, 4, -1, 0 ],
	},
	titleMarginControl: {
		type: 'string',
		default: 'individual',
	},
	size: {
		type: 'number',
	},
	sizeType: {
		type: 'string',
		default: 'px',
	},
	lineHeight: {
		type: 'number',
	},
	lineType: {
		type: 'string',
		default: 'px',
	},
	tabSize: {
		type: 'number',
	},
	tabLineHeight: {
		type: 'number',
	},
	mobileSize: {
		type: 'number',
	},
	mobileLineHeight: {
		type: 'number',
	},
	letterSpacing: {
		type: 'number',
	},
	typography: {
		type: 'string',
		default: '',
	},
	googleFont: {
		type: 'boolean',
		default: false,
	},
	loadGoogleFont: {
		type: 'boolean',
		default: true,
	},
	fontSubset: {
		type: 'string',
		default: '',
	},
	fontVariant: {
		type: 'string',
		default: '',
	},
	fontWeight: {
		type: 'string',
		default: 'regular',
	},
	fontStyle: {
		type: 'string',
		default: 'normal',
	},
	borderRadius: {
		type: 'number',
		default: 4,
	},
};
export default attributes;
