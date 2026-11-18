/* eslint-env jest */

import BackendStyles from '../index';
import metadata from '../../../block.json';

jest.mock('@kadence/helpers', () =>
	require('../../../../../extension/typography-css/test-utils').kadenceHelpersMock({
		KadenceColorOutput: (color) => color,
		getBorderStyle: () => '',
	})
);
jest.mock('react', () => require('../../../../../extension/typography-css/test-utils').reactWithImmediateUseMemo());

const uniqueID = 'abc';

const defaults = Object.fromEntries(
	Object.entries(metadata.attributes)
		.filter(([, definition]) => undefined !== definition.default)
		.map(([name, definition]) => [name, definition.default])
);

/**
 * Renders the table editor styles and returns the generated CSS.
 *
 * @param {Object} attributes The block attributes to merge over the defaults.
 *
 * @since TBD
 *
 * @return {string} The generated CSS.
 */
function render(attributes = {}) {
	global.kadence_blocks_params = { pro: 'false' };
	const element = BackendStyles.type({
		attributes: { ...defaults, uniqueID, ...attributes },
		previewDevice: 'Desktop',
	});
	return element.props.children;
}

describe('table BackendStyles typography', () => {
	it('outputs the cell, header and caption font sizes as valid declarations under their own selectors', () => {
		const css = render({
			dataTypography: [{ size: ['30', '', ''], sizeType: 'px' }],
			headerTypography: [{ size: ['31', '', ''], sizeType: 'px' }],
			captionTypography: [{ size: ['32', '', ''], sizeType: 'px' }],
		});

		expect(css).not.toContain('{{');
		expect(css).toContain(`.kb-table${uniqueID}{font-size:30px;}`);
		expect(css).toContain(`.kb-table${uniqueID} th{font-size:31px;`);
		expect(css).toContain(`.kb-table${uniqueID} caption{font-size:32px;`);
	});

	it('outputs no font size when no typography is set', () => {
		expect(render({ dataTypography: [{}], headerTypography: [{}], captionTypography: [{}] })).not.toContain(
			'font-size'
		);
	});
});
