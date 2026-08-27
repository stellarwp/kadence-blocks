/**
 * Deciding when two stored font-family values name the same font — a pure module (no React/JSX/
 * `.scss`) so it is jest-covered directly.
 *
 * The rule is case-insensitivity, and it is shared rather than inlined because three separate
 * comparisons depend on it: which tab the picker opens on, which favorites row renders as active,
 * and which catalog row does. A family name is a proper noun rather than an identifier — `Inter`
 * and `INTER` name one face — and every other layer already agrees on that: the REST catalog gate
 * accepts either spelling, the favorites index folds case on membership, and both option lists
 * collapse duplicates on a lowercased key. A comparison here that did not fold would leave a
 * field set to a spelling the favorites list holds differently opening on the wrong tab with no row
 * marked, which reads as the picker having lost the value.
 */

/**
 * Whether two stored family values name the same font.
 *
 * @param {*} a One stored family value.
 * @param {*} b The other.
 *
 * @since TBD
 *
 * @return {boolean} Whether they name the same font. Two empty values are not a match: an unset
 *         field has no family to be the same as.
 */
export function sameFamily(a, b) {
	const left = typeof a === 'string' ? a.trim().toLowerCase() : '';
	const right = typeof b === 'string' ? b.trim().toLowerCase() : '';

	return left !== '' && left === right;
}
