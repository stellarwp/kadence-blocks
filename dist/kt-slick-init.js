/**
 * Init Slick Slider on jquery.
 */
jQuery( document ).ready( function( $ ) {
	/**
	 * init Slick Slider
	 *
	 * @param {object} container the slider container.
	 */
	function kbSlickSliderInit( container ) {
		var sliderSpeed = parseInt( container.data( 'slider-speed' ) ),
			sliderAnimationSpeed = parseInt( container.attr( 'data-slider-anim-speed' ) ),
			sliderArrows = container.data( 'slider-arrows' ),
			sliderDots = container.data( 'slider-dots' ),
			sliderPause = container.data( 'slider-pause-hover' ),
			sliderAuto = container.data( 'slider-auto' ),
			xxl = parseInt( container.attr( 'data-columns-xxl' ) ),
			xl = parseInt( container.attr( 'data-columns-xl' ) ),
			md = parseInt( container.attr( 'data-columns-md' ) ),
			sm = parseInt( container.attr( 'data-columns-sm' ) ),
			xs = parseInt( container.attr( 'data-columns-xs' ) ),
			ss = parseInt( container.attr( 'data-columns-ss' ) ),
			scroll = parseInt( container.attr( 'data-slider-scroll' ) );
		var slickRtl = false;
		var scrollSxxl = xxl,
			scrollSxl = xl,
			scrollSmd = md,
			scrollSsm = sm,
			scrollSxs = xs,
			scrollSss = ss;
		if ( $( 'html[dir="rtl"]' ).length ) {
			slickRtl = true;
		}
		if ( 1 === scroll ) {
			scrollSxxl = 1;
			scrollSxl = 1;
			scrollSmd = 1;
			scrollSsm = 1;
			scrollSxs = 1;
			scrollSss = 1;
		}
		container.on( 'init', function() {
			container.removeClass( 'kt-post-carousel-loading' );
		} );
		container.slick( {
			slidesToScroll: scrollSxxl,
			slidesToShow: xxl,
			arrows: sliderArrows,
			speed: sliderAnimationSpeed,
			autoplay: sliderAuto,
			autoplaySpeed: sliderSpeed,
			fade: false,
			pauseOnHover: sliderPause,
			dots: sliderDots,
			rtl: slickRtl,
			responsive: [
				{
					breakpoint: 1499,
					settings: {
						slidesToShow: xl,
						slidesToScroll: scrollSxl,
					},
				},
				{
					breakpoint: 1199,
					settings: {
						slidesToShow: md,
						slidesToScroll: scrollSmd,
					},
				},
				{
					breakpoint: 991,
					settings: {
						slidesToShow: sm,
						slidesToScroll: scrollSsm,
					},
				},
				{
					breakpoint: 767,
					settings: {
						slidesToShow: xs,
						slidesToScroll: scrollSxs,
					},
				},
				{
					breakpoint: 543,
					settings: {
						slidesToShow: ss,
						slidesToScroll: scrollSss,
					},
				},
			],
		} );
	}
	$( '.kt-blocks-carousel-init' ).each( function() {
		var container = $( this );
		kbSlickSliderInit( container );
	} );
} );
