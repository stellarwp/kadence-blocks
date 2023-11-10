/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

export function useDatabase() {
	const [ loading, setLoading ] = useState(false);
	const [ error, setError ] = useState(false);

	/**
	 * Save wizard data to Wordpress options table.
	 *
	 * @return {Promise<boolean>}
	 */
	async function saveAiWizardData(data) {
		setLoading(true);
		setError(false);

		try {
			const response = await apiFetch({
				path: '/wp/v2/settings',
				method: 'POST',
				data: { kadence_blocks_prophecy: JSON.stringify(data) }
			});

			if (response) {
				setLoading(false);

				return true;
			}
		} catch (error) {
			const message = error?.message ? error.message : error;

			console.log(`ERROR: ${ message }`);

			setLoading(false);
			setError(true);

			return false;
		}
	}

	/**
	 * Get wizard data from database.
	 *
	 * @return {Promise<object>}
	 */
	async function getAiWizardData() {
		setLoading(true);
		setError(false);

		try {
			const response = await apiFetch({
				path: '/wp/v2/settings',
				method: 'GET',
			});

			if (response) {
				setLoading(false);

				if (response?.kadence_blocks_prophecy) {
					return response.kadence_blocks_prophecy;
				}
			}
		} catch (error) {
			const message = error?.message ? error.message : error;

			console.log(`ERROR: ${ message }`);

			setLoading(false);
			setError(true);

			return {};
		}
	}

	return {
		loading,
		error,
		saveAiWizardData,
		getAiWizardData
	}
}

