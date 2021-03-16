/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

const {
	InnerBlocks,
} = wp.blockEditor;
const {
	Fragment,
} = wp.element;
const {
	Component,
} = wp.element;
/**
 * This allows for checking to see if the block needs to generate a new ID.
 */
const kbcountInnerUniqueIDs = [];
/**
 * Build the spacer edit
 */
class KadenceCountdownInner extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbcountInnerUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kbcountInnerUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kbcountInnerUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kbcountInnerUniqueIDs.push( this.props.attributes.uniqueID );
		}
	}
	render() {
		const { attributes: { location, uniqueID }, clientId } = this.props;
		const hasChildBlocks = wp.data.select( 'core/block-editor' ).getBlockOrder( clientId ).length > 0;
		return (
			<Fragment>
				<div className={ `kb-countdown-inner kb-countdown-inner-${ location } kb-countdown-inner-${ uniqueID }` } >
					<InnerBlocks
						templateLock={ false }
						renderAppender={ (
							hasChildBlocks ?
								undefined :
								() => <InnerBlocks.ButtonBlockAppender />
						) } 
						/>
				</div>
			</Fragment>
		);
	}
}
export default ( KadenceCountdownInner );