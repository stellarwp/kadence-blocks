import CryptoJS from "crypto-js";

/**
 * Get the MD5 hash value of a URL.
 *
 * @param {string} url The API URL to hash.
 * @return {string} The MD5 hash.
 */
export function md5Hash(url) {
	return CryptoJS.MD5(url).toString();
}
