import { API_ROUTE_PROPHECY, API_PROPHECY_TOKEN } from "../constants";

export function keywordsHelper() {
	/**
	 * Get mission statement value from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getSuggestedKeywords({
		name,
		entity_type,
		industry,
		location,
		description,
	}) {
		try {
			const response = await fetch(
				`${API_ROUTE_PROPHECY}/intake/suggest-keywords`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${API_PROPHECY_TOKEN}`,
					},
					body: JSON.stringify({
						name,
						entity_type: entity_type.toLowerCase(),
						industry,
						location,
						description,
						count: 10,
					}),
				}
			);

			const data = await response.json();
			const { keywords } = data;
			return Promise.resolve(keywords);
		} catch (error) {
			const message = error?.message ? error.message : error;
			return Promise.reject(message);
		}
	}

	return {
		getSuggestedKeywords,
	};
}
