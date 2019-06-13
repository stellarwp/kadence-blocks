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
const kttabUniqueIDs = [];
/**
 * Build the spacer edit
 */
class KadenceTab extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else if ( kttabUniqueIDs.includes( this.props.attributes.uniqueID ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
			kttabUniqueIDs.push( '_' + this.props.clientId.substr( 2, 9 ) );
		} else {
			kttabUniqueIDs.push( this.props.attributes.uniqueID );
		}
	}
	render() {
		const { attributes: { id, uniqueID } } = this.props;
		return (
			<Fragment>
				<div className={ `kt-tab-inner-content kt-inner-tab-${ id } kt-inner-tab${ uniqueID }` } >
					<InnerBlocks templateLock={ false } />
				</div>
			</Fragment>
		);
	}
}
export default ( KadenceTab );
