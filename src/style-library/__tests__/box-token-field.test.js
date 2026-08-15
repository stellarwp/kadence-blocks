/* eslint-env jest */
import { toControlValue, toStoredValue } from '../components/molecules/fields/BoxTokenField';

describe('toControlValue', () => {
	it('wraps a bare token id into the alias the control matches against', () => {
		expect(toControlValue('semantic.dimension.radius-sm')).toBe('{semantic.dimension.radius-sm}');
		expect(toControlValue('primitive.dimension.radius-lg')).toBe('{primitive.dimension.radius-lg}');
	});

	it('splits a literal down to its bare number, the unit being the control-wide one', () => {
		expect(toControlValue('0.1875rem')).toBe(0.1875);
		expect(toControlValue('12px')).toBe(12);
	});

	it('passes an unparsable literal through rather than blanking it', () => {
		expect(toControlValue('auto')).toBe('auto');
	});

	it('reads an unset slot as unset', () => {
		expect(toControlValue('')).toBe('');
		expect(toControlValue(undefined)).toBe('');
	});
});

describe('toStoredValue', () => {
	it('unwraps an alias back to the bare id a preset stores', () => {
		expect(toStoredValue('{semantic.dimension.radius-sm}', 'rem')).toBe('semantic.dimension.radius-sm');
	});

	it('rejoins a number with the active unit', () => {
		expect(toStoredValue(0.1875, 'rem')).toBe('0.1875rem');
		expect(toStoredValue(12, 'px')).toBe('12px');
	});

	it('keeps zero unitless, so it still equals the None token and does not dirty a clean preset', () => {
		expect(toStoredValue(0, 'px')).toBe('0');
		expect(toStoredValue('0', 'rem')).toBe('0');
	});

	it('writes an unset slot as empty', () => {
		expect(toStoredValue('', 'px')).toBe('');
		expect(toStoredValue(null, 'px')).toBe('');
	});
});

describe('the conversion pair', () => {
	it('round-trips every shape a preset slot can hold', () => {
		for (const [stored, unit] of [
			['semantic.dimension.radius-sm', 'rem'],
			['0.1875rem', 'rem'],
			['12px', 'px'],
			['0', 'px'],
			['', 'px'],
		]) {
			expect(toStoredValue(toControlValue(stored), unit)).toBe(stored);
		}
	});
});
