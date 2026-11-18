/* eslint-env jest */

import BackendStyles from '../index';
import metadata from '../../block.json';

jest.mock('@kadence/helpers', () => require('../../../../extension/typography-css/test-utils').kadenceHelpersMock());
jest.mock('react', () => require('../../../../extension/typography-css/test-utils').reactWithImmediateUseMemo());
jest.mock('@kadence/components', () => ({ KadenceWebfontLoader: () => null }));

const uniqueID = 'abc';

const defaults = Object.fromEntries(
	Object.entries(metadata.attributes)
		.filter(([, definition]) => undefined !== definition.default)
		.map(([name, definition]) => [name, definition.default])
);

/**
 * Renders the identity editor styles and returns the generated CSS.
 *
 * @param {Object} attributes The block attributes to merge over the defaults.
 *
 * @since TBD
 *
 * @return {string} The generated CSS.
 */
function render(attributes = {}) {
	const element = BackendStyles({
		attributes: { ...defaults, uniqueID, ...attributes },
		clientId: 'client',
		previewDevice: 'Desktop',
	});
	return element.props.children[0].props.children;
}

describe('identity BackendStyles typography', () => {
	it('outputs the title and tagline typography as valid declarations under their own selectors', () => {
		const css = render({
			titleTypography: [{ weight: '700' }],
			taglineTypography: [{ weight: '500' }],
		});

		expect(css).not.toContain('{{');
		expect(css).toContain(`.kb-identity${uniqueID} .wp-block-site-title{font-weight:700;}`);
		expect(css).toContain(`.kb-identity${uniqueID} .wp-block-site-tagline{font-weight:500;}`);
	});

	it('outputs no typography rule when no typography is set', () => {
		expect(render({ titleTypography: [], taglineTypography: [] })).not.toContain('font-weight');
	});
});
