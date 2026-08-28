/* eslint-env jest */
// cspell:ignore Abril Fatface .
import {
	familyStack,
	findFontByFamily,
	fontActionFor,
	fontOptions,
	fontSizeDisplayValue,
	fontCatalogOptions,
	fontWeightsFor,
	getFontCatalog,
} from '../helpers/typography';

describe('fontOptions', () => {
	it('returns [] for a missing feed or a feed carrying no favorites', () => {
		expect(fontOptions(undefined)).toEqual([]);
		expect(fontOptions({})).toEqual([]);
		expect(fontOptions({ favoriteFonts: 'not-an-array' })).toEqual([]);
	});

	it('maps each favorite to an option keyed by its own family name, in stored order', () => {
		expect(fontOptions({ favoriteFonts: ['Inter', 'Georgia'] })).toEqual([
			{ id: 'Inter', label: 'Inter', stack: 'Inter' },
			{ id: 'Georgia', label: 'Georgia', stack: 'Georgia' },
		]);
	});

	it('quotes a multi-word family in the stack so it is one family, not several', () => {
		expect(fontOptions({ favoriteFonts: ['Abril Fatface'] })).toEqual([
			{ id: 'Abril Fatface', label: 'Abril Fatface', stack: '"Abril Fatface"' },
		]);
	});

	it('strips wrapping quotes from a stored family before using it as label and id', () => {
		expect(fontOptions({ favoriteFonts: ['"Inter"'] })).toEqual([{ id: 'Inter', label: 'Inter', stack: 'Inter' }]);
	});

	// The store deduplicates before unquoting, so these are two entries there and one font here.
	it('drops a duplicate that differs only by quoting or case', () => {
		expect(fontOptions({ favoriteFonts: ['Inter', '"Inter"', 'INTER'] })).toEqual([
			{ id: 'Inter', label: 'Inter', stack: 'Inter' },
		]);
	});

	it('drops an entry that unquotes to nothing', () => {
		expect(fontOptions({ favoriteFonts: ['""', 'Inter'] })).toEqual([
			{ id: 'Inter', label: 'Inter', stack: 'Inter' },
		]);
	});

	it('drops non-string and blank entries rather than rendering a nameless option', () => {
		expect(fontOptions({ favoriteFonts: ['Inter', 42, '', '   ', null] })).toEqual([
			{ id: 'Inter', label: 'Inter', stack: 'Inter' },
		]);
	});
});

describe('familyStack', () => {
	it('leaves a single-word family bare', () => {
		expect(familyStack('Inter')).toBe('Inter');
	});

	it('quotes a family carrying whitespace so it reads as one family', () => {
		expect(familyStack('Abril Fatface')).toBe('"Abril Fatface"');
	});

	it('unquotes and trims before deciding, so a quoted name is not double-quoted', () => {
		expect(familyStack('  "Inter"  ')).toBe('Inter');
	});

	it('returns an empty string for a blank or missing family', () => {
		expect(familyStack('')).toBe('');
		expect(familyStack('   ')).toBe('');
		expect(familyStack(undefined)).toBe('');
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

	it('fails safe to two empty lists and an empty weight map when the global is missing', () => {
		delete window.kadenceDesignTokensFontCatalog;

		expect(getFontCatalog()).toEqual({ google: [], custom: [], weights: {} });
	});

	it('fails safe to two empty lists and an empty weight map when the global is malformed', () => {
		window.kadenceDesignTokensFontCatalog = { google: 'not-an-array', weights: 'not-an-object' };

		expect(getFontCatalog()).toEqual({ google: [], custom: [], weights: {} });
	});

	it('reads the google and custom lists and the weight map verbatim when present', () => {
		window.kadenceDesignTokensFontCatalog = {
			google: ['Abel', 'Abril Fatface'],
			custom: ['My Font'],
			weights: { 'Abril Fatface': ['400'] },
		};

		expect(getFontCatalog()).toEqual({
			google: ['Abel', 'Abril Fatface'],
			custom: ['My Font'],
			weights: { 'Abril Fatface': ['400'] },
		});
	});
});

describe('fontCatalogOptions', () => {
	const originalCatalog = window.kadenceDesignTokensFontCatalog;

	afterEach(() => {
		window.kadenceDesignTokensFontCatalog = originalCatalog;
	});

	/**
	 * Favorites lead and carry a badge, so the faces a site has kept sit at the top of a list otherwise
	 * nearly two thousand names long; Google follows, then site-registered custom families.
	 *
	 * @return {void}
	 */
	it('lists favorites first, then google, then custom', () => {
		window.kadenceDesignTokensFontCatalog = { google: ['Abel', 'Inter'], custom: ['My Font'], weights: {} };

		expect(fontCatalogOptions({ favoriteFonts: ['Inter'] })).toEqual([
			{ value: 'Inter', label: 'Inter', badge: 'Favorite' },
			{ value: 'Abel', label: 'Abel' },
			{ value: 'My Font', label: 'My Font', badge: 'Custom' },
		]);
	});

	/**
	 * A favorite keeps its pinned position rather than repeating mid-list, and a custom font duplicating
	 * a Google one renders once. The custom list is diffed against the Google one server-side by exact
	 * string, so a theme registering `inter` alongside Google's `Inter` reaches here as two names for
	 * one font.
	 *
	 * @return {void}
	 */
	it('lists every name once, matched case-insensitively across all three sources', () => {
		window.kadenceDesignTokensFontCatalog = { google: ['Inter'], custom: ['inter'], weights: {} };

		expect(fontCatalogOptions({ favoriteFonts: ['Inter'] })).toEqual([
			{ value: 'Inter', label: 'Inter', badge: 'Favorite' },
		]);
	});

	/**
	 * With no catalog global and no favorites there is nothing to offer, rather than a list of blanks.
	 *
	 * @return {void}
	 */
	it('fails safe to an empty list', () => {
		delete window.kadenceDesignTokensFontCatalog;

		expect(fontCatalogOptions(undefined)).toEqual([]);
	});
});

describe('fontWeightsFor', () => {
	const originalCatalog = window.kadenceDesignTokensFontCatalog;

	afterEach(() => {
		window.kadenceDesignTokensFontCatalog = originalCatalog;
	});

	it('returns the weights a known family ships', () => {
		window.kadenceDesignTokensFontCatalog = { weights: { 'Abril Fatface': ['400'], Inter: ['100', '900'] } };

		expect(fontWeightsFor('Abril Fatface')).toEqual(['400']);
		expect(fontWeightsFor('Inter')).toEqual(['100', '900']);
	});

	it('matches a family case-insensitively and through wrapping quotes', () => {
		window.kadenceDesignTokensFontCatalog = { weights: { 'Abril Fatface': ['400'] } };

		expect(fontWeightsFor('abril fatface')).toEqual(['400']);
		expect(fontWeightsFor('"Abril Fatface"')).toEqual(['400']);
	});

	/**
	 * `null` rather than `[]`, because the two mean different things to a caller: a custom font carries
	 * no weight data at all, while a family the catalog knows always lists at least one weight. Only
	 * the first should widen a control back to the full set.
	 *
	 * @return {void}
	 */
	it('returns null for a family the catalog does not know, and for none', () => {
		window.kadenceDesignTokensFontCatalog = { weights: { Inter: ['400'] } };

		expect(fontWeightsFor('Some Custom Face')).toBeNull();
		expect(fontWeightsFor('')).toBeNull();
		expect(fontWeightsFor(undefined)).toBeNull();
	});
});

describe('findFontByFamily', () => {
	const fonts = [
		{ id: 'Inter', label: 'Inter' },
		{ id: 'Georgia', label: 'Georgia' },
	];

	it('matches a favorite case-insensitively', () => {
		expect(findFontByFamily(fonts, 'inter')).toEqual(fonts[0]);
		expect(findFontByFamily(fonts, 'INTER')).toEqual(fonts[0]);
	});

	it('unquotes both sides before comparing', () => {
		expect(findFontByFamily(fonts, '"Inter"')).toEqual(fonts[0]);
		expect(findFontByFamily([{ id: 'x', label: '"Inter"' }], 'Inter')).toEqual({ id: 'x', label: '"Inter"' });
	});

	it('returns null when no favorite matches', () => {
		expect(findFontByFamily(fonts, 'Abel')).toBeNull();
	});
});

describe('fontActionFor', () => {
	const favorite = { id: 'Inter', label: 'Inter' };
	const fonts = [favorite];

	it('returns an enabled add action when the pick is not yet a favorite', () => {
		expect(fontActionFor(fonts, 'Abril Fatface')).toEqual({ type: 'add', disabled: false, font: null });
	});

	it('returns a remove action when the pick is already a favorite', () => {
		expect(fontActionFor(fonts, 'Inter')).toEqual({ type: 'remove', disabled: false, font: favorite });
	});

	it('disables the add action when the dropdown holds nothing to add', () => {
		expect(fontActionFor(fonts, '')).toEqual({ type: 'add', disabled: true, font: null });
		expect(fontActionFor(fonts, '   ')).toEqual({ type: 'add', disabled: true, font: null });
	});
});
