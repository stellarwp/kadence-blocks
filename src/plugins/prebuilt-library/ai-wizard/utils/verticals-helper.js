import {
	VERTICALS_SESSION_KEY,
	API_ROUTE_GET_VERTICALS
} from '../constants';

import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { SafeParseJSON } from '@kadence/helpers';

export function verticalsHelper() {
	/**
	 * Get verticals data from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getVerticalsFromProphecy() {
		try {
			let verticals = [];
			const response = await apiFetch( {
				path: addQueryArgs( API_ROUTE_GET_VERTICALS, {
					api_key: ( kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '' ),
				} ),
			} );
			const responseData = SafeParseJSON( response, false );
			if ( responseData?.data ) {
				verticals = formatVerticals(responseData.data);
				// Save verticals object to session storage.
				saveVerticals(verticals);
			}
			return verticals;
		} catch (error) {
			console.log(`Error: ${ error }`);
		}

	}

	/**
	 * Convert array-based data structure to hash table (object).
	 *
	 * @param {array} data
	 *
	 * @return {object}
	 */
	function formatVerticals(data) {
		if (! data || ! Array.isArray(data)) {
			return [];
		}

		const verticals = {};

		// Create a hash table of verticals.
		data.forEach((vertical) => {
			if (vertical.name !== 'Other') {
				verticals[vertical.name] = vertical.sub_verticals;
			}
		});

		return verticals;
	}

	/**
	 * Save verticals data to session.
	 *
	 * @param {object} verticals
	 *
	 * @return {void}
	 */
	function saveVerticals(verticals) {
		if (verticals) {
			sessionStorage.setItem(VERTICALS_SESSION_KEY, JSON.stringify(verticals));
		}
	}

	/**
	 * Sets verticals data in session storage if not already.
	 *
	 * @return {void}
	 */
	function setVerticals() {
		if (! sessionStorage.getItem(VERTICALS_SESSION_KEY)) {
			getVerticals();
		}
	}

	/**
	 * Get verticals data from endpoint or session.
	 *
	 * @return {Promise<object>}
	 */
	async function getVerticals() {
		if (sessionStorage.getItem(VERTICALS_SESSION_KEY)) {
			return JSON.parse(sessionStorage.getItem(VERTICALS_SESSION_KEY));
		}

		return getVerticalsFromProphecy();
	}

	return {
		setVerticals,
		getVerticals
	}
}

