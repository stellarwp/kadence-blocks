/**
 * Style Library admin entry.
 */
import { createRoot } from '@wordpress/element';
import { StyleLibraryApp } from './style-library/app/StyleLibraryApp';
import './style-library/styles/_shell.scss';
import './style-library/styles/_layout.scss';

wp.domReady(() => {
	const container = document.getElementById('kadence-blocks-style-library-root');

	if (!container) {
		return;
	}

	createRoot(container).render(<StyleLibraryApp />);
});
