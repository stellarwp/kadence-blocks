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
			for (let i = 0; i < headings.length; i++) {
				const heading_items = document.querySelectorAll('h' + headings[i].level);
				if (!heading_items.length) {
					return;
				}
				const first_string = encodeURIComponent(headings[i].content)
					.toString()
					.normalize()
					.replace(/[^\w\s]/gi, '');
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
							break;
						}
					}
					// if ( heading_items[ n ].textContent.replace(/[^\w\s]/gi, '') === headings[ i ].content.replace(/[^\w\s]/gi, '') ) {
					// heading_items[ n ].setAttribute( 'id', headings[ i ].anchor );
					// break;
					// }
				}
			}
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
			// Math.ceil (not Math.floor) guarantees the scroll distance is at
			// least the distance needed, so the landed position ends up
			// at-or-above the offset line instead of just short of it. A
			// Math.floor here leaves the heading's top a fraction of a pixel
			// past the offset, which fails initScrollSpy()'s `top <= offset`
			// check and leaves the previous entry marked active.
			const delta = Math.ceil(element.getBoundingClientRect().top - offset);
			window.scrollBy({ top: delta, left: 0, behavior: 'smooth' });
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
			const scroll_spy = document.querySelectorAll(
				'.wp-block-kadence-tableofcontents[data-scroll-spy="true"]'
			);
			if (!scroll_spy.length) {
				return;
			}
			for (let n = 0; n < scroll_spy.length; n++) {
				const offset = parseInt(scroll_spy[n].getAttribute('data-scroll-offset')) || 0;
				const navItems = document.querySelectorAll(
					'.' + scroll_spy[n].classList[2] + ' .kb-table-of-content-list a'
				);
				if (!navItems.length) {
					continue;
				}

				// Pair each nav link with the heading it targets, sorted by
				// document position.
				const items = [];
				navItems.forEach((nav) => {
					const content = document.getElementById(decodeURIComponent(nav.hash.substr(1)));
					if (content) {
						items.push({ nav, content });
					}
				});
				if (!items.length) {
					continue;
				}
				items.sort((a, b) => (a.content.offsetTop || 0) - (b.content.offsetTop || 0));

				let current = null;

				const toggleParents = (nav, add) => {
					let li = nav.parentNode && nav.parentNode.closest('li');
					while (li) {
						li.classList.toggle('active-parent', add);
						li = li.parentNode && li.parentNode.closest('li');
					}
				};

				const deactivate = (item) => {
					if (!item) {
						return;
					}
					const li = item.nav.closest('li');
					if (li) {
						li.classList.remove('active');
					}
					item.content.classList.remove('active');
					toggleParents(item.nav, false);
				};

				const activate = (item) => {
					if (!item) {
						return;
					}
					const li = item.nav.closest('li');
					if (li) {
						li.classList.add('active');
					}
					item.content.classList.add('active');
					toggleParents(item.nav, true);
				};

				const isAtBottom = () =>
					window.innerHeight + window.pageYOffset >=
					Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);

				// Same selection rule the previous Gumshoe-based implementation
				// used: the last heading (in document order) whose top has
				// crossed the offset line, with a fallback to the last item
				// once the page is scrolled to the very bottom (covers a short
				// final section whose top never reaches the offset line).
				const getActive = () => {
					if (isAtBottom()) {
						const last = items[items.length - 1];
						const bounds = last.content.getBoundingClientRect();
						if (parseInt(bounds.bottom, 10) < (window.innerHeight || document.documentElement.clientHeight)) {
							return last;
						}
					}
					for (let i = items.length - 1; i >= 0; i--) {
						const bounds = items[i].content.getBoundingClientRect();
						if (parseInt(bounds.top, 10) <= offset) {
							return items[i];
						}
					}
					return null;
				};

				const detect = () => {
					const active = getActive();
					if (active === current) {
						return;
					}
					deactivate(current);
					activate(active);
					current = active;
				};

				// IntersectionObserver replaces scroll-event polling here: the
				// callback only fires when a heading crosses the offset line,
				// instead of running detect() on every scroll tick.
				const observer = new IntersectionObserver(detect, {
					rootMargin: `-${offset}px 0px 0px 0px`,
					threshold: 0,
				});
				items.forEach((item) => observer.observe(item.content));

				// The offset-line crossing above doesn't fire for the
				// "scrolled past a short final section" edge case handled in
				// getActive(), so also recheck on scroll, but only for that one
				// cheap condition.
				window.addEventListener(
					'scroll',
					() => {
						if (isAtBottom()) {
							detect();
						}
					},
					{ passive: true }
				);

				detect();
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
