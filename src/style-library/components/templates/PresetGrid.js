/**
 * External dependencies
 */
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';

/**
 * Internal dependencies
 */
import { PresetCard } from '../molecules/PresetCard';
import { useReorderableList } from '../../hooks/use-reorderable-list';
import { splitDefaultItem } from '../../helpers/preset-grid';
import './PresetGrid.scss';

/**
 * Render the preset card grid.
 *
 * @param {Object}        props              The component props.
 * @param {Array<Object>} props.items        The card descriptors (`PresetCard` props, keyed by `id`).
 * @param {string}        [props.selectedId] The selected card id, '' for none.
 * @param {string}        [props.defaultId]  The default preset's id, '' when the block has none.
 * @param {Function}      props.onSelect     Card click handler.
 * @param {Function}      [props.onReorder]  Called with the reordered non-default ids after a drop.
 * @param {?JSX.Element}  [props.empty]      Rendered when `items` is empty.
 *
 * @since TBD
 *
 * @return {JSX.Element} The grid.
 */
export function PresetGrid({ items, selectedId = '', defaultId = '', onSelect, onReorder = () => {}, empty = null }) {
	const { pinned, sortable } = splitDefaultItem(items, defaultId);
	const ids = sortable.map((item) => item.id);
	const { contextProps, sortableContextProps, useSortableItem, activeId } = useReorderableList({ ids, onReorder });
	const activeItem = sortable.find((item) => item.id === activeId);

	if (!items.length) {
		return <div className="kadence-blocks-style-library__preset-grid-empty">{empty}</div>;
	}

	return (
		<DndContext {...contextProps}>
			<SortableContext {...sortableContextProps} strategy={rectSortingStrategy}>
				<ul className="kadence-blocks-style-library__preset-grid">
					{pinned && (
						<PresetCard {...pinned} isDefault isSelected={pinned.id === selectedId} onSelect={onSelect} />
					)}
					{sortable.map((item) => (
						<SortablePresetCard
							key={item.id}
							item={item}
							isSelected={item.id === selectedId}
							onSelect={onSelect}
							useSortableItem={useSortableItem}
						/>
					))}
				</ul>
			</SortableContext>
			<DragOverlay>
				{activeItem && (
					<PresetCard
						{...activeItem}
						isDraggable
						isSelected={activeItem.id === selectedId}
						onSelect={() => {}}
					/>
				)}
			</DragOverlay>
		</DndContext>
	);
}

/**
 * The per-card sortable wrapper: resolves `useSortableItem` for one card and hands its ref, drag
 * style, and handle props to `PresetCard`. Not exported — an implementation detail of `PresetGrid`.
 *
 * @param {Object}   props                 The component props.
 * @param {Object}   props.item            The card descriptor (`PresetCard` props).
 * @param {boolean}  props.isSelected      Whether this card is selected.
 * @param {Function} props.onSelect        Card click handler.
 * @param {Function} props.useSortableItem The per-item sortable hook from `useReorderableList`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The wired card.
 */
function SortablePresetCard({ item, isSelected, onSelect, useSortableItem }) {
	const { setNodeRef, style, handleProps, isDragging } = useSortableItem(item.id);

	return (
		<PresetCard
			{...item}
			isDraggable
			isSelected={isSelected}
			onSelect={onSelect}
			isDragging={isDragging}
			innerRef={setNodeRef}
			wrapperStyle={style}
			dragHandleProps={handleProps}
		/>
	);
}
