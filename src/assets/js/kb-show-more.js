/**
 * File kbshowmore.js.
 * Gets the showmore buttons working.
 */
(function () {
	'use strict';
	window.kadenceShowMore = {
		cache: {},
		initShowMore() {
			window.kadenceShowMore.cache = document.querySelectorAll('.wp-block-kadence-show-more');
			if (!window.kadenceShowMore.cache.length) {
				return;
			}
			for (let n = 0; n < window.kadenceShowMore.cache.length; n++) {
				// Initialize listener (backward support)
				const rootElement = window.kadenceShowMore.cache[n];
				const showMoreButton = rootElement.querySelector(
					'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:nth-of-type(1)'
				);
				const showLessButton = rootElement.querySelector(
					'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:nth-of-type(2)'
				);

				if (
					rootElement.querySelector(
						'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:first-child a'
					)
				) {
					rootElement
						.querySelector(
							'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:first-child a'
						)
						.addEventListener('click', function (e) {
							e.preventDefault();
							rootElement.classList.add('kb-smc-open');
							return false;
						});
					rootElement
						.querySelector('.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:last-child a')
						.addEventListener('click', function (e) {
							e.preventDefault();
							rootElement.classList.remove('kb-smc-open');
							return false;
						});
				}
				// Initialize listener
				if (showMoreButton) {
					const showMoreAction = function (e) {
						e.preventDefault();

						rootElement.classList.add('kb-smc-open');
						showMoreButton.setAttribute('aria-hidden', 'true');
						showLessButton.removeAttribute('aria-hidden');
						return false;
					};
					const showLessAction = function (e) {
						e.preventDefault();

						rootElement.classList.remove('kb-smc-open');
						showMoreButton.removeAttribute('aria-hidden');
						showLessButton.setAttribute('aria-hidden', 'true');
						return false;
					};
					showMoreButton.addEventListener('click', showMoreAction);
					showLessButton.addEventListener('click', showLessAction);
					showLessButton.setAttribute('aria-hidden', 'true');
				}
			}
		},
		// Initiate sticky when the DOM loads.
		init() {
			window.kadenceShowMore.initShowMore();
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', window.kadenceShowMore.init);
	} else {
		// The DOM has already been loaded.
		window.kadenceShowMore.init();
	}
	document.addEventListener('kadenceJSInitReload', function () {
		window.kadenceShowMore.init();
	});
	document.addEventListener('kb-query-loaded', function () {
		window.kadenceShowMore.init();
	});
})();
