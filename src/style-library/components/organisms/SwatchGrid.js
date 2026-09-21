/**
 * The swatch-grid screen body: titled groups of cards, each group ending in an add tile (the
 * Color Palette body shape). Two sortable levels: the groups themselves reorder in one outer
 * `SortableContext`, and each group's swatches reorder in the group's own inner one. A swatch
 * never crosses into another group — that move is not in the design and not built.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SectionHeading } from '../atoms/SectionHeading';
import { AddTile } from '../atoms/AddTile';
import { DragHandle } from '../atoms/DragHandle';
import { SwatchCard } from '../molecules/SwatchCard';
import { useReorderableList } from '../../hooks/use-reorderable-list';
import './SwatchGrid.scss';

/**
 * The accessible name of a group's drag handle.
 *
 * @param {string} label The group's display label.
 *
 * @since TBD
 *
 * @return {string} `Drag to reorder <label>`.
 */
function groupHandleLabel(label) {
	return sprintf(
		// translators: %s: the color group name.
		__('Drag to reorder %s', 'kadence-blocks'),
		label
	);
}

/**
 * The swatch-grid screen body: titled groups of cards, each group ending in an add tile.
 *
 * @param {Object}         props            The component props.
 * @param {Array<Object>}  props.groups     `[{ id, label, pendingDelete, items: [SwatchCard props] }]`.
 * @param {string}         [props.selectedId] The selected card id, '' for none.
 * @param {Function}       props.onSelect   Card click handler.
 * @param {Function}       [props.onReorder] Called with `(groupId, orderedIds)` after a swatch drop.
 * @param {Function}       [props.onReorderGroups] Called with the ordered group id list after a
 *                                          group drop.
 * @param {Function}       props.onAdd      Called with the group id when its add tile is clicked.
 * @param {string}         props.addLabel   The add-tile label (e.g. 'Add color') — no literal `+`,
 *                                          the icon supplies it.
 * @param {Function}       [props.groupActions] Called with a group and returning the node for its
 *                                          heading's actions slot (e.g. an overflow menu); the
 *                                          grid stays agnostic about what the actions are, the
 *                                          same division of labor as `SwatchCard`'s `preview`.
 * @param {Array<string>}  [props.addingGroupIds] Group ids with an add-color currently in flight —
 *                                          disables just that group's own add tile, not every
 *                                          group's.
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
	onReorderGroups = () => {},
	onAdd,
	addLabel,
	groupActions = null,
	addingGroupIds = [],
}) {
	const groupIds = groups.map((group) => group.id);
	const {
		contextProps,
		sortableContextProps,
		useSortableItem: useSortableGroup,
		activeId: activeGroupId,
	} = useReorderableList({
		ids: groupIds,
		onReorder: onReorderGroups,
	});
	const activeGroup = groups.find((group) => group.id === activeGroupId);

	return (
		<DndContext {...contextProps}>
			<SortableContext {...sortableContextProps} strategy={verticalListSortingStrategy}>
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
							isAdding={addingGroupIds.includes(group.id)}
							useSortableGroup={useSortableGroup}
						/>
					))}
				</div>
			</SortableContext>
			<DragOverlay>
				{activeGroup && (
					<SwatchGroupGhost
						group={activeGroup}
						selectedId={selectedId}
						addLabel={addLabel}
						groupActions={groupActions}
					/>
				)}
			</DragOverlay>
		</DndContext>
	);
}

/**
 * One swatch group: heading, sortable card row, trailing add tile. Not exported — an
 * implementation detail of `SwatchGrid` (each group needs its own `useReorderableList` call, so
 * this can't be inlined into the parent's `.map`).
 *
 * @param {Object}        props            The component props.
 * @param {Object}        props.group      `{ id, label, pendingDelete, items: [SwatchCard props] }`.
 * @param {string}        props.selectedId The selected card id, '' for none.
 * @param {Function}      props.onSelect   Card click handler.
 * @param {Function}      props.onReorder  Called with `(groupId, orderedIds)` after a drop.
 * @param {Function}      props.onAdd      Called with the group id when its add tile is clicked.
 * @param {string}        props.addLabel   The add-tile label.
 * @param {Function}      [props.groupActions] Called with `group`, returning the heading's
 *                                         actions slot node.
 * @param {boolean}       [props.isAdding] Whether THIS group's add-color is currently in flight —
 *                                         disables just its own add tile.
 * @param {Function}      props.useSortableGroup The per-item sortable hook from the grid's outer
 *                                         `useReorderableList`, called with this group's id.
 *
 * @since TBD
 *
 * @return {JSX.Element} The group.
 */
function SwatchGridGroup({
	group,
	selectedId,
	onSelect,
	onReorder,
	onAdd,
	addLabel,
	groupActions,
	isAdding,
	useSortableGroup,
}) {
	const groupSortable = useSortableGroup(group.id);
	const ids = group.items.map((item) => item.id);
	const { contextProps, sortableContextProps, useSortableItem, activeId } = useReorderableList({
		ids,
		onReorder: (orderedIds) => onReorder(group.id, orderedIds),
	});
	const activeItem = group.items.find((item) => item.id === activeId);
	// The slot is reserved for the whole row once ANY item in the group has a pill, so pill-less
	// cards in that row still line up with the ones that have one.
	const reservePillSlot = group.items.some((item) => Boolean(item.pill));
	// Cascades from `applyOptimisticOverlay`'s group-deletion handling (see `helpers/palettes.js`'s
	// `mapPaletteToSwatchGroups`): while the group itself is mid-delete, its heading (and the
	// Rename/Delete menu and Add-color tile it hosts) must read as inert too, not just its swatches.
	const isGroupPendingDelete = Boolean(group.pendingDelete);

	return (
		<div
			ref={groupSortable.setNodeRef}
			style={groupSortable.style}
			className={classnames('kadence-blocks-style-library__swatch-group', {
				'kadence-blocks-style-library__swatch-group--placeholder': groupSortable.isDragging,
			})}
		>
			<div
				className={classnames('kadence-blocks-style-library__swatch-group-heading', {
					'kadence-blocks-style-library__swatch-group-heading--pending-delete': isGroupPendingDelete,
				})}
			>
				<SectionHeading
					leading={
						!isGroupPendingDelete ? (
							<DragHandle handleProps={groupSortable.handleProps} label={groupHandleLabel(group.label)} />
						) : null
					}
					actions={!isGroupPendingDelete && groupActions ? groupActions(group) : null}
				>
					{group.label}
				</SectionHeading>
			</div>
			<DndContext {...contextProps}>
				<SortableContext {...sortableContextProps} strategy={rectSortingStrategy}>
					<div className="kadence-blocks-style-library__swatch-group-grid">
						{group.items.map((item) => (
							<SortableSwatchCard
								key={item.id}
								item={item}
								isSelected={item.id === selectedId}
								onSelect={onSelect}
								useSortableItem={useSortableItem}
								reservePillSlot={reservePillSlot}
							/>
						))}
						<AddTile
							label={addLabel}
							onClick={() => onAdd(group.id)}
							disabled={isAdding || isGroupPendingDelete}
						/>
					</div>
				</SortableContext>
				{/* The floating copy that actually follows the pointer/keyboard focus — see the matching
				 * comment on `RowList`'s own `DragOverlay`. No sortable wiring here — this copy doesn't
				 * participate in the sortable group itself. */}
				<DragOverlay>
					{activeItem && (
						// `pill={null}` after the spread: the floating copy must not carry a second
						// focusable Reset button duplicating the original card's accessible name.
						// `reservePillSlot` still carries the row's decision, so the overlay keeps
						// matching the height of the placeholder it stands in for.
						<SwatchCard
							{...activeItem}
							isSelected={activeItem.id === selectedId}
							onSelect={() => {}}
							pill={null}
							reservePillSlot={reservePillSlot}
						/>
					)}
				</DragOverlay>
			</DndContext>
		</div>
	);
}

/**
 * The floating copy of a whole group shown under the pointer while the group is dragged. Purely
 * presentational: it calls no sortable or dnd hook, so the overlay registers no drop targets.
 *
 * @param {Object}    props            The component props.
 * @param {Object}    props.group      `{ id, label, items: [SwatchCard props] }`.
 * @param {string}    props.selectedId The selected card id, '' for none.
 * @param {string}    props.addLabel   The add-tile label.
 * @param {?Function} props.groupActions Called with `group`, returning the heading's actions node.
 *
 * @since TBD
 *
 * @return {JSX.Element} The ghost.
 */
export function SwatchGroupGhost({ group, selectedId, addLabel, groupActions }) {
	const reservePillSlot = group.items.some((item) => Boolean(item.pill));

	return (
		<div className="kadence-blocks-style-library__swatch-group kadence-blocks-style-library__swatch-group-ghost">
			<SectionHeading
				leading={<DragHandle label={groupHandleLabel(group.label)} />}
				actions={groupActions ? groupActions(group) : null}
			>
				{group.label}
			</SectionHeading>
			<div className="kadence-blocks-style-library__swatch-group-grid">
				{group.items.map((item) => (
					<SwatchCard
						key={item.id}
						{...item}
						isSelected={item.id === selectedId}
						onSelect={() => {}}
						pill={null}
						reservePillSlot={reservePillSlot}
					/>
				))}
				<AddTile label={addLabel} onClick={() => {}} disabled />
			</div>
		</div>
	);
}

/**
 * The per-card sortable wrapper: resolves `useSortableItem` for one card and hands its ref, drag
 * style, and handle props to `SwatchCard`. Not exported — an implementation detail of
 * `SwatchGridGroup`.
 *
 * @param {Object}   props                  The component props.
 * @param {Object}   props.item             The card descriptor (`SwatchCard` props).
 * @param {boolean}  props.isSelected       Whether this card is selected.
 * @param {Function} props.onSelect         Card click handler.
 * @param {Function} props.useSortableItem  The per-item sortable hook from `useReorderableList`.
 * @param {boolean}  props.reservePillSlot  Whether the group has at least one pill, forwarded to
 *                                          `SwatchCard` so every card in the row reserves the slot.
 *
 * @since TBD
 *
 * @return {JSX.Element} The wired card.
 */
function SortableSwatchCard({ item, isSelected, onSelect, useSortableItem, reservePillSlot }) {
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
			reservePillSlot={reservePillSlot}
		/>
	);
}
