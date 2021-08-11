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
			scroll = parseInt( container.attr( 'data-slider-scroll' ) ),
			sliderType = container.attr('data-slider-type'),
			slidercenter = container.attr( 'data-slider-center-mode' );
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
		if ( sliderType && sliderType === 'fluidcarousel' ) {
			container.find( '.kb-slide-item' ).each( function() {
				$( this ).css( 'maxWidth', Math.floor( ( 80 / 100 ) * container.innerWidth() ) );
			} );
			if ( '' !== slidercenter && 'false' === slidercenter ) {
				slidercenter = false;
			} else {
				slidercenter = true;
			}
			container.slick( {
				slidesToScroll: 1,
				slidesToShow: 1,
				centerMode: slidercenter,
				variableWidth: true,
				arrows: sliderArrows,
				speed: sliderAnimationSpeed,
				autoplay: sliderAuto,
				autoplaySpeed: sliderSpeed,
				fade: false,
				pauseOnHover: sliderPause,
				rtl: slickRtl,
				dots: sliderDots,
			} );
			var resizeTimer;

			$( window ).on( 'resize', function( e ) {
				clearTimeout( resizeTimer );
				resizeTimer = setTimeout( function() {
					container.find( '.kb-slide-item' ).each( function() {
						$( this ).css( 'maxWidth', Math.floor( ( 80 / 100 ) * container.innerWidth() ) );
					} );
				}, 10 );
			} );
		} else if ( sliderType && sliderType === 'slider' ) {
			var sliderFade = container.attr('data-slider-fade');
			if ( 'false' == sliderFade ) {
				sliderFade = false;
			} else {
				sliderFade = true;
			}
			container.slick( {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: sliderArrows,
				speed: sliderAnimationSpeed,
				autoplay: sliderAuto,
				autoplaySpeed: sliderSpeed,
				fade: sliderFade,
				pauseOnHover: sliderPause,
				rtl: slickRtl,
				adaptiveHeight: true,
				dots: sliderDots,
			} );
			$( window ).on( 'resize', function( e ) {
				container.slick( 'refresh' );
			} );
		} else if ( sliderType && sliderType === 'thumbnail' ) {
			var sliderFade = container.attr('data-slider-fade');
			var sliderID = container.attr('id');
			var sliderThumbID = container.attr('data-slider-nav');
			if ( 'false' == sliderFade ) {
				sliderFade = false;
			} else {
				sliderFade = true;
			}
			container.slick( {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: sliderArrows,
				speed: sliderAnimationSpeed,
				autoplay: sliderAuto,
				autoplaySpeed: sliderSpeed,
				fade: sliderFade,
				pauseOnHover: sliderPause,
				rtl: slickRtl,
				adaptiveHeight: true,
				dots: sliderDots,
				asNavFor: '#' + sliderThumbID,
			} );
			$( '#' + sliderThumbID ).slick( {
				slidesToShow: xxl,
				slidesToScroll: 1,
				asNavFor: '#' + sliderID,
				dots: false,
				rtl: slickRtl,
				centerMode: false,
				focusOnSelect: true,
				responsive: [
					{
						breakpoint: 1499,
						settings: {
							slidesToShow: xl,
						},
					},
					{
						breakpoint: 1199,
						settings: {
							slidesToShow: md,
						},
					},
					{
						breakpoint: 991,
						settings: {
							slidesToShow: sm,
						},
					},
					{
						breakpoint: 767,
						settings: {
							slidesToShow: xs,
						},
					},
					{
						breakpoint: 543,
						settings: {
							slidesToShow: ss,
						},
					},
				],
			} );
			$( window ).on( 'resize', function( e ) {
				container.slick( 'refresh' );
			} );
		} else {
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
			$( window ).on( 'resize', function( e ) {
				container.slick( 'refresh' );
			} );
		}
	}
	$( '.wp-block-kadence-advancedgallery .kt-blocks-carousel-init' ).each( function() {
		var container = $( this );
		kbSlickSliderInit( container );
	} );
	$( '.kb-blocks-bg-slider > .kt-blocks-carousel-init' ).each( function() {
		var container = $( this );
		kbSlickSliderInit( container );
	} );
} );
