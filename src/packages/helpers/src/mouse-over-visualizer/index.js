import { useState } from '@wordpress/element';

export default function mouseOverVisualizer() {
	const [ isMouseOver, setIsMouseOver ] = useState( false );
	const onMouseOver = () => setIsMouseOver( true );
	const onMouseOut = () => setIsMouseOver( false );
	return { isMouseOver, onMouseOver, onMouseOut };
}