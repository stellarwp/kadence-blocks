/**
 * The row-list screen body: sortable rows with hairline separators (the Typography / Spacing /
 * Shadow / Button body shape). Wires `useReorderableList` so no screen touches `@dnd-kit`
 * directly, and renders the caller's `EmptyState` when there are no items.
 */

/**
 * External dependencies
 */
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

/**
 * Internal dependencies
 */
import { ListRow } from '../molecules/ListRow';
import { useReorderableList } from '../../hooks/use-reorderable-list';
import './RowList.scss';

/**
 * The row-list screen body: sortable rows with hairline separators.
 *
 * @param {Object}         props            The component props.
 * @param {Array<Object>}  props.items      The row descriptors (`ListRow` props, keyed by `id`).
 * @param {string}         [props.selectedId] The selected row id, '' for none.
 * @param {Function}       props.onSelect   Row click handler.
 * @param {Function}       [props.onReorder] Called with the reordered id list after a drop.
 * @param {?JSX.Element}   [props.empty]    Rendered when `items` is empty.
 *
 * @since TBD
 *
 * @return {JSX.Element} The list.
 */
export function RowList({ items, selectedId = '', onSelect, onReorder = () => {}, empty = null }) {
	const ids = items.map((item) => item.id);
	const { contextProps, sortableContextProps, useSortableItem, activeId } = useReorderableList({ ids, onReorder });
	const activeItem = items.find((item) => item.id === activeId);

	if (!items.length) {
		return <div className="kadence-blocks-style-library__row-list-empty">{empty}</div>;
	}

	return (
		<DndContext {...contextProps}>
			<SortableContext {...sortableContextProps} strategy={verticalListSortingStrategy}>
				<ul className="kadence-blocks-style-library__row-list">
					{items.map((item) => (
						<SortableListRow
							key={item.id}
							item={item}
							isSelected={item.id === selectedId}
							onSelect={onSelect}
							useSortableItem={useSortableItem}
						/>
					))}
				</ul>
			</SortableContext>
			{/* The floating copy that actually follows the pointer/keyboard focus — `dnd-kit` portals
			 * this to `document.body` itself, the same place `Popover` portals to (why the token layer
			 * scopes onto `body.kadence-blocks-style-library-page` too). The item's slot in the list
			 * above shows the empty placeholder instead (`ListRow`'s own `isDragging` treatment). No
			 * sortable wiring here — this copy doesn't participate in the sortable list itself. */}
			<DragOverlay>
				{activeItem && (
					<ListRow {...activeItem} isSelected={activeItem.id === selectedId} onSelect={() => {}} />
				)}
			</DragOverlay>
		</DndContext>
	);
}

/**
 * The per-row sortable wrapper: resolves `useSortableItem` for one row and hands its ref, drag
 * style, and handle props to `ListRow`. Not exported — an implementation detail of `RowList`.
 *
 * @param {Object}   props                 The component props.
 * @param {Object}   props.item            The row descriptor (`ListRow` props).
 * @param {boolean}  props.isSelected      Whether this row is selected.
 * @param {Function} props.onSelect        Row click handler.
 * @param {Function} props.useSortableItem The per-item sortable hook from `useReorderableList`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The wired row.
 */
function SortableListRow({ item, isSelected, onSelect, useSortableItem }) {
	const { setNodeRef, style, handleProps, isDragging } = useSortableItem(item.id);

	return (
		<ListRow
			{...item}
			isSelected={isSelected}
			onSelect={onSelect}
			isDragging={isDragging}
			innerRef={setNodeRef}
			wrapperStyle={style}
			dragHandleProps={handleProps}
		/>
	);
}
