/**
 * Kadence Blocks
 *
 */
// Utils
import { createRoot } from '@wordpress/element';
import KadenceBlocksHome from './dashboard/index.js';
wp.domReady( () => {
	const container = document.querySelector( '.kadence_blocks_home_main' );
	const root = createRoot( container );

	root.render(<KadenceBlocksHome />);
} );
