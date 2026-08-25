/* eslint-env jest */
import { isEmptyValue, matchesPreset } from '../../normalize';

describe('isEmptyValue border', () => {
	/**
	 * A never-written native border value (`undefined`) reads as empty for every axis, matching
	 * `fromNativeBorder`'s own `!source` short-circuit.
	 *
	 * @return {void}
	 */
	it('treats an undefined native border value as empty for every axis', () => {
		expect(isEmptyValue('border-width', undefined)).toBe(true);
		expect(isEmptyValue('border-style', undefined)).toBe(true);
		expect(isEmptyValue('border-color', undefined)).toBe(true);
	});

	/**
	 * A never-written native border value stored as an empty array reads as empty for every axis, the
	 * shape `resetAttrPatch`'s own `'border'` case resets to.
	 *
	 * @return {void}
	 */
	it('treats an empty-array native border value as empty for every axis', () => {
		expect(isEmptyValue('border-width', [])).toBe(true);
		expect(isEmptyValue('border-style', [])).toBe(true);
		expect(isEmptyValue('border-color', [])).toBe(true);
	});

	/**
	 * A written native border value reads as not empty for every axis even when every side's slots are
	 * blank strings — the moment any side is written, `toNativeBorder` always fills in all four, so
	 * "empty" is a single source-level check, not per-side.
	 *
	 * @return {void}
	 */
	it('treats a written native border value as not empty for every axis, even with all-blank sides', () => {
		const value = [
			{
				top: ['', '', ''],
				right: ['', '', ''],
				bottom: ['', '', ''],
				left: ['', '', ''],
				unit: 'px',
			},
		];

		expect(isEmptyValue('border-width', value)).toBe(false);
		expect(isEmptyValue('border-style', value)).toBe(false);
		expect(isEmptyValue('border-color', value)).toBe(false);
	});
});

describe('matchesPreset border', () => {
	const UNIFORM = [
		{
			top: ['#3182ce', 'solid', '2'],
			right: ['#3182ce', 'solid', '2'],
			bottom: ['#3182ce', 'solid', '2'],
			left: ['#3182ce', 'solid', '2'],
			unit: 'px',
		},
	];

	const DIVERGENT = [
		{
			top: ['#3182ce', 'solid', '2'],
			right: ['#3182ce', 'solid', '2'],
			bottom: ['#3182ce', 'solid', '2'],
			left: ['#ffffff', 'dashed', '4'],
			unit: 'px',
		},
	];

	/**
	 * A never-written native border value never matches a preset, for any axis — `isEmptyValue` is the
	 * signal for "bound", not `matchesPreset`, which only ever runs once `empty` is already false.
	 *
	 * @return {void}
	 */
	it('does not match an unset native border value for any axis', () => {
		expect(matchesPreset('border-width', undefined, '', '2px')).toBe(false);
		expect(matchesPreset('border-style', undefined, '', 'solid')).toBe(false);
		expect(matchesPreset('border-color', undefined, '', '#3182ce')).toBe(false);
	});

	/**
	 * A native border value equal to the preset on every side matches, for every axis.
	 *
	 * @return {void}
	 */
	it('matches a native border value equal on every side, per axis', () => {
		expect(matchesPreset('border-width', UNIFORM, '', '2px')).toBe(true);
		expect(matchesPreset('border-style', UNIFORM, '', 'solid')).toBe(true);
		expect(matchesPreset('border-color', UNIFORM, '', '#3182ce')).toBe(true);
	});

	/**
	 * A native border value diverging on one side does not match, for every axis — the compare is
	 * side-aware, not just first-side.
	 *
	 * @return {void}
	 */
	it('does not match a native border value diverging on one side, per axis', () => {
		expect(matchesPreset('border-width', DIVERGENT, '', '2px')).toBe(false);
		expect(matchesPreset('border-style', DIVERGENT, '', 'solid')).toBe(false);
		expect(matchesPreset('border-color', DIVERGENT, '', '#3182ce')).toBe(false);
	});

	/**
	 * A border-width side stored as a token alias matches the same alias literal directly, without
	 * being parsed as a numeric dimension.
	 *
	 * @return {void}
	 */
	it('matches a border-width side written as a token alias against the same alias literal', () => {
		const value = [
			{
				top: ['#3182ce', 'solid', '{primitive.dimension.border-width.md}'],
				right: ['#3182ce', 'solid', '{primitive.dimension.border-width.md}'],
				bottom: ['#3182ce', 'solid', '{primitive.dimension.border-width.md}'],
				left: ['#3182ce', 'solid', '{primitive.dimension.border-width.md}'],
				unit: 'px',
			},
		];

		expect(matchesPreset('border-width', value, '', '{primitive.dimension.border-width.md}')).toBe(true);
	});
});
