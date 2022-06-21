/**
 * Tabs that can create an accordion for mobile.
 */
jQuery( function( $ ) {
	$( '.kt-tabs-wrap' ).each( function( a ) {
		var ktStartTab = $( this ).find( '> .kt-tabs-title-list .kt-tab-title-active a' ).attr( 'data-tab' );
		var ktTabsList = $( this ).find( '> .kt-tabs-title-list' ).attr( {
			role: 'tablist',
		} );
		$( this ).find( '> .kt-tabs-content-wrap > .kt-tab-inner-content' ).attr( {
			role: 'tabpanel',
			'aria-hidden': 'true',
		} );
		$( this ).find( '> .kt-tabs-title-list a' ).each( function( b ) {
			var tabId = $( this ).attr( 'data-tab' );
			var tabName = $( this ).parent().attr( 'id' );
			$( this ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-inner-tab-' + tabId ).attr( 'aria-labelledby', tabName );
		} );
		$( this ).find( '.kt-tabs-content-wrap > .kt-inner-tab-' + ktStartTab ).attr( 'aria-hidden', 'false' );
		$( this ).find( '> .kt-tabs-title-list li:not(.kt-tab-title-active) a' ).each( function() {
			$( this ).attr( {
				role: 'tab',
				'aria-selected': 'false',
				tabindex: '-1',
				'aria-controls': $( this ).parent().attr( 'id' ),
			} ).parent().attr( 'role', 'presentation' );
		} );
		$( this ).find( '> .kt-tabs-title-list li.kt-tab-title-active a' ).attr( {
			role: 'tab',
			'aria-selected': 'true',
			'aria-controls': $( this ).find( '> .kt-tabs-title-list li.kt-tab-title-active a' ).parent().attr( 'id' ),
			tabindex: '0',
		} ).parent().attr( 'role', 'presentation' );
		$( ktTabsList ).on( 'keydown', 'a', function( e ) {
			switch ( e.which ) {
				case 37: case 38:
					if ( $( this ).parent().prev().length != 0 ) {
						$( this ).parent().prev().find( '> a' ).click();
					} else {
						$( ktTabsList ).find( 'li:last > a' ).click();
					}
					break;
				case 39: case 40:
					if ( $( this ).parent().next().length != 0 ) {
						$( this ).parent().next().find( '> a' ).click();
					} else {
						$( ktTabsList ).find( 'li:first > a' ).click();
					}
					break;
			}
		} );
		var resizeEvent = window.document.createEvent( 'UIEvents' );
		resizeEvent.initUIEvent( 'resize', true, false, window, 0 );
		window.dispatchEvent( resizeEvent );
	} );
	$( '.kt-tabs-title-list li a' ).on( 'click', function( e ) {
		e.preventDefault();
		var tabId = $( this ).attr( 'data-tab' );

		$( this ).closest( '.kt-tabs-title-list' ).find( '.kt-tab-title-active' )
			.addClass( 'kt-tab-title-inactive' )
			.removeClass( 'kt-tab-title-active' )
			.find( 'a.kt-tab-title' ).attr( {
				tabindex: '-1',
				'aria-selected': 'false',
			} );
		$( this ).closest( '.kt-tabs-wrap' ).removeClass( function( index, className ) {
			return ( className.match( /\bkt-active-tab-\S+/g ) || [] ).join( ' ' );
		} ).addClass( 'kt-active-tab-' + tabId );
		$( this ).parent( 'li' ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
		$( this ).attr( {
			tabindex: '0',
			'aria-selected': 'true',
		} ).focus();
		$( this ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-tab-inner-content:not(.kt-inner-tab-' + tabId + ')' ).attr( 'aria-hidden', 'true' );
		$( this ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-inner-tab-' + tabId ).attr( 'aria-hidden', 'false' );
		$( this ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-tabs-accordion-title:not(.kt-tabs-accordion-title-' + tabId + ')' ).addClass( 'kt-tab-title-inactive' ).removeClass( 'kt-tab-title-active' ).attr( {
			tabindex: '-1',
			'aria-selected': 'false',
		} );
		$( this ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tabs-accordion-title-' + tabId ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' ).attr( {
			tabindex: '0',
			'aria-selected': 'true',
		} );
		var resizeEvent = window.document.createEvent( 'UIEvents' );
		resizeEvent.initUIEvent( 'resize', true, false, window, 0 );
		window.dispatchEvent( resizeEvent );
		var tabEvent = window.document.createEvent( 'UIEvents' );
		tabEvent.initUIEvent( 'kadence-tabs-open', true, false, window, 0 );
		window.dispatchEvent( tabEvent );
	} );
	$( '.kt-create-accordion' ).find( '> .kt-tabs-title-list .kt-title-item' ).each( function() {
		var tabId = $( this ).find( 'a' ).attr( 'data-tab' );
		var activeclass;
		var iconclass;
		var iconsideclass;
		if ( $( this ).hasClass( 'kt-tab-title-active' ) ) {
			activeclass = 'kt-tab-title-active';
		} else {
			activeclass = 'kt-tab-title-inactive';
		}
		if ( $( this ).hasClass( 'kt-tabs-svg-show-only' ) ) {
			iconclass = 'kt-tabs-svg-show-only';
		} else {
			iconclass = 'kt-tabs-svg-show-always';
		}
		if ( $( this ).hasClass( 'kt-tabs-icon-side-top' ) ) {
			iconsideclass = 'kt-tabs-icon-side-top';
		} else {
			iconsideclass = '';
		}
		$( this ).closest( '.kt-tabs-wrap' ).find( '> .kt-tabs-content-wrap > .kt-inner-tab-' + tabId ).before( '<div class="kt-tabs-accordion-title kt-tabs-accordion-title-' + tabId + ' ' + activeclass + ' ' + iconclass + ' ' + iconsideclass + '">' + $( this ).html() + '</div>' );
		$( this ).closest( '.kt-tabs-wrap' ).find( '> .kt-tabs-content-wrap > .kt-tabs-accordion-title-' + tabId + '  a' ).removeAttr( 'role' );
	} );
	$( '.kt-tabs-accordion-title a' ).on( 'click', function( e ) {
		e.preventDefault();
		var tabId = $( this ).attr( 'data-tab' );
		if ( $( this ).parent( '.kt-tabs-accordion-title' ).hasClass( 'kt-tab-title-active' ) ) {
			$( this ).closest( '.kt-tabs-wrap' ).removeClass( 'kt-active-tab-' + tabId );
			$( this ).parent( '.kt-tabs-accordion-title' ).removeClass( 'kt-tab-title-active' ).addClass( 'kt-tab-title-inactive' );
		} else {
			// $( this ).closest( '.kt-tabs-wrap' ).find( '.kt-tab-title-active' )
			// 	.addClass( 'kt-tab-title-inactive' )
			// 	.removeClass( 'kt-tab-title-active' );
			// $( this ).closest( '.kt-tabs-wrap' ).removeClass( function( index, className ) {
			// 	return ( className.match( /\bkt-active-tab-\S+/g ) || [] ).join( ' ' );
			// } ).addClass( 'kt-active-tab-' + tabId );
			$( this ).closest( '.kt-tabs-wrap' ).addClass( 'kt-active-tab-' + tabId );
			//$( this ).closest( '.kt-tabs-wrap' ).find( 'ul .kt-title-item-' + tabId ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
			$( this ).parent( '.kt-tabs-accordion-title' ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
		}
		var resizeEvent = window.document.createEvent( 'UIEvents' );
		resizeEvent.initUIEvent( 'resize', true, false, window, 0 );
		window.dispatchEvent( resizeEvent );
		var tabEvent = window.document.createEvent( 'UIEvents' );
		tabEvent.initUIEvent( 'kadence-tabs-open', true, false, window, 0 );
		window.dispatchEvent( tabEvent );
	} );
	function kt_anchor_tabs() {
		if ( window.location.hash != '' ) {
			if ( $( window.location.hash + '.kt-title-item' ).length ) {
				var tabid = window.location.hash.substring(1);
				var tabnumber = $( '#' + tabid + ' a' ).attr( 'data-tab' );
				// remove active.
				$( '#' + tabid ).closest( '.kt-tabs-title-list' ).find( '.kt-tab-title-active' )
					.addClass( 'kt-tab-title-inactive' )
					.removeClass( 'kt-tab-title-active' )
					.find( 'a.kt-tab-title' ).attr( {
						tabindex: '-1',
						'aria-selected': 'false',
					} );
				// Set active
				$( '#' + tabid ).closest( '.kt-tabs-wrap' ).removeClass( function( index, className ) {
					return ( className.match( /\bkt-active-tab-\S+/g ) || [] ).join( ' ' );
				} ).addClass( 'kt-active-tab-' + tabnumber );

				$( '#' + tabid ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
				$( '#' + tabid ).find( 'a.kt-tab-title' ).attr( {
					tabindex: '0',
					'aria-selected': 'true',
				} ).focus();
				$( '#' + tabid ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-tab-inner-content:not(.kt-inner-tab-' + tabnumber + ')' ).attr( 'aria-hidden', 'true' );
				$( '#' + tabid ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-inner-tab-' + tabnumber ).attr( 'aria-hidden', 'false' );
				$( '#' + tabid ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-tabs-accordion-title:not(.kt-tabs-accordion-title-' + tabnumber + ')' ).addClass( 'kt-tab-title-inactive' ).removeClass( 'kt-tab-title-active' ).attr( {
					tabindex: '-1',
					'aria-selected': 'false',
				} );
				$( '#' + tabid ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tabs-accordion-title-' + tabnumber ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' ).attr( {
					tabindex: '0',
					'aria-selected': 'true',
				} );
				if ( ( $( window ).width() <= 767 && $( '#' + tabid ).closest( '.kt-tabs-wrap' ).hasClass( 'kt-tabs-mobile-layout-accordion' ) ) || ( $( window ).width() > 767 && $( window ).width() <= 1024 && $( '#' + tabid ).closest( '.kt-tabs-wrap' ).hasClass( 'kt-tabs-tablet-layout-accordion' ) ) ) {
					// Anchor scroll won't work because anchor is hidden, manually add.
					$([document.documentElement, document.body]).animate({
						scrollTop: $( '#' + tabid ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tabs-accordion-title-' + tabnumber ).offset().top - 20
					}, 600);
				}
			}
		}
	}
	window.addEventListener( 'hashchange', kt_anchor_tabs, false );
	kt_anchor_tabs();
} );