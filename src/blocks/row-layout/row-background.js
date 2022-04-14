/**
 * BLOCK Section: Kadence Row / Layout Background
 */

 import times from 'lodash/times';
 import Slider from 'react-slick';
 import KadenceColorOutput from '../../components/color/kadence-color-output';

import {
	Component,
	Fragment,
} from '@wordpress/element';
import { getPreviewSize } from '../../helpers/helpers';
import {
	Dashicon,
} from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import {
	useBlockProps,
} from '@wordpress/block-editor';
/**
 * Build the row edit
 */
function RowBackground( {
	attributes,
	previewDevice,
	backgroundClasses,
	children,
} ) {
	const { uniqueID, columns, mobileLayout, currentTab, colLayout, tabletLayout, columnGutter, collapseGutter, collapseOrder, topPadding, bottomPadding, leftPadding, rightPadding, topPaddingM, bottomPaddingM, leftPaddingM, rightPaddingM, topMargin, bottomMargin, topMarginM, bottomMarginM, bgColor, bgImg, bgImgAttachment, bgImgSize, bgImgPosition, bgImgRepeat, bgImgID, verticalAlignment, overlayOpacity, overlayBgImg, overlayBgImgAttachment, overlayBgImgID, overlayBgImgPosition, overlayBgImgRepeat, overlayBgImgSize, currentOverlayTab, overlayBlendMode, overlayGradAngle, overlayGradLoc, overlayGradLocSecond, overlayGradType, overlay, overlaySecond, htmlTag, minHeight, maxWidth, bottomSep, bottomSepColor, bottomSepHeight, bottomSepHeightMobile, bottomSepHeightTab, bottomSepWidth, bottomSepWidthMobile, bottomSepWidthTab, topSep, topSepColor, topSepHeight, topSepHeightMobile, topSepHeightTab, topSepWidth, topSepWidthMobile, topSepWidthTab, firstColumnWidth, secondColumnWidth, textColor, linkColor, linkHoverColor, tabletPadding, topMarginT, bottomMarginT, minHeightUnit, maxWidthUnit, marginUnit, columnsUnlocked, tabletBackground, tabletOverlay, mobileBackground, mobileOverlay, columnsInnerHeight, zIndex, backgroundInline, backgroundSettingTab, backgroundSliderCount, backgroundSlider, inheritMaxWidth, backgroundSliderSettings, backgroundVideo, backgroundVideoType, overlaySecondOpacity, overlayFirstOpacity, paddingUnit, align, minHeightTablet, minHeightMobile, bgColorClass, vsdesk, vstablet, vsmobile, loggedInUser, loggedIn, loggedOut, loggedInShow, borderWidth, tabletBorderWidth, mobileBorderWidth, borderRadius, tabletBorderRadius, mobileBorderRadius, border, tabletBorder, mobileBorder } = attributes;
	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== topMargin ? topMargin : '' ), ( undefined !== topMarginT ? topMarginT : '' ), ( undefined !== topMarginM ? topMarginM : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== bottomMargin ? bottomMargin : '' ), ( undefined !== bottomMarginT ? bottomMarginT : '' ), ( undefined !== bottomMarginM ? bottomMarginM : '' ) );
	const previewBackgroundColor = getPreviewSize( previewDevice, ( undefined !== bgColor ? bgColor : '' ), ( undefined !== tabletBackground && tabletBackground[0] && tabletBackground[0].bgColor && tabletBackground[0].enable ? tabletBackground[0].bgColor : '' ), ( undefined !== mobileBackground && mobileBackground[0] && mobileBackground[0].bgColor && mobileBackground[0].enable ? mobileBackground[0].bgColor : '' ) );
	// Border.
	const previewBorderTop = getPreviewSize( previewDevice, ( undefined !== borderWidth ? borderWidth[ 0 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 0 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 0 ] : '' ) );
	const previewBorderRight = getPreviewSize( previewDevice, ( undefined !== borderWidth ? borderWidth[ 1 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 1 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 1 ] : '' ) );
	const previewBorderBottom = getPreviewSize( previewDevice, ( undefined !== borderWidth ? borderWidth[ 2 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 2 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 2 ] : '' ) );
	const previewBorderLeft = getPreviewSize( previewDevice, ( undefined !== borderWidth ? borderWidth[ 3 ] : '' ), ( undefined !== tabletBorderWidth ? tabletBorderWidth[ 3 ] : '' ), ( undefined !== mobileBorderWidth ? mobileBorderWidth[ 3 ] : '' ) );
	const previewRadiusTop = getPreviewSize( previewDevice, ( undefined !== borderRadius ? borderRadius[ 0 ] : '' ), ( undefined !== tabletBorderRadius ? tabletBorderRadius[ 0 ] : '' ), ( undefined !== mobileBorderRadius ? mobileBorderRadius[ 0 ] : '' ) );
	const previewRadiusRight = getPreviewSize( previewDevice, ( undefined !== borderRadius ? borderRadius[ 1 ] : '' ), ( undefined !== tabletBorderRadius ? tabletBorderRadius[ 1 ] : '' ), ( undefined !== mobileBorderRadius ? mobileBorderRadius[ 1 ] : '' ) );
	const previewRadiusBottom = getPreviewSize( previewDevice, ( undefined !== borderRadius ? borderRadius[ 2 ] : '' ), ( undefined !== tabletBorderRadius ? tabletBorderRadius[ 2 ] : '' ), ( undefined !== mobileBorderRadius ? mobileBorderRadius[ 2 ] : '' ) );
	const previewRadiusLeft = getPreviewSize( previewDevice, ( undefined !== borderRadius ? borderRadius[ 3 ] : '' ), ( undefined !== tabletBorderRadius ? tabletBorderRadius[ 3 ] : '' ), ( undefined !== mobileBorderRadius ? mobileBorderRadius[ 3 ] : '' ) );
	const previewBorderColor = getPreviewSize( previewDevice, ( undefined !== border ? border : '' ), ( undefined !== tabletBorder ? tabletBorder : '' ), ( undefined !== mobileBorder ? mobileBorder : '' ) );
	// Background Image.
	let previewBackgroundImage = getPreviewSize( previewDevice, ( bgImg ? `url(${ bgImg })` : undefined ), ( undefined !== tabletBackground && tabletBackground[0] && tabletBackground[0].bgImg && tabletBackground[0].enable ? `url(${ tabletBackground[0].bgImg })` : '' ), ( undefined !== mobileBackground && mobileBackground[0] && mobileBackground[0].bgImg && mobileBackground[0].enable ? `url(${ mobileBackground[0].bgImg })` : '' ) );
	previewBackgroundImage = getPreviewSize(  previewDevice, previewBackgroundImage, ( undefined !== tabletBackground && tabletBackground[0] && tabletBackground[0].forceOverDesk && tabletBackground[0].enable ? 'none' : previewBackgroundImage ), ( undefined !== mobileBackground && mobileBackground[0] && mobileBackground[0].forceOverDesk && mobileBackground[0].enable ? 'none' : previewBackgroundImage ) );
	if ( previewBackgroundImage === 'none' ) {
		previewBackgroundImage = undefined;
	}
	const previewBackgroundSize = getPreviewSize( previewDevice, ( bgImgSize ? bgImgSize : undefined ), ( undefined !== tabletBackground && tabletBackground[0] && tabletBackground[0].bgImgSize && tabletBackground[0].enable ? tabletBackground[0].bgImgSize : '' ), ( undefined !== mobileBackground && mobileBackground[0] && mobileBackground[0].bgImgSize && mobileBackground[0].enable ? mobileBackground[0].bgImgSize : '' ) );
	const previewBackgroundPosition = getPreviewSize( previewDevice, ( bgImgPosition ? bgImgPosition : undefined ), ( undefined !== tabletBackground && tabletBackground[0] && tabletBackground[0].bgImgPosition && tabletBackground[0].enable ? tabletBackground[0].bgImgPosition : '' ), ( undefined !== mobileBackground && mobileBackground[0] && mobileBackground[0].bgImgPosition && mobileBackground[0].enable ? mobileBackground[0].bgImgPosition : '' ) );
	const previewBackgroundRepeat = getPreviewSize( previewDevice, ( bgImgRepeat ? bgImgRepeat : undefined ), ( undefined !== tabletBackground && tabletBackground[0] && tabletBackground[0].bgImgRepeat && tabletBackground[0].enable ? tabletBackground[0].bgImgRepeat : '' ), ( undefined !== mobileBackground && mobileBackground[0] && mobileBackground[0].bgImgRepeat && mobileBackground[0].enable ? mobileBackground[0].bgImgRepeat : '' ) );
	const previewBackgroundAttachment = getPreviewSize( previewDevice, ( bgImgAttachment ? bgImgAttachment : undefined ), ( undefined !== tabletBackground && tabletBackground[0] && tabletBackground[0].bgImgAttachment && tabletBackground[0].enable ? tabletBackground[0].bgImgAttachment : '' ), ( undefined !== mobileBackground && mobileBackground[0] && mobileBackground[0].bgImgAttachment && mobileBackground[0].enable ? mobileBackground[0].bgImgAttachment : '' ) );
	

	const previewBackgroundSettingTab = getPreviewSize( previewDevice, ( backgroundSettingTab ? backgroundSettingTab : 'normal' ), ( undefined !== tabletBackground && tabletBackground[0] && tabletBackground[0].enable ? 'normal' : '' ), ( undefined !== mobileBackground && mobileBackground[0] && mobileBackground[0].enable ? 'normal' : '' ) );

	function CustomNextArrow( props ) {
		const { className, style, onClick } = props;
		return (
			<button
				className={ className }
				style={ { ...style, display: 'block' } }
				onClick={ onClick }
			>
				<Dashicon icon="arrow-right-alt2" />
			</button>
		);
	}

	function CustomPrevArrow( props ) {
		const { className, style, onClick } = props;
		return (
			<button
				className={ className }
				style={ { ...style, display: 'block' } }
				onClick={ onClick }
			>
				<Dashicon icon="arrow-left-alt2" />
			</button>
		);
	}
	const sliderSettings = {
		dots: ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && backgroundSliderSettings[ 0 ].dotStyle === 'none' ? false : true ),
		arrows: ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && backgroundSliderSettings[ 0 ].arrowStyle !== 'none' ? true : false ),
		infinite: true,
		fade: ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].fade ? backgroundSliderSettings[ 0 ].fade : true ),
		speed: ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].tranSpeed ? backgroundSliderSettings[ 0 ].tranSpeed : 400 ),
		draggable: false,
		autoplaySpeed: ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].speed ? backgroundSliderSettings[ 0 ].speed : 7000 ),
		autoplay: ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].autoPlay ? backgroundSliderSettings[ 0 ].autoPlay : true ),
		slidesToShow: 1,
		slidesToScroll: 1,
		nextArrow: <CustomNextArrow />,
		prevArrow: <CustomPrevArrow />,
	};
	const renderSliderImages = ( index ) => {
		return (
			<div className="kb-bg-slide-contain">
				<div className={ `kb-bg-slide kb-bg-slide-${ index }` } style={ {
					backgroundColor: ( undefined !== backgroundSlider && undefined !== backgroundSlider[ index ] && undefined !== backgroundSlider[ index ].bgColor ? KadenceColorOutput( backgroundSlider[ index ].bgColor ) : undefined ),
					backgroundImage: ( undefined !== backgroundSlider && undefined !== backgroundSlider[ index ] && undefined !== backgroundSlider[ index ].bgImg ? 'url("' + backgroundSlider[ index ].bgImg + '")' : undefined ),
					backgroundSize: bgImgSize,
					backgroundPosition: bgImgPosition,
					backgroundRepeat: bgImgRepeat,
				} }></div>
			</div>
		);
	};
	const blockProps = useBlockProps( {
		className: backgroundClasses,
		style: { 
			marginBottom: previewMarginBottom + marginUnit,
			marginTop: previewMarginTop + marginUnit,
			borderColor: ( previewBorderColor ? KadenceColorOutput( previewBorderColor ) : undefined ),
			borderTopWidth: ( previewBorderTop ? previewBorderTop + 'px' : undefined ),
			borderRightWidth: ( previewBorderRight ? previewBorderRight + 'px' : undefined ),
			borderBottomWidth: ( previewBorderBottom ? previewBorderBottom + 'px' : undefined ),
			borderLeftWidth: ( previewBorderLeft ? previewBorderLeft + 'px' : undefined ),
			borderTopLeftRadius: ( previewRadiusTop ? previewRadiusTop + 'px' : undefined ),
			borderTopRightRadius: ( previewRadiusRight ? previewRadiusRight + 'px' : undefined ),
			borderBottomRightRadius: ( previewRadiusBottom ? previewRadiusBottom + 'px' : undefined ),
			borderBottomLeftRadius: ( previewRadiusLeft ? previewRadiusLeft + 'px' : undefined ),
			minHeight: minHeight + minHeightUnit,
			zIndex: ( zIndex ? zIndex : undefined ),
		 },
		'data-align': ( 'full' === align || 'wide' === align || 'center' === align ? align : undefined ),
	} );
	return (
		<div { ...blockProps }>
			{ ( 'slider' !== previewBackgroundSettingTab && 'video' !== previewBackgroundSettingTab ) && (
				<div className={ `kt-row-layout-background${ previewBackgroundImage && previewBackgroundAttachment === 'parallax' ? ' kt-jarallax' : '' }` } data-bg-img-id={ bgImgID } style={ {
					backgroundColor: ( previewBackgroundColor ? KadenceColorOutput( previewBackgroundColor ) : undefined ),
					backgroundImage: ( previewBackgroundImage ? previewBackgroundImage : undefined ),
					backgroundSize: ( previewBackgroundSize ? previewBackgroundSize : undefined ),
					backgroundPosition: ( previewBackgroundPosition ? previewBackgroundPosition : undefined ),
					backgroundRepeat: ( previewBackgroundRepeat ? previewBackgroundRepeat : undefined ),
				} }></div>
			) }
			{ ( 'slider' === previewBackgroundSettingTab ) && (
				<div className={ `kt-blocks-carousel kb-blocks-bg-slider kt-carousel-container-dotstyle-${ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].dotStyle ? backgroundSliderSettings[ 0 ].dotStyle : 'dark' ) }` }>
					{ backgroundSliderCount !== 1 && (
						<Slider className={ `kt-carousel-arrowstyle-${ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].arrowStyle ? backgroundSliderSettings[ 0 ].arrowStyle : 'none' ) } kt-carousel-dotstyle-${ ( backgroundSliderSettings && backgroundSliderSettings[ 0 ] && undefined !== backgroundSliderSettings[ 0 ].dotStyle ? backgroundSliderSettings[ 0 ].dotStyle : 'dark' ) }` } { ...sliderSettings }>
							{ times( backgroundSliderCount, n => renderSliderImages( n ) ) }
						</Slider>
					) }
					{ ( undefined !== backgroundSliderCount ? backgroundSliderCount : 1 ) === 1 && (
						times( ( undefined !== backgroundSliderCount ? backgroundSliderCount : 1 ), n => renderSliderImages( n ) )
					) }
				</div>
			) }
			{ ( 'video' === previewBackgroundSettingTab ) && (
				<div className={ 'kb-blocks-bg-video-container' } style={ { backgroundColor: ( previewBackgroundColor ? KadenceColorOutput( previewBackgroundColor ) : undefined ) } }>
					{ ( undefined === backgroundVideoType || 'local' === backgroundVideoType ) && (
						<video className="kb-blocks-bg-video" playsinline="" loop="" src={ ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].local ? backgroundVideo[ 0 ].local : undefined ) }></video>
					) }
					{ ( 'youtube' === backgroundVideoType ) && (
						<div className="kb-blocks-bg-video" style={ { backgroundImage: `url(https://img.youtube.com/vi/${ backgroundVideo[ 0 ].youtube }/maxresdefault.jpg)` } }></div>
					) }
				</div>
			) }
			{ children }
		</div>
	);
}
export default RowBackground;
