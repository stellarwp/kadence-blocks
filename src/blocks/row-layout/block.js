/**
 * BLOCK: Kadence Row / Layout
 */

/**
 * Import Icons
 */
import icons from '../../icons';
/**
 * Import attributes
 */
import attributes from './attributes';
/**
 * Import edit
 */
import edit from './edit';
/**
 * Import save
 */
import save from './save';

import classnames from 'classnames';
const {
	Fragment,
} = wp.element;
const {
	InnerBlocks,
} = wp.editor;

/**
 * Import Css
 */
import './style.scss';
import './editor.scss';

/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/rowlayout', {
	title: __( 'Row Layout' ), // Block title.
	icon: {
		src: icons.blockRow,
	},
	category: 'kadence-blocks',
	keywords: [
		__( 'row' ),
		__( 'layout' ),
		__( 'KT' ),
	],
	supports: {
		anchor: true,
	},
	attributes,
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,

	save,
	deprecated: [
		{
			attributes: {
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
					type: 'string',
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
					type: 'string',
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
			},
			save: ( { attributes } ) => {
				const { columns, blockAlignment, mobileLayout, currentOverlayTab, overlayBgImg, overlay, colLayout, tabletLayout, collapseOrder, uniqueID, columnGutter, bgColor, bgImg, verticalAlignment, htmlTag, bottomSep, bottomSepColor, topSep, topSepColor } = attributes;
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
				const layoutClass = ( ! colLayout ? 'equal' : colLayout );
				const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
				const HtmlTagOut = ( ! htmlTag ? 'div' : htmlTag );
				const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
				const classId = ( ! uniqueID ? 'notset' : uniqueID );
				const hasBG = ( bgColor || bgImg || overlay || overlayBgImg ? 'kt-row-has-bg' : '' );
				const overlayType = ( ! currentOverlayTab || 'grad' !== currentOverlayTab ? 'normal' : 'gradient' );
				const classes = classnames( `align${ blockAlignment }` );
				const innerClasses = classnames( `kt-row-layout-inner ${ hasBG } kt-layout-id${ classId }` );
				const innerColumnClasses = classnames( `kt-row-column-wrap kt-has-${ columns }-columns kt-gutter-${ columnGutter } kt-row-valign-${ verticalAlignment } kt-row-layout-${ layoutClass } kt-tab-layout-${ tabLayoutClass } kt-m-colapse-${ collapseOrder } kt-mobile-layout-${ mobileLayoutClass }` );

				return (
					<HtmlTagOut className={ classes }>
						<div id={ `kt-layout-id${ uniqueID }` } className={ innerClasses }>
							{ ( overlay || overlayBgImg ) && (
								<div className={ `kt-row-layout-overlay kt-row-overlay-${ overlayType }` }></div>
							) }
							{ topSep && 'none' !== topSep && (
								<div className={ `kt-row-layout-top-sep kt-row-sep-type-${ topSep }` }>
									<svg style={ { fill: topSepColor } } viewBox="0 0 1000 100" preserveAspectRatio="none">
										{ topSVGDivider }
									</svg>
								</div>
							) }
							<div className={ innerColumnClasses }>
								<InnerBlocks.Content />
							</div>
							{ bottomSep && 'none' !== bottomSep && (
								<div className={ `kt-row-layout-bottom-sep kt-row-sep-type-${ bottomSep }` }>
									<svg style={ { fill: bottomSepColor } } viewBox="0 0 1000 100" preserveAspectRatio="none">
										{ bottomSVGDivider }
									</svg>
								</div>
							) }
						</div>
					</HtmlTagOut>
				);
			},
		},
	],
} );
