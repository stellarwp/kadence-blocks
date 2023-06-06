import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { SafeParseJSON } from '@kadence/helpers';

import {
	VERTICALS_SESSION_KEY,
	API_MAX_ATTEMPTS,
	API_ROUTE_GET_VERTICALS
} from '../constants';

export function verticalsHelper() {
	const [ loading, setLoading ] = useState(false);

	/**
	 * Get verticals data from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getVerticalsFromProphecy() {
		let verticals = {};

		setLoading(true);

		// Attempt to query verticals 3 times.
		for (let tries = 0; tries < API_MAX_ATTEMPTS; tries++) {
			try {
				const response = await apiFetch({
					path: API_ROUTE_GET_VERTICALS
				});
				const responseData = SafeParseJSON(response, false);

				setLoading(false);

				if (responseData && responseData?.data) {
					verticals = formatVerticals(responseData.data);
					// Save verticals object to session storage.
					saveVerticalsToSession(verticals);

					return verticals;
				}
			} catch (error) {
				const message = error?.message ? error.message : error;
				console.log(`ERROR: ${message}`);

				setLoading(false);
			}
		}

		setLoading(false);
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
	 */
	function verticalsSessionHasData() {
		if (! sessionStorage.getItem(VERTICALS_SESSION_KEY)) {
			return false;
		}

		try {
			const verticals = SafeParseJSON(sessionStorage.getItem(VERTICALS_SESSION_KEY), false);

			if (! verticals || Object.keys(verticals).length === 0) {
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
			return SafeParseJSON(sessionStorage.getItem(VERTICALS_SESSION_KEY));
		}

		return getVerticalsFromProphecy();
	}

	return {
		loading,
		setVerticals,
		getVerticals
	}
}

