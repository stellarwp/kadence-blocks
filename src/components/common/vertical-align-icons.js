/**
 * WordPress dependencies
 */
const {
	Path,
	SVG,
} = wp.components;
export default function VerticalAlignmentIcon( { value, isPressed = false } ) {
	const iconToPath = {
		top: 'M19.5 19.5H.5V.5h19v19zM1.607 18.392h16.786V1.608H1.607v16.784zM17.178 2.888H2.822v3.275h14.356V2.888z',
		middle: 'M19.5 19.482H.5V.5h19v18.982zM1.607 18.375h16.786V1.607H1.607v16.768zm15.571-10.02H2.822v3.272h14.356V8.355z',
		bottom: 'M19.518 19.5H.5V.5h19.018v19zm-17.91-1.108H18.41V1.608H1.608v16.784zm15.586-4.739H2.824v3.275h14.37v-3.275z',
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
