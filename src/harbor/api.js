/**
 * Thin Harbor REST client for license + feature (plugin) management.
 *
 * Harbor's enable endpoint installs (downloads) a plugin when missing, then
 * activates it — see Plugin_Strategy / Installable_Strategy in the Harbor package.
 */
import apiFetch from '@wordpress/api-fetch';
import { HARBOR_FEATURES_PATH, HARBOR_LICENSE_PATH } from './constants';

/**
 * Validate and store a unified license key.
 *
 * @param {string}  key       Unified license key (LWSW-…).
 * @param {Object}  [options]
 * @param {boolean} [options.network=false] Store at network level (multisite).
 * @return {Promise<{key: string|null, products: Array, error: Object|null}>}
 */
export function storeLicense(key, { network = false } = {}) {
	return apiFetch({
		path: HARBOR_LICENSE_PATH,
		method: 'POST',
		data: { key, network },
	});
}

/**
 * Fetch a single Harbor feature by slug.
 *
 * @param {string} slug Feature slug (e.g. kadence-blocks-pro).
 * @return {Promise<Object>}
 */
export function getFeature(slug) {
	return apiFetch({
		path: `${HARBOR_FEATURES_PATH}/${encodeURIComponent(slug)}`,
		method: 'GET',
	});
}

/**
 * Enable a Harbor feature (install if needed, then activate).
 *
 * @param {string} slug Feature slug.
 * @return {Promise<Object>} Updated feature resource.
 */
export function enableFeature(slug) {
	return apiFetch({
		path: `${HARBOR_FEATURES_PATH}/${encodeURIComponent(slug)}/enable`,
		method: 'POST',
	});
}

/**
 * Install and activate a Harbor feature plugin.
 *
 * Checks current state first so callers can show accurate status copy, then
 * calls enable (which downloads/installs when the plugin is missing).
 *
 * @param {string}   slug Feature slug.
 * @param {Object}   [options]
 * @param {Function} [options.onStatus] Called with 'checking' | 'already_active' | 'activating' | 'installing'.
 * @return {Promise<Object>} Enabled feature resource.
 */
export async function installAndActivateFeature(slug, { onStatus } = {}) {
	const notify = typeof onStatus === 'function' ? onStatus : () => {};

	notify('checking');

	let feature = null;
	try {
		feature = await getFeature(slug);
	} catch (err) {
		// A structured Harbor error (e.g. feature not yet in the catalog, or not
		// covered by the license yet) is safe to ignore here as enable() will
		// independently return its own equally clear error.
		if (typeof err?.code !== 'string' || !err.code.startsWith('lw-harbor-')) {
			throw err;
		}
		feature = null;
	}

	if (feature?.is_enabled) {
		notify('already_active');
		return feature;
	}

	if (feature?.installed_version) {
		notify('activating');
	} else {
		notify('installing');
	}

	return enableFeature(slug);
}
