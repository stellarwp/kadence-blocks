/**
 * The drag-to-reorder grip: a 6-dot glyph inside a real `<button>` so keyboard reordering works
 * for free. Dnd-agnostic — the sortable wrapper hands it the dnd-kit listeners/attributes via
 * `handleProps` rather than this atom importing anything from `@dnd-kit` itself.
 */

/**
 * WordPress dependencies
 */
import { Icon, dragHandle } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './DragHandle.scss';

/**
 * Render the drag handle.
 *
 * @param {Object} props             The component props.
 * @param {Object} [props.handleProps] The dnd-kit listeners/attributes to spread onto the button.
 *
 * @since TBD
 *
 * @return {JSX.Element} The drag handle button.
 */
export function DragHandle({ handleProps }) {
	return (
		<button
			type="button"
			className="kadence-blocks-style-library__drag-handle"
			aria-label={__('Drag to reorder', 'kadence-blocks')}
			{...handleProps}
		>
			<Icon icon={dragHandle} className="kadence-blocks-style-library__drag-handle-icon" />
		</button>
	);
}
