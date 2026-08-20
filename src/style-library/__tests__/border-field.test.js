/* eslint-env jest */
/**
 * Internal dependencies
 */
import {
	toControlValue,
	toControlWidth,
	toStoredValue,
	toStoredWidth,
} from '../components/molecules/fields/BorderField';

describe('toControlWidth', () => {
	it('wraps a bare token id into the alias the control matches against', () => {
		expect(toControlWidth('semantic.dimension.border-width-sm')).toBe('{semantic.dimension.border-width-sm}');
		expect(toControlWidth('primitive.dimension.border-width.md')).toBe('{primitive.dimension.border-width.md}');
	});

	it('splits a px literal down to its bare number', () => {
		expect(toControlWidth('2px')).toBe(2);
	});

	it('reads an unset width as unset', () => {
		expect(toControlWidth('')).toBe('');
		expect(toControlWidth(undefined)).toBe('');
	});
});

describe('toStoredWidth', () => {
	it('unwraps an alias back to the bare id a preset stores', () => {
		expect(toStoredWidth('{semantic.dimension.border-width-sm}')).toBe('semantic.dimension.border-width-sm');
	});

	it('rejoins a number with px, the only unit border width offers', () => {
		expect(toStoredWidth(2)).toBe('2px');
	});

	it('keeps zero unitless', () => {
		expect(toStoredWidth(0)).toBe('0');
	});

	it('writes an unset width as empty', () => {
		expect(toStoredWidth('')).toBe('');
		expect(toStoredWidth(null)).toBe('');
	});
});

describe('toControlValue', () => {
	it('reads a linked (scalar composite) stored value into a scalar control value', () => {
		expect(toControlValue({ width: '2px', style: 'solid', color: 'semantic.color.border-default' })).toEqual({
			width: 2,
			style: 'solid',
			color: 'semantic.color.border-default',
		});
	});

	it('reads an unlinked (four-slot) stored value into four-slot width/style axes, sharing one color', () => {
		const stored = [
			{ width: '1px', style: 'solid', color: '#000' },
			{ width: '2px', style: 'dashed', color: '#000' },
			{ width: '1px', style: 'solid', color: '#000' },
			{ width: '2px', style: 'dashed', color: '#000' },
		];

		expect(toControlValue(stored)).toEqual({
			width: [1, 2, 1, 2],
			style: ['solid', 'dashed', 'solid', 'dashed'],
			color: '#000',
		});
	});

	it('defaults an empty stored value to the unset side', () => {
		expect(toControlValue('')).toEqual({ width: '', style: 'none', color: '' });
		expect(toControlValue(undefined)).toEqual({ width: '', style: 'none', color: '' });
	});
});

describe('toStoredValue', () => {
	it('collapses a uniform control value back to a scalar composite', () => {
		expect(toStoredValue({ width: 2, style: 'solid', color: '#000' })).toEqual({
			width: '2px',
			style: 'solid',
			color: '#000',
		});
	});

	it('keeps a non-uniform control value as a four-slot composite list', () => {
		const next = { width: [1, 1, 1, 2], style: 'solid', color: '#000' };

		expect(toStoredValue(next)).toEqual([
			{ width: '1px', style: 'solid', color: '#000' },
			{ width: '1px', style: 'solid', color: '#000' },
			{ width: '1px', style: 'solid', color: '#000' },
			{ width: '2px', style: 'solid', color: '#000' },
		]);
	});

	it('collapses a four-slot value back to a scalar once every slot matches again', () => {
		const next = { width: [1, 1, 1, 1], style: ['solid', 'solid', 'solid', 'solid'], color: '#000' };

		expect(toStoredValue(next)).toEqual({ width: '1px', style: 'solid', color: '#000' });
	});
});

describe('the conversion pair', () => {
	it('round-trips a linked border through toStoredValue(toControlValue(...))', () => {
		const stored = { width: 'semantic.dimension.border-width-sm', style: 'dashed', color: '#171717' };

		expect(toStoredValue(toControlValue(stored))).toEqual(stored);
	});
});
