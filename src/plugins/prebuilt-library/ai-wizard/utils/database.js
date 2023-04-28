/**
 * WordPress dependencies
 */
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

/**
 * Save wizard data to Wordpress options table.
 *
 * @return {Promise<boolean>}
 */
export async function saveAiWizardData(data) {
	try {
		const response = await apiFetch({
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_prophecy: JSON.stringify(data) }
		});

		if (response) {
			return true;
		}

	} catch (error) {
		console.log(error);
		return false;
	}
}

/**
 * Get wizard data from database.
 *
 * @return {Promise<object>}
 */
export async function getAiWizardData() {
	try {
		const response = await apiFetch({
			path: '/wp/v2/settings',
			method: 'GET',
		});

		if (response && response.kadence_blocks_prophecy) {
			return response.kadence_blocks_prophecy;
		}
	} catch (error) {
		console.log(error);
		return {};
	}
}

