import { __, sprintf } from '@wordpress/i18n';
import { analyzeSite, removeOptimization } from './analyzer.js';
import { UI_STATES } from './constants.js';
import { createNotice, NOTICE_TYPES } from '@kadence-bundled/admin-notices';

/**
 * Update the optimizer link state
 *
 * @param {HTMLElement} link - The link element to update
 * @param {boolean} isOptimized - Whether the post is optimized
 */
function updateLinkState(link, isOptimized) {
	const newState = isOptimized ? UI_STATES.REMOVE : UI_STATES.OPTIMIZE;

	// Update classes.
	link.className =
		link.className.replace(UI_STATES.OPTIMIZE.class, '').replace(UI_STATES.REMOVE.class, '').trim() +
		' ' +
		newState.class;

	// Update text content.
	link.textContent = newState.text;
}

/**
 * Initialize the optimizer functionality
 */
export function initOptimizer() {
	// Add click event listeners to all optimize links
	document.addEventListener('click', async function (event) {
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

			console.log('🚀 Starting optimization...', { postId, postUrl });
			console.log(
				'%c' + 'Warnings are expected!',
				'color: #edd144; -webkit-text-stroke: 0.5px black; font-size: 28px; font-weight: bold;'
			);

			try {
				const response = await analyzeSite(postUrl, postId, nonce);
				console.log(response);

				// Update link state to show "Remove Optimization".
				updateLinkState(event.target, true);

				createNotice(
					sprintf(
						// translators: %d: The post ID
						__('Optimization data successfully saved for Post ID: %d.', 'kadence-blocks'),
						postId
					)
				);
			} catch (error) {
				console.error('❌ Optimization failed:', error);

				createNotice(__('Optimization failed', 'kadence-blocks'), NOTICE_TYPES.ERROR, true, error);
			}
		} else if (event.target.classList.contains('kb-remove-post-optimization')) {
			event.preventDefault();

			const postId = parseInt(event.target.dataset.postId, 10);

			console.log('Removing optimization...', { postId });

			try {
				const response = await removeOptimization(postId);
				console.log(response);

				// Update link state to show "Run Optimizer".
				updateLinkState(event.target, false);

				createNotice(
					sprintf(
						// translators: %d: The post ID
						__('Optimization data successfully deleted for Post ID: %d.', 'kadence-blocks'),
						postId
					)
				);
			} catch (error) {
				console.error('❌ Failed to remove optimization:', error);

				createNotice(
					__('Failed to remove optimization data', 'kadence-blocks'),
					NOTICE_TYPES.ERROR,
					true,
					error
				);
			}
		}
	});
}
