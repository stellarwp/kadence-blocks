/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import { __ } from '@wordpress/i18n';
import { SafeParseJSON } from '@kadence/helpers';
const API_ROUTE_GET_IMAGES = '/kb-design-library/v1/get_images';

const { kadence_blocks_params } = window;

export function getAsyncData() {
	const [isLoadingWizard, setLoadingWizard] = useState(false);
	const [isLoadingImages, setLoadingImages] = useState(false);
	const [isLoadingAI, setLoadingAI] = useState(false);
	const [error, setError] = useState(false);

	let data_key =
		undefined !== kadence_blocks_params && kadence_blocks_params?.proData && kadence_blocks_params?.proData?.api_key
			? kadence_blocks_params.proData.api_key
			: '';
	let data_email =
		undefined !== kadence_blocks_params &&
		kadence_blocks_params?.proData &&
		kadence_blocks_params?.proData?.api_email
			? kadence_blocks_params.proData.api_email
			: '';
	const product_id =
		undefined !== kadence_blocks_params &&
		kadence_blocks_params?.proData &&
		kadence_blocks_params?.proData?.product_id
			? kadence_blocks_params.proData.product_id
			: '';
	if (!data_key) {
		data_key =
			undefined !== kadence_blocks_params &&
			kadence_blocks_params?.proData &&
			kadence_blocks_params?.proData?.ithemes_key
				? kadence_blocks_params.proData.ithemes_key
				: '';
		if (data_key) {
			data_email = 'iThemes';
		}
	}
	/**
	 * Get remaining credits.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getAvailableCredits() {
		try {
			const response = await apiFetch({
				path: '/kb-design-library/v1/get_remaining_credits',
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'error';
		}
	}
	/**
	 * Save wizard data to Wordpress options table.
	 *
	 * @return {Promise<boolean>}
	 */
	async function saveAIWizardData(data) {
		setLoadingWizard(true);
		setError(false);

		try {
			const response = await apiFetch({
				path: '/wp/v2/settings',
				method: 'POST',
				data: { kadence_blocks_prophecy: JSON.stringify(data) },
			});

			if (response) {
				setLoadingWizard(false);

				return true;
			}
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			setLoadingWizard(false);
			setError(true);

			return false;
		}
	}

	/**
	 * Get wizard data from database.
	 *
	 * @return {Promise<object>}
	 */
	async function getAIWizardData(reload = false) {
		setLoadingWizard(true);
		setError(false);
		const preloadData =
			window?.kadence_blocks_params_wizard?.settings && window?.kadence_blocks_params_wizard?.settings?.context
				? window.kadence_blocks_params_wizard.settings
				: false;
		if (!reload && preloadData) {
			setLoadingWizard(false);
			return preloadData;
		}
		try {
			const response = await apiFetch({
				path: '/wp/v2/settings',
				method: 'GET',
			});

			if (response) {
				setLoadingWizard(false);

				if (response?.kadence_blocks_prophecy) {
					if (!window?.kadence_blocks_params_wizard) {
						window.kadence_blocks_params_wizard = {};
					}
					window.kadence_blocks_params_wizard.settings = response.kadence_blocks_prophecy;
					return response.kadence_blocks_prophecy;
				}
			}
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			setLoadingWizard(false);
			setError(true);

			return {};
		}
	}

	/**
	 * Get photo collection by industry
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getCollectionByIndustry(userData) {
		if (!userData?.photoLibrary) {
			return [];
		}
		const localGallery =
			userData?.customCollections &&
			userData?.customCollections.some((item) => item.value === userData?.photoLibrary)
				? userData?.customCollections.find((item) => item.value === userData?.photoLibrary)
				: false;
		if (localGallery) {
			const myImages = { data: [] };
			if (localGallery?.galleries?.[0]?.images) {
				const aImages = localGallery?.galleries?.[0]?.images.map((item, index) => {
					const img = {};
					if (item?.alt) {
						img.alt = item.alt;
					}
					if (item?.url) {
						img.url = item.url;
					}
					if (item?.width) {
						img.width = item.width;
					}
					if (item?.height) {
						img.height = item.height;
					}
					if (item?.photographer) {
						img.photographer = item.photographer;
					}
					if (item?.photographer_url) {
						img.photographer_url = item.photographer_url;
					}
					if (item?.id) {
						img.id = item.id;
					}
					if (item?.sizes?.[1]?.src) {
						if (item.sizes.find((image) => image.name === 'large')) {
							img.sizes = [{ src: item.sizes.find((image) => image.name === 'large').src }];
						} else if (item.sizes.find((image) => image.name === '2048x2048')) {
							img.sizes = [{ src: item.sizes.find((image) => image.name === '2048x2048').src }];
						} else if (item.sizes.find((image) => image.name === 'scaled')) {
							img.sizes = [{ src: item.sizes.find((image) => image.name === 'scaled').src }];
						} else {
							img.sizes = [{ src: item.sizes[1].src }];
						}
					} else {
						img.sizes = [{ src: item.url }];
					}
					return img;
				});
				myImages.data.push({ images: aImages });
			}
			if (localGallery?.galleries?.[1]?.images) {
				const bImages = localGallery?.galleries?.[1]?.images.map((item, index) => {
					const img = {};
					if (item?.alt) {
						img.alt = item.alt;
					}
					if (item?.url) {
						img.url = item.url;
					}
					if (item?.width) {
						img.width = item.width;
					}
					if (item?.height) {
						img.height = item.height;
					}
					if (item?.photographer) {
						img.photographer = item.photographer;
					}
					if (item?.photographer_url) {
						img.photographer_url = item.photographer_url;
					}
					if (item?.id) {
						img.id = item.id;
					}
					if (item?.sizes?.[1]?.src) {
						img.sizes = [{ src: item.sizes[1].src }];
					} else {
						img.sizes = [{ src: item.url }];
					}
					return img;
				});
				myImages.data.push({ images: bImages });
			}
			return myImages;
		}
		if ('aiGenerated' === userData?.photoLibrary) {
			const industries = Array.isArray(userData.photoLibrary) ? userData?.photoLibrary : [userData.photoLibrary];
			try {
				const response = await apiFetch({
					path: addQueryArgs(API_ROUTE_GET_IMAGES, {
						industries,
						industry: userData?.imageSearchQuery,
					}),
				});
				const responseData = SafeParseJSON(response, false);
				if (responseData) {
					return {
						data: [
							{
								name: 'featured',
								images: responseData?.data?.images.slice(0, 12),
							},
							{
								name: 'background',
								images: responseData?.data?.images.slice(12, 24),
							},
						],
					};
				}
				return [];
			} catch (error) {
				const message = error?.message ? error.message : error;
				console.log(`ERROR: ${message}`);
			}
		}
		const industries = Array.isArray(userData.photoLibrary) ? userData?.photoLibrary : [userData.photoLibrary];
		try {
			const response = await apiFetch({
				path: addQueryArgs(API_ROUTE_GET_IMAGES, {
					industries,
				}),
			});
			const responseData = SafeParseJSON(response, false);
			// console.log(responseData);
			if (responseData) {
				return responseData;
			}
			return [];
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
		}
	}

	/**
	 * Get the AI content data from the server.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getAIContentData(context) {
		try {
			const response = await apiFetch({
				path: addQueryArgs('/kb-design-library/v1/get', {
					context,
				}),
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}

	/**
	 * Get the AI content data from the server.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getLocalAIContentData() {
		try {
			const response = await apiFetch({
				path: '/kb-design-library/v1/get_all_items',
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}
	/**
	 * Get the AI content data from the server.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getInitialAIContent() {
		try {
			const response = await apiFetch({
				path: '/kb-design-library/v1/get_initial_jobs',
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}
	/**
	 * Force a reload of the AI content data.
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function loadVerticals() {
		const response = await apiFetch({
			path: '/kb-design-library/v1/get_verticals',
		});
		return response;
	}
	/**
	 * Force a reload of the AI content data.
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function loadCollections() {
		const response = await apiFetch({
			path: '/kb-design-library/v1/get_image_collections',
		});
		return response;
	}

	/**
	 * Force a reload of the AI content data.
	 *
	 * @param {(object)} context
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getAIContentDataReload(context) {
		try {
			const response = await apiFetch({
				path: addQueryArgs('/kb-design-library/v1/get', {
					force_reload: true,
					context,
				}),
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}

	/**
	 * Get Remaining Contexts, or All if forcing reload.
	 *
	 * @param {(object)} context
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getAIContentRemaining(reload = false) {
		try {
			const response = await apiFetch({
				path: addQueryArgs('/kb-design-library/v1/get_remaining_jobs', {
					force_reload: reload,
				}),
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}
	/**
	 * Get the AI content data from the server.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getAllAIContentData(initial = false) {
		try {
			const response = await apiFetch({
				path: addQueryArgs('/kb-design-library/v1/get-all-ai', {
					force_reload: initial,
				}),
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}
	/**
	 * Get library data.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getPatterns(library, reload, library_url = null, key = null, meta = null) {
		if ('section' === library && !reload && 'html' !== meta) {
			const preloadPatterns =
				window?.kadence_blocks_params_library?.library_sections &&
				window?.kadence_blocks_params_library?.library_sections.length > 0
					? window.kadence_blocks_params_library.library_sections
					: false;
			if (preloadPatterns) {
				return preloadPatterns;
			}
		}
		if ('section' === library && !reload && 'html' === meta) {
			const preloadPatternHTML =
				window?.kadence_blocks_params_library?.library_sections_html &&
				window?.kadence_blocks_params_library?.library_sections_html.length > 0
					? window.kadence_blocks_params_library.library_sections_html
					: false;
			if (preloadPatternHTML) {
				return preloadPatternHTML;
			}
		}
		try {
			const response = await apiFetch({
				path: addQueryArgs('/kb-design-library/v1/get_library', {
					force_reload: reload,
					library,
					library_url: library_url ? library_url : '',
					key: key ? key : library,
					meta: meta ? meta : '',
				}),
			});
			if ('section' === library && 'html' === meta && response) {
				if (!window?.kadence_blocks_params_library) {
					window.kadence_blocks_params_library = {};
				}
				window.kadence_blocks_params_library.library_sections_html = response;
			}
			if ('section' === library && 'html' !== meta && response) {
				if (!window?.kadence_blocks_params_library) {
					window.kadence_blocks_params_library = {};
				}
				window.kadence_blocks_params_library.library_sections = response;
			}
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}
	/**
	 * Get library data.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getPatternCategories(library, reload, library_url = null, key = null) {
		try {
			const response = await apiFetch({
				path: addQueryArgs('/kb-design-library/v1/get_library_categories', {
					force_reload: reload,
					library,
					library_url: library_url ? library_url : '',
					key: key ? key : library,
				}),
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}

	/**
	 * Get library data.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getPattern(library, type, item_id, style, library_url = null, key = null) {
		try {
			const args = {
				library,
				key: key ? key : library,
				pattern_id: item_id ? item_id : '',
				pattern_type: type ? type : '',
				pattern_style: style ? style : '',
			};
			if (library_url) {
				args.library_url = library_url;
			}
			if (data_key) {
				args.api_key = data_key;
			}
			if (data_email) {
				args.api_email = data_email;
			}
			if (product_id) {
				args.product_id = product_id;
			}
			const response = await apiFetch({
				path: addQueryArgs('/kb-design-library/v1/get_pattern_content', args),
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			const code = error?.code ? error.code : error;
			console.log(`ERROR: ${message}`);
			if ('invalid_access' === code) {
				return 'invalid_access';
			}
			return 'failed';
		}
	}
	/**
	 * Get local contexts.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function getLocalAIContexts() {
		try {
			const response = await apiFetch({
				path: '/kb-design-library/v1/get_local_contexts',
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}
	/**
	 * Get library data.
	 *
	 * @param {(object)} userData
	 *
	 * @return {Promise<object>} Promise returns object
	 */
	async function processPattern(content, imageCollection = '', cpt_blocks = '', style = '') {
		try {
			const response = await apiFetch({
				path: '/kb-design-library/v1/process_pattern',
				method: 'POST',
				data: {
					content,
					image_library: imageCollection,
					cpt_blocks: cpt_blocks,
					style: style,
				},
			});
			return response;
		} catch (error) {
			const message = error?.message ? error.message : error;
			console.log(`ERROR: ${message}`);
			return 'failed';
		}
	}

	return {
		error,
		getAIContentData,
		getLocalAIContentData,
		getAIContentDataReload,
		saveAIWizardData,
		getAIWizardData,
		getCollectionByIndustry,
		getPatterns,
		getPatternCategories,
		getPattern,
		processPattern,
		getLocalAIContexts,
		getInitialAIContent,
		getAllAIContentData,
		getAIContentRemaining,
		getAvailableCredits,
	};
}
