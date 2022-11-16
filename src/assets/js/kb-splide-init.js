(function () {
	"use strict";
	var kadenceBlocksSplide = {
		initAll: function () {
			let advancedSliders = document.querySelectorAll(
				".wp-block-kadence-advancedgallery .kt-blocks-carousel-init"
			);
			this.bootstrapSliders(advancedSliders);

			let bgSliders = document.querySelectorAll(
				".kb-blocks-bg-slider > .kt-blocks-carousel-init"
			);
			this.bootstrapSliders(bgSliders);
		},
		bootstrapSliders: function (elementList) {
			if (!elementList || elementList.length === 0) {
				return;
			}

			for (let i = 0; i < elementList.length; i++) {
				var thisSlider = elementList[i];

				if (!thisSlider || !thisSlider.children) {
					return;
				}

				this.createSplideElements(thisSlider);
				let parsedData = this.parseDataset(thisSlider.dataset);

				if (document.querySelector('html[dir="rtl"]')) {
					parsedData.sliderDirection = "rtl";
				} else {
					parsedData.sliderDirection = "ltr";
				}

				thisSlider.addEventListener("load", function (elem) {
					elem.classList.remove("kt-post-carousel-loading");
				});

				let splideOptions = this.getSplideOptions(parsedData);
				console.log( splideOptions );
				// Add this to remove slick based css from hiding elements
				thisSlider.classList.add("slick-initialized");
				thisSlider.classList.add("slick-slider");

				let { sliderType } = parsedData;

				if (sliderType && sliderType === "fluidcarousel") {
					thisSlider
						.querySelectorAll(".kb-slide-item")
						.forEach(function (elem) {
							elem.style.maxWidth =
								Math.floor((80 / 100) * thisSlider.clientWidth) + "px";
						});

					const splideSlider = new Splide(thisSlider, {
						...splideOptions,
						focus: parsedData.sliderCenterMode !== false ? "center" : 0,
						autoWidth: true,
					}).mount();

					splideSlider.refresh();
					var resizeTimer;
					window.addEventListener("resize", function (e) {
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(function () {
							thisSlider
								.querySelectorAll(".kb-slide-item")
								.forEach(function (elem) {
									elem.style.maxWidth =
										Math.floor((80 / 100) * thisSlider.clientWidth) + "px";
								});
						}, 10);
					});
				} else if (sliderType && sliderType === "slider") {
					splideOptions.type = "fade";
					splideOptions.rewind = true;
					let splideSlider = new Splide(thisSlider, splideOptions);
					splideSlider.mount();

					window.addEventListener("resize", function () {
						splideSlider.refresh();
					});
				} else if (sliderType && sliderType === "thumbnail") {
					let navSliderId = parsedData.sliderNav;
					let navSlider = document.querySelector("#" + navSliderId);

					this.createSplideElements(navSlider);

					// Switch the datasets for the nav and main slider elements
					let mainSliderOptions = this.getSplideOptions(
						this.parseDataset(navSlider.dataset)
					);
					let navSliderOptions = splideOptions;
					navSliderOptions.isNavigation = true;

					mainSliderOptions.type = "fade";
					mainSliderOptions.rewind = true;

					navSlider.classList.add("slick-initialized");
					navSlider.classList.add("slick-slider");

					let carouselSlider = new Splide(thisSlider, mainSliderOptions);
					let thumbnailSlider = new Splide(navSlider, navSliderOptions);

					carouselSlider.sync(thumbnailSlider);
					carouselSlider.mount();
					thumbnailSlider.mount();

					window.addEventListener("resize", function () {
						carouselSlider.refresh();
					});
				} else {
					let splideSlider = new Splide(thisSlider, splideOptions);
					splideSlider.mount();

					window.addEventListener("resize", function () {
						splideSlider.refresh();
					});
				}
			}
		},

		parseDataset: function (elementDataset) {
			// Auto-parse all values in the elements dataset
			return Object.keys(elementDataset).reduce((acc, key) => {
				let parsedInt = parseInt(elementDataset[key]);
				if (!Number.isNaN(parsedInt)) {
					return { ...acc, [key]: parsedInt };
				}
				if (elementDataset[key] === "true" || elementDataset[key] === "false") {
					return { ...acc, [key]: JSON.parse(elementDataset[key]) };
				}

				return { ...acc, [key]: elementDataset[key] };
			}, {});
		},

		createSplideElements: function (wrapperElem) {
			for (let slide of wrapperElem.children) {
				slide.classList.add("splide__slide");
				slide.classList.add("slick-slide");
				if (slide.classList.contains("last")) {
					slide.classList.remove("last");
				}
			}

			let splideTrack = document.createElement("div");
			splideTrack.classList.add("splide__track");

			let splideList = document.createElement("div");
			splideList.classList.add("splide__list");
			// The slides go inside the list element
			splideList.innerHTML = wrapperElem.innerHTML;
			// The list element goes inside the track
			splideTrack.innerHTML = splideList.outerHTML;
			// The track goes inside them argument elem
			wrapperElem.innerHTML = splideTrack.outerHTML;
			wrapperElem.classList.add("splide");
		},

		getSplideOptions: function (dataSet) {
			const scrollIsOne = dataSet.sliderScroll === 1 ? 1 : false;

			return {
				//start: 0,
				focus: 0,
				trimSpace: true,
				drag: false,
				perPage: dataSet.columnsXxl || 1,
				perMove: scrollIsOne || dataSet.columnsXxl || 1,
				type: dataSet.sliderFade ? 'fade' : 'loop',
				easing:
					dataSet.sliderAnimSpeed && dataSet.sliderAnimSpeed > 1000
						? "linear"
						: "cubic-bezier(0.25, 1, 0.5, 1)",
				pauseOnHover: dataSet.sliderPause || false,
				autoplay: dataSet.sliderAuto || false,
				interval: dataSet.sliderSpeed || 7000,
				speed: dataSet.sliderAnimSpeed || 400,
				arrows: dataSet.sliderArrows || false,
				pagination: dataSet.sliderDots || false,
				direction: dataSet.sliderDirection,
				pauseOnHover: dataSet.sliderPauseHover || false,
				breakpoints: {
					543: {
						perPage: dataSet.columnsSs || 1,
						perMove: scrollIsOne || dataSet.scrollSs,
					},
					767: {
						perPage: dataSet.columnsXs || 1,
						perMove: scrollIsOne || dataSet.columnsXs,
					},
					991: {
						perPage: dataSet.columnsXs || 1,
						perMove: scrollIsOne || dataSet.columnsSm,
					},
					1199: {
						perPage: dataSet.columnsMd || 1,
						perMove: scrollIsOne || dataSet.columnsMd,
					},
					1499: {
						perPage: dataSet.columnsXl || 1,
						perMove: scrollIsOne || dataSet.columnsXl,
					},
				},
				classes: {
					prev: "splide__arrow--prev slick-prev",
					next: "splide__arrow--next slick-next",
				},
			};
		},

		// Initiate the menus when the DOM loads.
		init: function () {
			if (typeof Splide === "function") {
				kadenceBlocksSplide.initAll();
			} else {
				var initLoadDelay = setInterval(function () {
					if (typeof Splide === "function") {
						kadenceBlocksSplide.initAll();
						clearInterval(initLoadDelay);
					} else {
						console.log("No Splide found");
					}
				}, 200);
			}
		},
	};

	console.log("splide init");
	if (document.readyState === "loading") {
		// The DOM has not yet been loaded.
		document.addEventListener("DOMContentLoaded", kadenceBlocksSplide.init);
	} else {
		// The DOM has already been loaded.
		kadenceBlocksSplide.init();
	}
})();