/* eslint-env jest */
import {
	deriveMeasureMode,
	measureAttrsForDevice,
	isEmptyValue,
	matchesPreset,
	normalizeColor,
	normalizeDimension,
} from '../normalize';

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

describe('deriveMeasureMode', () => {
	it('reads all-empty corners on a scalar preset as linked', () => {
		expect(deriveMeasureMode(['', '', '', ''], '0.5rem')).toBe('linked');
	});

	it('reads all-empty corners on a per-corner preset as individual', () => {
		expect(deriveMeasureMode(['', '', '', ''], ['0', '0.125rem', '9999px', '1rem'])).toBe('individual');
	});

	it('reads all-empty corners on a uniform per-corner preset as linked', () => {
		expect(deriveMeasureMode(['', '', '', ''], ['8px', '8px', '8px', '8px'])).toBe('linked');
	});

	it('reads equal stored corners as linked whatever the preset holds', () => {
		expect(deriveMeasureMode(['8', '8', '8', '8'], ['0', '0.125rem', '9999px', '1rem'])).toBe('linked');
	});

	it('reads a differing stored corner as individual', () => {
		expect(deriveMeasureMode(['8', '8', '8', '4'], '0.5rem')).toBe('individual');
	});

	it('reads one overridden corner against an inherited scalar as individual', () => {
		expect(deriveMeasureMode(['{primitive.dimension.radius.lg}', '', '', ''], '0.5rem')).toBe('individual');
	});

	it('reads a single-slot preset as applying to every corner', () => {
		expect(deriveMeasureMode(['', '', '', ''], ['8px'])).toBe('linked');
	});

	it('reads an unset value with no preset as linked', () => {
		expect(deriveMeasureMode(undefined, undefined)).toBe('linked');
		expect(deriveMeasureMode(['', '', '', ''], '')).toBe('linked');
	});
});

describe('measureAttrsForDevice', () => {
	const ATTRS = {
		borderRadius: ['8', '8', '8', '8'],
		tabletBorderRadius: ['8', '4', '8', '4'],
		mobileBorderRadius: ['', '', '', ''],
	};
	const RESPONSIVE = { tablet: 'tabletBorderRadius', mobile: 'mobileBorderRadius' };

	it('reads the desktop attribute for Desktop', () => {
		expect(measureAttrsForDevice(ATTRS, 'borderRadius', RESPONSIVE, 'Desktop').value).toEqual(['8', '8', '8', '8']);
		expect(measureAttrsForDevice(ATTRS, 'borderRadius', RESPONSIVE, 'Desktop').attr).toBe('borderRadius');
	});

	it('reads the tablet attribute for Tablet', () => {
		const read = measureAttrsForDevice(ATTRS, 'borderRadius', RESPONSIVE, 'Tablet');

		expect(read.value).toEqual(['8', '4', '8', '4']);
		expect(read.attr).toBe('tabletBorderRadius');
	});

	it('reads the mobile attribute for Mobile', () => {
		const read = measureAttrsForDevice(ATTRS, 'borderRadius', RESPONSIVE, 'Mobile');

		expect(read.value).toEqual(['', '', '', '']);
		expect(read.attr).toBe('mobileBorderRadius');
	});

	it('falls back to the desktop attribute when the device has no mapping', () => {
		const read = measureAttrsForDevice(ATTRS, 'borderRadius', {}, 'Tablet');

		expect(read.attr).toBe('borderRadius');
	});

	it('derives the mode per device, so breakpoints can differ', () => {
		// Desktop corners are equal (linked) while tablet corners differ (individual).
		expect(deriveMeasureMode(measureAttrsForDevice(ATTRS, 'borderRadius', RESPONSIVE, 'Desktop').value, '')).toBe(
			'linked'
		);
		expect(deriveMeasureMode(measureAttrsForDevice(ATTRS, 'borderRadius', RESPONSIVE, 'Tablet').value, '')).toBe(
			'individual'
		);
	});
});

describe('matchesPreset dimension against a per-corner preset value', () => {
	it('matches when every corner equals its preset slot', () => {
		expect(matchesPreset('dimension', ['8', '4', '8', '4'], 'px', ['8px', '4px', '8px', '4px'])).toBe(true);
	});

	it('does not match when one corner differs from its preset slot', () => {
		expect(matchesPreset('dimension', ['8', '4', '8', '2'], 'px', ['8px', '4px', '8px', '4px'])).toBe(false);
	});

	it('does not match when the corners are positionally rotated', () => {
		expect(matchesPreset('dimension', ['4', '8', '4', '8'], 'px', ['8px', '4px', '8px', '4px'])).toBe(false);
	});

	it('matches a uniform stored value against a single-slot preset value', () => {
		expect(matchesPreset('dimension', ['8', '8', '8', '8'], 'px', ['8px'])).toBe(true);
	});

	it('does not match when the unit differs from the preset slots', () => {
		expect(matchesPreset('dimension', ['8', '4', '8', '4'], 'rem', ['8px', '4px', '8px', '4px'])).toBe(false);
	});

	it('does not match a scalar stored value against a mixed per-corner preset value', () => {
		expect(matchesPreset('dimension', '8', 'px', ['8px', '4px', '8px', '4px'])).toBe(false);
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
