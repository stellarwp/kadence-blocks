import { analyzeWebsite, isSupported } from '@stellarwp/perf-analyzer-client';

/**
 * Analyze a specific website URL
 *
 * @param {string} url - The URL to analyze.
 * @param {number} postId - The post ID for reference.
 */
export function analyzeSite(url, postId) {
	console.log(`🎯 Analyzing post ${postId}: ${url}`);

	if (!isSupported()) {
		console.log('❌ Performance analysis not supported in this browser');
		return;
	}

	analyzeWebsite(url)
		.then((results) => {
			// TODO: post this data our new rest endpoint for storage.
			console.log(`✅ Analysis complete for post ID ${postId}:`, results);
		})
		.catch((error) => {
			console.error('❌ Analysis failed:', error);
		});
}
