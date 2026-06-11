import { getAiProxyUrl, getAiProxyHeaders } from '../../data-fetch/ai-proxy';

export function missionStatementHelper() {
	async function getMissionStatement(missionStatement, lang) {
		try {
			const response = await fetch(getAiProxyUrl('mission-statement'), {
				method: 'POST',
				headers: getAiProxyHeaders(),
				body: JSON.stringify({
					text: missionStatement,
					lang: lang ? lang : 'en-US',
				}),
			});
			if (!(response?.status === 200)) {
				if (response?.status === 424) {
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
