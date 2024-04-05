/**
 * WordPress dependencies
 */
import { useState, useEffect } from '@wordpress/element';

export default function useEditorWidth(ref, dependencies) {
	const [editorWidth, setEditorWidth] = useState();

	function calculateEditorWidth() {
		if (ref?.current?.ownerDocument) {
			setEditorWidth(ref.current.ownerDocument.querySelector('.edit-post-visual-editor')?.clientWidth);
		}
	}

	useEffect(calculateEditorWidth, dependencies);
	useEffect(() => {
		if (ref?.current?.ownerDocument) {
			const { defaultView } = ref.current.ownerDocument;

			defaultView.addEventListener('resize', calculateEditorWidth);

			return () => {
				defaultView.removeEventListener('resize', calculateEditorWidth);
			};
		}
	}, []);

	return editorWidth;
}
