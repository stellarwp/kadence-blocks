import { API_ROUTE_GET_KEYWORDS } from "../constants";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

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
			const response = await apiFetch({
				path: addQueryArgs(API_ROUTE_GET_KEYWORDS, {
					name,
					entity_type,
					industry,
					location,
					description,
					count: 10,
					api_key: kadence_blocks_params?.proData?.api_key
						? kadence_blocks_params.proData.api_key
						: "",
				}),
			});
			const responseData = SafeParseJSON(response, false);

			if (!(response?.response?.code === 200)) {
				const message = response?.message ? response.message : response;
				return Promise.reject(message);
			}

			return Promise.resolve(responseData);
		} catch (error) {
			console.log(error);
			const message = error?.message ? error.message : error;
			return Promise.reject(message);
		}
	}

	return {
		getSuggestedKeywords,
	};
}
