/* eslint-env jest */
// cspell:ignore Abril Fatface .
/**
 * Internal dependencies
 */
import { isThemeFontReference, sameFamily } from '../helpers/font-family';

describe('sameFamily', () => {
	it('matches an exact family', () => {
		expect(sameFamily('Inter', 'Inter')).toBe(true);
	});

	// A family name is a proper noun, not an identifier, and every other layer already folds case:
	// the REST catalog gate accepts either spelling, the favorites index folds on membership, and both
	// option lists collapse duplicates on a lowercased key.
	it.each([
		['Inter', 'INTER'],
		['Inter', 'inter'],
		['inter', 'Inter'],
		['Abril Fatface', 'abril FATFACE'],
	])('matches %p against %p regardless of case', (a, b) => {
		expect(sameFamily(a, b)).toBe(true);
	});

	// The stored value and the queried one are trimmed the same way the index trims what it stores.
	it('ignores surrounding whitespace', () => {
		expect(sameFamily('  Inter  ', 'Inter')).toBe(true);
	});

	it('does not match two different families', () => {
		expect(sameFamily('Inter', 'Georgia')).toBe(false);
	});

	// An unset field has no family to be the same as, so it must not mark every empty row active.
	it.each([
		['', ''],
		['   ', ''],
		[null, null],
		[undefined, undefined],
		['Inter', ''],
		['', 'Inter'],
		[42, 42],
	])('does not treat %p and %p as the same font', (a, b) => {
		expect(sameFamily(a, b)).toBe(false);
	});
});

describe('isThemeFontReference', () => {
	/**
	 * Both Kadence theme global font entries are recognized, with or without the spacing the
	 * picker stores them with.
	 *
	 * @return {void}
	 */
	it('recognizes the theme heading and body font references', () => {
		expect(isThemeFontReference('var( --global-heading-font-family, inherit )')).toBe(true);
		expect(isThemeFontReference('var(--global-body-font-family,inherit)')).toBe(true);
	});

	/**
	 * A family name, an empty value, and a non-string are not theme references.
	 *
	 * @return {void}
	 */
	it('rejects family names and non-strings', () => {
		expect(isThemeFontReference('Inter')).toBe(false);
		expect(isThemeFontReference('')).toBe(false);
		expect(isThemeFontReference(null)).toBe(false);
		expect(isThemeFontReference('var( --kb-primary-font, inherit )')).toBe(false);
	});
});
