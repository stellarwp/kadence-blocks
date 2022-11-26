/**
 * WordPress dependencies
 */
import {
	Path,
	SVG,
} from '@wordpress/components';
export default function ContentWidthIcon( { value, isPressed = false } ) {
	const iconToPath = {
		normal: 'M19.5 19.482H.5V.5h19v18.982zM1.607 18.375h16.786V1.607H1.607v16.768zm12.247-9.23l-1.599-1.599 1.269-1.231 3.655 3.693-3.655 3.692-1.269-1.23 1.614-1.615H6.15l1.614 1.615-1.268 1.23-3.655-3.692 3.655-3.693 1.268 1.231-1.598 1.599h7.688z',
		theme: 'M19.5 19.482H.5V.5h19v18.982zM1.607 18.375h16.786V1.607H1.607v16.768zm13.838-9.23H4.557V6.756H2.846v6.488h1.711v-2.389h10.888v2.389h1.711V6.756h-1.711v2.389z',
	};
	if ( ! iconToPath.hasOwnProperty( value ) ) {
		return null;
	}

	return (
		<SVG width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" isPressed={ isPressed } >
			<Path d={ iconToPath[ value ] } />
		</SVG>
	);
}
