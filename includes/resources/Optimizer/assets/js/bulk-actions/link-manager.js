import { updateLinkState } from '../optimizer/ui-manager.js';

/**
 * Find and update link state for a post.
 *
 * @param {number}                           postId - Post ID.
 * @param {{class: string, text: string}}    state  - UI state to set (e.g., UI_STATES.OPTIMIZE).
 *
 * @returns {HTMLElement|null} The link element if found.
 */
export function updatePostLinkState(postId, state) {
	const link = document.querySelector(`a[data-post-id="${postId}"]`);

	if (link) {
		updateLinkState(link, state);
	}

	return link;
}

/**
 * Get all selected post IDs from checkboxes.
 *
 * @returns {number[]} Array of selected post IDs.
 */
export function getSelectedPostIds() {
	const checkboxes = document.querySelectorAll('input[name="post[]"]:checked');

	return Array.from(checkboxes).map((checkbox) => parseInt(checkbox.value, 10));
}
