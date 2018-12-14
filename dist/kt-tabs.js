/**
 * Tabs that can create an accordion for mobile.
 */
jQuery( document ).ready( function( $ ) {
	$( '.kt-tabs-title-list li a' ).click( function( e ) {
		e.preventDefault();
		const tabId = $( this ).attr( 'data-tab' );

		$( this ).closest( '.kt-tabs-title-list' ).find( '.kt-tab-title-active' )
			.addClass( 'kt-tab-title-inactive' )
			.removeClass( 'kt-tab-title-active' );
		$( this ).closest( '.kt-tabs-wrap' ).removeClass( function( index, className ) {
			return ( className.match( /\bkt-active-tab-\S+/g ) || [] ).join( ' ' );
		} ).addClass( 'kt-active-tab-' + tabId );
		$( this ).parent( 'li' ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
		$( this ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-accordion-title.kt-tabs-accordion-title-' + tabId ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
	} );
	$( '.kt-create-accordion' ).find( '.kt-tabs-title-list .kt-title-item' ).each( function() {
		const tabId = $( this ).find( 'a' ).attr( 'data-tab' );
		let activeclass;
		let iconclass;
		let iconsideclass;
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
		$( this ).closest( '.kt-tabs-wrap' ).find( '.kt-inner-tab-' + tabId ).before( '<div class="kt-tabs-accordion-title kt-tabs-accordion-title-' + tabId + ' ' + activeclass + ' ' + iconclass + ' ' + iconsideclass + '">' + $( this ).html() + '</div>' );
	} );
	$( '.kt-tabs-accordion-title a' ).click( function( e ) {
		e.preventDefault();
		const tabId = $( this ).attr( 'data-tab' );

		$( this ).closest( '.kt-tabs-wrap' ).find( '.kt-tab-title-active' )
			.addClass( 'kt-tab-title-inactive' )
			.removeClass( 'kt-tab-title-active' );
		// $( this ).closest( '.kt-tabs-wrap' ).removeClass( function( index, className ) {
		// 	return ( className.match( /\bkt-active-tab-\S+/g ) || [] ).join( ' ' );
		// } ).addClass( 'kt-active-tab-' + tabId );
		$( this ).closest( '.kt-tabs-wrap' ).addClass( 'kt-active-tab-' + tabId );
		$( this ).closest( '.kt-tabs-wrap' ).find( 'ul .kt-title-item-' + tabId ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
		$( this ).parent( '.kt-tabs-accordion-title' ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
	} );
	if ( window.location.hash != '' ) {
		const matches = window.location.hash.match( /\btab-\S+/g );
		if ( matches !== null && matches.length === 1 ) {
			const tabid = matches[ 0 ];
			const tabnumber = $( '#' + tabid + ' a' ).attr( 'data-tab' );
			$( '#' + tabid ).closest( '.kt-tabs-title-list' ).find( '.kt-tab-title-active' )
				.addClass( 'kt-tab-title-inactive' )
				.removeClass( 'kt-tab-title-active' );
			$( '#' + tabid ).closest( '.kt-tabs-wrap' ).removeClass( function( index, className ) {
				return ( className.match( /\bkt-active-tab-\S+/g ) || [] ).join( ' ' );
			} ).addClass( 'kt-active-tab-' + tabnumber );
			$( '#' + tabid ).addClass( 'kt-tab-title-active' );
			$( '#' + tabid ).closest( '.kt-tabs-wrap' ).find( '.kt-tabs-accordion-title.kt-tabs-accordion-title-' + tabid ).addClass( 'kt-tab-title-active' ).removeClass( 'kt-tab-title-inactive' );
		}
	}
} );
