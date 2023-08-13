const API_URL = "https://content.startertemplatecloud.com/wp-json/prophecy/v1/";

export function getAIContentHelper() {
	async function getAIContent( prompt ) {
		try {
			// Get site domain from the url.
			const url = new URL(window.location.href);
			const domain = url.hostname;
			const token = {
				domain: domain,
				key: kadence_blocks_params?.proData?.api_key
					? kadence_blocks_params.proData.api_key
					: "",
			};
			const response = await fetch(
				`${API_URL}proxy/generate/content`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Prophecy-Token": btoa(JSON.stringify(token)),
					},
					body: JSON.stringify({
						prompt: prompt,
						stream: true,
					}),
				}
			);
			if (!(response?.status === 200)) {
				const message = response?.message ? response.message : response;
				return Promise.reject(message);
			}
			return response.body;
		} catch (error) {
			const message = error?.message ? error.message : error;
			return Promise.reject(message);
		}
	}
	async function getAITransform( content, type, prompt = '' ) {
		try {
			// Get site domain from the url.
			const url = new URL(window.location.href);
			const domain = url.hostname;
			const token = {
				domain: domain,
				key: kadence_blocks_params?.proData?.api_key
					? kadence_blocks_params.proData.api_key
					: "",
			};
			const response = await fetch(
				`${API_URL}proxy/transform/${type}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Prophecy-Token": btoa(JSON.stringify(token)),
					},
					body: JSON.stringify({
						text: content,
						stream: true,
					}),
				}
			);
			if (!(response?.status === 200)) {
				const message = response?.message ? response.message : response;
				return Promise.reject(message);
			}
			return response.body;
		} catch (error) {
			const message = error?.message ? error.message : error;
			return Promise.reject(message);
		}
	}
	async function getAIEdit( content, prompt ) {
		try {
			// Get site domain from the url.
			const url = new URL(window.location.href);
			const domain = url.hostname;
			const token = {
				domain: domain,
				key: kadence_blocks_params?.proData?.api_key
					? kadence_blocks_params.proData.api_key
					: "",
			};
			const response = await fetch(
				`${API_URL}proxy/transform/edit`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Prophecy-Token": btoa(JSON.stringify(token)),
					},
					body: JSON.stringify({
						text: content,
						prompt: prompt,
						stream: true,
					}),
				}
			);
			if (!(response?.status === 200)) {
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
		getAIContent,
		getAITransform,
		getAIEdit,
	};
}