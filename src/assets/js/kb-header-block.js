/* global kadenceHeaderConfig */

/**
 * The frontend class for the Kadence query block.
 */
class KBHeader {
	/**
	 * The collection of all component objects.
	 */
	components = {};

	/**
	 * The current state.
	 */
	_state;

	/**
	 * The root header container element.
	 */
	root;

	/**
	 * The root header container element.
	 */
	rootID;

	/**
	 * The auto transparent spacing setting.
	 */
	autoTransparentSpacing;

	/**
	 * The desktop style setting.
	 */
	sticky;

	/**
	 * The tablet style setting.
	 */
	stickyTablet;

	/**
	 * The mobile style setting.
	 */
	stickyMobile;

	/**
	 * The desktop style setting.
	 */
	transparent;

	/**
	 * The tablet style setting.
	 */
	transparentTablet;

	/**
	 * The mobile style setting.
	 */
	transparentMobile;

	/**
	 * The desktop sticky section setting.
	 */
	stickySection;

	/**
	 * The tablet sticky section setting.
	 */
	stickySectionTablet;

	/**
	 * The mobile sticky section setting.
	 */
	stickySectionMobile;

	/**
	 * activeSize.
	 */
	activeSize = 'mobile';

	/**
	 * lastScrollTop.
	 */
	lastScrollTop = 0;

	/**
	 * activeOffsetTop.
	 */
	activeOffsetTop = 0;

	/**
	 * shrinkStartHeight.
	 */
	shrinkMain = false;

	/**
	 * shrinkStartHeight.
	 */
	shrinkMainHeight = 0;

	/**
	 * shrinkStartHeight.
	 */
	shrinkMainHeightTablet = 0;

	/**
	 * shrinkStartHeight.
	 */
	shrinkMainHeightMobile = 0;

	/**
	 * shrinkStartHeight.
	 */
	shrinkStartHeight = 0;

	/**
	 * mobileBreakpoint.
	 */
	mobileBreakpoint = 0;

	/**
	 * currentTopPosition.
	 */
	currentTopPosition = 0;

	/**
	 * anchorOffset.
	 */
	anchorOffset = 0;

	/**
	 * the wrapper element that holds stickyWrapper's place in the dom.
	 */
	placeholderWrapper;

	/**
	 * the wrapper element that sticks, shrinks, reveals, etc.
	 */
	stickyWrapper;

	/**
	 * isSticking.
	 */
	isSticking = false;

	/**
	 * isTransparent.
	 */
	isTransparent = false;

	/**
	 * activeHeaderContainer.
	 */
	activeHeaderContainer;

	/**
	 * The main constructor.
	 *
	 * @param target  - The selector for the target element, or the element itself.
	 * @param options - Optional. An object with options.
	 */
	constructor(target, options = {}) {
		//target the target
		const self = this;
		this.root = 'string' === typeof target ? document.querySelector(target) : target;
		this.activeHeaderContainer = this.root.querySelector('.wp-block-kadence-header-desktop');
		//TODO get a real root id parsed from the block unique id.
		this.rootID = 'aaa';
		this.autoTransparentSpacing = this.root.dataset?.autoTransparentSpacing === '1';
		this.sticky = this.root.dataset?.sticky == '1';
		this.stickyTablet = this.root.dataset?.stickyTablet == '1';
		this.stickyMobile = this.root.dataset?.stickyMobile == '1';
		this.transparent = this.root.dataset?.transparent == '1';
		this.transparentTablet = this.root.dataset?.transparentTablet == '1';
		this.transparentMobile = this.root.dataset?.transparentMobile == '1';
		this.stickySection = this.root.dataset?.stickySection;
		this.stickySectionTablet = this.root.dataset?.stickySectionTablet;
		this.stickySectionMobile = this.root.dataset?.stickySectionMobile;
		this.shrinkMain = this.root.dataset?.shrinkMain === '1';
		this.shrinkMainHeight = this.root.dataset?.shrinkMainHeight;
		this.shrinkMainHeightTablet = this.root.dataset?.shrinkMainHeightTablet;
		this.shrinkMainHeightMobile = this.root.dataset?.shrinkMainHeightMobile;
		this.revealScrollUp = this.root.dataset?.revealScrollUp === '1';
		this.mobileBreakpoint = this.root.dataset?.mobileBreakpoint;
		this._state = 'CREATED';

		// if (this.transparent && this.autoTransparentSpacing) {
		// 	this.initAutoTransparentSpacing();
		// }
		if (this.sticky || this.stickyTablet || this.stickyMobile) {
			this.initStickyHeader();
		}
		if (this.mobileBreakpoint && this.mobileBreakpoint !== 0) {
			this.initMobileBreakpoint();
		}

		var event = new Event('MOUNTED', {
			bubbles: true,
		});
		event.ID = this.rootID;

		this.root.dispatchEvent(event);
		this._state = 'IDLE';
	}

	// initAutoTransparentSpacing() {
	// 	const self = this;

	// 	this.setAutoTransparentSpacing();

	// 	document.onresize = self.setAutoTransparentSpacing;
	// }

	// setAutoTransparentSpacing() {
	// 	const self = this;

	// 	const height = this.getHeight();

	// 	const elementToApply = this.root.nextElementSibling;

	// 	elementToApply.style.paddingTop = height + 'px';
	// }

	// getHeight() {
	// 	return this.root.querySelector('div').clientHeight;
	// }

	/**
	 * Initiate the script to stick the header.
	 * http://www.mattmorgante.com/technology/sticky-navigation-bar-javascript
	 */
	initMobileBreakpoint() {
		const self = this;

		if (this.mobileBreakpoint && this.mobileBreakpoint !== 0) {
			window.addEventListener('resize', this.updateMobileBreakpoint.bind(this), false);
			window.addEventListener('hashchange', this.updateMobileBreakpoint.bind(this), false);
			window.addEventListener('scroll', this.updateMobileBreakpoint.bind(this), false);
			window.addEventListener('load', this.updateMobileBreakpoint.bind(this), false);
			window.addEventListener('orientationchange', this.updateMobileBreakpoint.bind(this));
		}
	}

	updateMobileBreakpoint() {
		const self = this;

		this.setActiveSize();

		// If we have a mobile breakpoint, hide the desktop or tablet header depending on the current active size
		if (this.activeSize == 'desktop') {
			this.root.querySelector('.wp-block-kadence-header-tablet').style.display = 'none';
			this.root.querySelector('.wp-block-kadence-header-desktop').style.display = 'block';
		} else {
			this.root.querySelector('.wp-block-kadence-header-desktop').style.display = 'none';
			this.root.querySelector('.wp-block-kadence-header-tablet').style.display = 'block';
		}
	}

	/**
	 * Initiate the script to stick the header.
	 * http://www.mattmorgante.com/technology/sticky-navigation-bar-javascript
	 */
	initStickyHeader() {
		const self = this;

		if (this.sticky) {
			this.createAndSetPlaceholderAndStickyWrappers('desktop');
		}
		if (this.stickyTablet || this.stickyMobile) {
			this.createAndSetPlaceholderAndStickyWrappers('tablet');
		}

		if (this.placeholderWrapper && this.stickyWrapper) {
			this.setActiveSize();
			this.updatePlaceholderAndStickyWrappers();

			if (this.activeSize == 'desktop') {
				if (this.sticky) {
					this.activeOffsetTop = this.getOffset(this.placeholderWrapper).top;
				}
			} else if (this.activeSize == 'tablet') {
				if (this.stickyTablet) {
					this.activeOffsetTop = this.getOffset(this.placeholderWrapper).top;
				}
			} else if (this.stickyMobile) {
				this.activeOffsetTop = this.getOffset(this.placeholderWrapper).top;
			}
			window.addEventListener('resize', this.updateSticky.bind(this), false);
			window.addEventListener('hashchange', this.updateSticky.bind(this), false);
			window.addEventListener('scroll', this.updateSticky.bind(this), false);
			window.addEventListener('load', this.updateSticky.bind(this), false);
			window.addEventListener('orientationchange', this.updateSticky.bind(this));
			if (document.readyState === 'complete') {
				this.updateSticky('updateActive');
			}
			if (
				document.body.classList.contains('woocommerce-demo-store') &&
				document.body.classList.contains('kadence-store-notice-placement-above')
			) {
				this.respondToVisibility(document.querySelector('.woocommerce-store-notice'), (visible) => {
					this.updateSticky('updateActive').bind(this);
				});
			}
		}
	}

	setActiveSize() {
		const desktopBreakpointToUse =
			this.mobileBreakpoint && this.mobileBreakpoint !== 0
				? this.mobileBreakpoint
				: kadenceHeaderConfig.breakPoints.desktop;
		if (parseInt(desktopBreakpointToUse) < window.innerWidth) {
			this.activeSize = 'desktop';
		} else if (parseInt(kadenceHeaderConfig.breakPoints.tablet) < window.innerWidth) {
			this.activeSize = 'tablet';
		} else {
			this.activeSize = 'mobile';
		}

		//TODO this could be cached or something
		const sizedContainerSelector =
			this.activeSize == 'desktop' ? '.wp-block-kadence-header-desktop' : '.wp-block-kadence-header-tablet';
		this.activeHeaderContainer = this.root.querySelector(sizedContainerSelector);
	}

	/**
	 * setup the placeholderwrapper and stickywrapper variables for the desktop or tablet container based on the given size.
	 * potentially by creating the neccessary wrappers
	 */
	createAndSetPlaceholderAndStickyWrappers(size) {
		const sizedContainerSelector =
			size == 'desktop' ? '.wp-block-kadence-header-desktop' : '.wp-block-kadence-header-tablet';
		const stickySectionToUse = this['stickySection' + this.activeSizeCased(size)];
		if (stickySectionToUse == 'top' || stickySectionToUse == 'bottom' || stickySectionToUse == 'main') {
			//single row
			var rowSelector = '';
			if (stickySectionToUse == 'top') {
				rowSelector = '.wp-block-kadence-header-row-top';
			} else if (stickySectionToUse == 'bottom') {
				rowSelector = '.wp-block-kadence-header-row-bottom';
			} else {
				rowSelector = '.wp-block-kadence-header-row-center';
			}
			this.stickyWrapper = this.root.querySelector(sizedContainerSelector + ' ' + rowSelector);
			this.placeholderWrapper = this.wrap([this.stickyWrapper]);
		} else if (stickySectionToUse == 'top_main' || stickySectionToUse == 'bottom_main') {
			//multi row
			var rows = [];
			if (stickySectionToUse == 'top_main') {
				rows.push(this.root.querySelector(sizedContainerSelector + ' .wp-block-kadence-header-row-top'));
				rows.push(this.root.querySelector(sizedContainerSelector + ' .wp-block-kadence-header-row-center'));
			}
			if (stickySectionToUse == 'bottom_main') {
				rows.push(this.root.querySelector(sizedContainerSelector + ' .wp-block-kadence-header-row-center'));
				rows.push(this.root.querySelector(sizedContainerSelector + ' .wp-block-kadence-header-row-bottom'));
			}
			this.stickyWrapper = this.wrap(rows);
			this.placeholderWrapper = this.wrap([this.stickyWrapper]);
		} else {
			//whole header
			this.stickyWrapper = this.root.querySelector(sizedContainerSelector);
			this.placeholderWrapper = this.root;
		}

		if (this.stickyWrapper && this.placeholderWrapper) {
			this.stickyWrapper.classList.add('kb-header-sticky-wrapper');
			this.placeholderWrapper.classList.add('kb-header-placeholder-wrapper');
		}
	}

	/**
	 * update placeholderwrapper and stickywrapper variables according to the current active size.
	 */
	updatePlaceholderAndStickyWrappers() {
		const stickySectionToUse = this['stickySection' + this.activeSizeCased()];
		if (stickySectionToUse) {
			//single row or multi row
			this.stickyWrapper = this.activeHeaderContainer.querySelector('.kb-header-sticky-wrapper');
			this.placeholderWrapper = this.activeHeaderContainer.querySelector('.kb-header-placeholder-wrapper');
		} else {
			//whole header
			this.stickyWrapper = this.activeHeaderContainer;
			this.placeholderWrapper = this.root;
		}
	}

	/**
	 * wrap an arrray of elements in a wrapper
	 * http://www.mattmorgante.com/technology/sticky-navigation-bar-javascript
	 */
	wrap(toWrap, wrapper) {
		wrapper = wrapper || document.createElement('div');
		if (toWrap && toWrap[0]) {
			toWrap[0].parentNode.insertBefore(wrapper, toWrap[0]);
			toWrap.forEach((element) => {
				wrapper.appendChild(element);
			});
		}
		return wrapper;
	}

	respondToVisibility(element, callback) {
		var options = {
			root: document.documentElement,
		};

		var observer = new IntersectionObserver((entries, observer) => {
			entries.forEach((entry) => {
				callback(entry.intersectionRatio > 0);
			});
		}, options);

		observer.observe(element);
	}

	updateSticky(e) {
		const self = this;
		if (!this.stickyWrapper) {
			return;
		}

		//TODO change wrapper to something that also applies to fse themes
		const wrapper = document.getElementsByClassName('wp-site-blocks')?.[0];
		var offsetTop = this.getOffset(wrapper).top;
		this.anchorOffset = this.getOffset(this.placeholderWrapper).top;
		var currScrollTop = window.scrollY;

		this.setActiveSize();
		this.activeOffsetTop = this.getOffset(this.stickyWrapper).top;

		//don't do sticky stuff if the current screen size is not set to style sticky
		if (
			!(
				(this.activeSize === 'desktop' && this.sticky) ||
				(this.activeSize === 'tablet' && this.stickyTablet) ||
				(this.activeSize === 'mobile' && this.stickyMobile)
			)
		) {
			//reset all state classes and end
			this.stickyWrapper.classList.remove('item-is-fixed');
			this.stickyWrapper.classList.remove('item-at-start');
			this.stickyWrapper.classList.remove('item-is-stuck');
			this.stickyWrapper.style.height = null;
			this.stickyWrapper.style.top = null;
			this.stickyWrapper.style.position = 'initial';
			parent.classList.remove('child-is-fixed');
			document.body.classList.remove('header-is-fixed');
			return;
		}

		//set current active header for current size
		this.updatePlaceholderAndStickyWrappers();
		if (e && e === 'updateActive') {
			this.stickyWrapper.style.top = 'auto';
		}

		//set the container anchor height to create a sized placeholder for the header (but only if we're not also transparent)
		var elHeight = this.stickyWrapper.offsetHeight;
		var elWidth = this.placeholderWrapper.offsetWidth;
		var elOffsetLeft = this.getOffset(this.placeholderWrapper).left;
		const activeSizeCased = this.activeSizeCased();
		if (!this['transparent' + activeSizeCased]) {
			this.placeholderWrapper.style.height = elHeight + 'px';
		} else {
			this.placeholderWrapper.style.height = null;
		}
		if ('' !== this['stickySection' + activeSizeCased] && this['transparent' + activeSizeCased]) {
			this.placeholderWrapper.style.height = elHeight + 'px';
		} else {
			this.placeholderWrapper.style.height = null;
		}

		// Adjust offsetTop depending on certain top of page elements
		if (document.body.classList.toString().includes('boom_bar-static-top')) {
			var boomBar = document.querySelector('.boom_bar');
			offsetTop = this.getOffset(wrapper).top - boomBar.offsetHeight;
		}

		var proElements = document.querySelectorAll('.kadence-before-wrapper-item');
		if (proElements.length) {
			var proElementOffset = 0;
			for (let i = 0; i < proElements.length; i++) {
				proElementOffset = proElementOffset + proElements[i].offsetHeight;
			}
			offsetTop = this.getOffset(wrapper).top - proElementOffset;
		}

		var proSticky = document.querySelectorAll('.kadence-pro-fixed-above');
		if (proSticky.length) {
			var proOffset = 0;
			for (let i = 0; i < proSticky.length; i++) {
				proOffset = proOffset + proSticky[i].offsetHeight;
			}
			offsetTop = this.getOffset(wrapper).top + proOffset;
		}

		var megaMenus = this.stickyWrapper.querySelectorAll('.kadence-menu-mega-enabled > .kb-nav-sub-menu');
		if (megaMenus.length) {
			var megaOffset = this.getOffset(megaMenus[0]).top;
			this.stickyWrapper.style.setProperty(
				'--kb-sticky-mega-overflow-header-offset',
				megaOffset - currScrollTop + 'px'
			);
		}

		const topPosThatSticksToTop = offsetTop;
		const topPosThatSticksAboveTop = offsetTop - elHeight;
		const currentBottomPosition = this.currentTopPosition + elHeight;

		var parent = this.stickyWrapper.parentNode;

		// Run the shrinking / unshrinking processing
		if (this.shrinkMain) {
			const shrinkHeight =
				this.activeSize === 'mobile'
					? this.shrinkMainHeightMobile
					: this.activeSize === 'tablet'
						? this.shrinkMainHeightTablet
						: this.shrinkMainHeight;
			if (shrinkHeight) {
				// Set totalOffsetDelay
				// var totalOffsetDelay = Math.floor(this.activeOffsetTop - offsetTop);
				// if (this.revealScrollUp) {
				// 	if (window.scrollY > this.lastScrollTop) {
				// 		var totalOffsetDelay = Math.floor(
				// 			Math.floor(this.activeOffsetTop) - Math.floor(offsetTop) + Math.floor(shrinkHeight)
				// 		);
				// 	} else {
				// 		var totalOffsetDelay = Math.floor(this.activeOffsetTop - offsetTop);
				// 	}
				// }
				const shrinkLogos = this.activeHeaderContainer.querySelectorAll(
					'.kb-img, .wp-block-kadence-identity img, .wp-block-image img'
				);
				const shrinkHeader = this.activeHeaderContainer.querySelector(
					'.wp-block-kadence-header-row-center .kadence-header-row-inner'
				);

				//set shrink starting height
				if (!this.shrinkStartHeight || (e && undefined !== e.type && 'orientationchange' === e.type)) {
					this.shrinkStartHeight = shrinkHeader.offsetHeight;
				}

				// either shrink or unshrink the header based on scroll position
				const shrinkingHeight = Math.max(shrinkHeight, this.shrinkStartHeight - window.scrollY);
				shrinkHeader.style.height = shrinkingHeight + 'px';
				shrinkHeader.style.minHeight = shrinkingHeight + 'px';
				shrinkHeader.style.maxHeight = shrinkingHeight + 'px';

				if (window.scrollY == 0) {
					//at top, release logos
					if (shrinkLogos) {
						for (let i = 0; i < shrinkLogos.length; i++) {
							const shrinkLogo = shrinkLogos[i];
							shrinkLogo.style.maxHeight = '100%';
						}
					}
				} else if (shrinkLogos) {
					//in shrinking state, reduce logos
					for (let i = 0; i < shrinkLogos.length; i++) {
						const shrinkLogo = shrinkLogos[i];
						if (!shrinkLogo.closest('.mega-menu')) {
							shrinkLogo.style.maxHeight = shrinkingHeight + 'px';
						}
					}
				}
			}
		}

		//set the position to fixed
		if (this.isSticking) {
			this.stickyWrapper.style.position = 'fixed';
			this.stickyWrapper.style.width = elWidth + 'px';
			this.stickyWrapper.style.left = elOffsetLeft + 'px';
			this.stickyWrapper.style.top = offsetTop + 'px';
		} else {
			this.stickyWrapper.style.position = 'initial';
			this.stickyWrapper.style.width = 'initial';
			this.stickyWrapper.style.left = 'initial';
			this.stickyWrapper.style.top = 'initial';
		}

		// Run the revealing / hidding processing or the sticky process
		if (this.revealScrollUp) {
			// Run the revealing / hidding processing
			var isScrollingDown = currScrollTop > this.lastScrollTop;
			var totalOffset = Math.floor(this.anchorOffset + elHeight);
			if (currScrollTop <= this.anchorOffset - offsetTop) {
				//above the initial header area, ignore the header
				//this.stickyWrapper.style.top = 0;
				this.currentTopPosition = 0;
				this.setStickyChanged(false);
			} else if (currScrollTop <= totalOffset) {
				//scrolling in the initial header area
				if (isScrollingDown) {
					//ignore the header if scrolling down
					//this.stickyWrapper.style.top = 0;
					this.currentTopPosition = 0;
					this.setStickyChanged(false);
				} else {
					//keep sticking if scrolling up
					this.stickyWrapper.classList.remove('item-hidden-above');
					//this.stickyWrapper.style.top = topPosThatSticksToTop + 'px';
					this.currentTopPosition = topPosThatSticksToTop;
					this.setStickyChanged(true);
				}
			} else if (currScrollTop >= this.currentTopPosition && currScrollTop <= currentBottomPosition) {
				//in current sticky header area, ignore it
				this.setStickyChanged(false);
			} else {
				//below the initial header area, but above or below the current sticky area
				if (isScrollingDown) {
					//scrolling down, keep the header top just above the screen
					this.stickyWrapper.classList.add('item-hidden-above');
					this.stickyWrapper.style.top = topPosThatSticksAboveTop + 'px';
					this.currentTopPosition = topPosThatSticksAboveTop;
				} else {
					//scrolling up, keep the header top at scroll position
					this.stickyWrapper.classList.remove('item-hidden-above');
					//this.stickyWrapper.style.top = topPosThatSticksToTop + 'px';
					this.currentTopPosition = topPosThatSticksToTop;
				}
				this.setStickyChanged(true);
			}
		} else {
			// Run the sticking process
			var totalOffset = Math.floor(this.anchorOffset - offsetTop);
			if (currScrollTop <= totalOffset) {
				//above the header anchor, ignore
				// this.stickyWrapper.style.top = 0;
				this.currentTopPosition = 0;
				this.setStickyChanged(false);
			} else {
				//below the header anchor, match it's top to the scroll position
				// this.stickyWrapper.style.top = topPosThatSticksToTop + 'px';
				this.currentTopPosition = topPosThatSticksToTop;
				this.setStickyChanged(true);
			}
		}
		this.lastScrollTop = currScrollTop;

		// Set state classes on the header based on scroll position
		// TODO not sure if this is neccessary as a seperate block of logic, may be better integrated into the stickychanged function
		if (window.scrollY == totalOffset) {
			//this.stickyWrapper.style.top = offsetTop + 'px';
			this.stickyWrapper.classList.add('item-is-fixed');
			this.stickyWrapper.classList.add('item-at-start');
			this.stickyWrapper.classList.remove('item-is-stuck');
			parent.classList.add('child-is-fixed');
			document.body.classList.add('header-is-fixed');
		} else if (window.scrollY > totalOffset) {
			if (this.revealScrollUp) {
				if (window.scrollY < elHeight + 60 && this.stickyWrapper.classList.contains('item-at-start')) {
					this.stickyWrapper.style.height = null;
					//this.stickyWrapper.style.top = offsetTop + 'px';
					this.stickyWrapper.classList.add('item-is-fixed');
					this.stickyWrapper.classList.add('item-is-stuck');
					parent.classList.add('child-is-fixed');
					document.body.classList.add('header-is-fixed');
				} else {
					//this.stickyWrapper.style.top = offsetTop + 'px';
					this.stickyWrapper.classList.add('item-is-fixed');
					this.stickyWrapper.classList.add('item-is-stuck');
					this.stickyWrapper.classList.remove('item-at-start');
					parent.classList.add('child-is-fixed');
					document.body.classList.add('header-is-fixed');
				}
			} else {
				//this.stickyWrapper.style.top = offsetTop + 'px';
				this.stickyWrapper.classList.add('item-is-fixed');
				this.stickyWrapper.classList.remove('item-at-start');
				this.stickyWrapper.classList.add('item-is-stuck');
				parent.classList.add('child-is-fixed');
				document.body.classList.add('header-is-fixed');
			}
		} else if (this.stickyWrapper.classList.contains('item-is-fixed')) {
			this.stickyWrapper.classList.remove('item-is-fixed');
			this.stickyWrapper.classList.remove('item-at-start');
			this.stickyWrapper.classList.remove('item-is-stuck');
			this.stickyWrapper.style.position = 'initial';
			this.stickyWrapper.style.width = 'initial';
			this.stickyWrapper.style.left = 'initial';
			this.stickyWrapper.style.top = 'initial';
			this.stickyWrapper.style.height = null;
			//this.stickyWrapper.style.top = null;
			parent.classList.remove('child-is-fixed');
			document.body.classList.remove('header-is-fixed');
		}
	}

	activeSizeCased(size) {
		const sizeToUse = size ? size : this.activeSize;
		return sizeToUse === 'desktop' ? '' : sizeToUse.charAt(0).toUpperCase() + sizeToUse.slice(1);
	}

	setStickyChanged(isSticking) {
		if (this.isSticking != isSticking) {
			this.isSticking = isSticking;

			var event = new Event('KADENCE_HEADER_STICKY_CHANGED', {
				bubbles: true,
			});
			event.isSticking = this.isSticking;

			this.root.dispatchEvent(event);
		}
	}

	setTransparentChanged(isTransparent) {
		if (this.isTransparent != isTransparent) {
			this.isTransparent = isTransparent;

			var event = new Event('KADENCE_HEADER_STICKY_CHANGED', {
				bubbles: true,
			});
			event.isTransparent = this.isTransparent;

			this.root.dispatchEvent(event);
		}
	}

	/**
	 * Get element's offset.
	 */
	getOffset(el) {
		if (el instanceof HTMLElement) {
			var rect = el.getBoundingClientRect();

			return {
				top: rect.top + window.pageYOffset,
				left: rect.left + window.pageXOffset,
			};
		}

		return {
			top: null,
			left: null,
		};
	}

	/**
	 * Returns options.
	 *
	 * @return {string} An object with the latest options.
	 */
	get state() {
		return this._state;
	}

	/**
	 * Merges options to the current options and emits `updated` event.
	 *
	 * @param options - An object with new options.
	 */
	set state(val) {
		this._state = val;

		var event = new Event('STATE');
		event.val = val;
		event.ID = this.rootID;

		this.root.dispatchEvent(event);
	}
}
window.KBHeader = KBHeader;

const initKBHeader = () => {
	// Testing var, can remove
	window.KBHeaderBlocks = [];

	var headerBlocks = document.querySelectorAll('.wp-block-kadence-header');

	for (let i = 0; i < headerBlocks.length; i++) {
		var headerBlock = headerBlocks[i];
		const kbHeaderBlock = new KBHeader(headerBlock);
		window.KBHeaderBlocks.push(kbHeaderBlock);
	}
};

if ('loading' === document.readyState) {
	// The DOM has not yet been loaded.
	document.addEventListener('DOMContentLoaded', initKBHeader);
} else {
	// The DOM has already been loaded.
	initKBHeader();
}
