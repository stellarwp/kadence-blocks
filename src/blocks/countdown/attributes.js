/**
 * BLOCK: Countdown Attributes.
 */
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	countdownType: {
		type: 'string',
		default: 'date',
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
		default: 'none',
	},
	redirectURL: {
		type: 'string',
		default: '',
	},
	campaignID: {
		type: 'string',
	},
	evergreenHours: {
		type: 'number',
	},
	evergreenMinutes: {
		type: 'number',
	},
	evergreenReset: {
		type: 'number',
		default: 30,
	},
	evergreenStrict: {
		type: 'bool',
		default: false,
	},
	enableTimer: {
		type: 'bool',
		default: true,
	},
	revealOnLoad: {
		type: 'bool',
		default: false,
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
	timerLayout: {
		type: 'string',
		default: 'block',
	},
	timeNumbers: {
		type: 'bool',
		default: false,
	},
	countdownDivider: {
		type: 'bool',
		default: false,
	},
	// Labels.
	preLabel: {
		type: 'string',
		default: '',
	},
	postLabel: {
		type: 'string',
		default: '',
	},
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
	numberFont: {
		type: 'array',
		default: [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: [ '', '', '' ],
			letterType: 'px',
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
	// Item.
	itemBackground: {
		type: 'string',
		default: '',
	},
	itemBorder: {
		type: 'string',
		default: '',
	},
	itemBorderWidth: {
		type: 'array',
		default: [ 0, 0, 0, 0 ],
	},
	itemTabletBorderWidth: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	itemMobileBorderWidth: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	itemBorderRadius: {
		type: 'array',
		default: [ 0, 0, 0, 0 ],
	},
	itemPaddingType: {
		type: 'string',
		default: 'px',
	},
	itemPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	itemTabletPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	itemMobilePadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	// Label settings.
	labelColor: {
		type: 'string',
	},
	labelFont: {
		type: 'array',
		default: [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: [ '', '', '' ],
			letterType: 'px',
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
	// PreLabel settings.
	preLabelColor: {
		type: 'string',
	},
	preLabelFont: {
		type: 'array',
		default: [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: [ '', '', '' ],
			letterType: 'px',
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
	// PostLabel settings.
	postLabelColor: {
		type: 'string',
	},
	postLabelFont: {
		type: 'array',
		default: [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: [ '', '', '' ],
			letterType: 'px',
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