/**
 * BLOCK: Kadence Accordion Attributes
 */
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	paneCount: {
		type: 'number',
		default: 2,
	},
	showPresets: {
		type: 'bool',
		default: true,
	},
	openPane: {
		type: 'number',
		default: 0,
	},
	startCollapsed: {
		type: 'bool',
		default: false,
	},
	linkPaneCollapse: {
		type: 'bool',
		default: true,
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
		default: '#eeeeee',
	},
	contentBorder: {
		type: 'array',
		default: [ 0, 1, 1, 1 ],
	},
	contentBorderRadius: {
		type: 'array',
		default: [ 0, 0, 0, 0 ],
	},
	contentPadding: {
		type: 'array',
		default: [ 20, 20, 20, 20 ],
	},
	contentTabletPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	contentMobilePadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	contentPaddingType: {
		type: 'string',
		default: 'px',
	},
	titleAlignment: {
		type: 'string',
		default: 'left',
	},
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	titleStyles: {
		type: 'array',
		default: [ {
			size: [ 18, '', '' ],
			sizeType: 'px',
			lineHeight: [ 24, '', '' ],
			lineType: 'px',
			letterSpacing: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 10, 14, 10, 14 ],
			marginTop: 8,
			color: '#555555',
			background: '#f2f2f2',
			border: [ '#555555', '#555555', '#555555', '#555555' ],
			borderRadius: [ 0, 0, 0, 0 ],
			borderWidth: [ 0, 0, 0, 0 ],
			colorHover: '#444444',
			backgroundHover: '#eeeeee',
			borderHover: [ '#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee' ],
			colorActive: '#ffffff',
			backgroundActive: '#444444',
			borderActive: [ '#444444', '#444444', '#444444', '#444444' ],
			textTransform: '',
			paddingTablet: [ '', '', '', '' ],
			paddingMobile: [ '', '', '', '' ],
			paddingType: 'px',
		} ],
	},
	showIcon: {
		type: 'bool',
		default: true,
	},
	iconStyle: {
		type: 'string',
		default: 'basic',
	},
	iconSide: {
		type: 'string',
		default: 'right',
	},
	faqSchema: {
		type: 'bool',
		default: false,
	},
};
export default attributes;
