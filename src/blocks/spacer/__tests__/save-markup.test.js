/* eslint-env jest */
/**
 * Spacer stripe-divider: a design-token alias must survive into the SAVED block markup.
 *
 * Most Kadence blocks deliver their design values as CSS injected out-of-band in a `<style>` tag, so
 * aliasing them is invisible to block validation. `kadence/spacer` is the exception this test guards:
 * its stripe divider passes `dividerColor` through `KadenceColorOutput` and writes the result directly
 * into the SVG `stroke=` presentation attribute of the block's serialized `save.js` output
 * (save.js -> svg-pattern.js). That means the color is baked into stored post content, not just
 * injected CSS — so whatever `KadenceColorOutput` returns for an aliased `dividerColor` is exactly
 * what gets persisted and later re-validated by Gutenberg.
 *
 * The library helper is design-token-agnostic; alias resolution only happens because this plugin
 * registers a listener on the helper's `@wordpress/hooks` seam (`registerTokenAliasFilters`). So this
 * exercises the full path with that filter active and asserts three things about the serialized SVG:
 *   1. an aliased `dividerColor` becomes a valid `var(--kb-token--<id>)` in the `stroke` attribute
 *      (a resolvable CSS var, not a raw `{dot.alias}` brace string that would render nothing);
 *   2. a hex color is emitted verbatim; and
 *   3. a palette slug still becomes `var(--global-paletteN)`.
 * (2) and (3) are the regression guard: because the change is strictly additive, existing saved
 * spacers and newly-aliased ones both serialize the same shape they always have, so block validation
 * does not trip on unexpected content.
 *
 * This renders the real save-markup component directly rather than doing a full
 * registerBlockType -> serialize -> parse round-trip: `@wordpress/blocks` is externalized (provided by
 * WordPress core) and unresolvable in this jest harness, so the SVG string produced here IS the
 * markup line that would be persisted.
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
const KadenceColorOutput = require(path.join(helpersRoot, 'dist/cjs/kadence-color-output/index.js')).default;

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
