/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/primitives';

/**
 * Three lines of growing thickness, for the Border Width screen.
 *
 * @since TBD
 */
export const borderWidth = (
	<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
		<Path d="M13.5 3C13.7761 3 14 3.22386 14 3.5C14 3.77614 13.7761 4 13.5 4H2.5C2.22386 4 2 3.77614 2 3.5C2 3.22386 2.22386 3 2.5 3H13.5Z" />
		<Path d="M13 6C13.5523 6 14 6.44772 14 7C14 7.55228 13.5523 8 13 8H3C2.44772 8 2 7.55228 2 7C2 6.44772 2.44772 6 3 6H13Z" />
		<Path d="M12.5 10C13.3284 10 14 10.6716 14 11.5C14 12.3284 13.3284 13 12.5 13H3.5C2.67157 13 2 12.3284 2 11.5C2 10.6716 2.67157 10 3.5 10H12.5Z" />
	</SVG>
);
