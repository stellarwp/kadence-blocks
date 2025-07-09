import { analyzeWebsite, isSupported } from '@stellarwp/perf-analyzer-client';
import { OPTIMIZE_ROUTE } from './constants';
import apiFetch from '@wordpress/api-fetch';

/**
 * Analyze a specific website URL and collect optimization data.
 *
 * @param {string} url - The URL to analyze.
 * @param {number} postId - The post ID for reference.
 * @param {string} nonce - The nonce value.
 *
 * @returns {Promise<*>}
 */
export async function analyzeSite(url, postId, nonce) {
	console.log(`🎯 Analyzing post ${postId}: ${url}`);

	if (!isSupported()) {
		console.log('❌ Performance analysis not supported in this browser');
		throw new Error('Performance analysis not supported in this browser.');
	}

	try {
		const results = await analyzeWebsite(url, true, '[Kadence]', nonce);

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

		// Send a request to generate a hash of the optimized page and don't wait for the results.
		// Swallow network errors deliberately.
		void fetch(url + '?kadence_set_optimizer_hash=1', { credentials: 'omit', keepalive: true }).catch(() => {});
		// Send a request as a fake mobile device to generate the mobile hash.
		void fetch(url + '?kadence_set_optimizer_hash=1&kadence_is_mobile=1', {
			credentials: 'omit',
			keepalive: true,
		}).catch(() => {});

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
