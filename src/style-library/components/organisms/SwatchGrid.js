/**
 * The swatch-grid screen body: titled groups of cards, each group ending in an add tile (the
 * Color Palette body shape). Reordering is within a group only — each group is its own
 * `SortableContext`; cross-group moves are not in the design and not built.
 */

/**
 * External dependencies
 */
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';

/**
 * Internal dependencies
 */
import { SectionHeading } from '../atoms/SectionHeading';
import { AddTile } from '../atoms/AddTile';
import { SwatchCard } from '../molecules/SwatchCard';
import { useReorderableList } from '../../hooks/use-reorderable-list';
import './SwatchGrid.scss';

/**
 * The swatch-grid screen body: titled groups of cards, each group ending in an add tile.
 *
 * @param {Object}         props            The component props.
 * @param {Array<Object>}  props.groups     `[{ id, label, items: [SwatchCard props] }]`.
 * @param {string}         [props.selectedId] The selected card id, '' for none.
 * @param {Function}       props.onSelect   Card click handler.
 * @param {Function}       [props.onReorder] Called with `(groupId, orderedIds)` after a drop.
 * @param {Function}       props.onAdd      Called with the group id when its add tile is clicked.
 * @param {string}         props.addLabel   The add-tile label (e.g. 'Add color') — no literal `+`,
 *                                          the icon supplies it.
 * @param {Function}       [props.groupActions] Called with a group and returning the node for its
 *                                          heading's actions slot (e.g. an overflow menu); the
 *                                          grid stays agnostic about what the actions are, the
 *                                          same division of labor as `SwatchCard`'s `preview`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The grid.
 */
export function SwatchGrid({
	groups,
	selectedId = '',
	onSelect,
	onReorder = () => {},
	onAdd,
	addLabel,
	groupActions = null,
}) {
	return (
		<div className="kadence-blocks-style-library__swatch-grid">
			{groups.map((group) => (
				<SwatchGridGroup
					key={group.id}
					group={group}
					selectedId={selectedId}
					onSelect={onSelect}
					onReorder={onReorder}
					onAdd={onAdd}
					addLabel={addLabel}
					groupActions={groupActions}
				/>
			))}
		</div>
	);
}

/**
 * One swatch group: heading, sortable card row, trailing add tile. Not exported — an
 * implementation detail of `SwatchGrid` (each group needs its own `useReorderableList` call, so
 * this can't be inlined into the parent's `.map`).
 *
 * @param {Object}        props            The component props.
 * @param {Object}        props.group      `{ id, label, items: [SwatchCard props] }`.
 * @param {string}        props.selectedId The selected card id, '' for none.
 * @param {Function}      props.onSelect   Card click handler.
 * @param {Function}      props.onReorder  Called with `(groupId, orderedIds)` after a drop.
 * @param {Function}      props.onAdd      Called with the group id when its add tile is clicked.
 * @param {string}        props.addLabel   The add-tile label.
 * @param {Function}      [props.groupActions] Called with `group`, returning the heading's
 *                                         actions slot node.
 *
 * @since TBD
 *
 * @return {JSX.Element} The group.
 */
function SwatchGridGroup({ group, selectedId, onSelect, onReorder, onAdd, addLabel, groupActions }) {
	const ids = group.items.map((item) => item.id);
	const { contextProps, sortableContextProps, useSortableItem, activeId } = useReorderableList({
		ids,
		onReorder: (orderedIds) => onReorder(group.id, orderedIds),
	});
	const activeItem = group.items.find((item) => item.id === activeId);

	return (
		<div className="kadence-blocks-style-library__swatch-group">
			<SectionHeading actions={groupActions ? groupActions(group) : null}>{group.label}</SectionHeading>
			<DndContext {...contextProps}>
				<SortableContext {...sortableContextProps} strategy={rectSortingStrategy}>
					<div className="kadence-blocks-style-library__swatch-group-row">
						{group.items.map((item) => (
							<SortableSwatchCard
								key={item.id}
								item={item}
								isSelected={item.id === selectedId}
								onSelect={onSelect}
								useSortableItem={useSortableItem}
							/>
						))}
						<AddTile label={addLabel} onClick={() => onAdd(group.id)} />
					</div>
				</SortableContext>
				{/* The floating copy that actually follows the pointer/keyboard focus — see the matching
				 * comment on `RowList`'s own `DragOverlay`. No sortable wiring here — this copy doesn't
				 * participate in the sortable group itself. */}
				<DragOverlay>
					{activeItem && (
						<SwatchCard {...activeItem} isSelected={activeItem.id === selectedId} onSelect={() => {}} />
					)}
				</DragOverlay>
			</DndContext>
		</div>
	);
}

/**
 * The per-card sortable wrapper: resolves `useSortableItem` for one card and hands its ref, drag
 * style, and handle props to `SwatchCard`. Not exported — an implementation detail of
 * `SwatchGridGroup`.
 *
 * @param {Object}   props                 The component props.
 * @param {Object}   props.item            The card descriptor (`SwatchCard` props).
 * @param {boolean}  props.isSelected      Whether this card is selected.
 * @param {Function} props.onSelect        Card click handler.
 * @param {Function} props.useSortableItem The per-item sortable hook from `useReorderableList`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The wired card.
 */
function SortableSwatchCard({ item, isSelected, onSelect, useSortableItem }) {
	const { setNodeRef, style, handleProps, isDragging } = useSortableItem(item.id);

	return (
		<SwatchCard
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
