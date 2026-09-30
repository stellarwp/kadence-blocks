/* eslint-env jest */

/**
 * Internal dependencies
 */
import { normalizeShadow } from '../shadow';
import { isEmptyValue, matchesPreset } from '../../normalize';

/**
 * The block default `kadence/image` ships for `boxShadow`: a visible shadow, kept out of the page by a
 * separate flag.
 *
 * @since TBD
 *
 * @type {Array}
 */
const BLOCK_DEFAULT = [{ color: '#000000', opacity: 0.2, spread: 0, blur: 14, hOffset: 0, vOffset: 0, inset: false }];

describe('normalizeShadow', () => {
	/**
	 * A preset that stores a fully transparent zero shadow means "no shadow", so it reads as empty.
	 *
	 * @return {void}
	 */
	it('reads a transparent zero shadow as none', () => {
		expect(normalizeShadow('0px 0px 0px 0px transparent')).toBe('');
	});

	/**
	 * The `none` keyword and an empty value are none too.
	 *
	 * @return {void}
	 */
	it('reads the none keyword and empty values as none', () => {
		expect(normalizeShadow('none')).toBe('');
		expect(normalizeShadow('')).toBe('');
		expect(normalizeShadow(undefined)).toBe('');
		expect(normalizeShadow([])).toBe('');
	});

	/**
	 * A stored item with no offset, blur or spread paints nothing, whatever its color.
	 *
	 * @return {void}
	 */
	it('reads a stored item with no geometry as none', () => {
		expect(normalizeShadow([{ color: '#000000', opacity: 0.2, blur: 0, spread: 0, hOffset: 0, vOffset: 0 }])).toBe(
			''
		);
	});

	/**
	 * A stored item and the equivalent literal preset value reduce to the same string.
	 *
	 * @return {void}
	 */
	it('reduces a stored item and its literal equivalent to the same string', () => {
		expect(normalizeShadow(BLOCK_DEFAULT)).toBe(normalizeShadow('0px 0px 14px 0px rgba(0, 0, 0, 0.2)'));
	});

	/**
	 * Spacing and case do not change the meaning of a literal.
	 *
	 * @return {void}
	 */
	it('ignores spacing and case in a literal', () => {
		expect(normalizeShadow('0 4px  12px   RGBA(0,0,0,0.15)')).toBe(
			normalizeShadow('0 4px 12px rgba(0, 0, 0, 0.15)')
		);
	});
});

describe('shadow kind dispatch', () => {
	/**
	 * A block that stores no shadow is untouched.
	 *
	 * @return {void}
	 */
	it('treats an empty stored shadow as empty', () => {
		expect(isEmptyValue('shadow', '')).toBe(true);
		expect(isEmptyValue('shadow', [])).toBe(true);
	});

	/**
	 * A stored shadow with visible geometry is a value the block holds.
	 *
	 * @return {void}
	 */
	it('treats a stored shadow with geometry as a value', () => {
		expect(isEmptyValue('shadow', BLOCK_DEFAULT)).toBe(false);
	});

	/**
	 * A visible stored shadow does not match a preset that stores none.
	 *
	 * @return {void}
	 */
	it('does not match a visible shadow against a transparent zero preset shadow', () => {
		expect(matchesPreset('shadow', BLOCK_DEFAULT, '', '0px 0px 0px 0px transparent')).toBe(false);
	});

	/**
	 * A stored shadow with no geometry matches a preset that stores none.
	 *
	 * @return {void}
	 */
	it('matches a shadow with no geometry against a transparent zero preset shadow', () => {
		const flat = [{ color: '#000000', opacity: 0.2, blur: 0, spread: 0, hOffset: 0, vOffset: 0 }];

		expect(matchesPreset('shadow', flat, '', '0px 0px 0px 0px transparent')).toBe(true);
	});

	/**
	 * A stored shadow equal to the preset's literal matches it.
	 *
	 * @return {void}
	 */
	it('matches a stored shadow equal to the preset literal', () => {
		expect(matchesPreset('shadow', BLOCK_DEFAULT, '', '0px 0px 14px 0px rgba(0, 0, 0, 0.2)')).toBe(true);
	});
});
