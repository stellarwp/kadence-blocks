/**
 * BLOCK: Kadence Testimonials
 */
const attributes = {
	uniqueID: {
		type: 'string',
		default: '',
	},
	style: {
		type: 'string',
		default: 'basic',
	},
	layout: {
		type: 'string',
		default: 'grid',
	},
	columns: {
		type: 'array',
		default: [ 1, 1, 1, 1, 1, 1 ],
	},
	columnControl: {
		type: 'string',
		default: 'linked',
	},
	columnGap: {
		type: 'number',
		default: 30,
	},
	autoPlay: {
		type: 'bool',
		default: false,
	},
	autoSpeed: {
		type: 'number',
		default: 7000,
	},
	transSpeed: {
		type: 'number',
		default: 400,
	},
	slidesScroll: {
		type: 'string',
		default: '1',
	},
	arrowStyle: {
		type: 'string',
		default: 'whiteondark',
	},
	dotStyle: {
		type: 'string',
		default: 'dark',
	},
	hAlign: {
		type: 'string',
		default: 'center',
	},
	containerMaxWidth: {
		type: 'number',
		default: 500,
	},
	containerBackground: {
		type: 'string',
		default: '',
	},
	containerBackgroundOpacity: {
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
	containerBorderWidth: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerBorderRadius: {
		type: 'number',
		default: '',
	},
	containerPadding: {
		type: 'array',
		default: [ 20, 20, 20, 20 ],
	},
	testimonials: {
		type: 'array',
		default: [ {
			url: '',
			id: '',
			alt: '',
			width: '',
			height: '',
			maxWidth: '',
			subtype: '',
			media: 'image',
			icon: 'fas_quote-left',
			isize: 50,
			istroke: 2,
			ititle: '',
			color: '#555555',
			title: '',
			content: '',
			name: '',
			occupation: '',
			rating: 5,
		} ],
	},
	mediaStyles: {
		type: 'array',
		default: [ {
			width: 60,
			backgroundSize: 'cover',
			background: '',
			backgroundOpacity: 1,
			border: '#555555',
			borderRadius: '',
			borderWidth: [ 0, 0, 0, 0 ],
			padding: [ 0, 0, 0, 0 ],
			margin: [ '', '', '', '' ],
			ratio: '',
		} ],
	},
	itemsCount: {
		type: 'number',
		default: 1,
	},
	displayMedia: {
		type: 'bool',
		default: true,
	},
	displayTitle: {
		type: 'bool',
		default: true,
	},
	titleFont: {
		type: 'array',
		default: [ {
			color: '',
			level: 2,
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
			padding: [ 0, 0, 0, 0 ],
			margin: [ 0, 0, 15, 0 ],
		} ],
	},
	displayContent: {
		type: 'bool',
		default: true,
	},
	contentFont: {
		type: 'array',
		default: [ {
			color: '#333333',
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ],
	},
	displayName: {
		type: 'bool',
		default: true,
	},
	nameFont: {
		type: 'array',
		default: [ {
			color: '#333333',
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ],
	},
	displayOccupation: {
		type: 'bool',
		default: true,
	},
	occupationFont: {
		type: 'array',
		default: [ {
			color: '#555555',
			size: [ 15, '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ],
	},
	displayRating: {
		type: 'bool',
		default: false,
	},
	ratingStyles: {
		type: 'array',
		default: [ {
			color: '#ffd700',
			size: 16,
			margin: [ 10, 0, 10, 0 ],
			iconSpacing: '',
			icon: 'fas_star',
			stroke: 2,
		} ],
	},
	displayIcon: {
		type: 'bool',
		default: false,
	},
	iconStyles: {
		type: 'array',
		default: [ {
			size: 30,
			margin: [ '', '', '', '' ],
			padding: [ '', '', '', '' ],
			borderWidth: [ '', '', '', '' ],
			borderRadius: '',
			border: '',
			borderOpacity: 1,
			color: '',
			background: '',
			backgroundOpacity: 1,
			title: '',
			icon: 'fas_quote-left',
			stroke: 2,
		} ],
	},
	displayShadow: {
		type: 'bool',
		default: false,
	},
	shadow: {
		type: 'array',
		default: [ {
			color: '#000000',
			opacity: 0.2,
			spread: 0,
			blur: 14,
			hOffset: 4,
			vOffset: 2,
		} ],
	},
	containerMinHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	containerVAlign: {
		type: 'string',
		default: '',
	},
	titleMinHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	contentMinHeight: {
		type: 'array',
		default: [ '', '', '' ],
	},
	showPresets: {
		type: 'bool',
		default: true,
	},
	wrapperPaddingType: {
		type: 'string',
		default: 'px',
	},
	wrapperPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	wrapperTabletPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	wrapperMobilePadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	tabletContainerPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	mobileContainerPadding: {
		type: 'array',
		default: [ '', '', '', '' ],
	},
	containerPaddingType: {
		type: 'string',
		default: 'px',
	},
	inQueryBlock: {
		type: 'bool',
		default: false,
	},
};
export default attributes;
