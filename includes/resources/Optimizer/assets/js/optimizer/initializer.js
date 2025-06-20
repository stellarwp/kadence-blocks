import { analyzeSite } from './analyzer.js';

/**
 * Initialize the optimizer functionality
 */
export function initOptimizer() {
	// Add click event listeners to all optimize links
	document.addEventListener('click', function (event) {
		// Check if the clicked element is an optimize link
		if (event.target.classList.contains('kb-optimize-post')) {
			event.preventDefault();

			const postId = parseInt(event.target.dataset.postId, 10);
			const postUrl = event.target.dataset.postUrl;
			const nonce = event.target.dataset.nonce;

			if (!postUrl) {
				console.error('❌ No URL found for optimization');
				return;
			}

			console.log('🚀 Starting optimization...', { postId, postUrl, nonce });
			console.log(
				'%c' + 'Warnings are expected!',
				'color: #edd144; -webkit-text-stroke: 0.5px black; font-size: 28px; font-weight: bold;'
			);
			analyzeSite(postUrl, postId);
		}
	});
}
