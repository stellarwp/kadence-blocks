/**
 * BLOCK: Kadence Row / Layout
 */

/**
 * Import Icons
 */
import {
	rowIcon,
	collapseRowIcon,
	collapseRowThreeIcon,
	collapseRowFourIcon,
	collapseRowFiveIcon,
	collapseRowSixIcon,
	twoColIcon,
	gridIcon,
	threeColIcon,
	threeGridIcon,
	lastRowIcon,
	firstRowIcon,
	twoLeftGoldenIcon,
	twoRightGoldenIcon,
	leftHalfIcon,
	rightHalfIcon,
	centerHalfIcon,
	wideCenterIcon,
	exWideCenterIcon,
	fourColIcon,
	lFourFortyIcon,
	rFourFortyIcon,
	fiveColIcon,
	sixColIcon,
	radiusLinkedIcon,
	radiusIndividualIcon,
	topLeftIcon,
	topRightIcon,
	bottomLeftIcon,
	bottomRightIcon
} from '@kadence/icons';

/**
 * Import External
 */
import Select from 'react-select';
import { times, dropRight, debounce, map } from 'lodash';
import classnames from 'classnames';
import memoize from 'memize';
import ContainerDimensions from 'react-container-dimensions';
/**
 * Import Kadence Components
 */
import {
	PopColorControl,
	SmallResponsiveControl,
	ResponsiveControl,
	RangeControl,
	MeasurementControls,
	IconPicker,
	ResponsiveRangeControls,
	KadencePanelBody,
	StepControls,
	KadenceRadioButtons,
	VerticalAlignmentIcon,
	ResponsiveRadioRangeControls,
	BackgroundControl as KadenceBackgroundControl,
	InspectorControlTabs
} from '@kadence/components';
import { KadenceColorOutput, getPreviewSize, showSettings } from '@kadence/helpers';

/**
 * Import Block Specific Components
 */
import PrebuiltModal from '../../plugins/prebuilt-library/prebuilt-library';
import Overlay from './row-overlay';
import RowBackground from './row-background';
import ContentWidthIcon from './content-width-icons';
/**
 * Import Css
 */
import './editor.scss';
/**
 * Import WordPress Internals
 */
import { useEffect, useState, Fragment } from '@wordpress/element';
import {
	MediaUpload,
	InspectorControls,
	BlockControls,
	BlockAlignmentToolbar,
	useBlockProps,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import {
	Button,
	ButtonGroup,
	Tooltip,
	TabPanel,
	Popover,
	ToolbarGroup,
	TextControl,
	Dashicon,
	Toolbar,
	ToggleControl,
	SelectControl,
	ResizableBox,
} from '@wordpress/components';
import { withDispatch, useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import {
	image,
} from '@wordpress/icons';
import { applyFilters } from '@wordpress/hooks';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

/**
 * Build the row edit
 */
 function LayoutControls( {
	attributes,
	setAttributes,
	updateColumns,
	widthString,
} ) {
	const { uniqueID, columns, mobileLayout, currentTab, colLayout, tabletLayout, columnGutter, collapseGutter, tabletGutter, mobileGutter, tabletRowGutter, mobileRowGutter, gutterType, rowGutterType, collapseOrder, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, bgColor, bgImg, bgImgAttachment, bgImgSize, bgImgPosition, bgImgRepeat, bgImgID, verticalAlignment, overlayOpacity, overlayBgImg, overlayBgImgAttachment, overlayBgImgID, overlayBgImgPosition, overlayBgImgRepeat, overlayBgImgSize, currentOverlayTab, overlayBlendMode, overlayGradAngle, overlayGradLoc, overlayGradLocSecond, overlayGradType, overlay, overlaySecond, htmlTag, minHeight, maxWidth, bottomSep, bottomSepColor, bottomSepHeight, bottomSepHeightMobile, bottomSepHeightTab, bottomSepWidth, bottomSepWidthMobile, bottomSepWidthTab, topSep, topSepColor, topSepHeight, topSepHeightMobile, topSepHeightTab, topSepWidth, topSepWidthMobile, topSepWidthTab, firstColumnWidth, secondColumnWidth, textColor, linkColor, linkHoverColor, tabletPadding, topMarginT, bottomMarginT, minHeightUnit, maxWidthUnit, marginUnit, columnsUnlocked, tabletBackground, tabletOverlay, mobileBackground, mobileOverlay, columnsInnerHeight, zIndex, backgroundInline, backgroundSettingTab, backgroundSliderCount, backgroundSlider, inheritMaxWidth, backgroundSliderSettings, backgroundVideo, backgroundVideoType, overlaySecondOpacity, overlayFirstOpacity, paddingUnit, align, minHeightTablet, minHeightMobile, bgColorClass, vsdesk, vstablet, vsmobile, loggedInUser, loggedIn, loggedOut, loggedInShow, rcpAccess, rcpMembership, rcpMembershipLevel, borderWidth, tabletBorderWidth, mobileBorderWidth, borderRadius, tabletBorderRadius, mobileBorderRadius, border, tabletBorder, mobileBorder, isPrebuiltModal, responsiveMaxWidth, kadenceBlockCSS } = attributes;

	const editorDocument = document.querySelector( 'iframe[name="editor-canvas"]' )?.contentWindow.document || document;

	const layoutClass = ( ! colLayout ? 'equal' : colLayout );
	const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
	let layoutOptions;
	let mobileLayoutOptions;
	const bottomSVGDivider = {};
	bottomSVGDivider.ct = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
	bottomSVGDivider.cti = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
	bottomSVGDivider.ctd = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
	bottomSVGDivider.ctdi = <Fragment><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></Fragment>;
	bottomSVGDivider.sltl = <path d="M1000,0l-1000,100l1000,0l0,-100Z" />;
	bottomSVGDivider.sltli = <path d="M0,100l1000,-100l-1000,0l0,100Z" />;
	bottomSVGDivider.sltr = <path d="M0,0l1000,100l-1000,0l0,-100Z" />;
	bottomSVGDivider.sltri = <path d="M1000,100l-1000,-100l1000,0l0,100Z" />;
	bottomSVGDivider.crv = <path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />;
	bottomSVGDivider.crvi = <path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />;
	bottomSVGDivider.crvl = <path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />;
	bottomSVGDivider.crvli = <path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />;
	bottomSVGDivider.crvr = <path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />;
	bottomSVGDivider.crvri = <path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />;
	bottomSVGDivider.wave = <path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />;
	bottomSVGDivider.wavei = <path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />;
	bottomSVGDivider.waves = <Fragment><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
	bottomSVGDivider.wavesi = <Fragment><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
	bottomSVGDivider.mtns = <Fragment><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></Fragment>;
	bottomSVGDivider.littri = <path d="M500,2l25,98l-50,0l25,-98Z" />;
	bottomSVGDivider.littrii = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
	bottomSVGDivider.threelevels = <Fragment><path style={ { opacity: 0.33 } } d="M0 95L1000 0v100H0v-5z"></path><path style={ { opacity: 0.66 } } d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path></Fragment>;
	bottomSVGDivider.threelevelsi = <Fragment><path style={ { opacity: 0.33 } } d="M1000 95L0 0v100h1000v-5z"></path><path style={ { opacity: 0.66 } } d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path></Fragment>;
	const renderBottomSVGDivider = svg => (
		<svg viewBox="0 0 1000 100" preserveAspectRatio="none" style={ { fill: '#000000' } }>
			{ bottomSVGDivider[ svg ] }
		</svg>
	);
	const topSVGDivider = {};
	topSVGDivider.ct = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
	topSVGDivider.cti = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
	topSVGDivider.ctd = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
	topSVGDivider.ctdi = <Fragment><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></Fragment>;
	topSVGDivider.sltl = <path d="M1000,0l-1000,100l1000,0l0,-100Z" />;
	topSVGDivider.sltli = <path d="M0,100l1000,-100l-1000,0l0,100Z" />;
	topSVGDivider.sltr = <path d="M0,0l1000,100l-1000,0l0,-100Z" />;
	topSVGDivider.sltri = <path d="M1000,100l-1000,-100l1000,0l0,100Z" />;
	topSVGDivider.crv = <path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />;
	topSVGDivider.crvi = <path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />;
	topSVGDivider.crvl = <path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />;
	topSVGDivider.crvli = <path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />;
	topSVGDivider.crvr = <path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />;
	topSVGDivider.crvri = <path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />;
	topSVGDivider.wave = <path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />;
	topSVGDivider.wavei = <path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />;
	topSVGDivider.waves = <Fragment><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
	topSVGDivider.wavesi = <Fragment><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
	topSVGDivider.mtns = <Fragment><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></Fragment>;
	topSVGDivider.littri = <path d="M500,2l25,98l-50,0l25,-98Z" />;
	topSVGDivider.littrii = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
	topSVGDivider.threelevels = <Fragment><path style={ { opacity: 0.33 } } d="M0 95L1000 0v100H0v-5z"></path><path style={ { opacity: 0.66 } } d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path></Fragment>;
	topSVGDivider.threelevelsi = <Fragment><path style={ { opacity: 0.33 } } d="M1000 95L0 0v100h1000v-5z"></path><path style={ { opacity: 0.66 } } d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path></Fragment>;
	const renderTopSVGDivider = svg => (
		<svg className="top-icon" viewBox="0 0 1000 100" preserveAspectRatio="none" style={ { fill: '#000000' } }>
			{ topSVGDivider[ svg ] }
		</svg>
	);
	if ( 2 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: twoColIcon },
			{ key: 'left-golden', name: __( 'Left Heavy 66/33', 'kadence-blocks' ), icon: twoLeftGoldenIcon },
			{ key: 'right-golden', name: __( 'Right Heavy 33/66', 'kadence-blocks' ), icon: twoRightGoldenIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowIcon },
		];
	} else if ( 3 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: threeColIcon },
			{ key: 'left-half', name: __( 'Left Heavy 50/25/25', 'kadence-blocks' ), icon: leftHalfIcon },
			{ key: 'right-half', name: __( 'Right Heavy 25/25/50', 'kadence-blocks' ), icon: rightHalfIcon },
			{ key: 'center-half', name: __( 'Center Heavy 25/50/25', 'kadence-blocks' ), icon: centerHalfIcon },
			{ key: 'center-wide', name: __( 'Wide Center 20/60/20', 'kadence-blocks' ), icon: wideCenterIcon },
			{ key: 'center-exwide', name: __( 'Wider Center 15/70/15', 'kadence-blocks' ), icon: exWideCenterIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowThreeIcon },
		];
	} else if ( 4 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: fourColIcon },
			{ key: 'left-forty', name: __( 'Left Heavy 40/20/20/20', 'kadence-blocks' ), icon: lFourFortyIcon },
			{ key: 'right-forty', name: __( 'Right Heavy 20/20/20/40', 'kadence-blocks' ), icon: rFourFortyIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowFourIcon },
		];
	} else if ( 5 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: fiveColIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowFiveIcon },
		];
	} else if ( 6 === columns ) {
		layoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: sixCol },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowSixIcon },
		];
	} else {
		layoutOptions = [
			{ key: 'equal', name: __( 'Single Row', 'kadence-blocks' ), icon: rowIcon },
		];
	}
	if ( 2 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: twoColIcon },
			{ key: 'left-golden', name: __( 'Left Heavy 66/33', 'kadence-blocks' ), icon: twoLeftGoldenIcon },
			{ key: 'right-golden', name: __( 'Right Heavy 33/66', 'kadence-blocks' ), icon: twoRightGoldenIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowIcon },
		];
	} else if ( 3 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: threeColIcon },
			{ key: 'left-half', name: __( 'Left Heavy 50/25/25', 'kadence-blocks' ), icon: leftHalfIcon },
			{ key: 'right-half', name: __( 'Right Heavy 25/25/50', 'kadence-blocks' ), icon: rightHalfIcon },
			{ key: 'center-half', name: __( 'Center Heavy 25/50/25', 'kadence-blocks' ), icon: centerHalfIcon },
			{ key: 'center-wide', name: __( 'Wide Center 20/60/20', 'kadence-blocks' ), icon: wideCenterIcon },
			{ key: 'center-exwide', name: __( 'Wider Center 15/70/15', 'kadence-blocks' ), icon: exWideCenterIcon },
			{ key: 'first-row', name: __( 'First Row, Next Columns 100 - 50/50', 'kadence-blocks' ), icon: firstRowIcon },
			{ key: 'last-row', name: __( 'Last Row, Previous Columns 50/50 - 100', 'kadence-blocks' ), icon: lastRowIcon },
			{ key: 'two-grid', name: __( 'Two Column Grid', 'kadence-blocks' ), icon: gridIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowThreeIcon },
		];
	} else if ( 4 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: fourColIcon },
			{ key: 'left-forty', name: __( 'Left Heavy 40/20/20/20', 'kadence-blocks' ), icon: lFourFortyIcon },
			{ key: 'right-forty', name: __( 'Right Heavy 20/20/20/40', 'kadence-blocks' ), icon: rFourFortyIcon },
			{ key: 'two-grid', name: __( 'Two Column Grid', 'kadence-blocks' ), icon: gridIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowFourIcon },
		];
	} else if ( 5 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: fiveColIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowFiveIcon },
		];
	} else if ( 6 === columns ) {
		mobileLayoutOptions = [
			{ key: 'equal', name: __( 'Equal', 'kadence-blocks' ), icon: sixColIcon },
			{ key: 'two-grid', name: __( 'Two Column Grid', 'kadence-blocks' ), icon: gridIcon },
			{ key: 'three-grid', name: __( 'Three Column Grid', 'kadence-blocks' ), icon: threeGridIcon },
			{ key: 'row', name: __( 'Collapse to Rows', 'kadence-blocks' ), icon: collapseRowSixIcon },
		];
	} else {
		mobileLayoutOptions = [
			{ key: 'row', name: __( 'Single Row', 'kadence-blocks' ), icon: rowIcon },
		];
	}
	const bottomSepSizesMobile = (
		<Fragment>
			<RangeControl
				label={ __( 'Mobile Height (px)', 'kadence-blocks' ) }
				value={ ( bottomSepHeightMobile ? bottomSepHeightMobile : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepHeightMobile: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<RangeControl
				label={ __( 'Mobile Width (%)', 'kadence-blocks' ) }
				value={ ( bottomSepWidthMobile ? bottomSepWidthMobile : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepWidthMobile: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const bottomSepSizesTablet = (
		<Fragment>
			<RangeControl
				label={ __( 'Tablet Height (px)', 'kadence-blocks' ) }
				value={ ( bottomSepHeightTab ? bottomSepHeightTab : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepHeightTab: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<RangeControl
				label={ __( 'Tablet Width (%)', 'kadence-blocks' ) }
				value={ ( bottomSepWidthTab ? bottomSepWidthTab : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepWidthTab: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const bottomSepSizes = (
		<Fragment>
			<RangeControl
				label={ __( 'Divider Height (px)', 'kadence-blocks' ) }
				value={ bottomSepHeight }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepHeight: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<RangeControl
				label={ __( 'Divider Width (%)', 'kadence-blocks' ) }
				value={ ( bottomSepWidth ? bottomSepWidth : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						bottomSepWidth: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const topSepSizesMobile = (
		<Fragment>
			<RangeControl
				label={ __( 'Mobile Height (px)', 'kadence-blocks' ) }
				value={ ( topSepHeightMobile ? topSepHeightMobile : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepHeightMobile: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<RangeControl
				label={ __( 'Mobile Width (%)', 'kadence-blocks' ) }
				value={ ( topSepWidthMobile ? topSepWidthMobile : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepWidthMobile: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const topSepSizesTablet = (
		<Fragment>
			<RangeControl
				label={ __( 'Tablet Height (px)', 'kadence-blocks' ) }
				value={ ( topSepHeightTab ? topSepHeightTab : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepHeightTab: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<RangeControl
				label={ __( 'Tablet Width (%)', 'kadence-blocks' ) }
				value={ ( topSepWidthTab ? topSepWidthTab : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepWidthTab: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const topSepSizes = (
		<Fragment>
			<RangeControl
				label={ __( 'Divider Height (px)', 'kadence-blocks' ) }
				value={ topSepHeight }
				onChange={ ( value ) => {
					setAttributes( {
						topSepHeight: value,
					} );
				} }
				min={ 0 }
				max={ 500 }
			/>
			<RangeControl
				label={ __( 'Divider Width (%)', 'kadence-blocks' ) }
				value={ ( topSepWidth ? topSepWidth : '' ) }
				onChange={ ( value ) => {
					setAttributes( {
						topSepWidth: value,
					} );
				} }
				min={ 100 }
				max={ 400 }
			/>
		</Fragment>
	);
	const topDividerSettings = (
		<Fragment>
			<IconPicker
				icons={ [
					'ct',
					'cti',
					'ctd',
					'ctdi',
					'sltl',
					'sltr',
					'crv',
					'crvi',
					'crvl',
					'crvli',
					'crvr',
					'crvri',
					'wave',
					'wavei',
					'waves',
					'wavesi',
					'mtns',
					'littri',
					'littrii',
					'threelevels',
					'threelevelsi',
				] }
				iconsPerPage={ 30 }
				value={ ( topSep === 'none' ? '' : topSep ) }
				onChange={ value => setAttributes( { topSep: value } ) }
				appendTo="body"
				showSearch={ false }
				renderFunc={ renderTopSVGDivider }
				theme="dividers"
				noSelectedPlaceholder={ __( 'Select Divider', 'kadence-blocks' ) }
				isMulti={ false }
			/>
			<PopColorControl
				label={ __( 'Divider Color' ) }
				value={ ( topSepColor ? topSepColor : '' ) }
				default={ '#ffffff' }
				onChange={ value => setAttributes( { topSepColor: value } ) }
			/>
			<SmallResponsiveControl
				label={ __( 'Size Controls', 'kadence-blocks' ) }
				desktopChildren={ topSepSizes }
				tabletChildren={ topSepSizesTablet }
				mobileChildren={ topSepSizesMobile }
			/>
		</Fragment>
	);
	const bottomDividerSettings = (
		<Fragment>
			<IconPicker
				icons={ [
					'ct',
					'cti',
					'ctd',
					'ctdi',
					'sltl',
					'sltr',
					'crv',
					'crvi',
					'crvl',
					'crvli',
					'crvr',
					'crvri',
					'wave',
					'wavei',
					'waves',
					'wavesi',
					'mtns',
					'littri',
					'littrii',
					'threelevels',
					'threelevelsi',
				] }
				iconsPerPage={ 30 }
				value={ ( bottomSep === 'none' ? '' : bottomSep ) }
				onChange={ value => setAttributes( { bottomSep: value } ) }
				appendTo="body"
				showSearch={ false }
				renderFunc={ renderBottomSVGDivider }
				theme="dividers"
				noSelectedPlaceholder={ __( 'Select Divider', 'kadence-blocks' ) }
				isMulti={ false }
			/>
			<PopColorControl
				label={ __( 'Divider Color', 'kadence-blocks' ) }
				value={ ( bottomSepColor ? bottomSepColor : '' ) }
				default={ '#ffffff' }
				onChange={ value => setAttributes( { bottomSepColor: value } ) }
			/>
			<SmallResponsiveControl
				label={ __( 'Size Controls', 'kadence-blocks' ) }
				desktopChildren={ bottomSepSizes }
				tabletChildren={ bottomSepSizesTablet }
				mobileChildren={ bottomSepSizesMobile }
			/>
		</Fragment>
	);

	const selectColLayout = ( columns && ( 2 === columns || 3 === columns ) ? widthString : colLayout );

	return (
		<Fragment>
			<>
				{ showSettings( 'basicLayout', 'kadence/rowlayout' ) && (
					<KadencePanelBody panelName={ 'kb-row-basic-layout' }>
						<StepControls
							label={__( 'Columns', 'kadence-blocks' )}
							value={columns}
							onChange={ ( nextColumns ) => {
								updateColumns( innerItemCount, nextColumns );
								setAttributes( {
									columns: nextColumns,
									colLayout: 'equal',
									firstColumnWidth: undefined,
									secondColumnWidth: undefined,
									tabletLayout: 'inherit',
									mobileLayout: 'row',
								} );
							} }
							min={1}
							max={6}
						/>
						{ columns > 1 && (
							<Fragment>
								<p className="components-base-control__label">{ __( 'Layout', 'kadence-blocks' ) }</p>
								<ButtonGroup className="kb-column-layout" aria-label={ __( 'Column Layout', 'kadence-blocks' ) }>
									{ map( layoutOptions, ( { name, key, icon } ) => (
										<Tooltip text={ name }>
											<Button
												key={ key }
												className="kt-layout-btn"
												isSmall
												isPrimary={ selectColLayout === key }
												aria-pressed={ selectColLayout === key }
												onClick={ () => {
													setAttributes( {
														colLayout: key,
													} );
													setAttributes( {
														firstColumnWidth: undefined,
														secondColumnWidth: undefined,
													} );
												} }
											>
												{ icon }
											</Button>
										</Tooltip>
									) ) }
								</ButtonGroup>
							</Fragment>
						) }
						{ columns > 1 && (
							<>
								<ResponsiveRadioRangeControls
									label={__( 'Column Gutter', 'kadence-blocks' )}
									options={ [
										{ value: 'default', size:30, label: '30px' },
										{ value: 'none', size:0, label: '0px' },
										{ value: 'skinny', size:10, label: '10px' },
										{ value: 'narrow', size:20, label: '20px' },
										{ value: 'wide', size:40, label: '40px' },
										{ value: 'wider', size:60, label: '60px' },
										{ value: 'widest', size:80, label: '80px' },
									] }
									value={ ( columnGutter == 'custom' ? customGutter[0] : columnGutter ) }
									onChange={ ( value ) => {
										setAttributes( { columnGutter: value.value, customGutter: [ value.size, ( customGutter[1] ? customGutter[1] : '' ), ( customGutter[2] ? customGutter[2] : '' ) ] } );
									}}
									tabletValue={( tabletGutter == 'custom' ? customGutter[1] : tabletGutter )}
									onChangeTablet={ ( value ) => {
										setAttributes( { tabletGutter: value.value, customGutter: [ ( customGutter[0] ? customGutter[0] : '' ), value.size, ( customGutter[2] ? customGutter[2] : '' ) ] } );
									}}
									mobileValue={( mobileGutter == 'custom' ? customGutter[2] : mobileGutter )}
									onChangeMobile={ ( value ) => {
										setAttributes( { mobileGutter: value.value, customGutter: [ ( customGutter[0] ? customGutter[0] : '' ), ( customGutter[1] ? customGutter[1] : '' ), value.size ] } );
									}}
									min={0}
									max={( gutterType === 'px' ? 200 : 12 )}
									step={( gutterType === 'px' ? 1 : 0.1 )}
									unit={ gutterType ? gutterType : 'px' }
									onUnit={( value ) => {
										setAttributes( { gutterType: value } );
									}}
									units={[ 'px', 'em', 'rem' ]}
								/>
								<ResponsiveRadioRangeControls
									label={__( 'Row Gutter', 'kadence-blocks' )}
									options={ [
										{ value: 'default', size:30, label: '30px' },
										{ value: 'none', size:0, label: '0px' },
										{ value: 'skinny', size:10, label: '10px' },
										{ value: 'narrow', size:20, label: '20px' },
										{ value: 'wide', size:40, label: '40px' },
										{ value: 'wider', size:60, label: '60px' },
										{ value: 'widest', size:80, label: '80px' },
									] }
									value={ ( collapseGutter == 'custom' ? customRowGutter[0] : collapseGutter ) }
									onChange={ ( value ) => {
										setAttributes( { collapseGutter: value.value, customRowGutter: [ value.size, ( customRowGutter[1] ? customRowGutter[1] : '' ), ( customRowGutter[2] ? customRowGutter[2] : '' ) ] } );
									}}
									tabletValue={ ( tabletRowGutter == 'custom' ? customRowGutter[1] : tabletRowGutter ) }
									onChangeTablet={ ( value ) => {
										setAttributes( { tabletRowGutter: value.value, customRowGutter: [ ( customRowGutter[0] ? customRowGutter[0] : '' ), value.size, ( customRowGutter[2] ? customRowGutter[2] : '' ) ] } );
									}}
									mobileValue={ ( mobileRowGutter == 'custom' ? customRowGutter[2] : mobileRowGutter ) }
									onChangeMobile={ ( value ) => {
										setAttributes( { mobileRowGutter: value.value, customRowGutter: [ ( customRowGutter[0] ? customRowGutter[0] : '' ), ( customRowGutter[1] ? customRowGutter[1] : '' ), value.size ] } );
									}}
									min={0}
									max={( rowGutterType === 'px' ? 200 : 12 )}
									step={( rowGutterType === 'px' ? 1 : 0.1 )}
									unit={ rowGutterType ? rowGutterType : 'px' }
									onUnit={( value ) => {
										setAttributes( { rowGutterType: value } );
									}}
									units={[ 'px', 'em', 'rem' ]}
								/>
							<SelectControl
								label={ __( 'Column Gutter', 'kadence-blocks' ) }
								value={ ( columnGutter == 'custom' ? customGutter : columnGutter ) }
								options={ [
									{ value: 'default', label: __( 'Standard: 30px', 'kadence-blocks' ) },
									{ value: 'none', label: __( 'No Gutter', 'kadence-blocks' ) },
									{ value: 'skinny', label: __( 'Skinny: 10px', 'kadence-blocks' ) },
									{ value: 'narrow', label: __( 'Narrow: 20px', 'kadence-blocks' ) },
									{ value: 'wide', label: __( 'Wide: 40px', 'kadence-blocks' ) },
									{ value: 'wider', label: __( 'Wider: 60px', 'kadence-blocks' ) },
									{ value: 'widest', label: __( 'Widest: 80px', 'kadence-blocks' ) },
								] }
								onChange={ ( value ) => {
									setAttributes( { columnGutter: value } ) 
								}}
							/>
							</>
						) }
					</KadencePanelBody>
				) }
			</>
			<div className="kt-sidebar-settings-spacer"></div>
			{ showSettings( 'dividers', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Dividers', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-dividers' }
				>
					<TabPanel className="kt-inspect-tabs kt-hover-tabs"
						activeClass="active-tab"
						tabs={ [
							{
								name: 'bottomdivider',
								title: __( 'Bottom', 'kadence-blocks' ),
								className: 'kt-bottom-tab',
							},
							{
								name: 'topdivider',
								title: __( 'Top', 'kadence-blocks' ),
								className: 'kt-top-tab',
							},
						] }>
						{
							( tab ) => {
								let tabout;
								if ( tab.name ) {
									if ( 'topdivider' === tab.name ) {
										tabout = topDividerSettings;
									} else {
										tabout = bottomDividerSettings;
									}
								}
								return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
							}
						}
					</TabPanel>
				</KadencePanelBody>
			) }			
		</Fragment>
	);
};
export default LayoutControls;

