/* eslint-env jest */
import { cycleFieldsView, deriveFieldsChange, toCssColor } from '../helpers/color-picker';

describe('toCssColor', () => {
	it('returns a 6-digit hex for a fully opaque color', () => {
		expect(toCssColor({ r: 255, g: 0, b: 128 })).toBe('#ff0080');
	});

	it('defaults alpha to fully opaque when omitted', () => {
		expect(toCssColor({ r: 0, g: 0, b: 0 })).toBe('#000000');
	});

	it('appends a two-digit alpha channel when translucent', () => {
		expect(toCssColor({ r: 255, g: 255, b: 255, a: 0.5 })).toBe('#ffffff80');
	});

	it('appends 00 for fully transparent', () => {
		expect(toCssColor({ r: 10, g: 20, b: 30, a: 0 })).toBe('#0a141e00');
	});

	it('clamps and rounds out-of-range or fractional channel values', () => {
		expect(toCssColor({ r: 300, g: -10, b: 127.6 })).toBe('#ff0080');
	});
});

describe('cycleFieldsView', () => {
	it('steps forward from rgb to hsl', () => {
		expect(cycleFieldsView('rgb', 1)).toBe('hsl');
	});

	it('steps forward from hsl and wraps back to rgb', () => {
		expect(cycleFieldsView('hsl', 1)).toBe('rgb');
	});

	it('steps backward from hsl to rgb', () => {
		expect(cycleFieldsView('hsl', -1)).toBe('rgb');
	});

	it('steps backward from rgb and wraps back to hsl', () => {
		expect(cycleFieldsView('rgb', -1)).toBe('hsl');
	});
});

describe('deriveFieldsChange', () => {
	const current = {
		rgb: { r: 10, g: 20, b: 30, a: 0.5 },
		hsl: { h: 120, s: 0.4, l: 0.6, a: 0.5 },
	};

	it('returns a hex change for a valid hex edit, regardless of view', () => {
		expect(deriveFieldsChange('rgb', { hex: 'ff0000' }, current)).toEqual({
			hex: 'ff0000',
			source: 'hex',
		});
		expect(deriveFieldsChange('hsl', { hex: 'ff0000' }, current)).toEqual({
			hex: 'ff0000',
			source: 'hex',
		});
	});

	it('returns null for an invalid hex edit', () => {
		expect(deriveFieldsChange('rgb', { hex: 'not-a-color' }, current)).toBeNull();
	});

	it('fills in the untouched rgb channels from the current state', () => {
		expect(deriveFieldsChange('rgb', { r: 200 }, current)).toEqual({
			r: 200,
			g: 20,
			b: 30,
			a: 0.5,
			source: 'rgb',
		});
	});

	it('clamps and rounds an rgb alpha edit', () => {
		expect(deriveFieldsChange('rgb', { a: 1.4 }, current)).toEqual({
			r: 10,
			g: 20,
			b: 30,
			a: 1,
			source: 'rgb',
		});
	});

	it('fills in the untouched hsl channels and converts a percentage string', () => {
		expect(deriveFieldsChange('hsl', { s: '75%' }, current)).toEqual({
			h: 120,
			s: 0.75,
			l: 0.6,
			a: 0.5,
			source: 'hsl',
		});
	});

	it('clamps a negative hsl alpha edit to zero', () => {
		expect(deriveFieldsChange('hsl', { a: -0.2 }, current)).toEqual({
			h: 120,
			s: 0.4,
			l: 0.6,
			a: 0,
			source: 'hsl',
		});
	});

	it('returns null when the edit matches neither a hex, rgb, nor hsl field', () => {
		expect(deriveFieldsChange('rgb', {}, current)).toBeNull();
	});
});
