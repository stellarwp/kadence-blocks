import { setupPostSaveHandler, handleOptimizeClick, handleRemoveOptimizationClick } from './event-handlers.js';

/**
 * Initialize the optimizer.
 */
export function initOptimizer() {
	// Set up the post-save handler for automatic optimization.
	setupPostSaveHandler();

	// Add click event listeners to all optimize links on the post list table.
	document.addEventListener('click', async function (event) {
		// Check if the clicked element is an optimize link.
		if (event.target.classList.contains('kb-optimize-post')) {
			await handleOptimizeClick(event);
		} else if (event.target.classList.contains('kb-remove-post-optimization')) {
			await handleRemoveOptimizationClick(event);
		}
	});
}
