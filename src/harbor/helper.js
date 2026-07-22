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
