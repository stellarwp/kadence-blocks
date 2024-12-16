/**
 * File kb-navigation-block.js.
 *
 * Handles accessibility and mobile toggles for navigation.
 */
(function () {
	const focusableElementsString =
		'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
	/**
	 * Get element's offset.
	 */
	const getElmOffset = function (el) {
		if (el instanceof HTMLElement) {
			var rect = el.getBoundingClientRect();

			return {
				top: rect.top + window.pageYOffset,
				left: rect.left + window.pageXOffset,
				right: rect.right + window.pageXOffset,
			};
		}

		return {
			top: null,
			left: null,
			right: null,
		};
	};
	/**
	 * Toggle submenus open and closed, and tell screen readers what's going on.
	 * @param {Object} parentMenuItem Parent menu element.
	 * @param {boolean} forceToggle Force the menu toggle.
	 * @return {void}
	 */
	const toggleSubMenu = function (parentMenuItem, forceToggle = null, isVertical = false) {
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
			setTimeout(function () {
				parentMenuItem.classList.remove('menu-item--toggled-on');
				subMenu.classList.remove('toggle-show');
			}, 5);

			// Make sure all children are closed.
			var subMenuItemsToggled = parentMenuItem.querySelectorAll('.menu-item--toggled-on');
			for (let i = 0; i < subMenuItemsToggled.length; i++) {
				toggleSubMenu(subMenuItemsToggled[i], false);
			}
		} else {
			if (!isVertical) {
				// Make sure siblings are closed.
				var parentMenuItemsToggled = parentMenuItem.parentNode.querySelectorAll('li.menu-item--toggled-on');
				for (let i = 0; i < parentMenuItemsToggled.length; i++) {
					toggleSubMenu(parentMenuItemsToggled[i], false);
				}
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
					var r = off.right;
					var w = elm.offsetWidth;
					var docW = window.innerWidth;

					var isEntirelyVisibleToRight = l + w <= docW;
					var isEntirelyVisibleToLeft = r - w >= 0;

					// console.log(off, l, r, w, docW, isEntirelyVisibleToRight, isEntirelyVisibleToLeft);

					if (!isEntirelyVisibleToRight) {
						elm.classList.add('sub-menu-right-edge');
					}
					if (!isEntirelyVisibleToLeft) {
						elm.classList.add('sub-menu-left-edge');
					}
				}
			});
		}
	};
	/**
	 * Close all open submenus when clicking outside.
	 * @return {void}
	 */
	const handleClickOutsideSubmenus = function () {
		document.addEventListener('click', function (e) {
			// Find all open submenus.
			const openSubmenus = document.querySelectorAll('.menu-item--toggled-on');

			// Close any open submenus if the click is outside them.
			openSubmenus.forEach((submenu) => {
				// Check if the click is outside the submenu and its parent menu item.
				if (!submenu.contains(e.target)) {
					toggleSubMenu(submenu, false);
				}
			});
		});
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
				toggleSubMenu(submenus[i].parentNode, null, nav.classList.contains('is-vertical'));
			});
			if (submenus[i].parentNode.classList.contains('kb-nav-link-sub-click')) {
				submenus[i].parentNode
					.querySelector(':scope > .kb-link-wrap > a')
					.addEventListener('click', function (e) {
						e.preventDefault();
						toggleSubMenu(submenus[i].parentNode, null, nav.classList.contains('is-vertical'));
					});
			}

			// Clean up the toggle if a mouse takes over from keyboard.
			submenus[i].parentNode.addEventListener('mouseleave', function (e) {
				// If we're vertical, we don't need to do anything.
				if (nav.classList.contains('is-vertical')) {
					return;
				}
				if (e.target.classList.contains('kb-nav-link-sub-click')) {
					return;
				}
				toggleSubMenu(e.target, false);
			});

			// When we focus on a menu link, make sure all siblings are closed.
			submenus[i].parentNode.querySelector('a').addEventListener('focus', function (e) {
				// If we're vertical, we don't need to do anything.
				if (nav.classList.contains('is-vertical')) {
					return;
				}
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
				// If we're vertical, we don't need to do anything.
				if (nav.classList.contains('is-vertical')) {
					return;
				}
				// 9 is tab KeyMap
				if (9 === e.keyCode) {
					var focusSelector =
						'ul.toggle-show > li > .kb-link-wrap > a, ul.toggle-show > li > .kb-link-wrap > .kb-nav-dropdown-toggle-btn';
					if (submenus[i].parentNode.classList.contains('kadence-menu-mega-enabled')) {
						focusSelector = focusableElementsString;
					}
					var visibleFocusableElements = Array.from(submenus[i].querySelectorAll(focusSelector));
					if (e.shiftKey) {
						// Means we're tabbing out of the beginning of the submenu.
						if (document.activeElement === visibleFocusableElements[0]) {
							toggleSubMenu(submenus[i].parentNode, false);
						}
						// Means we're tabbing out of the end of the submenu.
					} else if (
						document.activeElement === visibleFocusableElements[visibleFocusableElements.length - 1]
					) {
						toggleSubMenu(submenus[i].parentNode, false);
						// Move the focus back to the toggle.
						setTimeout(function () {
							submenus[i].parentNode.querySelector('.kb-nav-dropdown-toggle-btn').focus();
						}, 5);
					}
				}
				// 27 is keymap for esc key.
				if (e.keyCode === 27) {
					toggleSubMenu(submenus[i].parentNode, false);
					// Move the focus back to the toggle.
					submenus[i].parentNode.querySelector('.kb-nav-dropdown-toggle-btn').focus();
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
				'.wp-block-kadence-navigation.navigation-desktop-orientation-horizontal .kb-menu-mega-width-full > ul.sub-menu'
			);
		} else if (window.innerWidth > 768) {
			contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation.navigation-tablet-orientation-horizontal .kb-menu-mega-width-tablet-full > ul.sub-menu'
			);
		} else {
			contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation.navigation-mobile-orientation-horizontal .kb-menu-mega-width-mobile-full > ul.sub-menu'
			);
		}
		for (let i = 0; i < contentSubmenus.length; i++) {
			var parentMenuItem = contentSubmenus[i].parentNode;
			contentSubmenus[i].style.setProperty('--kb-nav-dropdown-width', window.innerWidth + 'px');
			contentSubmenus[i].style.setProperty(
				'--kb-nav-dropdown-show-left',
				-1 * Math.abs(parentMenuItem.getBoundingClientRect().left).toString() + 'px'
			);
			contentSubmenus[i].style.setProperty('--kb-nav-dropdown-hide-transform-x', '0');
			contentSubmenus[i].style.setProperty('--kb-nav-dropdown-show-transform-x', '0');
		}
	};
	/**
	 * Initiate the script to process all
	 * navigation menus inside the offcanvas.
	 */
	const initMobileToggleSub = function () {
		var modalMenus = document.querySelectorAll(
			'.kb-off-canvas-inner .wp-block-kadence-navigation .menu-item-has-children'
		);
		// No point if no submenus.
		if (!modalMenus.length) {
			return;
		}

		for (let i = 0; i < modalMenus.length; i++) {
			var activeMenuItem = modalMenus[i].querySelector('.current-menu-item');
			if (activeMenuItem) {
				toggleSubMenu(modalMenus[i], true);
			}
		}
	};
	/**
	 * Initiate the script to handle fullwith mega menus.
	 */
	const initFullSubMenuSize = function () {
		var megaMenus = document.querySelectorAll(
			'.wp-block-kadence-navigation .kb-menu-mega-width-full > ul.sub-menu'
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
	/**
	 * Make the content submenu size work.
	 */
	const runSubMenuContentSize = function () {
		var contentSubmenus = null;
		if (window.innerWidth > 1024) {
			contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation.navigation-desktop-orientation-horizontal .kb-menu-mega-width-content > ul.sub-menu'
			);
		} else if (window.innerWidth > 768) {
			contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation.navigation-tablet-orientation-horizontal .kb-menu-mega-width-tablet-content > ul.sub-menu'
			);
		} else {
			contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation.navigation-mobile-orientation-horizontal .kb-menu-mega-width-mobile-content > ul.sub-menu'
			);
		}
		if (contentSubmenus?.length) {
			for (let i = 0; i < contentSubmenus.length; i++) {
				var parentMenuItem = contentSubmenus[i].parentNode;
				var row = contentSubmenus[i].closest('.kadence-header-row-inner');
				if (row) {
					var rowCS = getComputedStyle(row);
					var rowPaddingX = parseFloat(rowCS.paddingLeft) + parseFloat(rowCS.paddingRight);
					var rowDistanceToEdge =
						parseFloat(row.getBoundingClientRect().left) + parseFloat(rowCS.paddingLeft);
					contentSubmenus[i].style.setProperty(
						'--kb-nav-dropdown-width',
						row.offsetWidth - rowPaddingX + 'px'
					);
					contentSubmenus[i].style.setProperty(
						'--kb-nav-dropdown-show-left',
						-1 * Math.abs(parentMenuItem.getBoundingClientRect().left - rowDistanceToEdge).toString() + 'px'
					);
				} else {
					contentSubmenus[i].style.setProperty(
						'--kb-nav-dropdown-width',
						'var(--wp--style--global--content-size, 100%)'
					);
					contentSubmenus[i].style.setProperty(
						'--kb-nav-dropdown-show-left',
						'calc( (((100vw - var(--wp--style--global--content-size, 100%)) / 2) - ' +
							Math.abs(parentMenuItem.getBoundingClientRect().left).toString() +
							'px))'
					);
				}
				contentSubmenus[i].style.setProperty('--kb-nav-dropdown-hide-transform-x', '0');
				contentSubmenus[i].style.setProperty('--kb-nav-dropdown-show-transform-x', '0');
			}
		}
	};
	/**
	 * Initiate the script to handle content mega menus.
	 */
	const initContentSubMenuSize = function () {
		var contentMegaMenus = document.querySelectorAll(
			'.wp-block-kadence-navigation .kb-menu-mega-width-content > ul.sub-menu'
		);
		// No point if no content Mega Menus.
		if (!contentMegaMenus.length) {
			return;
		}
		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(() => {
				runSubMenuContentSize();
			}, 200);
		});
		runSubMenuContentSize();
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
		handleClickOutsideSubmenus();
	};

	const updateActiveAnchors = function () {
		const menuItems = document.querySelectorAll('.menu-item');
		menuItems.forEach(function (menuItem) {
			const menuItemLink = menuItem.querySelector('a');

			if (menuItemLink?.href && menuItemLink.href.includes('#')) {
				if (window.location.href == menuItemLink.href) {
					menuItem.classList.add('current-menu-item');
				} else {
					menuItem.classList.remove('current-menu-item');
				}
			}
		});
	};
	const initActiveAnchors = function () {
		if (window.location.hash != '') {
			updateActiveAnchors();
		}
		window.onhashchange = function () {
			updateActiveAnchors();
		};
	};

	// Initialize immediately for already loaded DOM
	initNavigation();
	initFullSubMenuSize();
	initContentSubMenuSize();
	initMobileToggleSub();
	initActiveAnchors();
})();
