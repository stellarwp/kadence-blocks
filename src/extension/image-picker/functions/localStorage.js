const searchName = "instant-images-recent-searches";
const settingsName = "instant-images-settings";
const most = 10;

/**
 * Save search value to localstorage.
 *
 * @param {string} term The search term.
 */
export function saveSearchHistory(term) {
	const recent = getSearchHistory();
	if (!recent) {
		localStorage.setItem(searchName, JSON.stringify([term]));
		return;
	}

	// Find duplicates.
	const duplicate = recent.indexOf(term);
	if (duplicate > -1) {
		recent.splice(duplicate, 1);
	}

	// Limit to 6 items.
	if (recent.length >= most) {
		recent.length = most;
	}

	// Add new term to the beginning of the array.
	recent.unshift(term);
	localStorage.setItem(searchName, JSON.stringify(recent));
}

/**
 * Get the search history from localstorage.
 *
 * @return {Array} The search history.
 */
export function getSearchHistory() {
	const history = localStorage.getItem(searchName);
	if (!history) {
		return [];
	}
	return JSON.parse(localStorage.getItem(searchName));
}

/**
 * Clear search history.
 */
export function clearSearchHistory() {
	localStorage.removeItem(searchName);
}

/**
 * Save generic setting to localstorage as an key/value object pair.
 *
 * @param {string} key   The object key.
 * @param {value}  value The object value.
 */
export function saveSettings(key, value) {
	const settings = localStorage.getItem(settingsName);
	const setting = {
		[key]: value,
	};

	if (!settings) {
		localStorage.setItem(settingsName, JSON.stringify(setting));
	} else {
		const parsed = JSON.parse(settings);
		parsed[key] = value;
		localStorage.setItem(settingsName, JSON.stringify(parsed));
	}
}

/**
 * Get an individual setting from local storage.
 *
 * @param {string} key The stoarge key.
 * @return {string|boolean} The storage value.
 */
export function getSetting(key) {
	const settings = localStorage.getItem(settingsName);
	if (!settings) {
		return false;
	}
	const parsed = JSON.parse(settings);
	return parsed[key] ? parsed[key] : false;
}
