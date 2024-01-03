/**
 * WordPress dependencies
 */
const getStringBetween = (str, start, end, from ) => {
	// Check if product block is there?
	if ( ! str.includes( start ) ) {
		return '';
	}
	// get the start of the container.
	const startpos = str.indexOf( start, from );
	if ( -1 === startpos ) {
		return '';
	}
	const pos = startpos + start.length;
	const endPost = str.indexOf(end, pos);
	const sub = str.substring(pos, endPost );
	if ( ! sub ) {
		return '';
	}

    return sub;
}
export default function wooContent( content ) {
	
	if ( ! content ) {
		return content;
	}
	let theProducts = kadence_blocks_params?.replaceProducts ? kadence_blocks_params.replaceProducts : '';
	let fourProducts = theProducts ? theProducts.toString() : '';
	let threeProducts = theProducts ? theProducts.slice(0,3).toString() : '';
	// <!-- wp:woocommerce/handpicked-products {"orderby":"menu_order","products":[8121,5160,5159]} /-->
	let product_content = getStringBetween( content, '<!-- wp:woocommerce/handpicked-products', '"products":[8121,5160,5159]', 0 );
	if ( product_content ) {
		content = content.replace( '<!-- wp:woocommerce/handpicked-products' + product_content + '"products":[8121,5160,5159]', '<!-- wp:woocommerce/handpicked-products' + product_content + '"products":[' + threeProducts + ']' );
	}
		
	return content;
}
