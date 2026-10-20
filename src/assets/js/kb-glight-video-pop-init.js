/* global GLightbox */
// cspell:ignore glight lighbox plyr zoomable
/**
 * File kb-glight-video-init.js.
 * Gets video lighbox working for video popup.
 */

(function () {
	'use strict';
	var kadenceBlocksProVideoLightbox = {
		cache: [],
		wrapper: [],
		trigger: [],
		// The effect each anchor asked for, kept here because the attribute itself is removed before GLightbox reads it.
		effects: new WeakMap(),
		// Marks an anchor as sanitized on the element itself, so a re-run (even from a second copy of this script)
		// does not escape its title a second time.
		sanitizedKey: Symbol.for('kadenceBlocksProVideoLightboxSanitized'),
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
		 * Check that a URL is a web or relative URL.
		 *
		 * @param {string} url The URL to check.
		 *
		 * @since TBD
		 *
		 * @return {boolean} Whether the URL resolves to http or https.
		 */
		isWebUrl(url) {
			try {
				return ['http:', 'https:'].includes(new URL(url, window.location.href).protocol);
			} catch (error) {
				return false;
			}
		},
		/**
		 * Make an anchor's slide data safe before GLightbox reads it.
		 *
		 * GLightbox reads every one of its slide settings from the anchor's data attributes and writes several of
		 * them (title, description, video provider, width) into markup it sets with innerHTML. Only the href and a
		 * text caption are used here, so every other GLightbox setting is dropped, the caption is escaped, and the
		 * href is limited to web or relative URLs. The attributes this script reads itself are left alone.
		 *
		 * @param {HTMLElement} el The anchor GLightbox will be bound to.
		 *
		 * @since TBD
		 *
		 * @return {void}
		 */
		sanitizeSlideData(el) {
			if (el[kadenceBlocksProVideoLightbox.sanitizedKey]) {
				return;
			}
			el[kadenceBlocksProVideoLightbox.sanitizedKey] = true;

			const rawTitle = el.dataset.title || el.getAttribute('title') || '';
			kadenceBlocksProVideoLightbox.effects.set(el, el.getAttribute('data-effect'));
			// Every setting GLightbox reads from an anchor's dataset.
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
			el.setAttribute('data-title', kadenceBlocksProVideoLightbox.escapeHtml(rawTitle));

			// el.protocol is the resolved scheme.
			if (el.hasAttribute('href') && !['http:', 'https:'].includes(el.protocol)) {
				el.removeAttribute('href');
			}
		},
		/**
		 * Initiate the script to process all
		 */
		initAll() {
			const allowedEffects = ['zoom', 'zoomBack', 'fade', 'slide', 'slideBack', 'flip', 'none'];

			kadenceBlocksProVideoLightbox.cache = document.querySelectorAll('.kadence-video-popup-link');
			// Sanitize every anchor first, because one GLightbox instance binds all anchors that share a popup class.
			kadenceBlocksProVideoLightbox.cache.forEach(kadenceBlocksProVideoLightbox.sanitizeSlideData);
			for (let i = 0; i < kadenceBlocksProVideoLightbox.cache.length; i++) {
				var effect = allowedEffects[0];
				var attrEffect = kadenceBlocksProVideoLightbox.effects.get(kadenceBlocksProVideoLightbox.cache[i]);
				if (allowedEffects.includes(attrEffect)) {
					effect = attrEffect;
				} else if ('fade-right' == attrEffect || 'fade-left' == attrEffect) {
					effect = 'fade';
				} else if ('slide-right' == attrEffect) {
					effect = 'slideBack';
				} else if ('slide-left' == attrEffect) {
					effect = 'slide';
				} else if ('zoom-out' == attrEffect) {
					effect = 'zoomBack';
				} else if ('3d-unfold' == attrEffect) {
					effect = 'flip';
				}

				const isLocalMedia =
					kadenceBlocksProVideoLightbox.cache[i].classList.contains('kadence-video-type-local');
				const popupId = kadenceBlocksProVideoLightbox.cache[i].getAttribute('data-popup-id');
				const popupClassWithId = kadenceBlocksProVideoLightbox.cache[i].getAttribute('data-popup-class');
				const popupAuto =
					kadenceBlocksProVideoLightbox.cache[i].getAttribute('data-popup-auto') === 'true' ? true : false;
				const youtubeCookies =
					kadenceBlocksProVideoLightbox.cache[i].getAttribute('data-youtube-cookies') === 'true'
						? true
						: false;

				const device = kadenceBlocksProVideoLightbox.getActiveSize();
				const mediaRatio = kadenceBlocksProVideoLightbox.cache[i].getAttribute('data-media-ratio') ?? '16:9';
				const mediaRatioMobile =
					kadenceBlocksProVideoLightbox.cache[i].getAttribute('data-media-ratio-mobile') ?? '';
				const mediaRatioToUse = device === 'mobile' && mediaRatioMobile ? mediaRatioMobile : mediaRatio;

				if (isLocalMedia) {
					kadenceBlocksProVideoLightbox.wrapper[i] = document.getElementById(popupId);

					if (device === 'mobile') {
						const videoElement =
							kadenceBlocksProVideoLightbox.wrapper[i]?.querySelector('.kadence-local-video-popup');
						const mobileSrc = videoElement?.getAttribute('data-src-mobile');
						if (videoElement && mobileSrc) {
							videoElement.setAttribute('src', mobileSrc);
						}
					}

					kadenceBlocksProVideoLightbox.cache[i].addEventListener('click', function (event) {
						event.preventDefault();
						kadenceBlocksProVideoLightbox.trigger[i] = GLightbox({
							elements: [
								{
									href: kadenceBlocksProVideoLightbox.wrapper[i]
										.querySelector('.kadence-local-video-popup')
										.getAttribute('src'),
									type: 'video',
									source: 'local',
								},
							],
							touchNavigation: true,
							skin: 'kadence-dark ' + popupClassWithId,
							loop: false,
							openEffect: effect,
							closeEffect: effect,
							autoplayVideos: popupAuto,
							preload: false,
							plyr: {
								css: kadence_pro_video_pop.plyr_css,
								js: kadence_pro_video_pop.plyr_js,
								config: {
									ratio: mediaRatioToUse,
									hideControls: true,
								},
							},
							cssEfects: {
								flip: { in: 'flipIn', out: 'flipOut' },
								zoomBack: { in: 'zoomBackIn', out: 'zoomBackOut' },
							},
						});
						kadenceBlocksProVideoLightbox.trigger[i].on('close', () => {
							document.querySelectorAll('video.kadence-video-poster').forEach((video) => {
								video.play();
							});
						});
						kadenceBlocksProVideoLightbox.trigger[i].on('open', () => {
							document.querySelectorAll('video.kadence-video-poster').forEach((video) => {
								video.pause();
							});
						});
						kadenceBlocksProVideoLightbox.trigger[i].open();
					});
				} else {
					if (device === 'mobile') {
						const mobileHref = kadenceBlocksProVideoLightbox.cache[i]?.getAttribute('data-href-mobile');
						if (mobileHref && kadenceBlocksProVideoLightbox.isWebUrl(mobileHref)) {
							kadenceBlocksProVideoLightbox.cache[i].setAttribute('href', mobileHref);
						}
					}

					const lightbox = GLightbox({
						selector: '.kadence-video-popup-link[data-popup-class="' + popupClassWithId + '"]',
						touchNavigation: true,
						skin: 'kadence-dark',
						loop: false,
						openEffect: effect,
						closeEffect: effect,
						autoplayVideos: popupAuto,
						preload: false,
						plyr: {
							css: kadence_pro_video_pop.plyr_css,
							js: kadence_pro_video_pop.plyr_js,
							config: {
								hideControls: true,
								ratio: mediaRatioToUse,
								youtube: {
									noCookie: youtubeCookies,
								},
								vimeo: {
									dnt: youtubeCookies,
								},
							},
						},
						cssEfects: {
							flip: { in: 'flipIn', out: 'flipOut' },
							zoomBack: { in: 'zoomBackIn', out: 'zoomBackOut' },
						},
					});
					lightbox.on('slide_before_load', (data) => {
						const ligthboxBody = document.getElementById('glightbox-body');
						if (popupClassWithId && ligthboxBody) {
							ligthboxBody.classList = '';
							ligthboxBody.classList.add('glightbox-container');
							ligthboxBody.classList.add('glightbox-kadence-dark');
							ligthboxBody.classList.add(popupClassWithId);
						}
					});

					lightbox.on('slide_after_load', (data) => {
						// Check for hash in Vimeo URL (unlisted video)
						const regex = /^(.*vimeo.com\/|.*video\/)?(\d+)(\?.*&*h=|\/)+([\d,a-f]+)/;
						const found = data.slideConfig.href.match(regex);
						if (found) {
							// If hash is found, append it to the iframe src
							const iframe = data.slideNode.querySelector('iframe');
							iframe.src = iframe.src + '&h=' + found[found.length - 1];
						}
					});
					lightbox.on('close', () => {
						document.querySelectorAll('video.kadence-video-poster').forEach((video) => {
							video.play();
						});
					});
					lightbox.on('open', () => {
						document.querySelectorAll('video.kadence-video-poster').forEach((video) => {
							video.pause();
						});
					});
				}
			}
		},
		// Initiate the menus when the DOM loads.
		init() {
			if (typeof GLightbox == 'function') {
				kadenceBlocksProVideoLightbox.initAll();
			} else {
				var initLoadDelay = setInterval(function () {
					if (typeof GLightbox == 'function') {
						kadenceBlocksProVideoLightbox.initAll();
						clearInterval(initLoadDelay);
					}
				}, 200);
			}
		},

		getActiveSize() {
			const mobileBreakpoint = 768;
			if (mobileBreakpoint < window.innerWidth) {
				return 'desktop';
			}
			return 'mobile';
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', kadenceBlocksProVideoLightbox.init);
		document.addEventListener('kb-query-loaded', kadenceBlocksProVideoLightbox.init);
	} else {
		// The DOM has already been loaded.
		kadenceBlocksProVideoLightbox.init();
	}
})();
