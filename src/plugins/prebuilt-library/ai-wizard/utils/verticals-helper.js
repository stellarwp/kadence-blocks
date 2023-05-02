import {
	PROPHECY_ROUTE_GET_VERTICALS,
	VERTICALS_SESSION_KEY
} from '../constants';

export function verticalsHelper() {
	/**
	 * Get verticals data from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getVerticalsFromProphecy() {
		try {
			let verticals = [];

			const response = await fetch(PROPHECY_ROUTE_GET_VERTICALS, {
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			});

			if (response.ok) {
				const responseData = await response.json();

				if (responseData?.data) {
					// Create expected data structure.
					verticals = formatVerticals(responseData.data);

					// Save verticals object to session storage.
					saveVerticals(verticals);
				}

				return verticals;
			}
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

