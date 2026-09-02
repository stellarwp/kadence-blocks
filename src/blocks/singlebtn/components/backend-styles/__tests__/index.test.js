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
import BackendStyles, { hasVisibleShadow } from '../index';
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
	 * A lowered `displayHoverShadow` suppresses the hover state's box-shadow even though the stored
	 * shadow itself is visible, matching the PHP renderer's own gate for this state.
	 *
	 * @return {void}
	 */
	it('emits no box-shadow for the hover state when displayHoverShadow is lowered but the shadow is visible', () => {
		BackendStyles({
			attributes: { uniqueID: 'abc123', displayHoverShadow: false, shadowHover: [VISIBLE_SHADOW] },
			previewDevice: 'Desktop',
		});

		expect(boxShadowFor(fakeCss.rules, HOVER_SELECTOR)).toBe('');
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
		expect(boxShadowFor(fakeCss.rules, HOVER_SELECTOR)).toBe('');
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
