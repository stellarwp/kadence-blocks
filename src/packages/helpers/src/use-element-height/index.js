/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

export default function useElementHeight(ref, dependencies, selector = '') {
	const [elementHeight, setElementHeight] = useState();

	function calculateElementHeight() {
		if (selector && ref?.current?.ownerDocument) {
			setElementHeight(ref.current.ownerDocument.querySelector(selector)?.clientHeight);
		} else if (ref?.current) {
			setElementHeight(ref.current?.clientHeight);
		}
	}

	useEffect(calculateElementHeight, dependencies);

	return elementHeight;
}
