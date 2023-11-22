import { API_ROUTE_GET_KEYWORDS } from "../constants";
import apiFetch from "@wordpress/api-fetch";
import { SafeParseJSON } from "@kadence/helpers";
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
				path: API_ROUTE_GET_KEYWORDS,
				method: "POST",
				data: {
					name,
					entity_type: entity_type?.toLowerCase(),
					industry,
					location,
					description,
					count: 10,
				},
			});
			const responseData = SafeParseJSON(response, false);
			return Promise.resolve(responseData?.keywords);
		} catch (error) {
			const message = error?.message ? error.message : error;
			return Promise.reject(message);
		}
	}

	return {
		getSuggestedKeywords,
	};
}
