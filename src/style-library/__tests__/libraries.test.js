/* eslint-env jest */
import {
	isDefaultLibrary,
	isDuplicateLibraryName,
	isDuplicateLibraryTitle,
	libraryDisplayTitle,
	slugifyLibraryTitle,
	sortLibraries,
	successorOptions,
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

describe('isDuplicateLibraryName', () => {
	const libraries = [
		{ slug: 'brand-a', title: 'Winter 2026' },
		{ slug: 'brand-b', title: 'Brand B' },
	];

	it('matches another library ignoring case and surrounding whitespace', () => {
		expect(isDuplicateLibraryName('brand b', libraries, 'brand-a')).toBe(true);
		expect(isDuplicateLibraryName('  Brand B  ', libraries, 'brand-a')).toBe(true);
	});

	it('lets a library keep its own name', () => {
		// The user may edit the field and revert it — a library must not collide with itself.
		expect(isDuplicateLibraryName('Winter 2026', libraries, 'brand-a')).toBe(false);
	});

	// The regression test for the slug/title divergence: a slug is minted from the title once, at
	// creation, and never follows a rename. Checking a rename against slugs (as creation does)
	// would refuse "Brand A" here even though nothing on screen is called that any more, leaving
	// the user no way to understand the refusal.
	it('ignores a slug collision when no library actually displays that name', () => {
		expect(isDuplicateLibraryName('Brand A', libraries, 'brand-b')).toBe(false);
	});

	it('treats an empty name as no collision', () => {
		expect(isDuplicateLibraryName('', libraries, 'brand-a')).toBe(false);
		expect(isDuplicateLibraryName('   ', libraries, 'brand-a')).toBe(false);
	});

	it('compares against the displayed name of an untitled library', () => {
		// An untitled non-default library displays its slug, so that is what a rename collides with.
		expect(isDuplicateLibraryName('brand-c', [{ slug: 'brand-c', title: '' }], 'brand-a')).toBe(true);
	});
});

// Guards the split from isDuplicateLibraryName above: creation still compares derived slugs,
// because creation is where the slug is minted and a slug collision is a genuine conflict. The
// two helpers answer different questions and must not be collapsed into one.
describe('isDuplicateLibraryTitle still compares derived slugs', () => {
	it('flags a title whose slug is taken even when no library displays that title', () => {
		expect(isDuplicateLibraryTitle('Brand A', [{ slug: 'brand-a', title: 'Winter 2026' }])).toBe(true);
	});
});

describe('successorOptions', () => {
	it('excludes the delete target and keeps dropdown order', () => {
		const libraries = [
			{ slug: 'zeta', title: 'Zeta' },
			{ slug: 'default', title: '' },
			{ slug: 'alpha', title: 'Alpha' },
		];

		expect(successorOptions(libraries, 'alpha').map((library) => library.slug)).toEqual(['default', 'zeta']);
	});

	it('still offers the default library when the target is the only other one', () => {
		// The default library can never be deleted (a DELETE against it resets it instead), so the
		// successor list is never empty.
		const libraries = [
			{ slug: 'default', title: '' },
			{ slug: 'brand-a', title: 'Brand A' },
		];

		expect(successorOptions(libraries, 'brand-a').map((library) => library.slug)).toEqual(['default']);
	});
});
