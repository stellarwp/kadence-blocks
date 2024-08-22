/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

export default function useEditorElement(ref, dependencies, className = 'editor-styles-wrapper') {
	const [editorElement, setEditorElement] = useState();

	function calculateEditorElement() {
		if (ref?.current?.ownerDocument) {
			setEditorElement(ref.current.ownerDocument.querySelector('.' + className ));
		}
	}

	useEffect(calculateEditorElement, dependencies);
	useEffect(() => {
		if (ref?.current?.ownerDocument) {
			const { defaultView } = ref.current.ownerDocument;

			defaultView.addEventListener('resize', calculateEditorElement);

			return () => {
				defaultView.removeEventListener('resize', calculateEditorElement);
			};
		}
	}, []);

	return editorElement;
}
