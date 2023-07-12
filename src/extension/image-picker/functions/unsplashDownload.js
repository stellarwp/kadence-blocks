import buildURL from "./buildURL";
import { getAuth } from "./getQueryParams";

/**
 * Function to trigger an image download at unsplash.com.
 * This is used to give authors download credits and nothing more.
 *
 * @see https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download
 *
 * @param {string} download_url The URL to trigger a download.
 * @since 3.1
 */
export default function unsplashDownload(download_url) {
	const params = getAuth({}, "unsplash");
	params.download_url = download_url; // Append download URL to query params.
	const url = buildURL("photos", params);

	fetch(url)
		.then((data) => data.json())
		.then(function () {
			// Success, nothing else happens here
			console.log("Image download successsfully triggered at Unsplash."); // eslint-disable-line no-console
		})
		.catch(function (error) {
			console.warn(error);
		});
}
