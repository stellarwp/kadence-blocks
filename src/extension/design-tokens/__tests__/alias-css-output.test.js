/* eslint-env jest */
/**
 * Blocks-side integration: the alias-aware CSS builder as the plugin consumes it, end to end.
 *
 * Nearly every Kadence block generates its injected `<style>` through `KadenceBlocksCSS`
 * (`@kadence/helpers`). The library is token-agnostic — it exposes a `@wordpress/hooks` seam — so this
 * loads the COMPILED package the plugin actually ships, registers the plugin's real alias filter
 * (`registerTokenAliasFilters`), and asserts a `{dot.alias}` design value resolves to a bare
 * `var(--kb-token--<id>)` across the dimension / border-radius paths, while every literal stays
 * byte-identical. Both sides of the seam are exercised: the compiled helper's `applyFilters` and the
 * plugin's `addFilter` share the one `wp.hooks` registry.
 *
 * The compiled module is loaded via a direct path (the `@kadence/helpers` barrel eagerly pulls in
 * siblings whose deps are webpack-externalized and unresolvable under jest).
 */
import path from 'path';
import { removeFilter } from '@wordpress/hooks';
import { registerTokenAliasFilters } from '../register-filters';

const helpersRoot = path.dirname(require.resolve('@kadence/helpers/package.json'));
const KadenceBlocksCSS = require(path.join(helpersRoot, 'dist/cjs/css/index.js')).default;
const KadenceColorOutput = require(path.join(helpersRoot, 'dist/cjs/kadence-color-output/index.js')).default;

const ALIAS = '{semantic.radius.media}';
const ALIAS_VAR = 'var(--kb-token--semantic--radius--media)';

beforeEach(() => {
	registerTokenAliasFilters();
});

afterEach(() => {
	removeFilter('kadence.helpers.colorValue', 'kadence-blocks/token-alias');
	removeFilter('kadence.helpers.dimensionValue', 'kadence-blocks/token-alias');
});

describe('KadenceBlocksCSS render_measure_output (padding/margin/border-radius/border-width)', () => {
	it('emits a single aliased corner as a bare var and literal corners with their unit', () => {
		const css = new KadenceBlocksCSS();
		css.render_measure_output([ALIAS, 8, '', ''], null, null, 'Desktop', 'border-radius', 'px', {}, true);

		expect(css._css).toContain(`border-top-left-radius:${ALIAS_VAR};`);
		expect(css._css).toContain('border-top-right-radius:8px;');
	});

	it('emits every corner as a var when all four sides are aliases', () => {
		const css = new KadenceBlocksCSS();
		css.render_measure_output([ALIAS, ALIAS, ALIAS, ALIAS], null, null, 'Desktop', 'border-radius', 'px', {}, true);

		// border-radius is a "special" property that also emits vendor-prefixed variants; assert the
		// four standard corner properties each resolve to the token var.
		expect(css._css).toContain(`border-top-left-radius:${ALIAS_VAR};`);
		expect(css._css).toContain(`border-top-right-radius:${ALIAS_VAR};`);
		expect(css._css).toContain(`border-bottom-right-radius:${ALIAS_VAR};`);
		expect(css._css).toContain(`border-bottom-left-radius:${ALIAS_VAR};`);
	});

	it('is byte-identical for a plain numeric padding array (no regression)', () => {
		const css = new KadenceBlocksCSS();
		css.render_measure_output([10, 20, 30, 40], null, null, 'Desktop', 'padding', 'px', {}, true);

		expect(css._css).toBe('padding-top:10px;padding-right:20px;padding-bottom:30px;padding-left:40px;');
	});

	it('resolves an aliased border-width side to a var (no unit appended)', () => {
		const css = new KadenceBlocksCSS();
		css.render_measure_output([ALIAS, '', '', ''], null, null, 'Desktop', 'border-width', 'px', {}, true);

		expect(css._css).toContain(`border-top-width:${ALIAS_VAR};`);
	});
});

describe('KadenceBlocksCSS render_size / render_half_size', () => {
	it('render_size resolves an alias to a bare var and a literal to value+unit', () => {
		const css = new KadenceBlocksCSS();

		expect(css.render_size(ALIAS, 'px')).toBe(ALIAS_VAR);
		expect(css.render_size(24, 'px')).toBe('24px');
	});

	it('render_half_size resolves an alias to a bare var and a literal to calc()', () => {
		const css = new KadenceBlocksCSS();

		expect(css.render_half_size(ALIAS, 'px')).toBe(ALIAS_VAR);
		expect(css.render_half_size(12, 'px')).toBe('calc(12px / 2)');
	});
});

describe('KadenceBlocksCSS render_shadow', () => {
	it('resolves an aliased shadow color while keeping numeric offsets literal', () => {
		const css = new KadenceBlocksCSS();
		const shadow = css.render_shadow({
			inset: false,
			hOffset: 0,
			vOffset: 4,
			blur: 12,
			spread: 0,
			color: '{semantic.color.shadow}',
		});

		expect(shadow).toBe('0px 4px 12px 0px var(--kb-token--semantic--color--shadow)');
	});

	it('is byte-identical for a literal-colored shadow (no regression)', () => {
		const css = new KadenceBlocksCSS();
		const shadow = css.render_shadow({
			inset: false,
			hOffset: 0,
			vOffset: 4,
			blur: 12,
			spread: 0,
			color: '#000000',
		});

		expect(shadow).toBe('0px 4px 12px 0px #000000');
	});
});

describe('the seam is what resolves the alias', () => {
	it('leaves an alias unresolved when the plugin filter is not registered', () => {
		removeFilter('kadence.helpers.colorValue', 'kadence-blocks/token-alias');
		removeFilter('kadence.helpers.dimensionValue', 'kadence-blocks/token-alias');

		// With no listener, the agnostic helper cannot recognize the alias: render_size falls through
		// its numeric/variable branches and does not emit the token var.
		expect(new KadenceBlocksCSS().render_size(ALIAS, 'px')).not.toBe(ALIAS_VAR);
	});
});

describe('KadenceColorOutput (colorValue filter seam)', () => {
	it('resolves an alias to a bare var through the colorValue filter', () => {
		expect(KadenceColorOutput('{semantic.color.shadow}')).toBe('var(--kb-token--semantic--color--shadow)');
	});

	it('passes a non-alias color through unchanged', () => {
		expect(KadenceColorOutput('#3182CE')).toBe('#3182CE');
	});

	it('leaves an alias unresolved when the plugin filter is not registered', () => {
		removeFilter('kadence.helpers.colorValue', 'kadence-blocks/token-alias');
		removeFilter('kadence.helpers.dimensionValue', 'kadence-blocks/token-alias');

		expect(KadenceColorOutput('{semantic.color.shadow}')).not.toBe('var(--kb-token--semantic--color--shadow)');
	});
});
