/* global kadence_blocks_toc */
/**
 * File kb-table-of-contents.js.
 * Gets the table of contents links and smoothscroll working.
 */
// Polyfill Smooth Scroll
!(function () {
	'use strict';
	function o() {
		const o = window,
			t = document;
		if (!('scrollBehavior' in t.documentElement.style && !0 !== o.__forceSmoothScrollPolyfill__)) {
			var l,
				e = o.HTMLElement || o.Element,
				r = 468,
				i = {
					scroll: o.scroll || o.scrollTo,
					scrollBy: o.scrollBy,
					elementScroll: e.prototype.scroll || n,
					scrollIntoView: e.prototype.scrollIntoView,
				},
				s = o.performance && o.performance.now ? o.performance.now.bind(o.performance) : Date.now,
				c = ((l = o.navigator.userAgent), new RegExp(['MSIE ', 'Trident/', 'Edge/'].join('|')).test(l) ? 1 : 0);
			((o.scroll = o.scrollTo =
				function () {
					void 0 !== arguments[0] &&
						(!0 !== f(arguments[0])
							? h.call(
									o,
									t.body,
									void 0 !== arguments[0].left ? ~~arguments[0].left : o.scrollX || o.pageXOffset,
									void 0 !== arguments[0].top ? ~~arguments[0].top : o.scrollY || o.pageYOffset
								)
							: i.scroll.call(
									o,
									void 0 !== arguments[0].left
										? arguments[0].left
										: 'object' != typeof arguments[0]
											? arguments[0]
											: o.scrollX || o.pageXOffset,
									void 0 !== arguments[0].top
										? arguments[0].top
										: void 0 !== arguments[1]
											? arguments[1]
											: o.scrollY || o.pageYOffset
								));
				}),
				(o.scrollBy = function () {
					void 0 !== arguments[0] &&
						(f(arguments[0])
							? i.scrollBy.call(
									o,
									void 0 !== arguments[0].left
										? arguments[0].left
										: 'object' != typeof arguments[0]
											? arguments[0]
											: 0,
									void 0 !== arguments[0].top
										? arguments[0].top
										: void 0 !== arguments[1]
											? arguments[1]
											: 0
								)
							: h.call(
									o,
									t.body,
									~~arguments[0].left + (o.scrollX || o.pageXOffset),
									~~arguments[0].top + (o.scrollY || o.pageYOffset)
								));
				}),
				(e.prototype.scroll = e.prototype.scrollTo =
					function () {
						if (void 0 !== arguments[0]) {
							if (!0 !== f(arguments[0])) {
								const o = arguments[0].left,
									t = arguments[0].top;
								h.call(
									this,
									this,
									void 0 === o ? this.scrollLeft : ~~o,
									void 0 === t ? this.scrollTop : ~~t
								);
							} else {
								if ('number' == typeof arguments[0] && void 0 === arguments[1]) {
									throw new SyntaxError('Value could not be converted');
								}
								i.elementScroll.call(
									this,
									void 0 !== arguments[0].left
										? ~~arguments[0].left
										: 'object' != typeof arguments[0]
											? ~~arguments[0]
											: this.scrollLeft,
									void 0 !== arguments[0].top
										? ~~arguments[0].top
										: void 0 !== arguments[1]
											? ~~arguments[1]
											: this.scrollTop
								);
							}
						}
					}),
				(e.prototype.scrollBy = function () {
					void 0 !== arguments[0] &&
						(!0 !== f(arguments[0])
							? this.scroll({
									left: ~~arguments[0].left + this.scrollLeft,
									top: ~~arguments[0].top + this.scrollTop,
									behavior: arguments[0].behavior,
								})
							: i.elementScroll.call(
									this,
									void 0 !== arguments[0].left
										? ~~arguments[0].left + this.scrollLeft
										: ~~arguments[0] + this.scrollLeft,
									void 0 !== arguments[0].top
										? ~~arguments[0].top + this.scrollTop
										: ~~arguments[1] + this.scrollTop
								));
				}),
				(e.prototype.scrollIntoView = function () {
					if (!0 !== f(arguments[0])) {
						const l = (function (o) {
								for (
									;
									o !== t.body &&
									!1 === ((e = p((l = o), 'Y') && a(l, 'Y')), (r = p(l, 'X') && a(l, 'X')), e || r);

								) {
									o = o.parentNode || o.host;
								}
								let l, e, r;
								return o;
							})(this),
							e = l.getBoundingClientRect(),
							r = this.getBoundingClientRect();
						l !== t.body
							? (h.call(this, l, l.scrollLeft + r.left - e.left, l.scrollTop + r.top - e.top),
								'fixed' !== o.getComputedStyle(l).position &&
									o.scrollBy({ left: e.left, top: e.top, behavior: 'smooth' }))
							: o.scrollBy({ left: r.left, top: r.top, behavior: 'smooth' });
					} else {
						i.scrollIntoView.call(this, void 0 === arguments[0] || arguments[0]);
					}
				}));
		}
		function n(o, t) {
			((this.scrollLeft = o), (this.scrollTop = t));
		}
		function f(o) {
			if (
				null === o ||
				'object' != typeof o ||
				void 0 === o.behavior ||
				'auto' === o.behavior ||
				'instant' === o.behavior
			) {
				return !0;
			}
			if ('object' == typeof o && 'smooth' === o.behavior) {
				return !1;
			}
			throw new TypeError(
				'behavior member of ScrollOptions ' +
					o.behavior +
					' is not a valid value for enumeration ScrollBehavior.'
			);
		}
		function p(o, t) {
			return 'Y' === t
				? o.clientHeight + c < o.scrollHeight
				: 'X' === t
					? o.clientWidth + c < o.scrollWidth
					: void 0;
		}
		function a(t, l) {
			const e = o.getComputedStyle(t, null)['overflow' + l];
			return 'auto' === e || 'scroll' === e;
		}
		function d(t) {
			let l,
				e,
				i,
				c,
				n = (s() - t.startTime) / r;
			((c = n = n > 1 ? 1 : n),
				(l = 0.5 * (1 - Math.cos(Math.PI * c))),
				(e = t.startX + (t.x - t.startX) * l),
				(i = t.startY + (t.y - t.startY) * l),
				t.method.call(t.scrollable, e, i),
				(e === t.x && i === t.y) || o.requestAnimationFrame(d.bind(o, t)));
		}
		function h(l, e, r) {
			let c, f, p, a;
			const h = s();
			(l === t.body
				? ((c = o), (f = o.scrollX || o.pageXOffset), (p = o.scrollY || o.pageYOffset), (a = i.scroll))
				: ((c = l), (f = l.scrollLeft), (p = l.scrollTop), (a = n)),
				d({ scrollable: c, method: a, startTime: h, startX: f, startY: p, x: e, y: r }));
		}
	}
	'object' == typeof exports && 'undefined' != typeof module ? (module.exports = { polyfill: o }) : o();
})();
(function () {
	'use strict';
	window.kadenceTOC = {
		/**
		 * Add anchors where needed.
		 */
		initAddAnchors() {
			const headings = JSON.parse(kadence_blocks_toc.headings);
			const missingHeadings = [];

			for (let i = 0; i < headings.length; i++) {
				const heading_items = document.querySelectorAll('h' + headings[i].level);
				if (!heading_items.length) {
					return;
				}
				const first_string = encodeURIComponent(headings[i].content)
					.toString()
					.normalize()
					.replace(/[^\w\s]/gi, '');

				let heading_found = false;

				for (let n = 0; n < heading_items.length; n++) {
					let second_string = heading_items[n].textContent
						.replace(/×/g, 'x')
						.replace(/–/g, '-')
						.replace(/—/g, '-')
						.replace(/…/g, '...')
						.replace(/′/g, "'")
						.replace(/’/g, "'")
						.replace(/‘/g, "'")
						.replace(/“/g, '"')
						.replace(/”/g, '"');
					second_string = encodeURIComponent(second_string)
						.toString()
						.normalize()
						.replace(/[^\w\s]/gi, '');
					const alt_string = encodeURIComponent(heading_items[n].getAttribute('data-alt-title'))
						.toString()
						.normalize()
						.replace(/[^\w\s]/gi, '');
					if (first_string === second_string || first_string === alt_string) {
						if (!heading_items[n].getAttribute('id')) {
							heading_items[n].setAttribute('id', headings[i].anchor);
							heading_found = true;
							break;
						}
					}
				}

				if (!heading_found) {
					missingHeadings.push(headings[i]);
				}
			}

			this.removeMissingTocLinks(missingHeadings);
		},
		/**
		 * Remove TOC links for headings that don't exist in the DOM
		 */
		removeMissingTocLinks(missingHeadings) {
			if (missingHeadings.length === 0) {
				return;
			}

			const tocBlocks = document.querySelectorAll('.wp-block-kadence-tableofcontents');

			tocBlocks.forEach(tocBlock => {
				missingHeadings.forEach(missingHeading => {
					const tocLinks = tocBlock.querySelectorAll('a.kb-table-of-contents__entry');

					tocLinks.forEach(link => {
						const linkHref = link.getAttribute('href');
						const linkText = link.textContent.trim();

						if (linkHref === missingHeading.anchor ||
							linkText === missingHeading.content) {

							const listItem = link.closest('li');
							if (listItem) {
								listItem.remove();
							}
						}
					});
				});

				this.cleanupEmptyLists(tocBlock);
			});
		},
		/**
		 * Clean up empty nested lists after removing missing links
		 */
		cleanupEmptyLists(tocBlock) {
			const emptyLists = tocBlock.querySelectorAll('.kb-table-of-contents-list-sub:empty');
			emptyLists.forEach(emptyList => {
				emptyList.remove();
			});

			const listItems = tocBlock.querySelectorAll('.kb-table-of-content-list li');
			listItems.forEach(listItem => {
				const nestedList = listItem.querySelector('.kb-table-of-contents-list-sub');
				if (nestedList && nestedList.children.length === 0) {
					nestedList.remove();
				}
			});
		},
		/**
		 * Toggle an attribute.
		 */
		toggleAttribute(element, attribute, trueVal, falseVal) {
			if (trueVal === undefined) {
				trueVal = true;
			}
			if (falseVal === undefined) {
				falseVal = false;
			}
			if (element.getAttribute(attribute) !== trueVal) {
				element.setAttribute(attribute, trueVal);
			} else {
				element.setAttribute(attribute, falseVal);
			}
		},
		/**
		 * Toggle a class.
		 */
		toggleClass(element, trueVal, falseVal) {
			if (trueVal === undefined) {
				trueVal = 'active';
			}
			if (falseVal === undefined) {
				falseVal = 'hidden';
			}
			if (element.classList.contains(trueVal)) {
				element.classList.remove(trueVal);
				element.classList.add(falseVal);
			} else {
				element.classList.add(trueVal);
				element.classList.remove(falseVal);
			}
		},
		/**
		 * Instigate toggle.
		 */
		initCollapse() {
			const collapse_items = document.querySelectorAll('.kb-collapsible-toc');
			if (!collapse_items.length) {
				return;
			}
			for (let n = 0; n < collapse_items.length; n++) {
				var el = collapse_items[n].querySelector('.kb-table-of-contents-toggle');
				el.onclick = () => {
					window.kadenceTOC.toggleAttribute(el, 'aria-expanded', 'true', 'false');
					window.kadenceTOC.toggleAttribute(
						el,
						'aria-label',
						kadence_blocks_toc.collapseText,
						kadence_blocks_toc.expandText
					);
					window.kadenceTOC.toggleClass(collapse_items[n], 'kb-toc-toggle-active', 'kb-toc-toggle-hidden');
				};
			}
		},
		scrollToElement(element, offset, history = true) {
			const originalTop = Math.floor(element.getBoundingClientRect().top) - offset;
			window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
			element.tabIndex = '-1';
			element.focus({
				preventScroll: true,
			});
			if (history) {
				window.history.pushState('', '', '#' + element.id);
			}
		},
		/**
		 * Instigate toggle.
		 */
		initScroll() {
			const scroll_toc = document.querySelectorAll('.kb-toc-smooth-scroll');
			if (!scroll_toc.length) {
				return;
			}
			for (let n = 0; n < scroll_toc.length; n++) {
				var offset = parseInt(scroll_toc[n].getAttribute('data-scroll-offset'));
				const elements = scroll_toc[n].querySelectorAll('a.kb-table-of-contents__entry');
				for (let i = 0; i < elements.length; i++) {
					elements[i].onclick = (e) => {
						if (e.target.getAttribute('href')) {
							var targetLink = e.target;
						} else {
							var targetLink = e.target.closest('a');
							if (!targetLink) {
								return;
							}
							if (!targetLink.getAttribute('href')) {
								return;
							}
						}
						const targetID = targetLink
							.getAttribute('href')
							.substring(targetLink.getAttribute('href').indexOf('#'));
						const targetAnchor = document.getElementById(targetID.replace('#', ''));
						if (!targetAnchor) {
							return;
						}
						e.preventDefault();
						window.kadenceTOC.scrollToElement(targetAnchor, offset);
					};
				}
			}
		},
		initScrollSpy() {
			if (typeof Gumshoe == 'function') {
				const scroll_spy = document.querySelectorAll(
					'.wp-block-kadence-tableofcontents[data-scroll-spy="true"]'
				);
				if (!scroll_spy.length) {
					return;
				}
				const spy_item = [];
				for (let n = 0; n < scroll_spy.length; n++) {
					var offset = parseInt(scroll_spy[n].getAttribute('data-scroll-offset'));
					// Initialize Gumshoe
					spy_item[n] = new Gumshoe('.' + scroll_spy[n].classList[2] + ' .kb-table-of-content-list a', {
						nested: true,
						nestedClass: 'active-parent',
						offset() {
							return offset ? offset : 0;
						},
					});
				}
			}
		},
		// Initiate sticky when the DOM loads.
		init() {
			window.kadenceTOC.initAddAnchors();
			window.kadenceTOC.initCollapse();
			window.kadenceTOC.initScroll();
			window.kadenceTOC.initScrollSpy();
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', window.kadenceTOC.init);
	} else {
		// The DOM has already been loaded.
		window.kadenceTOC.init();
	}
})();
