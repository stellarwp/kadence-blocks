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
	ResponsiveMeasurementControls,
	IconPicker,
	ResponsiveRangeControls,
	KadencePanelBody,
	StepControls,
	KadenceRadioButtons,
	KadenceImageControl,
	VerticalAlignmentIcon,
	ResponsiveRadioRangeControls,
	BackgroundControl as KadenceBackgroundControl,
	BackgroundTypeControl,
	GradientControl,
	KadenceVideoControl,
	SubsectionWrap,
	InspectorControlTabs,
	BorderControl,
	ResponsiveBorderControl,
} from '@kadence/components';
import { KadenceColorOutput, getPreviewSize, showSettings } from '@kadence/helpers';

/**
 * Import Block Specific Components
 */
import PrebuiltModal from '../../plugins/prebuilt-library/prebuilt-library';
import Overlay from './row-overlay';
import RowBackground from './row-background';
import ContentWidthIcon from './content-width-icons';
import renderSVGDivider from './render-svg-divider';
import { BLEND_OPTIONS } from './constants';
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
 function StyleControls( {
	clientId,
	attributes,
	setAttributes,
	isSelected,
} ) {
	const { uniqueID, columns, mobileLayout, currentTab, colLayout, tabletLayout, columnGutter, customGutter, customRowGutter, collapseGutter, tabletGutter, mobileGutter, tabletRowGutter, mobileRowGutter, gutterType, rowGutterType, collapseOrder, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, gradient, bgColor, bgImg, bgImgAttachment, bgImgSize, bgImgPosition, bgImgRepeat, bgImgID, verticalAlignment, overlayOpacity, overlayBgImg, overlayBgImgAttachment, overlayBgImgID, overlayBgImgPosition, overlayBgImgRepeat, overlayBgImgSize, currentOverlayTab, overlayBlendMode, overlayGradAngle, overlayGradLoc, overlayGradLocSecond, overlayGradType, overlay, overlayGradient, overlaySecond, htmlTag, minHeight, maxWidth, bottomSep, bottomSepColor, bottomSepHeight, bottomSepHeightMobile, bottomSepHeightTab, bottomSepWidth, bottomSepWidthMobile, bottomSepWidthTab, topSep, topSepColor, topSepHeight, topSepHeightMobile, topSepHeightTab, topSepWidth, topSepWidthMobile, topSepWidthTab, firstColumnWidth, secondColumnWidth, textColor, linkColor, linkHoverColor, tabletPadding, topMarginT, bottomMarginT, minHeightUnit, maxWidthUnit, marginUnit, columnsUnlocked, tabletBackground, tabletOverlay, mobileBackground, mobileOverlay, columnsInnerHeight, zIndex, backgroundInline, backgroundSettingTab, backgroundSliderCount, backgroundSlider, inheritMaxWidth, backgroundSliderSettings, backgroundVideo, backgroundVideoType, overlaySecondOpacity, overlayFirstOpacity, paddingUnit, align, minHeightTablet, minHeightMobile, bgColorClass, vsdesk, vstablet, vsmobile, loggedInUser, loggedIn, loggedOut, loggedInShow, rcpAccess, rcpMembership, rcpMembershipLevel, borderWidth, tabletBorderWidth, mobileBorderWidth, borderRadius, tabletBorderRadius, mobileBorderRadius, border, tabletBorder, mobileBorder, borderStyle, tabletBorderStyle, mobileBorderStyle, isPrebuiltModal, responsiveMaxWidth, kadenceBlockCSS } = attributes;

	const editorDocument = document.querySelector( 'iframe[name="editor-canvas"]' )?.contentWindow.document || document;
	const [ borderWidthControl, setBorderWidthControl ] = useState( 'individual' );
	const [ borderRadiusControl, setBorderRadiusControl ] = useState( 'individual' );
	const saveSlideItem = ( value, thisIndex ) => {
		let currentItems = backgroundSlider;
		if ( undefined === currentItems || ( undefined !== currentItems && undefined === currentItems[ 0 ] ) ) {
			currentItems = [ {
				bgColor: '',
				bgImg: '',
				bgImgID: '',
			} ];
		}
		const newUpdate = currentItems.map( ( item, index ) => {
			if ( index === thisIndex ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			backgroundSlider: newUpdate,
		} );
	};
	const saveTabletBackground = ( value ) => {
		const newUpdate = tabletBackground.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			tabletBackground: newUpdate,
		} );
	};
	const saveTabletOverlay = ( value ) => {
		const newUpdate = tabletOverlay.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			tabletOverlay: newUpdate,
		} );
	};
	const saveMobileBackground = ( value ) => {
		const newUpdate = mobileBackground.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			mobileBackground: newUpdate,
		} );
	};
	const saveMobileOverlay = ( value ) => {
		const newUpdate = mobileOverlay.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			mobileOverlay: newUpdate,
		} );
	};
	const saveSliderSettings = ( value ) => {
		let backgroundSlidSettings;
		if ( undefined === backgroundSliderSettings || ( undefined !== backgroundSliderSettings && undefined === backgroundSliderSettings[ 0 ] ) ) {
			backgroundSlidSettings = [ {
				youTube: '',
				local: '',
				localID: '',
				vimeo: '',
				ratio: '16/9',
				btns: false,
				loop: true,
				mute: true,
			} ];
		} else {
			backgroundSlidSettings = backgroundSliderSettings;
		}
		const newUpdate = backgroundSlidSettings.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			backgroundSliderSettings: newUpdate,
		} );
	};
	const saveVideoSettings = ( value ) => {
		let bgVideo;
		if ( undefined === backgroundVideo || ( undefined !== backgroundVideo && undefined === backgroundVideo[ 0 ] ) ) {
			bgVideo = [ {
				youTube: '',
				local: '',
				localID: '',
				vimeo: '',
				ratio: '16/9',
				btns: false,
				loop: true,
				mute: true,
			} ];
		} else {
			bgVideo = backgroundVideo;
		}
		const newUpdate = bgVideo.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		setAttributes( {
			backgroundVideo: newUpdate,
		} );
	};
	const mobileControls = (
		<>
			<ToggleControl
				label={ __( 'Set custom background for Mobile?', 'kadence-blocks' ) }
				checked={ ( mobileBackground && mobileBackground[ 0 ] ? mobileBackground[ 0 ].enable : false ) }
				onChange={ ( value ) => saveMobileBackground( { enable: value } ) }
			/>
			{ mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].enable && (
				<>
					<PopColorControl
						label={ __( 'Background Color', 'kadence-blocks' ) }
						value={ ( mobileBackground[ 0 ].bgColor ? mobileBackground[ 0 ].bgColor : '' ) }
						default={ '' }
						onChange={ value => saveMobileBackground( { bgColor: value } ) }
					/>
					{ '' === mobileBackground[ 0 ].bgImg && '' !== bgImg && (
						<ToggleControl
							label={ __( 'Force no image for mobile', 'kadence-blocks' ) }
							checked={ ( mobileBackground && mobileBackground[ 0 ] ? mobileBackground[ 0 ].forceOverDesk : false ) }
							onChange={ ( value ) => saveMobileBackground( { forceOverDesk: value } ) }
						/>
					) }
					<KadenceBackgroundControl
						label={ __( 'Background Image', 'kadence-blocks' ) }
						hasImage={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImg ? true : false ) }
						imageURL={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImg ? mobileBackground[ 0 ].bgImg : '' ) }
						imageID={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgID ? mobileBackground[ 0 ].bgImgID : '' ) }
						imagePosition={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgPosition ? mobileBackground[ 0 ].bgImgPosition : 'center center' ) }
						imageSize={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgSize ? mobileBackground[ 0 ].bgImgSize : 'cover' ) }
						imageRepeat={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgRepeat ? mobileBackground[ 0 ].bgImgRepeat : 'no-repeat' ) }
						imageAttachment={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImgAttachment ? mobileBackground[ 0 ].bgImgAttachment : 'scroll' ) }
						imageAttachmentParallax={ true }
						onRemoveImage={ () => {
							saveMobileBackground( {
								bgImgID: '',
								bgImg: '',
							} );
						} }
						onSaveImage={ ( img ) => {
							saveMobileBackground( {
								bgImgID: img.id,
								bgImg: img.url,
							} );
						} }
						onSaveURL={ ( newURL ) => {
							if ( newURL !== ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImg ? mobileBackground[ 0 ].bgImg : '' ) ) {
								saveMobileBackground( {
									bgImgID: undefined,
									bgImg: newURL,
								} );
							}
						} }
						onSavePosition={ value => saveMobileBackground( { bgImgPosition: value } ) }
						onSaveSize={ value => saveMobileBackground( { bgImgSize: value } ) }
						onSaveRepeat={ value => saveMobileBackground( { bgImgRepeat: value } ) }
						onSaveAttachment={ value => saveMobileBackground( { bgImgAttachment: value } ) }
						disableMediaButtons={ ( mobileBackground && mobileBackground[ 0 ] && mobileBackground[ 0 ].bgImg ? mobileBackground[ 0 ].bgImg : '' ) }
						dynamicAttribute="mobileBackground:0:bgImg"
						isSelected={ isSelected }
						attributes={ attributes }
						setAttributes={ setAttributes }
						name={ 'kadence/rowlayout' }
						clientId={ clientId }
					/>
				</>
			) }
		</>
	);
	const mobileOverlayControls = (
		<>
			<ToggleControl
				label={ __( 'Set custom background overlay for mobile?', 'kadence-blocks' ) }
				checked={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].enable : false ) }
				onChange={ ( value ) => saveMobileOverlay( { enable: value } ) }
			/>
			{ mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].enable && (
				<>
					<BackgroundTypeControl
						label={ __( 'Overlay Type', 'kadence-blocks' ) }
						type={ mobileOverlay[ 0 ].currentOverlayTab ? mobileOverlay[ 0 ].currentOverlayTab : 'normal' }
						onChange={ value => saveMobileOverlay( { currentOverlayTab: value } ) }
						allowedTypes={ [ 'normal', 'gradient' ] }
					/>
					{ ( 'gradient' === mobileOverlay[ 0 ].currentOverlayTab ) && (
						<GradientControl
							value={ mobileOverlay[ 0 ].gradient }
							onChange={ value => saveMobileOverlay( { gradient: value } ) }
							gradients={ [] }
						/>
					) }
					{ ( 'gradient' !== mobileOverlay[ 0 ].currentOverlayTab ) && (
						overMobileControls
					) }
					<SelectControl
						label={ __( 'Blend Mode', 'kadence-blocks' ) }
						value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayBlendMode : 'none' ) }
						options={ BLEND_OPTIONS }
						onChange={ value => saveMobileOverlay( { overlayBlendMode: value } ) }
					/>
					<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
				</>
			) }
		</>
	);
	const mobileBorderControls = (
		<>
			<PopColorControl
				label={ __( 'Mobile Border Color', 'kadence-blocks' ) }
				value={ ( mobileBorder ? mobileBorder : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { mobileBorder: value } ) }
			/>
			<MeasurementControls
				label={ __( 'Mobile Border Width', 'kadence-blocks' ) }
				measurement={ mobileBorderWidth }
				onChange={ ( value ) => setAttributes( { mobileBorderWidth: value } ) }
				control={ borderWidthControl }
				onControl={ ( value ) => setBorderWidthControl( value ) }
				min={ 0 }
				max={ 40 }
				step={ 1 }
				allowEmpty={ true }
				unit={ 'px' }
				units={ [ 'px' ] }
				showUnit={ true }
				preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
			/>
			<MeasurementControls
				label={ __( 'Mobile Border Radius', 'kadence-blocks' ) }
				measurement={ mobileBorderRadius }
				control={ borderRadiusControl }
				onChange={ ( value ) => setAttributes( { mobileBorderRadius: value } ) }
				onControl={ ( value ) => setBorderRadiusControl( value ) }
				min={ 0 }
				max={ 500 }
				step={ 1 }
				allowEmpty={ true }
				controlTypes={ [
					{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: radiusLinkedIcon },
					{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: radiusIndividualIcon },
				] }
				firstIcon={ topLeftIcon }
				secondIcon={ topRightIcon }
				thirdIcon={ bottomRightIcon }
				fourthIcon={ bottomLeftIcon }
			/>
		</>
	);
	const tabletControls = (
		<>
			<ToggleControl
				label={ __( 'Set custom background for tablets?', 'kadence-blocks' ) }
				checked={ ( tabletBackground && tabletBackground[ 0 ] ? tabletBackground[ 0 ].enable : false ) }
				onChange={ ( value ) => saveTabletBackground( { enable: value } ) }
			/>
			{ tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].enable && (
				<>
					<BackgroundTypeControl
						label={ __( 'Type', 'kadence-blocks' ) }
						type={ tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].type ? tabletBackground[ 0 ].type : 'normal' }
						onChange={ value => saveTabletBackground( { type: value } ) }
						allowedTypes={ [ 'normal', 'gradient' ] }
					/>
					<PopColorControl
						label={ __( 'Background Color', 'kadence-blocks' ) }
						value={ ( tabletBackground[ 0 ].bgColor ? tabletBackground[ 0 ].bgColor : '' ) }
						default={ '' }
						onChange={ value => saveTabletBackground( { bgColor: value } ) }
					/>
					{ '' === tabletBackground[ 0 ].bgImg && '' !== bgImg && (
						<ToggleControl
							label={ __( 'Force no image for tablet', 'kadence-blocks' ) }
							checked={ ( tabletBackground && tabletBackground[ 0 ] ? tabletBackground[ 0 ].forceOverDesk : false ) }
							onChange={ ( value ) => saveTabletBackground( { forceOverDesk: value } ) }
						/>
					) }
					<KadenceBackgroundControl
						label={ __( 'Background Image', 'kadence-blocks' ) }
						hasImage={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImg ? true : false ) }
						imageURL={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImg ? tabletBackground[ 0 ].bgImg : '' ) }
						imageID={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgID ? tabletBackground[ 0 ].bgImgID : '' ) }
						imagePosition={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgPosition ? tabletBackground[ 0 ].bgImgPosition : 'center center' ) }
						imageSize={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgSize ? tabletBackground[ 0 ].bgImgSize : 'cover' ) }
						imageRepeat={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgRepeat ? tabletBackground[ 0 ].bgImgRepeat : 'no-repeat' ) }
						imageAttachment={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImgAttachment ? tabletBackground[ 0 ].bgImgAttachment : 'scroll' ) }
						imageAttachmentParallax={ true }
						onRemoveImage={ () => {
							saveTabletBackground( {
								bgImgID: '',
								bgImg: '',
							} );
						} }
						onSaveImage={ ( img ) => {
							saveTabletBackground( {
								bgImgID: img.id,
								bgImg: img.url,
							} );
						} }
						onSaveURL={ ( newURL ) => {
							if ( newURL !== ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImg ? tabletBackground[ 0 ].bgImg : '' ) ) {
								saveTabletBackground( {
									bgImgID: undefined,
									bgImg: newURL,
								} );
							}
						} }
						onSavePosition={ value => saveTabletBackground( { bgImgPosition: value } ) }
						onSaveSize={ value => saveTabletBackground( { bgImgSize: value } ) }
						onSaveRepeat={ value => saveTabletBackground( { bgImgRepeat: value } ) }
						onSaveAttachment={ value => saveTabletBackground( { bgImgAttachment: value } ) }
						disableMediaButtons={ ( tabletBackground && tabletBackground[ 0 ] && tabletBackground[ 0 ].bgImg ? tabletBackground[ 0 ].bgImg : '' ) }
						dynamicAttribute="tabletBackground:0:bgImg"
						isSelected={ isSelected }
						attributes={ attributes }
						setAttributes={ setAttributes }
						name={ 'kadence/rowlayout' }
						clientId={ clientId }
					/>
				</>
			) }
		</>
	);
	const tabletOverlayControls = (
		<>
			<ToggleControl
				label={ __( 'Set custom background overlay for tablets?', 'kadence-blocks' ) }
				checked={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].enable : false ) }
				onChange={ ( value ) => saveTabletOverlay( { enable: value } ) }
			/>
			{ tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].enable && (
				<>
					<BackgroundTypeControl
						label={ __( 'Overlay Type', 'kadence-blocks' ) }
						type={ tabletOverlay[ 0 ].currentOverlayTab ? tabletOverlay[ 0 ].currentOverlayTab : 'normal' }
						onChange={ value => saveTabletOverlay( { currentOverlayTab: value } ) }
						allowedTypes={ [ 'normal', 'gradient' ] }
					/>
					{ ( 'gradient' === tabletOverlay[ 0 ].currentOverlayTab ) && (
						<GradientControl
							value={ tabletOverlay[ 0 ].gradient }
							onChange={ value => saveTabletOverlay( { gradient: value } ) }
							gradients={ [] }
						/>
					) }
					{ ( 'gradient' !== tabletOverlay[ 0 ].currentOverlayTab ) && (
						overTabControls
					) }
					<SelectControl
						label={ __( 'Blend Mode' ) }
						value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayBlendMode : 'none' ) }
						options={ BLEND_OPTIONS }
						onChange={ value => saveTabletOverlay( { overlayBlendMode: value } ) }
					/>
					<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
				</>
			) }
		</>
	);
	const tabletBorderControls = (
			<>
			<PopColorControl
				label={ __( 'Tablet Border Color', 'kadence-blocks' ) }
				value={ ( tabletBorder ? tabletBorder : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { tabletBorder: value } ) }
			/>
			<MeasurementControls
				label={ __( 'Tablet Border Width', 'kadence-blocks' ) }
				measurement={ tabletBorderWidth }
				onChange={ ( value ) => setAttributes( { tabletBorderWidth: value } ) }
				control={ borderWidthControl }
				onControl={ ( value ) => this.setState( { borderWidthControl: value } ) }
				min={ 0 }
				max={ 40 }
				step={ 1 }
				allowEmpty={ true }
				unit={ 'px' }
				units={ [ 'px' ] }
				showUnit={ true }
				preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
			/>
			<MeasurementControls
				label={ __( 'Tablet Border Radius', 'kadence-blocks' ) }
				measurement={ tabletBorderRadius }
				control={ borderRadiusControl }
				onChange={ ( value ) => setAttributes( { tabletBorderRadius: value } ) }
				onControl={ ( value ) => this.setState( { borderRadiusControl: value } ) }
				min={ 0 }
				max={ 500 }
				step={ 1 }
				allowEmpty={ true }
				controlTypes={ [
					{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: radiusLinkedIcon },
					{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: radiusIndividualIcon },
				] }
				firstIcon={ topLeftIcon }
				secondIcon={ topRightIcon }
				thirdIcon={ bottomRightIcon }
				fourthIcon={ bottomLeftIcon }
			/>
		</>
	);
	const slideControls = ( index ) => {
		let bgSlider;
		if ( undefined === backgroundSlider || ( undefined !== backgroundSlider && undefined === backgroundSlider[ 0 ] ) ) {
			bgSlider = [ {
				bgColor: '',
				bgImg: '',
				bgImgID: '',
			} ];
		} else {
			bgSlider = backgroundSlider;
		}
		return (
			<SubsectionWrap
				label={__( 'Slide', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Settings', 'kadence-blocks' ) }
			>
				<PopColorControl
					label={ __( 'Slide Background Color', 'kadence-blocks' ) }
					value={ ( undefined !== bgSlider && undefined !== bgSlider[ index ] && bgSlider[ index ].bgColor ? bgSlider[ index ].bgColor : '' ) }
					default={ '' }
					onChange={ value => saveSlideItem( { bgColor: value }, index ) }
				/>
				<KadenceImageControl
					label={__( 'Slide Background Image', 'kadence-blocks' )}
					hasImage={( bgSlider && bgSlider[ index ] && bgSlider[ index ].bgImg ? true : false )}
					imageURL={( bgSlider && bgSlider[ index ] && bgSlider[ index ].bgImg ? bgSlider[ index ].bgImg : '' )}
					imageID={( bgSlider && bgSlider[ index ] && bgSlider[ index ].bgImgID ? bgSlider[ index ].bgImgID : '' )}
					onRemoveImage={ () => {
						saveSlideItem( {
							bgImgID: '',
							bgImg: '',
						}, index );
					} }
					onSaveImage={ img => {
						saveSlideItem( {
							bgImgID: img.id,
							bgImg: img.url,
						}, index );
					} }
					disableMediaButtons={ ( bgSlider && bgSlider[ index ] && bgSlider[ index ].bgImg ? true : false ) }
				/>
			</SubsectionWrap>
		);
	};
	const deskControls = (
		<>
			<BackgroundTypeControl
				label={ __( 'Type', 'kadence-blocks' ) }
				type={ backgroundSettingTab }
				onChange={ ( value ) => {
					setAttributes( { backgroundSettingTab: value } );
				} }
			/>
			{ 'slider' === backgroundSettingTab && (
				<>
					<RangeControl
						label={ __( 'Slider Item Count', 'kadence-blocks' ) }
						value={ ( undefined !== backgroundSliderCount ? backgroundSliderCount : 1 ) }
						onChange={ newcount => {
							let newSlides;
							if ( undefined === backgroundSlider || ( undefined !== backgroundSlider && undefined === backgroundSlider[ 0 ] ) ) {
								newSlides = [ {
									bgColor: '',
									bgImg: '',
									bgImgID: '',
								} ];
							} else {
								newSlides = backgroundSlider;
							}
							if ( newSlides.length < newcount ) {
								const amount = Math.abs( newcount - newSlides.length );
								{ times( amount, n => {
									newSlides.push( {
										bgColor: '',
										bgImg: '',
										bgImgID: '',
									} );
								} ); }
								setAttributes( { backgroundSlider: newSlides } );
							}
							setAttributes( { backgroundSliderCount: newcount } );
						} }
						step={ 1 }
						min={ 1 }
						max={ 20 }
					/>
					{ times( ( undefined !== backgroundSliderCount ? backgroundSliderCount : 1 ), n => slideControls( n ) ) }
					<KadenceRadioButtons
						label={ __( 'Slider Image Size', 'kadence-blocks' ) }
						value={ bgImgSize }
						options={ [
							{ value: 'cover', label: __( 'Cover', 'kadence-blocks' ) },
							{ value: 'contain', label: __( 'Contain', 'kadence-blocks' ) },
							{ value: 'auto', label: __( 'Auto', 'kadence-blocks' ) },
						] }
						onChange={ value => setAttributes( { bgImgSize: value } ) }
					/>
					<SelectControl
						label={ __( 'Slider Image Position', 'kadence-blocks' ) }
						value={ bgImgPosition }
						options={ [
							{ value: 'center top', label: __( 'Center Top', 'kadence-blocks' ) },
							{ value: 'center center', label: __( 'Center Center', 'kadence-blocks' ) },
							{ value: 'center bottom', label: __( 'Center Bottom', 'kadence-blocks' ) },
							{ value: 'left top', label: __( 'Left Top', 'kadence-blocks' ) },
							{ value: 'left center', label: __( 'Left Center', 'kadence-blocks' ) },
							{ value: 'left bottom', label: __( 'Left Bottom', 'kadence-blocks' ) },
							{ value: 'right top', label: __( 'Right Top', 'kadence-blocks' ) },
							{ value: 'right center', label: __( 'Right Center', 'kadence-blocks' ) },
							{ value: 'right bottom', label: __( 'Right Bottom', 'kadence-blocks' ) },
						] }
						onChange={ value => setAttributes( { bgImgPosition: value } ) }
					/>
					<KadenceRadioButtons
						label={ __( 'Slider Image Repeat', 'kadence-blocks' ) }
						value={ bgImgRepeat }
						options={ [
							{ value: 'no-repeat', label: __( 'No Repeat', 'kadence-blocks' ) },
							{ value: 'repeat', label: __( 'Repeat', 'kadence-blocks' ) },
							{ value: 'repeat-x', label: __( 'Repeat-x', 'kadence-blocks' ) },
							{ value: 'repeat-y', label: __( 'Repeat-y', 'kadence-blocks' ) },
						] }
						onChange={ value => setAttributes( { bgImgRepeat: value } ) }
					/>
					<ToggleControl
						label={ __( 'Slider Auto Play', 'kadence-blocks' ) }
						checked={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].autoPlay ? backgroundSliderSettings[ 0 ].autoPlay : true ) }
						onChange={ ( value ) => saveSliderSettings( { autoPlay: value } ) }
					/>
					{ backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].autoPlay && backgroundSliderSettings[ 0 ].autoPlay && (
						<RangeControl
							label={ __( 'Autoplay Speed', 'kadence-blocks' ) }
							value={ backgroundSliderSettings[ 0 ].speed }
							onChange={ ( value ) => saveSliderSettings( { speed: value } ) }
							min={ 500 }
							max={ 15000 }
							step={ 10 }
						/>
					) }
					<SelectControl
						label={ __( 'Transition Style', 'kadence-blocks' ) }
						options={ [
							{
								label: __( 'Fade', 'kadence-blocks' ),
								value: 'fade',
							},
							{
								label: __( 'Slide', 'kadence-blocks' ),
								value: 'slide',
							},
						] }
						value={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].fade && false === backgroundSliderSettings[ 0 ].fade ? 'slide' : 'fade' ) }
						onChange={ ( value ) => {
							if ( 'slide' === value ) {
								saveSliderSettings( { fade: false } );
							} else {
								saveSliderSettings( { fade: true } );
							}
						} }
					/>
					<RangeControl
						label={ __( 'Slider Transition Speed', 'kadence-blocks' ) }
						value={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].tranSpeed ? backgroundSliderSettings[ 0 ].tranSpeed : 400 ) }
						onChange={ ( value ) => saveSliderSettings( { tranSpeed: value } ) }
						min={ 100 }
						max={ 2000 }
						step={ 10 }
					/>
					<SelectControl
						label={ __( 'Arrow Style', 'kadence-blocks' ) }
						options={ [
							{
								label: __( 'White on Dark', 'kadence-blocks' ),
								value: 'whiteondark',
							},
							{
								label: __( 'Black on Light', 'kadence-blocks' ),
								value: 'blackonlight',
							},
							{
								label: __( 'Outline Black', 'kadence-blocks' ),
								value: 'outlineblack',
							},
							{
								label: __( 'Outline White', 'kadence-blocks' ),
								value: 'outlinewhite',
							},
							{
								label: __( 'None', 'kadence-blocks' ),
								value: 'none',
							},
						] }
						value={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].arrowStyle ? backgroundSliderSettings[ 0 ].arrowStyle : 'none' ) }
						onChange={ ( value ) => saveSliderSettings( { arrowStyle: value } ) }
					/>
					<SelectControl
						label={ __( 'Dot Style' ) }
						options={ [
							{
								label: __( 'Dark', 'kadence-blocks' ),
								value: 'dark',
							},
							{
								label: __( 'Light', 'kadence-blocks' ),
								value: 'light',
							},
							{
								label: __( 'Outline Dark', 'kadence-blocks' ),
								value: 'outlinedark',
							},
							{
								label: __( 'Outline Light', 'kadence-blocks' ),
								value: 'outlinelight',
							},
							{
								label: __( 'None', 'kadence-blocks' ),
								value: 'none',
							},
						] }
						value={ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].dotStyle ? backgroundSliderSettings[ 0 ].dotStyle : 'dark' ) }
						onChange={ ( value ) => saveSliderSettings( { dotStyle: value } ) }
					/>
				</>
			) }
			{ 'video' === backgroundSettingTab && (
				<>
					{/* <SelectControl
						label={ __( 'Background Video Type' ) }
						options={ [
							{
								label: __( 'Local (MP4)' ),
								value: 'local',
							},
							{
								label: __( 'YouTube' ),
								value: 'youtube',
							},
							{
								label: __( 'Vimeo' ),
								value: 'vimeo',
							},
						] }
						value={ backgroundVideoType }
						onChange={ ( value ) => setAttributes( { backgroundVideoType: value } ) }
					/> */}
					{ ( undefined === backgroundVideoType || 'local' === backgroundVideoType ) && (
						<Fragment>
							<KadenceVideoControl
								label={__( 'Background Video', 'kadence-blocks' )}
								hasVideo={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && backgroundVideo[ 0 ].localID ? true : false ) }
								videoURL={( backgroundVideo && backgroundVideo[ 0 ] && backgroundVideo[ 0 ].local ? backgroundVideo[ 0 ].local : '' )}
								videoID={( backgroundVideo && backgroundVideo[ 0 ] && backgroundVideo[ 0 ].localID ? backgroundVideo[ 0 ].localID : '' )}
								onRemoveVideo={() => {
									saveVideoSettings( {
										localID: '',
										local: '',
									} );
								} }
								onSaveVideo={ video => {
									saveVideoSettings( {
										localID: video.id,
										local: video.url,
									} );
								} }
								disableMediaButtons={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && backgroundVideo[ 0 ].local ? true : false ) }
							/>
							<TextControl
								label={ __( 'HTML5 Video File URL', 'kadence-blocks' ) }
								value={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && backgroundVideo[ 0 ].local ? backgroundVideo[ 0 ].local : '' ) }
								onChange={ value => saveVideoSettings( { local: value } ) }
							/>
						</Fragment>
					) }
					{ 'youtube' === backgroundVideoType && (
						<TextControl
							label={ __( 'YouTube ID ( example: Sv_hGITmNuo )', 'kadence-blocks' ) }
							value={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && backgroundVideo[ 0 ].youtube ? backgroundVideo[ 0 ].youtube : '' ) }
							onChange={ value => saveVideoSettings( { youtube: value } ) }
						/>
					) }
					{ undefined !== backgroundVideoType && 'local' !== backgroundVideoType && (
						<SelectControl
							label={ __( 'Background Video Ratio', 'kadence-blocks' ) }
							options={ [
								{
									label: '16 / 9',
									value: '16/9',
								},
								{
									label: '4 / 3',
									value: '4/3',
								},
								{
									label: '3 / 2',
									value: '3/2',
								},
							] }
							value={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].ratio ? backgroundVideo[ 0 ].ratio : '16/9' ) }
							onChange={ ( value ) => saveVideoSettings( { ratio: value } ) }
						/>
					) }
					<ToggleControl
						label={ __( 'Mute Video', 'kadence-blocks' ) }
						checked={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].mute ? backgroundVideo[ 0 ].mute : true ) }
						onChange={ ( value ) => saveVideoSettings( { mute: value } ) }
					/>
					<ToggleControl
						label={ __( 'Loop Video', 'kadence-blocks' ) }
						checked={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].loop ? backgroundVideo[ 0 ].loop : true ) }
						onChange={ ( value ) => saveVideoSettings( { loop: value } ) }
					/>
					<ToggleControl
						label={ __( 'Show Play Pause Buttons?', 'kadence-blocks' ) }
						checked={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].btns ? backgroundVideo[ 0 ].btns : true ) }
						onChange={ ( value ) => saveVideoSettings( { btns: value } ) }
					/>
					<PopColorControl
						label={ __( 'Background Color', 'kadence-blocks' ) }
						value={ ( bgColor ? bgColor : '' ) }
						default={ '' }
						onChange={ value => setAttributes( { bgColor: value } ) }
						onClassChange={ value => setAttributes( { bgColorClass: value } ) }
					/>
					<KadenceImageControl
						label={__( 'Select Video Poster', 'kadence-blocks' )}
						hasImage={( bgImgID ? true : false )}
						imageURL={( bgImg ? bgImg : '' )}
						imageID={( bgImgID ? bgImgID : '' )}
						onRemoveImage={ () => {
							setAttributes( {
								bgImgID: null,
								bgImg: null,
							} );
						} }
						onSaveImage={ ( img ) => {
							setAttributes( {
								bgImgID: img.id,
								bgImg: img.url,
							} );
						} }
						disableMediaButtons={ ( bgImg ? true : false ) }
					/>
				</>
			) }
			{ 'gradient' === backgroundSettingTab && (
				<GradientControl
					value={ gradient }
					onChange={ value => setAttributes( { gradient: value } ) }
					gradients={ [] }
				/>
			) }
			{ 'normal' === backgroundSettingTab && (
				<>
					<PopColorControl
						label={ __( 'Background Color', 'kadence-blocks' ) }
						value={ ( bgColor ? bgColor : '' ) }
						default={ '' }
						onChange={ value => setAttributes( { bgColor: value } ) }
						onClassChange={ value => setAttributes( { bgColorClass: value } ) }
					/>
					<KadenceBackgroundControl
						label={ __( 'Background Image', 'kadence-blocks' ) }
						hasImage={ bgImg }
						imageURL={ bgImg }
						imageID={ bgImgID }
						imagePosition={ ( bgImgPosition ? bgImgPosition : 'center center' ) }
						imageSize={ ( bgImgSize ? bgImgSize : 'cover' ) }
						imageRepeat={ ( bgImgRepeat ? bgImgRepeat : 'no-repeat' ) }
						imageAttachment={ ( bgImgAttachment ? bgImgAttachment : 'scroll' ) }
						imageAttachmentParallax={ true }
						onRemoveImage={ () => {
							setAttributes( {
								bgImgID: null,
								bgImg: null,
							} );
						} }
						onSaveImage={ ( img ) => {
							setAttributes( {
								bgImgID: img.id,
								bgImg: img.url,
							} );
						} }
						onSaveURL={ ( newURL ) => {
							if ( newURL !== bgImg ) {
								setAttributes( {
									bgImgID: undefined,
									bgImg: newURL,
								} );
							}
						} }
						onSavePosition={ value => setAttributes( { bgImgPosition: value } ) }
						onSaveSize={ value => setAttributes( { bgImgSize: value } ) }
						onSaveRepeat={ value => setAttributes( { bgImgRepeat: value } ) }
						onSaveAttachment={ value => setAttributes( { bgImgAttachment: value } ) }
						inlineImage={ backgroundInline }
						onSaveInlineImage={ ( value ) => setAttributes( { backgroundInline: value } ) }
						disableMediaButtons={ bgImg }
						dynamicAttribute="bgImg"
						isSelected={ isSelected }
						attributes={ attributes }
						setAttributes={ setAttributes }
						name={ 'kadence/rowlayout' }
						clientId={ clientId }
					/>
				</>
			)}
		</>
	);
	const overControls = (
		<>
			<PopColorControl
				label={ __( 'Overlay Color', 'kadence-blocks' ) }
				value={ ( overlay ? overlay : '' ) }
				default={ '' }
				onChange={ value => setAttributes( {overlay: value } ) }
				opacityValue={ ( undefined !== overlayFirstOpacity && '' !== overlayFirstOpacity ? overlayFirstOpacity : 1 ) }
				onOpacityChange={ value => setAttributes( { overlayFirstOpacity: value } ) }
			/>
			<KadenceBackgroundControl
				label={ __( 'Background Image', 'kadence-blocks' ) }
				hasImage={ overlayBgImg }
				imageURL={ overlayBgImg }
				imageID={ overlayBgImgID }
				imagePosition={ ( overlayBgImgPosition ? overlayBgImgPosition : 'center center' ) }
				imageSize={ ( overlayBgImgSize ? overlayBgImgSize : 'cover' ) }
				imageRepeat={ ( overlayBgImgRepeat ? overlayBgImgRepeat : 'no-repeat' ) }
				imageAttachment={ ( overlayBgImgAttachment ? overlayBgImgAttachment : 'scroll' ) }
				imageAttachmentParallax={ true }
				onRemoveImage={ () => {
					setAttributes( {
						overlayBgImgID: null,
						overlayBgImg: null,
					} );
				} }
				onSaveImage={ ( img ) => {
					setAttributes( {
						overlayBgImgID: img.id,
						overlayBgImg: img.url,
					} );
				} }
				onSaveURL={ ( newURL ) => {
					if ( newURL !== overlayBgImg ) {
						setAttributes( {
							overlayBgImgID: undefined,
							overlayBgImg: newURL,
						} );
					}
				} }
				onSavePosition={ value => setAttributes( { overlayBgImgPosition: value } ) }
				onSaveSize={ value => setAttributes( { overlayBgImgSize: value } ) }
				onSaveRepeat={ value => setAttributes( { overlayBgImgRepeat: value } ) }
				onSaveAttachment={ value => setAttributes( { overlayBgImgAttachment: value } ) }
				disableMediaButtons={ overlayBgImg }
				dynamicAttribute="overlayBgImg"
				isSelected={ isSelected }
				attributes={ attributes }
				setAttributes={ setAttributes }
				name={ 'kadence/rowlayout' }
				clientId={ clientId }
			/>
		</>
	);
const deskOverlayControls = (
	<>
		<RangeControl
			label={ __( 'Overlay Opacity', 'kadence-blocks' ) }
			value={ overlayOpacity }
			onChange={ ( value ) => {
				setAttributes( {
					overlayOpacity: value,
				} );
			} }
			min={ 0 }
			max={ 100 }
		/>
		<BackgroundTypeControl
			label={ __( 'Overlay Type', 'kadence-blocks' ) }
			type={ currentOverlayTab ? currentOverlayTab : 'normal' }
			onChange={ value => setAttributes( { currentOverlayTab: value } ) }
			allowedTypes={ [ 'normal', 'gradient' ] }
		/>
		{ ( 'gradient' === currentOverlayTab ) && (
			<GradientControl
				value={ overlayGradient }
				onChange={ value => setAttributes( { overlayGradient: value } ) }
				gradients={ [] }
			/>
		) }
		{ ( 'gradient' !== currentOverlayTab ) && (
			<>{ overControls }</>
		) }
		<SelectControl
			label={ __( 'Blend Mode' ) }
			value={ overlayBlendMode }
			options={ BLEND_OPTIONS }
			onChange={ value => setAttributes( { overlayBlendMode: value } ) }
		/>
		<p>{ __( 'Notice: Blend Mode not supported in all browsers', 'kadence-blocks' ) }</p>
	</>
);
const deskBorderControls = (
	<>
		<PopColorControl
			label={ __( 'Border Color', 'kadence-blocks' ) }
			value={ ( border ? border : '' ) }
			default={ '' }
			onChange={ value => setAttributes( { border: value } ) }
		/>
		<MeasurementControls
			label={ __( 'Border Width', 'kadence-blocks' ) }
			measurement={ borderWidth }
			onChange={ ( value ) => setAttributes( { borderWidth: value } ) }
			control={ borderWidthControl }
			onControl={ ( value ) => setBorderWidthControl( value ) }
			min={ 0 }
			max={ 40 }
			step={ 1 }
			allowEmpty={ true }
			unit={ 'px' }
			units={ [ 'px' ] }
			showUnit={ true }
			preset={ [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] }
		/>
		<MeasurementControls
			label={ __( 'Border Radius', 'kadence-blocks' ) }
			measurement={ borderRadius }
			control={ borderRadiusControl }
			onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
			onControl={ ( value ) => setBorderRadiusControl( value ) }
			min={ 0 }
			max={ 500 }
			step={ 1 }
			allowEmpty={ true }
			controlTypes={ [
				{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: radiusLinkedIcon },
				{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: radiusIndividualIcon },
			] }
			firstIcon={ topLeftIcon }
			secondIcon={ topRightIcon }
			thirdIcon={ bottomRightIcon }
			fourthIcon={ bottomLeftIcon }
		/>
	</>
);
	
	const overTabControls = (
		<div>
			<RangeControl
				label={ __( 'Overlay Opacity', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlayOpacity : 30 ) }
				onChange={ ( value ) => {
					saveTabletOverlay( {
						overlayOpacity: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Overlay Color', 'kadence-blocks' ) }
				value={ ( tabletOverlay && tabletOverlay[ 0 ] ? tabletOverlay[ 0 ].overlay : '' ) }
				default={ '' }
				onChange={ value => saveTabletOverlay( { overlay: value } ) }
			/>
			<KadenceBackgroundControl
				label={ __( 'Overlay Image', 'kadence-blocks' ) }
				hasImage={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImg ? true : false ) }
				imageURL={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImg ? tabletOverlay[ 0 ].overlayBgImg : '' ) }
				imageID={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImgID ? tabletOverlay[ 0 ].overlayBgImgID : '' ) }
				imagePosition={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImgPosition ? tabletOverlay[ 0 ].overlayBgImgPosition : 'center center' ) }
				imageSize={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImgSize ? tabletOverlay[ 0 ].overlayBgImgSize : 'cover' ) }
				imageRepeat={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImgRepeat ? tabletOverlay[ 0 ].overlayBgImgRepeat : 'no-repeat' ) }
				imageAttachment={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].bgImgAttachment ? tabletOverlay[ 0 ].bgImgAttachment : 'scroll' ) }
				imageAttachmentParallax={ true }
				onRemoveImage={ () => {
					saveTabletOverlay( {
						overlayBgImgID: '',
						overlayBgImg: '',
					} );
				} }
				onSaveImage={ ( img ) => {
					saveTabletOverlay( {
						overlayBgImgID: img.id,
						overlayBgImg: img.url,
					} );
				} }
				onSaveURL={ ( newURL ) => {
					if ( newURL !== ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImg ? tabletOverlay[ 0 ].overlayBgImg : '' ) ) {
						saveTabletOverlay( {
							overlayBgImgID: undefined,
							overlayBgImg: newURL,
						} );
					}
				} }
				onSavePosition={ value => saveTabletOverlay( { overlayBgImgPosition: value } ) }
				onSaveSize={ value => saveTabletOverlay( { overlayBgImgSize: value } ) }
				onSaveRepeat={ value => saveTabletOverlay( { overlayBgImgRepeat: value } ) }
				onSaveAttachment={ value => saveTabletOverlay( { overlayBgImgAttachment: value } ) }
				disableMediaButtons={ ( tabletOverlay && tabletOverlay[ 0 ] && tabletOverlay[ 0 ].overlayBgImg ? tabletOverlay[ 0 ].overlayBgImg : '' ) }
				dynamicAttribute="tabletOverlay:0:overlayBgImg"
				isSelected={ isSelected }
				attributes={ attributes }
				setAttributes={ setAttributes }
				name={ 'kadence/rowlayout' }
				clientId={ clientId }
			/>
		</div>
	);
	const overMobileControls = (
		<div>
			<RangeControl
				label={ __( 'Overlay Opacity' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlayOpacity : 30 ) }
				onChange={ ( value ) => {
					saveMobileOverlay( {
						overlayOpacity: value,
					} );
				} }
				min={ 0 }
				max={ 100 }
			/>
			<PopColorControl
				label={ __( 'Overlay Color', 'kadence-blocks' ) }
				value={ ( mobileOverlay && mobileOverlay[ 0 ] ? mobileOverlay[ 0 ].overlay : '' ) }
				default={ '' }
				onChange={ value => saveMobileOverlay( { overlay: value } ) }
			/>
			<KadenceBackgroundControl
				label={ __( 'Overlay Image', 'kadence-blocks' ) }
				hasImage={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImg ? true : false ) }
				imageURL={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImg ? mobileOverlay[ 0 ].overlayBgImg : '' ) }
				imageID={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImgID ? mobileOverlay[ 0 ].overlayBgImgID : '' ) }
				imagePosition={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImgPosition ? mobileOverlay[ 0 ].overlayBgImgPosition : 'center center' ) }
				imageSize={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImgSize ? mobileOverlay[ 0 ].overlayBgImgSize : 'cover' ) }
				imageRepeat={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImgRepeat ? mobileOverlay[ 0 ].overlayBgImgRepeat : 'no-repeat' ) }
				imageAttachment={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].bgImgAttachment ? mobileOverlay[ 0 ].bgImgAttachment : 'scroll' ) }
				imageAttachmentParallax={ true }
				onRemoveImage={ () => {
					saveMobileOverlay( {
						overlayBgImgID: '',
						overlayBgImg: '',
					} );
				} }
				onSaveImage={ ( img ) => {
					saveMobileOverlay( {
						overlayBgImgID: img.id,
						overlayBgImg: img.url,
					} );
				} }
				onSaveURL={ ( newURL ) => {
					if ( newURL !== ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImg ? mobileOverlay[ 0 ].overlayBgImg : '' ) ) {
						saveMobileOverlay( {
							overlayBgImgID: undefined,
							overlayBgImg: newURL,
						} );
					}
				} }
				onSavePosition={ value => saveMobileOverlay( { overlayBgImgPosition: value } ) }
				onSaveSize={ value => saveMobileOverlay( { overlayBgImgSize: value } ) }
				onSaveRepeat={ value => saveMobileOverlay( { overlayBgImgRepeat: value } ) }
				onSaveAttachment={ value => saveMobileOverlay( { overlayBgImgAttachment: value } ) }
				disableMediaButtons={ ( mobileOverlay && mobileOverlay[ 0 ] && mobileOverlay[ 0 ].overlayBgImg ? mobileOverlay[ 0 ].overlayBgImg : '' ) }
				dynamicAttribute="mobileOverlay:0:overlayBgImg"
				isSelected={ isSelected }
				attributes={ attributes }
				setAttributes={ setAttributes }
				name={ 'kadence/rowlayout' }
				clientId={ clientId }
			/>
		</div>
	);
	const colorControls = (
		<KadencePanelBody
			title={ __( 'Text Color Settings', 'kadence-blocks' ) }
			initialOpen={ false }
			panelName={ 'kb-row-text-color' }
		>
			<PopColorControl
				label={ __( 'Text Color', 'kadence-blocks' ) }
				value={ ( textColor ? textColor : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { textColor: value } ) }
			/>
			<PopColorControl
				label={ __( 'Link Color', 'kadence-blocks' ) }
				value={ ( linkColor ? linkColor : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { linkColor: value } ) }
			/>
			<PopColorControl
				label={ __( 'Link Hover Color', 'kadence-blocks' ) }
				value={ ( linkHoverColor ? linkHoverColor : '' ) }
				default={ '' }
				onChange={ value => setAttributes( { linkHoverColor: value } ) }
			/>
		</KadencePanelBody>
	);
	return (
		<>
			{ showSettings( 'background', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Background Settings', 'kadence-blocks' ) }
					initialOpen={ true }
					panelName={ 'kb-row-bg-settings' }
				>
					<SmallResponsiveControl
						label={__( 'Background', 'kadence-blocks' )}
						hasPadding={ true }
						desktopChildren={ deskControls }
						tabletChildren={ tabletControls }
						mobileChildren={ mobileControls }
					/>
				</KadencePanelBody>
			) }
			{ showSettings( 'backgroundOverlay', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Background Overlay Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-bg-overlay' }
				>
					<SmallResponsiveControl
						label={__( 'Overlay', 'kadence-blocks' )}
						hasPadding={ true }
						desktopChildren={ deskOverlayControls }
						tabletChildren={ tabletOverlayControls }
						mobileChildren={ mobileOverlayControls }
					/>
					
				</KadencePanelBody>
			) }
			{ showSettings( 'border', 'kadence/rowlayout' ) && (
				<KadencePanelBody
					title={ __( 'Border Settings', 'kadence-blocks' ) }
					initialOpen={ false }
					panelName={ 'kb-row-border-settings' }
				>
					<ResponsiveBorderControl
						label={__( 'Border', 'kadence-blocks' )}
						value={borderStyle}
						tabletValue={tabletBorderStyle}
						mobileValue={mobileBorderStyle}
						onChange={( value ) => setAttributes( { borderStyle: value } )}
						onChangeTablet={( value ) => setAttributes( { tabletBorderStyle: value } )}
						onChangeMobile={( value ) => setAttributes( { mobileBorderStyle: value } )}
					/>
					<ResponsiveMeasurementControls
						label={__( 'Border Radius', 'kadence-blocks' )}
						value={borderRadius}
						tabletValue={tabletBorderRadius}
						mobileValue={mobileBorderRadius}
						onChange={( value ) => setAttributes( { borderRadius: value } )}
						onChangeTablet={( value ) => setAttributes( { tabletBorderRadius: value } )}
						onChangeMobile={( value ) => setAttributes( { mobileBorderRadius: value } )}
						unit={'px'}
						units={[ 'px' ]}
						showUnit={true}
						min={ 0 }
						max={ 500 }
						step={ 1 }
						allowEmpty={ true }
						controlTypes={ [
							{ key: 'linked', name: __( 'Linked', 'kadence-blocks' ), icon: radiusLinkedIcon },
							{ key: 'individual', name: __( 'Individual', 'kadence-blocks' ), icon: radiusIndividualIcon },
						] }
						firstIcon={ topLeftIcon }
						secondIcon={ topRightIcon }
						thirdIcon={ bottomRightIcon }
						fourthIcon={ bottomLeftIcon }
					/>
					<SmallResponsiveControl
						label={__( 'Border', 'kadence-blocks' )}
						hasPadding={ true }
						desktopChildren={ deskBorderControls }
						tabletChildren={ tabletBorderControls }
						mobileChildren={ mobileBorderControls }
					/>
				</KadencePanelBody>
			) }
			<div className="kt-sidebar-settings-spacer"></div>
			{ showSettings( 'textColor', 'kadence/rowlayout' ) && (
				colorControls
			) }
		</>
	);
};
export default StyleControls;

