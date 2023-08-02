import {
	API_ROUTE_GET_IMAGES,
	COLLECTIONS_SESSION_KEY,
	COLLECTION_REQUEST_IMAGE_TYPE,
	API_ROUTE_GET_COLLECTIONS,
	COLLECTION_REQUEST_IMAGE_SIZES,
} from "../constants";

import apiFetch from "@wordpress/api-fetch";
import { addQueryArgs } from "@wordpress/url";
import { SafeParseJSON } from "@kadence/helpers";

export function keywordsHelper() {
	/**
	 * Get mission statement value from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getSuggestedKeywords() {
		try {
			/* let collections = [];
			const response = await apiFetch( {
				path: addQueryArgs( API_ROUTE_GET_COLLECTIONS, {
					api_key: ( kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '' ),
				} ),
			} );
			const responseData = SafeParseJSON( response, false );

			if ( responseData?.data?.collections ) {
				collections = responseData.data.collections;
				// Save collections object to session storage.
				saveCollections(collections);
			} */

			// Return error for testing.

			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve([
						"Acupuncture",
						"Deep Tissue",
						"Physical Therapy",
						"Local Massage",
					]);
				}, 5000);
			});
		} catch (error) {
			const message = error?.message ? error.message : error;
			throw new Error("Something went wrong");
		}
	}

	return {
		getSuggestedKeywords,
	};
}
