/* eslint-env jest */
import {
	isDefaultLibrary,
	isDuplicateLibraryTitle,
	libraryDisplayTitle,
	slugifyLibraryTitle,
	sortLibraries,
} from '../helpers/libraries';

describe('isDefaultLibrary', () => {
	it('matches only the default slug', () => {
		expect(isDefaultLibrary('default')).toBe(true);
		expect(isDefaultLibrary('brand')).toBe(false);
		expect(isDefaultLibrary('')).toBe(false);
	});
});

describe('slugifyLibraryTitle', () => {
	it('lowercases and collapses spaces to hyphens', () => {
		expect(slugifyLibraryTitle('My Brand Library')).toBe('my-brand-library');
	});

	it('collapses punctuation runs to a single hyphen', () => {
		expect(slugifyLibraryTitle('Acme, Inc. — 2024!')).toBe('acme-inc-2024');
	});

	it('trims leading and trailing separators', () => {
		expect(slugifyLibraryTitle('  --Spaced Out--  ')).toBe('spaced-out');
	});

	it('strips accents', () => {
		// cspell:disable-next-line
		expect(slugifyLibraryTitle('Café Crème')).toBe('cafe-creme');
	});

	it('returns an empty string when nothing survives', () => {
		expect(slugifyLibraryTitle('***')).toBe('');
		expect(slugifyLibraryTitle('')).toBe('');
	});
});

describe('isDuplicateLibraryTitle', () => {
	it('matches a title that is identical to an existing library slug', () => {
		expect(isDuplicateLibraryTitle('brand-a', [{ slug: 'brand-a' }])).toBe(true);
	});

	it('matches a title that only differs by case from an existing library', () => {
		expect(isDuplicateLibraryTitle('MY LIBRARY', [{ slug: 'my-library' }])).toBe(true);
	});

	it('matches a title that only differs by punctuation and spacing from an existing library', () => {
		expect(isDuplicateLibraryTitle('My-Library!!', [{ slug: 'my-library' }])).toBe(true);
	});

	it('does not match a title with no colliding library', () => {
		expect(isDuplicateLibraryTitle('Brand B', [{ slug: 'brand-a' }])).toBe(false);
	});

	it('does not match an empty title even when an empty-slug row exists', () => {
		expect(isDuplicateLibraryTitle('', [{ slug: 'brand-a' }])).toBe(false);
		expect(isDuplicateLibraryTitle('***', [{ slug: 'brand-a' }])).toBe(false);
	});

	it('treats a missing libraries array as no existing libraries', () => {
		expect(isDuplicateLibraryTitle('Brand A', undefined)).toBe(false);
	});
});

describe('libraryDisplayTitle', () => {
	it('shows the title a row carries', () => {
		expect(libraryDisplayTitle({ slug: 'default', title: 'Acme Brand' })).toBe('Acme Brand');
	});

	it('shows the default library the name PHP serves it under, with no JS default of its own', () => {
		// The REST list and the admin feed both apply Token_Store::default_title(), so an untitled
		// default library never reaches this helper without a name.
		expect(libraryDisplayTitle({ slug: 'default', title: 'Your Library' })).toBe('Your Library');
	});

	it('falls back to the slug for a library with no title, default or not', () => {
		expect(libraryDisplayTitle({ slug: 'brand-a', title: '' })).toBe('brand-a');
		expect(libraryDisplayTitle({ slug: 'default', title: '' })).toBe('default');
	});

	it('is empty when the row has neither', () => {
		expect(libraryDisplayTitle({})).toBe('');
		expect(libraryDisplayTitle(undefined)).toBe('');
	});
});

describe('sortLibraries', () => {
	it('puts the default library first and the rest by title', () => {
		const libraries = [
			{ slug: 'zeta', title: 'Zeta' },
			{ slug: 'default', title: 'Default' },
			{ slug: 'alpha', title: 'Alpha' },
		];

		expect(sortLibraries(libraries).map((library) => library.slug)).toEqual(['default', 'alpha', 'zeta']);
	});

	it('falls back to the slug for ordering when a row has an empty title', () => {
		const libraries = [
			{ slug: 'zeta', title: '' },
			{ slug: 'default', title: '' },
			{ slug: 'alpha', title: '' },
		];

		expect(sortLibraries(libraries).map((library) => library.slug)).toEqual(['default', 'alpha', 'zeta']);
	});

	it('does not mutate its input', () => {
		const libraries = [
			{ slug: 'alpha', title: 'Alpha' },
			{ slug: 'default', title: 'Default' },
		];
		const original = [...libraries];

		sortLibraries(libraries);

		expect(libraries).toEqual(original);
	});
});
