/**
 * Get the correct error message by status code.
 *
 * @param {string} status The API status.
 */
export default function getErrorMessage(status = 200) {
	const local = instant_img_localize;
	switch (status) {
		case 400:
		case 401:
			// Unsplash/Pixabay/Pexels incorrect API key.
			return local.api_invalid_msg;

		case 403:
			return local.api_invalid_403_msg;

		case 404:
			return local.api_invalid_404_msg;

		case 429:
			/**
			 * Pixabay, Pexels - too many requests.
			 *
			 * @see https://www.pexels.com/api/documentation/#statistics
			 * @see https://pixabay.com/api/docs/#api_rate_limit
			 */
			return local.api_ratelimit_msg;

		case 500:
		case 503:
			// Internal server error.
			return local.api_invalid_500_msg;

		case 501:
			// Missing params.
			return local.api_invalid_501_msg;
		default:
			break;
	}
}
