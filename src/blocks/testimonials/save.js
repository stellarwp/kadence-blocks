/**
 * BLOCK: Kadence Testimonials
 */

import { KadenceColorOutput } from '@kadence/helpers';
import {
	RichText,
	useBlockProps,
	InnerBlocks
} from '@wordpress/block-editor';
/**
 * External dependencies
 */
import { IconSpanTag } from '@kadence/components';
/**
 * External dependencies
 */
import { times } from 'lodash';
import classnames from 'classnames';

function Save( { attributes } ) {
	// const {
	// 	uniqueID,
	// 	style,
	// 	hAlign,
	// 	layout,
	// 	itemsCount,
	// 	containerBackground,
	// 	containerBorder,
	// 	containerBorderWidth,
	// 	containerBorderRadius,
	// 	containerPadding,
	// 	mediaStyles,
	// 	displayTitle,
	// 	titleFont,
	// 	displayContent,
	// 	displayName,
	// 	displayMedia,
	// 	displayShadow,
	// 	shadow,
	// 	displayRating,
	// 	ratingStyles,
	// 	displayOccupation,
	// 	containerBackgroundOpacity,
	// 	containerBorderOpacity,
	// 	containerMaxWidth,
	// 	columnGap,
	// 	autoPlay,
	// 	autoSpeed,
	// 	transSpeed,
	// 	slidesScroll,
	// 	arrowStyle,
	// 	dotStyle,
	// 	columns,
	// 	displayIcon,
	// 	iconStyles,
	// 	containerVAlign,
	// 	containerPaddingType,
	// } = attributes;


	// const blockProps = useBlockProps.save( {
	// 	className: classnames( {
	// 		[ `wp-block-kadence-testimonials` ]                                                                       : true,
	// 		[ `kt-testimonial-halign-${hAlign}` ]                                                                     : true,
	// 		[ `kt-testimonial-style-${style}` ]                                                                       : true,
	// 		[ `kt-testimonials-media-${( displayMedia ? 'on' : 'off' )}` ]                                            : true,
	// 		[ `kt-testimonials-icon-${( displayIcon ? 'on' : 'off' )}` ]                                              : true,
	// 		[ `kt-testimonial-columns-${columns[ 0 ]}` ]                                                              : true,
	// 		[ `kt-t-xxl-col-${columns[ 0 ]}` ]                                                                        : true,
	// 		[ `kt-t-xl-col-${columns[ 1 ]}` ]                                                                         : true,
	// 		[ `kt-t-lg-col-${columns[ 2 ]}` ]                                                                         : true,
	// 		[ `kt-t-md-col-${columns[ 3 ]}` ]                                                                         : true,
	// 		[ `kt-t-sm-col-${columns[ 4 ]}` ]                                                                         : true,
	// 		[ `kt-t-xs-col-${columns[ 5 ]}` ]                                                                         : true,
	// 		[ `kt-blocks-testimonials-wrap${uniqueID}` ]: true,
	// 	} )
	// } );

	// return (
	// 	<div {...blockProps}>
	// 		{layout && layout === 'carousel' && (
	// 			<div className={`kt-blocks-carousel kt-carousel-container-dotstyle-${dotStyle} kt-carousel-container-arrowstyle-${arrowStyle}`}>
	// 				<div className={`kt-blocks-carousel-init kt-carousel-arrowstyle-${arrowStyle} kt-carousel-dotstyle-${dotStyle}`} data-columns-xxl={columns[ 0 ]} data-columns-xl={columns[ 1 ]}
	// 					 data-columns-md={columns[ 2 ]} data-columns-sm={columns[ 3 ]} data-columns-xs={columns[ 4 ]} data-columns-ss={columns[ 5 ]} data-slider-anim-speed={transSpeed}
	// 					 data-slider-scroll={slidesScroll} data-slider-arrows={( 'none' === arrowStyle ? false : true )} data-slider-dots={( 'none' === dotStyle ? false : true )}
	// 					 data-slider-hover-pause="false" data-slider-auto={autoPlay} data-slider-speed={autoSpeed}>
	// 					<InnerBlocks.Content/>
	// 				</div>
	// 			</div>
	// 		)}
	// 		{layout && layout !== 'carousel' && (
	// 			<div className={'kt-testimonial-grid-wrap'} style={{
	// 				'grid-row-gap'   : columnGap + 'px',
	// 				'grid-column-gap': columnGap + 'px',
	// 			}}>
	// 				<InnerBlocks.Content/>
	// 			</div>
	// 		)}
	// 	</div>
	// );
	return <InnerBlocks.Content />;

}

export default Save;
