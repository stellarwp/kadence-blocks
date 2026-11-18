/* eslint-env jest */

const HELPERS_DIST = '../../../node_modules/@kadence/helpers/dist/cjs';

/**
 * Returns a `@kadence/helpers` module with the real CSS builder, preview size, spacing and typography helpers.
 *
 * @param {Object} extra Additional exports to merge in.
 *
 * @since TBD
 *
 * @return {Object} The module exports.
 */
export function kadenceHelpersMock(extra = {}) {
	return {
		KadenceBlocksCSS: jest.requireActual(`${HELPERS_DIST}/css`).default,
		getPreviewSize: jest.requireActual(`${HELPERS_DIST}/get-preview-size`).default,
		getSpacingOptionOutput: jest.requireActual(`${HELPERS_DIST}/spacing-utilities`).getSpacingOptionOutput,
		typographyStyle: jest.requireActual(`${HELPERS_DIST}/typography-style`).default,
		...extra,
	};
}

/**
 * Returns `react` with `useMemo` running its callback directly, so hook based helpers work outside a component.
 *
 * @since TBD
 *
 * @return {Object} The module exports.
 */
export function reactWithImmediateUseMemo() {
	return {
		...jest.requireActual('react'),
		useMemo: (callback) => callback(),
	};
}
