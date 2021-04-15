const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	Modal,
	IconButton,
	TabPanel,
} = wp.components;
import Library from './library';
import TemplateLibrary from './template-library';

/**
 * Import Icons
 */
import icons from '../../brand-icon';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
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
				<Button className="kt-prebuilt" onClick={ () => this.setState( { modalOpen: true } ) }>{ __( 'Prebuilt Library', 'kadence-blocks' ) }</Button>
				{ this.state.modalOpen ?
					<Modal
						className="kt-prebuilt-modal"
						title={ __( 'Prebuilt Library', 'kadence-blocks' ) }
						onRequestClose={ () => this.setState( { modalOpen: false } ) }>
						<div className="kb-prebuilt-section">
							<div className="kb-prebuilt-header">
								<span className="kb-prebuilt-header-logo">{ icons.kadenceCatNew }</span>
								<h2>{ __( 'Library', 'Kadence Blocks' ) }</h2>
							</div>
							<IconButton
								className="kb-prebuilt-header-close"
								label={ __( 'Close Dialog', 'kadence-blocks' ) }
								icon="no-alt"
								onClick={ () => {
									this.setState( { modalOpen: false } );
								} }
							/>
							<TabPanel className="kt-inspect-tabs kb-prebuilt-tabs"
								activeClass="active-tab"
								tabs={ [
									{
										name: 'section',
										title: __( 'Sections', 'kadence-blocks' ),
										className: 'kb-sections-tab',
									},
									{
										name: 'templates',
										title: __( 'Starter Packs', 'kadence-blocks' ),
										className: 'kb-templates-tab',
									},
								] }>
								{
									( tab ) => {
										let tabout;
										if ( tab.name ) {
											if ( 'templates' === tab.name ) {
												tabout = (
													<TemplateLibrary
														clientId={ this.props.clientId }
													/>
												);
											} else {
												tabout = (
													<Library
														clientId={ this.props.clientId }
														tab={ tab.name }
													/>
												);
											}
										}
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
						</div>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default CustomComponent;
