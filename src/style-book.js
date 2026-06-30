/**
 * Style Book admin entry.
 */
import { createRoot } from '@wordpress/element';
import { StyleBookApp } from './style-book/app/StyleBookApp';
import './style-book/styles/_shell.scss';

wp.domReady(() => {
	const container = document.getElementById('kadence-blocks-style-book-root');

	if (!container) {
		return;
	}

	createRoot(container).render(<StyleBookApp />);
});
