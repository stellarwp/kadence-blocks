import { API } from "../constants/API";
import { md5Hash } from "./helpers";

/**
 * Get results from session storage by URL.
 *
 * @param {string} url The API URL.
 * @return {Array|boolean} Session results.
 */
export function getSession(url) {
	if ( !url ) {
		return false; // Exit if no URL or test mode is enabled.
	}

	const session = sessionStorage.getItem(md5Hash(url));
	if (!session) {
		return false; // Exit if no session data.
	}

	const data = JSON.parse(session);
	const { expires = 0, error = null } = data;

	if (error) {
		return false; // Exit if session data has error entry.
	}

	// Check if expiration time has passed.
	const expired = Date.now() > expires;

	// Delete session data when expired.
	if (expired) {
		deleteSession(url);
	}

	return data && !expired ? data : false;
}

/**
 * Save API data to session storage by URL.
 *
 * @param {string} url     Save results to session by URL.
 * @param {Array}  results The API results.
 */
export function saveSession(url, results) {
	if (!url || !results || results?.error) {
		return false;
	}
	// Set expiration to 1 hour.
	results.expires = Date.now() + 3600000;

	// Save session data.
	sessionStorage.setItem(md5Hash(url), JSON.stringify(results));
}

/**
 * Remove/delete session storage by URL.
 *
 * @param {string} url The API URL.
 */
export function deleteSession(url) {
	if (!url) {
		return false;
	}
	sessionStorage.removeItem(md5Hash(url));
}
