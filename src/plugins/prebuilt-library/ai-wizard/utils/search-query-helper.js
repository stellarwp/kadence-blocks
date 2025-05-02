import { API_ROUTE_GET_SEARCH_QUERY } from '../constants';
import apiFetch from '@wordpress/api-fetch';
import { SafeParseJSON } from '@kadence/helpers';
import { addQueryArgs } from '@wordpress/url';

export function searchQueryHelper() {
	/**
	 * Get mission statement value from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getImageSearchQuery({ name, entity_type, industry, location, description }) {
		try {
			const response = await apiFetch({
				path: addQueryArgs(API_ROUTE_GET_SEARCH_QUERY),
				method: 'POST',
				data: {
					name,
					entity_type: entity_type?.toLowerCase(),
					industry,
					location,
					description,
				},
			});
			const responseData = SafeParseJSON(response, false);
			return Promise.resolve(responseData);
		} catch (error) {
			const message = error?.message ? error.message : error;
			return Promise.reject(message);
		}
	}

	return {
		getImageSearchQuery,
	};
}
