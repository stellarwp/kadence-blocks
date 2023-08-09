import {
	API_ROUTE_GET_IMAGES,
	COLLECTIONS_SESSION_KEY,
	VERTICALS_SESSION_KEY,
	COLLECTION_REQUEST_IMAGE_TYPE,
	API_ROUTE_GET_COLLECTIONS,
	API_ROUTE_GET_VERTICALS,
	COLLECTION_REQUEST_IMAGE_SIZES,
	API_MAX_ATTEMPTS
} from '../constants';

import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { useState, useEffect } from '@wordpress/element';
import { SafeParseJSON } from '@kadence/helpers';
import { __ } from '@wordpress/i18n';

export function preMadeCollectionsHelper() {
	const [loading, setLoading] = useState(true);
	const [pexelLinks, setPexelLinks] = useState();
	const [verticals, setVerticals] = useState();

	useEffect(() => {
		setLoading(true);
		const cachedCollections = sessionStorage.getItem(COLLECTIONS_SESSION_KEY);
		if (!cachedCollections) {
			getCollectionsFromProphecy();
		} else {
			setPexelLinks(JSON.parse(cachedCollections));
		}

		const cachedVerticals = sessionStorage.getItem(VERTICALS_SESSION_KEY);
		if (!cachedVerticals) {
			getVerticalsFromProphecy();
		} else {
			setVerticals(JSON.parse(cachedVerticals));
			setLoading(false);
		}
	}, []);



	/**
	 * Get collections data from Prophecy endpoint.
	 *
	 * @return {void};
	 */
	async function getCollectionsFromProphecy() {
		try {
			let collections = [];
			const response = await apiFetch( {
				path: addQueryArgs( API_ROUTE_GET_COLLECTIONS, {
					api_key: ( kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '' ),
				} ),
			} );
			const responseData = SafeParseJSON( response, false );

			if ( responseData?.data?.collections ) {
				collections = responseData.data.collections;
				setPexelLinks(collections)
				sessionStorage.setItem(COLLECTIONS_SESSION_KEY, JSON.stringify(collections));
			}
		} catch (error) {
			const message = error?.message ? error.message : error;

			console.log(`ERROR: ${ message }`);
		} finally {
			setLoading(false);
		}
	}

	/**
	 * Get verticals data from Prophecy endpoint.
	 *
	 * @return {void}
	 */
	async function getVerticalsFromProphecy() {
		// Attempt to query verticals 3 times.
		for (let tries = 0; tries < API_MAX_ATTEMPTS; tries++) {
			try {
				const response = await apiFetch({
					path: API_ROUTE_GET_VERTICALS
				});
				const responseData = SafeParseJSON(response, false);

				if (responseData && responseData?.data) {
					// PreMade vertical don't have the galleries key
					const parsedVerticals = responseData.data.reduce((acc, item) => {
						const subVerticals = item.sub_verticals.map((vert) => ({
							label: vert,
							value: vert,
						}));
						return [
							...acc,
							...subVerticals
						]
					}, []);
					// Sort alphabetically
					parsedVerticals.sort(function (a, b) {
						if (a.label < b.label) {
						  return -1;
						}
						if (a.label > b.label) {
						  return 1;
						}
						return 0;
					});

					parsedVerticals.unshift({
						label: __('AI Generated Collection', 'kadence-blocks'),
						value: "aiGenerated",
						galleries: [
							{ name: 'featured', images: [] },
							{ name: 'background', images: [] }
						]
					})
					setVerticals(parsedVerticals);
					sessionStorage.setItem(VERTICALS_SESSION_KEY, JSON.stringify(parsedVerticals));
					break;
				}
			} catch (error) {
				const message = error?.message ? error.message : error;
				console.log(`ERROR: ${message}`);
			}
		}

		setLoading(false);
	}

	/**
	 * Get photo collection by industry
	 *
	 * @param {(string|string[])} industry
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getPreMadeCollectionByIndustry(industry) {
		const industries = Array.isArray(industry) ? industry : [ industry ];

		try {
			const response = await apiFetch( {
				path: addQueryArgs( API_ROUTE_GET_IMAGES, {
					industries: industries,
					api_key: ( kadence_blocks_params?.proData?.api_key ? kadence_blocks_params.proData.api_key : '' ),
					image_type: COLLECTION_REQUEST_IMAGE_TYPE,
					image_sizes: COLLECTION_REQUEST_IMAGE_SIZES,
				} ),
			} );
			const responseData = SafeParseJSON( response, false );
			if ( responseData && responseData.data ) {
				const dataWithLinks = responseData.data.map((gallery) => {
					const matchingLink = pexelLinks.find((item) => item.collection_slug === gallery.collection_slug);
					return {
						name: gallery.collection_slug,
						images: gallery.images,
						pexelLink: matchingLink?.collection_url || ''
					}
				});
				return dataWithLinks;
			}
			return [];
		} catch (error) {
			console.log(`ERROR: ${ error }`);
		}
	}

	return {
		loading,
		verticals,
		getPreMadeCollectionByIndustry,

	}
}

