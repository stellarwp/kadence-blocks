/**
 * BLOCK: Kadence Tab
 *
 * Registering a basic block with Gutenberg.
 */

const {
	InnerBlocks,
} = wp.editor;
const {
	Fragment,
} = wp.element;
const {
	Component,
} = wp.element;

/**
 * Build the spacer edit
 */
class KadenceTab extends Component {
	componentDidMount() {
		if ( ! this.props.attributes.uniqueID ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		} else if ( this.props.attributes.uniqueID && this.props.attributes.uniqueID !== '_' + this.props.clientId.substr( 2, 9 ) ) {
			this.props.setAttributes( {
				uniqueID: '_' + this.props.clientId.substr( 2, 9 ),
			} );
		}
	}
	render() {
		const { attributes: { id } } = this.props;
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
