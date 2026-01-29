import { UI_STATES } from '../optimizer/constants.js';
import { AnimationManager } from './animation-manager.js';
import { updatePostLinkState } from './link-manager.js';

/**
 * Initialize UI state for bulk operation.
 *
 * @param {number[]}         postIds          - Array of post IDs.
 * @param {AnimationManager} animationManager - Animation manager instance.
 */
export function initializeBulkUI(postIds, animationManager) {
	postIds.forEach((postId) => {
		const link = updatePostLinkState(postId, UI_STATES.OPTIMIZING);

		if (link) {
			animationManager.start(postId, link);
		}
	});
}
