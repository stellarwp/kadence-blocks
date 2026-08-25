/* eslint-env jest */
/**
 * Internal dependencies
 */
import {
	toControlStyleAxis,
	toControlWidth,
	toControlWidthAxis,
	toStoredStyleAxis,
	toStoredWidth,
	toStoredWidthAxis,
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

describe('toControlWidthAxis', () => {
	it('converts a scalar width axis the same way toControlWidth does', () => {
		expect(toControlWidthAxis('2px')).toBe(2);
		expect(toControlWidthAxis('semantic.dimension.border-width-sm')).toBe('{semantic.dimension.border-width-sm}');
	});

	it('converts every slot of a four-slot width axis independently', () => {
		expect(toControlWidthAxis(['1px', '2px', '{semantic.dimension.border-width-sm}', ''])).toEqual([
			1,
			2,
			'{semantic.dimension.border-width-sm}',
			'',
		]);
	});
});

describe('toStoredWidthAxis', () => {
	it('converts a scalar control width the same way toStoredWidth does', () => {
		expect(toStoredWidthAxis(2)).toBe('2px');
		expect(toStoredWidthAxis(0)).toBe('0');
	});

	it('converts every slot of a four-slot control width independently', () => {
		expect(toStoredWidthAxis([1, 2, '{semantic.dimension.border-width-sm}', ''])).toEqual([
			'1px',
			'2px',
			'semantic.dimension.border-width-sm',
			'',
		]);
	});
});

describe('toControlStyleAxis', () => {
	it('defaults an unset scalar style to none', () => {
		expect(toControlStyleAxis('')).toBe('none');
		expect(toControlStyleAxis(undefined)).toBe('none');
	});

	it('passes a set scalar style through unchanged', () => {
		expect(toControlStyleAxis('dashed')).toBe('dashed');
	});

	it('defaults every unset slot of a four-slot style axis to none', () => {
		expect(toControlStyleAxis(['solid', '', 'dotted', undefined])).toEqual(['solid', 'none', 'dotted', 'none']);
	});
});

describe('toStoredStyleAxis', () => {
	it('defaults an unset scalar style to none', () => {
		expect(toStoredStyleAxis('')).toBe('none');
	});

	it('defaults every unset slot of a four-slot style axis to none', () => {
		expect(toStoredStyleAxis(['solid', '', 'dotted', undefined])).toEqual(['solid', 'none', 'dotted', 'none']);
	});
});
