jQuery( document ).ready( function( $ ) {
	// Init Magnific
	$( '.kb-gallery-magnific-init' ).each( function() {
		var showCaption = $( this ).attr( 'data-lightbox-caption' );
		var filter = $( this ).attr( 'data-image-filter' );
		$( this ).find( 'li.kadence-blocks-gallery-item a.kb-gallery-item-link' ).magnificPopup( {
			type: 'image',
			mainClass: 'mfp-kt-blocks kb-gal-light-filter-' + filter,
			gallery: {
				enabled: true,
			},
			image: {
				titleSrc: function( item ) {
					if ( 'true' == showCaption && item.el.find( '.kadence-blocks-gallery-item__caption' ).length ) {
						return item.el.find( '.kadence-blocks-gallery-item__caption' ).html();
					}
					return '';
				},
			},
		} );
		$( this ).find( '.kt-blocks-carousel .kb-slide-item:not(.slick-cloned) a.kb-gallery-item-link' ).magnificPopup( {
			type: 'image',
			mainClass: 'mfp-kt-blocks kb-gal-light-filter-' + filter,
			gallery: {
				enabled: true,
			},
			image: {
				titleSrc: function( item ) {
					if ( 'true' == showCaption && item.el.find( '.kadence-blocks-gallery-item__caption' ).length ) {
						return item.el.find( '.kadence-blocks-gallery-item__caption' ).html();
					}
					return '';
				},
			},
		} );
	} );
} );
