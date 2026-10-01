/**
 * Kind-aware normalization for the `text` kind — a trimmed string compare.
 */

/**
 * Normalize a text attribute for compare.
 *
 * @param {*} value The stored value.
 *
 * @since TBD
 *
 * @return {string} The trimmed string, or '' when empty.
 */
export function normalizeText(value) {
	if (value === undefined || value === null) {
		return '';
	}

	return String(value).trim();
}
