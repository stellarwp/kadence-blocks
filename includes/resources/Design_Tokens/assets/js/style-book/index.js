/**
 * Style Book admin entry.
 */
import { createRoot } from '@wordpress/element';
import { StyleBookApp } from './app/StyleBookApp';
import './style-book.scss';

wp.domReady( () => {
	const container = document.getElementById( 'kadence-style-book-root' );

	if ( ! container ) {
		return;
	}

	createRoot( container ).render( <StyleBookApp /> );
} );
