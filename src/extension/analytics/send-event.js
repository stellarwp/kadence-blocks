import apiFetch from '@wordpress/api-fetch';

/**
 * Send Event to Backend.
 *
 * @param {string} event_label
 * @param {object} event_data
 *
 * @return {Promise<object>} Promise returns object
 */
export async function sendEvent(event_label, event_data) {
	try {
		return await apiFetch({
			path: '/kb-design-library/v1/handle_event',
			method: 'POST',
			data: {
				event_label: event_label,
				event_data: event_data ? event_data : {},
			},
		});
	} catch (error) {
		console.log(`ERROR: ${JSON.stringify(error)}`);
		return 'failed';
	}
}
