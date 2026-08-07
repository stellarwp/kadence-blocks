/* eslint-env jest */
// cspell:ignore Abril Fatface abril fatface Écriture ecriture .
import {
	findFontByFamily,
	fontActionFor,
	fontFamilySlug,
	fontOptions,
	fontSizeDisplayValue,
	getFontCatalog,
} from '../helpers/typography';

describe('fontOptions', () => {
	it('returns [] for a missing schema or unknown group', () => {
		expect(fontOptions(undefined, {}, 'Font Family')).toEqual([]);
		expect(fontOptions({ groups: {} }, {}, 'Font Family')).toEqual([]);
		expect(fontOptions({ groups: { Other: [] } }, {}, 'Font Family')).toEqual([]);
	});

	it('maps id, first-family label, and the full stack in feed order', () => {
		const schema = {
			groups: {
				'Font Family': [
					{ id: 'primitive.font-family.sans' },
					{ id: 'primitive.font-family.serif' },
					{ id: 'primitive.font-family.mono' },
				],
			},
		};
		const values = {
			'primitive.font-family.sans': 'Inter, system-ui, sans-serif',
			'primitive.font-family.serif': 'Georgia, Cambria, serif',
			'primitive.font-family.mono': 'Menlo, Consolas, monospace',
		};

		expect(fontOptions(schema, values, 'Font Family')).toEqual([
			{
				id: 'primitive.font-family.sans',
				label: 'Inter',
				stack: 'Inter, system-ui, sans-serif',
				userCreated: false,
			},
			{
				id: 'primitive.font-family.serif',
				label: 'Georgia',
				stack: 'Georgia, Cambria, serif',
				userCreated: false,
			},
			{
				id: 'primitive.font-family.mono',
				label: 'Menlo',
				stack: 'Menlo, Consolas, monospace',
				userCreated: false,
			},
		]);
	});

	it('strips wrapping quotes from a quoted first family', () => {
		const schema = { groups: { 'Font Family': [{ id: 'primitive.font-family.sans' }] } };
		const values = { 'primitive.font-family.sans': '"Inter", system-ui, sans-serif' };

		expect(fontOptions(schema, values, 'Font Family')[0].label).toBe('Inter');
	});

	it('passes userCreated through from the feed entry', () => {
		const schema = {
			groups: {
				'Font Family': [
					{ id: 'primitive.font-family.sans' },
					{ id: 'primitive.font-family.custom.abel', userCreated: true },
				],
			},
		};
		const values = {
			'primitive.font-family.sans': 'Inter, system-ui, sans-serif',
			'primitive.font-family.custom.abel': 'Abel',
		};

		const options = fontOptions(schema, values, 'Font Family');

		expect(options[0].userCreated).toBe(false);
		expect(options[1].userCreated).toBe(true);
	});
});

describe('fontSizeDisplayValue', () => {
	it('extracts the clamp max from a clamp string', () => {
		expect(fontSizeDisplayValue('clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)')).toBe('0.9rem');
	});

	it('returns a plain dimension verbatim', () => {
		expect(fontSizeDisplayValue('1.5rem')).toBe('1.5rem');
	});

	it('returns a malformed clamp string verbatim', () => {
		expect(fontSizeDisplayValue('clamp(1rem, 2rem)')).toBe('clamp(1rem, 2rem)');
	});

	it('returns an empty value verbatim', () => {
		expect(fontSizeDisplayValue('')).toBe('');
	});
});

describe('getFontCatalog', () => {
	const originalCatalog = window.kadenceDesignTokensFontCatalog;

	afterEach(() => {
		window.kadenceDesignTokensFontCatalog = originalCatalog;
	});

	it('fails safe to two empty lists when the global is missing', () => {
		delete window.kadenceDesignTokensFontCatalog;

		expect(getFontCatalog()).toEqual({ google: [], custom: [] });
	});

	it('fails safe to two empty lists when the global is malformed', () => {
		window.kadenceDesignTokensFontCatalog = { google: 'not-an-array' };

		expect(getFontCatalog()).toEqual({ google: [], custom: [] });
	});

	it('reads the google and custom lists verbatim when present', () => {
		window.kadenceDesignTokensFontCatalog = { google: ['Abel', 'Abril Fatface'], custom: ['My Font'] };

		expect(getFontCatalog()).toEqual({ google: ['Abel', 'Abril Fatface'], custom: ['My Font'] });
	});
});

describe('findFontByFamily', () => {
	const fonts = [
		{ id: 'primitive.font-family.sans', label: 'Inter' },
		{ id: 'primitive.font-family.serif', label: 'Georgia' },
	];

	it('matches a design-system font case-insensitively', () => {
		expect(findFontByFamily(fonts, 'inter')).toEqual(fonts[0]);
		expect(findFontByFamily(fonts, 'INTER')).toEqual(fonts[0]);
	});

	it('unquotes both sides before comparing', () => {
		expect(findFontByFamily(fonts, '"Inter"')).toEqual(fonts[0]);
		expect(findFontByFamily([{ id: 'x', label: '"Inter"' }], 'Inter')).toEqual({ id: 'x', label: '"Inter"' });
	});

	it('returns null when no font matches', () => {
		expect(findFontByFamily(fonts, 'Abel')).toBeNull();
	});
});

describe('fontFamilySlug', () => {
	it('lowercases and hyphenates spaces', () => {
		expect(fontFamilySlug('Abril Fatface')).toBe('abril-fatface');
	});

	it('strips diacritics', () => {
		expect(fontFamilySlug('Écriture')).toBe('ecriture');
	});

	it('collapses any run of non alphanumeric characters to a single hyphen and trims the edges', () => {
		expect(fontFamilySlug('  Foo!!  Bar__Baz  ')).toBe('foo-bar-baz');
	});

	it('falls back to "font" for a name that yields nothing (fully non-Latin)', () => {
		expect(fontFamilySlug('日本語')).toBe('font');
	});

	it('falls back to "font" for an empty or missing name', () => {
		expect(fontFamilySlug('')).toBe('font');
		expect(fontFamilySlug(undefined)).toBe('font');
	});
});

describe('fontActionFor', () => {
	const baselineFont = { id: 'primitive.font-family.sans', label: 'Inter', userCreated: false };
	const customFont = { id: 'primitive.font-family.custom.abel', label: 'Abel', userCreated: true };
	const fonts = [baselineFont, customFont];

	it('returns an enabled add action when the pick matches no design-system font', () => {
		expect(fontActionFor(fonts, 'Abril Fatface')).toEqual({ type: 'add', disabled: false, font: null });
	});

	it('returns an enabled delete action when the pick matches a user-created font', () => {
		expect(fontActionFor(fonts, 'Abel')).toEqual({ type: 'delete', disabled: false, font: customFont });
	});

	it('returns a disabled add action when the pick matches a baseline font', () => {
		expect(fontActionFor(fonts, 'Inter')).toEqual({ type: 'add', disabled: true, font: baselineFont });
	});
});
