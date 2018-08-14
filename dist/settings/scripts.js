jQuery(document).ready(function ($) {
	$('.kad-panel-left .nav-tab-link').click(function (event) {
		event.preventDefault();
		var contain = $(this).closest('.kad-panel-left')
		var panel = contain.find('.nav-tab-wrapper');
		var active = panel.find('.nav-tab-active');
		var opencontent = $(this).closest('.kad-panel-contain').find('.nav-tab-content.panel_open');
		var contentid = $(this).data('tab-id');
		var tab = panel.find('a[data-tab-id="'+contentid+'"]');
		if (active.data('tab-id') == contentid ) {
			//leave
		} else {
			tab.addClass('nav-tab-active');
			active.removeClass('nav-tab-active');
			opencontent.removeClass('panel_open');
			$('#'+contentid).addClass('panel_open');	
		}

		return false;

	});
});
/**
 * Ajax activate, deactivate blocks
 *
 */
(function($, window, document, undefined){
	"use strict";

	$(function(){
		$('.kt_block_button').on( 'click', function( event ) {
			var $button = $( event.target );
			event.preventDefault();
			/**
			 * Keep button from running twice
			 */
			if ( $button.hasClass( 'updating-message' ) || $button.hasClass( 'button-disabled' ) ) {
				return;
			}

			function ajax_callback(response){
				console.log(response);
				if ( typeof response.success != "undefined" && response.success ) {
					if( $button.hasClass( 'kt-block-active' ) ) {
						buttonStatusToggled( $button.data('deactivated-label') );
					} else {
						buttonStatusToggled( $button.data('activated-label') );
					}
				} else{
					// error processing this block
					buttonStatusDisabled( 'Error' );
				}
	        }
			/**
			 * Toggle Block
			 *
			 * @return void
			 */
			function toggleBlock(){
				if( $button.hasClass( 'kt-block-active' ) ) {
					console.log('deactivating');
					buttonStatusInProgress( $button.data('deactivating-label') );
				} else {
					console.log('activating');
					buttonStatusInProgress( $button.data('activating-label') );
				}
				jQuery.post( kt_blocks_params.ajaxurl, {
                    action: "kadence_blocks_activate_deactivate",
                    wpnonce: kt_blocks_params.wpnonce,
                    kt_block: $button.data('block-slug'),
                }, ajax_callback );
			}

			/**
			 * Change button status to in-progress
			 *
			 * @return void
			 */
			function buttonStatusInProgress( message ){
				$button.addClass( 'updating-message' ).removeClass( 'button-disabled' ).text( message );
			}

			/**
			 * Change button status to disabled
			 *
			 * @return void
			 */
			function buttonStatusDisabled( message ){
				$button.removeClass('updating-message')
				.addClass('button-disabled')
				.text( message );
			}

			/**
			 * Change button status to kt-block-active
			 *
			 * @return void
			 */
			function buttonStatusToggled( message ){
				if ( $button.hasClass( 'kt-block-active' ) ) {
					$button.removeClass('updating-message kt-block-active')
						.addClass('button-disabled')
						.text( message );
					$button.closest('.kt_plugin_box').addClass('kt-block-inactive').removeClass('kt-block-active');
					setTimeout( function(){ 
						$button.addClass('kt-block-inactive').removeClass('button-disabled').text( $button.data('inactive-label' ) ); 
					}, 2000);
				} else {
					$button.removeClass('updating-message kt-block-inactive')
						.addClass('button-disabled')
						.text( message );
					$button.closest('.kt_plugin_box').addClass('kt-block-active').removeClass('kt-block-inactive');
					setTimeout( function(){ 
						$button.addClass('kt-block-active').removeClass('button-disabled').text( $button.data('active-label' ) ); 
					}, 2000);
				}
			}

			toggleBlock();
		});
	});
})(jQuery, window, document);