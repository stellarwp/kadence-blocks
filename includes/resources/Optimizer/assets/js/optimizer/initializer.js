import { __, sprintf } from '@wordpress/i18n';
import { addAction } from '@wordpress/hooks';
import { dispatch } from '@wordpress/data';
import { analyzeSite, removeOptimization } from './analyzer.js';
import { OPTIMIZER_DATA, UI_STATES } from './constants.js';
import { createNotice, NOTICE_TYPES } from '@kadence-bundled/admin-notices';
import { POST_SAVED_HOOK } from '../../../../../../src/extension/post-saved-event/constants';

/**
 * Update the optimizer link state
 *
 * @param {HTMLElement} link - The link element to update
 * @param {{class: string, text: string}} state - The state to set (OPTIMIZE, REMOVE, or OPTIMIZING)
 */
function updateLinkState(link, state) {
	// Remove all state classes
	link.className = link.className
		.replace(UI_STATES.OPTIMIZE.class, '')
		.replace(UI_STATES.REMOVE.class, '')
		.replace(UI_STATES.OPTIMIZING.class, '')
		.trim();

	// Add the new state class
	link.className += ' ' + state.class;

	// Update text content
	link.textContent = state.text;
}

/**
 * Get the post title from the row containing the given element.
 *
 * @param {HTMLElement} element - The element to find the row for.
 * @param {number} postId - The post ID as fallback.
 * @returns {string} The post title or fallback text.
 */
function getPostTitle(element, postId) {
	const row = element.closest('tr');
	const rowTitle = row ? row.querySelector('.row-title')?.textContent?.trim() : null;

	return rowTitle || `Post ID: ${postId}`;
}

/**
 * Animate the dots in the "Optimizing..." text
 *
 * @param {HTMLElement} link - The link element to animate
 */
function animateOptimizingDots(link) {
	let dots = 0;
	const baseText = 'Optimizing';

	return setInterval(() => {
		dots = (dots + 1) % 4;
		const dotsText = '.'.repeat(dots);
		link.textContent = baseText + dotsText;
	}, 500);
}

/**
 * Initialize the optimizer functionality
 */
export function initOptimizer() {
	// @TODO: move this into its own file.
	addAction(POST_SAVED_HOOK, 'kadence', async ({ post, permalink }) => {
		console.log('Post Saved', post, permalink);

		if (!permalink) {
			console.error('❌ No URL found for optimization. This is likely not a public post.');
			return;
		}

		const postId = post.id;
		const postUrl = permalink;
		const nonce = OPTIMIZER_DATA.token;

		console.log('🚀 Starting optimization...', { postId, postUrl });
		console.log(
			'%c' + 'Warnings are expected!',
			'color: #edd144; -webkit-text-stroke: 0.5px black; font-size: 28px; font-weight: bold;'
		);

		try {
			const response = await analyzeSite(postUrl, postId, nonce);

			console.log(response);

			dispatch('core/notices').createSuccessNotice(__('Kadence Optimization Data Updated.', 'kadence-blocks'), {
				type: 'snackbar',
			});
		} catch (error) {
			console.error('❌ Optimization failed:', error);

			dispatch('core/notices').createErrorNotice(
				__('Failed to update Kadence Optimization Data.', 'kadence-blocks'),
				{
					type: 'snackbar',
				}
			);
		}
	});

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

			const postTitle = getPostTitle(event.target, postId);

			// Show "Optimizing..." state with animated dots
			updateLinkState(event.target, UI_STATES.OPTIMIZING);

			const animationInterval = animateOptimizingDots(event.target);

			try {
				const response = await analyzeSite(postUrl, postId, nonce);
				console.log(response);

				// Clear the animation interval
				clearInterval(animationInterval);

				// Update link state to show "Remove Optimization".
				updateLinkState(event.target, UI_STATES.REMOVE);

				createNotice(
					sprintf(
						// translators: %s: The post title or post ID
						__('🎉 "%s" is now Optimized!', 'kadence-blocks'),
						postTitle
					)
				);
			} catch (error) {
				console.error('❌ Optimization failed:', error);

				// Clear the animation interval
				clearInterval(animationInterval);

				// Reset to original state
				updateLinkState(event.target, UI_STATES.OPTIMIZE);

				createNotice(
					// translators: %s: The post title or post ID
					sprintf(__('Optimization failed for "%s"', 'kadence-blocks'), postTitle),
					NOTICE_TYPES.ERROR,
					true,
					error
				);
			}
		} else if (event.target.classList.contains('kb-remove-post-optimization')) {
			event.preventDefault();

			const postId = parseInt(event.target.dataset.postId, 10);
			console.log('Removing optimization...', { postId });

			try {
				const response = await removeOptimization(postId);
				console.log(response);

				// Update link state to show "Run Optimizer".
				updateLinkState(event.target, UI_STATES.OPTIMIZE);

				const postTitle = getPostTitle(event.target, postId);

				createNotice(
					sprintf(
						// translators: %s: The post title or post ID
						__('Optimization data removed for "%s".', 'kadence-blocks'),
						postTitle
					)
				);
			} catch (error) {
				console.error('❌ Failed to remove optimization:', error);

				createNotice(__('An error occurred', 'kadence-blocks'), NOTICE_TYPES.ERROR, true, error);
			}
		}
	});
}
