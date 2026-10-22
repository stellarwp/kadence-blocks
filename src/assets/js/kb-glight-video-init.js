/* global GLightbox */
// cspell:ignore gbtn gclose glight ktblocksvideopop lighbox lightboxes plyr zoomable
/**
 * File kb-glight-video-init.js.
 * Gets video lighbox working for buttons.
 */
(function () {
	'use strict';
	var kadenceBlocksVideoLightbox = {
		lightboxes: {},
		foundClasses: {},
		// Marks an anchor as already processed.
		sanitizedKey: Symbol.for('kadenceBlocksVideoLightboxSanitized'),
		/**
		 * Escape a plain-text string for use in markup.
		 *
		 * @param {string} text The plain text to escape.
		 *
		 * @since 3.8.0.1
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
		 * Normalize an anchor's slide data before GLightbox reads it.
		 *
		 * Only the href and a text caption are kept, and the href is limited to web or relative URLs.
		 *
		 * @param {HTMLElement} el The anchor GLightbox will be bound to.
		 *
		 * @since 3.8.0.1
		 *
		 * @return {void}
		 */
		sanitizeSlideData(el) {
			if (el[kadenceBlocksVideoLightbox.sanitizedKey]) {
				return;
			}
			el[kadenceBlocksVideoLightbox.sanitizedKey] = true;

			const rawTitle = el.dataset.title || el.getAttribute('title') || '';
			// The GLightbox data attributes. Unrelated data attributes, such as the
			// tooltip ones the button renders, are left alone.
			[
				'data-glightbox',
				'data-href',
				'data-sizes',
				'data-srcset',
				'data-type',
				'data-video-provider',
				'data-description',
				'data-alt',
				'data-desc-position',
				'data-effect',
				'data-width',
				'data-height',
				'data-content',
				'data-zoomable',
				'data-draggable',
			].forEach((name) => el.removeAttribute(name));
			el.setAttribute('data-title', kadenceBlocksVideoLightbox.escapeHtml(rawTitle));

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
		 * @since TBD
		 *
		 * @return {string} The selector.
		 */
		sanitizeMatching(selector) {
			document.querySelectorAll(selector).forEach(kadenceBlocksVideoLightbox.sanitizeSlideData);

			return selector;
		},
		/**
		 * Initiate the script to process all
		 */
		initAll() {
			const foundVideos = document.querySelectorAll('.ktblocksvideopop');
			if (!foundVideos.length) {
				return;
			}
			if (foundVideos) {
				for (let i = 0; i < foundVideos.length; i++) {
					foundVideos[i].setAttribute('role', 'button');
					foundVideos[i].setAttribute('aria-haspopup', 'dialog');
					kadenceBlocksVideoLightbox.foundClasses[i] = 'kb-video-pop-' + i;
					foundVideos[i].classList.add('kb-video-pop-' + i);
					kadenceBlocksVideoLightbox.sanitizeSlideData(foundVideos[i]);
					kadenceBlocksVideoLightbox.lightboxes[i] = new GLightbox({
						selector: kadenceBlocksVideoLightbox.sanitizeMatching(
							'.' + kadenceBlocksVideoLightbox.foundClasses[i]
						),
						touchNavigation: true,
						skin: 'kadence-dark',
						loop: false,
						openEffect: 'fade',
						closeEffect: 'fade',
						autoplayVideos: true,
						autofocusVideos: true,
						plyr: {
							css: kadence_video_pop.plyr_css,
							js: kadence_video_pop.plyr_js,
							config: {
								muted: false,
								hideControls: true,
							},
							controls: [
								'play-large',
								'play',
								'progress',
								'current-time',
								'mute',
								'volume',
								'settings',
								'fullscreen',
							],
						},
					});
					kadenceBlocksVideoLightbox.lightboxes[i].on('slide_before_load', (data) => {
						document.querySelector('.gclose.gbtn').focus();
					});
					kadenceBlocksVideoLightbox.lightboxes[i].on('close', () => {
						foundVideos[i].focus();
					});
				}
			}
		},
		// Initiate the menus when the DOM loads.
		init() {
			if (typeof GLightbox == 'function') {
				kadenceBlocksVideoLightbox.initAll();
			} else {
				var initLoadDelay = setInterval(function () {
					if (typeof GLightbox == 'function') {
						kadenceBlocksVideoLightbox.initAll();
						clearInterval(initLoadDelay);
					}
				}, 200);
			}
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', kadenceBlocksVideoLightbox.init);
	} else {
		// The DOM has already been loaded.
		kadenceBlocksVideoLightbox.init();
	}
})();
