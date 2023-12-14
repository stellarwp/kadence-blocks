const API_ROUTE_GET_IMAGES = '/kb-design-library/v1/get_images';
const COLLECTION_SESSION_KEY = 'kadence_ai_current_collection';

import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { SafeParseJSON } from '@kadence/helpers';

export function getCollection() {
	/**
	 * Save collections data to session.
	 *
	 * @param {array} collection
	 *
	 * @return {void}
	 */
	function saveCollection(collection) {
		if (collection) {
			sessionStorage.setItem(COLLECTION_SESSION_KEY, JSON.stringify(collection));
		}
	}

	/**
	 * Sets collections data in session storage if not already.
	 *
	 * @return {void}
	 */
	function setCollection() {
		if (! sessionStorage.getItem(COLLECTION_SESSION_KEY)) {
			getCollection();
		}
	}

	/**
	 * Get collections data from endpoint or session.
	 *
	 * @return {Promise<array>} Promise returns array
	 */
	async function getCollection( industry ) {
		if (sessionStorage.getItem(COLLECTION_SESSION_KEY)) {
			return JSON.parse(sessionStorage.getItem(COLLECTION_SESSION_KEY));
		}

		return getCollectionByIndustry(industry);
	}

	/**
	 * Get photo collection by industry
	 *
	 * @param {(string|string[])} industry
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getCollectionByIndustry(industry) {
		const industries = Array.isArray(industry) ? industry : [ industry ];
		try {
			const response = await apiFetch( {
				path: addQueryArgs( API_ROUTE_GET_IMAGES, {
					industries: industries,
				} ),
			} );
			const responseData = SafeParseJSON( response, false );
			if ( responseData ) {
				return responseData;
			}
			return [];
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${ message }`);
		}
	}
	return {
		setCollection,
		getCollection,
		getCollectionByIndustry
	}
}

