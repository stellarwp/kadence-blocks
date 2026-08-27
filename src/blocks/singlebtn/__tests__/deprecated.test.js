/* eslint-env jest */

/**
 * Internal dependencies
 */
import deprecated from '../deprecated';

const [{ isEligible, migrate }] = deprecated;

/**
 * A representative visible native shadow value, matching what a real shadow composite resolves to.
 *
 * @since TBD
 */
const VISIBLE_SHADOW = [{ color: '#000000', opacity: 0.5, hOffset: 0, vOffset: 2, blur: 8, spread: 0, inset: false }];

describe('singlebtn deprecated migration: stale toggled-off shadow values', () => {
	/**
	 * A block with every toggle already consistent with its value (off and empty, or on with a real
	 * value) is not eligible — there is nothing stale to clean up.
	 *
	 * @return {void}
	 */
	it('reports ineligible when every toggle/value pair is already consistent', () => {
		expect(
			isEligible({
				displayShadow: false,
				shadow: [],
				displayHoverShadow: true,
				shadowHover: VISIBLE_SHADOW,
			})
		).toBe(false);
	});

	/**
	 * A toggle reading off while its paired value still carries a real, non-zero shadow is exactly
	 * the stale case this migration exists for.
	 *
	 * @return {void}
	 */
	it('reports eligible when a toggled-off pair still carries a visible shadow', () => {
		expect(isEligible({ displayShadow: false, shadow: VISIBLE_SHADOW })).toBe(true);
	});

	/**
	 * Every one of the six independent toggle/value pairs is checked, not just the normal-state one.
	 *
	 * @return {void}
	 */
	it.each([
		['displayShadow', 'shadow'],
		['displayHoverShadow', 'shadowHover'],
		['displayShadowTransparent', 'shadowTransparent'],
		['displayHoverShadowTransparent', 'shadowTransparentHover'],
		['displayShadowSticky', 'shadowSticky'],
		['displayHoverShadowSticky', 'shadowStickyHover'],
	])('reports eligible for the %s / %s pair specifically', (toggleKey, valueKey) => {
		expect(isEligible({ [toggleKey]: false, [valueKey]: VISIBLE_SHADOW })).toBe(true);
	});

	/**
	 * A toggle reading on is never stale, regardless of what its value holds — "on" is a real,
	 * intentional choice, not leftover data from before a toggle-off.
	 *
	 * @return {void}
	 */
	it('never reports eligible for a pair whose toggle reads on', () => {
		expect(isEligible({ displayShadow: true, shadow: VISIBLE_SHADOW })).toBe(false);
	});

	/**
	 * A toggled-off pair whose value already has no visible footprint (already clean) is not stale —
	 * nothing to migrate there either.
	 *
	 * @return {void}
	 */
	it('does not report eligible for a toggled-off pair whose value is already zero-footprint', () => {
		expect(
			isEligible({
				displayShadow: false,
				shadow: [{ color: '#000000', opacity: 1, hOffset: 0, vOffset: 0, blur: 0, spread: 0, inset: false }],
			})
		).toBe(false);
	});

	/**
	 * `migrate` nulls out only the stale pair's value, leaving every other attribute — including the
	 * toggle itself — untouched.
	 *
	 * @return {void}
	 */
	it('nulls out only the stale pair, leaving the toggle and every other attribute untouched', () => {
		const migrated = migrate({
			displayShadow: false,
			shadow: VISIBLE_SHADOW,
			displayHoverShadow: true,
			shadowHover: VISIBLE_SHADOW,
			text: 'Click me',
		});

		expect(migrated).toEqual({
			displayShadow: false,
			shadow: [],
			displayHoverShadow: true,
			shadowHover: VISIBLE_SHADOW,
			text: 'Click me',
		});
	});

	/**
	 * Multiple stale pairs in the same block are all cleaned up in one migration pass, not just the
	 * first one found.
	 *
	 * @return {void}
	 */
	it('nulls out every stale pair when more than one is affected', () => {
		const migrated = migrate({
			displayShadow: false,
			shadow: VISIBLE_SHADOW,
			displayShadowSticky: false,
			shadowSticky: VISIBLE_SHADOW,
		});

		expect(migrated.shadow).toEqual([]);
		expect(migrated.shadowSticky).toEqual([]);
	});
});
