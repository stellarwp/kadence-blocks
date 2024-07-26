import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { SafeParseJSON } from '@kadence/helpers';

import { VERTICALS_SESSION_KEY, API_MAX_ATTEMPTS, API_ROUTE_GET_VERTICALS } from '../constants';

export function verticalsHelper() {
	const [loading, setLoading] = useState(false);
	const [preMade, setPreMade] = useState();

	useEffect(() => {
		setLoading(true);
		const cachedData = sessionStorage.getItem(VERTICALS_SESSION_KEY);
		if (!cachedData) {
			getVerticalsFromProphecy();
		} else {
			// setPexelLinks(SafeParseJSON(cachedData, false));
			setLoading(false);
		}
	}, []);

	/**
	 * Get verticals data from Prophecy endpoint.
	 *
	 * @return {void}
	 */
	async function getVerticalsFromProphecy() {
		// Attempt to query verticals 3 times.
		for (let tries = 0; tries < API_MAX_ATTEMPTS; tries++) {
			try {
				const response = await apiFetch({
					path: API_ROUTE_GET_VERTICALS,
				});
				const responseData = SafeParseJSON(response, false);

				if (responseData && responseData?.data) {
					const verticals = formatVerticals(responseData.data);
					setPreMade(verticals);
					sessionStorage.setItem(VERTICALS_SESSION_KEY, JSON.stringify(verticals));
					break;
				}
			} catch (error) {
				const message = error?.message ? error.message : error;
				console.log(`ERROR: ${message}`);
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
		if (!data || !Array.isArray(data)) {
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

	return {
		loading,
		preMadeVerticals: preMade,
	};
}
