/* global kadence_blocks_toc */
/**
 * File kb-table-of-contents.js.
 * Gets the table of contents links and smoothscroll working.
 */
( function() {
	'use strict';
	window.kadenceTOC = {
		/**
		 * Add anchors where needed.
		 */
		initAddAnchors: function() {
			var headings = JSON.parse( kadence_blocks_toc.headings );
			for ( let i = 0; i < headings.length; i++ ) {
				var heading_items = document.querySelectorAll( 'h' + headings[ i ].level );
				if ( ! heading_items.length ) {
					return;
				}
				for ( let n = 0; n < heading_items.length; n++ ) {
					if ( heading_items[ n ].textContent.includes( headings[ i ].content ) ) {
						heading_items[ n ].setAttribute( 'id', headings[ i ].anchor );
					}
				}
			}
		},
		/**
		 * Toggle an attribute.
		 */
		toggleAttribute: function( element, attribute, trueVal, falseVal ) {
			if ( trueVal === undefined ) {
				trueVal = true;
			}
			if ( falseVal === undefined ) {
				falseVal = false;
			}
			if ( element.getAttribute( attribute ) !== trueVal ) {
				element.setAttribute( attribute, trueVal );
			} else {
				element.setAttribute( attribute, falseVal );
			}
		},
		/**
		 * Toggle a class.
		 */
		toggleClass: function( element, trueVal, falseVal ) {
			if ( trueVal === undefined ) {
				trueVal = 'active';
			}
			if ( falseVal === undefined ) {
				falseVal = 'hidden';
			}
			if ( element.classList.contains( trueVal ) ) {
				element.classList.remove( trueVal );
				element.classList.add( falseVal );
			} else {
				element.classList.add( trueVal );
				element.classList.remove( falseVal );
			}
		},
		/**
		 * Instigate toggle.
		 */
		initCollapse: function() {
			var collapse_items = document.querySelectorAll( '.kb-collapsible-toc' );
			if ( ! collapse_items.length ) {
				return;
			}
			for ( let n = 0; n < collapse_items.length; n++ ) {
				var el = collapse_items[n].querySelector( '.kb-table-of-contents-icon-trigger' );
				el.onclick = () => {
					window.kadenceTOC.toggleAttribute( el, 'aria-expanded', 'true', 'false' );
					window.kadenceTOC.toggleAttribute( el, 'aria-label', kadence_blocks_toc.collapseText, kadence_blocks_toc.expandText );
					window.kadenceTOC.toggleClass( collapse_items[n], 'kb-toc-toggle-active', 'kb-toc-toggle-hidden' );
				}
			}
		},
		scrollToElement( element, offset, history = true ) {
			var originalTop = Math.floor( element.getBoundingClientRect().top ) - offset;
			window.scrollBy( { top: originalTop, left: 0, behavior: 'smooth' } );
			var checkIfDone = setInterval( function() {
				var atBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
				if ( ( Math.floor( element.getBoundingClientRect().top ) - offset === 0 ) || atBottom ) {
					//element.tabIndex = '-1';
					element.focus();
					if ( history ) {
						window.history.pushState('', '', '#' + element.id );
					}
					clearInterval( checkIfDone );
				}
			}, 100 );
		},
		/**
		 * Instigate toggle.
		 */
		initScroll: function() {
			var scroll_toc = document.querySelectorAll( '.kb-toc-smooth-scroll' );
			if ( ! scroll_toc.length ) {
				return;
			}
			for ( let n = 0; n < scroll_toc.length; n++ ) {
				var offset = parseInt( scroll_toc[n].getAttribute( 'data-scroll-offset' ) );
				var elements = scroll_toc[n].querySelectorAll( 'a.kb-table-of-contents__entry' );
				for ( let i = 0; i < elements.length; i++ ) {
					elements[i].onclick = ( e ) => {
						if ( e.target.getAttribute( 'href' ) ) {
							var targetLink = e.target;
						} else {
							var targetLink = e.target.closest( 'a' );
							if ( ! targetLink ) {
								return;
							}
							if ( ! targetLink.getAttribute( 'href' ) ) {
								return;
							}
						}
						var targetID = targetLink.getAttribute('href').substring( targetLink.getAttribute('href').indexOf('#') );
						var targetAnchor = document.getElementById( targetID.replace( '#', '' ) );
						if ( ! targetAnchor ) {
							return;
						}
						e.preventDefault();
						window.kadenceTOC.scrollToElement( targetAnchor, offset );
					};
				}
			}
		},
		// Initiate sticky when the DOM loads.
		init: function() {
			window.kadenceTOC.initAddAnchors();
			window.kadenceTOC.initCollapse();
			window.kadenceTOC.initScroll();
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.kadenceTOC.init );
	} else {
		// The DOM has already been loaded.
		window.kadenceTOC.init();
	}
}() );
