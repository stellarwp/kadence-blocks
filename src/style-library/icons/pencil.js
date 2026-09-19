/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

/**
 * A pencil, for "edit this". Drawn with strokes, not fills, unlike a `@wordpress/icons` glyph: the
 * stroke attributes below are the drawing, and a stylesheet that fills every button icon has to
 * leave this one unfilled (see `LibraryActions.scss`).
 *
 * @since TBD
 */
export const pencil = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<Path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
		<Path d="m15 5 4 4" />
	</SVG>
);
