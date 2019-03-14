/**
 * BLOCK: Kadence Row / Layout
 */

import classnames from 'classnames';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
} = wp.editor;

class KadenceRowLayoutSave extends Component {
	render() {
		const { attributes: { columns, blockAlignment, mobileLayout, currentOverlayTab, overlayBgImg, overlay, colLayout, tabletLayout, collapseOrder, uniqueID, columnGutter, collapseGutter, bgColor, bgImg, verticalAlignment, htmlTag, bottomSep, bottomSepColor, topSep, topSepColor, firstColumnWidth, secondColumnWidth, overlayBgImgAttachment, bgImgAttachment } } = this.props;
		let bottomSVGDivider;
		if ( 'ct' === bottomSep ) {
			bottomSVGDivider = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
		} else if ( 'cti' === bottomSep ) {
			bottomSVGDivider = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
		} else if ( 'ctd' === bottomSep ) {
			bottomSVGDivider = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
		} else if ( 'ctdi' === bottomSep ) {
			bottomSVGDivider = <Fragment><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></Fragment>;
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
			bottomSVGDivider = <Fragment><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
		} else if ( 'wavesi' === bottomSep ) {
			bottomSVGDivider = <Fragment><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
		} else if ( 'mtns' === bottomSep ) {
			bottomSVGDivider = <Fragment><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></Fragment>;
		} else if ( 'littri' === bottomSep ) {
			bottomSVGDivider = <path d="M500,2l25,98l-50,0l25,-98Z" />;
		} else if ( 'littrii' === bottomSep ) {
			bottomSVGDivider = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
		}
		let topSVGDivider;
		if ( 'ct' === topSep ) {
			topSVGDivider = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
		} else if ( 'cti' === topSep ) {
			topSVGDivider = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
		} else if ( 'ctd' === topSep ) {
			topSVGDivider = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
		} else if ( 'ctdi' === topSep ) {
			topSVGDivider = <Fragment><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></Fragment>;
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
			topSVGDivider = <Fragment><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
		} else if ( 'wavesi' === topSep ) {
			topSVGDivider = <Fragment><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
		} else if ( 'mtns' === topSep ) {
			topSVGDivider = <Fragment><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></Fragment>;
		} else if ( 'littri' === topSep ) {
			topSVGDivider = <path d="M500,2l25,98l-50,0l25,-98Z" />;
		} else if ( 'littrii' === topSep ) {
			topSVGDivider = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
		}
		const firstColumnClass = ( firstColumnWidth && ( 2 === columns || 3 === columns ) ? ' kt-custom-first-width-' + firstColumnWidth : '' );
		const secondColumnClass = ( secondColumnWidth && ( 2 === columns || 3 === columns ) ? ' kt-custom-second-width-' + secondColumnWidth : '' );
		const thirdColumnClass = ( secondColumnWidth && firstColumnWidth && 3 === columns ? ' kt-custom-third-width-' + ( Math.round( ( 100 - ( firstColumnWidth + secondColumnWidth ) ) * 10 ) / 10 ) : '' );
		const layoutClass = ( ! colLayout ? 'equal' : colLayout );
		const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		const HtmlTagOut = ( ! htmlTag ? 'div' : htmlTag );
		const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		const classId = ( ! uniqueID ? 'notset' : uniqueID );
		const hasBG = ( bgColor || bgImg || overlay || overlayBgImg ? 'kt-row-has-bg' : '' );
		const overlayType = ( ! currentOverlayTab || 'grad' !== currentOverlayTab ? 'normal' : 'gradient' );
		const classes = classnames( `align${ ( blockAlignment ? blockAlignment : 'none' ) }` );
		const innerClasses = classnames( `kt-row-layout-inner ${ hasBG } kt-layout-id${ classId }${ bgImg && bgImgAttachment === 'parallax' ? ' kt-jarallax' : '' }` );
		const innerColumnClasses = classnames( `kt-row-column-wrap kt-has-${ columns }-columns kt-gutter-${ columnGutter } kt-v-gutter-${ ( collapseGutter ? collapseGutter : 'default' ) } kt-row-valign-${ verticalAlignment } kt-row-layout-${ layoutClass } kt-tab-layout-${ tabLayoutClass } kt-m-colapse-${ collapseOrder } kt-mobile-layout-${ mobileLayoutClass }${ firstColumnClass }${ secondColumnClass }${ thirdColumnClass }` );

		return (
			<HtmlTagOut className={ classes }>
				<div id={ `kt-layout-id${ uniqueID }` } className={ innerClasses }>
					{ ( overlay || overlayBgImg ) && (
						<div className={ `kt-row-layout-overlay kt-row-overlay-${ overlayType }${ overlayBgImg && 'gradient' !== overlayType && overlayBgImgAttachment === 'parallax' ? ' kt-jarallax' : '' }` }></div>
					) }
					{ topSep && 'none' !== topSep && '' !== topSep && (
						<div className={ `kt-row-layout-top-sep kt-row-sep-type-${ topSep }` }>
							<svg style={ { fill: topSepColor } } viewBox="0 0 1000 100" preserveAspectRatio="none">
								{ topSVGDivider }
							</svg>
						</div>
					) }
					<div className={ innerColumnClasses }>
						<InnerBlocks.Content />
					</div>
					{ bottomSep && 'none' !== bottomSep && '' !== bottomSep && (
						<div className={ `kt-row-layout-bottom-sep kt-row-sep-type-${ bottomSep }` }>
							<svg style={ { fill: bottomSepColor } } viewBox="0 0 1000 100" preserveAspectRatio="none">
								{ bottomSVGDivider }
							</svg>
						</div>
					) }
				</div>
			</HtmlTagOut>
		);
	}
}
export default KadenceRowLayoutSave;
