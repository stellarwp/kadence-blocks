import {
	VERTICALS_SESSION_KEY,
	API_ROUTE_GET_VERTICALS
} from '../constants';

import apiFetch from '@wordpress/api-fetch';
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
			const response = await apiFetch({
				path: API_ROUTE_GET_VERTICALS
			});
			const responseData = SafeParseJSON( response, false );
			if ( responseData?.data ) {
				verticals = formatVerticals(responseData.data);
				// Save verticals object to session storage.
				saveVerticalsToSession(verticals);
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
	function saveVerticalsToSession(verticals) {
		if (verticals) {
			sessionStorage.setItem(VERTICALS_SESSION_KEY, JSON.stringify(verticals));
		}
	}

	/**
	 * Check session storage for existing data.
	 *
	 * @return {boolean}
	 *
	 */
	function verticalsSessionHasData() {
		if (! sessionStorage.getItem(VERTICALS_SESSION_KEY)) {
			return false;
		}

		try {
			const verticals = JSON.parse(sessionStorage.getItem(VERTICALS_SESSION_KEY));

			if (Object.keys(verticals).length === 0) {
				return false;
			}
		} catch (error) {
			return false;
		}

		return true;
	}

	/**
	 * Sets verticals data in session storage if not already.
	 *
	 * @return {void}
	 */
	function setVerticals() {
		if (! verticalsSessionHasData()) {
			getVerticals();
		}
	}

	/**
	 * Get verticals data from endpoint or session.
	 *
	 * @return {Promise<object>}
	 */
	async function getVerticals() {
		if (verticalsSessionHasData()) {
			return JSON.parse(sessionStorage.getItem(VERTICALS_SESSION_KEY));
		}

		return getVerticalsFromProphecy();
	}

	return {
		setVerticals,
		getVerticals
	}
}

