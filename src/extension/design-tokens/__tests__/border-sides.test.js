/* eslint-env jest */

import { borderSideDeclarations } from '../border-sides';

/**
 * Builds a border attribute value with the same color and line style on every side and no width.
 *
 * @param {string} color The border color.
 * @param {string} style The line style.
 *
 * @since TBD
 *
 * @return {Object[]} The border attribute value.
 */
function withoutWidth(color, style) {
	return [
		{ top: [color, style, ''], right: [color, style, ''], bottom: [color, style, ''], left: [color, style, ''] },
	];
}

describe('borderSideDeclarations', () => {
	/**
	 * A side that has a shorthand writes only that shorthand.
	 *
	 * @return {void}
	 */
	it('writes the shorthand for a side that has one', () => {
		expect(
			borderSideDeclarations('Desktop', [withoutWidth('#f00', 'solid')], {
				top: ['2px solid #f00', '#f00'],
			})
		).toEqual([['border-top', '2px solid #f00']]);
	});

	/**
	 * A side with no shorthand writes its color and line style on their own.
	 *
	 * @return {void}
	 */
	it('writes color and line style separately when the side has no shorthand', () => {
		expect(
			borderSideDeclarations('Desktop', [withoutWidth('#f00', 'dashed')], {
				left: ['', '#f00'],
			})
		).toEqual([
			['border-left-color', '#f00'],
			['border-left-style', 'dashed'],
		]);
	});

	/**
	 * A line style alone is still written, and a side with nothing stored writes nothing.
	 *
	 * @return {void}
	 */
	it('writes a line style with no color and nothing for an empty side', () => {
		expect(borderSideDeclarations('Desktop', [withoutWidth('', 'dotted')], { top: ['', ''] })).toEqual([
			['border-top-style', 'dotted'],
		]);
		expect(borderSideDeclarations('Desktop', [withoutWidth('', '')], { top: ['', ''] })).toEqual([]);
	});

	/**
	 * On a narrower device the line style falls back through the wider devices.
	 *
	 * @return {void}
	 */
	it('falls back to the desktop line style on the mobile device', () => {
		expect(
			borderSideDeclarations('Mobile', [withoutWidth('', 'double'), undefined, undefined], { top: ['', ''] })
		).toEqual([['border-top-style', 'double']]);
	});
});
