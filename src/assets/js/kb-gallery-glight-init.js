/* global GLightbox */
/**
 * File lightbox-init.js.
 * Gets Lightbox working for Kadence Blocks Gallery
 */

(function () {
	'use strict';

	var kadenceBlocksGLight = {
		carouselCache: {},
		carouselItem: {},
		lightboxes: {},
		foundClasses: {},
		simulateClick: function (elem) {
			// Create our event (with options)
			var evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window,
			});
			// If cancelled, don't dispatch our event
			!elem.dispatchEvent(evt);
		},
		// checkImage: function( element ) {
		// 	return /(png|jpg|jpeg|gif|tiff|bmp|webp)$/.test(
		// 		element.getAttribute( 'href' ).toLowerCase().split( '?' )[0].split( '#' )[0]
		// 	);
		// },
		handleClones: function (element) {
			var foundClones = element.querySelectorAll('.kb-slide-item.splide__slide--clone a.kb-gallery-item-link');
			var foundRegular = element.querySelectorAll(
				'.kb-slide-item:not(.splide__slide--clone) a.kb-gallery-item-link'
			);
			for (let c = 0; c < foundClones.length; c++) {
				foundClones[c].addEventListener('click', function (event) {
					event.preventDefault();
					var the_href = foundClones[c].getAttribute('href');
					for (let b = 0; b < foundRegular.length; b++) {
						if (the_href === foundRegular[b].getAttribute('href')) {
							kadenceBlocksGLight.simulateClick(foundRegular[b]);
							break;
						}
					}
				});
			}
		},
		findGalleries: function () {
			let foundGalleries = document.querySelectorAll('.kb-gallery-magnific-init');
			if (!foundGalleries.length) {
				return;
			}
			if (foundGalleries) {
				for (let i = 0; i < foundGalleries.length; i++) {
					let galleryClass = foundGalleries[i].classList;
					let filter = foundGalleries[i].getAttribute('data-image-filter');
					const skin = filter ? 'kadence-dark kb-gal-light-filter-' + filter : 'kadence-dark';
					var showCaption = foundGalleries[i].getAttribute('data-lightbox-caption');
					let galleryLinks = foundGalleries[i].querySelectorAll('a.kb-gallery-item-link');
					for (let l = 0; l < galleryLinks.length; l++) {
						galleryLinks[l].setAttribute('aria-label', kb_glightbox.lightBoxAriaLabel);
					}
					kadenceBlocksGLight.foundClasses[i] = false;
					for (let n = 0; n < galleryClass.length; n++) {
						if (galleryClass[n].indexOf('kb-gallery-id') !== -1) {
							foundGalleries[i].classList.add('kb-light-gallery-' + i);
							kadenceBlocksGLight.foundClasses[i] = 'kb-light-gallery-' + i;
							break;
						}
					}
					if ('true' == showCaption && !foundGalleries[i].classList.contains('kb-gallery-non-static')) {
						var foundImages = foundGalleries[i].querySelectorAll('a.kb-gallery-item-link');
						for (let x = 0; x < foundImages.length; x++) {
							var caption = foundImages[x].querySelector('.kadence-blocks-gallery-item__caption');
							if (caption) {
								foundImages[x].setAttribute('data-description', caption.innerText);
							}
						}
					}
					kadenceBlocksGLight.carouselItem[i] = foundGalleries[i].querySelector('.kt-blocks-carousel-init');
					if (kadenceBlocksGLight.carouselItem[i]) {
						if (kadenceBlocksGLight.carouselItem[i].classList.contains('is-initialized')) {
							kadenceBlocksGLight.handleClones(kadenceBlocksGLight.carouselItem[i]);
							if (kadenceBlocksGLight.foundClasses[i]) {
								kadenceBlocksGLight.lightboxes[i] = new GLightbox({
									selector:
										'.' +
										kadenceBlocksGLight.foundClasses[i] +
										' .kb-slide-item:not(.splide__slide--clone) a.kb-gallery-item-link:not([target="_blank"])',
									touchNavigation: true,
									skin: skin,
									loop: true,
									openEffect: 'fade',
									closeEffect: 'fade',
									moreText: kb_glightbox.moreText,
								});
							}
						} else {
							kadenceBlocksGLight.carouselCache[i] = setInterval(function () {
								if (kadenceBlocksGLight.carouselItem[i].classList.contains('is-initialized')) {
									kadenceBlocksGLight.handleClones(kadenceBlocksGLight.carouselItem[i]);
									kadenceBlocksGLight.lightboxes[i] = new GLightbox({
										selector:
											'.' +
											kadenceBlocksGLight.foundClasses[i] +
											' .kb-slide-item:not(.splide__slide--clone) a.kb-gallery-item-link:not([target="_blank"])',
										touchNavigation: true,
										skin: skin,
										loop: true,
										openEffect: 'fade',
										closeEffect: 'fade',
										moreText: kb_glightbox.moreText,
									});
									clearInterval(kadenceBlocksGLight.carouselCache[i]);
								} else {
									console.log('waiting to initialize galllery lightbox');
								}
							}, 200);
						}
					} else if (kadenceBlocksGLight.foundClasses[i]) {
						kadenceBlocksGLight.lightboxes[i] = new GLightbox({
							selector:
								'.' +
								kadenceBlocksGLight.foundClasses[i] +
								' a.kb-gallery-item-link:not([target="_blank"])',
							touchNavigation: true,
							skin: skin,
							loop: true,
							openEffect: 'fade',
							closeEffect: 'fade',
							moreText: kb_glightbox.moreText,
						});
					}
				}
			}
		},
		/**
		 * Initiate the script to process all
		 */
		initAll: function () {
			kadenceBlocksGLight.findGalleries();
		},
		// Initiate the menus when the DOM loads.
		init: function () {
			if (typeof GLightbox == 'function') {
				kadenceBlocksGLight.initAll();
			} else {
				var initLoadDelay = setInterval(function () {
					if (typeof GLightbox == 'function') {
						kadenceBlocksGLight.initAll();
						clearInterval(initLoadDelay);
					}
				}, 200);
			}
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', kadenceBlocksGLight.init);
	} else {
		// The DOM has already been loaded.
		kadenceBlocksGLight.init();
	}
})();
