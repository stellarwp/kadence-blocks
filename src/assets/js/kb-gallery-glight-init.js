// cSpell:ignore galllery glightbox lightboxes
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
		// The anchors the gallery block renders.
		linkSelector: '.kadence-blocks-gallery-item a.kb-gallery-item-link',
		// Marks an anchor as already processed.
		sanitizedKey: Symbol.for('kadenceBlocksGLightSanitized'),
		// The data attributes kept on a gallery anchor.
		allowedDataAttributes: ['data-title', 'data-description', 'data-alt'],
		// The caption tags and attributes the gallery allows (matches the gallery's server-side filter).
		allowedCaptionTags: '<a><br><b><i><u><p><ol><ul><li><strong><small>',
		allowedCaptionAttributes: { a: ['href', 'target', 'rel'] },
		simulateClick(elem) {
			// Create our event (with options)
			const evt = new MouseEvent('click', {
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
		handleClones(element) {
			const foundClones = element.querySelectorAll(
				'.kb-slide-item.splide__slide--clone ' + kadenceBlocksGLight.linkSelector
			);
			const foundRegular = element.querySelectorAll(
				'.kb-slide-item:not(.splide__slide--clone) ' + kadenceBlocksGLight.linkSelector
			);
			for (let c = 0; c < foundClones.length; c++) {
				foundClones[c].addEventListener('click', function (event) {
					event.preventDefault();
					const the_href = foundClones[c].getAttribute('href');
					for (let b = 0; b < foundRegular.length; b++) {
						if (the_href === foundRegular[b].getAttribute('href')) {
							kadenceBlocksGLight.simulateClick(foundRegular[b]);
							break;
						}
					}
				});
			}
		},
		strip_tags(input, allowed) {
			const allowedTags = (allowed || '').toLowerCase().match(/[a-z][a-z0-9]*/g) || [];
			const isSafeUrl = (url) => {
				try {
					return ['http:', 'https:', 'mailto:', 'tel:'].includes(new URL(url, window.location.href).protocol);
				} catch (error) {
					return false;
				}
			};
			const body = new DOMParser().parseFromString(input, 'text/html').body;

			body.querySelectorAll('*').forEach((element) => {
				if (!allowedTags.includes(element.localName)) {
					element.replaceWith(...element.childNodes);
					return;
				}
				const allowedAttributes = kadenceBlocksGLight.allowedCaptionAttributes[element.localName] || [];
				[...element.attributes].forEach(({ name, value }) => {
					if (!allowedAttributes.includes(name) || ('href' === name && !isSafeUrl(value))) {
						element.removeAttribute(name);
					}
				});
			});

			return body.innerHTML;
		},
		/**
		 * Escape a plain-text string for use in markup.
		 *
		 * @param {string} text The plain text to escape.
		 *
		 * @since 3.8.0.2
		 *
		 * @return {string} The escaped text.
		 */
		escapeHtml(text) {
			const map = {
				'&': '&amp;',
				'<': '&lt;',
				'>': '&gt;',
				'"': '&quot;',
				"'": '&#x27;',
			};
			return String(text).replace(/[&<>"']/g, (match) => map[match]);
		},
		/**
		 * Reduce a caption to the markup the gallery allows.
		 *
		 * @param {string} raw The caption, as markup.
		 *
		 * @since 3.8.0.2
		 *
		 * @return {string} The safe caption.
		 */
		sanitizeDescription(raw) {
			const description = kadenceBlocksGLight.strip_tags(raw, kadenceBlocksGLight.allowedCaptionTags);

			// Wrap values that would otherwise be read as something other than text.
			return '.' === description.charAt(0) || 'true' === description || 'false' === description
				? '<p>' + description + '</p>'
				: description;
		},
		/**
		 * Normalize the slide data on a gallery anchor before GLightbox reads it.
		 *
		 * Only the allowed data attributes are kept, the title is escaped, and the description is reduced to the
		 * caption markup the gallery already allows.
		 *
		 * @param {HTMLElement} el The anchor GLightbox will be bound to.
		 *
		 * @since 3.8.0.2
		 *
		 * @return {void}
		 */
		sanitizeSlideData(el) {
			if (el[kadenceBlocksGLight.sanitizedKey]) {
				return;
			}
			el[kadenceBlocksGLight.sanitizedKey] = true;

			const rawTitle = el.dataset.title || el.getAttribute('title') || '';
			const description = el.getAttribute('data-description');

			[...el.attributes].forEach(({ name }) => {
				if (name.startsWith('data-') && !kadenceBlocksGLight.allowedDataAttributes.includes(name)) {
					el.removeAttribute(name);
				}
			});
			// Remove description content nested inside the anchor.
			el.querySelectorAll('.glightbox-desc').forEach((child) => child.remove());

			el.setAttribute('data-title', kadenceBlocksGLight.escapeHtml(rawTitle));
			if (description) {
				el.setAttribute('data-description', kadenceBlocksGLight.sanitizeDescription(description));
			} else {
				el.removeAttribute('data-description');
			}

			// Limit the href to web URLs that contain no quote, bracket, backtick or whitespace characters.
			if (
				el.hasAttribute('href') &&
				(!['http:', 'https:'].includes(el.protocol) || /["'<>`\s]/.test(el.getAttribute('href').trim()))
			) {
				el.removeAttribute('href');
			}
		},
		/**
		 * Normalize every anchor a selector matches, so the lightbox only binds anchors that have been processed.
		 *
		 * @param {string} selector The selector the lightbox will bind.
		 *
		 * @since 3.8.0.2
		 *
		 * @return {string} The selector.
		 */
		sanitizeMatching(selector) {
			document.querySelectorAll(selector).forEach(kadenceBlocksGLight.sanitizeSlideData);

			return selector;
		},
		findGalleries() {
			const foundGalleries = document.querySelectorAll('.kb-gallery-magnific-init');
			if (!foundGalleries.length) {
				return;
			}
			if (foundGalleries) {
				for (let i = 0; i < foundGalleries.length; i++) {
					const galleryClass = foundGalleries[i].classList;
					const filter = foundGalleries[i].getAttribute('data-image-filter');
					const skin = filter ? 'kadence-dark kb-gal-light-filter-' + filter : 'kadence-dark';
					const showCaption = foundGalleries[i].getAttribute('data-lightbox-caption');
					const galleryLinks = foundGalleries[i].querySelectorAll(kadenceBlocksGLight.linkSelector);
					for (let l = 0; l < galleryLinks.length; l++) {
						kadenceBlocksGLight.sanitizeSlideData(galleryLinks[l]);
						galleryLinks[l].setAttribute('aria-label', kb_glightbox.lightBoxAriaLabel + ' ' + (l + 1));
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
						// Static gallery is basically only for backward compatibility.
						const foundImages = foundGalleries[i].querySelectorAll(kadenceBlocksGLight.linkSelector);
						for (let x = 0; x < foundImages.length; x++) {
							const caption = foundImages[x].querySelector('.kadence-blocks-gallery-item__caption');
							if (caption) {
								foundImages[x].setAttribute(
									'data-description',
									kadenceBlocksGLight.sanitizeDescription(caption.innerText)
								);
							}
						}
					}
					kadenceBlocksGLight.carouselItem[i] = foundGalleries[i].querySelector('.kt-blocks-carousel-init');
					if (kadenceBlocksGLight.carouselItem[i]) {
						if (kadenceBlocksGLight.carouselItem[i].classList.contains('is-initialized')) {
							kadenceBlocksGLight.handleClones(kadenceBlocksGLight.carouselItem[i]);
							if (kadenceBlocksGLight.foundClasses[i]) {
								kadenceBlocksGLight.lightboxes[i] = new GLightbox({
									selector: kadenceBlocksGLight.sanitizeMatching(
										'.' +
											kadenceBlocksGLight.foundClasses[i] +
											' .kb-slide-item:not(.splide__slide--clone) ' +
											kadenceBlocksGLight.linkSelector +
											':not([target="_blank"])'
									),
									touchNavigation: true,
									skin,
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
										selector: kadenceBlocksGLight.sanitizeMatching(
											'.' +
												kadenceBlocksGLight.foundClasses[i] +
												' .kb-slide-item:not(.splide__slide--clone) ' +
												kadenceBlocksGLight.linkSelector +
												':not([target="_blank"])'
										),
										touchNavigation: true,
										skin,
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
							selector: kadenceBlocksGLight.sanitizeMatching(
								'.' +
									kadenceBlocksGLight.foundClasses[i] +
									' ' +
									kadenceBlocksGLight.linkSelector +
									':not([target="_blank"])'
							),
							touchNavigation: true,
							skin,
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
		initAll() {
			kadenceBlocksGLight.findGalleries();
		},
		// Initiate the menus when the DOM loads.
		init() {
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
