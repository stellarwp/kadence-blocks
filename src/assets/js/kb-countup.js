/* global CountUp */
/**
 * File kb-countup.js.
 * Gets the countup running in viewport.
 */
(function () {
	'use strict';
	window.kadenceCountUp = {
		cache: {},
		countUpItems: {},
		listenerCache: {},
		isInViewport(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.left >= -300 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 300
			);
		},
		stripHtml(html) {
			const wrappedHtml = `<pre>${html}</pre>`;
			const doc = new DOMParser().parseFromString(wrappedHtml, 'text/html');

			return doc.body.textContent || '';
		},
		initScrollSpy() {
			window.kadenceCountUp.countUpItems = document.querySelectorAll('.kb-count-up');
			if (!window.kadenceCountUp.countUpItems.length) {
				return;
			}
			for (let n = 0; n < window.kadenceCountUp.countUpItems.length; n++) {
				const self = window.kadenceCountUp.countUpItems[n],
					start = self.dataset.start,
					end = self.dataset.end,
					prefix = window.kadenceCountUp.stripHtml(self.dataset.prefix),
					suffix = window.kadenceCountUp.stripHtml(self.dataset.suffix),
					duration = self.dataset.duration,
					separator = window.kadenceCountUp.stripHtml(self.dataset.separator),
					decimal = self.dataset.decimal ? self.dataset.decimal : false,
					decimalSpaces = self.dataset.decimalSpaces ? self.dataset.decimalSpaces : false,
					el = self.querySelector('.kb-count-up-process');
				let theSeparator = separator === 'true' ? ',' : separator;
				theSeparator = theSeparator === 'false' ? '' : theSeparator;
				const KbCounterOptions = {
					startVal: start ? start : 0,
					duration: duration ? duration : 2,
					prefix: prefix ? prefix : '',
					suffix: suffix ? suffix : '',
					separator: theSeparator,
					decimal,
					decimalPlaces: decimalSpaces,
				};
				window.kadenceCountUp.cache[n] = new countUp.CountUp(el, end, KbCounterOptions);
				window.kadenceCountUp.accessabilityModifications(el, end, prefix, suffix);
				// Initialize listener
				window.kadenceCountUp.listenerCache[n] = window.kadenceCountUp.listener(n);
				document.addEventListener('scroll', window.kadenceCountUp.listenerCache[n], { passive: true });
				window.kadenceCountUp.startCountUp(n);
			}
		},
		accessabilityModifications(el, end, prefix, suffix) {
			const div = document.createElement('div');
			div.classList.add('screen-reader-text');
			div.innerHTML = prefix + end + suffix;
			el.before(div);
			el.setAttribute('aria-hidden', 'true');
		},
		/**
		 * Start Listener.
		 */
		listener(index) {
			return function curried_func(e) {
				window.kadenceCountUp.startCountUp(index);
			};
		},
		/**
		 * Start function.
		 */
		startCountUp(index) {
			if (window.kadenceCountUp.isInViewport(window.kadenceCountUp.countUpItems[index])) {
				if (!window.kadenceCountUp.cache[index].error) {
					const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
					
					if (prefersReducedMotion) {
						window.kadenceCountUp.cache[index].printValue(window.kadenceCountUp.cache[index].endVal);
					} else {
						window.kadenceCountUp.cache[index].start();
					}
				}
				document.removeEventListener('scroll', window.kadenceCountUp.listenerCache[index], false);
			}
		},
		// Initiate sticky when the DOM loads.
		init() {
			window.kadenceCountUp.initScrollSpy();
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', window.kadenceCountUp.init);
	} else {
		// The DOM has already been loaded.
		window.kadenceCountUp.init();
	}
})();
