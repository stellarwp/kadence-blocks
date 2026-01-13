export const compareVersions = (v1, v2) => {
	// Split version into parts and remove any non-numeric parts (e.g., "-RC1")
	const v1parts = v1.split('.').map((part) => (isNaN(parseInt(part)) ? part : parseInt(part))).filter(n => !isNaN(n));
	const v2parts = v2.split('.').map((part) => (isNaN(parseInt(part)) ? part : parseInt(part))).filter(n => !isNaN(n));

	// Start from the beginning of both versions and compare each part
	for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
		// If part position is not present in v1 but is in v2
		if (i >= v1parts.length) {
			// If the missing part is 0 in v2, they are equivalent in this position, continue to next part
			if (v2parts[i] === 0) {continue;}
			else {return -1;}  // Otherwise v2 is greater here
		}
		// If part position is not present in v2 but is in v1
		if (i >= v2parts.length) {
			// If the missing part is 0 in v1, they are equivalent in this position, continue to next part
			if (v1parts[i] === 0) {continue;}
			else {return 1;}  // Otherwise v1 is greater
		}

		// If neither version is missing a part (yet) in this position, carry out a normal comparison
		if (v1parts[i] > v2parts[i]) {return 1;}
		if (v1parts[i] < v2parts[i]) {return -1;}
	}

	// If we made it through the loop without returning, the versions are equivalent
	return 0;
}
