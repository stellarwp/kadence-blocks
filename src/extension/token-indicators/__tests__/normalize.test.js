/* eslint-env jest */
import {
	anyCornerInherited,
	deriveMeasureMode,
	inheritedMeasureSlots,
	measureAttrsForDevice,
	isEmptyValue,
	matchesPreset,
	normalizeColor,
	normalizeDimension,
	presetValueForDevice,
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

describe('inheritedMeasureSlots', () => {
	const DESKTOP = ['8', '4', '8', '4'];
	const TABLET = ['2', '', '2', ''];

	it('inherits the preset on Desktop, which has no wider breakpoint', () => {
		const read = inheritedMeasureSlots('Desktop', { desktop: DESKTOP, tablet: TABLET }, '0.5rem');

		expect(read.values).toEqual(['0.5rem', '0.5rem', '0.5rem', '0.5rem']);
		expect(read.inherited).toEqual([false, false, false, false]);
	});

	it('spreads a per-corner preset across the Desktop corners', () => {
		const read = inheritedMeasureSlots('Desktop', {}, ['0', '0.125rem', '9999px', '1rem']);

		expect(read.values).toEqual(['0', '0.125rem', '9999px', '1rem']);
	});

	it('inherits the desktop corners on Tablet rather than the preset', () => {
		const read = inheritedMeasureSlots('Tablet', { desktop: DESKTOP }, '0.5rem');

		expect(read.values).toEqual(['8', '4', '8', '4']);
		expect(read.inherited).toEqual([true, true, true, true]);
	});

	it('falls through an empty desktop corner to the preset, corner by corner', () => {
		const read = inheritedMeasureSlots('Tablet', { desktop: ['8', '', '8', ''] }, '0.5rem');

		expect(read.values).toEqual(['8', '0.5rem', '8', '0.5rem']);
		expect(read.inherited).toEqual([true, false, true, false]);
	});

	it('prefers tablet over desktop on Mobile, per corner', () => {
		const read = inheritedMeasureSlots('Mobile', { desktop: DESKTOP, tablet: TABLET }, '0.5rem');

		expect(read.values).toEqual(['2', '4', '2', '4']);
		expect(read.inherited).toEqual([true, true, true, true]);
	});

	it('ignores the device its own value, so a corner never inherits from itself', () => {
		// Desktop stores four corners; asking for Desktop still resolves to the preset.
		const read = inheritedMeasureSlots('Desktop', { desktop: DESKTOP }, '3px');

		expect(read.values).toEqual(['3px', '3px', '3px', '3px']);
	});
});

describe('anyCornerInherited', () => {
	/**
	 * On Desktop every corner resolves straight to the preset, so the row-level label must read as
	 * "Default" rather than "Inherited" — a bare `!!inherited` on the four-element array would report
	 * `true` here regardless of its contents, which is the bug this guards against.
	 *
	 * @return {void}
	 */
	it('is false when no corner is inherited', () => {
		expect(anyCornerInherited([false, false, false, false])).toBe(false);
	});

	/**
	 * A mixed row — one corner pulled from another breakpoint, the rest resolved to the preset — still
	 * counts as inherited, since the control shows only one label for all four corners.
	 *
	 * @return {void}
	 */
	it('is true when only some corners are inherited', () => {
		expect(anyCornerInherited([true, false, true, false])).toBe(true);
	});

	/**
	 * Every corner inheriting is also reported as inherited.
	 *
	 * @return {void}
	 */
	it('is true when every corner is inherited', () => {
		expect(anyCornerInherited([true, true, true, true])).toBe(true);
	});

	/**
	 * A missing or malformed array degrades to "not inherited" instead of throwing.
	 *
	 * @return {void}
	 */
	it('is false for a non-array input', () => {
		expect(anyCornerInherited(undefined)).toBe(false);
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

describe('normalizeDimension', () => {
	it('returns an empty marker for an all-empty array', () => {
		expect(normalizeDimension(['', '', '', ''], 'px')).toEqual({ value: '', unit: '' });
	});

	it('pairs the first populated side with its unit', () => {
		expect(normalizeDimension(['8', '8', '8', '8'], 'px')).toEqual({ value: '8', unit: 'px' });
	});
});

describe('presetValueForDevice', () => {
	it('takes the preset base value on Desktop, even when breakpoints are declared', () => {
		expect(presetValueForDevice('0.5rem', { tablet: '9999px', mobile: '1rem' }, 'Desktop')).toBe('0.5rem');
	});

	it('takes the tablet override on Tablet', () => {
		expect(presetValueForDevice('0.5rem', { tablet: '9999px' }, 'Tablet')).toBe('9999px');
	});

	it('falls back to the base on Tablet when the preset declares no tablet override', () => {
		expect(presetValueForDevice('0.5rem', { mobile: '1rem' }, 'Tablet')).toBe('0.5rem');
	});

	it('falls back through tablet to the base on Mobile', () => {
		expect(presetValueForDevice('0.5rem', { tablet: '9999px' }, 'Mobile')).toBe('9999px');
		expect(presetValueForDevice('0.5rem', {}, 'Mobile')).toBe('0.5rem');
	});

	it('keeps a per-corner override list intact', () => {
		const corners = ['9999px', '1rem', '1rem', '1rem'];

		expect(presetValueForDevice('0.5rem', { tablet: corners }, 'Tablet')).toEqual(corners);
	});

	it('degrades to the base value with no responsive map at all', () => {
		expect(presetValueForDevice('0.5rem', undefined, 'Mobile')).toBe('0.5rem');
	});
});
