const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	Modal,
} = wp.components;
import Library from './library';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
class CustomComponent extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			modalOpen: false,
		};
	}
	render() {
		return (
			<Fragment>
				<Button className="kt-prebuilt" onClick={ () => this.setState( { modalOpen: true } ) }>{ __( 'Prebuilt Library' ) }</Button>
				{ this.state.modalOpen ?
					<Modal
						className="kt-prebuilt-modal"
						title={ __( 'Prebuilt Library' ) }
						onRequestClose={ () => this.setState( { modalOpen: false } ) }>
						<Library
							clientId={ this.props.clientId }
						/>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default CustomComponent;
