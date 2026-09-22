/**
 * Shared access to the design-tokens REST descriptor the editor localizer prints
 * (`window.kadenceDesignTokensRest`). Every design-token editor client reads the namespace and presence
 * from here rather than re-implementing it; `@wordpress/api-fetch` supplies the root + nonce in the editor.
 */
import { get } from 'lodash';

/**
 * The localized design-tokens REST descriptor, or an empty object when the registry is inactive.
 *
 * @return {Object} The descriptor ({ root, namespace, nonce }).
 */
function descriptor() {
	return get(window, 'kadenceDesignTokensRest', {}) || {};
}

/**
 * The REST namespace the design-token routes register under.
 *
 * @return {string} The namespace, e.g. "kb-design-tokens/v1".
 */
export function designTokensNamespace() {
	return descriptor().namespace || 'kb-design-tokens/v1';
}

/**
 * Whether the editor has the descriptor needed to talk to the design-tokens REST API. When false, the
 * design-token editor controls are hidden.
 *
 * @return {boolean} True when the descriptor is present.
 */
export function hasDesignTokensRest() {
	return Boolean(descriptor().namespace);
}
