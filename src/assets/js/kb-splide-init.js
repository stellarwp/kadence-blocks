/* global kb_splide */

(function () {
	'use strict';
	var kadenceBlocksSplide = {
		initAll() {
			const advancedSliders = document.querySelectorAll(
				'.wp-block-kadence-advancedgallery .kt-blocks-carousel-init'
			);
			this.bootstrapSliders(advancedSliders, true);

			const testimonialSliders = document.querySelectorAll(
				'.wp-block-kadence-testimonials .kt-blocks-carousel-init'
			);
			this.bootstrapSliders(testimonialSliders);

			const bgSliders = document.querySelectorAll('.kb-blocks-bg-slider > .kt-blocks-carousel-init');
			this.bootstrapSliders(bgSliders);
		},

		initAllOptimized() {
			// Use intersection observer for optimized pages.
			const allSliders = document.querySelectorAll(
				'.wp-block-kadence-advancedgallery .kt-blocks-carousel-init, ' +
					'.wp-block-kadence-testimonials .kt-blocks-carousel-init, ' +
					'.kb-blocks-bg-slider > .kt-blocks-carousel-init'
			);

			if (allSliders.length === 0) {
				return;
			}

			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const slider = entry.target;
							observer.unobserve(slider);
							// Detect if it's an advanced slider based on parent class
							const isAdvanced = Boolean(slider.closest('.wp-block-kadence-advancedgallery'));
							this.deferSliderInit(slider, isAdvanced);
						}
					});
				},
				{
					rootMargin: '150px 0px',
				}
			);

			allSliders.forEach((slider) => {
				observer.observe(slider);
			});
		},

		/**
		 * Defers slider initialization until the browser's execution stack is clear
		 * and the browser is idle, helping ensure 3rd party scripts have completed
		 * their DOM modifications before initializing sliders.
		 *
		 * @param {Element} slider - The slider element to initialize
		 * @param {boolean} isAdvanced - Whether this is an advanced slider
		 */
		deferSliderInit(slider, isAdvanced = false) {
			// Wait for current execution stack to clear
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					// Wait for browser to be idle
					if ('requestIdleCallback' in window) {
						requestIdleCallback(
							() => {
								this.bootstrapSliders([slider], isAdvanced);
							},
							{ timeout: 1000 }
						);
					} else {
						// Fallback for browsers without requestIdleCallback
						setTimeout(() => {
							this.bootstrapSliders([slider], isAdvanced);
						}, 100);
					}
				});
			});
		},

		bootstrapSliders(elementList, isAdvanced = false) {
			if (!elementList || elementList.length === 0) {
				return;
			}

			for (let i = 0; i < elementList.length; i++) {
				const listElement = elementList[i];
				let thisSlider;
				let slideCount;

				if (isAdvanced) {
					// Advanced sliders: listElement is a child, find the parent slider
					if (!listElement || listElement.classList.contains('is-initialized')) {
						continue;
					}

					// Check if listElement itself is the slider (for thumbnail sliders)
					// Thumbnail sliders have both kt-blocks-carousel-init and splide classes
					if (
						listElement.classList.contains('splide') &&
						listElement.classList.contains('kt-blocks-carousel-init')
					) {
						// This element IS the slider itself
						thisSlider = listElement;
					} else {
						// Find the parent .kt-blocks-carousel.splide element which is the Splide root
						thisSlider = listElement.closest('.kt-blocks-carousel.splide');
						if (!thisSlider) {
							// Fallback: if no splide class found, try to find parent .kt-blocks-carousel
							thisSlider = listElement.closest('.kt-blocks-carousel');
							if (thisSlider) {
								thisSlider.classList.add('splide');
							} else {
								continue;
							}
						}
					}

					if (thisSlider.classList.contains('is-initialized')) {
						continue;
					}

					// For advanced sliders, determine the correct wrapper element for createSplideElements
					// If thisSlider === listElement, use thisSlider; otherwise use listElement to find slides
					const wrapperElem = thisSlider === listElement ? thisSlider : listElement;
					slideCount = this.createSplideElements(wrapperElem);
				} else {
					// Regular sliders: listElement is the slider itself
					thisSlider = listElement;
					if (!thisSlider || !thisSlider.children || thisSlider.classList.contains('is-initialized')) {
						continue;
					}

					slideCount = this.createSplideElements(thisSlider);
				}

				thisSlider.classList.add('kb-splide');

				const parsedData = this.parseDataset(thisSlider.dataset);
				const inHiddenMenu = Boolean(thisSlider.closest('.kadence-menu-mega-enabled'));

				if (document.querySelector('html[dir="rtl"]')) {
					parsedData.sliderDirection = 'rtl';
				} else {
					parsedData.sliderDirection = 'ltr';
				}

				thisSlider.addEventListener('load', function (elem) {
					elem.classList.remove('kt-post-carousel-loading');
				});

				const splideOptions = this.getSplideOptions(parsedData);
				// Add this to remove slick based css from hiding elements
				thisSlider.classList.add('splide-initialized');
				thisSlider.classList.add('splide-slider');

				const { sliderType } = parsedData;

				if (sliderType && sliderType === 'fluidcarousel') {
					const slideItems = thisSlider.querySelectorAll('.kb-slide-item');
					slideItems.forEach(function (elem) {
						if (!thisSlider.clientWidth) {
							elem.style.maxWidth = '100%';
						} else {
							elem.style.maxWidth = Math.floor((80 / 100) * thisSlider.clientWidth) + 'px';
						}
					});
					const childCount = slideItems.length;
					const splideSlider = new Splide(thisSlider, {
						...splideOptions,
						focus: parsedData.sliderCenterMode !== false ? 'center' : 0,
						autoWidth: true,
						preloadPages: childCount <= 1 ? 0 : Math.floor(childCount / 2),
						arrows: childCount > 1 ? splideOptions.arrows : false,
						pagination: childCount > 1 ? splideOptions.pagination : false,
						drag: childCount > 1 ? splideOptions.drag : false,
						clones: childCount > 1 ? undefined : 0, // Toggle clones
					});
					splideSlider.on('pagination:mounted', function () {
						var paginationButtons = thisSlider.querySelectorAll('.splide__pagination__page');
						paginationButtons.forEach(function (button) {
							button.addEventListener('keydown', function (event) {
								// Check if space bar or return/enter is pressed
								if (event.key === ' ' || event.key === 'Enter') {
									event.preventDefault();
									var activeSlideIndex = splideSlider?.index || 0;
									var activeSlide = splideSlider?.Components?.Slides?.getAt(activeSlideIndex)?.slide;
									if (activeSlide) {
										activeSlide.setAttribute('tabindex', '0');
										activeSlide.focus();
									}
								}
							});
						});
					});
					splideSlider.mount();

					var resizeTimer;
					const resizeHandler = function (e) {
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(function () {
							thisSlider.querySelectorAll('.kb-slide-item').forEach(function (elem) {
								elem.style.maxWidth = Math.floor((80 / 100) * thisSlider.clientWidth) + 'px';
							});
						}, 10);
					};
					window.addEventListener('resize', resizeHandler);
				} else if (sliderType && sliderType === 'slider') {
					if (undefined === parsedData.sliderFade) {
						splideOptions.type = 'fade';
					} else {
						splideOptions.type = parsedData.sliderFade ? 'fade' : 'slide';
					}
					splideOptions.rewind = true;
					const splideSlider = new Splide(thisSlider, splideOptions);
					splideSlider.on('overflow', function (isOverflow) {
						splideSlider.options = {
							arrows: slideCount === 1 ? false : splideOptions.arrows,
							pagination: slideCount === 1 ? false : splideOptions.pagination,
							drag: slideCount === 1 ? false : splideOptions.drag,
						};
					});
					splideSlider.on('pagination:mounted', function () {
						var paginationButtons = thisSlider.querySelectorAll('.splide__pagination__page');
						paginationButtons.forEach(function (button) {
							button.addEventListener('keydown', function (event) {
								// Check if space bar or return/enter is pressed
								if (event.key === ' ' || event.key === 'Enter') {
									event.preventDefault();
									var activeSlideIndex = splideSlider?.index || 0;
									var activeSlide = splideSlider?.Components?.Slides?.getAt(activeSlideIndex)?.slide;
									if (activeSlide) {
										activeSlide.setAttribute('tabindex', '0');
										activeSlide.focus();
									}
								}
							});
						});
					});
					splideSlider.mount();
				} else if (sliderType && sliderType === 'thumbnail') {
					const navSliderId = parsedData.sliderNav;
					const navSlider = document.querySelector('#' + navSliderId);

					if (!navSlider) {
						continue;
					}

					// Ensure nav slider has splide class (structure should already be correct from PHP)
					if (!navSlider.classList.contains('splide')) {
						navSlider.classList.add('splide');
					}
					navSlider.classList.add('kb-splide');

					this.createSplideElements(navSlider);

					// Switch the datasets for the nav and main slider elements
					const mainSliderParsedData = this.parseDataset(navSlider.dataset);
					const mainSliderOptions = this.getSplideOptions(mainSliderParsedData);
					const navSliderOptions = splideOptions;
					navSliderOptions.isNavigation = true;
					navSliderOptions.pagination = false;
					navSliderOptions.type = 'loop';
					navSliderOptions.arrows = true;
					// navSliderOptions.rewind = true;

					mainSliderOptions.type =
						mainSliderParsedData.sliderFade || undefined === mainSliderParsedData.sliderFade
							? 'fade'
							: 'slide';
					mainSliderOptions.rewind = true;
					mainSliderOptions.pagination = false;
					mainSliderOptions.direction = navSliderOptions.direction;

					navSlider.classList.add('slick-initialized');
					navSlider.classList.add('slick-slider');

					const carouselSlider = new Splide(thisSlider, mainSliderOptions);
					const thumbnailSlider = new Splide(navSlider, navSliderOptions);
					thumbnailSlider.on('overflow', function (isOverflow) {
						// Reset the carousel position
						thumbnailSlider.go(0);

						thumbnailSlider.options = {
							arrows: navSliderOptions.arrows ? isOverflow : false,
							pagination: navSliderOptions.pagination ? isOverflow : false,
							drag: navSliderOptions.drag ? isOverflow : false,
							rewind: !isOverflow,
							type: !isOverflow ? 'slide' : navSliderOptions.type,
							clones: isOverflow ? undefined : 0, // Toggle clones
						};
					});
					carouselSlider.sync(thumbnailSlider);
					carouselSlider.mount();
					thumbnailSlider.mount();
				} else if (sliderType && sliderType === 'rewind') {
					splideOptions.type = 'slide';
					splideOptions.rewind = true;
					const splideSlider = new Splide(thisSlider, splideOptions);
					if (!inHiddenMenu) {
						splideSlider.on('overflow', function (isOverflow) {
							// Reset the carousel position
							splideSlider.go(0);

							splideSlider.options = {
								arrows: splideOptions.arrows ? isOverflow : false,
								pagination: splideOptions.pagination ? isOverflow : false,
								drag: splideOptions.drag ? isOverflow : false,
								clones: isOverflow ? undefined : 0, // Toggle clones
							};
						});
					}
					splideSlider.on('pagination:mounted', function () {
						var paginationButtons = thisSlider.querySelectorAll('.splide__pagination__page');
						paginationButtons.forEach(function (button) {
							button.addEventListener('keydown', function (event) {
								// Check if space bar or return/enter is pressed
								if (event.key === ' ' || event.key === 'Enter') {
									event.preventDefault();
									var activeSlideIndex = splideSlider?.index || 0;
									var activeSlide = splideSlider?.Components?.Slides?.getAt(activeSlideIndex)?.slide;
									if (activeSlide) {
										activeSlide.setAttribute('tabindex', '0');
										activeSlide.focus();
									}
								}
							});
						});
					});
					splideSlider.mount();
				} else {
					const splideSlider = new Splide(thisSlider, splideOptions);
					if (!inHiddenMenu) {
						splideSlider.on('overflow', function (isOverflow) {
							// Reset the carousel position
							splideSlider.go(0);

							splideSlider.options = {
								arrows: splideOptions.arrows ? isOverflow : false,
								pagination: splideOptions.pagination ? isOverflow : false,
								drag: splideOptions.drag ? isOverflow : false,
								clones: isOverflow ? undefined : 0, // Toggle clones
							};
						});
					}
					splideSlider.on('pagination:mounted', function () {
						var paginationButtons = thisSlider.querySelectorAll('.splide__pagination__page');
						paginationButtons.forEach(function (button) {
							button.addEventListener('keydown', function (event) {
								// Check if space bar or return/enter is pressed
								if (event.key === ' ' || event.key === 'Enter') {
									event.preventDefault();
									var activeSlideIndex = splideSlider?.index || 0;
									var activeSlide = splideSlider?.Components?.Slides?.getAt(activeSlideIndex)?.slide;
									if (activeSlide) {
										activeSlide.setAttribute('tabindex', '0');
										activeSlide.focus();
									}
								}
							});
						});
					});
					splideSlider.mount();
				}
			}
		},

		parseDataset(elementDataset) {
			// Auto-parse all values in the elements dataset
			return Object.keys(elementDataset).reduce((acc, key) => {
				const parsedInt = parseInt(elementDataset[key]);
				if (!Number.isNaN(parsedInt) && !key.includes('sliderGap')) {
					return { ...acc, [key]: parsedInt };
				}
				if (elementDataset[key] === 'true' || elementDataset[key] === 'false') {
					return { ...acc, [key]: JSON.parse(elementDataset[key]) };
				}

				return { ...acc, [key]: elementDataset[key] };
			}, {});
		},

		createSplideElements(wrapperElem) {
			// Handle pause button: extract it if it's inside the track and re-append it after the track
			const pauseButton = wrapperElem.querySelector('.kb-gallery-pause-button');
			if (pauseButton) {
				const track = wrapperElem.querySelector('.splide__track');
				// If pause button is inside the track, move it outside
				if (track && track.contains(pauseButton)) {
					pauseButton.remove();
					// Re-append after the track
					if (track.nextSibling) {
						wrapperElem.insertBefore(pauseButton, track.nextSibling);
					} else {
						wrapperElem.appendChild(pauseButton);
					}
				}
			}

			// Remove 'last' class from slides if present (legacy support)
			// Find all slides (both .splide__slide and .kb-slide-item)
			const slides = wrapperElem.querySelectorAll('.splide__slide, .kb-slide-item');
			let slideCount = 0;
			slides.forEach(function (slide) {
				// Only count actual slides, not the pause button
				if (!slide.classList.contains('kb-gallery-pause-button')) {
					// Ensure slides have the splide__slide class
					if (!slide.classList.contains('splide__slide')) {
						slide.classList.add('splide__slide');
					}
					slideCount++;
				}
				if (slide.classList.contains('last')) {
					slide.classList.remove('last');
				}
			});

			// Ensure wrapper has splide class
			wrapperElem.classList.add('splide');

			return slideCount;
		},

		getSplideOptions(dataSet) {
			const scrollIsOne = dataSet.sliderScroll === 1 ? 1 : false;
			const splideOpts = {
				//start: 0,
				trimSpace: true,
				drag: true,
				perPage: dataSet.columnsXxl || 1,
				type: dataSet.sliderFade ? 'fade' : 'loop',
				easing:
					dataSet.sliderAnimSpeed && dataSet.sliderAnimSpeed > 1000
						? 'linear'
						: 'cubic-bezier(0.25, 1, 0.5, 1)',
				lazyLoad: 'nearby',
				autoplay: dataSet.sliderAuto || false,
				interval: dataSet.sliderSpeed || 7000,
				speed: dataSet.sliderAnimSpeed || 400,
				arrows: dataSet.sliderArrows || false,
				pagination: dataSet.sliderDots || false,
				direction: dataSet.sliderDirection,
				pauseOnHover: dataSet.sliderPauseHover || false,
				gap: dataSet.sliderGap || 0,
				breakpoints: {
					543: {
						perPage: dataSet.columnsSs || 1,
						perMove: scrollIsOne || dataSet.scrollSs,
						gap: dataSet.sliderGapMobile || 0,
					},
					767: {
						perPage: dataSet.columnsXs || 1,
						perMove: scrollIsOne || dataSet.columnsXs,
						gap: dataSet.sliderGapMobile || 0,
					},
					991: {
						perPage: dataSet.columnsSm || 1,
						perMove: scrollIsOne || dataSet.columnsSm,
						gap: dataSet.sliderGapTablet || 0,
					},
					1199: {
						perPage: dataSet.columnsMd || 1,
						perMove: scrollIsOne || dataSet.columnsMd,
						gap: dataSet.sliderGapTablet || 0,
					},
					1499: {
						perPage: dataSet.columnsXl || 1,
						perMove: scrollIsOne || dataSet.columnsXl,
						gap: dataSet.sliderGap || 0,
					},
				},
				classes: {
					prev: 'splide__arrow--prev slick-prev',
					next: 'splide__arrow--next slick-next',
				},
				i18n: {
					prev: window?.kb_splide?.i18n?.prev,
					next: window?.kb_splide?.i18n?.next,
					first: window?.kb_splide?.i18n?.first,
					last: window?.kb_splide?.i18n?.last,
					slideX: window?.kb_splide?.i18n?.slideX,
					pageX: window?.kb_splide?.i18n?.pageX,
					play: window?.kb_splide?.i18n?.play,
					pause: window?.kb_splide?.i18n?.pause,
					carousel: window?.kb_splide?.i18n?.carousel,
					slide: window?.kb_splide?.i18n?.slide,
					select: window?.kb_splide?.i18n?.select,
					slideLabel: window?.kb_splide?.i18n?.slideLabel,
				},
			};

			if (splideOpts.perPage === 1 || scrollIsOne) {
				splideOpts.focus = 0;
				splideOpts.perMove = scrollIsOne || dataSet.columnsXxl || 1;
			}

			return splideOpts;
		},

		// Initiate the menus when the DOM loads.
		init() {
			if (typeof Splide === 'function') {
				if (document.body.classList.contains('kb-optimized')) {
					kadenceBlocksSplide.initAllOptimized();
				} else {
					kadenceBlocksSplide.initAll();
				}
			} else {
				var initLoadDelay = setInterval(function () {
					if (typeof Splide === 'function') {
						if (document.body.classList.contains('kb-optimized')) {
							kadenceBlocksSplide.initAllOptimized();
						} else {
							kadenceBlocksSplide.initAll();
						}
						clearInterval(initLoadDelay);
					} else {
						console.log('No Splide found');
					}
				}, 200);
			}
		},
	};
	if (document.readyState === 'loading') {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', kadenceBlocksSplide.init);
	} else {
		// The DOM has already been loaded.
		kadenceBlocksSplide.init();
	}
	document.addEventListener('kadenceJSInitReload', function () {
		kadenceBlocksSplide.init();
	});
	document.addEventListener('kb-query-loaded', function () {
		kadenceBlocksSplide.init();
	});
})();
