const API_URL = "https://content.startertemplatecloud.com/wp-json/prophecy/v1/";
import { addQueryArgs } from '@wordpress/url';
import apiFetch from '@wordpress/api-fetch';

export function getAIContentHelper() {
	/**
	 * Get remaining credits.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getAvailableCredits() {
		try {
			const response = await apiFetch( {
				path: '/kb-design-library/v1/get_remaining_credits',
			} );
			return response;
		} catch (error) {
			console.log(`ERROR: ${ error }`);
			return 'error';
		}
	}
	async function getAIContent( prompt ) {
		try {
			// Get site domain from the url.
			const url = new URL(window.location.href);
			const domain = url.hostname;
			const token = {
				domain: domain,
				key: window?.kadence_blocks_params?.proData?.api_key
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
				if ( ( response?.status === 423 ) ) {
					return Promise.reject('credits');
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
	async function getAITransform( content, type, prompt = '' ) {
		try {
			// Get site domain from the url.
			const url = new URL(window.location.href);
			const domain = url.hostname;
			const token = {
				domain: domain,
				key: window?.kadence_blocks_params?.proData?.api_key
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
				if ( ( response?.status === 423 ) ) {
					return Promise.reject('credits');
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
	async function getAIEdit( content, prompt, type = 'edit') {
		try {
			// Get site domain from the url.
			const url = new URL(window.location.href);
			const domain = url.hostname;
			const token = {
				domain: domain,
				key: window?.kadence_blocks_params?.proData?.api_key
					? kadence_blocks_params.proData.api_key
					: "",
			};
			const body = {
				text: content,
				stream: true,
			};
			if ( type === 'tone' ) {
				body.tone = prompt;
			} else {
				body.prompt = prompt;
			}
			const response = await fetch(
				`${API_URL}proxy/transform/${type}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"X-Prophecy-Token": btoa(JSON.stringify(token)),
					},
					body: JSON.stringify(body),
				}
			);
			if (!(response?.status === 200)) {
				if ( ( response?.status === 423 ) ) {
					return Promise.reject('credits');
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
		getAIContent,
		getAITransform,
		getAIEdit,
		getAvailableCredits,
	};
}