export function getGlobalParam(key = '') {
	if (typeof window.kadenceLicenseModalParams !== 'object') {
		return '';
	}

	if (!key) {
		return window.kadenceLicenseModalParams;
	}

	return window.kadenceLicenseModalParams[key] || '';
}
