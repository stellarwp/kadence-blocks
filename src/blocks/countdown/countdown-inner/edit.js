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

/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbcountInnerUniqueIDs = [];
/**
 * Build the spacer edit
 */

function KadenceCountdownInner ( props ) {

	const { attributes: { location, uniqueID }, clientId } = props;

	useEffect( () => {
		if ( ! uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			kbcountInnerUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( kbcountInnerUniqueIDs.includes( uniqueID ) ) {
			if ( this.props.attributes.uniqueID != '_' + clientId.substr( 2, 9 ) ) {
				this.props.setAttributes({uniqueID: '_' + clientId.substr(2, 9)});
				kbcountInnerUniqueIDs.push('_' + clientId.substr(2, 9));
			}
		} else {
			kbcountInnerUniqueIDs.push( uniqueID );
		}
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
