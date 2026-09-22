/**
 * One row in a swatch list: a drag handle, a caller-rendered preview square, a name, an optional
 * pill, and a right-aligned sub-line (e.g. a hex value). The list-shaped sibling of `SwatchCard`,
 * taking the same props so the grid can swap one for the other.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { DragHandle } from '../atoms/DragHandle';
import './SwatchRow.scss';

/**
 * Render a swatch row.
 *
 * @param {Object}       props                   The component props.
 * @param {string}       props.id                The stable row id (also the dnd-kit sortable id).
 * @param {JSX.Element}  props.preview           The preview slot, always caller-supplied.
 * @param {Object}       [props.previewStyle]    Inline style for a fill-only preview slot.
 * @param {string}       props.name              The row's name.
 * @param {string}       [props.subLine]         The value shown at the right (e.g. a hex value).
 * @param {?JSX.Element} [props.pill]            The caller's inheritance pill, or null.
 * @param {boolean}      [props.isSelected]      Whether the row shows the selected treatment.
 * @param {Function}     props.onSelect          Called with the row id on click.
 * @param {boolean}      [props.isDraggable]     Whether the drag handle renders.
 * @param {boolean}      [props.isDragging]      Whether this row is the one being dragged — it renders
 *                                               as an empty placeholder; the floating copy is the
 *                                               grid's `DragOverlay`.
 * @param {boolean}      [props.isPendingDelete] Whether the swatch is deleted but not yet confirmed —
 *                                               dimmed and disabled instead of vanishing.
 * @param {Object}       [props.dragHandleProps] The dnd-kit listeners/attributes for the handle.
 * @param {Function}     [props.innerRef]        A dnd-kit node ref for the root element.
 * @param {Object}       [props.wrapperStyle]    The dnd-kit drag transform/transition style.
 *
 * @since TBD
 *
 * @return {JSX.Element} The row.
 */
export function SwatchRow({
	id,
	preview,
	previewStyle,
	name,
	subLine,
	pill = null,
	isSelected = false,
	onSelect,
	isDraggable = false,
	isDragging = false,
	isPendingDelete = false,
	dragHandleProps,
	innerRef,
	wrapperStyle,
}) {
	return (
		<div
			ref={innerRef}
			style={wrapperStyle}
			className={classnames('kadence-blocks-style-library__swatch-row', {
				'kadence-blocks-style-library__swatch-row--selected': isSelected,
				'kadence-blocks-style-library__swatch-row--placeholder': isDragging,
				'kadence-blocks-style-library__swatch-row--pending-delete': isPendingDelete,
			})}
		>
			<span className="kadence-blocks-style-library__swatch-row-handle-slot">
				{isDraggable && !isPendingDelete && <DragHandle handleProps={dragHandleProps} />}
			</span>
			{/* The pill and sub-line stay outside this button: the pill can be a button itself, and a
			 * button inside a button is invalid markup. The button's `::after` stretches its hit area
			 * over the whole row instead. */}
			<button
				type="button"
				className="kadence-blocks-style-library__swatch-row-select"
				onClick={() => onSelect(id)}
				disabled={isPendingDelete}
				aria-disabled={isPendingDelete}
			>
				<span className="kadence-blocks-style-library__swatch-row-preview" style={previewStyle}>
					{preview}
				</span>
				<span className="kadence-blocks-style-library__swatch-row-name">{name}</span>
			</button>
			{pill && (
				<span
					className="kadence-blocks-style-library__swatch-row-pill-slot"
					onClick={(event) => {
						if (isPendingDelete || event.target.closest('button')) {
							return;
						}
						onSelect(id);
					}}
				>
					{pill}
				</span>
			)}
			{subLine && <span className="kadence-blocks-style-library__swatch-row-sub-line">{subLine}</span>}
		</div>
	);
}
