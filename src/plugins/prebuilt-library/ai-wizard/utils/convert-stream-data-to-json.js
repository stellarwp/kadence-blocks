export function convertStreamDataToJson(data) {
	const decodedValue = new TextDecoder().decode(data);

	const lines = decodedValue.split("\n");

	// Step 2: Extract data from the lines
	let eventData = {};
	lines.forEach((line) => {
		const colonIndex = line.indexOf(":");
		if (colonIndex !== -1) {
			const key = line.slice(0, colonIndex).trim();
			const value = line.slice(colonIndex + 1).trim();

			if (key === "data") {
				try {
					eventData = JSON.parse(value);
				} catch (error) {
					console.error("Error parsing JSON data:", error);
				}
			}
		}
	});

	return eventData;
}
