/* global tns */
/**
 * File slide-init.js.
 * Gets slide going when needed.
 */

 (function() {
	'use strict';
	window.kadenceTinySlide = {
		/**
		 * Initiate the script to process all
		 */
		start: function( element ) {
			var slideRtl = 'ltr',
			sliderType = element.getAttribute('data-slider-type'),
			sliderSpeed = parseInt( element.getAttribute( 'data-slider-speed' ) ),
			sliderAnimationSpeed = parseInt( element.getAttribute( 'data-slider-anim-speed' ) ),
			sliderArrows = element.getAttribute( 'data-slider-arrows' ),
			sliderDots = element.getAttribute( 'data-slider-dots' ),
			sliderPause = element.getAttribute( 'data-slider-pause-hover' ),
			sliderLoop = element.getAttribute( 'data-slider-loop' ),
			sliderAuto = element.getAttribute( 'data-slider-auto' ),
			xxl = parseInt( element.getAttribute( 'data-columns-xxl' ) ),
			xl = parseInt( element.getAttribute( 'data-columns-xl' ) ),
			md = parseInt( element.getAttribute( 'data-columns-md' ) ),
			sm = parseInt( element.getAttribute( 'data-columns-sm' ) ),
			xs = parseInt( element.getAttribute( 'data-columns-xs' ) ),
			ss = parseInt( element.getAttribute( 'data-columns-ss' ) ),
			gutter = parseInt( element.getAttribute( 'data-slider-gutter' ) ),
			scroll = parseInt( element.getAttribute( 'data-slider-scroll' ) ),
			slidercenter = element.getAttribute( 'data-slider-center-mode' );
			if ( document.body.classList.contains( 'rtl' ) ) {
				slideRtl = 'rtl';
			}
			// Not updated yet.
			if ( ! element.parentNode.parentNode.classList.contains( 'tns-carousel-wrap' ) ) {
				element.parentNode.parentNode.classList.add( 'tns-carousel-wrap' );
				if ( element.classList.contains( 'kt-carousel-arrowstyle-blackonlight' ) ) {
					element.parentNode.classList.add( 'kt-carousel-container-arrowstyle-blackonlight' );
				} else if ( element.classList.contains( 'kt-carousel-arrowstyle-outlineblack ' ) ) {
					element.parentNode.classList.add( 'kt-carousel-container-arrowstyle-outlineblack' );
				} else if ( element.classList.contains( 'kt-carousel-arrowstyle-outlinewhite ' ) ) {
					element.parentNode.classList.add( 'kt-carousel-container-arrowstyle-outlinewhite' );
				} else if ( element.classList.contains( 'kt-carousel-arrowstyle-whiteondark ' ) ) {
					element.parentNode.classList.add( 'kt-carousel-container-arrowstyle-whiteondark' );
				} else if ( element.classList.contains( 'kt-carousel-arrowstyle-none ' ) ) {
					element.parentNode.classList.add( 'kt-carousel-container-arrowstyle-none' );
				}
			}
			var navThumb = true;
			if ( 1 !== scroll ) {
				scroll = 'page';
				navThumb = false;
			}
			var slider = tns( {
				container: element,
				items: ss,
				slideBy: scroll,
				navAsThumbnails: navThumb,
				autoplay: ( 'true' === sliderAuto ? true : false ),
				speed: sliderAnimationSpeed,
				autoplayTimeout: sliderSpeed,
				autoplayHoverPause: ( 'true' === sliderPause ? true : false ),
				controls: ( 'false' === sliderArrows ? false : true ),
				nav: ( 'false' === sliderDots ? false : true ),
				gutter: 0,
				textDirection: slideRtl,
				loop:( 'false' === sliderLoop ? false : true ),
				rewind:( 'false' === sliderLoop ? true : false ),
				responsive: {
					543: {
						items: xs
					},
					767: {
						items: sm
					},
					991: {
						items: md
					},
					1199: {
						items: xl
					},
					1499: {
						items: xxl
					}
				}
			} );
		},
		/**
		 * Initiate the script to process all
		 */
		initAll: function( element ) {
			document.querySelectorAll( '.wp-block-kadence-testimonials .kt-blocks-carousel-init' ).forEach(function ( element ) {
				window.kadenceTinySlide.start( element );
			} );
		},
		// Initiate the menus when the DOM loads.
		init: function() {
			if ( typeof tns == 'function' ) {
				window.kadenceTinySlide.initAll();
			} else {
				var initLoadDelay = setInterval( function(){ if ( typeof tns == 'function' ) { window.kadenceTinySlide.initAll(); clearInterval(initLoadDelay); } }, 200 );
			}
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.kadenceTinySlide.init );
	} else {
		// The DOM has already been loaded.
		window.kadenceTinySlide.init();
	}
})();
