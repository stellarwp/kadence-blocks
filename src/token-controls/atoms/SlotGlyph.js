/**
 * The row's leading icon: one inline SVG per family that marks which side or corner a row is for.
 *
 * The component, not the artwork, decides what is highlighted: every family draws all four parts and
 * the active ones stay at full opacity while the rest dim. Plain SVG elements rather than
 * `@wordpress/primitives` so the icon needs no extra runtime dependency.
 */

/**
 * Internal dependencies
 */
import { SLOT_LABELS } from '../helpers/value-shapes';

/**
 * The sides icon: four separate bars with open corners, in `SLOT_LABELS.sides` order.
 *
 * @since TBD
 */
const SIDES_PARTS = [
	{ position: 'top', d: 'M13.75 3.75L6.25 3.75L6.25 5L13.75 5L13.75 3.75Z' },
	{ position: 'right', d: 'M16.25 6.25L15 6.25L15 13.75L16.25 13.75L16.25 6.25Z' },
	{ position: 'bottom', d: 'M13.75 15L6.25 15L6.25 16.25L13.75 16.25L13.75 15Z' },
	{ position: 'left', d: 'M5 13.75L5 6.25L3.75 6.25L3.75 13.75L5 13.75Z' },
];

/**
 * The corners icon: four rounded corner arcs, in `SLOT_LABELS.corners` order.
 *
 * @since TBD
 */
const CORNERS_PARTS = [
	{
		position: 'top-left',
		d: 'M5.75 6C5.75 5.9337 5.77634 5.87011 5.82322 5.82322C5.87011 5.77634 5.9337 5.75 6 5.75H9V4.25H6C5.53587 4.25 5.09075 4.43437 4.76256 4.76256C4.43437 5.09075 4.25 5.53587 4.25 6V9H5.75V6Z',
	},
	{
		position: 'top-right',
		d: 'M18.25 9V6C18.25 5.9337 18.2237 5.87011 18.1768 5.82322C18.1299 5.77634 18.0663 5.75 18 5.75H15V4.25H18C18.966 4.25 19.75 5.034 19.75 6V9H18.25Z',
	},
	{
		position: 'bottom-right',
		d: 'M18 18.25H15V19.75H18C18.4641 19.75 18.9092 19.5656 19.2374 19.2374C19.5656 18.9092 19.75 18.4641 19.75 18V15H18.25V18C18.25 18.0663 18.2237 18.1299 18.1768 18.1768C18.1299 18.2237 18.0663 18.25 18 18.25Z',
	},
	{
		position: 'bottom-left',
		d: 'M5.75 18V15H4.25V18C4.25 18.966 5.034 19.75 6 19.75H9V18.25H6C5.9337 18.25 5.87011 18.2237 5.82322 18.1768C5.77634 18.1299 5.75 18.0663 5.75 18Z',
	},
];

/**
 * Geometry per role: the viewBox each export was drawn in and its parts.
 *
 * @since TBD
 */
const GEOMETRY = {
	sides: { viewBox: '0 0 20 20', parts: SIDES_PARTS },
	corners: { viewBox: '0 0 24 24', parts: CORNERS_PARTS },
};

/**
 * Render the side or corner icon for a row.
 *
 * @param {Object} props            The component props.
 * @param {string} [props.role]     'sides' or 'corners' — picks the geometry. Unknown roles use sides.
 * @param {string} [props.position] A label from `SLOT_LABELS[role]`, or `'all'` to highlight every part.
 *
 * @since TBD
 *
 * @return {JSX.Element} The icon.
 */
export function SlotGlyph({ role = 'sides', position = 'all' }) {
	const key = SLOT_LABELS[role] ? role : 'sides';
	const { viewBox, parts } = GEOMETRY[key];

	return (
		<svg
			className={`kb-token-control__glyph kb-token-control__glyph--${key} kb-token-control__glyph--${position}`}
			viewBox={viewBox}
			fill="currentColor"
			aria-hidden="true"
			focusable="false"
		>
			{parts.map((part) => (
				<path
					key={part.position}
					className={`kb-token-control__glyph-part${
						position === 'all' || position === part.position ? ' is-active' : ''
					}`}
					data-position={part.position}
					d={part.d}
				/>
			))}
		</svg>
	);
}
