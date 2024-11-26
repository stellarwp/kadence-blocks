/* global kadence_blocks_progress_bars */
/* global ProgressBar */
(function () {
	'use strict';
	const kadenceProgressBars = {
		cache: {},
		scroller: {},
		items: JSON.parse(kadence_blocks_progress_bars.items),
		windowResize() {
			if (!kadenceProgressBars?.items) {
				return;
			}
			Object.keys(kadenceProgressBars?.items).forEach(function (key) {
				kadenceProgressBars.updateContainer(kadenceProgressBars.items[key]);
			});
		},
		updateContainer(item) {
			const barContainers = document.querySelectorAll('.kb-progress-bar-' + item.unique_id);
			const barSvgs = [];
			if (!barContainers?.length) {
				return;
			}
			for (let n = 0; n < barContainers.length; n++) {
				barSvgs[n] = barContainers[n].querySelector('svg');
				if (barSvgs?.[n]) {
					kadenceProgressBars.updatePathSize(barSvgs[n], item);
				}
			}
		},
		updatePathSize(barSvg, item) {
			const barPaths = barSvg.querySelectorAll('path');
			const path1 = barPaths[0];
			const path2 = barPaths[1];
			if (window.innerWidth < 768) {
				if (item.type === 'line') {
					barSvg.setAttribute('viewBox', '0 0 100 ' + item.stokeWidths[2]);
					path1.setAttribute('d', 'M 0,' + item.stokeWidths[2] / 2 + ' L 100,' + item.stokeWidths[2] / 2);
					path2.setAttribute('d', 'M 0,' + item.stokeWidths[2] / 2 + ' L 100,' + item.stokeWidths[2] / 2);
				}
				path1.setAttribute('stroke-width', item.stokeWidths[2]);
				path2.setAttribute('stroke-width', item.stokeWidths[2]);
			} else if (window.innerWidth < 1025) {
				if (item.type === 'line') {
					barSvg.setAttribute('viewBox', '0 0 100 ' + item.stokeWidths[1]);
					path1.setAttribute('d', 'M 0,' + item.stokeWidths[1] / 2 + ' L 100,' + item.stokeWidths[1] / 2);
					path2.setAttribute('d', 'M 0,' + item.stokeWidths[1] / 2 + ' L 100,' + item.stokeWidths[1] / 2);
				}
				path1.setAttribute('stroke-width', item.stokeWidths[1]);
				path2.setAttribute('stroke-width', item.stokeWidths[1]);
			} else {
				if (item.type === 'line') {
					barSvg.setAttribute('viewBox', '0 0 100 ' + item.stokeWidths[0]);
					path1.setAttribute('d', 'M 0,' + item.stokeWidths[0] / 2 + ' L 100,' + item.stokeWidths[0] / 2);
					path2.setAttribute('d', 'M 0,' + item.stokeWidths[0] / 2 + ' L 100,' + item.stokeWidths[0] / 2);
				}
				path1.setAttribute('stroke-width', item.stokeWidths[0]);
				path2.setAttribute('stroke-width', item.stokeWidths[0]);
			}
		},
		triggerAnimation(element, index, item) {
			if (kadenceProgressBars.cache[item.simple_id][index]) {
				const prefix = item?.prefix ? kadenceProgressBars.stripHtml(item.prefix) : '';
				const suffix = item?.suffix ? kadenceProgressBars.stripHtml(item.suffix) : '';
				kadenceProgressBars.cache[item.simple_id][index].animate(item.progress_real / item.progress_max, {
					duration: item.duration * 1000,
					step(state, bar) {
						let value = 0;
						const elementAbove = element.querySelector('.kb-current-progress-above');
						const elementInside = element.querySelector('.kb-current-progress-inside');
						const elementBelow = element.querySelector('.kb-current-progress-below');
						if (item.is_relative) {
							value = Math.round(bar.value() * 100);
						} else {
							value = Math.round(bar.value() * item.progress_max);
						}
						if (item.decimal === 'one') {
							value = Math.round(bar.value() * 10) / 10;
							value = value.toFixed(1);
						} else if (item.decimal === 'two') {
							value = Math.round(bar.value() * 100) / 100;
							value = value.toFixed(2);
						}
						if (elementAbove) {
							elementAbove.innerHTML = prefix + value + suffix;
						} else if (elementInside) {
							elementInside.innerHTML = prefix + value + suffix;
						} else if (elementBelow) {
							elementBelow.innerHTML = prefix + value + suffix;
						}
					},
				});
			}
		},
		initSingleBarElement(element, index, item) {
			let initialStroke;
			if (window.innerWidth < 768) {
				initialStroke = item.stokeWidths?.[2] ? item.stokeWidths[2] : 2;
			} else if (window.innerWidth < 1025) {
				initialStroke = item.stokeWidths?.[1] ? item.stokeWidths[1] : 2;
			} else {
				initialStroke = item.stokeWidths?.[0] ? item.stokeWidths[0] : 2;
			}
			const progressElement = element.querySelector('.kb-progress-bar');
			const args = {
				color: item.progressColor,
				trailColor: item.barBackground,
				duration: item.duration * 1000,
				easing: item.easing,
				strokeWidth: initialStroke,
			};
			if (!kadenceProgressBars.cache[item.simple_id]) {
				kadenceProgressBars.cache[item.simple_id] = [];
			}
			switch (item.type) {
				case 'circle':
					kadenceProgressBars.cache[item.simple_id][index] = new ProgressBar.Circle(progressElement, args);
					break;
				case 'line':
					kadenceProgressBars.cache[item.simple_id][index] = new ProgressBar.Line(progressElement, args);
					break;
				case 'semicircle':
					kadenceProgressBars.cache[item.simple_id][index] = new ProgressBar.SemiCircle(
						progressElement,
						args
					);
					break;
			}
			if (item.delay) {
				if (!kadenceProgressBars.scroller[item.simple_id]) {
					kadenceProgressBars.scroller[item.simple_id] = [];
				}
				kadenceProgressBars.scroller[item.simple_id][index] = new ScrollMagic.Controller();
				const desiredAnimation = new ScrollMagic.Scene({ triggerElement: element });
				desiredAnimation.triggerHook(0.88);
				desiredAnimation.addTo(kadenceProgressBars.scroller[item.simple_id][index]);
				desiredAnimation.on('start', function (e) {
					kadenceProgressBars.triggerAnimation(element, index, item);
				});
			} else {
				kadenceProgressBars.triggerAnimation(element, index, item);
			}
		},
		initSingleBar(item) {
			const barContainers = document.querySelectorAll('.kb-progress-bar-container' + item.unique_id);
			if (!barContainers?.length) {
				return;
			}
			for (let n = 0; n < barContainers.length; n++) {
				kadenceProgressBars.initSingleBarElement(barContainers[n], n, item);
			}
		},
		stripHtml(html) {
			const wrappedHtml = `<pre>${html}</pre>`;
			const doc = new DOMParser().parseFromString(wrappedHtml, 'text/html');
			return doc.body.textContent || '';
		},
		initAll() {
			if (!kadenceProgressBars?.items) {
				return;
			}
			Object.keys(kadenceProgressBars?.items).forEach(function (key) {
				kadenceProgressBars.initSingleBar(kadenceProgressBars.items[key]);
			});
		},
		// Initiate the menus when the DOM loads.
		init() {
			if (typeof ProgressBar !== 'undefined') {
				kadenceProgressBars.initAll();
			} else {
				var initLoadDelay = setInterval(function () {
					if (typeof ProgressBar !== 'undefined') {
						kadenceProgressBars.initAll();
						clearInterval(initLoadDelay);
					}
				}, 200);
			}
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', kadenceProgressBars.init);
	} else {
		// The DOM has already been loaded.
		kadenceProgressBars.init();
	}
	window.addEventListener('resize', kadenceProgressBars.windowResize, false);
})();
