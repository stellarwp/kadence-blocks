/**
 * Split grid items into the pinned default item and the sortable rest, keeping their order.
 *
 * @param {Array<{id: string}>} items     The grid items, in display order.
 * @param {string}              defaultId The default preset's id, or '' for none.
 *
 * @since TBD
 *
 * @return {{pinned: ?Object, sortable: Array<Object>}} The pinned item (or null) and the rest.
 */
export function splitDefaultItem(items, defaultId) {
	const pinned = defaultId ? (items.find((item) => item.id === defaultId) ?? null) : null;

	if (!pinned) {
		return { pinned: null, sortable: items };
	}

	return { pinned, sortable: items.filter((item) => item.id !== defaultId) };
}

/**
 * Put the default slug back at the front of an order that was built from the sortable cards only.
 *
 * @param {string[]} order      The reordered non-default ids.
 * @param {string}   defaultId  The default preset's id.
 * @param {boolean}  hasDefault Whether a default card is pinned on this screen.
 *
 * @since TBD
 *
 * @return {string[]} The full order to store.
 */
export function pinDefaultFirst(order, defaultId, hasDefault) {
	return hasDefault ? [defaultId, ...order] : order;
}
