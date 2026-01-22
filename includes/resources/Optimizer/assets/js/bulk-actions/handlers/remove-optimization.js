import { __, _n, sprintf } from '@wordpress/i18n';
import { UI_STATES } from '../../optimizer/constants.js';
import { createNotice, createDismissibleNotice, NOTICE_TYPES } from '@kadence-bundled/admin-notices';
import { AnimationManager } from '../animation-manager.js';
import { updatePostLinkState } from '../link-manager.js';
import { fetchPostsMetadata, bulkDeleteOptimization } from '../api.js';
import { initializeBulkUI } from '../ui.js';

/**
 * Handle bulk remove optimization action.
 *
 * @param {number[]} postIds - Array of post IDs to remove optimization from.
 *
 * @returns {Promise<void>}
 */
export async function handleBulkRemoveOptimization(postIds) {
	console.log('🗑️ Removing optimization for posts:', postIds);

	const animationManager = new AnimationManager();
	initializeBulkUI(postIds, animationManager);

	const processingNotice = createDismissibleNotice(
		sprintf(
			// translators: %d: Number of posts having optimization removed.
			_n(
				'Removing optimization for %d post…',
				'Removing optimization for %d posts…',
				postIds.length,
				'kadence-blocks'
			),
			postIds.length
		),
		NOTICE_TYPES.INFO
	);

	try {
		const metadataResponse = await fetchPostsMetadata(postIds);
		const { data: postsData, errors: metadataErrors } = metadataResponse;

		if (metadataErrors && metadataErrors.length > 0) {
			metadataErrors.forEach((error) => {
				createNotice(`Post ID ${error.post_id}: ${error.message}`, NOTICE_TYPES.ERROR, true);
				animationManager.stop(error.post_id);
				updatePostLinkState(error.post_id, UI_STATES.REMOVE);
			});
		}

		if (postsData.length > 0) {
			const postIdsToDelete = postsData.map((post) => post.post_id);
			const postPathsToDelete = postsData.map((post) => post.post_path);

			console.log(`Removing optimization for ${postIdsToDelete.length} posts...`);

			const deleteResponse = await bulkDeleteOptimization(postIdsToDelete, postPathsToDelete);
			const { data: results } = deleteResponse;

			results.successful.forEach((postId) => {
				animationManager.stop(postId);
				updatePostLinkState(postId, UI_STATES.OPTIMIZE);
			});

			if (results.failed && results.failed.length > 0) {
				results.failed.forEach((failure) => {
					createNotice(`Post ID ${failure.post_id}: ${failure.message}`, NOTICE_TYPES.ERROR, true);
					animationManager.stop(failure.post_id);
					updatePostLinkState(failure.post_id, UI_STATES.REMOVE);
				});
			}

			if (results.successful.length > 0) {
				createNotice(
					sprintf(
						// translators: %d: Number of posts.
						_n(
							'Removed optimization for %d post.',
							'Removed optimization for %d posts.',
							results.successful.length,
							'kadence-blocks'
						),
						results.successful.length
					),
					NOTICE_TYPES.SUCCESS
				);
			}

			if (results.failed && results.failed.length > 0) {
				createNotice(
					sprintf(
						// translators: %d: Number of posts that failed.
						_n(
							'Failed to remove optimization for %d post.',
							'Failed to remove optimization for %d posts.',
							results.failed.length,
							'kadence-blocks'
						),
						results.failed.length
					),
					NOTICE_TYPES.ERROR,
					true
				);
			}
		}

		processingNotice?.remove();
	} catch (error) {
		console.error('❌ Bulk remove optimization failed:', error);

		processingNotice?.remove();

		createNotice(
			__('Failed to fetch post data for bulk operation.', 'kadence-blocks'),
			NOTICE_TYPES.ERROR,
			true,
			error
		);
	}
}
