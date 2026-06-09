/**
 * Helpers for talking to the server-side Kadence AI REST routes.
 *
 * AI requests are sent to the same-origin proxy routes
 * (`/kb-design-library/v1/ai/*`) and the server attaches the request token. We
 * use a native `fetch` (not `apiFetch`) at the call sites so the streamed
 * response body is preserved for the editor's live typing UX.
 *
 * The REST root + nonce are resolved from `kadence_blocks_params` (block editor)
 * and fall back to `wpApiSettings` (present wherever `apiFetch` works, including
 * the admin dashboard where the AI Wizard can also run).
 */

function getRestRoot() {
	if (window?.kadence_blocks_params?.rest_url) {
		return window.kadence_blocks_params.rest_url;
	}
	if (window?.wpApiSettings?.root) {
		return window.wpApiSettings.root;
	}
	return '/wp-json/';
}

export function getAiProxyNonce() {
	if (window?.kadence_blocks_params?.restNonce) {
		return window.kadence_blocks_params.restNonce;
	}
	if (window?.wpApiSettings?.nonce) {
		return window.wpApiSettings.nonce;
	}
	return '';
}

export function getAiProxyUrl(path) {
	return `${getRestRoot()}kb-design-library/v1/ai/${path}`;
}

export function getAiProxyHeaders() {
	return {
		'Content-Type': 'application/json',
		'X-WP-Nonce': getAiProxyNonce(),
	};
}
