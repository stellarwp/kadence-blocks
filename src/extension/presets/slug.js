/**
 * Slug helpers for user-created presets: derive a kebab slug from a user's label, and de-duplicate it
 * against the slugs a block already uses (baseline + user), mirroring the server's slug pattern.
 */

/**
 * Derive a kebab-case slug from a label: lowercase, non-alphanumeric runs collapsed to a single dash, and
 * leading/trailing dashes trimmed.
 *
 * @param {string} label The user-supplied label.
 * @return {string} The derived slug, possibly empty when the label has no alphanumerics.
 */
export function deriveSlug(label) {
	return String(label || '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * De-duplicate a slug against a set of taken slugs by appending "-2", "-3", … until it is free. The
 * reserved slug "default" is always treated as taken.
 *
 * @param {string}   slug  The candidate slug.
 * @param {string[]} taken The slugs already in use for the block.
 * @return {string} A slug not present in `taken`.
 */
export function dedupeSlug(slug, taken) {
	const used = new Set([...(taken || []), 'default']);

	if (slug !== '' && !used.has(slug)) {
		return slug;
	}

	const base = slug === '' ? 'preset' : slug;
	let candidate = base;
	let suffix = 2;

	while (used.has(candidate)) {
		candidate = `${base}-${suffix}`;
		suffix += 1;
	}

	return candidate;
}
