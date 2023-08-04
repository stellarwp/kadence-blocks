import { API_ROUTE_IMPROVE_MISSION_STATEMENT } from "../constants";
import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";

export function missionStatementHelper() {
	async function getMissionStatement( missionStatement ) {
		try {
			const response = await apiFetch({
				path: addQueryArgs(API_ROUTE_IMPROVE_MISSION_STATEMENT, {
					api_key: kadence_blocks_params?.proData?.api_key
						? kadence_blocks_params.proData.api_key
						: "",
				}),
				method: 'POST',
				data: {
					content: missionStatement,
				},
			});
			console.log(response);
			if ( ! ( response?.response?.code === 200 ) ) {
				const message = response?.message ? response.message : response;
				return Promise.reject(message);
			}
			return response.body;
		} catch (error) {
			const message = error?.message ? error.message : error;
			return Promise.reject(message);
		}
	}

	return {
		getMissionStatement,
	};
}
