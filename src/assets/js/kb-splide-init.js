/* global kb_splide */

(function () {
	'use strict';
	var kadenceBlocksSplide = {
		initAll() {
			const advancedSliders = document.querySelectorAll(
				'.wp-block-kadence-advancedgallery .kt-blocks-carousel-init'
			);
			this.bootstrapSliders(advancedSliders);

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
							this.deferSliderInit(slider);
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
		 */
		deferSliderInit(slider) {
			// Wait for current execution stack to clear
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					// Wait for browser to be idle
					if ('requestIdleCallback' in window) {
						requestIdleCallback(
							() => {
								this.bootstrapSliders([slider]);
							},
							{ timeout: 1000 }
						);
					} else {
						// Fallback for browsers without requestIdleCallback
						setTimeout(() => {
							this.bootstrapSliders([slider]);
						}, 100);
					}
				});
			});
		},

		bootstrapSliders(elementList) {
			if (!elementList || elementList.length === 0) {
				return;
			}

			for (let i = 0; i < elementList.length; i++) {
				const thisSlider = elementList[i];
				if (!thisSlider || !thisSlider.children || thisSlider.classList.contains('is-initialized')) {
					continue;
				}
				thisSlider.classList.add('kb-splide');

				const slideCount = this.createSplideElements(thisSlider);
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
					elementList[i].querySelectorAll('.kb-slide-item').forEach(function (elem) {
						if (!elementList[i].clientWidth) {
							elem.style.maxWidth = '100%';
						} else {
							elem.style.maxWidth = Math.floor((80 / 100) * elementList[i].clientWidth) + 'px';
						}
					});
					const childCount = elementList[i].querySelectorAll('.kb-slide-item').length;
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
					// splideSlider.on( 'overflow', function ( isOverflow ) {
					// 	// Reset the carousel position
					// 	splideSlider.go( 0 );

					// 	splideSlider.options = {
					// 	  arrows    : splideOptions.arrows ? isOverflow : false,
					// 	  pagination: splideOptions.pagination ? isOverflow : false,
					// 	  drag      : splideOptions.drag ? isOverflow : false,
					// 	  clones    : isOverflow ? undefined : 0, // Toggle clones
					// 	};
					// } );
					splideSlider.mount();
					var resizeTimer;
					window.addEventListener('resize', function (e) {
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(function () {
							elementList[i].querySelectorAll('.kb-slide-item').forEach(function (elem) {
								elem.style.maxWidth = Math.floor((80 / 100) * elementList[i].clientWidth) + 'px';
							});
						}, 10);
					});
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
					splideSlider.mount();
				} else if (sliderType && sliderType === 'thumbnail') {
					const navSliderId = parsedData.sliderNav;
					const navSlider = document.querySelector('#' + navSliderId);

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
					navSlider.classList.add('kb-splide');

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
			const slideCount = wrapperElem.children.length;
			for (const slide of wrapperElem.children) {
				slide.classList.add('splide__slide');
				//slide.classList.add("slick-slide");
				if (slide.classList.contains('last')) {
					slide.classList.remove('last');
				}
			}

			const splideTrack = document.createElement('div');
			splideTrack.classList.add('splide__track');

			const splideList = document.createElement('ul');
			splideList.classList.add('splide__list');
			// The slides go inside the list element
			splideList.innerHTML = wrapperElem.innerHTML;
			// The list element goes inside the track
			splideTrack.innerHTML = splideList.outerHTML;
			// The track goes inside them argument elem
			wrapperElem.innerHTML = splideTrack.outerHTML;
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
