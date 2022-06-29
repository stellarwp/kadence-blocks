/* global CountUp */
/**
 * File kb-countup.js.
 * Gets the countup running in viewport.
 */
 ( function() {
	'use strict';
	window.kadenceCountUp = {
		cache: {},
		countUpItems: {},
		listenerCache: {},
		isInViewport: function(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		
			);
		},
		initScrollSpy: function() {
			window.kadenceCountUp.countUpItems = document.querySelectorAll( '.kb-count-up' );
			if ( ! window.kadenceCountUp.countUpItems.length ) {
				return;
			}
			for ( let n = 0; n < window.kadenceCountUp.countUpItems.length; n++ ) {
				let self = window.kadenceCountUp.countUpItems[n],
					start     = self.dataset.start,
					end       = self.dataset.end,
					prefix     = self.dataset.prefix,
					suffix    = self.dataset.suffix,
					duration  = self.dataset.duration,
					separator = self.dataset.separator,
					decimal   = ( self.dataset.decimal ? self.dataset.decimal : false ),
					decimalSpaces   = ( self.dataset.decimalSpaces ? self.dataset.decimalSpaces : false ),
					el = self.querySelector('.kb-count-up-process');
				let theSeparator = ( separator === 'true' ? ',' : separator );
				theSeparator = ( theSeparator === 'false' ? '' : theSeparator );
				let KbCounterOptions = {
					startVal: start ? start : 0,
					duration: duration ? duration : 2,
					prefix: prefix ? prefix : '',
					suffix: suffix ? suffix : '',
					separator: theSeparator,
					decimal: decimal,
					decimalPlaces: decimalSpaces,
				};
				window.kadenceCountUp.cache[n] = new countUp.CountUp( el, end, KbCounterOptions);
				// Initialize listener
				window.kadenceCountUp.listenerCache[n] = window.kadenceCountUp.listener( n );
				document.addEventListener( 'scroll', window.kadenceCountUp.listenerCache[n], { passive: true } );
				window.kadenceCountUp.startCountUp( n );
			}
		},
		/**
		 * Start Listener.
		 */
		listener: function( index ) {
			return function curried_func( e ) {
				window.kadenceCountUp.startCountUp( index );
			}
		},
		/**
		 * Start function.
		 */
		startCountUp: function( index ) {
			if ( window.kadenceCountUp.isInViewport( window.kadenceCountUp.countUpItems[index] ) ) {
				if ( ! window.kadenceCountUp.cache[index].error ) {
					window.kadenceCountUp.cache[index].start();
				}
				document.removeEventListener( 'scroll', window.kadenceCountUp.listenerCache[index], false );
			}
		},
		// Initiate sticky when the DOM loads.
		init: function() {
			window.kadenceCountUp.initScrollSpy();
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.kadenceCountUp.init );
	} else {
		// The DOM has already been loaded.
		window.kadenceCountUp.init();
	}
}() );
