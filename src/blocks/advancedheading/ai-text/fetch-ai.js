import apiFetch from '@wordpress/api-fetch';
import { getAiProxyUrl, getAiProxyHeaders } from '../../../plugins/prebuilt-library/data-fetch/ai-proxy';

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
			const response = await apiFetch({
				path: '/kb-design-library/v1/get_remaining_credits',
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'error';
		}
	}
	async function getAIContent(prompt) {
		try {
			const lang = window?.kadence_blocks_params?.aiLang ? window.kadence_blocks_params.aiLang : 'en-US';
			const response = await fetch(getAiProxyUrl('generate-content'), {
				method: 'POST',
				headers: getAiProxyHeaders(),
				body: JSON.stringify({
					prompt,
					lang,
				}),
			});
			if (!(response?.status === 200)) {
				if (response?.status === 423) {
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
	async function getAITransform(content, type, prompt = '') {
		try {
			const body = {
				text: content,
			};
			if (
				type === 'improve' ||
				type === 'simplify' ||
				type === 'lengthen' ||
				type === 'spelling' ||
				type === 'shorten' ||
				type === 'tone'
			) {
				body.lang = window?.kadence_blocks_params?.aiLang ? window.kadence_blocks_params.aiLang : 'en-US';
			}
			const response = await fetch(getAiProxyUrl(`transform/${type}`), {
				method: 'POST',
				headers: getAiProxyHeaders(),
				body: JSON.stringify(body),
			});
			if (!(response?.status === 200)) {
				if (response?.status === 423) {
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
	async function getAIEdit(content, prompt, type = 'edit') {
		try {
			const body = {
				text: content,
			};
			body.lang = window?.kadence_blocks_params?.aiLang ? window.kadence_blocks_params.aiLang : 'en-US';
			if (type === 'tone') {
				body.tone = prompt;
			} else {
				body.prompt = prompt;
			}
			const response = await fetch(getAiProxyUrl(`transform/${type}`), {
				method: 'POST',
				headers: getAiProxyHeaders(),
				body: JSON.stringify(body),
			});
			if (!(response?.status === 200)) {
				if (response?.status === 423) {
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
