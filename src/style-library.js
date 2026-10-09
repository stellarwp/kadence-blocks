/**
 * Style Library admin entry.
 */
import { createRoot } from '@wordpress/element';
import { StyleLibraryApp } from './style-library/app/StyleLibraryApp';
import { seedDesignTokensFeed } from './style-library/hooks/use-design-tokens-feed';
import './style-library/styles/_primitives.scss';
import './style-library/styles/_semantic.scss';
import './style-library/styles/_shell.scss';
import './style-library/styles/_layout.scss';

wp.domReady(() => {
	const container = document.getElementById('kadence-blocks-style-library-root');

	if (!container) {
		return;
	}

	// Seeds the store BEFORE React starts rendering, so `useDesignTokensFeed()`'s very first render
	// already has `isReady: true` for the active library — see the function's own docblock for why
	// this can't happen inside the render itself.
	seedDesignTokensFeed();

	createRoot(container).render(<StyleLibraryApp />);
});
