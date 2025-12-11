import { __, sprintf } from '@wordpress/i18n';
import { addAction } from '@wordpress/hooks';
import { dispatch, select } from '@wordpress/data';
import { getPathAndQueryString } from '@wordpress/url';
import { analyzeSite, removeOptimization } from './analyzer.js';
import { OPTIMIZER_DATA, UI_STATES } from './constants.js';
import { createNotice, NOTICE_TYPES } from '@kadence-bundled/admin-notices';
import { POST_SAVED_HOOK } from '../../../../../../src/extension/post-saved-event/constants';
import { updateLinkState, getPostTitle, animateDots } from './ui-manager.js';
import { META_KEY, STATUS_EXCLUDED } from '../meta/constants';

/**
 * Handle the post-save hook for automatic optimization.
 */
export function setupPostSaveHandler() {
	addAction(POST_SAVED_HOOK, 'kadence', async ({ post, permalink, suffix = '' }) => {
		console.log('Post Saved', post, permalink, suffix);

		if (!permalink) {
			console.error('❌ No URL found for optimization. This is likely not a public post.');
			return;
		}

		const postId = post.id;
		const postUrl = permalink;
		const postPath = getPathAndQueryString(permalink);
		const nonce = OPTIMIZER_DATA.token;

		// This is a public post without a pretty rewrite rule.
		if (postPath.includes('?')) {
			console.error('❌ Unable to optimize. This is a public post, but has no rewrite rules.');
			return;
		}

		const meta = select('core/editor').getEditedPostAttribute('meta');

		if (meta !== undefined && meta[META_KEY] === STATUS_EXCLUDED) {
			console.warn(`⚠️ Post ID ${postId} was excluded from optimization via post meta.`);
			return;
		}

		console.log('🚀 Starting optimization...', { postId, postUrl, postPath });
		console.log(
			'%c' + 'Warnings are expected!',
			'color: #edd144; -webkit-text-stroke: 0.5px black; font-size: 28px; font-weight: bold;'
		);

		try {
			const response = await analyzeSite(postUrl, postId, postPath, nonce);

			console.log(response);

			dispatch('core/notices').createSuccessNotice(__('Kadence Optimization Data Updated.', 'kadence-blocks'), {
				type: 'snackbar',
			});

			// Force Gutenberg to reload the post + meta from the server so the View Optimized Page component can display in real-time.
			dispatch('core').invalidateResolution('getEntityRecord', ['postType', post.type, post.id]);
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
}

/**
 * Handle optimize link click from the post list table.
 *
 * @param {Event} event - The click event
 */
export async function handleOptimizeClick(event) {
	event.preventDefault();

	const postUrl = event.target.dataset.postUrl;
	const postPath = event.target.dataset.postPath;

	if (!postUrl) {
		console.error('❌ No URL found for optimization');
		return;
	}

	if (!postPath) {
		console.error('❌ No Post Path found for optimization');
		return;
	}

	const postId = parseInt(event.target.dataset.postId, 10);
	const nonce = event.target.dataset.nonce;

	console.log('🚀 Starting optimization...', { postId, postUrl });
	console.log(
		'%c' + 'Warnings are expected!',
		'color: #edd144; -webkit-text-stroke: 0.5px black; font-size: 28px; font-weight: bold;'
	);

	// Show "Optimizing..." state with animated dots.
	updateLinkState(event.target, UI_STATES.OPTIMIZING);

	const animationInterval = animateDots(event.target);
	const postTitle = getPostTitle(event.target, postId);

	try {
		const response = await analyzeSite(postUrl, postId, postPath, nonce);
		console.log(response);

		// Clear the animation interval.
		clearInterval(animationInterval);

		// Update link state to show "Remove Optimization".
		updateLinkState(event.target, UI_STATES.REMOVE);

		createNotice(
			sprintf(
				// translators: %s: The post title or post ID.
				__('🎉 "%s" is now Optimized!', 'kadence-blocks'),
				postTitle
			)
		);
	} catch (error) {
		console.error('❌ Optimization failed:', error);

		// Clear the animation interval.
		clearInterval(animationInterval);

		// Reset to original state.
		updateLinkState(event.target, UI_STATES.OPTIMIZE);

		createNotice(
			// translators: %s: The post title or post ID.
			sprintf(__('Optimization failed for "%s"', 'kadence-blocks'), postTitle),
			NOTICE_TYPES.ERROR,
			true,
			error
		);
	}
}

/**
 * Handle remove optimization link click in the post list table.
 *
 * @param {Event} event - The click event
 */
export async function handleRemoveOptimizationClick(event) {
	event.preventDefault();

	const postId = parseInt(event.target.dataset.postId, 10);
	const postPath = event.target.dataset.postPath;

	console.log('Removing optimization...', { postId, postPath });

	try {
		const response = await removeOptimization(postId, postPath);
		console.log(response);

		// Update link state to show "Run Optimizer".
		updateLinkState(event.target, UI_STATES.OPTIMIZE);

		const postTitle = getPostTitle(event.target, postId);

		createNotice(
			sprintf(
				// translators: %s: The post title or post ID.
				__('Optimization data removed for "%s".', 'kadence-blocks'),
				postTitle
			)
		);
	} catch (error) {
		console.error('❌ Failed to remove optimization:', error);

		createNotice(__('An error occurred', 'kadence-blocks'), NOTICE_TYPES.ERROR, true, error);
	}
}
