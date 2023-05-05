/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { SafeParseJSON } from '@kadence/helpers';
const API_ROUTE_GET_IMAGES = '/kb-design-library/v1/get_images';

export function getAsyncData() {
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
			console.log(`ERROR: ${ error }`);
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
			console.log(`ERROR: ${ error }`);
			setLoading(false);
			setError(true);

			return {};
		}
	}

	/**
	 * Get photo collection by industry
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getCollectionByIndustry(userData) {
		if ( ! userData?.photoLibrary ) {
			return [];
		}
		const industries = Array.isArray(userData.photoLibrary) ? userData?.photoLibrary : [ userData.photoLibrary ];
		try {
			const response = await apiFetch( {
				path: addQueryArgs( API_ROUTE_GET_IMAGES, {
					industries: industries,
					api_key: ( kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '' ),
				} ),
			} );
			console.log( response );
			const responseData = SafeParseJSON( response, false );
			console.log( responseData );
			if ( responseData ) {
				return responseData;
			}
			return [];
		} catch (error) {
			console.log(`ERROR: ${ error }`);
		}
	}

	return {
		loading,
		error,
		saveAiWizardData,
		getAiWizardData,
		getCollectionByIndustry
	}
}

