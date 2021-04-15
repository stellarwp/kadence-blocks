const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	Modal,
	IconButton,
	TabPanel,
	Tooltip,
	Spinner,
} = wp.components;
const { apiFetch } = wp;
//import Library from './library';
import Library from './devlibrary';
import TemplateLibrary from './template-library';
import CloudConnect from './devcloud-connect';
import {
	arrowLeft,
	download,
	update,
	close,
	chevronLeft,
	plusCircle,
	chevronDown,
} from '@wordpress/icons';
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
		this.saveSettings = this.saveSettings.bind( this );
		this.reloadAllActions = this.reloadAllActions.bind( this );
		this.state = {
			reload:false,
			reloadActions:false,
			isSaving: false,
			isFetching: false,
			modalOpen: false,
			section: 'section',
			cloudSettings: kadence_blocks_params.cloud_settings ? JSON.parse( kadence_blocks_params.cloud_settings ) : {},
			actions: [
				{
					slug: 'section',
					title: __( 'Sections', 'kadence-blocks' ),
					key: 'kb-sections-tab',
				},
				{
					slug: 'templates',
					title: __( 'Starter Packs', 'kadence-blocks' ),
					key: 'kb-templates-tab',
				},
				{
					slug: 'cloud',
					title: '',
					key: 'kb-cloud-tab',
				},
			],
		};
	}
	// componentDidMount() {
	// 	apiFetch( { path: '/wp/v2/settings' } ).then( ( res ) => {
	// 		this.setState( {
	// 			cloudSettings: JSON.parse( res.kadence_blocks_cloud ),
	// 		} );
	// 	} );
	// }
	reloadAllActions() {
		this.setState( { isFetching: true } );
		apiFetch( { path: '/wp/v2/settings' } ).then( ( res ) => {
			this.setState( {
				reloadActions: false,
				isFetching: false,
				cloudSettings: JSON.parse( res.kadence_blocks_cloud ),
			} );
		} );
	}
	saveSettings( cloudSettings ) {
		kadence_blocks_params.cloud_settings = JSON.stringify( cloudSettings );
		this.setState( { isSaving: true } );
		apiFetch( {
			path: '/wp/v2/settings',
			method: 'POST',
			data: { kadence_blocks_cloud: JSON.stringify( cloudSettings ) },
		} ).then( ( response ) => {
			console.log( response );
			this.setState( {
				isSaving: false,
			} );
		} );
	}
	render() {
		const cloudSettings = this.state.cloudSettings;
		console.log( cloudSettings );
		const active_tab = ( cloudSettings && cloudSettings['activeTab'] ? cloudSettings['activeTab'] : 'section' );
		let actions = this.state.actions;
		if ( cloudSettings && cloudSettings['connections'] ) {
			actions = cloudSettings['connections'].concat( actions );
		}
		if ( this.state.reloadActions && ! this.state.isFetching ) {
			this.reloadAllActions();
		}
		return (
			<Fragment>
				<Button className="kt-prebuilt" onClick={ () => this.setState( { modalOpen: true } ) }>{ __( 'Prebuilt Library', 'kadence-blocks' ) }</Button>
				{ this.state.modalOpen ?
					<Modal
						className="kt-prebuilt-modal kb-prebuilt-library-modal"
						title={ __( 'Prebuilt Library', 'kadence-blocks' ) }
						onRequestClose={ () => this.setState( { modalOpen: false } ) }>
						<div className="kb-prebuilt-section">
							<div className="kb-prebuilt-header kb-prebuilt-library-header">
								<div className="kb-prebuilt-header kb-prebuilt-library-logo">
									<span className="kb-prebuilt-header-logo">{ icons.kadenceCatNew }</span>
									<h2>{ __( 'Library', 'Kadence Blocks' ) }</h2>
								</div>
								{ this.state.reloadActions && (
									<div class="kb-prebuilt-library-actions">
										<Spinner /> 
									</div>
								) }
								{ ! this.state.reloadActions && (
									<div class="kb-prebuilt-library-actions">
										{ actions.map( ( action, index ) =>
											<Button
												key={ `${ action.slug }-${ index }` }
												className={ 'kb-action-button' + ( active_tab === action.slug ? ' is-pressed' : '' ) }
												aria-pressed={ active_tab === action.slug }
												icon={ action.slug === 'cloud' ? plusCircle : undefined }
												onClick={ () => {
													cloudSettings.activeTab = action.slug ;
													this.setState( { cloudSettings: cloudSettings } );
													this.saveSettings( cloudSettings );
												} }
											>
												{ action.slug === 'cloud' ? undefined : action.title }
											</Button>
										) }
									</div>
								) }
								{ 'cloud' !== active_tab && (
									<div class="kb-prebuilt-library-reload">
										<Tooltip text={ __( 'Sync with Cloud' ) }>
											<Button 
												className="kt-reload-templates"
												icon={ update }
												onClick={ () => this.setState( { reload: true } ) }
											/>
										</Tooltip>
									</div>
								) }
								<div class="kb-prebuilt-header-close-wrap">
									<Tooltip text={ __( 'Close Dialog' ) }>
										<Button 
											className="kb-prebuilt-header-close"
											icon={ close }
											onClick={ () => this.setState( { modalOpen: false } ) }
										/>
									</Tooltip>
								</div>
							</div>
							{ 'templates' === active_tab && (
								<TemplateLibrary
									clientId={ this.props.clientId }
									reload={ this.state.reload }
									onReload={ () => this.setState( { reload: false } ) }
								/>
							) }
							{ 'cloud' === active_tab && (
								<CloudConnect
									clientId={ this.props.clientId }
									onReload={ () => this.setState( { reloadActions: true } ) }
								/>
							) }
							{ 'templates' !== active_tab && 'cloud' !== active_tab && (
								<Library
									clientId={ this.props.clientId }
									tab={ active_tab }
									libraries={ actions }
									reload={ this.state.reload }
									onReload={ () => this.setState( { reload: false } ) }
								/>
							) }
						</div>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default CustomComponent;
