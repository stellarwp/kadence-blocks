/* eslint-env jest */

import { tokensForSlot } from '../BoxControl';

const TOKENS = [
	{ id: 'primitive.dimension.spacing.none', alias: '{primitive.dimension.spacing.none}' },
	{ id: 'primitive.dimension.spacing.xxs', alias: '{primitive.dimension.spacing.xxs}' },
	{ id: 'semantic.spacing.button-padding-top', alias: '{semantic.spacing.button-padding-top}' },
	{ id: 'semantic.spacing.button-padding-right', alias: '{semantic.spacing.button-padding-right}' },
	{ id: 'semantic.spacing.button-padding-bottom', alias: '{semantic.spacing.button-padding-bottom}' },
	{ id: 'semantic.spacing.button-padding-left', alias: '{semantic.spacing.button-padding-left}' },
];

describe('tokensForSlot', () => {
	/**
	 * The linked slot (`index === null`) has only one value to compare against, so it is handed the
	 * shared pool untouched rather than filtered against itself.
	 *
	 * @return {void}
	 */
	it('returns the pool unfiltered for the linked slot', () => {
		const value = '{semantic.spacing.button-padding-top}';

		expect(tokensForSlot(TOKENS, value, null, value)).toBe(TOKENS);
	});

	/**
	 * Each corner bound to a different sibling-specific token should not see the other three
	 * corners' own tokens in its own picker — only the generic scale plus its own current value.
	 *
	 * @return {void}
	 */
	it('drops sibling slots’ own bound tokens from an unlinked slot’s pool', () => {
		const value = [
			'{semantic.spacing.button-padding-top}',
			'{semantic.spacing.button-padding-right}',
			'{semantic.spacing.button-padding-bottom}',
			'{semantic.spacing.button-padding-left}',
		];

		const forTop = tokensForSlot(TOKENS, value, 0, value[0]);

		expect(forTop.map((token) => token.id)).toEqual([
			'primitive.dimension.spacing.none',
			'primitive.dimension.spacing.xxs',
			'semantic.spacing.button-padding-top',
		]);
	});

	/**
	 * A token equal to the slot's OWN current value is never dropped, even though it also appears in
	 * the sibling-value comparison set by construction (a slot's own value is excluded from that set
	 * up front).
	 *
	 * @return {void}
	 */
	it('keeps a token that matches two corners sharing the same bound value', () => {
		const value = [
			'{semantic.spacing.button-padding-top}',
			'{semantic.spacing.button-padding-top}',
			'{semantic.spacing.button-padding-bottom}',
			'{semantic.spacing.button-padding-left}',
		];

		const forTop = tokensForSlot(TOKENS, value, 0, value[0]);
		const forRight = tokensForSlot(TOKENS, value, 1, value[1]);

		expect(forTop.some((token) => token.id === 'semantic.spacing.button-padding-top')).toBe(true);
		expect(forRight.some((token) => token.id === 'semantic.spacing.button-padding-top')).toBe(true);
	});

	/**
	 * A scalar (uniform) value reads the same for every slot index, so no sibling comparison ever
	 * finds a differing value and the pool passes through unfiltered.
	 *
	 * @return {void}
	 */
	it('returns the pool unfiltered when the whole value is still a uniform scalar', () => {
		const value = '{semantic.spacing.button-padding-top}';

		expect(tokensForSlot(TOKENS, value, 0, value)).toBe(TOKENS);
	});
});
