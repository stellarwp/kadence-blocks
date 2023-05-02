import {
	PROPHECY_ROUTE_GET_COLLECTIONS,
	COLLECTIONS_SESSION_KEY,
	COLLECTION_REQUEST_BODY
} from '../constants';

export function collectionsHelper() {
	/**
	 * Get collections data from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getCollectionsFromProphecy() {
		try {
			let collections = [];

			const response = await fetch(PROPHECY_ROUTE_GET_COLLECTIONS, {
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				}
			});

			if (response.ok) {
				const responseData = await response.json();

				if (responseData?.data?.collections) {
					collections = responseData.data.collections;

					// Save collections object to session storage.
					saveCollections(collections);
				}

				return collections;
			}
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
			const response = await fetch(PROPHECY_ROUTE_GET_COLLECTIONS, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json;charset=utf-8'
				},
				body: JSON.stringify({
					industries,
					...COLLECTION_REQUEST_BODY
				})
			});

			if (response.ok) {
				const responseData = await response.json();

				return responseData;
			}
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

