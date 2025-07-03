/**
 * Row Layout Block Migrations
 *
 * Handles updating old attribute formats to new ones
 */

import { KadenceColorOutput } from '@kadence/helpers';

/**
 * Migrate old gutter settings to custom format
 */
function migrateGutterSettings(attributes, setAttributes) {
	const { columnGutter, customGutter } = attributes;

	if (columnGutter === 'wide') {
		setAttributes({
			columnGutter: 'custom',
			customGutter: [
				40,
				customGutter && customGutter[1] ? customGutter[1] : '',
				customGutter && customGutter[2] ? customGutter[2] : '',
			],
		});
	} else if (columnGutter === 'narrow') {
		setAttributes({
			columnGutter: 'custom',
			customGutter: [
				20,
				customGutter && customGutter[1] ? customGutter[1] : '',
				customGutter && customGutter[2] ? customGutter[2] : '',
			],
		});
	} else if (columnGutter === 'widest') {
		setAttributes({
			columnGutter: 'custom',
			customGutter: [
				80,
				customGutter && customGutter[1] ? customGutter[1] : '',
				customGutter && customGutter[2] ? customGutter[2] : '',
			],
		});
	}
}

/**
 * Migrate old padding settings to array format
 */
function migratePaddingSettings(attributes, setAttributes) {
	const {
		topPadding,
		rightPadding,
		bottomPadding,
		leftPadding,
		topPaddingM,
		rightPaddingM,
		bottomPaddingM,
		leftPaddingM,
	} = attributes;

	// Desktop padding
	if ('' !== topPadding || '' !== rightPadding || '' !== bottomPadding || '' !== leftPadding) {
		setAttributes({
			padding: [
				'' !== topPadding ? topPadding : 25,
				rightPadding,
				'' !== bottomPadding ? bottomPadding : 25,
				leftPadding,
			],
			topPadding: '',
			rightPadding: '',
			bottomPadding: '',
			leftPadding: '',
		});
	}

	// Mobile padding
	if ('' !== topPaddingM || '' !== rightPaddingM || '' !== bottomPaddingM || '' !== leftPaddingM) {
		setAttributes({
			mobilePadding: [topPaddingM, rightPaddingM, bottomPaddingM, leftPaddingM],
			topPaddingM: '',
			rightPaddingM: '',
			bottomPaddingM: '',
			leftPaddingM: '',
		});
	}
}

/**
 * Migrate old margin settings to array format
 */
function migrateMarginSettings(attributes, setAttributes) {
	const { topMargin, bottomMargin, topMarginT, bottomMarginT, topMarginM, bottomMarginM } = attributes;

	// Desktop margin
	if ('' !== topMargin || '' !== bottomMargin) {
		setAttributes({
			margin: ['' !== topMargin ? topMargin : '', '', '' !== bottomMargin ? bottomMargin : '', ''],
			topMargin: '',
			bottomMargin: '',
		});
	}

	// Tablet margin
	if ('' !== topMarginT || '' !== bottomMarginT) {
		setAttributes({
			tabletMargin: ['' !== topMarginT ? topMarginT : '', '', '' !== bottomMarginT ? bottomMarginT : '', ''],
			topMarginT: '',
			bottomMarginT: '',
		});
	}

	// Mobile margin
	if ('' !== topMarginM || '' !== bottomMarginM) {
		setAttributes({
			mobileMargin: ['' !== topMarginM ? topMarginM : '', '', '' !== bottomMarginM ? bottomMarginM : '', ''],
			topMarginM: '',
			bottomMarginM: '',
		});
	}
}

/**
 * Migrate old gradient settings to new format
 */
function migrateGradientSettings(attributes, setAttributes) {
	const {
		currentOverlayTab,
		overlayGradType,
		overlayBgImgPosition,
		overlay,
		overlayFirstOpacity,
		overlayGradLoc,
		overlaySecond,
		overlaySecondOpacity,
		overlayGradLocSecond,
		overlayGradAngle,
		tabletOverlay,
		mobileOverlay,
	} = attributes;

	// Desktop gradient
	if (currentOverlayTab === 'grad') {
		const newDeskGradient =
			'radial' === overlayGradType
				? `radial-gradient(ellipse at ${overlayBgImgPosition}, ${
						overlay
							? KadenceColorOutput(
									overlay,
									undefined !== overlayFirstOpacity && '' !== overlayFirstOpacity
										? overlayFirstOpacity
										: 1
							  )
							: ''
				  } ${overlayGradLoc}%, ${
						overlaySecond
							? KadenceColorOutput(
									overlaySecond,
									undefined !== overlaySecondOpacity && '' !== overlaySecondOpacity
										? overlaySecondOpacity
										: 1
							  )
							: ''
				  } ${overlayGradLocSecond}%)`
				: `linear-gradient(${overlayGradAngle}deg, ${
						overlay
							? KadenceColorOutput(
									overlay,
									undefined !== overlayFirstOpacity && '' !== overlayFirstOpacity
										? overlayFirstOpacity
										: 1
							  )
							: ''
				  } ${overlayGradLoc}%, ${
						overlaySecond
							? KadenceColorOutput(
									overlaySecond,
									undefined !== overlaySecondOpacity && '' !== overlaySecondOpacity
										? overlaySecondOpacity
										: 1
							  )
							: ''
				  } ${overlayGradLocSecond}%)`;
		setAttributes({ overlayGradient: newDeskGradient, currentOverlayTab: 'gradient' });
	}

	// Tablet gradient
	if (
		tabletOverlay &&
		tabletOverlay[0] &&
		tabletOverlay[0].currentOverlayTab &&
		'grad' === tabletOverlay[0].currentOverlayTab
	) {
		const saveTabletOverlay = (value) => {
			const newUpdate = tabletOverlay.map((item, index) => {
				if (0 === index) {
					item = { ...item, ...value };
				}
				return item;
			});
			setAttributes({
				tabletOverlay: newUpdate,
			});
		};
		const newTabGradient =
			'radial' === tabletOverlay[0].overlayGradType
				? `radial-gradient(ellipse at ${tabletOverlay[0].overlayBgImgPosition}, ${
						tabletOverlay[0].overlay
							? KadenceColorOutput(
									tabletOverlay[0].overlay,
									undefined !== tabletOverlay[0].overlayFirstOpacity &&
										'' !== tabletOverlay[0].overlayFirstOpacity
										? overlayFirstOpacity
										: 1
							  )
							: ''
				  } ${tabletOverlay[0].overlayGradLoc}%, ${
						tabletOverlay[0].overlaySecond
							? KadenceColorOutput(
									tabletOverlay[0].overlaySecond,
									undefined !== tabletOverlay[0].overlaySecondOpacity &&
										'' !== tabletOverlay[0].overlaySecondOpacity
										? tabletOverlay[0].overlaySecondOpacity
										: 1
							  )
							: ''
				  } ${tabletOverlay[0].overlayGradLocSecond}%)`
				: `linear-gradient(${tabletOverlay[0].overlayGradAngle}deg, ${
						tabletOverlay[0].overlay
							? KadenceColorOutput(
									tabletOverlay[0].overlay,
									undefined !== overlayFirstOpacity && '' !== tabletOverlay[0].overlayFirstOpacity
										? tabletOverlay[0].overlayFirstOpacity
										: 1
							  )
							: ''
				  } ${tabletOverlay[0].overlayGradLoc}%, ${
						tabletOverlay[0].overlaySecond
							? KadenceColorOutput(
									tabletOverlay[0].overlaySecond,
									undefined !== tabletOverlay[0].overlaySecondOpacity &&
										'' !== tabletOverlay[0].tabletOverlay[0].overlaySecondOpacity
										? tabletOverlay[0].overlaySecondOpacity
										: 1
							  )
							: ''
				  } ${tabletOverlay[0].overlayGradLocSecond}%)`;
		saveTabletOverlay({ gradient: newTabGradient, currentOverlayTab: 'gradient' });
	}

	// Mobile gradient
	if (
		mobileOverlay &&
		mobileOverlay[0] &&
		mobileOverlay[0].currentOverlayTab &&
		'grad' === mobileOverlay[0].currentOverlayTab
	) {
		const saveMobileOverlay = (value) => {
			const newUpdate = mobileOverlay.map((item, index) => {
				if (0 === index) {
					item = { ...item, ...value };
				}
				return item;
			});
			setAttributes({
				mobileOverlay: newUpdate,
			});
		};
		const newMobileGradient =
			'radial' === mobileOverlay[0].overlayGradType
				? `radial-gradient(ellipse at ${mobileOverlay[0].overlayBgImgPosition}, ${
						mobileOverlay[0].overlay
							? KadenceColorOutput(
									mobileOverlay[0].overlay,
									undefined !== mobileOverlay[0].overlayFirstOpacity &&
										'' !== mobileOverlay[0].overlayFirstOpacity
										? overlayFirstOpacity
										: 1
							  )
							: ''
				  } ${mobileOverlay[0].overlayGradLoc}%, ${
						mobileOverlay[0].overlaySecond
							? KadenceColorOutput(
									mobileOverlay[0].overlaySecond,
									undefined !== mobileOverlay[0].overlaySecondOpacity &&
										'' !== mobileOverlay[0].overlaySecondOpacity
										? mobileOverlay[0].overlaySecondOpacity
										: 1
							  )
							: ''
				  } ${mobileOverlay[0].overlayGradLocSecond}%)`
				: `linear-gradient(${mobileOverlay[0].overlayGradAngle}deg, ${
						mobileOverlay[0].overlay
							? KadenceColorOutput(
									mobileOverlay[0].overlay,
									undefined !== overlayFirstOpacity && '' !== mobileOverlay[0].overlayFirstOpacity
										? mobileOverlay[0].overlayFirstOpacity
										: 1
							  )
							: ''
				  } ${mobileOverlay[0].overlayGradLoc}%, ${
						mobileOverlay[0].overlaySecond
							? KadenceColorOutput(
									mobileOverlay[0].overlaySecond,
									undefined !== mobileOverlay[0].overlaySecondOpacity &&
										'' !== mobileOverlay[0].mobileOverlay[0].overlaySecondOpacity
										? mobileOverlay[0].overlaySecondOpacity
										: 1
							  )
							: ''
				  } ${mobileOverlay[0].overlayGradLocSecond}%)`;
		saveMobileOverlay({ gradient: newMobileGradient, currentOverlayTab: 'gradient' });
	}
}

/**
 * Migrate old border settings to new format
 */
function migrateBorderSettings(attributes, setAttributes) {
	const {
		border,
		borderWidth,
		tabletBorder,
		tabletBorderWidth,
		mobileBorder,
		mobileBorderWidth,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
	} = attributes;

	// Desktop border
	const tempBorderStyle = JSON.parse(
		JSON.stringify(
			borderStyle
				? borderStyle
				: [
						{
							top: ['', '', ''],
							right: ['', '', ''],
							bottom: ['', '', ''],
							left: ['', '', ''],
							unit: 'px',
						},
				  ]
		)
	);
	let updateBorderStyle = false;
	if ('' !== border) {
		tempBorderStyle[0].top[0] = border;
		tempBorderStyle[0].right[0] = border;
		tempBorderStyle[0].bottom[0] = border;
		tempBorderStyle[0].left[0] = border;
		updateBorderStyle = true;
		setAttributes({ border: '' });
	}
	if ('' !== borderWidth?.[0] || '' !== borderWidth?.[1] || '' !== borderWidth?.[2] || '' !== borderWidth?.[3]) {
		tempBorderStyle[0].top[2] = borderWidth?.[0] || '';
		tempBorderStyle[0].right[2] = borderWidth?.[1] || '';
		tempBorderStyle[0].bottom[2] = borderWidth?.[2] || '';
		tempBorderStyle[0].left[2] = borderWidth?.[3] || '';
		updateBorderStyle = true;
		setAttributes({ borderWidth: ['', '', '', ''] });
	}
	if (updateBorderStyle) {
		setAttributes({ borderStyle: tempBorderStyle });
	}

	// Tablet border
	const tempTabletBorderStyle = JSON.parse(
		JSON.stringify(
			tabletBorderStyle
				? tabletBorderStyle
				: [
						{
							top: ['', '', ''],
							right: ['', '', ''],
							bottom: ['', '', ''],
							left: ['', '', ''],
							unit: 'px',
						},
				  ]
		)
	);
	let updateTabletBorderStyle = false;
	if ('' !== tabletBorder) {
		tempTabletBorderStyle[0].top[0] = tabletBorder;
		tempTabletBorderStyle[0].right[0] = tabletBorder;
		tempTabletBorderStyle[0].bottom[0] = tabletBorder;
		tempTabletBorderStyle[0].left[0] = tabletBorder;
		updateTabletBorderStyle = true;
		setAttributes({ tabletBorder: '' });
	}
	if (
		'' !== tabletBorderWidth?.[0] ||
		'' !== tabletBorderWidth?.[1] ||
		'' !== tabletBorderWidth?.[2] ||
		'' !== tabletBorderWidth?.[3]
	) {
		tempTabletBorderStyle[0].top[2] = tabletBorderWidth?.[0] || '';
		tempTabletBorderStyle[0].right[2] = tabletBorderWidth?.[1] || '';
		tempTabletBorderStyle[0].bottom[2] = tabletBorderWidth?.[2] || '';
		tempTabletBorderStyle[0].left[2] = tabletBorderWidth?.[3] || '';
		updateTabletBorderStyle = true;
		setAttributes({ tabletBorderWidth: ['', '', '', ''] });
	}
	if (updateTabletBorderStyle) {
		setAttributes({ tabletBorderStyle: tempTabletBorderStyle });
	}

	// Mobile border
	const tempMobileBorderStyle = JSON.parse(
		JSON.stringify(
			mobileBorderStyle
				? mobileBorderStyle
				: [
						{
							top: ['', '', ''],
							right: ['', '', ''],
							bottom: ['', '', ''],
							left: ['', '', ''],
							unit: 'px',
						},
				  ]
		)
	);
	let updateMobileBorderStyle = false;
	if ('' !== mobileBorder) {
		tempMobileBorderStyle[0].top[0] = mobileBorder;
		tempMobileBorderStyle[0].right[0] = mobileBorder;
		tempMobileBorderStyle[0].bottom[0] = mobileBorder;
		tempMobileBorderStyle[0].left[0] = mobileBorder;
		updateMobileBorderStyle = true;
		setAttributes({ mobileBorder: '' });
	}
	if (
		'' !== mobileBorderWidth?.[0] ||
		'' !== mobileBorderWidth?.[1] ||
		'' !== mobileBorderWidth?.[2] ||
		'' !== mobileBorderWidth?.[3]
	) {
		tempMobileBorderStyle[0].top[2] = mobileBorderWidth?.[0] || '';
		tempMobileBorderStyle[0].right[2] = mobileBorderWidth?.[1] || '';
		tempMobileBorderStyle[0].bottom[2] = mobileBorderWidth?.[2] || '';
		tempMobileBorderStyle[0].left[2] = mobileBorderWidth?.[3] || '';
		updateMobileBorderStyle = true;
		setAttributes({ mobileBorderWidth: ['', '', '', ''] });
	}
	if (updateMobileBorderStyle) {
		setAttributes({ mobileBorderStyle: tempMobileBorderStyle });
	}
}

/**
 * Run all migrations for row layout block
 */
export function runRowLayoutMigrations(attributes, setAttributes) {
	// Run all migration functions
	migrateGutterSettings(attributes, setAttributes);
	migratePaddingSettings(attributes, setAttributes);
	migrateMarginSettings(attributes, setAttributes);
	migrateGradientSettings(attributes, setAttributes);
	migrateBorderSettings(attributes, setAttributes);

	// Update version
	const { kbVersion } = attributes;
	if (!kbVersion || kbVersion < 2) {
		setAttributes({ kbVersion: 2 });
	}
}
