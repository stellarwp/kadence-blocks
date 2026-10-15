/* global GLightbox */
// cspell:ignore gbtn gclose glight ktblocksvideopop lighbox lightboxes plyr
/**
 * File kb-glight-video-init.js.
 * Gets video lighbox working for buttons.
 */
(function () {
	'use strict';
	var kadenceBlocksVideoLightbox = {
		lightboxes: {},
		foundClasses: {},
		/**
		 * Escape a plain-text string so it is safe to be written with innerHTML.
		 *
		 * @param {string} text The plain text to escape.
		 *
		 * @since TBD
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
		 * Make an anchor's caption data safe before GLightbox reads it.
		 *
		 * GLightbox writes the slide title with innerHTML, taking it from the data-glightbox / data-title
		 * attributes or the title attribute, all of which the browser has already entity-decoded. Replace
		 * them with an escaped data-title so the caption renders as text.
		 *
		 * @param {HTMLElement} el The anchor GLightbox will be bound to.
		 *
		 * @since TBD
		 *
		 * @return {void}
		 */
		sanitizeCaption(el) {
			const rawTitle = el.dataset.title || el.getAttribute('title') || '';
			el.removeAttribute('data-glightbox');
			el.removeAttribute('data-description');
			el.setAttribute('data-title', kadenceBlocksVideoLightbox.escapeHtml(rawTitle));
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
					kadenceBlocksVideoLightbox.sanitizeCaption(foundVideos[i]);
					kadenceBlocksVideoLightbox.lightboxes[i] = new GLightbox({
						selector: '.' + kadenceBlocksVideoLightbox.foundClasses[i],
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
