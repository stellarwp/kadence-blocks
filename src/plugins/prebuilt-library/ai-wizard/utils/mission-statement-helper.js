import { API_URL } from "../constants";

export function missionStatementHelper() {
	async function getMissionStatement(missionStatement) {
		try {
			// Get site domain from the url.
			const url = new URL(window.location.href);
			const domain = url.hostname;
			let key = window?.kadence_blocks_params?.proData?.api_key ? window.kadence_blocks_params.proData.api_key : '';
			if ( ! key ) {
				key = window?.kadenceHomeParams?.apiKey ? window.kadenceHomeParams.apiKey : '';
			}
			const token = {
				domain: domain,
				key: key,
			};
			const response = await fetch(
				`${API_URL}proxy/intake/improve-mission-statement`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Prophecy-Token": btoa(JSON.stringify(token)),
					},
					body: JSON.stringify({
						text: missionStatement,
						stream: true,
					}),
				}
			);
			if (!(response?.status === 200)) {
				if ( ( response?.status === 424 ) ) {
					return Promise.reject('license');
				}
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
