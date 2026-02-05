import { UI_STATES } from './constants.js';

/**
 * Update the optimizer link state in the post list table.
 *
 * @param {HTMLElement} link - The link element to update.
 * @param {{class: string, text: string}} state - The state to set (OPTIMIZE, REMOVE, or OPTIMIZING).
 */
export function updateLinkState(link, state) {
	// Remove all state classes.
	link.className = link.className
		.replace(UI_STATES.OPTIMIZE.class, '')
		.replace(UI_STATES.REMOVE.class, '')
		.replace(UI_STATES.OPTIMIZING.class, '')
		.trim();

	// Add the new state class.
	link.className += ' ' + state.class;

	// Update text content.
	link.textContent = state.text;
}

/**
 * Get the post title from the row containing the given element in the post list table.
 *
 * @param {HTMLElement} element - The element to find the row for.
 * @param {number} postId - The post ID as fallback.
 *
 * @returns {string} The post title or fallback text.
 */
export function getPostTitle(element, postId) {
	const row = element.closest('tr');
	const rowTitle = row ? row.querySelector('.row-title')?.textContent?.trim() : null;

	return rowTitle || `Post ID: ${postId}`;
}

/**
 * Animate the dots in the "Optimizing" text.
 *
 * @param {HTMLElement} link - The link element to animate.
 */
export function animateDots(link) {
	let dots = 0;
	const baseText = link.textContent;

	return setInterval(() => {
		dots = (dots + 1) % 4;
		const dotsText = '.'.repeat(dots);
		link.textContent = baseText + dotsText;
	}, 500);
}
