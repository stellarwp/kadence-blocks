/* eslint-env jest */
/**
 * Internal dependencies
 */
import { parseColorChannels, readableMarkColor, relativeLuminance } from '../helpers/contrast';

describe('parseColorChannels', () => {
	it('parses a 6-digit hex color as fully opaque', () => {
		expect(parseColorChannels('#3182CE')).toEqual({ r: 49, g: 130, b: 206, a: 1 });
	});

	it('parses a 3-digit hex color by doubling each digit', () => {
		expect(parseColorChannels('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
	});

	it('parses an 8-digit hex color, keeping the alpha channel', () => {
		expect(parseColorChannels('#1717171f')).toEqual({ r: 23, g: 23, b: 23, a: 0.12156862745098039 });
	});

	it('parses an rgb() color as fully opaque', () => {
		expect(parseColorChannels('rgb(23, 23, 23)')).toEqual({ r: 23, g: 23, b: 23, a: 1 });
	});

	it('parses an rgba() color, keeping the alpha channel', () => {
		expect(parseColorChannels('rgba(23, 23, 23, 0.12)')).toEqual({ r: 23, g: 23, b: 23, a: 0.12 });
	});

	it('returns null for a CSS variable reference', () => {
		expect(parseColorChannels('var(--kb-token--semantic--color--accent--main)')).toBeNull();
	});

	it('returns null for a non-string value', () => {
		expect(parseColorChannels(undefined)).toBeNull();
	});
});

describe('relativeLuminance', () => {
	it('is 0 for black', () => {
		expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBe(0);
	});

	it('is 1 for white', () => {
		expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1);
	});
});

describe('readableMarkColor', () => {
	it('picks the light mark for a dark swatch', () => {
		expect(readableMarkColor('#1A202C')).toBe('#ffffff');
	});

	it('picks the dark mark for a light swatch', () => {
		expect(readableMarkColor('#F7FAFC')).toBe('#1e1e1e');
	});

	it('falls back to the dark mark when the color cannot be parsed', () => {
		expect(readableMarkColor('var(--kb-token--semantic--color--accent--main)')).toBe('#1e1e1e');
	});

	/**
	 * A fully transparent swatch shows the popover's own white surface, not black — so the mark
	 * must read as it would against white, not against the swatch's nominal (0,0,0) channels.
	 *
	 * @return {void}
	 */
	it('picks the dark mark for a fully transparent color, reading it against the white popover surface', () => {
		expect(readableMarkColor('rgba(0, 0, 0, 0)')).toBe('#1e1e1e');
	});

	/**
	 * A semi-transparent dark color lightens toward the white backing as it composites, which can
	 * flip which mark reads legibly compared to treating the color as fully opaque.
	 *
	 * @return {void}
	 */
	it('composites a semi-transparent color against the white popover surface before choosing', () => {
		// #1A202C is opaque-dark enough to pick the light mark (see the test above); at 20% alpha
		// it composites to a pale gray, which should flip the pick to the dark mark.
		expect(readableMarkColor('rgba(26, 32, 44, 0.2)')).toBe('#1e1e1e');
	});
});
