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
 * exercises the full path with that filter active and asserts what gets SERIALIZED into the SVG:
 *   1. an aliased `dividerColor` becomes `var(--kb-token--<id>)` in the `stroke` attribute — the same
 *      var *shape* a palette slug already produces (`var(--global-paletteN)`), just for a token;
 *   2. a hex color is emitted verbatim; and
 *   3. a palette slug still becomes `var(--global-paletteN)`.
 * (2) and (3) are the regression guard: because the change is strictly additive, existing saved
 * spacers and newly-aliased ones serialize the same shape they always have, so block validation does
 * not trip on unexpected content.
 *
 * IMPORTANT — this asserts *serialization*, not rendering. `var()` is generally NOT substituted inside
 * an SVG presentation attribute like `stroke=` (it is a CSS-value function; a presentation-attribute
 * value is not parsed as a CSS declaration), so a token — OR a palette — color delivered this way may
 * not actually paint in the browser. That is a pre-existing limitation of the stripe divider's
 * `stroke=` delivery, not something introduced here; making a token (or palette) stripe truly render
 * means moving the color into a CSS context — out of scope here and tracked as a residual JS seam /
 * per-block rollout item, which is why the spacer `dividerColor` is held out of the initial alias
 * picker scope. What this test locks in is that the seam is additive and deterministic at the
 * save-markup boundary.
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

// Import just the compiled KadenceColorOutput leaf module, not the `@kadence/helpers` barrel.
// Evaluating the barrel would load every sibling helper, and several import WordPress packages the
// plugin externalizes to `wp.*` globals at build time (e.g. `@wordpress/api-fetch`, `@wordpress/data`)
// and never installs in node_modules — so the barrel throws "Cannot find module" under jest. The leaf
// module pulls only its own minimal deps while still exercising the real helper (and its
// `@wordpress/hooks` seam). The package `exports` map only exposes `.` and `./package.json`, so we
// resolve the package root via package.json and join the compiled file path.
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
