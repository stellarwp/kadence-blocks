(function() {
	'use strict';
	window.KBTabs = {
		setupTabs: function() {
			var ktTabWraps = document.querySelectorAll('.kt-tabs-wrap');
			ktTabWraps.forEach((thisElem) => {
				thisElem.querySelectorAll(':scope > .kt-tabs-content-wrap > .kt-tab-inner-content').forEach((subElem) => {
					subElem.setAttribute('role', 'tabpanel');
					subElem.setAttribute('aria-hidden', 'true');
				});

				thisElem.querySelectorAll(':scope > .kt-tabs-title-list li a').forEach((subElem) => {
					var parentId = subElem.parentElement.getAttribute("id");
					var isActive = subElem.parentElement.classList.contains('kt-tab-title-active');

					subElem.setAttribute('role', 'tab');
					subElem.setAttribute('aria-controls', parentId);
					subElem.setAttribute('aria-selected', isActive ? 'true' : 'false');
					subElem.setAttribute('tabindex', isActive ? '0' : '-1');

					// Set attr on the related content tab
					var tabId = subElem.getAttribute('data-tab');
					var contentTab = thisElem.querySelector(':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + tabId);
					contentTab.setAttribute('aria-labelledby', parentId);
					contentTab.setAttribute('aria-hidden', isActive ? 'false' : 'true');

					if( isActive ){
						contentTab.style.display = 'block';
					}
				});

				thisElem.querySelectorAll(':scope > .kt-tabs-title-list a').forEach((anchor) => {
					anchor.addEventListener('keydown', function(evt) {
						const listItem = this.parentElement;
						switch ( evt.which ) {
							case 37:
							case 38:
								if (listItem.previousElementSibling) {
									listItem.previousElementSibling.querySelector('a').click();
								} else {
									listItem.parentElement.querySelector('li:last-of-type > a' ).click();
								}
								break;
							case 39:
							case 40:
								if (listItem.nextElementSibling) {
									listItem.nextElementSibling.querySelector('a').click();
								} else {
									listItem.parentElement.querySelector('li:first-of-type > a' ).click();
								}
								break;
						}
					});
				});
				var resizeEvent = new Event('resize');
				window.dispatchEvent(resizeEvent);
			});

			var ktTabButtons = document.querySelectorAll('.kt-tabs-title-list li a');
			ktTabButtons.forEach((thisElem) => {
				thisElem.addEventListener('click', function(evt) {
					evt.preventDefault();
					const newActiveTabId = thisElem.getAttribute('data-tab');
					const tabWrap = thisElem.closest('.kt-tabs-wrap');
					window.KBTabs.setActiveTab(tabWrap, newActiveTabId);
				});
			});

			var ktAccordions = document.querySelectorAll('.kt-create-accordion');
			ktAccordions.forEach((thisElem) => {
				thisElem.querySelectorAll(':scope > .kt-tabs-title-list .kt-title-item').forEach((listItem) => {
					var tabId = listItem.querySelector('a').getAttribute('data-tab');

					var activeClass = listItem.classList.contains('kt-tab-title-active') ? 'kt-tab-title-active' : 'kt-tab-title-inactive';
					var iconClass = listItem.classList.contains('kt-tabs-svg-show-only') ? 'kt-tabs-svg-show-only' : 'kt-tabs-svg-show-always';
					var iconSideClass = listItem.classList.contains('kt-tabs-icon-side-top') ? 'kt-tabs-icon-side-top' : '';

					const closestTabWrap = listItem.closest('.kt-tabs-wrap');
					const ktContentWrap = closestTabWrap.querySelector(':scope > .kt-tabs-content-wrap');

					const newElem = window.document.createElement('div');
					newElem.className = 'kt-tabs-accordion-title kt-tabs-accordion-title-' + tabId + ' ' + activeClass + ' ' + iconClass + ' ' + iconSideClass;
					newElem.innerHTML = listItem.innerHTML;

					ktContentWrap.insertBefore(newElem, ktContentWrap.querySelector(':scope > .kt-inner-tab-' + tabId));

					ktContentWrap.querySelector(':scope > .kt-tabs-accordion-title-' + tabId + '  a').removeAttribute('role')
				});
			});

			var ktAccordionAnchor = document.querySelectorAll('.kt-tabs-accordion-title a');
			ktAccordionAnchor.forEach((thisElem) => {
				thisElem.addEventListener('click', function(evt) {

					evt.preventDefault();

					var tabId = thisElem.getAttribute('data-tab');
					var accTitle = thisElem.parentElement;
					var tabWrap = thisElem.closest('.kt-tabs-wrap');

					if ( accTitle.classList.contains( 'kt-tab-title-active' ) ) {
						tabWrap.classList.remove('kt-active-tab-' + tabId);
						accTitle.classList.replace('kt-tab-title-active', 'kt-tab-title-inactive');
					} else {
						tabWrap.classList.add('kt-active-tab-' + tabId);
						accTitle.classList.replace('kt-tab-title-inactive', 'kt-tab-title-active');
					}

					var resizeEvent = new Event('resize');
					window.dispatchEvent(resizeEvent);
					var tabEvent = new Event('kadence-tabs-open');
					window.dispatchEvent(tabEvent);
				});
			});
			window.KBTabs.setActiveWithHash();
		},
		setActiveWithHash: function() {
			if ( window.location.hash == '' ) {
				return;
			}

			var tabTitleItems = window.document.querySelector(window.location.hash + '.kt-title-item');
			if (!tabTitleItems) {
				return;
			}

			var currentTab = window.document.querySelector('#' + window.location.hash.substring(1));

			// Trigger tab change.
			var tabNumber = currentTab.querySelector('a').getAttribute('data-tab');
			var tabWrap = currentTab.closest('.kt-tabs-wrap');
			window.KBTabs.setActiveTab(tabWrap, tabNumber);

			if((window.KBTabs.isMobileSize() && tabWrap.classList.contains('kt-tabs-mobile-layout-accordion')) || (window.KBTabs.isTabletSize() && tabWrap.classList.contains('kt-tabs-tablet-layout-accordion'))) {
				tabWrap.querySelector('.kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tabs-accordion-title-' + tabNumber)
					.scrollIntoView({behavior: "smooth"});
			}
		},
		isMobileSize: function() {
			return window.innerWidth <= 767;
		},
		isTabletSize: function() {
			return window.innerWidth > 767 && window.innerWidth <= 1024;
		},
		setActiveTab: function( wrapper, tabNumber, moveFocus = true ) {

			const prevActiveAnchor = wrapper.querySelector(':scope > .kt-tabs-title-list > li.kt-tab-title-active a');
			prevActiveAnchor.parentElement.classList.replace('kt-tab-title-active', 'kt-tab-title-inactive')
			prevActiveAnchor.setAttribute('tabindex', '-1');
			prevActiveAnchor.setAttribute('aria-selected', 'false');

			wrapper.className = wrapper.className.replace(/\bkt-active-tab-\S+/g, 'kt-active-tab-' + tabNumber);
			const newActiveAnchor = wrapper.querySelector(':scope > .kt-tabs-title-list > li.kt-title-item-' + tabNumber + ' a');
			newActiveAnchor.parentElement.classList.replace('kt-tab-title-inactive', 'kt-tab-title-active');
			newActiveAnchor.setAttribute('tabindex', '0');
			newActiveAnchor.setAttribute('aria-selected', 'true');

			// Hide all tab panels.
			wrapper.querySelectorAll(':scope > .kt-tabs-content-wrap > .kt-tab-inner-content').forEach((subElem) => {
				subElem.style.display = 'none';
			});

			// Show selected tab panel.
			const newTabContent = wrapper.querySelector(':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + tabNumber);
			newTabContent.style.display = 'block';

			if ( moveFocus ) {
				newActiveAnchor.focus();
			}

			window.KBTabs.setAriaAttributesForTabs(wrapper, tabNumber);

			var resizeEvent = new Event('resize');
			window.dispatchEvent(resizeEvent);
			var tabEvent = new Event('kadence-tabs-open');
			window.dispatchEvent(tabEvent);
		},
		setAriaAttributesForTabs: function( wrapper, tabNumber ) {
			wrapper.querySelectorAll(':scope > .kt-tabs-content-wrap > .kt-tab-inner-content:not(.kt-inner-tab-' + tabNumber + ')')
				.forEach((subElem) => subElem.setAttribute('aria-hidden', 'true'));
			wrapper.querySelector(':scope > .kt-tabs-content-wrap > .kt-inner-tab-' + tabNumber )
				.setAttribute( 'aria-hidden', 'false');
			// Accordion tabs
			wrapper.querySelectorAll(':scope > .kt-tabs-content-wrap > .kt-tabs-accordion-title:not(.kt-tabs-accordion-title-' + tabNumber + ')')
				.forEach((tab) => {
					tab.classList.replace('kt-tab-title-active', 'kt-tab-title-inactive');
					tab.setAttribute('tabindex', '-1');
					tab.setAttribute('aria-selected', 'false');
				});
			const activeAccordionTab = wrapper.querySelector(':scope >.kt-tabs-content-wrap > .kt-tabs-accordion-title.kt-tabs-accordion-title-' + tabNumber);
			if( activeAccordionTab ) {
				activeAccordionTab.classList.replace('kt-tab-title-inactive', 'kt-tab-title-active');
				activeAccordionTab.setAttribute('tabindex', '0');
				activeAccordionTab.setAttribute('aria-selected', 'true');
			}
		},

		init: function() {
			window.KBTabs.setupTabs()
			window.addEventListener( 'hashchange', window.KBTabs.setActiveWithHash, false );
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.KBTabs.init );
	} else {
		// The DOM has already been loaded.
		window.KBTabs.init();
	}
})();