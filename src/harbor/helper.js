import { __, sprintf } from '@wordpress/i18n';
import { installAndActivateFeature } from './api';

export function getGlobalParam(key = '') {
	if (typeof window.kadenceLicenseModalParams !== 'object') {
		return '';
	}

	if (!key) {
		return window.kadenceLicenseModalParams;
	}

	return window.kadenceLicenseModalParams[key] || '';
}

/**
 * Build a product-scoped Liquid Web portal activation URL.
 *
 * The base URL is already fully assembled server-side (portal-referral,
 * redirect_url, domain, etc.); this only appends the `sku` param so the
 * portal can pre-select the right product/tier.
 *
 * @param {string} baseUrl     Raw activation URL from `kadenceLicenseModalParams.activationUrl`.
 * @param {string} productSlug e.g. "kadence".
 * @param {string} [tier]      e.g. "elite".
 * @return {string} The scoped URL, or an empty string if no base URL is available.
 */
export function buildActivationUrl(baseUrl, productSlug, tier) {
	if (!baseUrl) {
		return '';
	}

	try {
		const url = new URL(baseUrl);
		url.searchParams.set('sku', `${productSlug}:${tier || ''}`);
		return url.toString();
	} catch (e) {
		return baseUrl;
	}
}

const INSTALL_STATUS_MESSAGES = {
	/* translators: %s: plugin name */
	installing: __('Downloading and installing %s…', 'kadence-blocks'),
	/* translators: %s: plugin name */
	activating: __('Activating %s…', 'kadence-blocks'),
	/* translators: %s: plugin name */
	already_active: __('%s is already active.', 'kadence-blocks'),
};

/**
 * Install/activate a feature plugin, reporting translated progress messages.
 *
 * Thin wrapper around `installAndActivateFeature` that maps its `onStatus`
 * keys to the translated strings shared by both license views. Callers own
 * their own state (step machine vs. simple loading flag) and error handling;
 * this only normalizes progress messages and the default failure message.
 *
 * @param {string}   featureSlug         Feature/plugin slug to install and activate.
 * @param {string}   featureName         Human-readable name, used in progress messages.
 * @param {Function} onStatus            Called with a translated progress message.
 * @throws {Error} With a translated message on failure.
 */
export async function installProFeature(featureSlug, featureName, onStatus) {
	onStatus(
		sprintf(
			/* translators: %s: plugin name */
			__('Preparing to install %s…', 'kadence-blocks'),
			featureName
		)
	);

	try {
		await installAndActivateFeature(featureSlug, {
			onStatus: (status) => {
				const message = INSTALL_STATUS_MESSAGES[status];
				if (message) {
					onStatus(sprintf(message, featureName));
				}
			},
		});
	} catch (err) {
		throw new Error(
			err?.message ||
				sprintf(
					/* translators: %s: plugin name */
					__('Failed to install or activate %s.', 'kadence-blocks'),
					featureName
				)
		);
	}
}
