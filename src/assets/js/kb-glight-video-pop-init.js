/* global GLightbox */
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
		/**
		 * Initiate the script to process all
		 */
		initAll() {
			const allowedEffects = ['zoom', 'zoomBack', 'fade', 'slide', 'slideBack', 'flip', 'none'];

			kadenceBlocksProVideoLightbox.cache = document.querySelectorAll('.kadence-video-popup-link');
			for (let i = 0; i < kadenceBlocksProVideoLightbox.cache.length; i++) {
				var effect = allowedEffects[0];
				var attrEffect = kadenceBlocksProVideoLightbox.cache[i].getAttribute('data-effect');
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
						kadenceBlocksProVideoLightbox.trigger[i].open();
					});
				} else {
					if (device === 'mobile') {
						const mobileHref = kadenceBlocksProVideoLightbox.cache[i]?.getAttribute('data-href-mobile');
						if (mobileHref) {
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
			} else {
				return 'mobile';
			}
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
