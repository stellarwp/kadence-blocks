/* eslint-env jest */
import { iconSizeRowValue } from '../helpers/icon-sizes';

describe('iconSizeRowValue', () => {
	it('formats a stored value as "<value> x <value>"', () => {
		expect(iconSizeRowValue('1rem')).toBe('1rem x 1rem');
	});

	it('passes the stored string through verbatim on both sides (no unit conversion)', () => {
		expect(iconSizeRowValue('24px')).toBe('24px x 24px');
	});

	it('returns an empty string for an empty, null, or undefined value', () => {
		expect(iconSizeRowValue('')).toBe('');
		expect(iconSizeRowValue(null)).toBe('');
		expect(iconSizeRowValue(undefined)).toBe('');
	});
});
