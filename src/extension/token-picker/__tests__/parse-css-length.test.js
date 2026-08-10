/* eslint-env jest */

import { parseCssLength } from '../parse-css-length';

describe('parseCssLength', () => {
	it.each([
		['px', '6px', { size: 6, unit: 'px' }],
		['em', '1.5em', { size: 1.5, unit: 'em' }],
		['rem', '0.5rem', { size: 0.5, unit: 'rem' }],
		['%', '50%', { size: 50, unit: '%' }],
		['zero string', '0', { size: 0, unit: '' }],
		['zero number', 0, { size: 0, unit: '' }],
		['unitless string', '12', { size: 12, unit: '' }],
		['unitless number', 12, { size: 12, unit: '' }],
		['negative with unit', '-2px', { size: -2, unit: 'px' }],
	])('parses a %s value', (name, input, expected) => {
		expect(parseCssLength(input)).toEqual(expected);
	});

	it.each([
		['a non-length word', 'auto'],
		['an empty string', ''],
		['null', null],
		['undefined', undefined],
		['an object', {}],
		['NaN', NaN],
	])('returns null for %s', (name, input) => {
		expect(parseCssLength(input)).toBeNull();
	});
});
