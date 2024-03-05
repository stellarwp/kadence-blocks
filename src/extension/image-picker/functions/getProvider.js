import { API } from '../constants/API';

/**
 * Get the default provider on page load.
 *
 * @return {string} The default service provider.
 */
export default function getProvider() {
	return kadenceExtensionImagePicker && kadenceExtensionImagePicker.default_provider
		? kadenceExtensionImagePicker.default_provider
		: API.defaults.provider;
}
