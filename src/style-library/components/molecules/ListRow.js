/**
 * One row in a screen's row list: a label, a monospaced value, an optional preview slot, and a
 * trailing drag handle. Selection, click, and the meaning of the preview are all the caller's —
 * this component knows nothing about tokens, palettes, or presets. Matches the shared body shape
 * across Border Radius, Border Width, Spacing, Icon Sizes, and Shadow.
 *
 * No delete affordance — deletion lives in the settings panel instead (see
 * `helpers/token-capabilities.js`), gated on the same baseline/user-created rule. This row only
 * ever selects and, optionally, reorders.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { DragHandle } from '../atoms/DragHandle';
import './ListRow.scss';

/**
 * Render a row-list row.
 *
 * @param {Object}        props                  The component props.
 * @param {string}        props.id               The stable row id (also the dnd-kit sortable id).
 * @param {string}        props.label            The leading name.
 * @param {string}        [props.value]          The trailing monospaced value (e.g. a pixel or hex value).
 * @param {?JSX.Element}  [props.preview]        The preview slot; `.list-row-preview` gives it a default
 *                                               empty gray-filled square when the caller passes an empty
 *                                               element instead of real content.
 * @param {boolean}       [props.isSelected]     Whether the row shows the selected treatment.
 * @param {Function}      props.onSelect         Called with the row id on click.
 * @param {boolean}       [props.isDraggable]    Whether the drag handle renders.
 * @param {boolean}       [props.isDragging]     Whether this specific row is the one currently being
 *                                               dragged — renders as an empty drop-target placeholder in
 *                                               place; the floating copy under the pointer/keyboard focus
 *                                               is a `RowList`-rendered `DragOverlay`, not this element.
 * @param {Object}        [props.dragHandleProps] The dnd-kit listeners/attributes for the drag handle,
 *                                                supplied by the sortable wrapper; ignored when
 *                                                `isDraggable` is false.
 * @param {Function}      [props.innerRef]       A `dnd-kit` node ref for the row's root element,
 *                                               supplied by the sortable wrapper (`RowList`).
 * @param {Object}        [props.wrapperStyle]   The `dnd-kit` drag transform/transition style for the
 *                                               row's root element, supplied by the sortable wrapper.
 *
 * @since TBD
 *
 * @return {JSX.Element} The row.
 */
export function ListRow({
	id,
	label,
	value,
	preview = null,
	isSelected = false,
	onSelect,
	isDraggable = false,
	isDragging = false,
	dragHandleProps,
	innerRef,
	wrapperStyle,
}) {
	return (
		<li
			ref={innerRef}
			style={wrapperStyle}
			className={classnames('kadence-blocks-style-library__list-row', {
				'kadence-blocks-style-library__list-row--selected': isSelected,
				'kadence-blocks-style-library__list-row--placeholder': isDragging,
			})}
		>
			<button type="button" className="kadence-blocks-style-library__list-row-main" onClick={() => onSelect(id)}>
				<span className="kadence-blocks-style-library__list-row-label">{label}</span>
				{value && <span className="kadence-blocks-style-library__list-row-value">{value}</span>}
				{preview && <span className="kadence-blocks-style-library__list-row-preview">{preview}</span>}
			</button>
			{isDraggable && <DragHandle handleProps={dragHandleProps} />}
		</li>
	);
}
