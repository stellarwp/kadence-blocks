/* eslint-env jest */
import { isEmptyValue, matchesPreset } from '../../normalize';

describe('isEmptyValue border', () => {
	it('treats an undefined native border value as empty for every axis', () => {
		expect(isEmptyValue('border-width', undefined)).toBe(true);
		expect(isEmptyValue('border-style', undefined)).toBe(true);
		expect(isEmptyValue('border-color', undefined)).toBe(true);
	});

	it('treats an empty-array native border value as empty for every axis', () => {
		expect(isEmptyValue('border-width', [])).toBe(true);
		expect(isEmptyValue('border-style', [])).toBe(true);
		expect(isEmptyValue('border-color', [])).toBe(true);
	});

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

	it('does not match an unset native border value for any axis', () => {
		expect(matchesPreset('border-width', undefined, '', '2px')).toBe(false);
		expect(matchesPreset('border-style', undefined, '', 'solid')).toBe(false);
		expect(matchesPreset('border-color', undefined, '', '#3182ce')).toBe(false);
	});

	it('matches a native border value equal on every side, per axis', () => {
		expect(matchesPreset('border-width', UNIFORM, '', '2px')).toBe(true);
		expect(matchesPreset('border-style', UNIFORM, '', 'solid')).toBe(true);
		expect(matchesPreset('border-color', UNIFORM, '', '#3182ce')).toBe(true);
	});

	it('does not match a native border value diverging on one side, per axis', () => {
		expect(matchesPreset('border-width', DIVERGENT, '', '2px')).toBe(false);
		expect(matchesPreset('border-style', DIVERGENT, '', 'solid')).toBe(false);
		expect(matchesPreset('border-color', DIVERGENT, '', '#3182ce')).toBe(false);
	});

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
