/**
 * One card in a swatch grid: a caller-rendered preview (a color square, a gradient) on top, a name
 * below, and an optional sub-line (e.g. a hex value) below that.
 *
 * `preview` is always caller-supplied, never derived from `subLine` — the Color Palette screen
 * this card is built for has a GRADIENT group whose values aren't plain colors, so parsing a color
 * out of `subLine` would break there, and would also make this component useless anywhere
 * `subLine` isn't a color at all (e.g. a pixel value).
 *
 * No delete affordance — deletion lives in the settings panel instead (see
 * `helpers/token-capabilities.js`), gated on the same baseline/user-created rule.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { DragHandle } from '../atoms/DragHandle';
import './SwatchCard.scss';

/**
 * Render a swatch card.
 *
 * @param {Object}       props                  The component props.
 * @param {string}       props.id               The stable card id (also the dnd-kit sortable id).
 * @param {Object}       [props.previewStyle]   Inline style applied to the preview slot itself, for
 *                                              a preview that is only a fill (a solid color, a
 *                                              gradient). The slot already draws the border, the
 *                                              corner radius, and clips overflow, so filling it
 *                                              directly avoids nesting a child that would stack a
 *                                              second border inside those rounded corners. Pass
 *                                              `preview` instead when the preview needs real
 *                                              content rather than a fill.
 * @param {JSX.Element}  props.preview          The preview slot (a color square, a gradient, …) —
 *                                              always caller-supplied; see the module docblock for why
 *                                              this is never derived from `subLine`.
 * @param {string}       props.name             The card's name.
 * @param {string}       [props.subLine]        The sub-line under the name (e.g. a hex value).
 * @param {?JSX.Element} [props.pill]    The node for the slot under the sub-line — the caller's
 *                                       inheritance pill, or null. Caller-supplied for the same
 *                                       reason `preview` is: this card is used by screens that
 *                                       have no notion of palette inheritance at all.
 * @param {boolean}      [props.reservePillSlot] Whether to render the pill slot even though this
 *                                       card itself has no pill — set by the grid when another
 *                                       card in the same row has one, so every card in the row
 *                                       keeps the same height.
 * @param {boolean}      [props.isSelected]     Whether the card shows the selected treatment.
 * @param {Function}     props.onSelect         Called with the card id on click.
 * @param {boolean}      [props.isDraggable]    Whether the drag handle renders.
 * @param {boolean}      [props.isDragging]     Whether this specific card is the one currently being
 *                                              dragged — renders as an empty drop-target placeholder in
 *                                              place; the floating copy under the pointer/keyboard focus
 *                                              is a `SwatchGrid`-rendered `DragOverlay`, not this element.
 * @param {boolean}      [props.isPendingDelete] Whether this card's swatch is optimistically
 *                                               deleted but not yet confirmed — renders dimmed and
 *                                               disabled instead of vanishing, until the write settles.
 * @param {Object}       [props.dragHandleProps] The dnd-kit listeners/attributes for the drag handle,
 *                                               supplied by the sortable wrapper; ignored when
 *                                               `isDraggable` is false.
 * @param {Function}     [props.innerRef]       A `dnd-kit` node ref for the card's root element,
 *                                              supplied by the sortable wrapper (`SwatchGrid`).
 * @param {Object}       [props.wrapperStyle]   The `dnd-kit` drag transform/transition style for the
 *                                              card's root element, supplied by the sortable wrapper.
 *
 * @since TBD
 *
 * @return {JSX.Element} The card.
 */
export function SwatchCard({
	id,
	preview,
	previewStyle,
	name,
	subLine,
	pill = null,
	reservePillSlot = false,
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
			className={classnames('kadence-blocks-style-library__swatch-card', {
				'kadence-blocks-style-library__swatch-card--selected': isSelected,
				'kadence-blocks-style-library__swatch-card--placeholder': isDragging,
				'kadence-blocks-style-library__swatch-card--pending-delete': isPendingDelete,
			})}
		>
			{/* The bordered box is a plain element, not the click target it used to be: the pill slot
			 * below can hold a button, and a button inside a button is invalid markup. Selecting the
			 * card moved to the inner button, which covers exactly what it covered before. */}
			<div className="kadence-blocks-style-library__swatch-card-main">
				<button
					type="button"
					className="kadence-blocks-style-library__swatch-card-select"
					onClick={() => onSelect(id)}
					disabled={isPendingDelete}
					aria-disabled={isPendingDelete}
				>
					<span className="kadence-blocks-style-library__swatch-card-preview" style={previewStyle}>
						{preview}
					</span>
					<span className="kadence-blocks-style-library__swatch-card-name">{name}</span>
					{subLine && <span className="kadence-blocks-style-library__swatch-card-sub-line">{subLine}</span>}
				</button>
				{/* Renders when this card has a pill, or when the grid asked every card in the row to
				 * reserve the slot because at least one of its siblings has one — that keeps the row
				 * on one baseline without leaving dead space under a row where nothing has a pill. */}
				{(pill || reservePillSlot) && (
					<span className="kadence-blocks-style-library__swatch-card-pill-slot">{pill}</span>
				)}
			</div>
			<span className="kadence-blocks-style-library__swatch-card-handle-slot">
				{isDraggable && !isPendingDelete && <DragHandle handleProps={dragHandleProps} />}
			</span>
		</div>
	);
}
