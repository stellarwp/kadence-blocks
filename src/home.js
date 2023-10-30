/**
 * Kadence Blocks
 *
 */
// Utils
import { render } from '@wordpress/element';
import KadenceBlocksHome from './dashboard/index.js';
wp.domReady( () => {
	render(
		<KadenceBlocksHome />,
		document.querySelector( '.kadence_blocks_home_main' )
	);
} );