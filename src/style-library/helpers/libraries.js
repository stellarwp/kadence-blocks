/**
 * Pure helpers for the Style Library's library selector: the default-library predicate, the
 * title-to-slug grammar, and dropdown ordering. No REST or state here — see `hooks/use-libraries`.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { DEFAULT_LIBRARY_SLUG } from '../constants';

/**
 * Whether a slug addresses the default library, which is reset — not removed — on delete.
 *
 * @param {string} slug The library slug.
 *
 * @since TBD
 *
 * @return {boolean} True for the default library.
 */
export function isDefaultLibrary(slug) {
	return slug === DEFAULT_LIBRARY_SLUG;
}

/**
 * Derive a library slug from a human title: lowercased, non-alphanumerics collapsed to single
 * hyphens, trimmed — the same kebab-case grammar token ids use. '' when nothing survives.
 *
 * @param {string} title The typed library title.
 *
 * @since TBD
 *
 * @return {string} The slug.
 */
export function slugifyLibraryTitle(title) {
	return String(title ?? '')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * Whether a typed library title collides with an existing library once run through
 * slugifyLibraryTitle. Two names that read as different can still collide — it folds away case, punctuation, and
 * whitespace, so e.g. "My Library" and "my library" (or "My-Library!") all derive the same slug.
 * An empty title never collides — there is nothing to collide with before the user has typed a
 * name.
 *
 * @param {string} title The typed library title.
 * @param {Array<{slug: string}>} libraries The existing library rows.
 *
 * @since TBD
 *
 * @return {boolean} True when the title's derived slug matches an existing library's slug.
 */
export function isDuplicateLibraryTitle(title, libraries) {
	const slug = slugifyLibraryTitle(title);
	const rows = Array.isArray(libraries) ? libraries : [];

	return slug !== '' && rows.some((library) => library.slug === slug);
}

/**
 * The display name for a library, wherever one is shown (the toggle label, a menu item, the
 * delete/reset confirmation): its stored title when it has one; "Your Library" for the default
 * library specifically when it doesn't, since the default is the library most likely to go
 * untitled and deserves a friendlier name than its slug; the slug for any other untitled library,
 * since there is no generic name that would not make two different libraries look identical.
 *
 * @param {{slug: string, title: string}} library The library row.
 *
 * @since TBD
 *
 * @return {string} The display name.
 */
export function libraryDisplayTitle(library) {
	if (library?.title) {
		return library.title;
	}

	if (isDefaultLibrary(library?.slug)) {
		return __('Your Library', 'kadence-blocks');
	}

	return library?.slug ?? '';
}

/**
 * Whether a typed name collides with another library's *displayed* name, for the rename flow.
 *
 * Deliberately not `isDuplicateLibraryTitle`, which compares derived slugs. A slug is minted from
 * the title once, at creation, and never changes afterwards — so the moment a library is renamed
 * the two diverge permanently: one created as "Brand A" (slug `brand-a`) and renamed to
 * "Winter 2026" keeps `brand-a` forever. Checking a rename against slugs would then reject
 * "Brand A" as taken while nothing on screen is named that, leaving the user no way to understand
 * the refusal. Creation still checks slugs — that is where the slug is minted and a slug
 * collision is a real conflict — so the two questions stay two helpers.
 *
 * `excludeSlug` is the library being renamed, which must be allowed to keep its own name (the
 * user may edit the field and revert it).
 *
 * @param {string}                                title       The typed library name.
 * @param {Array<{slug: string, title: string}>} libraries    The existing library rows.
 * @param {string}                                excludeSlug The slug of the library being renamed.
 *
 * @since TBD
 *
 * @return {boolean} True when another library already displays that name.
 */
export function isDuplicateLibraryName(title, libraries, excludeSlug) {
	const candidate = String(title ?? '')
		.trim()
		.toLowerCase();

	if (candidate === '') {
		return false;
	}

	const rows = Array.isArray(libraries) ? libraries : [];

	return rows.some(
		(library) => library.slug !== excludeSlug && libraryDisplayTitle(library).trim().toLowerCase() === candidate
	);
}

/**
 * The libraries offered as a successor when the one being deleted is the active library — every
 * library except the delete target, in dropdown order.
 *
 * Never empty in practice: the default library cannot be deleted (a DELETE against it resets its
 * values to baseline instead of removing it), so it is always present and always a valid choice,
 * even when the target is the only other library.
 *
 * @param {Array<{slug: string, title: string}>} libraries  The existing library rows.
 * @param {string}                                targetSlug The library about to be deleted.
 *
 * @since TBD
 *
 * @return {Array<{slug: string, title: string}>} The candidate successors, ordered.
 */
export function successorOptions(libraries, targetSlug) {
	return sortLibraries(libraries).filter((library) => library.slug !== targetSlug);
}

/**
 * Order the libraries for the dropdown: the default library first, the rest by title. A library
 * with no stored title (its `title` is the empty string, per the REST contract) sorts by its
 * slug instead.
 *
 * @param {Array<{slug: string, title: string}>} libraries The library rows from the REST list.
 *
 * @since TBD
 *
 * @return {Array<{slug: string, title: string}>} The ordered copy.
 */
export function sortLibraries(libraries) {
	const rows = Array.isArray(libraries) ? [...libraries] : [];

	rows.sort((a, b) => {
		if (isDefaultLibrary(a.slug)) {
			return -1;
		}

		if (isDefaultLibrary(b.slug)) {
			return 1;
		}

		return (a.title || a.slug).localeCompare(b.title || b.slug);
	});

	return rows;
}
