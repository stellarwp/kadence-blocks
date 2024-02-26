/**
 * Convert stream event data to JSON.
 *
 * Sample stream data:
 * event: content
 * data: {"content":""}
 *
 * event: content
 * data: {"content":"Lorem"}
 *
 * event: content
 * data: {"content":"ipsum"}
 *
 * @return {{content: string}}
 */
export function convertStreamDataToJson(data) {
	const decodedValue = new TextDecoder().decode(data);

	const lines = decodedValue.split('\n');

	let eventData = {
		content: '',
	};
	lines.forEach((line) => {
		const colonIndex = line.indexOf(':');
		if (colonIndex !== -1) {
			const key = line.slice(0, colonIndex).trim();
			const value = line.slice(colonIndex + 1).trim();

			if (key === 'data' && value !== 'content') {
				try {
					const jsonData = JSON.parse(value);
					if (jsonData.content) {
						eventData.content += jsonData.content;
					}
				} catch (error) {
					console.error('Error parsing JSON data:', error);
				}
			}
		}
	});

	return eventData;
}
