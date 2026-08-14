/* eslint-env jest */
/**
 * The design-token alias filter listener.
 *
 * `@kadence/helpers` runs every emitted color/dimension value through the `kadence.helpers.colorValue`
 * and `kadence.helpers.dimensionValue` filters. Kadence Blocks registers a listener that turns a strict
 * `{dot.alias}` into its `var(--kb-token--<id>)` reference — but only when the token is still backed by
 * the active library. A stale alias (a token deleted after it was saved into a post) is left as its raw
 * value so the editor emits no dead var() and the property falls back to the global CSS, matching the
 * front-end renderer. When no resolved-token data is localized (e.g. a bare test harness) the listener
 * fails open and resolves any alias, preserving the pure recognizer's behavior.
 */
import { applyFilters, removeFilter } from '@wordpress/hooks';
import { registerTokenAliasFilters } from '../register-filters';

const HOOK = 'kadence.helpers.colorValue';
const NAMESPACE = 'kadence-blocks/token-alias';

const BACKED_ALIAS = '{semantic.color.border}';
const BACKED_VAR = 'var(--kb-token--semantic--color--border)';
const STALE_ALIAS = '{primitive.color.brand.deleted}';

describe('registerTokenAliasFilters', () => {
	beforeEach(() => {
		registerTokenAliasFilters();
	});

	afterEach(() => {
		removeFilter(HOOK, NAMESPACE);
		removeFilter('kadence.helpers.dimensionValue', NAMESPACE);
		delete window.kadenceDesignTokensPickable;
		delete window.kadenceDesignTokensPresets;
	});

	/**
	 * With a localized resolved map, a strict alias whose id is backed resolves to its bare token var.
	 */
	it('resolves a backed alias to its token var', () => {
		window.kadenceDesignTokensPresets = { active: 'default' };
		window.kadenceDesignTokensPickable = {
			tokens: [],
			values: { default: { 'semantic.color.border': '#E2E8F0' } },
		};

		expect(applyFilters(HOOK, BACKED_ALIAS)).toBe(BACKED_VAR);
	});

	/**
	 * A strict alias whose id is absent from the resolved map (a since-deleted token) is left as its raw
	 * value, so no dead var() is emitted and the property falls back to the global CSS.
	 */
	it('leaves a stale (unbacked) alias untouched so no dead var is emitted', () => {
		window.kadenceDesignTokensPresets = { active: 'default' };
		window.kadenceDesignTokensPickable = {
			tokens: [],
			values: { default: { 'semantic.color.border': '#E2E8F0' } },
		};

		expect(applyFilters(HOOK, STALE_ALIAS)).toBe(STALE_ALIAS);
		expect(applyFilters(HOOK, STALE_ALIAS)).not.toContain('var(');
	});

	/**
	 * With no resolved-token data localized, the listener fails open and resolves any strict alias, so the
	 * pure recognizer's behavior is preserved where backing cannot be determined.
	 */
	it('fails open and resolves an alias when no resolved map is localized', () => {
		expect(applyFilters(HOOK, BACKED_ALIAS)).toBe(BACKED_VAR);
		expect(applyFilters(HOOK, STALE_ALIAS)).toBe('var(--kb-token--primitive--color--brand--deleted)');
	});

	/**
	 * The dimension hook is wired the same way as the color hook: a backed alias resolves to its var and a
	 * stale alias is left untouched, proving the listener validates backing on both registered hooks (not
	 * just passing raw values through).
	 */
	it('resolves a backed alias and leaves a stale one on the dimension hook', () => {
		window.kadenceDesignTokensPresets = { active: 'default' };
		window.kadenceDesignTokensPickable = {
			tokens: [],
			values: { default: { 'semantic.radius.media': '8px' } },
		};

		const DIMENSION_HOOK = 'kadence.helpers.dimensionValue';

		expect(applyFilters(DIMENSION_HOOK, '{semantic.radius.media}')).toBe(
			'var(--kb-token--semantic--radius--media)'
		);
		expect(applyFilters(DIMENSION_HOOK, STALE_ALIAS)).toBe(STALE_ALIAS);
	});

	/**
	 * A non-alias value passes through untouched on both registered hooks.
	 */
	it('passes a non-alias value through unchanged', () => {
		expect(applyFilters(HOOK, '#3182CE')).toBe('#3182CE');
		expect(applyFilters('kadence.helpers.dimensionValue', '16px')).toBe('16px');
	});
});
