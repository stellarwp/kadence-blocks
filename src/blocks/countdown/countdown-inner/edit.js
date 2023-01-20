/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

import {
	InnerBlocks,
	useBlockProps
} from '@wordpress/block-editor';

import {
	useEffect,
} from '@wordpress/element';

import { 
	useSelect, 
	useDispatch 
} from '@wordpress/data';

import {
	getUniqueId,
} from '@kadence/helpers';

/**
 * Build the spacer edit
 */

function KadenceCountdownInner ( { attributes, clientId, setAttributes } ) {

	const {
		location,
		uniqueID,
	} = attributes;

	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock } = useSelect(
		( select ) => {
			return {
				isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
			};
		},
		[ clientId ]
	);

	useEffect( () => {
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock );
		setAttributes( { uniqueID: uniqueId } );
		addUniqueID( uniqueId, clientId );
	}, [] );

	const hasChildBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId ).length > 0;

	const blockProps = useBlockProps( {
		className: `kb-countdown-inner kb-countdown-inner-${ location } kb-countdown-inner-${ uniqueID }`,
	} );

	return (
		<div {...blockProps}>
			<InnerBlocks
				templateLock={ false }
				renderAppender={ (
					hasChildBlocks ?
						undefined :
						() => <InnerBlocks.ButtonBlockAppender />
				) }
				/>
		</div>
	);
}
export default ( KadenceCountdownInner );
