/* eslint-env jest */
/**
 * Pins the editor's attribute-default override for the one thing it seeds today: an EMPTY `size` on the
 * icon block. The override reads a value out of a localized catalog and `''` is falsy, so a careless guard
 * on the value would silently skip the seed and leave block.json's `50` in force.
 *
 * Importing `early-filters.js` registers its WordPress hooks against the real `@wordpress/hooks` at module
 * load. Four of its dependencies are stubbed because jest cannot load them: `@wordpress/blocks`,
 * `@wordpress/block-editor` and `@wordpress/api-fetch` are externalized to `wp.*` globals in production
 * and are not installed as top-level dependencies, and `@kadence/helpers` ships its `@kadence/icons`
 * dependency as untransformed ESM that jest refuses to parse. None of their exports is reached by the
 * function under test.
 */

jest.mock('@wordpress/blocks', () => ({}), { virtual: true });
jest.mock('@wordpress/block-editor', () => ({}), { virtual: true });
jest.mock('@wordpress/api-fetch', () => jest.fn(), { virtual: true });
jest.mock('@kadence/helpers', () => ({ blockExists: jest.fn() }));

import { blockPresetAttributeDefault } from '../early-filters';

describe('blockPresetAttributeDefault', () => {
	afterEach(() => {
		delete window.kadenceDesignTokensAttributeDefaults;
	});

	/**
	 * An empty-string catalog entry replaces the block.json default rather than being skipped as falsy.
	 */
	it('applies an empty default from the catalog', () => {
		window.kadenceDesignTokensAttributeDefaults = { 'kadence/single-icon': { size: '' } };

		const settings = blockPresetAttributeDefault(
			{ attributes: { size: { type: ['number', 'string'], default: 50 } } },
			'kadence/single-icon'
		);

		expect(settings.attributes.size).toEqual({ type: ['number', 'string'], default: '' });
	});

	/**
	 * A block the catalog does not name keeps its own defaults untouched.
	 */
	it('leaves a block with no catalog entry alone', () => {
		window.kadenceDesignTokensAttributeDefaults = { 'kadence/single-icon': { size: '' } };

		const settings = { attributes: { size: { type: 'number', default: 50 } } };

		expect(blockPresetAttributeDefault(settings, 'kadence/image')).toBe(settings);
		expect(settings.attributes.size.default).toBe(50);
	});
});
