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

export function missionStatementHelper() {
	/**
	 * Get mission statement value from Prophecy endpoint.
	 *
	 * @return {Promise<array>}
	 */
	async function getMissionStatement() {
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

			// Wait 4 seconds and fullfill promise.
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					resolve(
						"At Modern Tribe, our mission is to craft exceptional digital experiences that captivate, connect, and empower individuals and businesses. We believe that design has the power to transform ideas into tangible realities, and we are dedicated to creating innovative solutions that seamlessly blend aesthetics, functionality, and user-centricity. Through our relentless pursuit of excellence and our collaborative approach, we strive to exceed our clients' expectations, fostering long-lasting partnerships built on trust, integrity, and shared success. With a passion for pushing boundaries and a commitment to staying at the forefront of design trends and technologies, we aim to shape the future of digital experiences, making a meaningful impact in the lives of people around the globe."
					);
				}, 5000);
			});
		} catch (error) {
			const message = error?.message ? error.message : error;

			console.log(`ERROR: ${message}`);
		}
	}

	return {
		getMissionStatement,
	};
}
