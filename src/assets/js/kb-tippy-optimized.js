/**
 * Optimized Tooltip System for Kadence Blocks
 * Uses event delegation and tooltip pooling for better performance
 */

(function () {
	'use strict';

	// Tooltip configuration
	const TOOLTIP_DELAY = 100; // Delay before showing tooltip (ms)
	const TOOLTIP_HIDE_DELAY = 0; // Delay before hiding tooltip (ms)
	const MAX_TOOLTIP_INSTANCES = 5; // Maximum number of tooltip DOM elements to pool
	const INTERSECTION_THRESHOLD = 0.1; // Viewport intersection threshold for lazy init

	// Tooltip pool for reusing DOM elements
	const tooltipPool = [];
	let activeTooltip = null;
	let hoverTimeout = null;
	let hideTimeout = null;
	let tooltipObserver = null;
	let initializedElements = new WeakSet();

	/**
	 * Create or get a tooltip element from the pool
	 */
	function getTooltipElement() {
		// Try to get from pool
		const pooled = tooltipPool.find((t) => !t.isActive);
		if (pooled) {
			return pooled;
		}

		// Create new if pool not full
		if (tooltipPool.length < MAX_TOOLTIP_INSTANCES) {
			const tooltip = createTooltipElement();
			tooltipPool.push(tooltip);
			return tooltip;
		}

		// Pool is full, reuse least recently used
		return tooltipPool[0];
	}

	/**
	 * Create a new tooltip DOM element
	 */
	function createTooltipElement() {
		const wrapper = document.createElement('div');
		wrapper.className = 'kb-tooltip-wrapper kb-tooltip-optimized';
		wrapper.setAttribute('role', 'tooltip');
		wrapper.style.cssText = `
			position: absolute;
			z-index: 9999;
			pointer-events: none;
			opacity: 0;
			transition: opacity 0.2s;
		`;

		const arrow = document.createElement('div');
		arrow.className = 'kb-tooltip-arrow';
		arrow.setAttribute('data-popper-arrow', '');

		const content = document.createElement('div');
		content.className = 'kb-tooltip-content';

		wrapper.appendChild(content);
		wrapper.appendChild(arrow);
		document.body.appendChild(wrapper);

		return {
			element: wrapper,
			content,
			arrow,
			isActive: false,
			popper: null,
		};
	}

	/**
	 * Position tooltip using CSS transforms (lighter than Popper.js)
	 */
	function positionTooltip(tooltip, target, placement = 'top') {
		const targetRect = target.getBoundingClientRect();
		const tooltipRect = tooltip.element.getBoundingClientRect();

		let top = 0;
		let left = 0;

		// Calculate position based on placement
		switch (placement) {
			case 'top':
				top = targetRect.top - tooltipRect.height - 8;
				left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
				break;
			case 'bottom':
				top = targetRect.bottom + 8;
				left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
				break;
			case 'left':
				top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
				left = targetRect.left - tooltipRect.width - 8;
				break;
			case 'right':
				top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
				left = targetRect.right + 8;
				break;
		}

		// Adjust for viewport boundaries
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		if (left < 0) left = 8;
		if (left + tooltipRect.width > viewportWidth) {
			left = viewportWidth - tooltipRect.width - 8;
		}

		if (top < 0) {
			// Switch to bottom if no room at top
			if (placement === 'top') {
				top = targetRect.bottom + 8;
			} else {
				top = 8;
			}
		}

		if (top + tooltipRect.height > viewportHeight) {
			// Switch to top if no room at bottom
			if (placement === 'bottom') {
				top = targetRect.top - tooltipRect.height - 8;
			} else {
				top = viewportHeight - tooltipRect.height - 8;
			}
		}

		// Apply position
		tooltip.element.style.transform = `translate(${left}px, ${top}px)`;
	}

	/**
	 * Show tooltip for target element
	 */
	function showTooltip(target) {
		// Clear any pending timers
		clearTimeout(hoverTimeout);
		clearTimeout(hideTimeout);

		hoverTimeout = setTimeout(() => {
			// Hide any active tooltip
			if (activeTooltip) {
				hideTooltip();
			}

			// Get tooltip content
			const content = target.getAttribute('data-kb-tooltip-content');
			const tooltipId = target.getAttribute('data-tooltip-id');
			const placement = target.getAttribute('data-tooltip-placement') || 'top';

			let tooltipContent = content;

			// If using tooltip ID, get content from hidden element
			if (!tooltipContent && tooltipId) {
				const contentEl = document.getElementById(tooltipId);
				if (contentEl) {
					tooltipContent = contentEl.innerHTML;
				}
			}

			if (!tooltipContent) return;

			// Get tooltip from pool
			const tooltip = getTooltipElement();
			tooltip.isActive = true;
			tooltip.content.innerHTML = stripTags(tooltipContent);

			// Show and position
			tooltip.element.style.opacity = '0';
			tooltip.element.style.display = 'block';

			// Force reflow before animation
			tooltip.element.offsetHeight;

			positionTooltip(tooltip, target, placement);
			tooltip.element.style.opacity = '1';

			activeTooltip = tooltip;

			// Set ARIA attributes
			const tooltipDescribedById = 'kb-tooltip-' + Date.now();
			tooltip.element.id = tooltipDescribedById;
			target.setAttribute('aria-describedby', tooltipDescribedById);
		}, TOOLTIP_DELAY);
	}

	/**
	 * Hide active tooltip
	 */
	function hideTooltip() {
		clearTimeout(hoverTimeout);
		clearTimeout(hideTimeout);

		if (activeTooltip) {
			const tooltip = activeTooltip;

			hideTimeout = setTimeout(() => {
				tooltip.element.style.opacity = '0';

				setTimeout(() => {
					tooltip.element.style.display = 'none';
					tooltip.isActive = false;

					// Clear ARIA attributes
					const target = document.querySelector(`[aria-describedby="${tooltip.element.id}"]`);
					if (target) {
						target.removeAttribute('aria-describedby');
					}
				}, 200);
			}, TOOLTIP_HIDE_DELAY);

			activeTooltip = null;
		}
	}

	/**
	 * Strip HTML tags from content (security)
	 */
	function stripTags(html) {
		const tmp = document.createElement('div');
		tmp.textContent = html;
		return tmp.innerHTML;
	}

	/**
	 * Handle mouse enter on tooltip triggers
	 */
	function handleMouseEnter(event) {
		const target = event.target.closest('[data-kb-tooltip-content], [data-tooltip-id]');
		if (target && !target.disabled) {
			showTooltip(target);
		}
	}

	/**
	 * Handle mouse leave on tooltip triggers
	 */
	function handleMouseLeave(event) {
		const target = event.target.closest('[data-kb-tooltip-content], [data-tooltip-id]');
		if (target) {
			hideTooltip();
		}
	}

	/**
	 * Handle focus for keyboard accessibility
	 */
	function handleFocus(event) {
		const target = event.target;
		if (target.hasAttribute('data-kb-tooltip-content') || target.hasAttribute('data-tooltip-id')) {
			showTooltip(target);
		}
	}

	/**
	 * Handle blur
	 */
	function handleBlur(event) {
		const target = event.target;
		if (target.hasAttribute('data-kb-tooltip-content') || target.hasAttribute('data-tooltip-id')) {
			hideTooltip();
		}
	}

	/**
	 * Initialize lazy loading for tooltips
	 */
	function initLazyLoading() {
		if ('IntersectionObserver' in window) {
			tooltipObserver = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting && !initializedElements.has(entry.target)) {
							// Mark as initialized
							initializedElements.add(entry.target);

							// Set tabindex for keyboard accessibility if needed
							if (
								entry.target.tagName !== 'A' &&
								entry.target.tagName !== 'BUTTON' &&
								!entry.target.hasAttribute('tabindex')
							) {
								entry.target.setAttribute('tabindex', '0');
							}

							// Stop observing this element
							tooltipObserver.unobserve(entry.target);
						}
					});
				},
				{
					threshold: INTERSECTION_THRESHOLD,
				}
			);

			// Observe all tooltip triggers
			document.querySelectorAll('[data-kb-tooltip-content], [data-tooltip-id]').forEach((el) => {
				tooltipObserver.observe(el);
			});
		} else {
			// Fallback for older browsers - initialize all at once
			document.querySelectorAll('[data-kb-tooltip-content], [data-tooltip-id]').forEach((el) => {
				if (el.tagName !== 'A' && el.tagName !== 'BUTTON' && !el.hasAttribute('tabindex')) {
					el.setAttribute('tabindex', '0');
				}
				initializedElements.add(el);
			});
		}
	}

	/**
	 * Initialize optimized tooltip system
	 */
	function init() {
		// Remove any existing listeners
		destroy();

		// Add CSS if not already added
		if (!document.getElementById('kb-tooltip-optimized-styles')) {
			const style = document.createElement('style');
			style.id = 'kb-tooltip-optimized-styles';
			style.textContent = `
				.kb-tooltip-optimized {
					background: rgba(0, 0, 0, 0.9);
					color: white;
					padding: 5px 8px;
					border-radius: 4px;
					font-size: 14px;
					line-height: 1.4;
					max-width: 250px;
					word-wrap: break-word;
				}
				.kb-tooltip-arrow {
					position: absolute;
					width: 8px;
					height: 8px;
					background: inherit;
					transform: rotate(45deg);
				}
			`;
			document.head.appendChild(style);
		}

		// Use event delegation on document body
		document.addEventListener('mouseenter', handleMouseEnter, true);
		document.addEventListener('mouseleave', handleMouseLeave, true);
		document.addEventListener('focusin', handleFocus, true);
		document.addEventListener('focusout', handleBlur, true);

		// Handle scroll and resize to reposition active tooltip
		let repositionTimeout;
		const repositionHandler = () => {
			clearTimeout(repositionTimeout);
			repositionTimeout = setTimeout(() => {
				if (activeTooltip) {
					const target = document.querySelector(`[aria-describedby="${activeTooltip.element.id}"]`);
					if (target) {
						const placement = target.getAttribute('data-tooltip-placement') || 'top';
						positionTooltip(activeTooltip, target, placement);
					}
				}
			}, 10);
		};

		window.addEventListener('scroll', repositionHandler, true);
		window.addEventListener('resize', repositionHandler);

		// Initialize lazy loading
		initLazyLoading();

		// Handle dynamic content
		if (window.MutationObserver) {
			const observer = new MutationObserver((mutations) => {
				mutations.forEach((mutation) => {
					mutation.addedNodes.forEach((node) => {
						if (node.nodeType === 1) {
							// Element node
							const tooltipTriggers = node.querySelectorAll(
								'[data-kb-tooltip-content], [data-tooltip-id]'
							);
							tooltipTriggers.forEach((el) => {
								if (tooltipObserver) {
									tooltipObserver.observe(el);
								} else {
									if (el.tagName !== 'A' && el.tagName !== 'BUTTON' && !el.hasAttribute('tabindex')) {
										el.setAttribute('tabindex', '0');
									}
									initializedElements.add(el);
								}
							});
						}
					});
				});
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		}
	}

	/**
	 * Destroy tooltip system
	 */
	function destroy() {
		// Remove event listeners
		document.removeEventListener('mouseenter', handleMouseEnter, true);
		document.removeEventListener('mouseleave', handleMouseLeave, true);
		document.removeEventListener('focusin', handleFocus, true);
		document.removeEventListener('focusout', handleBlur, true);

		// Clear timeouts
		clearTimeout(hoverTimeout);
		clearTimeout(hideTimeout);

		// Remove all tooltip elements
		tooltipPool.forEach((tooltip) => {
			if (tooltip.element && tooltip.element.parentNode) {
				tooltip.element.parentNode.removeChild(tooltip.element);
			}
		});
		tooltipPool.length = 0;

		// Disconnect observer
		if (tooltipObserver) {
			tooltipObserver.disconnect();
		}

		// Clear initialized elements
		initializedElements = new WeakSet();
	}

	// Public API
	window.kadenceTooltipOptimized = {
		init,
		destroy,
		hideTooltip,
	};

	// Auto-initialize
	if ('loading' === document.readyState) {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Re-initialize on Kadence reload event
	document.addEventListener('kadenceJSInitReload', init);
})();
