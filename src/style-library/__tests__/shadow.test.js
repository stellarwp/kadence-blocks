/* eslint-env jest */
import { buildShadowLeaf, parseShadowValue, shadowCss, shadowLeafValue } from '../helpers/shadow';

describe('parseShadowValue', () => {
	it('parses the plain shorthand into numbers and a color', () => {
		expect(parseShadowValue('0px 2px 8px 0px #1717171f')).toEqual({
			color: '#1717171f',
			offsetX: 0,
			offsetY: 2,
			blur: 8,
			spread: 0,
			inset: false,
		});
	});

	it('reads the inset prefix as inset true', () => {
		expect(parseShadowValue('inset 0px 2px 4px 0px #000000')).toEqual({
			color: '#000000',
			offsetX: 0,
			offsetY: 2,
			blur: 4,
			spread: 0,
			inset: true,
		});
	});

	it('keeps a color with internal spaces intact', () => {
		expect(parseShadowValue('0px 2px 8px 0px rgba(23, 23, 23, 0.12)')).toEqual({
			color: 'rgba(23, 23, 23, 0.12)',
			offsetX: 0,
			offsetY: 2,
			blur: 8,
			spread: 0,
			inset: false,
		});
	});

	it('returns the default shape for an empty string, or one that fails to parse', () => {
		const defaultShape = { color: '#000000', offsetX: 0, offsetY: 0, blur: 0, spread: 0, inset: false };

		expect(parseShadowValue('')).toEqual(defaultShape);
		expect(parseShadowValue('not a shadow')).toEqual(defaultShape);
		expect(parseShadowValue(undefined)).toEqual(defaultShape);
	});

	it('reads the numeric part of a non-px dimension', () => {
		// The decision 5 limitation, pinned so it is a choice, not an accident: a custom shadow
		// written out-of-band with a non-px offset still displays (the numeric part), and the next
		// Save normalizes it to px.
		expect(parseShadowValue('0px 0.5rem 8px 0px #000000').offsetY).toBe(0.5);
	});
});

describe('shadowLeafValue', () => {
	it('serializes numbers as px strings and zero as 0px', () => {
		expect(shadowLeafValue({ color: '#171717', offsetX: 0, offsetY: 2, blur: 8, spread: 0 })).toEqual({
			color: '#171717',
			offsetX: '0px',
			offsetY: '2px',
			blur: '8px',
			spread: '0px',
		});
	});

	it('omits inset when false and writes strict true otherwise', () => {
		const base = { color: '#171717', offsetX: 0, offsetY: 2, blur: 8, spread: 0 };

		const withoutInset = shadowLeafValue({ ...base, inset: false });
		const withInset = shadowLeafValue({ ...base, inset: true });

		expect(withoutInset).not.toHaveProperty('inset');
		expect(withInset.inset).toBe(true);
	});
});

describe('buildShadowLeaf', () => {
	it('wraps the composite value with the $type', () => {
		const draft = { color: '#171717', offsetX: 0, offsetY: 2, blur: 8, spread: 0, inset: false };

		expect(buildShadowLeaf('shadow', draft)).toEqual({
			$type: 'shadow',
			$value: { color: '#171717', offsetX: '0px', offsetY: '2px', blur: '8px', spread: '0px' },
		});
	});
});

describe('shadowCss', () => {
	it('passes a string through verbatim', () => {
		expect(shadowCss('0px 2px 8px 0px #1717171f')).toBe('0px 2px 8px 0px #1717171f');
	});

	it('serializes an object in renderer order with the inset prefix', () => {
		const draft = { color: '#171717', offsetX: 0, offsetY: 2, blur: 8, spread: 0, inset: true };

		expect(shadowCss(draft)).toBe('inset 0px 2px 8px 0px #171717');
	});

	it('serializes an object with no inset prefix when inset is false', () => {
		const draft = { color: '#171717', offsetX: 0, offsetY: 2, blur: 8, spread: 0, inset: false };

		expect(shadowCss(draft)).toBe('0px 2px 8px 0px #171717');
	});

	it('returns an empty string for an empty or missing value', () => {
		expect(shadowCss('')).toBe('');
		expect(shadowCss(null)).toBe('');
		expect(shadowCss(undefined)).toBe('');
	});
});

describe('parse and serialize round-trip the renderer shorthand', () => {
	it('round-trips a string through parseShadowValue and shadowCss for px values', () => {
		const original = '0px 2px 8px 0px #1717171f';

		expect(shadowCss(parseShadowValue(original))).toBe(original);
	});

	it('round-trips an inset string through parseShadowValue and shadowCss', () => {
		const original = 'inset 1px 1px 2px 0px #000000';

		expect(shadowCss(parseShadowValue(original))).toBe(original);
	});
});
