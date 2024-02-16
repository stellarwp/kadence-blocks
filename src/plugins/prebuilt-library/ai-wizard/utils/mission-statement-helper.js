import { API_URL } from "../constants";

export function missionStatementHelper() {
	async function getMissionStatement(missionStatement, lang) {
		try {
			// Get site domain from the url.
			const url = new URL(window.location.href);
			const domain = url.hostname;
			let key = window?.kadence_blocks_params?.proData?.api_key ? window.kadence_blocks_params.proData.api_key : '';
			if ( ! key ) {
				key = window?.kadenceHomeParams?.apiKey ? window.kadenceHomeParams.apiKey : '';
			}
			let site_name = window?.kadence_blocks_params?.site_name ? window.kadence_blocks_params.site_name : '';
			if ( ! site_name ) {
				site_name = window?.kadenceHomeParams?.site_name ? window.kadenceHomeParams.site_name : '';
			}
			let product_slug = window?.kadence_blocks_params?.pSlug ? window.kadence_blocks_params.pSlug : '';
			if ( ! product_slug ) {
				product_slug = window?.kadenceHomeParams?.pSlug ? window.kadenceHomeParams.pSlug : '';
			}
			let product_version = window?.kadence_blocks_params?.pVersion ? window.kadence_blocks_params.pVersion : '';
			if ( ! product_version ) {
				product_version = window?.kadenceHomeParams?.pVersion ? window.kadenceHomeParams.pVersion : '';
			}
			const token = {
				domain: domain,
				key: key,
				site_name: site_name,
				product_slug: product_slug,
				product_version: product_version,
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
						lang: lang ? lang : "en-US",
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
