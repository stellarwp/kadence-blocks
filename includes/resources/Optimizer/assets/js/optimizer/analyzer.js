import { analyzeWebsite, isSupported } from '@stellarwp/perf-analyzer-client';
import { OPTIMIZE_ROUTE } from './constants';
import apiFetch from '@wordpress/api-fetch';

/**
 * Analyze a specific website URL
 *
 * @param {string} url - The URL to analyze.
 * @param {number} postId - The post ID for reference.
 *
 * @returns {Promise<*>}
 */
export async function analyzeSite(url, postId) {
	console.log(`🎯 Analyzing post ${postId}: ${url}`);

	if (!isSupported()) {
		console.log('❌ Performance analysis not supported in this browser');
		throw new Error('Performance analysis not supported in this browser');
	}

	try {
		const results = await analyzeWebsite(url);

		const res = await apiFetch({
			path: OPTIMIZE_ROUTE,
			method: 'POST',
			data: {
				post_id: postId,
				results,
			},
		});

		console.log(res);
		console.log(`✅ Analysis complete for post ID ${postId}:`, results);

		return res;
	} catch (error) {
		console.error('❌ Analysis failed:', error);
		throw error;
	}
}

/**
 * Delete a post's optimization data.
 *
 * @param {number} postId The post ID to delete the optimization data for.
 *
 * @returns {Promise<*>}
 */
export async function removeOptimization(postId) {
	try {
		return await apiFetch({
			path: OPTIMIZE_ROUTE,
			method: 'DELETE',
			data: {
				post_id: postId,
			},
		});
	} catch (error) {
		console.error(`❌ Failed to remove optimization for post ID ${postId}:`, error);
		throw error;
	}
}
