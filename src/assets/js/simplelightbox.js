(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define([], factory);
	} else if (typeof module === 'object' && module.exports) {
		module.exports = factory();
	} else {
		root.SimpleLightbox = factory();
	}
})(this, function () {
	function assign(target) {
		for (let i = 1; i < arguments.length; i++) {
			const obj = arguments[i];

			if (obj) {
				for (const key in obj) {
					obj.hasOwnProperty(key) && (target[key] = obj[key]);
				}
			}
		}

		return target;
	}

	function addClass(element, className) {
		if (element && className) {
			element.className += ' ' + className;
		}
	}

	function removeClass(element, className) {
		if (element && className) {
			element.className = element.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ').trim();
		}
	}

	function parseHtml(html) {
		const div = document.createElement('div');
		div.innerHTML = html.trim();

		return div.childNodes[0];
	}

	function matches(el, selector) {
		return (el.matches || el.matchesSelector || el.msMatchesSelector).call(el, selector);
	}

	function getWindowHeight() {
		return 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;
	}

	function SimpleLightbox(options) {
		this.init.apply(this, arguments);
	}

	SimpleLightbox.defaults = {
		// add custom classes to lightbox elements
		elementClass: '',
		elementLoadingClass: 'slbLoading',
		htmlClass: 'slbActive',
		closeBtnClass: '',
		nextBtnClass: '',
		prevBtnClass: '',
		loadingTextClass: '',

		// customize / localize controls captions
		closeBtnCaption: 'Close',
		nextBtnCaption: 'Next',
		prevBtnCaption: 'Previous',
		loadingCaption: 'Loading...',

		bindToItems: true, // set click event handler to trigger lightbox on provided $items
		closeOnOverlayClick: true,
		closeOnEscapeKey: true,
		nextOnImageClick: true,
		showCaptions: true,

		captionAttribute: 'title', // choose data source for library to glean image caption from
		urlAttribute: 'href', // where to expect large image

		startAt: 0, // start gallery at custom index
		loadingTimeout: 100, // time after loading element will appear

		appendTarget: 'body', // append elsewhere if needed

		beforeSetContent: null, // convenient hooks for extending library behavoiur
		beforeClose: null,
		afterClose: null,
		beforeDestroy: null,
		afterDestroy: null,
		videoRegex: new RegExp(/youtube.com|youtu.be|vimeo.com/), // regex which tests load url for iframe content
	};

	assign(SimpleLightbox.prototype, {
		init(options) {
			options = this.options = assign({}, SimpleLightbox.defaults, options);

			const self = this;
			let elements;

			if (options.$items) {
				elements = options.$items.get();
			}

			if (options.elements) {
				elements = [].slice.call(
					typeof options.elements === 'string'
						? document.querySelectorAll(options.elements)
						: options.elements
				);
			}

			this.eventRegistry = { lightbox: [], thumbnails: [] };
			this.items = [];
			this.captions = [];

			if (elements) {
				elements.forEach(function (element, index) {
					self.items.push(element.getAttribute(options.urlAttribute));

					//look for a caption in various spots
					var caption = element.getAttribute(options.captionAttribute);
					if (!caption) {
						//try to find the title attribute on the underlying image
						caption = element.querySelector('img')?.getAttribute(options.captionAttribute);

						if (!caption) {
							//try to find an attached fig caption
							caption = element.parentElement?.querySelector('figcaption')?.textContent;
						}
					}
					self.captions.push(caption);

					if (options.bindToItems) {
						self.addEvent(
							element,
							'click',
							function (e) {
								e.preventDefault();
								self.showPosition(index);
							},
							'thumbnails'
						);
					}
				});
			}

			if (options.items) {
				this.items = options.items;
			}

			if (options.captions) {
				this.captions = options.captions;
			}
		},

		addEvent(element, eventName, callback, scope) {
			this.eventRegistry[scope || 'lightbox'].push({
				element,
				eventName,
				callback,
			});

			element.addEventListener(eventName, callback);

			return this;
		},

		removeEvents(scope) {
			this.eventRegistry[scope].forEach(function (item) {
				item.element.removeEventListener(item.eventName, item.callback);
			});

			this.eventRegistry[scope] = [];

			return this;
		},

		next() {
			return this.showPosition(this.currentPosition + 1);
		},

		prev() {
			return this.showPosition(this.currentPosition - 1);
		},

		normalizePosition(position) {
			if (position >= this.items.length) {
				position = 0;
			} else if (position < 0) {
				position = this.items.length - 1;
			}

			return position;
		},

		showPosition(position) {
			const newPosition = this.normalizePosition(position);

			if (typeof this.currentPosition !== 'undefined') {
				this.direction = newPosition > this.currentPosition ? 'next' : 'prev';
			}

			this.currentPosition = newPosition;

			return this.setupLightboxHtml().prepareItem(this.currentPosition, this.setContent).show();
		},

		loading(on) {
			const self = this;
			const options = this.options;

			if (on) {
				this.loadingTimeout = setTimeout(function () {
					addClass(self.$el, options.elementLoadingClass);

					self.$content.innerHTML =
						'<p class="slbLoadingText ' + options.loadingTextClass + '">' + options.loadingCaption + '</p>';
					self.show();
				}, options.loadingTimeout);
			} else {
				removeClass(this.$el, options.elementLoadingClass);
				clearTimeout(this.loadingTimeout);
			}
		},
		getVideoURL(url) {
			const frm = '//_URL_';
			const converts = [
				{
					rx: /^(?:https?:)?\/\/(?:www\.)?vimeo\.com\/([^\?&"]+).*$/g,
					tmpl: frm.replace('_URL_', 'player.vimeo.com/video/$1'),
				},
				{
					rx: /^.*(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|user\/.+\/)?([^\?&"]+).*$/g,
					tmpl: frm.replace('_URL_', 'www.youtube.com/embed/$1'),
				},
				{
					rx: /^.*(?:https?:\/\/)?(?:www\.)?(?:youtube-nocookie\.com)\/(?:watch\?v=|embed\/|v\/|user\/.+\/)?([^\?&"]+).*$/g,
					tmpl: frm.replace('_URL_', 'www.youtube-nocookie.com/embed/$1'),
				},
			];
			for (let i = 0; i < converts.length; i++) {
				if (converts[i].rx.test(url)) {
					return url.replace(converts[i].rx, converts[i].tmpl);
				}
			}
			return url;
		},
		prepareItem(position, callback) {
			const self = this;
			const url = this.items[position];
			this.loading(true);
			if (this.options.videoRegex.test(url)) {
				const videoURL = this.getVideoURL(url);
				callback.call(
					self,
					parseHtml(
						'<div class="slbIframeCont"><iframe class="slbIframe" frameborder="0" allowfullscreen src="' +
							videoURL +
							'"></iframe></div>'
					)
				);
			} else {
				const $imageCont = parseHtml(
					'<div class="slbImageWrap"><img class="slbImage" src="' + url + '" /></div>'
				);

				this.$currentImage = $imageCont.querySelector('.slbImage');

				if (this.options.showCaptions && this.captions[position]) {
					$imageCont.appendChild(parseHtml('<div class="slbCaption">' + this.captions[position] + '</div>'));
				}

				this.loadImage(url, function () {
					self.setImageDimensions();

					callback.call(self, $imageCont);

					self.loadImage(self.items[self.normalizePosition(self.currentPosition + 1)]);
				});
			}

			return this;
		},

		loadImage(url, callback) {
			if (!this.options.videoRegex.test(url)) {
				const image = new Image();
				callback && (image.onload = callback);
				image.src = url;
			}
		},

		setupLightboxHtml() {
			const o = this.options;

			if (!this.$el) {
				this.$el = parseHtml(
					'<div class="slbElement ' +
						o.elementClass +
						'">' +
						'<div class="slbOverlay"></div>' +
						'<div class="slbWrapOuter">' +
						'<div class="slbWrap">' +
						'<div class="slbContentOuter">' +
						'<div class="slbContent"></div>' +
						'<button type="button" title="' +
						o.closeBtnCaption +
						'" class="slbCloseBtn ' +
						o.closeBtnClass +
						'">×</button>' +
						(this.items.length > 1
							? '<div class="slbArrows">' +
							  '<button type="button" title="' +
							  o.prevBtnCaption +
							  '" class="prev slbArrow' +
							  o.prevBtnClass +
							  '">' +
							  o.prevBtnCaption +
							  '</button>' +
							  '<button type="button" title="' +
							  o.nextBtnCaption +
							  '" class="next slbArrow' +
							  o.nextBtnClass +
							  '">' +
							  o.nextBtnCaption +
							  '</button>' +
							  '</div>'
							: '') +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>'
				);

				this.$content = this.$el.querySelector('.slbContent');
			}

			this.$content.innerHTML = '';

			return this;
		},

		show() {
			if (!this.modalInDom) {
				document.querySelector(this.options.appendTarget).appendChild(this.$el);
				addClass(document.documentElement, this.options.htmlClass);
				this.setupLightboxEvents();
				this.modalInDom = true;
			}

			return this;
		},

		setContent(content) {
			const $content = typeof content === 'string' ? parseHtml(content) : content;
			this.loading(false);

			this.setupLightboxHtml();

			removeClass(this.$content, 'slbDirectionNext');
			removeClass(this.$content, 'slbDirectionPrev');

			if (this.direction) {
				addClass(this.$content, this.direction === 'next' ? 'slbDirectionNext' : 'slbDirectionPrev');
			}

			if (this.options.beforeSetContent) {
				this.options.beforeSetContent($content, this);
			}

			this.$content.appendChild($content);

			return this;
		},

		setImageDimensions() {
			if (this.$currentImage) {
				this.$currentImage.style.maxHeight = getWindowHeight() + 'px';
			}
		},

		setupLightboxEvents() {
			const self = this;

			if (this.eventRegistry.lightbox.length) {
				return this;
			}

			this.addEvent(this.$el, 'click', function (e) {
				const $target = e.target;

				if (
					matches($target, '.slbCloseBtn') ||
					(self.options.closeOnOverlayClick && matches($target, '.slbWrap'))
				) {
					self.close();
				} else if (matches($target, '.slbArrow')) {
					matches($target, '.next') ? self.next() : self.prev();
				} else if (self.options.nextOnImageClick && self.items.length > 1 && matches($target, '.slbImage')) {
					self.next();
				}
			})
				.addEvent(document, 'keyup', function (e) {
					self.options.closeOnEscapeKey && e.keyCode === 27 && self.close();

					if (self.items.length > 1) {
						(e.keyCode === 39 || e.keyCode === 68) && self.next();
						(e.keyCode === 37 || e.keyCode === 65) && self.prev();
					}
				})
				.addEvent(window, 'resize', function () {
					self.setImageDimensions();
				});

			return this;
		},

		close() {
			if (this.modalInDom) {
				this.runHook('beforeClose');
				this.removeEvents('lightbox');
				this.$el && this.$el.parentNode.removeChild(this.$el);
				removeClass(document.documentElement, this.options.htmlClass);
				this.modalInDom = false;
				this.runHook('afterClose');
			}

			this.direction = undefined;
			this.currentPosition = this.options.startAt;
		},

		destroy() {
			this.close();
			this.runHook('beforeDestroy');
			this.removeEvents('thumbnails');
			this.runHook('afterDestroy');
		},

		runHook(name) {
			this.options[name] && this.options[name](this);
		},
	});

	SimpleLightbox.open = function (options) {
		const instance = new SimpleLightbox(options);

		return options.content
			? instance.setContent(options.content).show()
			: instance.showPosition(instance.options.startAt);
	};

	SimpleLightbox.registerAsJqueryPlugin = function ($) {
		$.fn.simpleLightbox = function (options) {
			let lightboxInstance;
			const $items = this;

			return this.each(function () {
				if (!$.data(this, 'simpleLightbox')) {
					lightboxInstance = lightboxInstance || new SimpleLightbox($.extend({}, options, { $items }));
					$.data(this, 'simpleLightbox', lightboxInstance);
				}
			});
		};

		$.SimpleLightbox = SimpleLightbox;
	};

	if (typeof window !== 'undefined' && window.jQuery) {
		SimpleLightbox.registerAsJqueryPlugin(window.jQuery);
	}

	return SimpleLightbox;
});
