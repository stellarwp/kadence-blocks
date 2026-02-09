import { handleBulkOptimize } from './handlers/optimize.js';
import { handleBulkRemoveOptimization } from './handlers/remove-optimization.js';
import { getSelectedPostIds } from './link-manager.js';

/**
 * Initialize bulk action handlers.
 */
export function initBulkActions() {
	const bulkActionForm = document.querySelector('#posts-filter');

	if (!bulkActionForm) {
		return;
	}

	bulkActionForm.addEventListener('submit', async (event) => {
		// Only handle bulk actions when the Apply button (doaction) is clicked.
		if (!event.submitter || event.submitter.id !== 'doaction') {
			return;
		}

		const actionSelect = document.querySelector('#bulk-action-selector-top');
		const action = actionSelect ? actionSelect.value : null;

		if (action === 'kb_optimize_posts' || action === 'kb_optimize_remove') {
			event.preventDefault();

			const postIds = getSelectedPostIds();

			if (postIds.length === 0) {
				return;
			}

			if (action === 'kb_optimize_posts') {
				await handleBulkOptimize(postIds);
			} else if (action === 'kb_optimize_remove') {
				await handleBulkRemoveOptimization(postIds);
			}
		}
	});
}
