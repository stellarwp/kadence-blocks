/* eslint-env jest */
import { isEmptyValue, matchesPreset, normalizeColor, normalizeDimension } from '../normalize';

describe('normalizeColor', () => {
	beforeEach(() => {
		window.kadence_blocks_params = {
			global_colors: {
				'--global-palette1': '#3182CE',
				'--global-palette3': '#1A202C',
			},
		};
	});

	afterEach(() => {
		delete window.kadence_blocks_params;
	});

	it('resolves a paletteN slug to its mapped literal, lower-cased', () => {
		expect(normalizeColor('palette1')).toBe('#3182ce');
	});

	it('passes a literal through, lower-cased', () => {
		expect(normalizeColor('#3182CE')).toBe('#3182ce');
	});

	it('passes an unresolved slug through as itself (degrade safe)', () => {
		expect(normalizeColor('palette9')).toBe('palette9');
	});

	it('returns an empty string for an empty value', () => {
		expect(normalizeColor('')).toBe('');
	});
});

describe('matchesPreset color', () => {
	beforeEach(() => {
		window.kadence_blocks_params = {
			global_colors: { '--global-palette3': '#3182CE' },
		};
	});

	afterEach(() => {
		delete window.kadence_blocks_params;
	});

	it('matches when a stored palette slug resolves to the preset literal', () => {
		expect(matchesPreset('color', 'palette3', '', '#3182ce')).toBe(true);
	});

	it('does not match when the stored literal differs from the preset literal', () => {
		expect(matchesPreset('color', '#ffffff', '', '#3182ce')).toBe(false);
	});
});

describe('matchesPreset dimension', () => {
	it('matches a uniform 4-side array against the preset value + unit', () => {
		expect(matchesPreset('dimension', ['8', '8', '8', '8'], 'px', '8px')).toBe(true);
	});

	it('matches a scalar value against the preset value + unit', () => {
		expect(matchesPreset('dimension', '8', 'px', '8px')).toBe(true);
	});

	it('does not match a per-corner override where one side differs', () => {
		expect(matchesPreset('dimension', ['8', '8', '8', '4'], 'px', '8px')).toBe(false);
	});

	it('does not match when the value matches but the unit differs', () => {
		expect(matchesPreset('dimension', ['8', '8', '8', '8'], 'rem', '8px')).toBe(false);
	});

	it('does not match a different value with the same unit', () => {
		expect(matchesPreset('dimension', ['8', '8', '8', '8'], 'px', '1.5rem')).toBe(false);
	});
});

describe('matchesPreset text', () => {
	it('matches trimmed equal strings', () => {
		expect(matchesPreset('text', ' bold ', '', 'bold')).toBe(true);
	});

	it('does not match differing strings', () => {
		expect(matchesPreset('text', 'bold', '', 'normal')).toBe(false);
	});
});

describe('isEmptyValue', () => {
	it('treats an empty color string as empty', () => {
		expect(isEmptyValue('color', '')).toBe(true);
	});

	it('treats an all-empty 4-side dimension array as empty', () => {
		expect(isEmptyValue('dimension', ['', '', '', ''])).toBe(true);
	});

	it('treats a populated dimension side as not empty', () => {
		expect(isEmptyValue('dimension', ['8', '', '', ''])).toBe(false);
	});

	it('treats a populated color as not empty', () => {
		expect(isEmptyValue('color', 'palette3')).toBe(false);
	});
});

describe('normalizeDimension', () => {
	it('returns an empty marker for an all-empty array', () => {
		expect(normalizeDimension(['', '', '', ''], 'px')).toEqual({ value: '', unit: '' });
	});

	it('pairs the first populated side with its unit', () => {
		expect(normalizeDimension(['8', '8', '8', '8'], 'px')).toEqual({ value: '8', unit: 'px' });
	});
});
