/**
 * File kbshowmore.js.
 * Gets the showmore buttons working.
 */
(function () {
	'use strict';
	window.kadenceShowMore = {
		cache: {},
		/**
		 * Extract text content from the actually visible area of the element
		 * Uses the real rendered positions of elements to determine what's visible
		 * @param {HTMLElement} element - The content element
		 * @param {number} maxHeight - Maximum visible height in pixels
		 * @returns {string} - Text content from the visible area only
		 */
		extractVisibleText(element, maxHeight) {
			if (!element) {
				return '';
			}
			if (!maxHeight || maxHeight <= 0) {
				return '';
			}

			// Temporarily make element measurable if it has inert
			const wasInert = element.hasAttribute('inert');
			if (wasInert) {
				element.removeAttribute('inert');
			}

			// Get the bounding rect of the container
			const containerRect = element.getBoundingClientRect();
			const visibleBottom = containerRect.top + maxHeight;

			// Find all leaf text-containing elements (elements with direct text content)
			const visibleTexts = [];

			// Walk through all elements and find ones with text that are within visible area
			const walkElements = (el) => {
				// Skip script, style, and hidden elements
				if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE' || el.tagName === 'NOSCRIPT') {
					return;
				}

				const style = window.getComputedStyle(el);
				if (style.display === 'none' || style.visibility === 'hidden') {
					return;
				}

				const rect = el.getBoundingClientRect();

				// Check if element is within visible area
				if (rect.top >= visibleBottom) {
					return; // Element starts below visible area, skip it and children
				}

				// Check if this element has direct text content (not just from children)
				let hasDirectText = false;
				let directText = '';

				for (const child of el.childNodes) {
					if (child.nodeType === 3) {
						const text = child.textContent.trim();
						if (text) {
							hasDirectText = true;
							directText += text + ' ';
						}
					}
				}

				if (hasDirectText && directText.trim()) {
					// Calculate how much of this element is visible
					const elementTop = rect.top - containerRect.top;
					const elementBottom = rect.bottom - containerRect.top;

					// Only include if element starts within visible area
					if (elementTop < maxHeight) {
						// If element extends beyond visible area, we may need to truncate
						if (elementBottom > maxHeight) {
							// Element is partially visible - estimate visible portion
							const visibleRatio = (maxHeight - elementTop) / rect.height;
							const words = directText.trim().split(/\s+/);
							const visibleWordCount = Math.max(1, Math.floor(words.length * visibleRatio));
							directText = words.slice(0, visibleWordCount).join(' ');
						}

						visibleTexts.push({
							text: directText.trim(),
							top: elementTop,
						});
					}
				}

				// Recurse into children
				for (const child of el.children) {
					walkElements(child);
				}
			};

			walkElements(element);

			// Restore inert if it was set
			if (wasInert) {
				element.setAttribute('inert', '');
			}

			if (visibleTexts.length === 0) {
				return '';
			}

			// Sort by position and deduplicate
			visibleTexts.sort((a, b) => a.top - b.top);

			// Build excerpt, avoiding duplicates
			const seenTexts = new Set();
			let excerpt = '';

			for (const item of visibleTexts) {
				// Skip if we've seen this exact text (handles nested elements)
				if (seenTexts.has(item.text)) {
					continue;
				}

				// Skip if this text is contained within already added text
				let isContained = false;
				for (const seen of seenTexts) {
					if (seen.includes(item.text) || item.text.includes(seen)) {
						isContained = true;
						break;
					}
				}

				if (!isContained) {
					seenTexts.add(item.text);
					excerpt += (excerpt ? ' ' : '') + item.text;
				}
			}

			return this.cleanupExcerpt(excerpt);
		},
		/**
		 * Clean up excerpt text - normalize whitespace and try to end at sentence boundary
		 * @param {string} text - The text to clean up
		 * @returns {string} - Cleaned up text
		 */
		cleanupExcerpt(text) {
			if (!text) {
				return '';
			}

			// Remove any HTML tags that might have slipped through
			let cleaned = text.replace(/<[^>]*>/g, '');

			// Normalize whitespace
			cleaned = cleaned.replace(/\s+/g, ' ').trim();

			// Try to end at a sentence boundary if we have enough content
			if (cleaned.length > 80) {
				const lastPeriod = cleaned.lastIndexOf('.');
				const lastExclamation = cleaned.lastIndexOf('!');
				const lastQuestion = cleaned.lastIndexOf('?');
				const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);

				// Only truncate at sentence if it preserves a reasonable amount
				if (lastSentenceEnd > 40) {
					cleaned = cleaned.substring(0, lastSentenceEnd + 1);
				}
			}

			return cleaned;
		},
		/**
		 * Build the screen reader text with excerpt and prompt
		 * @param {string} excerpt - The excerpt text
		 * @param {string} buttonText - The text of the show more button
		 * @returns {string} - Full screen reader text
		 */
		buildScreenReaderText(excerpt, buttonText) {
			// Get localized strings, fallback to English if not available
			const i18n = window.kbShowMore || {};
			const contentCollapsed = i18n.contentCollapsed || 'Content is collapsed.';
			const contentContinues = i18n.contentContinues || 'Content continues.';
			const activateButton = i18n.activateButton || 'Activate the';
			const buttonToReveal = i18n.buttonToReveal || 'button to reveal the full content.';
			const showMoreDefault = i18n.showMoreDefault || 'Show More';

			const showMorePrompt = buttonText || showMoreDefault;

			if (!excerpt || excerpt.trim() === '') {
				// No text content - just tell user to click the button
				return contentCollapsed + ' ' + activateButton + ' ' + showMorePrompt + ' ' + buttonToReveal;
			}

			// Add excerpt with pause (using period) and prompt
			return (
				excerpt +
				' ... ' +
				contentContinues +
				' ' +
				activateButton +
				' ' +
				showMorePrompt +
				' ' +
				buttonToReveal
			);
		},
		/**
		 * Get the current max-height for the content based on viewport
		 * @param {HTMLElement} rootElement - The root show more container
		 * @returns {number} - The max height in pixels
		 */
		getCurrentMaxHeight(rootElement) {
			const contentElement = rootElement.querySelector('.wp-block-kadence-column.kb-show-more-content');
			if (!contentElement) {
				return 250;
			}

			const computedStyle = window.getComputedStyle(contentElement);
			const maxHeight = computedStyle.maxHeight;

			if (maxHeight === 'none') {
				return null; // Content is expanded
			}

			// Convert to pixels
			const match = maxHeight.match(/([\d.]+)(px|em|rem)/);
			if (!match) {
				return 250;
			}

			const value = parseFloat(match[1]);
			const unit = match[2];

			if (unit === 'px') {
				return value;
			} else if (unit === 'em' || unit === 'rem') {
				// Get the font size of the element
				const fontSize = parseFloat(window.getComputedStyle(contentElement).fontSize);
				return value * fontSize;
			}

			return 250;
		},
		/**
		 * Get all focusable elements within a container
		 * @param {HTMLElement} container - The container element
		 * @returns {Array<HTMLElement>} - Array of focusable elements
		 */
		getFocusableElements(container) {
			if (!container) {
				return [];
			}

			const focusableSelectors = [
				'a[href]',
				'button:not([disabled])',
				'input:not([disabled])',
				'select:not([disabled])',
				'textarea:not([disabled])',
				'[tabindex]:not([tabindex="-1"])',
				'[contenteditable="true"]',
				'iframe',
				'object',
				'embed',
				'area[href]',
				'audio[controls]',
				'video[controls]',
				'[role="button"]:not([tabindex="-1"])',
				'[role="link"]:not([tabindex="-1"])',
				'[role="menuitem"]:not([tabindex="-1"])',
				'[role="menuitemcheckbox"]:not([tabindex="-1"])',
				'[role="menuitemradio"]:not([tabindex="-1"])',
				'[role="option"]:not([tabindex="-1"])',
				'[role="switch"]:not([tabindex="-1"])',
				'[role="tab"]:not([tabindex="-1"])',
				'[role="textbox"]:not([tabindex="-1"])',
			].join(', ');

			const elements = Array.from(container.querySelectorAll(focusableSelectors));

			// Filter out elements that are not actually focusable
			return elements.filter((el) => {
				// Check if element is visible
				const style = window.getComputedStyle(el);
				if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
					return false;
				}

				// Check if element has a tabindex that makes it focusable
				const tabIndex = el.getAttribute('tabindex');
				if (tabIndex === '-1') {
					return false;
				}

				return true;
			});
		},
		/**
		 * Store original tabindex values and set tabindex="-1" on focusable elements
		 * @param {HTMLElement} container - The container element
		 */
		disableTabIndex(container) {
			if (!container) {
				return;
			}

			const focusableElements = this.getFocusableElements(container);

			focusableElements.forEach((el) => {
				// If this element is currently focused, blur it
				if (document.activeElement === el) {
					el.blur();
				}

				// Store original tabindex if it exists
				const originalTabIndex = el.getAttribute('tabindex');
				if (originalTabIndex !== null) {
					el.setAttribute('data-original-tabindex', originalTabIndex);
				} else {
					// Mark that this element didn't have a tabindex originally
					el.setAttribute('data-had-no-tabindex', 'true');
				}

				// Set tabindex to -1 to remove from tab order
				el.setAttribute('tabindex', '-1');
			});
		},
		/**
		 * Restore original tabindex values on focusable elements
		 * @param {HTMLElement} container - The container element
		 */
		restoreTabIndex(container) {
			if (!container) {
				return;
			}

			// Find all elements that have our data attributes (elements we modified)
			const modifiedElements = container.querySelectorAll('[data-original-tabindex], [data-had-no-tabindex]');

			modifiedElements.forEach((el) => {
				const originalTabIndex = el.getAttribute('data-original-tabindex');
				const hadNoTabIndex = el.getAttribute('data-had-no-tabindex');

				if (originalTabIndex !== null) {
					// Restore original tabindex
					el.setAttribute('tabindex', originalTabIndex);
					el.removeAttribute('data-original-tabindex');
				} else if (hadNoTabIndex === 'true') {
					// Remove tabindex attribute if it didn't have one originally
					el.removeAttribute('tabindex');
					el.removeAttribute('data-had-no-tabindex');
				}
			});
		},
		/**
		 * Update accessibility attributes for the show more block
		 * @param {HTMLElement} rootElement - The root show more container
		 * @param {boolean} isExpanded - Whether the content is expanded
		 */
		updateAccessibility(rootElement, isExpanded) {
			const contentElement = rootElement.querySelector('.wp-block-kadence-column.kb-show-more-content');

			if (!contentElement) {
				return;
			}

			const excerptElement = rootElement.querySelector('.kb-show-more-sr-excerpt');
			const showMoreButton = rootElement.querySelector(
				'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:nth-of-type(1)'
			);
			const showLessButton = rootElement.querySelector(
				'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:nth-of-type(2)'
			);

			// Get the button text for the screen reader prompt
			let buttonText = 'Show More';
			if (showMoreButton) {
				const btnTextEl = showMoreButton.querySelector('.kt-btn-inner-text');
				if (btnTextEl && btnTextEl.textContent) {
					buttonText = btnTextEl.textContent.trim();
				}
			}

			if (isExpanded) {
				// Content is expanded - show full content to screen readers, hide excerpt
				contentElement.removeAttribute('aria-hidden');
				contentElement.removeAttribute('inert');
				// Restore tabindex on all focusable elements
				this.restoreTabIndex(contentElement);

				if (excerptElement) {
					excerptElement.textContent = '';
					excerptElement.setAttribute('aria-hidden', 'true');
				}
				if (showMoreButton) {
					showMoreButton.setAttribute('aria-expanded', 'true');
				}
				if (showLessButton) {
					showLessButton.setAttribute('aria-expanded', 'true');
				}
			} else {
				// Content is collapsed - hide from screen readers and prevent all interaction
				// Using 'inert' prevents tab navigation, arrow key navigation, and click events
				contentElement.setAttribute('aria-hidden', 'true');
				contentElement.setAttribute('inert', '');
				// Remove focusable elements from tab order (fallback for browsers without inert support)
				this.disableTabIndex(contentElement);

				// Generate and update excerpt with screen reader prompt
				if (excerptElement) {
					const maxHeight = this.getCurrentMaxHeight(rootElement);
					if (maxHeight !== null) {
						// Temporarily remove inert to read content
						contentElement.removeAttribute('inert');
						const excerptText = this.extractVisibleText(contentElement, maxHeight);
						contentElement.setAttribute('inert', '');

						// Build full screen reader text with excerpt and prompt
						const srText = this.buildScreenReaderText(excerptText, buttonText);
						excerptElement.textContent = srText;
						excerptElement.removeAttribute('aria-hidden');
					} else {
						// Content is fully expanded by default at this viewport
						excerptElement.textContent = '';
						excerptElement.setAttribute('aria-hidden', 'true');
					}
				}

				if (showMoreButton) {
					showMoreButton.setAttribute('aria-expanded', 'false');
				}
				if (showLessButton) {
					showLessButton.setAttribute('aria-expanded', 'false');
				}
			}
		},
		/**
		 * Check if content should be expanded by default based on viewport
		 * @param {HTMLElement} rootElement - The root show more container
		 * @returns {boolean} - Whether content should be expanded
		 */
		isDefaultExpanded(rootElement) {
			// Check if the container has the open class
			if (rootElement.classList.contains('kb-smc-open')) {
				return true;
			}

			// Check CSS media queries for default expanded states
			const contentElement = rootElement.querySelector('.wp-block-kadence-column.kb-show-more-content');
			if (!contentElement) {
				return false;
			}

			const computedStyle = window.getComputedStyle(contentElement);
			return computedStyle.maxHeight === 'none';
		},
		/**
		 * Ensure excerpt element exists for backwards compatibility
		 * Creates the excerpt div if it doesn't exist (fallback for edge cases)
		 * Note: This should rarely be needed as build_html in PHP handles it
		 * @param {HTMLElement} rootElement - The root show more container
		 */
		ensureExcerptElement(rootElement) {
			let excerptElement = rootElement.querySelector('.kb-show-more-sr-excerpt');

			if (!excerptElement) {
				// Fallback: Create the excerpt element if PHP didn't add it (edge case)
				excerptElement = document.createElement('div');
				excerptElement.className = 'kb-show-more-sr-excerpt';
				excerptElement.setAttribute('aria-live', 'polite');
				excerptElement.setAttribute('aria-atomic', 'true');

				// Insert it as the first child of the root element
				if (rootElement.firstChild) {
					rootElement.insertBefore(excerptElement, rootElement.firstChild);
				} else {
					rootElement.appendChild(excerptElement);
				}
			}

			return excerptElement;
		},
		initShowMore() {
			// Query for both new and old block structures for backwards compatibility
			window.kadenceShowMore.cache = document.querySelectorAll(
				'.wp-block-kadence-show-more, .kb-block-show-more-container'
			);
			if (!window.kadenceShowMore.cache.length) {
				return;
			}
			for (let n = 0; n < window.kadenceShowMore.cache.length; n++) {
				// Initialize listener (backward support)
				const rootElement = window.kadenceShowMore.cache[n];

				// Add wp-block-kadence-show-more class if missing (for backwards compatibility)
				if (!rootElement.classList.contains('wp-block-kadence-show-more')) {
					rootElement.classList.add('wp-block-kadence-show-more');
				}

				// Ensure excerpt element exists for backwards compatibility
				window.kadenceShowMore.ensureExcerptElement(rootElement);

				const contentElement = rootElement.querySelector('.wp-block-kadence-column.kb-show-more-content');
				const showMoreButton = rootElement.querySelector(
					'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:nth-of-type(1)'
				);
				const showLessButton = rootElement.querySelector(
					'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .wp-block-kadence-singlebtn:nth-of-type(2)'
				);

				// Set up button IDs for aria-controls
				const uniqueId = 'kb-show-more-' + n;
				if (contentElement && !contentElement.id) {
					contentElement.id = uniqueId + '-content';
				}
				if (showMoreButton && !showMoreButton.id) {
					showMoreButton.id = uniqueId + '-show-more';
					showMoreButton.setAttribute('aria-controls', uniqueId + '-content');
				}
				if (showLessButton && !showLessButton.id) {
					showLessButton.id = uniqueId + '-show-less';
					showLessButton.setAttribute('aria-controls', uniqueId + '-content');
				}

				// Initialize accessibility state after a brief delay to ensure CSS is applied
				const initAccessibility = () => {
					const isExpanded = window.kadenceShowMore.isDefaultExpanded(rootElement);
					window.kadenceShowMore.updateAccessibility(rootElement, isExpanded);
				};

				// Use requestAnimationFrame to ensure CSS is applied
				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(() => {
						setTimeout(initAccessibility, 50);
					});
				} else {
					setTimeout(initAccessibility, 100);
				}

				// Handle window resize to update excerpt for responsive heights
				let resizeTimeout;
				const handleResize = () => {
					clearTimeout(resizeTimeout);
					resizeTimeout = setTimeout(() => {
						const isExpanded = window.kadenceShowMore.isDefaultExpanded(rootElement);
						window.kadenceShowMore.updateAccessibility(rootElement, isExpanded);
					}, 250);
				};
				window.addEventListener('resize', handleResize);

				if (
					rootElement.querySelector(
						'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:first-child a'
					)
				) {
					rootElement
						.querySelector(
							'.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:first-child a'
						)
						.addEventListener('click', function (e) {
							e.preventDefault();
							rootElement.classList.add('kb-smc-open');
							window.kadenceShowMore.updateAccessibility(rootElement, true);
							return false;
						});
					rootElement
						.querySelector('.wp-block-kadence-advancedbtn.kb-show-more-buttons > .kt-btn-wrap:last-child a')
						.addEventListener('click', function (e) {
							e.preventDefault();
							rootElement.classList.remove('kb-smc-open');
							window.kadenceShowMore.updateAccessibility(rootElement, false);
							return false;
						});
				}
				// Initialize listener
				if (showMoreButton) {
					const showMoreAction = function (e) {
						e.preventDefault();
						rootElement.classList.add('kb-smc-open');
						showMoreButton.setAttribute('aria-hidden', 'true');
						if (showLessButton) {
							showLessButton.removeAttribute('aria-hidden');
						}
						window.kadenceShowMore.updateAccessibility(rootElement, true);
						return false;
					};
					const showLessAction = function (e) {
						e.preventDefault();
						rootElement.classList.remove('kb-smc-open');
						showMoreButton.removeAttribute('aria-hidden');
						if (showLessButton) {
							showLessButton.setAttribute('aria-hidden', 'true');
						}
						window.kadenceShowMore.updateAccessibility(rootElement, false);
						return false;
					};
					showMoreButton.addEventListener('click', showMoreAction);
					if (showLessButton) {
						showLessButton.addEventListener('click', showLessAction);
						showLessButton.setAttribute('aria-hidden', 'true');
					}
				}
			}
		},
		// Initiate sticky when the DOM loads.
		init() {
			window.kadenceShowMore.initShowMore();
		},
	};
	if ('loading' === document.readyState) {
		// The DOM has not yet been loaded.
		document.addEventListener('DOMContentLoaded', window.kadenceShowMore.init);
	} else {
		// The DOM has already been loaded.
		window.kadenceShowMore.init();
	}
	document.addEventListener('kadenceJSInitReload', function () {
		window.kadenceShowMore.init();
	});
	document.addEventListener('kb-query-loaded', function () {
		window.kadenceShowMore.init();
	});
})();
