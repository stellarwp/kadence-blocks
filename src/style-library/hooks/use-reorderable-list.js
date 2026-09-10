/**
 * WordPress dependencies
 */
import { useCallback, useMemo, useState } from '@wordpress/element';

/**
 * External dependencies
 */
import { closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';

/**
 * Internal dependencies
 */
import { moveItem } from '../helpers/reorder';

/**
 * Sortable-list wiring for a vertical row list or a wrapping card group: sensors, collision
 * detection, and a drag-end handler that reduces to an ordered-id callback. Packages the
 * `@dnd-kit` ceremony once so no screen touches it directly.
 *
 * Uses `PointerSensor` + `KeyboardSensor` — keyboard reordering comes for free because the drag
 * handle is a real `<button>` that can receive focus. The sorting strategy (vertical list vs.
 * wrapping grid) is the template's choice, not this hook's — pass it to `SortableContext`
 * alongside `sortableContextProps`.
 *
 * `activeId` tracks which item is currently being dragged, so a template can render that one item
 * as an empty drop-target placeholder in its normal list position (via each item's own
 * `isDragging`) while a `DragOverlay` elsewhere in the tree carries the floating copy that follows
 * the pointer/focus.
 *
 * @param {Object}        options           The options.
 * @param {Array<string>} options.ids       The ordered item ids.
 * @param {Function}      options.onReorder Called with the new ordered-id list (no-ops skipped).
 *
 * @since TBD
 *
 * @return {Object} `{ contextProps, sortableContextProps, useSortableItem, activeId }` —
 *         `contextProps`/`sortableContextProps` spread onto `DndContext`/`SortableContext`;
 *         `useSortableItem( id )` returns `{ setNodeRef, style, handleProps, isDragging }` for a
 *         row/card; `activeId` is the currently-dragged item's id, or `''` when nothing is
 *         dragging — the value a `DragOverlay` consumer uses to look up the item it renders.
 */
export function useReorderableList({ ids, onReorder }) {
	const [activeId, setActiveId] = useState('');

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
	);

	const handleDragStart = useCallback((event) => {
		setActiveId(String(event.active.id));
	}, []);

	const handleDragEnd = useCallback(
		(event) => {
			const { active, over } = event;

			setActiveId('');

			if (!over) {
				return;
			}

			const next = moveItem(ids, String(active.id), String(over.id));

			if (next !== ids) {
				onReorder(next);
			}
		},
		[ids, onReorder]
	);

	const handleDragCancel = useCallback(() => {
		setActiveId('');
	}, []);

	const contextProps = useMemo(
		() => ({
			sensors,
			collisionDetection: closestCenter,
			onDragStart: handleDragStart,
			onDragEnd: handleDragEnd,
			onDragCancel: handleDragCancel,
		}),
		[sensors, handleDragStart, handleDragEnd, handleDragCancel]
	);

	const sortableContextProps = useMemo(() => ({ items: ids }), [ids]);

	const useSortableItem = (id) => {
		const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

		return {
			setNodeRef,
			// Applied the same way whether or not this item is the one being dragged — `dnd-kit`'s own
			// sorting strategy already computes every item's transform, active item included, as
			// "where this item's slot is in the previewed new order."
			style: {
				transform: transform
					? `translate3d(${Math.round(transform.x)}px, ${Math.round(transform.y)}px, 0)`
					: undefined,
				transition,
			},
			handleProps: { ...attributes, ...listeners },
			isDragging,
		};
	};

	return { contextProps, sortableContextProps, useSortableItem, activeId };
}
