/* eslint-env jest */
/**
 * `presetFontVariant` turns the weight a preset stores into the variant a Google Fonts request takes,
 * so the family a preset names is loaded at the weight the page then asks for rather than at 400 with
 * a synthesized bold over it. Its PHP twin is `preset_font_variant()` on the Advanced Heading block;
 * the cases here are the ones both sides must agree on.
 */
import { presetFontVariant } from '../preset-font-variant';

describe('presetFontVariant', () => {
	/**
	 * A numeric weight is already Google's own variant spelling and passes through, which is the case
	 * that matters: a preset set to 700 has to request the real bold face.
	 *
	 * @return {void}
	 */
	it('passes a numeric weight through as the variant', () => {
		expect(presetFontVariant('700')).toBe('700');
		expect(presetFontVariant('100')).toBe('100');
		expect(presetFontVariant('900')).toBe('900');
	});

	/**
	 * The upright default is asked for as `regular`, the v1 spelling the rest of the plugin uses, which
	 * the editor's `parseVariant` also reads as 400. All three ways of writing it converge.
	 *
	 * @return {void}
	 */
	it('normalizes every spelling of the upright default to regular', () => {
		expect(presetFontVariant('400')).toBe('regular');
		expect(presetFontVariant('normal')).toBe('regular');
		expect(presetFontVariant('regular')).toBe('regular');
	});

	/**
	 * `bold` is a legal DTCG font weight, so a token that spells 700 that way still resolves to a face
	 * rather than falling through to no variant at all.
	 *
	 * @return {void}
	 */
	it('resolves the bold keyword to its numeric face', () => {
		expect(presetFontVariant('bold')).toBe('700');
	});

	/**
	 * Casing and stray whitespace come from authored token values, not from a controlled vocabulary, so
	 * they are normalized rather than treated as unrecognized.
	 *
	 * @return {void}
	 */
	it('ignores casing and surrounding whitespace', () => {
		expect(presetFontVariant('  Bold  ')).toBe('700');
		expect(presetFontVariant(' REGULAR ')).toBe('regular');
	});

	/**
	 * An empty or unrecognized weight asks for no variant, which leaves the family loading exactly as it
	 * did before this bridge existed rather than requesting a face that does not exist.
	 *
	 * @return {void}
	 */
	it('asks for no variant when the weight names no face', () => {
		expect(presetFontVariant('')).toBe('');
		expect(presetFontVariant(undefined)).toBe('');
		expect(presetFontVariant(null)).toBe('');
		expect(presetFontVariant('lighter')).toBe('');
		expect(presetFontVariant('450')).toBe('');
		expect(presetFontVariant('70')).toBe('');
	});
});
