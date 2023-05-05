import {
	API_ROUTE_GET_IMAGES,
	COLLECTIONS_SESSION_KEY,
	COLLECTION_REQUEST_IMAGE_TYPE,
	API_ROUTE_GET_COLLECTIONS,
	COLLECTION_REQUEST_IMAGE_SIZES,
} from '../constants';

import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { SafeParseJSON } from '@kadence/helpers';

export function collectionsHelper() {
	/**
	 * Get collections data from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getCollectionsFromProphecy() {
		try {
			let collections = [];
			const response = await apiFetch( {
				path: addQueryArgs( API_ROUTE_GET_COLLECTIONS, {
					api_key: ( kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '' ),
				} ),
			} );
			const responseData = SafeParseJSON( response, false );
			if ( responseData?.data?.collections ) {
				collections = responseData.data.collections;
				// Save collections object to session storage.
				saveCollections(collections);
			}
			return collections;
		} catch (error) {
			console.log(`Error: ${ error }`);
		}
	}

	/**
	 * Save collections data to session.
	 *
	 * @param {array} collections
	 *
	 * @return {void}
	 */
	function saveCollections(collections) {
		if (collections) {
			sessionStorage.setItem(COLLECTIONS_SESSION_KEY, JSON.stringify(collections));
		}
	}

	/**
	 * Sets collections data in session storage if not already.
	 *
	 * @return {void}
	 */
	function setCollections() {
		if (! sessionStorage.getItem(COLLECTIONS_SESSION_KEY)) {
			getCollections();
		}
	}

	/**
	 * Get collections data from endpoint or session.
	 *
	 * @return {Promise<array>} Promise returns array
	 */
	async function getCollections() {
		if (sessionStorage.getItem(COLLECTIONS_SESSION_KEY)) {
			return JSON.parse(sessionStorage.getItem(COLLECTIONS_SESSION_KEY));
		}

		return getCollectionsFromProphecy();
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
					api_key: ( kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '' ),
					image_type: COLLECTION_REQUEST_IMAGE_TYPE,
					image_sizes: COLLECTION_REQUEST_IMAGE_SIZES,
				} ),
			} );
			const responseData = SafeParseJSON( response, false );
			if ( responseData ) {
				return responseData;
			}
			return [];
		} catch (error) {
			console.log(`ERROR: ${ error }`);
		}
	}

	/**
	 * Get photo collection link by industry
	 *
	 * @param {string} industry
	 *
	 * @return {Promise<string>} Promise returns a string
	 */
	async function getCollectionLinkByIndustry(industry) {
		if (! industry) {
			return '';
		}

		const collections = await getCollections();

		if (! collections) {
			return '';
		}

		const matches = collections.filter((collection) => {
			return collection.collection_industries.includes(industry) && collection.collection_slug.includes('a-roll')
		})

		return matches?.[0]?.collection_url ? matches[0].collection_url : '';
	}

	return {
		setCollections,
		getCollections,
		getCollectionByIndustry,
		getCollectionLinkByIndustry
	}
}

