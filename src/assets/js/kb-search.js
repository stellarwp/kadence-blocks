/**
 * File kb-search.js.
 */
(function () {
	'use strict';
	window.kadenceSearchBlock = {
		cache: {},
		initSearch() {
			window.kadenceSearchBlock.cache = document.querySelectorAll('.kb-search-modal-container');
			if (!window.kadenceSearchBlock.cache.length) {
				console.log('No search block found');
				return;
			}
			console.log(window.kadenceSearchBlock.cache);

			for (let n = 0; n < window.kadenceSearchBlock.cache.length; n++) {
				// Initialize listener (backward support)
				const rootElement = window.kadenceSearchBlock.cache[n];
				const openModalButton = rootElement.querySelector(
					'.wp-block-kadence-advancedbtn > .wp-block-kadence-singlebtn:nth-of-type(1)'
				);
				const modalDiv = rootElement.querySelector('.kb-search-modal');
				const closeModalButton = rootElement.querySelector('.kb-search-modal .kb-search-close-btn');

				// Initialize listener
				if (openModalButton) {
					const showModalButton = function (e) {
						e.preventDefault();
						console.log('showModalButton');
						modalDiv.classList.add('active');
						openModalButton.setAttribute('aria-hidden', 'true');
						closeModalButton.removeAttribute('aria-hidden');
						closeModalButton.setAttribute('aria-expanded', 'true');
						return false;
					};
					const hideModalButton = function (e) {
						e.preventDefault();
						console.log('hideModalButton');
						modalDiv.classList.remove('active');
						openModalButton.removeAttribute('aria-hidden');
						closeModalButton.setAttribute('aria-hidden', 'true');
						closeModalButton.setAttribute('aria-expanded', 'false');
						return false;
					};
					openModalButton.addEventListener('click', showModalButton);
					closeModalButton.addEventListener('click', hideModalButton);
					closeModalButton.setAttribute('aria-hidden', 'true');

					document.addEventListener('keydown', function (e) {
						if (e.key === 'Escape' && modalDiv.classList.contains('active')) {
							hideModalButton(e);
						}
					});
				}
			}
		},
		// Initiate sticky when the DOM loads.
		init() {
			window.kadenceSearchBlock.initSearch();
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', window.kadenceSearchBlock.init);
	} else {
		// The DOM has already been loaded.
		window.kadenceSearchBlock.init();
	}
	document.addEventListener('kadenceJSInitReload', function () {
		window.kadenceSearchBlock.init();
	});
	document.addEventListener('kb-query-loaded', function () {
		window.kadenceSearchBlock.init();
	});
})();
