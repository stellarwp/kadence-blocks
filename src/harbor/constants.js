/**
 * Harbor REST defaults.
 *
 * Prefer values from `kadenceLicenseModalParams.harbor` (or other localized
 * params) when available so paths stay in sync with the PHP package.
 */

const localized = window.kadenceLicenseModalParams?.harbor || {};

export const HARBOR_LICENSE_PATH = localized.licensePath || '/liquidweb/harbor/v1/license';
export const HARBOR_FEATURES_PATH = localized.featuresPath || '/liquidweb/harbor/v1/features';
export const UNIFIED_KEY_PREFIX = localized.keyPrefix || 'LWSW-';
