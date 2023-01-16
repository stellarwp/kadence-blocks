/**
 * BLOCK: Kadence Row / Layout
 */

import classnames from 'classnames';
import { times } from 'lodash';
import { KadenceColorOutput } from '@kadence/helpers';
import { __ } from '@wordpress/i18n';
import { useBlockProps } from "@wordpress/block-editor";
import {
	InnerBlocks,
	getColorClassName,
} from '@wordpress/block-editor';

/**
 * Build the row edit
 */
 function RowLayoutSave( {
	attributes,
} ) {
	const { columns, blockAlignment, inheritMaxWidth, align, mobileLayout, currentOverlayTab, overlayBgImg, overlay, colLayout, tabletLayout, collapseOrder, uniqueID, columnGutter, collapseGutter, bgColor, bgImg, verticalAlignment, htmlTag, bottomSep, bottomSepColor, topSep, topSepColor, firstColumnWidth, secondColumnWidth, overlayBgImgAttachment, bgImgAttachment, columnsInnerHeight, backgroundInline, backgroundSettingTab, backgroundSliderCount, backgroundSliderSettings, backgroundSlider, bgImgSize, bgImgPosition, bgImgRepeat, backgroundVideoType, backgroundVideo, bgColorClass, vsdesk, vstablet, vsmobile, tabletOverlay, mobileOverlay } = attributes;
	let bottomSVGDivider;
	if ( 'ct' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
	} else if ( 'cti' === bottomSep ) {
		bottomSVGDivider = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
	} else if ( 'ctd' === bottomSep ) {
		bottomSVGDivider = <><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></>;
	} else if ( 'ctdi' === bottomSep ) {
		bottomSVGDivider = <><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></>;
	} else if ( 'sltl' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,0l-1000,100l1000,0l0,-100Z" />;
	} else if ( 'sltli' === bottomSep ) {
		bottomSVGDivider = <path d="M0,100l1000,-100l-1000,0l0,100Z" />;
	} else if ( 'sltr' === bottomSep ) {
		bottomSVGDivider = <path d="M0,0l1000,100l-1000,0l0,-100Z" />;
	} else if ( 'sltri' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,100l-1000,-100l1000,0l0,100Z" />;
	} else if ( 'crv' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />;
	} else if ( 'crvi' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />;
	} else if ( 'crvl' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />;
	} else if ( 'crvli' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />;
	} else if ( 'crvr' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />;
	} else if ( 'crvri' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />;
	} else if ( 'wave' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />;
	} else if ( 'wavei' === bottomSep ) {
		bottomSVGDivider = <path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />;
	} else if ( 'waves' === bottomSep ) {
		bottomSVGDivider = <><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></>;
	} else if ( 'wavesi' === bottomSep ) {
		bottomSVGDivider = <><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></>;
	} else if ( 'mtns' === bottomSep ) {
		bottomSVGDivider = <><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></>;
	} else if ( 'littri' === bottomSep ) {
		bottomSVGDivider = <path d="M500,2l25,98l-50,0l25,-98Z" />;
	} else if ( 'littrii' === bottomSep ) {
		bottomSVGDivider = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
	} else if ( 'threelevels' === bottomSep ) {
		bottomSVGDivider = <><path style={ { opacity: 0.33 } } d="M0 95L1000 0v100H0v-5z"></path><path style={ { opacity: 0.66 } } d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path></>;
	} else if ( 'threelevelsi' === bottomSep ) {
		bottomSVGDivider = <><path style={ { opacity: 0.33 } } d="M1000 95L0 0v100h1000v-5z"></path><path style={ { opacity: 0.66 } } d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path></>;
	}
	let topSVGDivider;
	if ( 'ct' === topSep ) {
		topSVGDivider = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
	} else if ( 'cti' === topSep ) {
		topSVGDivider = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
	} else if ( 'ctd' === topSep ) {
		topSVGDivider = <><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></>;
	} else if ( 'ctdi' === topSep ) {
		topSVGDivider = <><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></>;
	} else if ( 'sltl' === topSep ) {
		topSVGDivider = <path d="M1000,0l-1000,100l1000,0l0,-100Z" />;
	} else if ( 'sltli' === topSep ) {
		topSVGDivider = <path d="M0,100l1000,-100l-1000,0l0,100Z" />;
	} else if ( 'sltr' === topSep ) {
		topSVGDivider = <path d="M0,0l1000,100l-1000,0l0,-100Z" />;
	} else if ( 'sltri' === topSep ) {
		topSVGDivider = <path d="M1000,100l-1000,-100l1000,0l0,100Z" />;
	} else if ( 'crv' === topSep ) {
		topSVGDivider = <path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />;
	} else if ( 'crvi' === topSep ) {
		topSVGDivider = <path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />;
	} else if ( 'crvl' === topSep ) {
		topSVGDivider = <path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />;
	} else if ( 'crvli' === topSep ) {
		topSVGDivider = <path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />;
	} else if ( 'crvr' === topSep ) {
		topSVGDivider = <path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />;
	} else if ( 'crvri' === topSep ) {
		topSVGDivider = <path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />;
	} else if ( 'wave' === topSep ) {
		topSVGDivider = <path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />;
	} else if ( 'wavei' === topSep ) {
		topSVGDivider = <path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />;
	} else if ( 'waves' === topSep ) {
		topSVGDivider = <><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></>;
	} else if ( 'wavesi' === topSep ) {
		topSVGDivider = <><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></>;
	} else if ( 'mtns' === topSep ) {
		topSVGDivider = <><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></>;
	} else if ( 'littri' === topSep ) {
		topSVGDivider = <path d="M500,2l25,98l-50,0l25,-98Z" />;
	} else if ( 'littrii' === topSep ) {
		topSVGDivider = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
	} else if ( 'threelevels' === topSep ) {
		topSVGDivider = <><path style={ { opacity: 0.33 } } d="M0 95L1000 0v100H0v-5z"></path><path style={ { opacity: 0.66 } } d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path></>;
	} else if ( 'threelevelsi' === topSep ) {
		topSVGDivider = <><path style={ { opacity: 0.33 } } d="M1000 95L0 0v100h1000v-5z"></path><path style={ { opacity: 0.66 } } d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path></>;
	}
	const firstColumnClass = ( firstColumnWidth && ( 2 === columns || 3 === columns ) ? ' kt-custom-first-width-' + firstColumnWidth : '' );
	const secondColumnClass = ( secondColumnWidth && ( 2 === columns || 3 === columns ) ? ' kt-custom-second-width-' + secondColumnWidth : '' );
	const thirdColumnClass = ( secondColumnWidth && firstColumnWidth && 3 === columns ? ' kt-custom-third-width-' + ( Math.round( ( 100 - ( parseFloat( firstColumnWidth ) + parseFloat( secondColumnWidth ) ) ) * 10 ) / 10 ) : '' );
	const layoutClass = ( ! colLayout ? 'equal' : colLayout );
	const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
	const HtmlTagOut = ( ! htmlTag ? 'div' : htmlTag );
	const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
	const classId = ( ! uniqueID ? 'notset' : uniqueID );
	const overlayType = ( ! currentOverlayTab || 'grad' !== currentOverlayTab ? 'normal' : 'gradient' );
	//const classes = classnames( `align${ ( align ? align : 'none' ) }` );
	const classes = classnames( {
		'wp-block-kadence-rowlayout': true,
		[ `align${ ( align ? align : 'none' ) }` ]: true,
		'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		'kvs-md-false': vstablet !== 'undefined' && vstablet,
		'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
	} );
	const blockProps = useBlockProps.save( {
		className: classes,
	} );
	const backgroundColorClass = getColorClassName( 'background-color', bgColorClass );
	const innerClasses = classnames( 'kt-row-layout-inner', {
		'kt-row-has-bg': bgColor || bgImg || overlay || overlayBgImg,
		[ 'kt-layout-id' + classId ]: classId,
		'kt-jarallax': bgImg && bgImgAttachment === 'parallax',
		[ backgroundColorClass ]: backgroundColorClass,
	} );
	//const innerColumnClasses = classnames( `kt-row-column-wrap kt-has-${ columns }-columns kt-gutter-${ columnGutter } kt-v-gutter-${ ( collapseGutter ? collapseGutter : 'default' ) } kt-row-valign-${ verticalAlignment } kt-row-layout-${ layoutClass } kt-tab-layout-${ tabLayoutClass } kt-m-colapse-${ collapseOrder } kt-mobile-layout-${ mobileLayoutClass }${ firstColumnClass }${ secondColumnClass }${ thirdColumnClass }${ ( undefined !== columnsInnerHeight && true === columnsInnerHeight ? ' kt-inner-column-height-full' : '' ) }` );
	const innerColumnClasses = classnames( {
		'kt-row-column-wrap': true,
		[ `kt-has-${ columns }-columns` ]: columns,
		[ `kt-gutter-${ columnGutter }`]: columnGutter,
		[ `kt-v-gutter-${ ( collapseGutter ? collapseGutter : 'default' ) }`]: true,
		[ `kt-row-valign-${ verticalAlignment }`]: verticalAlignment,
		[ `kt-row-layout-${ layoutClass }` ]: layoutClass,
		[ `kt-tab-layout-${ tabLayoutClass }` ]: tabLayoutClass,
		[ `kt-m-colapse-${ collapseOrder }` ]: collapseOrder,
		[ `kt-mobile-layout-${ mobileLayoutClass }` ]: mobileLayoutClass,
		[ firstColumnClass ]: firstColumnClass,
		[ secondColumnClass ]: secondColumnClass,
		[ thirdColumnClass ]: thirdColumnClass,
		'kt-inner-column-height-full': ( undefined !== columnsInnerHeight && true === columnsInnerHeight ),
		'kb-theme-content-width': inheritMaxWidth,
	} );
	let hasOverlay = ( overlay || overlayBgImg ? true : false );
	if ( ! hasOverlay ) {
		hasOverlay = ( tabletOverlay && tabletOverlay[0] && tabletOverlay[0].enable ? true : false );
	}
	if ( ! hasOverlay ) {
		hasOverlay = ( mobileOverlay && mobileOverlay[0] && mobileOverlay[0].enable ? true : false );
	}
	const renderSliderImages = ( index ) => {
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
			<div className="kb-bg-slide-contain">
				<div className={ `kb-bg-slide kb-bg-slide-${ index }` } style={ {
					backgroundColor: ( bgSlider[ index ] && '' !== bgSlider[ index ].bgColor ? KadenceColorOutput( bgSlider[ index ].bgColor ) : undefined ),
					backgroundImage: ( bgSlider[ index ] && '' !== bgSlider[ index ].bgImg ? 'url(' + bgSlider[ index ].bgImg + ')' : undefined ),
					backgroundSize: bgImgSize ? bgImgSize : undefined,
					backgroundPosition: bgImgPosition ? bgImgPosition : undefined,
					backgroundRepeat: bgImgRepeat ? bgImgRepeat : undefined,
				} }></div>
			</div>
		);
	};
	const renderSlider = () => {
		let bgSliderSettings;
		if ( undefined === backgroundSliderSettings || ( undefined !== backgroundSliderSettings && undefined === backgroundSliderSettings[ 0 ] ) ) {
			bgSliderSettings = [ {
				arrowStyle: 'none',
				dotStyle: 'dark',
				autoPlay: true,
				speed: 7000,
				fade: true,
				tranSpeed: 400,
			} ];
		} else {
			bgSliderSettings = backgroundSliderSettings;
		}
		return (
			<div className={ `kt-blocks-carousel kt-carousel-container-dotstyle-${ bgSliderSettings[ 0 ].dotStyle } kt-carousel-container-arrowstyle-${bgSliderSettings[ 0 ].arrowStyle} kb-blocks-bg-slider ` }>
				<div className={ `kt-blocks-carousel-init kb-blocks-bg-slider-init kt-carousel-arrowstyle-${ bgSliderSettings[ 0 ].arrowStyle } kt-carousel-dotstyle-${ bgSliderSettings[ 0 ].dotStyle }` }
					 data-slider-anim-speed={ bgSliderSettings[ 0 ].tranSpeed } data-slider-type="slider" 
					 data-slider-scroll="1" data-slider-arrows={ ( 'none' === bgSliderSettings[ 0 ].arrowStyle ? false : true ) } data-slider-fade={ bgSliderSettings[ 0 ].fade } data-slider-dots={ ( 'none' === bgSliderSettings[ 0 ].dotStyle ? false : true ) } 
					 data-slider-hover-pause="false" data-slider-auto={ bgSliderSettings[ 0 ].autoPlay } data-slider-speed={ bgSliderSettings[ 0 ].speed }>
					{ times( ( undefined !== backgroundSliderCount ? backgroundSliderCount : 1 ), n => renderSliderImages( n ) ) }
				</div>
			</div>
		);
	};
	const renderVideo = () => {
		const bgVideo = ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].local ? backgroundVideo : [ {
			youTube: '',
			local: '',
			localID: '',
			vimeo: '',
			ratio: '16/9',
			btns: false,
			loop: true,
			mute: true,
		} ] );
		return (
			<>
				<video className="kb-blocks-bg-video" poster={ ( undefined !== bgImg && '' !== bgImg ? bgImg : undefined ) } playsinline="" autoplay="" muted={ ( false === bgVideo[ 0 ].mute ? false : '' ) } loop={ ( false === bgVideo[ 0 ].loop ? false : '' ) } src={ bgVideo[ 0 ].local }></video>
				{ true === bgVideo[ 0 ].btns && (
					<div className="kb-background-video-buttons-wrapper kb-background-video-buttons-html5">
						<button className="kb-background-video-play kb-toggle-video-btn" aria-label={ __( 'Play', 'kadence-blocks' ) } aria-hidden="true" style="display: none;"><svg viewBox="0 0 448 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></button>
						<button className="kb-background-video-pause kb-toggle-video-btn" aria-label={ __( 'Pause', 'kadence-blocks' ) } aria-hidden="false"><svg viewBox="0 0 448 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path></svg></button>
						{ false === bgVideo[ 0 ].mute && (
							<>
								<button className="kb-background-video-unmute kb-toggle-video-btn" aria-label={ __( 'Unmute', 'kadence-blocks' ) } aria-hidden="true" style="display: none;"><svg viewBox="0 0 256 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971z"></path></svg></button>
								<button className="kb-background-video-mute kb-toggle-video-btn" aria-label={ __( 'Mute', 'kadence-blocks' ) } aria-hidden="false"><svg viewBox="0 0 576 512" height="16" width="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971zm182.056-77.876C422.982.92 403.283 5.668 394.061 20.745c-9.221 15.077-4.473 34.774 10.604 43.995C468.967 104.063 512 174.983 512 256c0 73.431-36.077 142.292-96.507 184.206-14.522 10.072-18.129 30.01-8.057 44.532 10.076 14.528 30.016 18.126 44.531 8.057C529.633 438.927 576 350.406 576 256c0-103.244-54.579-194.877-137.944-245.859zM480 256c0-68.547-36.15-129.777-91.957-163.901-15.076-9.22-34.774-4.471-43.994 10.607-9.22 15.078-4.471 34.774 10.607 43.994C393.067 170.188 416 211.048 416 256c0 41.964-20.62 81.319-55.158 105.276-14.521 10.073-18.128 30.01-8.056 44.532 6.216 8.96 16.185 13.765 26.322 13.765a31.862 31.862 0 0 0 18.21-5.709C449.091 377.953 480 318.938 480 256zm-96 0c0-33.717-17.186-64.35-45.972-81.944-15.079-9.214-34.775-4.463-43.992 10.616s-4.464 34.775 10.615 43.992C314.263 234.538 320 244.757 320 256a32.056 32.056 0 0 1-13.802 26.332c-14.524 10.069-18.136 30.006-8.067 44.53 10.07 14.525 30.008 18.136 44.53 8.067C368.546 316.983 384 287.478 384 256z"></path></svg></button>
							</>
						) }
					</div>
				) }
			</>
		);
	};
	// return (
	// 	<HtmlTagOut { ...blockProps }>
	// 		<div id={ `kt-layout-id${ uniqueID }` } className={ innerClasses } style={ {
	// 			backgroundImage: ( 'slider' !== backgroundSettingTab && 'video' !== backgroundSettingTab && backgroundInline && undefined !== bgImg && '' !== bgImg ? 'url(' + bgImg + ')' : undefined ),
	// 		} }>
	// 			{ ( 'slider' === backgroundSettingTab ) && (
	// 				renderSlider()
	// 			) }
	// 			{ ( 'video' === backgroundSettingTab ) && (
	// 				<div className={ 'kb-blocks-bg-video-container' }>
	// 					{ ( undefined === backgroundVideoType || '' === backgroundVideoType || 'local' === backgroundVideoType ) && (
	// 						renderVideo()
	// 					) }
	// 				</div>
	// 			) }
	// 			{ hasOverlay && (
	// 				<div className={ `kt-row-layout-overlay kt-row-overlay-${ overlayType }${ overlayBgImg && 'gradient' !== overlayType && overlayBgImgAttachment === 'parallax' ? ' kt-jarallax' : '' }` }></div>
	// 			) }
	// 			{ topSep && 'none' !== topSep && '' !== topSep && (
	// 				<div className={ `kt-row-layout-top-sep kt-row-sep-type-${ topSep }` }>
	// 					<svg style={ { fill: KadenceColorOutput( topSepColor ) } } viewBox="0 0 1000 100" preserveAspectRatio="none">
	// 						{ topSVGDivider }
	// 					</svg>
	// 				</div>
	// 			) }
	// 			<div className={ innerColumnClasses }>
	// 				<InnerBlocks.Content />
	// 			</div>
	// 			{ bottomSep && 'none' !== bottomSep && '' !== bottomSep && (
	// 				<div className={ `kt-row-layout-bottom-sep kt-row-sep-type-${ bottomSep }` }>
	// 					<svg style={ { fill: KadenceColorOutput( bottomSepColor ) } } viewBox="0 0 1000 100" preserveAspectRatio="none">
	// 						{ bottomSVGDivider }
	// 					</svg>
	// 				</div>
	// 			) }
	// 		</div>
	// 	</HtmlTagOut>
	// );
	return <InnerBlocks.Content />;
}
export default RowLayoutSave;
