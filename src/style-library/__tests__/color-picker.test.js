/* eslint-env jest */
import { isSameColor } from '../helpers/color-picker';

describe('isSameColor', () => {
	it('matches the same color written in different case', () => {
		expect(isSameColor('#3182CE', '#3182ce')).toBe(true);
	});

	it('matches a short hex against its expanded form', () => {
		expect(isSameColor('#FFF', '#ffffff')).toBe(true);
	});

	it('matches a function form against its hex equivalent', () => {
		expect(isSameColor('rgb(49, 130, 206)', '#3182ce')).toBe(true);
	});

	it('matches a named keyword against its hex equivalent', () => {
		expect(isSameColor('red', '#ff0000')).toBe(true);
	});

	it('matches the transparent keyword against its hex equivalent', () => {
		expect(isSameColor('transparent', '#00000000')).toBe(true);
	});

	it('separates genuinely different colors', () => {
		expect(isSameColor('#3182ce', '#3182cf')).toBe(false);
	});

	it('separates colors differing only in alpha', () => {
		expect(isSameColor('#3182ce', '#3182ce80')).toBe(false);
	});

	it('treats a value it cannot parse as matching nothing', () => {
		expect(isSameColor('', '#ffffff')).toBe(false);
		expect(isSameColor('linear-gradient(90deg, #fff, #000)', 'linear-gradient(90deg, #fff, #000)')).toBe(false);
	});
});
