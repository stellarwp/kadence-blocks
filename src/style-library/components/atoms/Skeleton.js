/**
 * A single shimmering placeholder shape, used to build screen-level loading skeletons (a preset
 * row, a swatch card, …). Purely decorative — `PresetScreen`/`ColorPaletteScreen` wrap the
 * composed skeleton in its own `role="status"`/`aria-live` container, so this atom marks itself
 * `aria-hidden` and carries no accessible name of its own.
 */

/**
 * Internal dependencies
 */
import './Skeleton.scss';

/**
 * Render one skeleton placeholder shape.
 *
 * @param {Object} [props]           The component props.
 * @param {string} [props.className] An additional class name — typically a real layout class (e.g.
 *                                   `list-row-label`) so the shape inherits that column's exact
 *                                   width instead of a duplicated literal.
 * @param {Object} [props.style]     Inline style, e.g. a `width`/`height` pinned to a shared size
 *                                   token (`var(--kb-sl-size-row-preview)`) for a shape with no
 *                                   layout class of its own to borrow from.
 *
 * @since TBD
 *
 * @return {JSX.Element} The placeholder shape.
 */
export function Skeleton({ className = '', style }) {
	return (
		<span
			className={`kadence-blocks-style-library__skeleton ${className}`.trim()}
			style={style}
			aria-hidden="true"
		/>
	);
}
