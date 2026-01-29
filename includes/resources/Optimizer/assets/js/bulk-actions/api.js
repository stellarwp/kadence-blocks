import apiFetch from '@wordpress/api-fetch';
import { POSTS_METADATA_ROUTE, BULK_DELETE_ROUTE } from './constants.js';

/**
 * Fetch metadata for multiple posts.
 *
 * @param {number[]} postIds - Array of post IDs.
 *
 * @returns {Promise<{data: Array, errors: Array}>}
 */
export async function fetchPostsMetadata(postIds) {
	return await apiFetch({
		path: POSTS_METADATA_ROUTE,
		method: 'POST',
		data: { post_ids: postIds },
	});
}

/**
 * Bulk delete optimization data for multiple posts.
 *
 * @param {number[]} postIds   - Array of post IDs.
 * @param {string[]} postPaths - Array of post paths.
 *
 * @returns {Promise<{data: {successful: Array, failed: Array}}>}
 */
export async function bulkDeleteOptimization(postIds, postPaths) {
	return await apiFetch({
		path: BULK_DELETE_ROUTE,
		method: 'DELETE',
		data: {
			post_ids: postIds,
			post_paths: postPaths,
		},
	});
}
