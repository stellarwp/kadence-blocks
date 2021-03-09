/**
 * BLOCK: Countdown Attributes.
 */
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	date: {
		type: 'string',
		default: '',
	},
	timezone: {
		type: 'string',
		default: '',
	},
	timestamp: {
		type: 'number',
		default: '',
	},
	timeOffset: {
		type: 'number',
		default: '',
	},
	expireAction: {
		type: 'string',
		default: 'message',
	},
	evergreenHours: {
		type: 'number',
	},
	evergreenMinutes: {
		type: 'number',
	},
	enableTimer: {
		type: 'bool',
		default: true,
	},
	units: {
		type: 'array',
		default: [ {
			days: true,
			hours: true,
			minutes: true,
			seconds: true,
		} ],
	},
	layout: {
		type: 'string',
		default: 'left',
	},
	timerLayout: {
		type: 'string',
		default: 'inline',
	},
	// Labels.
	daysLabel: {
		type: 'string',
		default: '',
	},
	hoursLabel: {
		type: 'string',
		default: '',
	},
	minutesLabel: {
		type: 'string',
		default: '',
	},
	secondsLabel: {
		type: 'string',
		default: '',
	},
	// Number settings.
	numberColor: {
		type: 'string',
	},
	numberSize: {
		type: 'array',
		default: [ '', '', '' ],
	},
	numberSizeType: {
		type: 'string',
		default: 'px',
	},
	numberLineHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	numberLineType: {
		type: 'string',
		default: 'px',
	},
	numberLetterSpacing: {
		type: 'array',
		default: [ '', '', '' ],
	},
	numberLetterType: {
		type: 'string',
		default: 'px',
	},
	numberTypography: {
		type: 'string',
		default: '',
	},
	numberGoogleFont: {
		type: 'boolean',
		default: false,
	},
	numberLoadGoogleFont: {
		type: 'boolean',
		default: true,
	},
	numberFontSubset: {
		type: 'string',
		default: '',
	},
	numberFontVariant: {
		type: 'string',
		default: '',
	},
	numberFontWeight: {
		type: 'string',
		default: 'regular',
	},
	numberFontStyle: {
		type: 'string',
		default: 'normal',
	},
	// Label settings.
	labelColor: {
		type: 'string',
	},
	labelSize: {
		type: 'array',
		default: [ '', '', '' ],
	},
	labelSizeType: {
		type: 'string',
		default: 'px',
	},
	labelLineHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	labelLineType: {
		type: 'string',
		default: 'px',
	},
	labelLetterSpacing: {
		type: 'array',
		default: [ '', '', '' ],
	},
	labelLetterType: {
		type: 'string',
		default: 'px',
	},
	labelTypography: {
		type: 'string',
		default: '',
	},
	labelGoogleFont: {
		type: 'boolean',
		default: false,
	},
	labelLoadGoogleFont: {
		type: 'boolean',
		default: true,
	},
	labelFontSubset: {
		type: 'string',
		default: '',
	},
	labelFontVariant: {
		type: 'string',
		default: '',
	},
	labelFontWeight: {
		type: 'string',
		default: 'regular',
	},
	labelFontStyle: {
		type: 'string',
		default: 'normal',
	},
	// Counter Align.
	counterAlign: {
		type: 'array',
		default: [ '', '', '' ],
	},
	// Border.
	border: {
		type: 'string',
		default: '',
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
	// Background.
	background: {
		type: 'string',
		default: '',
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
	// Padding.
	paddingType: {
		type: 'string',
		default: 'px',
	},
	containerPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerTabletPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerMobilePadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	//Margin.
	marginType: {
		type: 'string',
		default: 'px',
	},
	containerMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerTabletMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerMobileMargin: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	// Visible.
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
};
export default attributes;