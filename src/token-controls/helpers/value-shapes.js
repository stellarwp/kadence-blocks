/**
 * The value shapes a box-shaped token control reads and writes.
 *
 * A control's value is either a **scalar** — a token id or a CSS literal — or a **slot list**, the
 * positional four-element array `[top, right, bottom, left]`. Index 0 is `top` for a side property
 * and `top-left` for a corner property, both walking clockwise from the same origin, so one array
 * serves padding, margin, border width and radius with no per-property branching.
 *
 * Deliberately no responsive handling here. The Style Library stores breakpoints as one nested
 * `{ base, responsive }` envelope; the block editor stores them as sibling attributes
 * (`borderRadius` / `tabletBorderRadius` / `mobileBorderRadius`). A control that understood either
 * shape could not serve both, so each app's wrapper resolves the active breakpoint and hands the
 * control a plain value.
 */

/**
 * The number of slots in an unlinked box value. Not a general "sides" count — it is the array
 * length the stored preset shape requires, which is exactly four or nothing.
 *
 * @since TBD
 */
export const SLOT_COUNT = 4;

/**
 * Slot index labels per role, in stored order. `SlotGrid` reorders corners for display; the stored
 * order never changes.
 *
 * @since TBD
 */
export const SLOT_LABELS = {
	sides: ['top', 'right', 'bottom', 'left'],
	corners: ['top-left', 'top-right', 'bottom-right', 'bottom-left'],
};

/**
 * Whether a value is a slot list rather than a scalar.
 *
 * @param {*} value The value to test.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is a positional slot array.
 */
export function isSlotList(value) {
	return Array.isArray(value) && value.length === SLOT_COUNT;
}

/**
 * Expand a scalar to four identical slots, or pass an existing slot list through.
 *
 * @param {*} value A scalar or an existing slot list.
 *
 * @since TBD
 *
 * @return {Array} A four-element slot list.
 */
export function toSlotList(value) {
	if (isSlotList(value)) {
		return [...value];
	}

	return Array(SLOT_COUNT).fill(value ?? '');
}

/**
 * Reject a slot index outside the four this shape has.
 *
 * Out of range is a caller bug, not a user input, and it corrupts silently rather than failing:
 * index `4` grows the array to five entries, which `isSlotList` then rejects, and a negative or
 * fractional index writes an array *property* that never shows up in the value. Throwing surfaces
 * it where it happens.
 *
 * @param {number} index The slot index to check.
 *
 * @since TBD
 *
 * @throws {Error} When `index` is not an integer in `0`-`3`.
 *
 * @return {void}
 */
function guardSlotIndex(index) {
	if (!Number.isInteger(index) || index < 0 || index >= SLOT_COUNT) {
		throw new Error(`Slot index must be an integer between 0 and ${SLOT_COUNT - 1}; received ${index}.`);
	}
}

/**
 * Read one slot, whichever shape the value is in. A scalar answers for every index, since a linked
 * value means "the same on all four".
 *
 * @param {*}      value The current scalar or slot list.
 * @param {number} index The slot to read, 0-3.
 *
 * @since TBD
 *
 * @throws {Error} When `index` is not an integer in `0`-`3`.
 *
 * @return {*} That slot's value.
 */
export function readSlot(value, index) {
	guardSlotIndex(index);

	return isSlotList(value) ? value[index] : value;
}

/**
 * Write one slot, keeping the value in whichever shape the caller's `collapse` choice asks for.
 *
 * The Style Library collapses four identical slots back to a scalar, because its stored preset
 * shape treats a scalar as "every slot" and a uniform array would round-trip as an unlinked value.
 * The block editor never collapses — its attribute is always a four-element array. Hence the flag
 * rather than a hardcoded rule.
 *
 * @param {*}       value      The current scalar or slot list.
 * @param {number}  index      The slot to write, 0-3.
 * @param {*}       next       The value for that slot.
 * @param {boolean} [collapse] Return a scalar when every slot ends up identical.
 *
 * @since TBD
 *
 * @throws {Error} When `index` is not an integer in `0`-`3`.
 *
 * @return {*} The next value.
 */
export function writeSlot(value, index, next, collapse = false) {
	guardSlotIndex(index);

	const slots = toSlotList(value);

	slots[index] = next;

	return collapse && slots.every((slot) => slot === slots[0]) ? slots[0] : slots;
}

/**
 * Whether a raw value names a design token rather than being a CSS literal.
 *
 * Every registered token id lives under one of the document's two roots, which a literal never
 * starts with — even one containing a dot, like `0.5rem`.
 *
 * @param {*} value The candidate value.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is shaped like a token id.
 */
export function isTokenId(value) {
	return typeof value === 'string' && (value.startsWith('primitive.') || value.startsWith('semantic.'));
}

/**
 * Collapse a slot list the way CSS shorthand does: `1px`, `1px 2px`, `1px 2px 3px`, or all four.
 *
 * Only useful for *showing* a value. A linked control edits one value for every side, so it cannot
 * represent a default that differs side to side — writing `0.4em` when the real default is
 * `0.4em 1em` states something false. Rendering the shorthand tells the truth in the space available,
 * and the user unlinks when they want to edit the sides apart.
 *
 * @param {*} value A slot list, or any other value (returned unchanged).
 *
 * @since TBD
 *
 * @return {*} The shorthand string, or the value untouched when it is not a slot list.
 */
export function toShorthand(value) {
	if (!isSlotList(value)) {
		return value;
	}

	const [top, right, bottom, left] = value.map((slot) => (slot === undefined || slot === null ? '' : slot));

	if (top === right && right === bottom && bottom === left) {
		return top;
	}

	if (top === bottom && right === left) {
		return `${top} ${right}`;
	}

	if (right === left) {
		return `${top} ${right} ${bottom}`;
	}

	return `${top} ${right} ${bottom} ${left}`;
}
