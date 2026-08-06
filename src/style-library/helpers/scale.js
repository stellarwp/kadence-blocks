/**
 * Pure row/slug/value helpers behind the scale-screen contract shared by Border Radius, Border
 * Width, Spacing, and Icon Sizes: mapping a feed's UI-schema group to row descriptors, applying a
 * locally pending drag order, minting the next free custom slug, building a custom primitive's
 * canonical id, and seeding a settings-panel draft from the feed. No React, no JSX, no REST — see
 * `helpers/scale-flows.js` for the REST orchestration and `hooks/use-scale-screen.js` for the state
 * binding.
 */

/**
 * Map a feed's UI-schema group to the row descriptors a scale screen renders, in feed order.
 *
 * @param {{ groups?: Record<string, Array<Object>> }} schema The feed's UI schema.
 * @param {Record<string, string>}                      values The feed's resolved value map.
 * @param {string}                                       group  The UI-schema group label to list.
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string, value: string, userCreated: boolean}>} The rows, or
 *         `[]` for a missing schema or an unknown group.
 */
export function scaleRows(schema, values, group) {
	const entries = schema?.groups?.[group];

	if (!Array.isArray(entries)) {
		return [];
	}

	return entries.map((entry) => ({
		id: entry.id,
		label: entry.label,
		value: values?.[entry.id] ?? '',
		userCreated: entry.userCreated === true,
	}));
}

/**
 * Reorder rows by an id list: listed rows first in that order, unlisted rows appended in their
 * incoming order. An id in `orderedIds` that names no row is ignored. Returns the exact same array
 * reference when the order is already a no-op, so a caller can skip a re-render or a needless local
 * override.
 *
 * @param {Array<{id: string}>} rows       The rows in their current order.
 * @param {string[]}             orderedIds The desired id order.
 *
 * @since TBD
 *
 * @return {Array<Object>} The reordered rows.
 */
export function applyRowOrder(rows, orderedIds) {
	if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
		return rows;
	}

	const remaining = new Map(rows.map((row) => [row.id, row]));
	const ordered = [];

	orderedIds.forEach((id) => {
		if (remaining.has(id)) {
			ordered.push(remaining.get(id));
			remaining.delete(id);
		}
	});

	const next = [...ordered, ...remaining.values()];
	const isNoOp = next.length === rows.length && next.every((row, index) => row === rows[index]);

	return isNoOp ? rows : next;
}

/**
 * The first free terminal slug for a minted custom token: the bare base first, then the base with a
 * numeric suffix (`radius`, `radius-2`, `radius-3`, ...).
 *
 * `existingIds` is the full list of canonical dot-path ids already registered — not just this
 * screen's group — because the custom-primitive id space is flat per DTCG `$type`
 * (`primitive.<type>.custom.<slug>`), so a collision can come from a token minted into any other
 * group under the same type. Collision is checked by extracting each id's terminal (last)
 * dot-segment rather than rebuilding the full candidate id, so this helper needs no `tokenType`
 * argument and stays agnostic of which scale screen is calling it.
 *
 * @param {string[]} existingIds The full canonical ids already registered.
 * @param {string}   slugBase    The slug stem (e.g. `'radius'`).
 *
 * @since TBD
 *
 * @return {string} The first free terminal slug.
 */
export function nextScaleSlug(existingIds, slugBase) {
	const takenSlugs = new Set(
		(existingIds || []).map((id) => {
			const segments = String(id).split('.');
			return segments[segments.length - 1];
		})
	);

	if (!takenSlugs.has(slugBase)) {
		return slugBase;
	}

	let suffix = 2;

	while (takenSlugs.has(`${slugBase}-${suffix}`)) {
		suffix += 1;
	}

	return `${slugBase}-${suffix}`;
}

/**
 * Build the canonical id for a minted custom primitive. Mirrors
 * `Document\Reserved_Namespace::canonical()`.
 *
 * @param {string} tokenType The DTCG `$type` (e.g. `'dimension'`).
 * @param {string} slug      The terminal slug.
 *
 * @since TBD
 *
 * @return {string} The canonical dot-path id.
 */
export function customScaleTokenId(tokenType, slug) {
	return `primitive.${tokenType}.custom.${slug}`;
}

/**
 * Seed a settings-panel draft for one row: the effective label, and the value — preferring the
 * authored responsive/clamp shape over the resolved scalar when the leaf carries one, so
 * `buildTokenLeaf()` round-trips an existing tablet/mobile envelope instead of clobbering it with a
 * flattened scalar on save.
 *
 * @param {?{id: string, label: string}}  entry      The row/schema entry (`{ id, label, ... }`), or
 *                                                    null for an unknown id.
 * @param {Record<string, string>}        values     The feed's resolved value map.
 * @param {Record<string, Object>}        responsive The feed's authored responsive/clamp map.
 *
 * @since TBD
 *
 * @return {?{label: string, value: *}} The seeded draft, or null for an unknown id.
 */
export function scaleInitialValues(entry, values, responsive) {
	if (!entry) {
		return null;
	}

	const authored = responsive?.[entry.id];

	return {
		label: entry.label,
		value: authored !== undefined ? authored : (values?.[entry.id] ?? ''),
	};
}
