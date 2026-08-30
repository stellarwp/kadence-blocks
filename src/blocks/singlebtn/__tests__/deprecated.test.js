/* eslint-env jest */
import metadata from '../block.json';
import deprecated from '../deprecated';

const [{ attributes, supports, isEligible, migrate }] = deprecated;

const NONE_ITEM = { color: 'transparent', hOffset: 0, vOffset: 0, blur: 0, spread: 0, inset: false, opacity: 1 };

const LEGACY_SHADOW_DEFAULTS = {
	shadow: [{ color: '#000000', opacity: 0.2, spread: 0, blur: 2, hOffset: 1, vOffset: 1, inset: false }],
	shadowHover: [{ color: '#000000', opacity: 0.4, spread: 0, blur: 3, hOffset: 2, vOffset: 2, inset: false }],
	shadowTransparent: [{ color: '#000000', opacity: 0.2, spread: 0, blur: 2, hOffset: 1, vOffset: 1, inset: false }],
	shadowTransparentHover: [
		{ color: '#000000', opacity: 0.4, spread: 0, blur: 3, hOffset: 2, vOffset: 2, inset: false },
	],
	shadowSticky: [{ color: '#000000', opacity: 0.2, spread: 0, blur: 2, hOffset: 1, vOffset: 1, inset: false }],
	shadowStickyHover: [{ color: '#000000', opacity: 0.4, spread: 0, blur: 3, hOffset: 2, vOffset: 2, inset: false }],
};

const TOGGLE_ATTRIBUTES = [
	'displayShadow',
	'displayHoverShadow',
	'displayShadowTransparent',
	'displayHoverShadowTransparent',
	'displayShadowSticky',
	'displayHoverShadowSticky',
];

/**
 * Split raw saved attributes into the pair `isEligible` would see if the first argument were parsed
 * against the block's CURRENT schema: legacy toggles filtered out, everything else kept.
 *
 * @param {Object} rawAttrs The unfiltered JSON from the saved block comment.
 *
 * @since TBD
 *
 * @return {Object} The schema-filtered attributes.
 */
function schemaFiltered(rawAttrs) {
	return Object.fromEntries(Object.entries(rawAttrs).filter(([key]) => key in metadata.attributes));
}

describe('kadence/singlebtn deprecated migration', () => {
	it('declares the current attribute schema plus the six legacy toggles', () => {
		Object.keys(metadata.attributes).forEach((key) => expect(attributes).toHaveProperty(key));
		TOGGLE_ATTRIBUTES.forEach((key) => expect(attributes[key]).toEqual({ type: 'boolean', default: false }));
	});

	// The current schema ships these same historical defaults again, so this no longer distinguishes
	// the deprecation's schema from the block's — it pins the values themselves, and the equality
	// below is the drift detector: if either side moves, this fails.
	it('declares the six shadow attribute defaults the current schema also ships', () => {
		Object.entries(LEGACY_SHADOW_DEFAULTS).forEach(([key, legacyDefault]) => {
			expect(attributes[key]).toEqual({ type: 'array', default: legacyDefault });
			expect(attributes[key].default).toEqual(metadata.attributes[key].default);
		});
	});

	it('leaves every non-shadow attribute default exactly as the current schema declares it', () => {
		Object.keys(metadata.attributes)
			.filter((key) => !(key in LEGACY_SHADOW_DEFAULTS))
			.forEach((key) => expect(attributes[key]).toEqual(metadata.attributes[key]));
	});

	it("declares the block's own supports, so support-gated attribute filters still apply", () => {
		expect(supports).toEqual(metadata.supports);
	});

	it('is eligible when the legacy data arrives through the attributes argument alone', () => {
		expect(isEligible({ displayShadow: true }, [], undefined)).toBe(true);
		expect(isEligible({ displayHoverShadowSticky: false })).toBe(true);
	});

	it('is eligible when the legacy data arrives through the raw parsed block node', () => {
		const raw = { text: 'Click Me!', displayShadow: false };

		expect(isEligible(schemaFiltered(raw), [], { blockNode: { attrs: raw } })).toBe(true);
	});

	it('is eligible when the legacy data arrives through the created block object', () => {
		const raw = { text: 'Click Me!', displayHoverShadowSticky: false };

		expect(isEligible(schemaFiltered(raw), [], { block: { name: 'kadence/singlebtn', attrs: raw } })).toBe(true);
	});

	it('is not eligible for an already-migrated block, whichever source is consulted', () => {
		const raw = { text: 'Click Me!', shadow: [{ ...NONE_ITEM }] };

		expect(isEligible(raw, [], { blockNode: { attrs: raw }, block: { attrs: raw } })).toBe(false);
		expect(isEligible({ text: 'Click Me!' }, [], {})).toBe(false);
		expect(isEligible({ text: 'Click Me!' }, [], undefined)).toBe(false);
		expect(isEligible(undefined, [], undefined)).toBe(false);
	});

	it('rewrites a toggled-off value to the explicit None composite and drops the toggle', () => {
		const next = migrate({
			text: 'Click Me!',
			displayShadow: false,
			shadow: [{ color: '#000000', opacity: 0.2, hOffset: 1, vOffset: 1, blur: 2, spread: 0, inset: false }],
		});

		expect(next.shadow).toEqual([NONE_ITEM]);
		expect(next).not.toHaveProperty('displayShadow');
		expect(next.text).toBe('Click Me!');
	});

	it('leaves a toggled-on value untouched, only dropping the toggle', () => {
		const original = [{ color: '#ff0000', opacity: 1, hOffset: 2, vOffset: 2, blur: 4, spread: 0, inset: false }];

		const next = migrate({ displayShadow: true, shadow: original });

		expect(next.shadow).toEqual(original);
		expect(next).not.toHaveProperty('displayShadow');
	});

	it('treats a missing toggle attribute (very old data) as toggle-off', () => {
		const next = migrate({ shadow: [{ color: '#000000', hOffset: 1, vOffset: 1, blur: 2, spread: 0 }] });

		expect(next.shadow).toEqual([NONE_ITEM]);
	});

	it('migrates all six pairs independently', () => {
		const next = migrate({
			displayShadow: true,
			displayHoverShadow: false,
			displayShadowTransparent: false,
			displayHoverShadowTransparent: true,
			displayShadowSticky: false,
			displayHoverShadowSticky: false,
			shadow: [{ color: '#111', hOffset: 1, vOffset: 1, blur: 1, spread: 0 }],
			shadowHover: [{ color: '#222', hOffset: 2, vOffset: 2, blur: 2, spread: 0 }],
			shadowTransparent: [{ color: '#333', hOffset: 3, vOffset: 3, blur: 3, spread: 0 }],
			shadowTransparentHover: [{ color: '#444', hOffset: 4, vOffset: 4, blur: 4, spread: 0 }],
			shadowSticky: [{ color: '#555', hOffset: 5, vOffset: 5, blur: 5, spread: 0 }],
			shadowStickyHover: [{ color: '#666', hOffset: 6, vOffset: 6, blur: 6, spread: 0 }],
		});

		expect(next.shadow).not.toEqual([NONE_ITEM]); // toggle was true — untouched
		expect(next.shadowHover).toEqual([NONE_ITEM]);
		expect(next.shadowTransparent).toEqual([NONE_ITEM]);
		expect(next.shadowTransparentHover).not.toEqual([NONE_ITEM]); // toggle was true — untouched
		expect(next.shadowSticky).toEqual([NONE_ITEM]);
		expect(next.shadowStickyHover).toEqual([NONE_ITEM]);
		TOGGLE_ATTRIBUTES.forEach((attr) => expect(next).not.toHaveProperty(attr));
	});

	it('preserves every unrelated attribute it is handed', () => {
		const next = migrate({ text: 'Buy now', link: 'https://example.com', color: '#123456', displayShadow: false });

		expect(next.text).toBe('Buy now');
		expect(next.link).toBe('https://example.com');
		expect(next.color).toBe('#123456');
	});
});
