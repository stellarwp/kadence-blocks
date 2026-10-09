/* eslint-env jest */
import { normalizeColor } from '../color';
import { isEmptyValue, matchesPreset } from '../../normalize';

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

describe('isEmptyValue color', () => {
	it('treats an empty color string as empty', () => {
		expect(isEmptyValue('color', '')).toBe(true);
	});

	it('treats a populated color as not empty', () => {
		expect(isEmptyValue('color', 'palette3')).toBe(false);
	});
});
