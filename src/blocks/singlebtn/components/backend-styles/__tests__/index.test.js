/* eslint-env jest */

/**
 * `hasVisibleShadow()` decides whether the editor-canvas live preview emits a `box-shadow`
 * declaration from a shadow value's own axes — the JS sibling of the front end's
 * `has_visible_shadow()` (`class-kadence-blocks-singlebtn-block.php`), now that the "Enable Box
 * Shadow" toggle and its sibling boolean attributes are gone.
 */

/**
 * Internal dependencies
 */
import { KadenceBlocksCSS } from '@kadence/helpers';
import BackendStyles, { hasVisibleShadow, paintsOwnShape } from '../index';
import {
	activePresetFor,
	blockDefaultOverridden,
	blockDefaultPreset,
	blockPresets,
	blockPresetThemeClass,
	blockPresetValues,
} from '../../../../../extension/preset-picker';
import { shadowAxisPx, shadowCss } from '../../../../../extension/design-tokens/shadow-css';
import metadata from '../../../block.json';

// `backend-styles/index.js` imports the `@kadence/helpers` barrel, which eagerly pulls in a
// REST-fetch helper that has no `@wordpress/api-fetch` module to resolve under Jest (the same
// constraint documented in `preset-border-shadow-properties.test.js`). `hasVisibleShadow` does not
// call into the helper library, so a bare stub is enough to let the module load without pulling
// that dependency in.
jest.mock('@kadence/helpers', () => ({
	KadenceBlocksCSS: jest.fn(),
	getPreviewSize: jest.fn(),
	KadenceColorOutput: jest.fn((color, opacity) =>
		undefined === opacity || 1 === opacity ? color : `rgba(${color}, ${opacity})`
	),
	typographyStyle: jest.fn(),
	getBorderStyle: jest.fn(),
	getBorderColor: jest.fn(),
	getSpacingOptionOutput: jest.fn(),
}));

jest.mock('../../../../../extension/preset-picker', () => ({
	activePresetFor: jest.fn(),
	blockDefaultOverridden: jest.fn(() => ({})),
	blockDefaultPreset: jest.fn(() => 'default'),
	blockPresets: jest.fn(() => []),
	blockPresetThemeClass: jest.fn(() => ''),
	blockPresetValues: jest.fn(),
}));

jest.mock('../../../../../extension/design-tokens/token-px', () => ({
	tokenPx: jest.fn((value) => (value === '{primitive.shadow.md}' ? 8 : null)),
}));

describe('hasVisibleShadow', () => {
	/**
	 * An all-zero shadow item — the shape the fixed "None" pick writes — paints nothing.
	 *
	 * @return {void}
	 */
	it('is false for an all-zero shadow item', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0, blur: 0, spread: 0 })).toBe(false);
	});

	/**
	 * A missing/undefined item (an attribute that has never been set) is treated as invisible
	 * rather than throwing on a property read.
	 *
	 * @return {void}
	 */
	it('is false for a missing/undefined item', () => {
		expect(hasVisibleShadow(undefined)).toBe(false);
	});

	/**
	 * An item missing some axis keys entirely (older data written before every axis was stored) reads
	 * as invisible, matching PHP's `has_visible_shadow()` — `Number(undefined)` is `NaN`, which a bare
	 * `!== 0` comparison would have counted as visible.
	 *
	 * @return {void}
	 */
	it('is false when an axis key is missing entirely', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0 })).toBe(false);
		expect(hasVisibleShadow({ color: '#000000' })).toBe(false);
	});

	/**
	 * An empty or nullish axis value is not a visible one, for the same reason as a missing key.
	 *
	 * @return {void}
	 */
	it('is false for an empty or nullish axis value', () => {
		expect(hasVisibleShadow({ hOffset: '', vOffset: null, blur: '   ', spread: undefined })).toBe(false);
	});

	/**
	 * Any single non-zero axis is enough to count the item as visible.
	 *
	 * @return {void}
	 */
	it('is true when any one axis is non-zero', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0, blur: 2, spread: 0 })).toBe(true);
	});
	/**
	 * A {dot.alias} token reference on any leg resolves to a var() whose value is unknown here, so it
	 * counts as visible. Read as zero, the caller's `box-shadow: none` would erase a shadow the token
	 * does paint. Mirrors the PHP renderer's own gate.
	 *
	 * @return {void}
	 */
	it('is true for a token alias reference on any leg', () => {
		expect(hasVisibleShadow({ hOffset: 0, vOffset: 0, blur: '{primitive.shadow.md}', spread: 0 })).toBe(true);
	});
});

describe('shadowAxisPx', () => {
	/**
	 * A {dot.alias} leg resolves through the token pool. Concatenated raw it would emit `{alias}px`,
	 * which is not valid CSS — and `hasVisibleShadow()` counts such a leg as visible, so it does reach
	 * the serializer.
	 *
	 * @return {void}
	 */
	it('resolves a token alias leg to its pixel value', () => {
		expect(shadowAxisPx('{primitive.shadow.md}', 0)).toBe(8);
	});

	/**
	 * An alias the pool cannot resolve falls back to the axis default rather than emitting the raw
	 * alias, which would serialize as invalid CSS.
	 *
	 * @return {void}
	 */
	it('falls back to the axis default when the alias does not resolve', () => {
		expect(shadowAxisPx('{primitive.shadow.unknown}', 14)).toBe(14);
	});

	/**
	 * A plain numeric axis passes through untouched, and an unset one takes its default.
	 *
	 * @return {void}
	 */
	it('passes a numeric axis through and defaults an unset one', () => {
		expect(shadowAxisPx(4, 0)).toBe(4);
		expect(shadowAxisPx(0, 14)).toBe(0);
		expect(shadowAxisPx(undefined, 14)).toBe(14);
		expect(shadowAxisPx(null, 14)).toBe(14);
	});
});

/**
 * A shadow item bound to a backed token, plus the localized pool that backs it.
 *
 * @since TBD
 *
 * @type {Object}
 */
const BOUND_ITEM = {
	color: '#00ff00',
	opacity: 1,
	hOffset: 0,
	vOffset: 2,
	blur: 8,
	spread: 0,
	inset: false,
	shadowToken: '{semantic.shadow.card}',
};

describe('shadowCss', () => {
	beforeEach(() => {
		window.kadenceDesignTokensPresets = { active: 'default' };
		window.kadenceDesignTokensPickable = {
			values: { default: { 'semantic.shadow.card': '0px 2px 8px 0px rgba(23, 23, 23, 0.12)' } },
		};
	});

	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
		delete window.kadenceDesignTokensPickable;
	});

	/**
	 * A backed binding resolves to the token's custom property, so editing the token moves the button
	 * without the post being re-saved.
	 *
	 * @return {void}
	 */
	it('emits the token var for a backed binding', () => {
		expect(shadowCss(BOUND_ITEM, 14)).toBe('var(--kb-token--semantic--shadow--card)');
	});

	/**
	 * A binding the active library no longer backs renders nothing, so the block falls back to its
	 * default CSS the same way every other block does when a token is deleted — the stored legs hold
	 * the value the token had when it was picked, but that value is stale and the renderer no longer
	 * reads it.
	 *
	 * @return {void}
	 */
	it('returns an empty string for an unbacked binding', () => {
		window.kadenceDesignTokensPickable = { values: { default: {} } };

		expect(shadowCss(BOUND_ITEM, 14)).toBe('');
	});

	/**
	 * An unbound item renders its legs exactly as the hand-rolled builders did, inset prefix included.
	 *
	 * @return {void}
	 */
	it('builds the literal shorthand for an unbound item', () => {
		expect(shadowCss({ ...BOUND_ITEM, shadowToken: undefined, inset: true }, 14)).toBe(
			'inset 0px 2px 8px 0px #00ff00'
		);
	});

	/**
	 * A missing axis falls back to the caller's own default, which is 14 for blur and 0 elsewhere —
	 * the historic per-leg defaults this block has always applied.
	 *
	 * @return {void}
	 */
	it('applies the historic per-leg defaults for missing axes', () => {
		expect(shadowCss({ color: '#000000', opacity: 1 }, 14)).toBe('0px 0px 14px 0px #000000');
	});

	/**
	 * An absent item produces no declaration rather than a shorthand of defaults.
	 *
	 * @return {void}
	 */
	it('returns an empty string for a missing item', () => {
		expect(shadowCss(undefined, 14)).toBe('');
	});
});

/**
 * Builds a minimal fake `KadenceBlocksCSS` instance that records every selector/property pair the
 * component adds, so a test can read back the final `box-shadow` value for a given selector without
 * pulling in the real class or its rendering.
 *
 * @since TBD
 *
 * @return {{set_selector: Function, add_property: Function, add_raw_styles: Function, render_color:
 *   Function, render_measure_output: Function, css_output: Function, rules: Array}} The fake CSS
 *   builder, plus its recorded `rules` for assertions.
 */
function createFakeCss() {
	const rules = [];
	let current = null;

	return {
		set_selector: (selector) => {
			current = { selector, props: {} };
			rules.push(current);
		},
		add_property: (property, value) => {
			if (!current) {
				current = { selector: '', props: {} };
				rules.push(current);
			}
			current.props[property] = value;
		},
		add_raw_styles: () => {},
		render_color: (color) => color,
		render_measure_output: () => {},
		css_output: () => '',
		rules,
	};
}

/**
 * Reads back the `box-shadow` value recorded for one selector out of a fake CSS builder's rules.
 *
 * @param {Array}  rules    The fake CSS builder's recorded rules.
 * @param {string} selector The selector to look up.
 *
 * @since TBD
 *
 * @return {*} The recorded `box-shadow` value, or undefined when none was recorded.
 */
function boxShadowFor(rules, selector) {
	return rules.find((entry) => entry.selector === selector && 'box-shadow' in entry.props)?.props['box-shadow'];
}

describe('BackendStyles shadow flag gating', () => {
	const BASE_SELECTOR = '.kb-single-btn-abc123 .kt-button-abc123';
	const HOVER_SELECTOR = '.kb-single-btn-abc123 .kt-button-abc123:hover';
	const VISIBLE_SHADOW = { hOffset: 2, vOffset: 2, blur: 4, spread: 0, color: '#000000', opacity: 1, inset: false };
	const HOVER_DEFAULT = 'var(--kb-btn-shadow-hover, none)';

	let fakeCss;

	beforeEach(() => {
		fakeCss = createFakeCss();
		KadenceBlocksCSS.mockImplementation(() => fakeCss);
	});

	afterEach(() => {
		KadenceBlocksCSS.mockReset();
	});

	/**
	 * A lowered `displayShadow` suppresses the base state's box-shadow even though the stored shadow
	 * itself is visible, matching the PHP renderer's own gate for this state.
	 *
	 * @return {void}
	 */
	it('emits no box-shadow for the base state when displayShadow is lowered but the shadow is visible', () => {
		BackendStyles({
			attributes: { uniqueID: 'abc123', displayShadow: false, shadow: [VISIBLE_SHADOW] },
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, BASE_SELECTOR)).toBe('none');
	});

	/**
	 * A raised `displayShadow` still emits the base state's box-shadow for the same visible value.
	 *
	 * @return {void}
	 */
	it('emits box-shadow for the base state when displayShadow is raised and the shadow is visible', () => {
		BackendStyles({
			attributes: { uniqueID: 'abc123', displayShadow: true, shadow: [VISIBLE_SHADOW] },
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, BASE_SELECTOR)).toBe(shadowCss(VISIBLE_SHADOW, 14));
	});

	/**
	 * A color picked before any geometry raises the flag but paints nothing, so the base state still
	 * emits no box-shadow — the flag records the pick, the geometry decides the painting.
	 *
	 * @return {void}
	 */
	it('emits no box-shadow for a color with no geometry even when displayShadow is raised', () => {
		const colorOnly = { hOffset: 0, vOffset: 0, blur: 0, spread: 0, color: '#3182ce', opacity: 1, inset: false };

		BackendStyles({
			attributes: { uniqueID: 'abc123', displayShadow: true, shadow: [colorOnly] },
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, BASE_SELECTOR)).toBe('none');
	});

	/**
	 * A lowered `displayHoverShadow` suppresses the hover state's own box-shadow even though the stored
	 * shadow itself is visible, so the hover rule falls back to the preset's hover shadow variable,
	 * matching the PHP renderer's own gate for this state.
	 *
	 * @return {void}
	 */
	it('points the hover state at the preset hover shadow when displayHoverShadow is lowered but the shadow is visible', () => {
		BackendStyles({
			attributes: { uniqueID: 'abc123', displayHoverShadow: false, shadowHover: [VISIBLE_SHADOW] },
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, HOVER_SELECTOR)).toBe(HOVER_DEFAULT);
	});

	/**
	 * A raised `displayHoverShadow` still emits the hover state's box-shadow for the same visible
	 * value.
	 *
	 * @return {void}
	 */
	it('emits box-shadow for the hover state when displayHoverShadow is raised and the shadow is visible', () => {
		BackendStyles({
			attributes: { uniqueID: 'abc123', displayHoverShadow: true, shadowHover: [VISIBLE_SHADOW] },
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, HOVER_SELECTOR)).toBe(shadowCss(VISIBLE_SHADOW, 14));
	});

	/**
	 * A block with a visible base shadow and no hover shadow of its own does not carry the base shadow
	 * into the hover state: the hover rule points at the preset's hover shadow variable, whose `none`
	 * fallback covers a preset that sets no hover shadow.
	 *
	 * @return {void}
	 */
	it('points the hover state at the preset hover shadow when the block has a base shadow but no hover shadow', () => {
		BackendStyles({
			attributes: {
				uniqueID: 'abc123',
				displayShadow: true,
				shadow: [VISIBLE_SHADOW],
				displayHoverShadow: false,
			},
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, BASE_SELECTOR)).toBe(shadowCss(VISIBLE_SHADOW, 14));
		expect(boxShadowFor(fakeCss.rules, HOVER_SELECTOR)).toBe(HOVER_DEFAULT);
	});

	/**
	 * An untouched button carries the shipped schema defaults — a VISIBLE shadow value paired with a
	 * lowered flag — and must still paint nothing on the canvas. The visible value only exists so a
	 * legacy button that saved no value key of its own keeps its shadow; the flag is what keeps a new
	 * button clean.
	 *
	 * @return {void}
	 */
	it('emits no box-shadow for an untouched button carrying the shipped visible defaults', () => {
		BackendStyles({
			attributes: {
				uniqueID: 'abc123',
				displayShadow: metadata.attributes.displayShadow.default,
				shadow: metadata.attributes.shadow.default,
				displayHoverShadow: metadata.attributes.displayHoverShadow.default,
				shadowHover: metadata.attributes.shadowHover.default,
			},
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, BASE_SELECTOR)).toBe('none');
		expect(boxShadowFor(fakeCss.rules, HOVER_SELECTOR)).toBe(HOVER_DEFAULT);
	});

	/**
	 * The regression this pairing exists for: a legacy button switched on before the shadow value was
	 * ever customized saved its flag and NO value key, so it arrives with the schema default filled
	 * in. It must render the historical shadow, not nothing.
	 *
	 * @return {void}
	 */
	it('emits the shipped default shadow for a legacy button with its flag raised and no stored value', () => {
		BackendStyles({
			attributes: {
				uniqueID: 'abc123',
				displayShadow: true,
				shadow: metadata.attributes.shadow.default,
			},
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, BASE_SELECTOR)).toBe(shadowCss(metadata.attributes.shadow.default[0], 14));
	});
});

describe('BackendStyles class-painted mode gating', () => {
	const BASE_SELECTOR = '.kb-single-btn-abc123 .kt-button-abc123';
	const PRESET_TOKENS = {
		default: {
			'button-padding': ['0.4em', '1em', '0.4em', '1em'],
			'button-margin': ['0', '0', '0', '0'],
			'button-border-width': '0px',
			'button-border-style': 'solid',
			'button-border-color': 'transparent',
			'button-shadow': '{primitive.shadow.md}',
		},
	};

	let fakeCss;

	beforeEach(() => {
		fakeCss = createFakeCss();
		KadenceBlocksCSS.mockImplementation(() => fakeCss);
		activePresetFor.mockReturnValue('default');
		blockPresetValues.mockReturnValue(PRESET_TOKENS);
		blockDefaultPreset.mockReturnValue('default');
		blockDefaultOverridden.mockReturnValue({});
	});

	afterEach(() => {
		KadenceBlocksCSS.mockReset();
		activePresetFor.mockReset();
		blockPresetValues.mockReset();
		blockDefaultPreset.mockReset();
		blockDefaultOverridden.mockReset();
	});

	/**
	 * Reads back every property recorded for the base selector.
	 *
	 * @param {Array} rules The fake CSS builder's recorded rules.
	 *
	 * @since TBD
	 *
	 * @return {Object} The merged property map for the base selector.
	 */
	function basePropsOf(rules) {
		return Object.assign(
			{},
			...rules.filter((entry) => entry.selector === BASE_SELECTOR).map((entry) => entry.props)
		);
	}

	/**
	 * Only the plugin-painted modes own the button's shape.
	 *
	 * @return {void}
	 */
	it('treats fill and an unset mode as the plugin painting its own shape', () => {
		expect(paintsOwnShape({})).toBe(true);
		expect(paintsOwnShape({ inheritStyles: 'fill' })).toBe(true);
		expect(paintsOwnShape({ inheritStyles: 'outline' })).toBe(false);
		expect(paintsOwnShape({ inheritStyles: 'inherit' })).toBe(false);
		expect(paintsOwnShape({ inheritStyles: 'inherit-secondary' })).toBe(false);
	});

	/**
	 * With a preset catalog present, the active preset decides: a class-painted preset hands the shape to
	 * the theme, a variable-painted one leaves it to the plugin, whatever the retired mode says.
	 *
	 * @return {void}
	 */
	it('lets the active preset decide the shape when the catalog offers presets', () => {
		blockPresets.mockReturnValue([{ slug: 'default' }, { slug: 'theme-base', themeClass: 'button' }]);
		activePresetFor.mockImplementation((name, attributes) =>
			attributes.inheritStyles === 'inherit' ? 'theme-base' : 'default'
		);
		blockPresetThemeClass.mockImplementation((name, slug) => (slug === 'theme-base' ? 'button' : ''));

		try {
			expect(paintsOwnShape({ inheritStyles: 'inherit' })).toBe(false);
			expect(paintsOwnShape({ inheritStyles: 'outline' })).toBe(true);
			expect(paintsOwnShape({})).toBe(true);
		} finally {
			blockPresets.mockReturnValue([]);
			activePresetFor.mockReset();
			blockPresetThemeClass.mockReset();
			blockPresetThemeClass.mockReturnValue('');
		}
	});

	/**
	 * A theme-painted or outline button gets none of the preset bridges and no shadow reset, so the
	 * editor canvas keeps the padding, border and shadow the theme's or the outline rules give it.
	 *
	 * @return {void}
	 */
	it.each(['inherit', 'inherit-secondary', 'outline'])('emits no preset bridge or shadow reset for %s', (mode) => {
		BackendStyles({ attributes: { uniqueID: 'abc123', inheritStyles: mode }, previewDevice: 'Desktop' });

		const props = basePropsOf(fakeCss.rules);

		expect(props.padding).toBeUndefined();
		expect(props.margin).toBeUndefined();
		expect(props['border-width']).toBeUndefined();
		expect(props['border-style']).toBeUndefined();
		expect(props['border-color']).toBeUndefined();
		expect(props['box-shadow']).toBeUndefined();
		expect(boxShadowFor(fakeCss.rules, `${BASE_SELECTOR}:hover`)).toBeUndefined();
	});

	/**
	 * A Fill button keeps the spacing and shadow bridges, since its padding, margin and shadow are the
	 * plugin's own. The border bridge stays out while the library overrides no border property, so the
	 * theme's cascade keeps painting an untouched button's border.
	 *
	 * @return {void}
	 */
	it('keeps the spacing and shadow bridges for fill but no untouched border bridge', () => {
		BackendStyles({ attributes: { uniqueID: 'abc123', inheritStyles: 'fill' }, previewDevice: 'Desktop' });

		const props = basePropsOf(fakeCss.rules);

		expect(props.padding).toBe('var(--kb-btn-padding)');
		expect(props['border-width']).toBeUndefined();
		expect(props['border-style']).toBeUndefined();
		expect(props['border-color']).toBeUndefined();
		expect(props['box-shadow']).toBe('var(--kb-btn-shadow)');
		expect(boxShadowFor(fakeCss.rules, `${BASE_SELECTOR}:hover`)).toBe('var(--kb-btn-shadow-hover, none)');
	});
});

describe('hasVisibleShadow with a binding', () => {
	afterEach(() => {
		delete window.kadenceDesignTokensPresets;
		delete window.kadenceDesignTokensPickable;
	});

	/**
	 * A backed bound item counts as visible whatever its legs say — the token's own value is unknown to
	 * this gate, and reading it as invisible would let the base rule's `box-shadow: none` erase it.
	 *
	 * @return {void}
	 */
	it('counts a bound item with zero legs as visible', () => {
		expect(
			hasVisibleShadow({
				color: 'transparent',
				opacity: 1,
				hOffset: 0,
				vOffset: 0,
				blur: 0,
				spread: 0,
				inset: false,
				shadowToken: '{semantic.shadow.card}',
			})
		).toBe(true);
	});

	/**
	 * An unbacked binding is not visible — it takes exactly the path an item with no shadow already
	 * takes, so the caller's `box-shadow: none` reset fires instead of holding the stale frozen legs.
	 *
	 * @return {void}
	 */
	it('is false for an unbacked binding', () => {
		window.kadenceDesignTokensPresets = { active: 'default' };
		window.kadenceDesignTokensPickable = { values: { default: {} } };

		expect(
			hasVisibleShadow({
				color: '#00ff00',
				opacity: 1,
				hOffset: 0,
				vOffset: 2,
				blur: 8,
				spread: 0,
				inset: false,
				shadowToken: '{semantic.shadow.card}',
			})
		).toBe(false);
	});
});
