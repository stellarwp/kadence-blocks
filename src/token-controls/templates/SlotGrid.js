/**
 * The arrangement half of a box control: one slot when linked, a 2x2 grid when not.
 *
 * Arrangement only — the link *toggle* is chrome and lives in `ControlShell`. Splitting them lets a
 * control be linkable without being slot-shaped, and slot-shaped without being linkable.
 */

/**
 * Internal dependencies
 */
import { SLOT_LABELS, readSlot, writeSlot } from '../helpers/value-shapes';

/**
 * Display order for the unlinked grid, per role.
 *
 * Corners walk clockwise (top-left, top-right, bottom-right, bottom-left), which is not reading
 * order — so the grid renders slots 0, 1, 3, 2 to put each corner in its true visual position.
 * Sides keep identity order. The stored array order never changes either way.
 *
 * @since TBD
 */
const GRID_ORDER = {
	sides: [0, 1, 2, 3],
	corners: [0, 1, 3, 2],
};

/**
 * Render a value as one slot or four.
 *
 * @param {Object}   props            The component props.
 * @param {*}        props.value      A scalar or a `[top, right, bottom, left]` slot list.
 * @param {Function} props.onChange   Called with the next whole value.
 * @param {boolean}  props.isLinked   Render one slot rather than the grid.
 * @param {Function} props.renderSlot `({ value, onChange, label, index }) => Element`.
 * @param {string}   [props.role]     'sides' or 'corners' — picks labels and grid order.
 * @param {string}   [props.label]    Fallback label for the linked slot.
 * @param {boolean}  [props.collapse] Collapse four identical slots to a scalar on write.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered slot or grid.
 */
export function SlotGrid({ value, onChange, isLinked, renderSlot, role = 'sides', label, collapse = false }) {
	const labels = SLOT_LABELS[role] ?? SLOT_LABELS.sides;
	const order = GRID_ORDER[role] ?? GRID_ORDER.sides;

	if (isLinked) {
		// Reading slot 0 rather than passing the raw value: a caller whose storage is always an
		// array (the block editor) still shows one field with a real value in linked mode.
		return renderSlot({
			value: readSlot(value, 0),
			onChange: (next) => onChange(collapse ? next : Array(labels.length).fill(next)),
			label,
			index: null,
		});
	}

	// Each slot is wrapped and tagged with its position, which is what lets one rule set draw the
	// "which part of the box is this" mark for both geometries: a corner is two adjacent borders, a
	// side is one. The suffix is the slot label verbatim, so the classes cannot drift from the order.
	return (
		<div className="kb-token-control__grid">
			{order.map((index) => (
				<div key={index} className={`kb-token-control__slot kb-token-control__slot--${labels[index]}`}>
					{renderSlot({
						value: readSlot(value, index),
						onChange: (next) => onChange(writeSlot(value, index, next, collapse)),
						label: labels[index],
						index,
					})}
				</div>
			))}
		</div>
	);
}
