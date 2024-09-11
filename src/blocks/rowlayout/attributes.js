/**
 * BLOCK: Kadence Row Attributes
 */
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	mobileLayout: {
		type: 'string',
		default: 'row',
	},
	tabletLayout: {
		type: 'string',
		default: 'inherit',
	},
	collapseOrder: {
		type: 'string',
		default: 'left-to-right',
	},
	collapseGutter: {
		type: 'string',
		default: 'default',
	},
	columnGutter: {
		type: 'string',
		default: 'default',
	},
	colLayout: {
		type: 'string',
		default: '',
	},
	currentTab: {
		type: 'string',
		default: 'desk',
	},
	currentOverlayTab: {
		type: 'string',
		default: 'normal',
	},
	htmlTag: {
		type: 'string',
		default: 'div',
	},
	minHeight: {
		type: 'number',
		default: 0,
	},
	maxWidth: {
		type: 'number',
		default: '',
	},
	topPadding: {
		type: 'number',
		default: 25,
	},
	bottomPadding: {
		type: 'number',
		default: 25,
	},
	leftPadding: {
		type: 'number',
		default: '',
	},
	rightPadding: {
		type: 'number',
		default: '',
	},
	topPaddingM: {
		type: 'number',
		default: '',
	},
	bottomPaddingM: {
		type: 'number',
		default: '',
	},
	leftPaddingM: {
		type: 'number',
		default: '',
	},
	rightPaddingM: {
		type: 'number',
		default: '',
	},
	topMargin: {
		type: 'number',
		default: '',
	},
	bottomMargin: {
		type: 'number',
		default: '',
	},
	topMarginM: {
		type: 'number',
		default: '',
	},
	bottomMarginM: {
		type: 'number',
		default: '',
	},
	bgColor: {
		type: 'string',
		default: '',
	},
	bgImg: {
		type: 'string',
		default: '',
	},
	bgImgID: {
		type: 'number',
		default: '',
	},
	bgImgSize: {
		type: 'string',
		default: 'cover',
	},
	bgImgPosition: {
		type: 'string',
		default: 'center center',
	},
	bgImgAttachment: {
		type: 'string',
		default: 'scroll',
	},
	bgImgRepeat: {
		type: 'string',
		default: 'no-repeat',
	},
	overlay: {
		type: 'string',
		default: '',
	},
	overlaySecond: {
		type: 'string',
		default: '#00B5E2',
	},
	overlayFirstOpacity: {
		type: 'number',
		default: '',
	},
	overlaySecondOpacity: {
		type: 'number',
		default: '',
	},
	overlayGradLoc: {
		type: 'number',
		default: 0,
	},
	overlayGradLocSecond: {
		type: 'number',
		default: 100,
	},
	overlayGradType: {
		type: 'string',
		default: 'linear',
	},
	overlayGradAngle: {
		type: 'number',
		default: 180,
	},
	overlayBgImg: {
		type: 'string',
		default: '',
	},
	overlayBgImgID: {
		type: 'number',
		default: '',
	},
	overlayBgImgSize: {
		type: 'string',
		default: 'cover',
	},
	overlayBgImgPosition: {
		type: 'string',
		default: 'center center',
	},
	overlayBgImgAttachment: {
		type: 'string',
		default: 'scroll',
	},
	overlayBgImgRepeat: {
		type: 'string',
		default: 'no-repeat',
	},
	overlayOpacity: {
		type: 'number',
		default: 30,
	},
	overlayBlendMode: {
		type: 'string',
		default: 'none',
	},
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	align: {
		type: 'string',
		default: 'none',
	},
	verticalAlignment: {
		type: 'string',
		default: 'top',
	},
	topSep: {
		type: 'string',
		default: 'none',
	},
	topSepColor: {
		type: 'string',
		default: '#ffffff',
	},
	topSepFlip: {
		type: 'boolean',
		default: false,
	},
	topSepHeight: {
		type: 'number',
		default: 100,
	},
	topSepHeightTab: {
		type: 'number',
		default: '',
	},
	topSepHeightMobile: {
		type: 'number',
		default: '',
	},
	bottomSep: {
		type: 'string',
		default: 'none',
	},
	bottomSepColor: {
		type: 'string',
		default: '#ffffff',
	},
	bottomSepFlip: {
		type: 'boolean',
		default: false,
	},
	bottomSepHeight: {
		type: 'number',
		default: 100,
	},
	bottomSepWidth: {
		type: 'number',
		default: 100,
	},
	bottomSepWidthTab: {
		type: 'number',
		default: '',
	},
	bottomSepWidthMobile: {
		type: 'number',
		default: '',
	},
	bottomSepHeightTab: {
		type: 'number',
		default: '',
	},
	bottomSepHeightMobile: {
		type: 'number',
		default: '',
	},
	firstColumnWidth: {
		type: 'number',
	},
	secondColumnWidth: {
		type: 'number',
	},
	textColor: {
		type: 'string',
		default: '',
	},
	linkColor: {
		type: 'string',
		default: '',
	},
	linkHoverColor: {
		type: 'string',
		default: '',
	},
	tabletPadding: {
		type: 'array',
		default: ['', '', '', ''],
	},
	topMarginT: {
		type: 'number',
		default: '',
	},
	bottomMarginT: {
		type: 'number',
		default: '',
	},
	marginUnit: {
		type: 'string',
		default: 'px',
	},
	minHeightUnit: {
		type: 'string',
		default: 'px',
	},
	maxWidthUnit: {
		type: 'string',
		default: 'px',
	},
	columnsUnlocked: {
		type: 'boolean',
		default: false,
	},
	tabletBackground: {
		type: 'array',
		default: [
			{
				enable: false,
				bgColor: '',
				bgImg: '',
				bgImgID: '',
				bgImgSize: 'cover',
				bgImgPosition: 'center center',
				bgImgAttachment: 'scroll',
				bgImgRepeat: 'no-repeat',
				forceOverDesk: false,
				gradient: '',
			},
		],
	},
	tabletOverlay: {
		type: 'array',
		default: [
			{
				enable: false,
				currentOverlayTab: 'normal',
				overlay: '',
				overlaySecond: '#00B5E2',
				overlayGradLoc: 0,
				overlayGradLocSecond: 100,
				overlayGradType: 'linear',
				overlayGradAngle: 180,
				overlayBgImg: '',
				overlayBgImgID: '',
				overlayBgImgSize: 'cover',
				overlayBgImgPosition: 'center center',
				overlayBgImgAttachment: 'scroll',
				overlayBgImgRepeat: 'no-repeat',
				overlayOpacity: 30,
				overlayBlendMod: 'none',
			},
		],
	},
	mobileBackground: {
		type: 'array',
		default: [
			{
				enable: false,
				bgColor: '',
				bgImg: '',
				bgImgID: '',
				bgImgSize: 'cover',
				bgImgPosition: 'center center',
				bgImgAttachment: 'scroll',
				bgImgRepeat: 'no-repeat',
				forceOverDesk: false,
			},
		],
	},
	mobileOverlay: {
		type: 'array',
		default: [
			{
				enable: false,
				currentOverlayTab: 'normal',
				overlay: '',
				overlaySecond: '#00B5E2',
				overlayGradLoc: 0,
				overlayGradLocSecond: 100,
				overlayGradType: 'linear',
				overlayGradAngle: 180,
				overlayBgImg: '',
				overlayBgImgID: '',
				overlayBgImgSize: 'cover',
				overlayBgImgPosition: 'center center',
				overlayBgImgAttachment: 'scroll',
				overlayBgImgRepeat: 'no-repeat',
				overlayOpacity: 30,
				overlayBlendMod: 'none',
			},
		],
	},
	columnsInnerHeight: {
		type: 'boolean',
		default: false,
	},
	topSepWidth: {
		type: 'number',
		default: 100,
	},
	topSepWidthTablet: {
		type: 'number',
		default: '',
	},
	topSepWidthMobile: {
		type: 'number',
		default: '',
	},
	backgroundInline: {
		type: 'boolean',
		default: false,
	},
	backgroundSettingTab: {
		type: 'string',
		default: 'normal',
	},
	backgroundSliderCount: {
		type: 'number',
		default: 1,
	},
	backgroundSlider: {
		type: 'array',
		default: [
			{
				bgColor: '',
				bgImg: '',
				bgImgID: '',
			},
		],
	},
	backgroundSliderSettings: {
		type: 'array',
		default: [
			{
				arrowStyle: 'none',
				dotStyle: 'dark',
				autoPlay: true,
				speed: 7000,
				fade: true,
				tranSpeed: 400,
			},
		],
	},
	backgroundVideoType: {
		type: 'string',
		default: 'local',
	},
	backgroundVideo: {
		type: 'array',
		default: [
			{
				youTube: '',
				local: '',
				localID: '',
				vimeo: '',
				ratio: '16/9',
				btns: false,
				loop: true,
				mute: true,
			},
		],
	},
	zIndex: {
		type: 'number',
		default: '',
	},
	paddingUnit: {
		type: 'string',
		default: 'px',
	},
	inheritMaxWidth: {
		type: 'boolean',
		default: false,
	},
	noCustomDefaults: {
		type: 'boolean',
		default: false,
	},
	isPrebuiltModal: {
		type: 'boolean',
		default: false,
	},
	minHeightTablet: {
		type: 'number',
		default: '',
	},
	minHeightMobile: {
		type: 'number',
		default: '',
	},
	bgColorClass: {
		type: 'string',
		default: '',
	},
	vsdesk: {
		type: 'boolean',
		default: false,
	},
	vstablet: {
		type: 'boolean',
		default: false,
	},
	vsmobile: {
		type: 'boolean',
		default: false,
	},
	loggedIn: {
		type: 'boolean',
		default: false,
	},
	loggedInUser: {
		type: 'array',
	},
	loggedInShow: {
		type: 'array',
	},
	rcpAccess: {
		type: 'string',
		default: '',
	},
	rcpMembership: {
		type: 'boolean',
		default: false,
	},
	rcpMembershipLevel: {
		type: 'array',
	},
	loggedOut: {
		type: 'boolean',
		default: false,
	},
	borderWidth: {
		type: 'array',
		default: ['', '', '', ''],
	},
	tabletBorderWidth: {
		type: 'array',
		default: ['', '', '', ''],
	},
	mobileBorderWidth: {
		type: 'array',
		default: ['', '', '', ''],
	},
	borderRadius: {
		type: 'array',
		default: ['', '', '', ''],
	},
	tabletBorderRadius: {
		type: 'array',
		default: ['', '', '', ''],
	},
	mobileBorderRadius: {
		type: 'array',
		default: ['', '', '', ''],
	},
	border: {
		type: 'string',
		default: '',
	},
	tabletBorder: {
		type: 'string',
		default: '',
	},
	mobileBorder: {
		type: 'string',
		default: '',
	},
	responsiveMaxWidth: {
		type: 'array',
		default: ['', ''],
	},
	inQueryBlock: {
		type: 'boolean',
		default: false,
	},
	gradient: {
		type: 'string',
		default: '',
	},
	overlayGradient: {
		type: 'string',
		default: '',
	},
};
export default attributes;
