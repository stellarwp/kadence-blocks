/* global kadenceNavigationConfig */
/**
 * File kb-navigation-block.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */

(function () {
	'use strict';
	window.kadenceNavigation = {
		/**
		 * Function to init different style of focused element on keyboard users and mouse users.
		 */
		initOutlineToggle() {
			document.body.addEventListener('keydown', function () {
				document.body.classList.remove('hide-focus-outline');
			});

			document.body.addEventListener('mousedown', function () {
				document.body.classList.add('hide-focus-outline');
			});
		},

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
		},

		/**
		 * traverses the DOM up to find elements matching the query
		 *
		 * @param {HTMLElement} target
		 * @param {string} query
		 * @return {NodeList} parents matching query
		 */
		findParents(target, query) {
			var parents = [];

			// recursively go up the DOM adding matches to the parents array
			function traverse(item) {
				var parent = item.parentNode;
				if (parent instanceof HTMLElement) {
					if (parent.matches(query)) {
						parents.push(parent);
					}
					traverse(parent);
				}
			}

			traverse(target);

			return parents;
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
		 * Initiate the script to process all
		 * navigation menus with submenu toggle enabled.
		 */
		initNavToggleSubmenus() {
			var navTOGGLE = document.querySelectorAll('.wp-block-kadence-navigation .kb-nav-toggle-sub');

			// No point if no navs.
			if (!navTOGGLE.length) {
				return;
			}

			for (let i = 0; i < navTOGGLE.length; i++) {
				window.kadenceNavigation.initEachNavToggleSubmenu(navTOGGLE[i]);
				window.kadenceNavigation.initEachNavToggleSubmenuInside(navTOGGLE[i]);
			}
		},
		initEachNavToggleSubmenu(nav) {
			// Get the submenus.
			var SUBMENUS = nav.querySelectorAll('.menu .sub-menu');

			// No point if no submenus.
			if (!SUBMENUS.length) {
				return;
			}

			for (let i = 0; i < SUBMENUS.length; i++) {
				var parentMenuItem = SUBMENUS[i].parentNode;
				const dropdown = parentMenuItem.querySelector('.title-dropdown-navigation-toggle');
				// If dropdown.
				if (dropdown) {
					// var dropdown_label = parentMenuItem
					// 	.querySelector('.kb-nav-dropdown-title-wrap')
					// 	.firstChild.textContent.trim();
					// var dropdownBtn = document.createElement('BUTTON'); // Create a <button> element
					// dropdownBtn.setAttribute(
					// 	'aria-label',
					// 	dropdown_label
					// 		? kadenceNavigationConfig.screenReader.expandOf + ' ' + dropdown_label
					// 		: kadenceNavigationConfig.screenReader.expand
					// );
					// dropdownBtn.classList.add('dropdown-navigation-toggle');
					// dropdownBtn.classList.add('vertical-sub-toggle');

					// const downArrowIcon =
					// 	'<span class="screen-reader-text">Expand child menu</span><svg class="kadence-svg-icon kadence-arrow-down-svg" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path></svg>';
					// dropdownBtn.innerHTML = downArrowIcon;

					// var dropdownBtnSpecial = document.createElement('BUTTON'); // Create a <button> element
					// dropdownBtnSpecial.setAttribute(
					// 	'aria-label',
					// 	dropdown_label
					// 		? kadenceNavigationConfig.screenReader.expandOf + ' ' + dropdown_label
					// 		: kadenceNavigationConfig.screenReader.expand
					// );
					// dropdownBtnSpecial.classList.add('dropdown-nav-special-toggle');

					const linkDropWrap = parentMenuItem.querySelector('.kb-link-wrap');
					linkDropWrap.appendChild(dropdownBtn);
					linkDropWrap.appendChild(dropdownBtnSpecial);
					// Toggle the submenu when we click the dropdown button.
					dropdownBtnSpecial.addEventListener('click', function (e) {
						e.preventDefault();
						window.kadenceNavigation.toggleSubMenu(e.target.closest('li'));
					});

					// Clean up the toggle if a mouse takes over from keyboard.
					// But only if the nav is horizontal
					parentMenuItem.addEventListener('mouseleave', function (e) {
						const navBlock = nav.closest('.wp-block-kadence-navigation');
						if (navBlock.classList.contains('is-horizontal')) {
							window.kadenceNavigation.toggleSubMenu(e.target, false);
						}
					});

					// When we focus on a menu link, make sure all siblings are closed.
					parentMenuItem.querySelector('a').addEventListener('focus', function (e) {
						var parentMenuItemsToggled =
							e.target.parentNode.parentNode.querySelectorAll('li.menu-item--toggled-on');
						for (let j = 0; j < parentMenuItemsToggled.length; j++) {
							window.kadenceNavigation.toggleSubMenu(parentMenuItemsToggled[j], false);
						}
					});

					// Handle keyboard accessibility for traversing menu.
					SUBMENUS[i].addEventListener('keydown', function (e) {
						// These specific selectors help us only select items that are visible.
						var focusSelector =
							'ul.toggle-show > li > a, ul.toggle-show > li > .dropdown-navigation-toggle';

						// 9 is tab KeyMap
						if (9 === e.keyCode) {
							if (e.shiftKey) {
								// Means we're tabbing out of the beginning of the submenu.
								if (
									window.kadenceNavigation.isfirstFocusableElement(
										SUBMENUS[i],
										document.activeElement,
										focusSelector
									)
								) {
									window.kadenceNavigation.toggleSubMenu(SUBMENUS[i].parentNode, false);
								}
								// Means we're tabbing out of the end of the submenu.
							} else if (
								window.kadenceNavigation.islastFocusableElement(
									SUBMENUS[i],
									document.activeElement,
									focusSelector
								)
							) {
								window.kadenceNavigation.toggleSubMenu(SUBMENUS[i].parentNode, false);
							}
						}
						// 27 is keymap for esc key.
						if (e.keyCode === 27) {
							window.kadenceNavigation.toggleSubMenu(SUBMENUS[i].parentNode, false);
						}
					});

					SUBMENUS[i].parentNode.classList.add('menu-item--has-toggle');
				}
			}
		},
		initEachNavToggleSubmenuInside(nav) {
			// Get the submenus.
			var SUBMENUPARENTS = nav.querySelectorAll('.menu-item-has-children');

			// No point if no submenus.
			if (!SUBMENUPARENTS.length) {
				return;
			}

			for (let i = 0; i < SUBMENUPARENTS.length; i++) {
				// Handle verifying if navigation will go offscreen
				SUBMENUPARENTS[i].addEventListener('mouseenter', function (e) {
					if (SUBMENUPARENTS[i].querySelector('ul.sub-menu')) {
						var elm = SUBMENUPARENTS[i].querySelector('ul.sub-menu');
						var off = window.kadenceNavigation.getOffset(elm);
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
		},
		/**
		 * Toggle submenus open and closed, and tell screen readers what's going on.
		 * @param {Object} parentMenuItem Parent menu element.
		 * @param {boolean} forceToggle Force the menu toggle.
		 * @return {void}
		 */
		toggleSubMenu(parentMenuItem, forceToggle) {
			var toggleButton = parentMenuItem.querySelector('.dropdown-navigation-toggle'),
				subMenu = parentMenuItem.querySelector('ul');
			let parentMenuItemToggled = parentMenuItem.classList.contains('menu-item--toggled-on');
			var dropdown_label = parentMenuItem.querySelector('.link-drop-title-wrap').firstChild.textContent.trim();
			// Will be true if we want to force the toggle on, false if force toggle close.
			if (undefined !== forceToggle && 'boolean' === typeof forceToggle) {
				parentMenuItemToggled = !forceToggle;
			}
			// Toggle aria-expanded status.
			toggleButton.setAttribute('aria-expanded', (!parentMenuItemToggled).toString());

			/*
			 * Steps to handle during toggle:
			 * - Let the parent menu item know we're toggled on/off.
			 * - Toggle the ARIA label to let screen readers know will expand or collapse.
			 */
			if (parentMenuItemToggled) {
				// Toggle "off" the submenu.
				parentMenuItem.classList.remove('menu-item--toggled-on');
				subMenu.classList.remove('toggle-show');
				toggleButton.setAttribute(
					'aria-label',
					dropdown_label
						? kadenceNavigationConfig.screenReader.expandOf + ' ' + dropdown_label
						: kadenceNavigationConfig.screenReader.expand
				);

				// Make sure all children are closed.
				var subMenuItemsToggled = parentMenuItem.querySelectorAll('.menu-item--toggled-on');
				for (let i = 0; i < subMenuItemsToggled.length; i++) {
					window.kadenceNavigation.toggleSubMenu(subMenuItemsToggled[i], false);
				}
			} else {
				// Make sure siblings are closed.
				var parentMenuItemsToggled = parentMenuItem.parentNode.querySelectorAll('li.menu-item--toggled-on');
				for (let i = 0; i < parentMenuItemsToggled.length; i++) {
					window.kadenceNavigation.toggleSubMenu(parentMenuItemsToggled[i], false);
				}

				// Toggle "on" the submenu.
				parentMenuItem.classList.add('menu-item--toggled-on');
				subMenu.classList.add('toggle-show');
				toggleButton.setAttribute(
					'aria-label',
					dropdown_label
						? kadenceNavigationConfig.screenReader.collapseOf + ' ' + dropdown_label
						: kadenceNavigationConfig.screenReader.collapse
				);
			}
		},
		/**
		 * Returns true if element is the
		 * first focusable element in the container.
		 * @param {Object} container
		 * @param {Object} element
		 * @param {string} focusSelector
		 * @return {boolean} whether or not the element is the first focusable element in the container
		 */
		isfirstFocusableElement(container, element, focusSelector) {
			var focusableElements = container.querySelectorAll(focusSelector);
			if (0 < focusableElements.length) {
				return element === focusableElements[0];
			}
			return false;
		},

		/**
		 * Returns true if element is the
		 * last focusable element in the container.
		 * @param {Object} container
		 * @param {Object} element
		 * @param {string} focusSelector
		 * @return {boolean} whether or not the element is the last focusable element in the container
		 */
		islastFocusableElement(container, element, focusSelector) {
			var focusableElements = container.querySelectorAll(focusSelector);
			//console.log( focusableElements );
			if (0 < focusableElements.length) {
				return element === focusableElements[focusableElements.length - 1];
			}
			return false;
		},
		/**
		 * Initiate the script to process all drawer toggles.
		 */
		toggleDrawer(element, changeFocus) {
			changeFocus = typeof changeFocus !== 'undefined' ? changeFocus : true;
			var toggle = element;
			var target = toggle.closest('li');
			if (!target) {
				return;
			}
			var scrollBar = window.innerWidth - document.documentElement.clientWidth;
			//pretty sure this duration is only for animating the off canvas area, not sub menus. Disabling for now.
			var duration = 0;
			window.kadenceNavigation.toggleAttribute(toggle, 'aria-expanded', 'true', 'false');
			if (target.classList.contains('menu-item--toggled-on')) {
				if (toggle.dataset.toggleBodyClass) {
					document.body.classList.remove(toggle.dataset.toggleBodyClass);
				}
				// Hide the drawer.
				target.classList.remove('active');
				target.classList.remove('pop-animated');
				document.body.classList.remove('kadence-scrollbar-fixer');
				setTimeout(function () {
					target.classList.remove('menu-item--toggled-on');
					var drawerEvent = new Event('kadence-drawer-closed');
					window.dispatchEvent(drawerEvent);
					if (toggle.dataset.setFocus && changeFocus) {
						var focusElement = document.querySelector(toggle.dataset.setFocus);
						if (focusElement) {
							focusElement.focus();
							if (focusElement.hasAttribute('aria-expanded')) {
								window.kadenceNavigation.toggleAttribute(
									focusElement,
									'aria-expanded',
									'true',
									'false'
								);
							}
						}
					}
				}, duration);
			} else {
				// Show the drawer.
				target.classList.add('menu-item--toggled-on');
				// Toggle body class
				if (toggle.dataset.toggleBodyClass) {
					document.body.classList.toggle(toggle.dataset.toggleBodyClass);
					if (toggle.dataset.toggleBodyClass.includes('showing-popup-drawer-')) {
						document.body.style.setProperty('--scrollbar-offset', scrollBar + 'px');
						document.body.classList.add('kadence-scrollbar-fixer');
					}
				}
				setTimeout(function () {
					target.classList.add('active');
					var drawerEvent = new Event('kadence-drawer-opened');
					window.dispatchEvent(drawerEvent);
					if (toggle.dataset.setFocus && changeFocus) {
						var focusElement = document.querySelector(toggle.dataset.setFocus);

						if (focusElement) {
							if (focusElement.hasAttribute('aria-expanded')) {
								window.kadenceNavigation.toggleAttribute(
									focusElement,
									'aria-expanded',
									'true',
									'false'
								);
							}
							var searchTerm = focusElement.value;
							focusElement.value = '';
							focusElement.focus();
							focusElement.value = searchTerm;
						}
					}
				}, 10);
				setTimeout(function () {
					target.classList.add('pop-animated');
				}, duration);
				// Keep Focus in Modal
				if (target.classList.contains('popup-drawer')) {
					// add all the elements inside modal which you want to make focusable
					var focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
					var focusableContent = target.querySelectorAll(focusableElements);
					var firstFocusableElement = focusableContent[0]; // get first element to be focused inside modal
					var lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

					document.addEventListener('keydown', function (e) {
						const isTabPressed = e.key === 'Tab' || e.keyCode === 9;

						if (!isTabPressed) {
							return;
						}

						if (e.shiftKey) {
							// if shift key pressed for shift + tab combination
							if (document.activeElement === firstFocusableElement) {
								lastFocusableElement.focus(); // add focus for the last focusable element
								e.preventDefault();
							}
						} else if (document.activeElement === lastFocusableElement) {
							// if tab key is pressed
							// if focused has reached to last focusable element then focus first focusable element after pressing tab
							firstFocusableElement.focus(); // add focus for the first focusable element
							e.preventDefault();
						}
					});
				}
			}
		},
		/**
		 * Initiate the script to process all
		 * navigation menus with small toggle enabled.
		 */
		initToggleDrawer() {
			var drawerTOGGLE = document.querySelectorAll('.drawer-toggle');

			// No point if no drawers.
			if (!drawerTOGGLE.length) {
				return;
			}
			for (let i = 0; i < drawerTOGGLE.length; i++) {
				drawerTOGGLE[i].addEventListener('click', function (event) {
					event.preventDefault();
					window.kadenceNavigation.toggleDrawer(drawerTOGGLE[i]);
				});
			}
			// Close Drawer if esc is pressed.
			document.addEventListener('keyup', function (event) {
				// 27 is keymap for esc key.
				if (event.keyCode === 27) {
					if (document.querySelectorAll('.popup-drawer.menu-item--toggled-on.active')) {
						event.preventDefault();
						document
							.querySelectorAll('.popup-drawer.menu-item--toggled-on.active')
							.forEach(function (element) {
								window.kadenceNavigation.toggleDrawer(
									document.querySelector(
										'*[data-toggle-target="' + element.dataset.drawerTargetString + '"]'
									)
								);
							});
					}
				}
			});
			// Close modal on outside click.
			document.addEventListener('click', function (event) {
				var target = event.target;
				var modal = document.querySelector('.menu-item--toggled-on.active .drawer-overlay');
				if (target === modal) {
					window.kadenceNavigation.toggleDrawer(
						document.querySelector('*[data-toggle-target="' + modal.dataset.drawerTargetString + '"]')
					);
				}
				var searchModal = document.querySelector('#search-drawer.menu-item--toggled-on.active .drawer-content');
				var modal = document.querySelector('#search-drawer.menu-item--toggled-on.active .drawer-overlay');
				if (target === searchModal) {
					window.kadenceNavigation.toggleDrawer(
						document.querySelector('*[data-toggle-target="' + modal.dataset.drawerTargetString + '"]')
					);
				}
			});
		},
		/**
		 * Initiate the script to process all
		 * navigation menus with vertical style drawers.
		 */
		initMobileToggleSub() {
			// var modalMenus = document.querySelectorAll(' .wp-block-kadence-navigation .has-collapse-sub-nav');

			// modalMenus.forEach(function (modalMenu) {
			// 	var activeMenuItem = modalMenu.querySelector('.current-menu-item');
			// 	if (activeMenuItem) {
			// 		window.kadenceNavigation.findParents(activeMenuItem, 'li').forEach(function (element) {
			// 			var subMenuToggle = element.querySelector('.vertical-sub-toggle');
			// 			if (subMenuToggle) {
			// 				window.kadenceNavigation.toggleDrawer(subMenuToggle, true);
			// 			}
			// 		});
			// 	}
			// });
			var drawerSubTOGGLE = document.querySelectorAll('.wp-block-kadence-navigation .vertical-sub-toggle');
			// No point if no drawers.
			if (!drawerSubTOGGLE.length) {
				return;
			}

			for (let i = 0; i < drawerSubTOGGLE.length; i++) {
				drawerSubTOGGLE[i].addEventListener('click', function (event) {
					event.preventDefault();
					window.kadenceNavigation.toggleDrawer(drawerSubTOGGLE[i]);
				});
			}
		},
		/**
		 * Initiate the script to process all
		 * navigation menus check to close mobile.
		 */
		initMobileToggleAnchor() {
			var mobileModal = document.getElementById('mobile-drawer');
			// No point if no drawers.
			if (!mobileModal) {
				return;
			}
			var menuLink = mobileModal.querySelectorAll('a:not(.kt-tab-title)');
			// No point if no links.
			if (!menuLink.length) {
				return;
			}
			for (let i = 0; i < menuLink.length; i++) {
				menuLink[i].addEventListener('click', function (event) {
					window.kadenceNavigation.toggleDrawer(mobileModal.querySelector('.menu-toggle-close'), false);
				});
			}
		},
		/**
		 * Initiate setting the top padding for hero title when page is transparent.
		 */
		initTransHeaderPadding() {
			if (document.body.classList.contains('no-header')) {
				return;
			}
			if (
				!document.body.classList.contains('transparent-header') ||
				!document.body.classList.contains('mobile-transparent-header')
			) {
				return;
			}
			var titleHero = document.querySelector('.entry-hero-container-inner'),
				header = document.querySelector('#masthead');
			var updateHeroPadding = function (e) {
				header;
				if (kadenceNavigationConfig.breakPoints.desktop <= window.innerWidth) {
					if (!document.body.classList.contains('transparent-header')) {
						titleHero.style.paddingTop = 0;
					} else {
						titleHero.style.paddingTop = header.offsetHeight + 'px';
					}
				} else if (!document.body.classList.contains('mobile-transparent-header')) {
					titleHero.style.paddingTop = 0;
				} else {
					titleHero.style.paddingTop = header.offsetHeight + 'px';
				}
			};
			if (titleHero) {
				window.addEventListener('resize', updateHeroPadding, false);
				window.addEventListener('scroll', updateHeroPadding, false);
				window.addEventListener('load', updateHeroPadding, false);
				updateHeroPadding();
			}
		},
		getTopOffset(event = 'scroll') {
			if (event === 'load') {
				var desktopSticky = document.querySelector('#main-header .kadence-sticky-header'),
					mobileSticky = document.querySelector('#mobile-header .kadence-sticky-header');
			} else {
				var desktopSticky = document.querySelector(
						'#main-header .kadence-sticky-header:not([data-reveal-scroll-up="true"])'
					),
					mobileSticky = document.querySelector(
						'#mobile-header .kadence-sticky-header:not([data-reveal-scroll-up="true"])'
					);
			}
			var activeScrollOffsetTop = 0,
				activeScrollAdminOffsetTop = 0;
			if (kadenceNavigationConfig.breakPoints.desktop <= window.innerWidth) {
				if (desktopSticky) {
					var shrink = desktopSticky.getAttribute('data-shrink');
					if ('true' === shrink && !desktopSticky.classList.contains('site-header-inner-wrap')) {
						activeScrollOffsetTop = Math.floor(desktopSticky.getAttribute('data-shrink-height'));
					} else {
						activeScrollOffsetTop = Math.floor(desktopSticky.offsetHeight);
					}
				} else {
					activeScrollOffsetTop = 0;
				}
				if (document.body.classList.contains('admin-bar')) {
					activeScrollAdminOffsetTop = 32;
				}
			} else {
				if (mobileSticky) {
					var shrink = mobileSticky.getAttribute('data-shrink');
					if ('true' === shrink) {
						activeScrollOffsetTop = Math.floor(mobileSticky.getAttribute('data-shrink-height'));
					} else {
						activeScrollOffsetTop = Math.floor(mobileSticky.offsetHeight);
					}
				} else {
					activeScrollOffsetTop = 0;
				}
				if (document.body.classList.contains('admin-bar')) {
					activeScrollAdminOffsetTop = 46;
				}
			}
			return Math.floor(
				activeScrollOffsetTop + activeScrollAdminOffsetTop + Math.floor(kadenceNavigationConfig.scrollOffset)
			);
		},
		scrollToElement(element, history, event = 'scroll') {
			history = typeof history !== 'undefined' ? history : true;
			var offsetSticky = window.kadenceNavigation.getTopOffset(event);
			var originalTop = Math.floor(element.getBoundingClientRect().top) - offsetSticky;
			window.scrollBy({ top: originalTop, left: 0, behavior: 'smooth' });
			element.tabIndex = '-1';
			element.focus({
				preventScroll: true,
			});
			if (element.classList.contains('kt-title-item')) {
				element.firstElementChild.click();
			}
			if (history) {
				window.history.pushState('', '', '#' + element.id);
			}
		},
		anchorScrollToCheck(e, respond) {
			respond = typeof respond !== 'undefined' ? respond : null;
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
			if (
				targetLink.parentNode &&
				targetLink.parentNode.hasAttribute('role') &&
				targetLink.parentNode.getAttribute('role') === 'tab'
			) {
				return;
			}
			var targetID;
			if (respond) {
				targetID = respond.getAttribute('href').substring(respond.getAttribute('href').indexOf('#'));
			} else {
				targetID = targetLink.getAttribute('href').substring(targetLink.getAttribute('href').indexOf('#'));
			}
			var targetAnchor = document.getElementById(targetID.replace('#', ''));
			if (!targetAnchor) {
				//window.location.href = targetLink.getAttribute('href');
				return;
			}
			e.preventDefault();
			window.kadenceNavigation.scrollToElement(targetAnchor);
		},
		/**
		 * Initiate the sticky sidebar last width.
		 */
		initStickySidebarWidget() {
			if (!document.body.classList.contains('has-sticky-sidebar-widget')) {
				return;
			}
			var offsetSticky = window.kadenceNavigation.getTopOffset(),
				widget = document.querySelector('#secondary .sidebar-inner-wrap .widget:last-child');
			if (widget) {
				widget.style.top = Math.floor(offsetSticky + 20) + 'px';
				widget.style.maxHeight = 'calc( 100vh - ' + Math.floor(offsetSticky + 20) + 'px )';
			}
		},
		/**
		 * Initiate the sticky sidebar.
		 */
		initStickySidebar() {
			if (!document.body.classList.contains('has-sticky-sidebar')) {
				return;
			}
			var offsetSticky = window.kadenceNavigation.getTopOffset(),
				sidebar = document.querySelector('#secondary .sidebar-inner-wrap');
			if (sidebar) {
				sidebar.style.top = Math.floor(offsetSticky + 20) + 'px';
				sidebar.style.maxHeight = 'calc( 100vh - ' + Math.floor(offsetSticky + 20) + 'px )';
			}
		},
		/**
		 * Initiate the scroll to top.
		 */
		initAnchorScrollTo() {
			if (document.body.classList.contains('no-anchor-scroll')) {
				return;
			}
			window.onhashchange = function () {
				if (window.location.hash === '') {
					window.scrollTo({ top: 0, behavior: 'smooth' });
					document.activeElement.blur();
				}
			};
			if (window.location.hash != '') {
				var id = location.hash.substring(1),
					element;

				if (!/^[A-z0-9_-]+$/.test(id)) {
					return;
				}
				element = document.getElementById(id);
				if (element) {
					window.setTimeout(function () {
						window.kadenceNavigation.scrollToElement(element, false, 'load');
					}, 100);
				}
			}
			var foundLinks = document.querySelectorAll(
				'a[href*=\\#]:not([href=\\#]):not(.scroll-ignore):not([data-tab]):not([data-toggle])'
			);
			if (!foundLinks.length) {
				return;
			}
			foundLinks.forEach(function (element) {
				try {
					var targetURL = new URL(element.href);
					if (targetURL.pathname === window.location.pathname) {
						element.addEventListener('click', function (e) {
							window.kadenceNavigation.anchorScrollToCheck(e);
						});
					}
				} catch (error) {
					console.log('ClassList: ' + element.classList, 'Invalid URL');
				}
			});
		},
		/**
		 * Initiate the scroll to top.
		 */
		initScrollToTop() {
			var scrollBtn = document.getElementById('kt-scroll-up');
			if (scrollBtn) {
				var checkScrollVisiblity = function () {
					if (window.scrollY > 100) {
						scrollBtn.classList.add('scroll-visible');
					} else {
						scrollBtn.classList.remove('scroll-visible');
					}
				};
				window.addEventListener('scroll', checkScrollVisiblity);
				checkScrollVisiblity();
				// Toggle the Scroll to top on click.
				scrollBtn.addEventListener('click', function (e) {
					e.preventDefault();
					//window.scrollBy( { top: 0, left: 0, behavior: 'smooth' } );
					window.scrollTo({ top: 0, behavior: 'smooth' });
					document.activeElement.blur();
				});
			}
			var scrollBtnReader = document.getElementById('kt-scroll-up-reader');
			if (scrollBtnReader) {
				scrollBtnReader.addEventListener('click', function (e) {
					e.preventDefault();
					//window.scrollBy( { top: 0, left: 0, behavior: 'smooth' } );
					window.scrollTo({ top: 0, behavior: 'smooth' });
					document.querySelector('.skip-link').focus();
				});
			}
		},
		/**
		 * Initiate the orientation tracker.
		 */
		initTrackOrientation() {
			window.onresize = window.kadenceNavigation.trackOrientation;
			window.kadenceNavigation.trackOrientation();
		},
		/**
		 * Determine what orientation the nav is at the currrent screen size.
		 */
		trackOrientation() {
			const navs = document.querySelectorAll('.wp-block-kadence-navigation');

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
		},

		/**
		 * Find the cart and open it.
		 */
		runSubMenuContentSize() {
			var contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation .kadence-menu-mega-width-content > ul.sub-menu'
			);
			for (let i = 0; i < contentSubmenus.length; i++) {
				var parentMenuItem = contentSubmenus[i].parentNode;
				var row = contentSubmenus[i].closest('.wp-block-kadence-navigation');
				contentSubmenus[i].style.left = '';
				contentSubmenus[i].style.width = row.offsetWidth + 'px';
				contentSubmenus[i].style.left =
					-1 *
						Math.abs(
							parentMenuItem.getBoundingClientRect().left - row.getBoundingClientRect().left
						).toString() +
					'px';
			}
		},
		/**
		 * Initiate the script to toggle cart when product is added.
		 */
		initContentSubMenuSize() {
			var contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation .kadence-menu-mega-width-content > ul.sub-menu'
			);
			// No point if no submenus.
			if (!contentSubmenus.length) {
				return;
			}
			var timeout;
			window.addEventListener(
				'resize',
				function () {
					clearTimeout(timeout);
					timeout = setTimeout(window.kadenceNavigation.runSubMenuContentSize, 500);
				},
				false
			);
			window.addEventListener('load', window.kadenceNavigation.runSubMenuContentSize);
			window.kadenceNavigation.runSubMenuContentSize();
		},
		/**
		 * Setup the Fullwith Menu.
		 */
		runSubMenuFullSize() {
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
		},
		/**
		 * Initiate the script to toggle cart when product is added.
		 */
		initFullSubMenuSize() {
			var contentSubmenus = document.querySelectorAll(
				'.wp-block-kadence-navigation .kadence-menu-mega-width-full > ul.sub-menu'
			);
			// No point if no submenus.
			if (!contentSubmenus.length) {
				return;
			}
			var timeout;
			window.addEventListener(
				'resize',
				function () {
					clearTimeout(timeout);
					timeout = setTimeout(window.kadenceNavigation.runSubMenuFullSize, 500);
				},
				false
			);
			window.kadenceNavigation.runSubMenuFullSize();
		},
		// Initiate the menus when the DOM loads.
		init() {
			//theme nav
			window.kadenceNavigation.initNavToggleSubmenus();
			// window.kadenceNavigation.initToggleDrawer();
			// window.kadenceNavigation.initMobileToggleAnchor();
			window.kadenceNavigation.initMobileToggleSub();
			// window.kadenceNavigation.initOutlineToggle();
			// window.kadenceNavigation.initStickySidebar();
			// window.kadenceNavigation.initStickySidebarWidget();
			// window.kadenceNavigation.initTransHeaderPadding();
			// window.kadenceNavigation.initAnchorScrollTo();
			// window.kadenceNavigation.initScrollToTop();
			window.kadenceNavigation.initTrackOrientation();

			//pro mega menu
			//window.kadenceNavigation.initContentSubMenuSize();
			window.kadenceNavigation.initFullSubMenuSize();
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', window.kadenceNavigation.init);
	} else {
		// The DOM has already been loaded.
		window.kadenceNavigation.init();
	}
})();
