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
	 * The shape every `borderStyle` block.json default ships — an object whose every side slot is
	 * blank — reads as empty for every axis. Nothing the control writes ever looks like this
	 * (`toNativeBorder` always fills the style slot with at least 'none'), so a blank-everywhere source
	 * can only be the untouched default, and a fresh block must read as bound, not overridden.
	 *
	 * @return {void}
	 */
	it('treats a native border value whose every side slot is blank as empty for every axis', () => {
		const value = [
			{
				top: ['', '', ''],
				right: ['', '', ''],
				bottom: ['', '', ''],
				left: ['', '', ''],
				unit: 'px',
			},
		];

		expect(isEmptyValue('border-width', value)).toBe(true);
		expect(isEmptyValue('border-style', value)).toBe(true);
		expect(isEmptyValue('border-color', value)).toBe(true);
	});

	/**
	 * One written slot anywhere makes the whole value "written" for every axis — the three axes share
	 * one attribute, and the control has no per-axis reset, so a border with only a width set is not
	 * empty for color or style either.
	 *
	 * @return {void}
	 */
	it('treats a native border value with one written slot as not empty for every axis', () => {
		const value = [
			{
				top: ['', '', 2],
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

	/**
	 * A side stored as a bare string instead of a `[color, style, size]` tuple is not a written slot: the
	 * scan skips it rather than throwing on a value with no `.some`, and the value reads as empty.
	 *
	 * @return {void}
	 */
	it('treats a native border value whose side is a non-array as empty rather than throwing', () => {
		const value = [
			{
				top: 'solid',
				right: ['', '', ''],
				bottom: ['', '', ''],
				left: ['', '', ''],
				unit: 'px',
			},
		];

		expect(() => isEmptyValue('border-style', value)).not.toThrow();
		expect(isEmptyValue('border-width', value)).toBe(true);
		expect(isEmptyValue('border-style', value)).toBe(true);
		expect(isEmptyValue('border-color', value)).toBe(true);
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
	 * The all-blank default never matches a preset either — it is empty, and empty is reported as
	 * bound by the caller, never as a match.
	 *
	 * @return {void}
	 */
	it('does not match a native border value whose every side slot is blank, for any axis', () => {
		const value = [
			{
				top: ['', '', ''],
				right: ['', '', ''],
				bottom: ['', '', ''],
				left: ['', '', ''],
				unit: 'px',
			},
		];

		expect(matchesPreset('border-width', value, '', '1px')).toBe(false);
		expect(matchesPreset('border-style', value, '', 'none')).toBe(false);
		expect(matchesPreset('border-color', value, '', '')).toBe(false);
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
