/* eslint-env jest */
/**
 * Spacer save-markup coupling for design-token aliases.
 *
 * The audit (SOFT-3899) flagged that `kadence/spacer` renders `dividerColor` through
 * `KadenceColorOutput` into an SVG `stroke=` attribute in the SAVED markup
 * (save.js -> svg-pattern.js). Now that `KadenceColorOutput` is alias-aware, an aliased
 * `dividerColor` must serialize into that markup as a valid `var(--kb-token--<id>)` string, and a
 * non-alias color must remain byte-identical (the change is strictly additive).
 *
 * A full Gutenberg registerBlockType/serialize/parse round-trip is not exercised here because
 * `@wordpress/blocks` is externalized (provided by WP core) and not resolvable in this test harness;
 * this asserts the exact static-markup line the audit called out.
 */
import { TextEncoder, TextDecoder } from 'util';
import path from 'path';
import { createElement } from '@wordpress/element';
import { removeFilter } from '@wordpress/hooks';
import { registerTokenAliasFilters } from '../../../extension/design-tokens/register-filters';

// jsdom does not define TextEncoder/TextDecoder, which react-dom/server needs at import; polyfill
// them before requiring it (require, not import, so this runs first).
if (typeof global.TextEncoder === 'undefined') {
	global.TextEncoder = TextEncoder;
	global.TextDecoder = TextDecoder;
}
const { renderToStaticMarkup } = require('react-dom/server');

// The `@kadence/helpers` barrel eagerly pulls in sibling helpers whose deps are externalized by the
// plugin's webpack build (and so are unresolvable under jest). Load the single compiled
// KadenceColorOutput module directly to exercise the real helper (and its `@wordpress/hooks` seam)
// without the barrel. `@kadence/helpers/package.json` is exposed by the package `exports` map.
const helpersRoot = path.dirname(require.resolve('@kadence/helpers/package.json'));
const KadenceColorOutput = require(path.join(
	helpersRoot,
	'dist/cjs/kadence-color-output/index.js'
)).default;

// SvgPattern reads `wp.element.Component` at module load, so provide the global before requiring it.
global.wp = { element: require('@wordpress/element') };
const SvgPattern = require('../svg-pattern').default;

/**
 * Render the spacer stripe-divider SVG for a given divider color, exactly as save.js does.
 *
 * @param {string} dividerColor The block's `dividerColor` attribute (literal, palette slug, or alias).
 * @return {string} The static SVG markup.
 */
function renderDivider(dividerColor) {
	return renderToStaticMarkup(
		createElement(SvgPattern, {
			uniqueID: 'test',
			color: KadenceColorOutput(dividerColor),
			opacity: 100,
			rotate: 40,
			strokeWidth: 9,
			strokeGap: 9,
		})
	);
}

describe('spacer stripe divider save markup', () => {
	// SvgPattern renders the hyphenated SVG DOM prop `stroke-width` (its real, unchanged saved-markup
	// shape), which React warns about once. That warning predates and is unrelated to aliasing, so
	// swallow console.error here (@wordpress/jest-console would otherwise fail the test on it).
	let errorSpy;
	beforeEach(() => {
		// The plugin registers alias resolution on the helper's filter seam; an aliased dividerColor
		// only resolves to a token var because this listener is active.
		registerTokenAliasFilters();
		errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
	});
	afterEach(() => {
		removeFilter('kadence.helpers.colorValue', 'kadence-blocks/token-alias');
		removeFilter('kadence.helpers.dimensionValue', 'kadence-blocks/token-alias');
		errorSpy.mockRestore();
	});

	it('serializes an aliased dividerColor into the SVG stroke as a token var', () => {
		const markup = renderDivider('{semantic.color.divider}');

		expect(markup).toContain('stroke="var(--kb-token--semantic--color--divider)"');
	});

	it('serializes a hex dividerColor unchanged (additive: no regression)', () => {
		const markup = renderDivider('#eeeeee');

		expect(markup).toContain('stroke="#eeeeee"');
	});

	it('serializes a palette dividerColor as a global var (additive: no regression)', () => {
		const markup = renderDivider('palette3');

		expect(markup).toContain('stroke="var(--global-palette3)"');
	});
});
