(function () {
	'use strict';
	window.KBTabs = {
		setupTabs() {
			const ktTabWraps = document.querySelectorAll('.kt-tabs-wrap');

			ktTabWraps.forEach((thisElem) => {
				if (!thisElem.classList.contains('initialized')) {
					const ktTabListItemsBeforeCheck = thisElem.querySelectorAll(':scope > .kt-tabs-title-list li');

					// Before we initialize this tab, remove the tab if the content tab is not found.
					// This can happen due to conditional display.
					ktTabListItemsBeforeCheck.forEach((subElem) => {
						const listItemButton = subElem.querySelector('a');
						const tabId = listItemButton.getAttribute('data-tab');
						const contentTab = thisElem.querySelector(
							':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + tabId
						);

						if (!contentTab) {
							subElem.remove();
						}
					});

					const ktTabList = thisElem.querySelectorAll(':scope > .kt-tabs-title-list');
					const ktTabListItems = thisElem.querySelectorAll(':scope > .kt-tabs-title-list li');
					const ktTabButtons = thisElem.querySelectorAll('.kt-tabs-title-list li a');
					const ktTabContentAreas = thisElem.querySelectorAll(
						':scope > .kt-tabs-content-wrap > .kt-tab-inner-content'
					);
					const noAllowMultipleOpen = thisElem?.dataset?.noAllowMultipleOpen;

					ktTabList.forEach((subElem) => {
						subElem.setAttribute('role', 'tablist');
					});
					ktTabContentAreas.forEach((subElem) => {
						subElem.setAttribute('role', 'tabpanel');
						subElem.setAttribute('aria-hidden', 'true');
					});

					ktTabButtons.forEach((subElem) => {
						const parentListItem = subElem.parentElement;
						const parentId = parentListItem.getAttribute('id');
						const isActive = parentListItem.classList.contains('kt-tab-title-active');
						const isAccordion = parentListItem.classList.contains('kt-tabs-accordion-title');

						// Set attr on the related content tab
						const tabId = subElem.getAttribute('data-tab');
						const contentTab = thisElem.querySelector(
							':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + tabId
						);

						if (!isAccordion) {
							if (contentTab) {
								contentTab.setAttribute('aria-labelledby', parentId);
							}
							parentListItem.setAttribute('role', 'presentation');
							subElem.setAttribute('role', 'tab');
							subElem.setAttribute('aria-controls', parentId);
							subElem.setAttribute('tabindex', isActive ? '0' : '-1');
						} else {
							subElem.setAttribute('aria-selected', isActive ? true : false);
						}

						if (contentTab) {
							contentTab.setAttribute('aria-hidden', isActive ? 'false' : 'true');
						}

						if (isActive && contentTab) {
							contentTab.style.display = 'block';
						}
					});

					let hasActiveListItems = false;
					ktTabListItems.forEach((listItem) => {
						listItem.addEventListener('keydown', function (evt) {
							//const listItem = this.parentElement;
							switch (evt.which) {
								case 32: // Space bar
									evt.preventDefault();
									listItem.querySelector('a').click();
									break;
								case 37:
									if (listItem.previousElementSibling) {
										listItem.previousElementSibling.querySelector('a').click();
									} else {
										listItem.parentElement.querySelector('li:last-of-type > a').click();
									}
									break;
								case 39:
									if (listItem.nextElementSibling) {
										listItem.nextElementSibling.querySelector('a').click();
									} else {
										listItem.parentElement.querySelector('li:first-of-type > a').click();
									}
									break;
							}
						});

						// Keep track if there are any active list items.
						// The active one might be gone due to conditional display.
						if (listItem.classList.contains('kt-tab-title-active')) {
							hasActiveListItems = true;
						}
					});

					// If there are no active list items, set the first one active.
					if (!hasActiveListItems) {
						window.KBTabs.setActiveAccordion(undefined, ktTabButtons?.[0], noAllowMultipleOpen);
					}

					const resizeEvent = new Event('resize');
					window.dispatchEvent(resizeEvent);

					ktTabButtons.forEach((tabButtonElem) => {
						tabButtonElem.addEventListener('click', function (evt) {
							evt.preventDefault();
							const newActiveTabId = tabButtonElem.getAttribute('data-tab');
							const tabWrap = tabButtonElem.closest('.kt-tabs-wrap');
							window.KBTabs.setActiveTab(tabWrap, newActiveTabId);
						});
					});

					if (thisElem.classList.contains('kt-create-accordion')) {
						thisElem.querySelectorAll(':scope > .kt-tabs-title-list .kt-title-item').forEach((listItem) => {
							const tabId = listItem.querySelector('a').getAttribute('data-tab');

							const titleClasses = listItem.classList;
							const accordionTitleClasses = [
								'kt-tabs-accordion-title',
								'kt-tabs-accordion-title-' + tabId,
							];

							const closestTabWrap = listItem.closest('.kt-tabs-wrap');
							const ktContentWrap = closestTabWrap.querySelector(':scope > .kt-tabs-content-wrap');

							const newElem = window.document.createElement('div');
							newElem.className = [...titleClasses].concat(accordionTitleClasses).join(' ');
							newElem.innerHTML = listItem.innerHTML;

							ktContentWrap.insertBefore(
								newElem,
								ktContentWrap.querySelector(':scope > .kt-inner-tab-' + tabId)
							);

							ktContentWrap
								.querySelector(':scope > .kt-tabs-accordion-title-' + tabId + '  a')
								.removeAttribute('role');
							ktContentWrap
								.querySelector(':scope > .kt-tabs-accordion-title-' + tabId + '  a')
								.removeAttribute('tabindex');
						});
					}

					const ktAccordionAnchor = thisElem.querySelectorAll('.kt-tabs-accordion-title a');
					ktAccordionAnchor.forEach((accordionTitleElem) => {
						accordionTitleElem.addEventListener('click', function (evt) {
							window.KBTabs.setActiveAccordion(evt, accordionTitleElem, noAllowMultipleOpen);
						});
					});

					thisElem.classList.add('initialized');
				}
			});
			window.KBTabs.setActiveWithHash();
		},
		setActiveWithHash() {
			if (window.location.hash == '') {
				return;
			}

			const tabTitleItems = window.document.querySelector(window.location.hash + '.kt-title-item');
			if (!tabTitleItems) {
				return;
			}

			const currentTab = window.document.querySelector('#' + window.location.hash.substring(1));

			// Trigger tab change.
			const tabNumber = currentTab.querySelector('a').getAttribute('data-tab');
			const tabWrap = currentTab.closest('.kt-tabs-wrap');
			window.KBTabs.setActiveTab(tabWrap, tabNumber);

			//If collapsed accordions, go to that tab title
			//If using vertical tabs go to the top of the content area
			if (
				(window.KBTabs.isMobileSize() && tabWrap.classList.contains('kt-tabs-mobile-layout-accordion')) ||
				(window.KBTabs.isTabletSize() && tabWrap.classList.contains('kt-tabs-tablet-layout-accordion'))
			) {
				tabWrap
					.querySelector(
						'.kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tabs-accordion-title-' + tabNumber
					)
					.scrollIntoView({ behavior: 'smooth' });
			} else if (tabWrap.classList.contains('kt-tabs-layout-vtabs')) {
				tabWrap.querySelector('.kt-tabs-content-wrap').scrollIntoView({ behavior: 'smooth' });
			}
		},
		isMobileSize() {
			return window.innerWidth <= 767;
		},
		isTabletSize() {
			return window.innerWidth > 767 && window.innerWidth <= 1024;
		},
		setActiveAccordion(evt, thisElem, noAllowMultipleOpen) {
			evt?.preventDefault();

			const clickedTabId = thisElem.getAttribute('data-tab');
			const accTitle = thisElem.parentElement;
			const tabWrap = thisElem.closest('.kt-tabs-wrap');
			const tabContent = tabWrap.querySelector(':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + clickedTabId);

			if (accTitle.classList.contains('kt-tab-title-active')) {
				tabWrap.classList.remove('kt-active-tab-' + clickedTabId);
				accTitle.classList.replace('kt-tab-title-active', 'kt-tab-title-inactive');
				tabContent.style.display = 'none';
				tabContent.setAttribute('tabindex', '1');
				thisElem.setAttribute('aria-selected', 'false');
				window.KBTabs.setAriaAttributesForTabs(tabWrap, clickedTabId, false, noAllowMultipleOpen);
			} else {
				tabWrap.classList.add('kt-active-tab-' + clickedTabId);
				accTitle.classList.replace('kt-tab-title-inactive', 'kt-tab-title-active');
				tabContent.style.display = 'block';
				tabContent.setAttribute('tabindex', '0');
				thisElem.setAttribute('aria-selected', 'true');
				window.KBTabs.setAriaAttributesForTabs(tabWrap, clickedTabId, true, noAllowMultipleOpen);
			}

			//if the appropriate setting is active, close all other accordions in this accordion
			if (noAllowMultipleOpen) {
				const currentAccordionAnchors = tabWrap.querySelectorAll('.kt-tabs-accordion-title a');
				currentAccordionAnchors.forEach((otherElem) => {
					const otherTabId = otherElem.getAttribute('data-tab');
					const otherAccTitle = otherElem.parentElement;
					const otherTabContent = tabWrap.querySelector(
						':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + otherTabId
					);

					if (otherTabId != clickedTabId) {
						otherAccTitle.classList.replace('kt-tab-title-active', 'kt-tab-title-inactive');
						otherAccTitle.setAttribute('tabindex', '-1');
						otherElem.setAttribute('aria-selected', 'false');
						otherTabContent.style.display = 'none';
					}
				});
			}

			const resizeEvent = new Event('resize');
			window.dispatchEvent(resizeEvent);
			const tabEvent = new Event('kadence-tabs-open');
			window.dispatchEvent(tabEvent);
		},
		setActiveTab(wrapper, tabNumber, moveFocus = true) {
			const prevActiveAnchor = wrapper.querySelector(':scope > .kt-tabs-title-list > li.kt-tab-title-active a');
			const prevActiveListItem = wrapper.querySelector(':scope > .kt-tabs-title-list > li.kt-tab-title-active');

			if (prevActiveListItem && prevActiveAnchor) {
				prevActiveListItem.classList.replace('kt-tab-title-active', 'kt-tab-title-inactive');
				prevActiveAnchor.setAttribute('tabindex', '-1');
				prevActiveAnchor.setAttribute('aria-selected', 'false');
			}

			wrapper.className = wrapper.className.replace(/\bkt-active-tab-\S+/g, 'kt-active-tab-' + tabNumber);
			const newActiveAnchor = wrapper.querySelector(
				':scope > .kt-tabs-title-list > li.kt-title-item-' + tabNumber + ' a'
			);
			const newActiveListItem = wrapper.querySelector(
				':scope > .kt-tabs-title-list > li.kt-title-item-' + tabNumber
			);
			newActiveListItem.classList.replace('kt-tab-title-inactive', 'kt-tab-title-active');
			newActiveAnchor.setAttribute('tabindex', '0');
			newActiveAnchor.setAttribute('aria-selected', 'true');

			// Hide all tab panels.
			wrapper.querySelectorAll(':scope > .kt-tabs-content-wrap > .kt-tab-inner-content').forEach((subElem) => {
				subElem.style.display = 'none';
			});

			// Show selected tab panel.
			const newTabContent = wrapper.querySelector(':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + tabNumber);
			newTabContent.style.display = 'block';

			if (moveFocus) {
				newActiveAnchor.focus();
			}

			window.KBTabs.setAriaAttributesForTabs(wrapper, tabNumber, true, true);

			const resizeEvent = new Event('resize');
			window.dispatchEvent(resizeEvent);
			const tabEvent = new Event('kadence-tabs-open');
			window.dispatchEvent(tabEvent);
		},
		setAriaAttributesForTabs(wrapper, tabNumber, active = true, noAllowMultipleOpen = false) {
			if (noAllowMultipleOpen) {
				wrapper
					.querySelectorAll(
						':scope > .kt-tabs-content-wrap > .kt-tab-inner-content:not(.kt-inner-tab-' + tabNumber + ')'
					)
					.forEach((subElem) => subElem.setAttribute('aria-hidden', 'true'));
			}

			if (active) {
				wrapper
					.querySelector(':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + tabNumber)
					.setAttribute('aria-hidden', 'false');
			} else {
				wrapper
					.querySelector(':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + tabNumber)
					.setAttribute('aria-hidden', 'true');
			}
		},

		init() {
			window.KBTabs.setupTabs();
			window.addEventListener('hashchange', window.KBTabs.setActiveWithHash, false);
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', window.KBTabs.init);
	} else {
		// The DOM has already been loaded.
		window.KBTabs.init();
	}

	document.addEventListener('kb-query-loaded', window.KBTabs.init);
})();
