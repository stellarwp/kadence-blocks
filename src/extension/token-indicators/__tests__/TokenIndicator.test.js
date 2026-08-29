/* eslint-env jest */

/**
 * The per-control preset indicator's three display states, and specifically which of them each half of
 * `state` gates.
 *
 * `bound` does NOT mean "the preset resolves a value here" — it means the preset has its own STORED
 * override for the property, which a preset shipped in `baseline.json` never has. Every block's
 * `$default` preset is shipped that way, so gating the whole indicator on `bound` hid the override
 * mark on a fresh site until someone re-saved the preset in the Style Library. These tests pin the
 * split: the override dot needs only `overridden`, the matching glyph needs `bound` as well.
 *
 * `TokenIndicator` holds no hooks, so it is called as a plain function and its returned element tree
 * inspected, matching the sibling component tests rather than mounting.
 */

/**
 * Internal dependencies
 */
import { TokenIndicator } from '../components/TokenIndicator';

/**
 * Collect every `className` in a returned element tree, so a test can assert which mark rendered
 * without depending on the tree's nesting.
 *
 * @param {*} node The element (or child) to walk.
 *
 * @since TBD
 *
 * @return {string[]} Every className found, in traversal order.
 */
function classNames(node) {
	if (!node || typeof node !== 'object') {
		return [];
	}

	if (Array.isArray(node)) {
		return node.flatMap(classNames);
	}

	const own = node.props?.className ? [node.props.className] : [];

	return [...own, ...classNames(node.props?.children)];
}

describe('TokenIndicator', () => {
	/**
	 * A control the selected preset resolves no value for renders nothing at all.
	 *
	 * @return {void}
	 */
	it('renders nothing when the control is unmapped', () => {
		expect(TokenIndicator({ state: undefined, onReset: jest.fn() })).toBeNull();
	});

	/**
	 * The override dot renders on a diverged value even when the preset only inherits the property from
	 * the baseline rather than storing its own override. This is the shipped-`$default` case that made
	 * the mark unreachable on a fresh site.
	 *
	 * @return {void}
	 */
	it('shows the override dot for a diverged value the preset does not own', () => {
		const result = TokenIndicator({ state: { bound: false, overridden: true }, onReset: jest.fn() });

		expect(classNames(result)).toContain('kb-token-indicator__dot');
	});

	/**
	 * The same divergence on a preset that does own the property is unchanged — the dot was always
	 * reachable here, and stays so.
	 *
	 * @return {void}
	 */
	it('shows the override dot for a diverged value the preset does own', () => {
		const result = TokenIndicator({ state: { bound: true, overridden: true }, onReset: jest.fn() });

		expect(classNames(result)).toContain('kb-token-indicator__dot');
	});

	/**
	 * The reset affordance accompanies the dot, so a diverged control can always be returned to the
	 * value the preset resolves — which is exactly the value clearing the attribute falls back to.
	 *
	 * @return {void}
	 */
	it('offers a reset alongside the override dot', () => {
		const onReset = jest.fn();
		const result = TokenIndicator({ state: { bound: false, overridden: true }, onReset });

		expect(classNames(result)).toContain('kb-token-indicator__reset');
	});

	/**
	 * A matching value on a preset that owns the property shows the design-system glyph.
	 *
	 * @return {void}
	 */
	it('shows the matching glyph when the value matches a preset that owns it', () => {
		const result = TokenIndicator({ state: { bound: true, overridden: false }, onReset: jest.fn() });

		expect(classNames(result)).toContain('kb-token-indicator__linked');
	});

	/**
	 * A matching value the preset merely inherits from the baseline shows nothing: the glyph asserts the
	 * field is linked to THIS preset, which a preset that stores nothing of its own cannot claim. That
	 * case reads as a muted default on the field instead.
	 *
	 * @return {void}
	 */
	it('shows nothing when a matching value is only inherited from the baseline', () => {
		expect(TokenIndicator({ state: { bound: false, overridden: false }, onReset: jest.fn() })).toBeNull();
	});

	/**
	 * A control whose own header already carries a reset passes `showReset={false}`, which suppresses
	 * the matching glyph so only the dot-only label path remains.
	 *
	 * @return {void}
	 */
	it('suppresses the matching glyph when the control renders its own reset', () => {
		const result = TokenIndicator({
			state: { bound: true, overridden: false },
			onReset: jest.fn(),
			showReset: false,
		});

		expect(result).toBeNull();
	});
});
