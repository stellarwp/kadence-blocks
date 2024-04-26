/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

export default function useEditorElement(ref, dependencies) {
	const [editorElement, setEditorElement] = useState();

	function calculateEditorElement() {
		if (ref?.current?.ownerDocument) {
			setEditorElement(ref.current.ownerDocument.querySelector('.edit-post-visual-editor'));
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
