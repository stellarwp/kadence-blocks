import { __ } from '@wordpress/i18n';

// Notice type constants
export const NOTICE_TYPES = {
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning',
	INFO: 'info',
};

/**
 * Create and show admin notices on legacy WordPress admin pages
 *
 * This function dynamically creates and displays WordPress-style admin notices
 * by injecting them into the DOM after the main heading element.
 *
 * @param {string} message - The message content to display in the notice
 * @param {string} [type=NOTICE_TYPES.SUCCESS] - The type of notice (success, error, warning, info)
 * @param {boolean} [isDismissible=true] - Whether the notice can be dismissed by the user
 * @param {Object} [error] - Optional error object with code, message, and data properties
 *
 * @throws {Error} Logs error to console if no suitable container is found
 *
 * @example
 * // Create a success notice
 * createNotice('Settings saved successfully!');
 *
 * @example
 * // Create a non-dismissible error notice
 * createNotice('Failed to save settings', NOTICE_TYPES.ERROR, false);
 *
 * @example
 * // Create an error notice with error object
 * createNotice('Failed to save settings', NOTICE_TYPES.ERROR, true, errorObj);
 */
export function createNotice(message, type = NOTICE_TYPES.SUCCESS, isDismissible = true, error = null) {
	const noticesContainer =
		document.querySelector('.wrap h1') || document.querySelector('.wrap h2') || document.querySelector('.wrap');

	if (!noticesContainer) {
		console.error('Could not find container for admin notice');
		return;
	}

	let fullMessage = message;

	if (error && typeof error === 'object') {
		// Extract error details
		const errorMessage = error.message || '';
		const errorCode = error.code || '';

		if (errorMessage) {
			fullMessage = `${message}: ${errorMessage}`;
		}

		// Include error code
		if (errorCode) {
			fullMessage = `${fullMessage}<br />Error Code: <code>${errorCode}</code>`;
		}
	}

	const notice = document.createElement('div');
	notice.className = `notice notice-${type}${isDismissible ? ' is-dismissible' : ''}`;
	notice.innerHTML = `
		<p>${fullMessage}</p>
		${
			isDismissible
				? `<button type="button" class="notice-dismiss"><span class="screen-reader-text">${__(
						'Dismiss this notice.'
				  )}</span></button>`
				: ''
		}
	`;

	// Insert after the first heading
	noticesContainer.insertAdjacentElement('afterend', notice);

	// Handle dismiss functionality
	if (isDismissible) {
		const dismissButton = notice.querySelector('.notice-dismiss');
		dismissButton?.addEventListener('click', () => {
			notice.remove();
		});
	}
}
