/**
 * File kb-navigation-block.js.
 *
 * Handles accessibility and mobile toggles for navigation.
 */
(function () {
	/**
	 * Get element's offset.
	 */
	const getElmOffset = function (el) {
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
	};
	/**
	 * Returns true if element is the
	 * first focusable element in the container.
	 * @param {Object} container
	 * @param {Object} element
	 * @param {string} focusSelector
	 * @return {boolean} whether or not the element is the first focusable element in the container
	 */
	const isfirstFocusableElement = function (container, element, focusSelector) {
		var focusableElements = container.querySelectorAll(focusSelector);
		if (0 < focusableElements.length) {
			return element === focusableElements[0];
		}
		return false;
	};
	/**
	 * Returns true if element is the
	 * last focusable element in the container.
	 * @param {Object} container
	 * @param {Object} element
	 * @param {string} focusSelector
	 * @return {boolean} whether or not the element is the last focusable element in the container
	 */
	const islastFocusableElement = function (container, element, focusSelector) {
		var focusableElements = container.querySelectorAll(focusSelector);
		if (0 < focusableElements.length) {
			return element === focusableElements[focusableElements.length - 1];
		}
		return false;
	};
	/**
	 * Toggle submenus open and closed, and tell screen readers what's going on.
	 * @param {Object} parentMenuItem Parent menu element.
	 * @param {boolean} forceToggle Force the menu toggle.
	 * @return {void}
	 */
	const toggleSubMenu = function (parentMenuItem, forceToggle) {
		const toggleButton = parentMenuItem.querySelector('.kb-nav-dropdown-toggle-btn'),
			subMenu = parentMenuItem.querySelector('ul.sub-menu');
		let parentMenuItemToggled = parentMenuItem.classList.contains('menu-item--toggled-on');
		// Will be true if we want to force the toggle on, false if force toggle close.
		if (undefined !== forceToggle && 'boolean' === typeof forceToggle) {
			parentMenuItemToggled = !forceToggle;
		}
		// Toggle aria-expanded status.
		toggleButton.setAttribute('aria-expanded', (!parentMenuItemToggled).toString());

		/*
		 * Steps to handle during toggle:
		 * - Let the parent menu item know we're toggled on/off.
		 * - Toggle the ARIA expand or collapse.
		 */
		if (parentMenuItemToggled) {
			// Toggle "off" the submenu.
			parentMenuItem.classList.remove('menu-item--toggled-on');
			subMenu.classList.remove('toggle-show');

			// Make sure all children are closed.
			var subMenuItemsToggled = parentMenuItem.querySelectorAll('.menu-item--toggled-on');
			for (let i = 0; i < subMenuItemsToggled.length; i++) {
				toggleSubMenu(subMenuItemsToggled[i], false);
			}
		} else {
			// Make sure siblings are closed.
			var parentMenuItemsToggled = parentMenuItem.parentNode.querySelectorAll('li.menu-item--toggled-on');
			for (let i = 0; i < parentMenuItemsToggled.length; i++) {
				toggleSubMenu(parentMenuItemsToggled[i], false);
			}

			// Toggle "on" the submenu.
			parentMenuItem.classList.add('menu-item--toggled-on');
			subMenu.classList.add('toggle-show');
		}
	};
	/**
	 * Initiate the script to process each
	 * navigation dropdown to check if the dropdown will go aff screen.
	 */
	const initEachNavToggleSubmenuInside = function (nav) {
		// Get the submenus.
		var submenuParents = nav.querySelectorAll('.menu-item-has-children');

		// No point if no submenus.
		if (!submenuParents.length) {
			return;
		}

		for (let i = 0; i < submenuParents.length; i++) {
			// Handle verifying if navigation will go offscreen
			submenuParents[i].addEventListener('mouseenter', function (e) {
				if (submenuParents[i].querySelector('ul.sub-menu')) {
					var elm = submenuParents[i].querySelector('ul.sub-menu');
					var off = getElmOffset(elm);
					var l = off.left;
					var w = elm.offsetWidth;
					var docW = window.innerWidth;

					var isEntirelyVisible = l + w <= docW;

					if (!isEntirelyVisible) {
						elm.classList.add('sub-menu-edge');
					}
				}
			});
		}
	};
	/**
	 * Initiate the script to process each
	 * navigation tab with submenu support.
	 */
	const initNavBlockSubmenus = function (nav) {
		// Get the submenus.
		const submenus = nav.querySelectorAll('.kb-navigation .sub-menu');

		// No point if no submenus.
		if (!submenus.length) {
			return;
		}

		for (let i = 0; i < submenus.length; i++) {
			// Toggle the submenu when we click the dropdown button.
			submenus[i].parentNode.querySelector('.kb-nav-dropdown-toggle-btn').addEventListener('click', function (e) {
				e.preventDefault();
				toggleSubMenu(submenus[i].parentNode);
			});

			// Clean up the toggle if a mouse takes over from keyboard.
			submenus[i].parentNode.addEventListener('mouseleave', function (e) {
				toggleSubMenu(e.target, false);
			});

			// When we focus on a menu link, make sure all siblings are closed.
			submenus[i].parentNode.querySelector('a').addEventListener('focus', function (e) {
				var parentMenuItemsToggled =
					e.target.parentNode.parentNode.querySelectorAll('li.menu-item--toggled-on');
				for (let j = 0; j < parentMenuItemsToggled.length; j++) {
					if (submenus[i].parentNode !== parentMenuItemsToggled[j]) {
						toggleSubMenu(parentMenuItemsToggled[j], false);
					}
				}
			});

			// Handle keyboard accessibility for traversing menu.
			submenus[i].addEventListener('keydown', function (e) {
				// These specific selectors help us only select items that are visible.
				var focusSelector =
					'ul.toggle-show > li > .kb-link-wrap > a, ul.toggle-show > li > .kb-link-wrap > .kb-nav-dropdown-toggle-btn';

				// 9 is tab KeyMap
				if (9 === e.keyCode) {
					if (e.shiftKey) {
						// Means we're tabbing out of the beginning of the submenu.
						if (isfirstFocusableElement(submenus[i], document.activeElement, focusSelector)) {
							toggleSubMenu(submenus[i].parentNode, false);
						}
						// Means we're tabbing out of the end of the submenu.
					} else if (islastFocusableElement(submenus[i], document.activeElement, focusSelector)) {
						toggleSubMenu(submenus[i].parentNode, false);
					}
				}
				// 27 is keymap for esc key.
				if (e.keyCode === 27) {
					toggleSubMenu(submenus[i].parentNode, false);
				}
			});

			submenus[i].parentNode.classList.add('menu-item--has-toggle');
		}
	};
	/**
	 * Determine what orientation the nav is at the currrent screen size.
	 */
	const trackOrientation = function (navs) {
		// No point if no submenus.
		if (!navs.length) {
			return;
		}
		for (let i = 0; i < navs.length; i++) {
			const nav = navs[i];
			var isVertical = false;
			if (window.innerWidth >= 1024) {
				if (nav.classList.contains('navigation-desktop-orientation-vertical')) {
					isVertical = true;
				}
			} else if (window.innerWidth < 1024 && window.innerWidth >= 768) {
				if (nav.classList.contains('navigation-tablet-orientation-vertical')) {
					isVertical = true;
				}
			} else if (window.innerWidth < 768) {
				if (nav.classList.contains('navigation-mobile-orientation-vertical')) {
					isVertical = true;
				}
			}

			if (isVertical) {
				nav.classList.remove('is-horizontal');
				nav.classList.add('is-vertical');
			} else {
				nav.classList.remove('is-vertical');
				nav.classList.add('is-horizontal');
			}
		}
	};
	/**
	 * Setup the Fullwith Menu.
	 */
	const runSubMenuFullSize = function () {
		var contentSubmenus = null;
		if (window.innerWidth > 1024) {
			contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation .kadence-menu-mega-width-full > ul.sub-menu'
			);
		} else if (window.innerWidth > 768) {
			contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation .kadence-menu-mega-width-tablet-full > ul.sub-menu'
			);
		} else {
			contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation .kadence-menu-mega-width-mobile-full > ul.sub-menu'
			);
		}
		for (let i = 0; i < contentSubmenus.length; i++) {
			var parentMenuItem = contentSubmenus[i].parentNode;
			contentSubmenus[i].style.left = '';
			contentSubmenus[i].style.width = window.innerWidth + 'px';
			contentSubmenus[i].style.left =
				-1 * Math.abs(parentMenuItem.getBoundingClientRect().left).toString() + 'px';
			contentSubmenus[i].style.transform = 'initial';
		}
	};
	/**
	 * Initiate the script to toggle cart when product is added.
	 */
	const initFullSubMenuSize = function () {
		var megaMenus = document.querySelectorAll(
			'.wp-block-kadence-navigation .kadence-menu-mega-width-full > ul.sub-menu'
		);
		// No point if no Mega Menus.
		if (!megaMenus.length) {
			return;
		}
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				runSubMenuFullSize();
			}, 200);
		});
		runSubMenuFullSize();
	};
	const initNavigation = function () {
		var navigationBlocks = document.querySelectorAll('.wp-block-kadence-navigation');
		// No point if no navs.
		if (!navigationBlocks.length) {
			return;
		}
		for (let i = 0; i < navigationBlocks.length; i++) {
			initNavBlockSubmenus(navigationBlocks[i]);
			initEachNavToggleSubmenuInside(navigationBlocks[i]);
		}
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				trackOrientation(navigationBlocks);
			}, 200);
		});
		trackOrientation(navigationBlocks);
	};

	// Initialize immediately for already loaded DOM
	initNavigation();
	initFullSubMenuSize();
})();
