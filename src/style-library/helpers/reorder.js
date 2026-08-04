/**
 * Pure id-list reordering for the Style Library's local/optimistic drag-and-reorder. There is no
 * backend order concept yet — screens hand the result of `moveItem` back to their own local state
 * only, never to a write path.
 */

/**
 * External dependencies
 */
import { arrayMove } from '@dnd-kit/sortable';

/**
 * Move the item with `activeId` to the position of `overId`, returning a new array. Unknown ids
 * or a same-position drop return the input array unchanged (same reference), so callers can
 * cheaply detect a no-op.
 *
 * @param {Array<string>} ids      The ordered id list.
 * @param {string}        activeId The dragged id.
 * @param {string}        overId   The id dropped onto.
 *
 * @since TBD
 *
 * @return {Array<string>} The reordered list, or the input on a no-op.
 */
export function moveItem(ids, activeId, overId) {
	if (activeId === overId) {
		return ids;
	}

	const fromIndex = ids.indexOf(activeId);
	const toIndex = ids.indexOf(overId);

	if (fromIndex === -1 || toIndex === -1) {
		return ids;
	}

	return arrayMove(ids, fromIndex, toIndex);
}
