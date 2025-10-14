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
		sliderEventCache: {},
		isInViewport(el) {
			const rect = el.getBoundingClientRect();
			return (
				rect.top >= 0 &&
				rect.left >= -300 &&
				rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
				rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 300
			);
		},
		isInActiveSlide(el) {
			// Check if element is inside a slider
			const slider = el.closest('.kb-splide, .splide');
			if (!slider) {
				return true; // Not in a slider, so always consider it "active"
			}
			
			// Find the active slide
			const activeSlide = slider.querySelector('.splide__slide.is-active');
			if (!activeSlide) {
				return true; // No active slide found, default to true
			}
			
			// Check if the countup element is within the active slide
			return activeSlide.contains(el);
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
				// Setup slider listeners if in a slider
				window.kadenceCountUp.setupSliderListeners(n);
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
		setupSliderListeners(index) {
			const countUpItem = window.kadenceCountUp.countUpItems[index];
			const slider = countUpItem.closest('.kb-splide, .splide');
			
			if (!slider) {
				return; // Not in a slider, no need for slider listeners
			}
			
			// Create event handlers
			const mountedHandler = (e) => {
				window.kadenceCountUp.startCountUp(index);
			};
			
			const movedHandler = (e) => {
				window.kadenceCountUp.startCountUp(index);
			};
			
			// Add event listeners
			slider.addEventListener('splideMounted', mountedHandler);
			slider.addEventListener('splide:moved', movedHandler);
			
			// Store references for cleanup
			window.kadenceCountUp.sliderEventCache[index] = [
				{ element: slider, event: 'splideMounted', handler: mountedHandler },
				{ element: slider, event: 'splide:moved', handler: movedHandler }
			];
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
			const countUpItem = window.kadenceCountUp.countUpItems[index];
			if (window.kadenceCountUp.isInViewport(countUpItem) && window.kadenceCountUp.isInActiveSlide(countUpItem)) {
				if (!window.kadenceCountUp.cache[index].error) {
					const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

					if (prefersReducedMotion) {
						window.kadenceCountUp.cache[index].printValue(window.kadenceCountUp.cache[index].endVal);
					} else {
						window.kadenceCountUp.cache[index].start();
					}
				}
				document.removeEventListener('scroll', window.kadenceCountUp.listenerCache[index], false);
				// Also remove slider event listeners if they exist
				if (window.kadenceCountUp.sliderEventCache[index]) {
					window.kadenceCountUp.sliderEventCache[index].forEach(listener => {
						listener.element.removeEventListener(listener.event, listener.handler);
					});
					delete window.kadenceCountUp.sliderEventCache[index];
				}
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
