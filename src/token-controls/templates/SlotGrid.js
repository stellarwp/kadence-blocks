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
 * The position label a glyph keys its highlighted edge(s) on: the slot's own label, or `'all'` for
 * the linked, every-edge state — a state the grid never rendered before this row anatomy.
 *
 * @param {string}  role  'sides' or 'corners' — picks the label set.
 * @param {?number} index The slot index, or `null` while linked.
 *
 * @since TBD
 *
 * @return {string} The position the glyph's modifier class keys on.
 */
function glyphPosition(role, index) {
	if (index === null) {
		return 'all';
	}

	const labels = SLOT_LABELS[role] ?? SLOT_LABELS.sides;

	return labels[index] ?? 'all';
}

/**
 * The row's leading glyph: a small box marking which edge(s) a slot names.
 *
 * A real element rather than a border overlay on the field, so its edges are independent of the
 * field's own border/radius. Role-agnostic geometry — `sides` highlights one edge, `corners`
 * highlights two adjacent edges and rounds the corner they meet at, and the linked `all` state
 * highlights every edge (and, for corners, rounds every corner) — so the same helper serves any
 * future role built on the same `sides`/`corners` distinction.
 *
 * @param {string}  role  'sides' or 'corners'.
 * @param {?number} index The slot index, or `null` while linked.
 *
 * @since TBD
 *
 * @return {JSX.Element} The glyph element.
 */
function renderGlyph(role, index) {
	const position = glyphPosition(role, index);

	return (
		<span
			className={`kb-token-control__glyph kb-token-control__glyph--${role} kb-token-control__glyph--${position}`}
			aria-hidden="true"
		/>
	);
}

/**
 * Render a value as one slot or four.
 *
 * @param {Object}   props            The component props.
 * @param {*}        props.value      A scalar or a `[top, right, bottom, left]` slot list.
 * @param {Function} props.onChange   Called with the next whole value.
 * @param {boolean}  props.isLinked   Render one slot rather than the grid.
 * @param {Function} props.renderSlot `({ value, onChange, label, index }) => Element`.
 * @param {string}   [props.role]     'sides' or 'corners' — picks labels, grid order, and glyph shape.
 * @param {string}   [props.label]    Fallback label for the linked slot.
 * @param {boolean}  [props.collapse] Collapse four identical slots to a scalar on write.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered slot or grid, each row led by its glyph.
 */
export function SlotGrid({ value, onChange, isLinked, renderSlot, role = 'sides', label, collapse = false }) {
	const labels = SLOT_LABELS[role] ?? SLOT_LABELS.sides;
	const order = GRID_ORDER[role] ?? GRID_ORDER.sides;

	if (isLinked) {
		// Reading slot 0 rather than passing the raw value: a caller whose storage is always an
		// array (the block editor) still shows one field with a real value in linked mode. The row
		// still gets a glyph — the "all edges"/"all corners" variant — where linked mode used to
		// render no mark at all.
		return (
			<div className="kb-token-control__row">
				{renderGlyph(role, null)}
				{renderSlot({
					value: readSlot(value, 0),
					onChange: (next) => onChange(collapse ? next : Array(labels.length).fill(next)),
					label,
					index: null,
				})}
			</div>
		);
	}

	// Each row is tagged with its position for identification/testing; the glyph inside it (not a
	// CSS rule keyed on this class) is what actually draws the highlighted edge(s).
	return (
		<div className="kb-token-control__grid">
			{order.map((index) => (
				<div key={index} className={`kb-token-control__row kb-token-control__row--${labels[index]}`}>
					{renderGlyph(role, index)}
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
