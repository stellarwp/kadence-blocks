import { __, _n, sprintf } from '@wordpress/i18n';
import { analyzeSite } from '../../optimizer/analyzer.js';
import { OPTIMIZER_DATA, UI_STATES } from '../../optimizer/constants.js';
import { createNotice, createDismissibleNotice, NOTICE_TYPES } from '@kadence-bundled/admin-notices';
import { AnimationManager } from '../animation-manager.js';
import { updatePostLinkState } from '../link-manager.js';
import { fetchPostsMetadata } from '../api.js';
import { initializeBulkUI } from '../ui.js';

/**
 * Handle errors from metadata fetch.
 *
 * @param {Array}            errors           - Array of error objects.
 * @param {AnimationManager} animationManager - Animation manager instance.
 */
function handleMetadataErrors(errors, animationManager) {
	if (!errors || errors.length === 0) {
		return;
	}

	errors.forEach((error) => {
		createNotice(`Post ID ${error.post_id}: ${error.message}`, NOTICE_TYPES.ERROR, true);
		animationManager.stop(error.post_id);
		updatePostLinkState(error.post_id, UI_STATES.OPTIMIZE);
	});
}

/**
 * Handle bulk optimization action.
 *
 * @param {number[]} postIds - Array of post IDs to optimize.
 *
 * @returns {Promise<void>}
 */
export async function handleBulkOptimize(postIds) {
	console.log('🚀 Starting bulk optimization for posts:', postIds);

	const animationManager = new AnimationManager();
	initializeBulkUI(postIds, animationManager);

	const processingNotice = createDismissibleNotice(
		sprintf(
			// translators: %d: Number of posts being optimized.
			_n('Optimizing %d post…', 'Optimizing %d posts…', postIds.length, 'kadence-blocks'),
			postIds.length
		),
		NOTICE_TYPES.INFO
	);

	try {
		const response = await fetchPostsMetadata(postIds);
		const { data: postsData, errors } = response;

		handleMetadataErrors(errors, animationManager);

		const results = {
			successful: [],
			failed: [],
		};

		for (const postData of postsData) {
			console.log(`🎯 Optimizing post ${postData.post_id}...`);

			try {
				await analyzeSite(postData.url, postData.post_id, postData.post_path, OPTIMIZER_DATA.token);

				results.successful.push(postData.post_id);
				animationManager.stop(postData.post_id);
				updatePostLinkState(postData.post_id, UI_STATES.REMOVE);
			} catch (error) {
				console.error(`❌ Failed to optimize post ${postData.post_id}:`, error);
				results.failed.push(postData.post_id);

				createNotice(`Post ID ${postData.post_id}: ${error.message}`, NOTICE_TYPES.ERROR, true);
				animationManager.stop(postData.post_id);
				updatePostLinkState(postData.post_id, UI_STATES.OPTIMIZE);
			}
		}

		if (results.successful.length > 0) {
			createNotice(
				sprintf(
					// translators: %d: Number of posts optimized.
					_n(
						'🎉 %d post optimized successfully!',
						'🎉 %d posts optimized successfully!',
						results.successful.length,
						'kadence-blocks'
					),
					results.successful.length
				),
				NOTICE_TYPES.SUCCESS
			);
		}

		if (results.failed.length > 0) {
			createNotice(
				sprintf(
					// translators: %d: Number of posts that failed.
					_n(
						'Failed to optimize %d post.',
						'Failed to optimize %d posts.',
						results.failed.length,
						'kadence-blocks'
					),
					results.failed.length
				),
				NOTICE_TYPES.ERROR,
				true
			);
		}

		processingNotice?.remove();
	} catch (error) {
		console.error('❌ Bulk optimization failed:', error);

		processingNotice?.remove();

		createNotice(
			__('Failed to fetch post data for bulk optimization.', 'kadence-blocks'),
			NOTICE_TYPES.ERROR,
			true,
			error
		);
	}
}
