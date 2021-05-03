
/**
 * Prebuilt Template Modal.
 */
 const {
	localStorage,
} = window;

/**
 * WordPress dependencies
 */
 const { apiFetch } = wp;
 import {
	withDispatch,
} from '@wordpress/data';
import {
	Component,
	Fragment,
} from '@wordpress/element';
import {
	Button,
	Modal,
	Tooltip,
	Spinner,
} from '@wordpress/components';
import {
	arrowLeft,
	download,
	update,
	close,
	chevronLeft,
	plusCircle,
	chevronDown,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
/**
 * Import Brand Icons
 */
import icons from '../../brand-icon';

/**
 * Import Css
 */
 import './editor.scss';
/**
 * Internal dependencies
 */
import SectionLibrary from './section-library';
import CloudSections from './cloud-library';
import TemplateLibrary from './template-library';
import CloudConnect from './cloud-connect';
import KadenceTryParseJSON from '../../components/common/parse-json'

const normal_actions =[
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
];
const no_connect_actions = [
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
];
class PrebuiltModal extends Component {
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
			onlyModal: false,
			section: null,
			cloudSettings: kadence_blocks_params.cloud_settings ? JSON.parse( kadence_blocks_params.cloud_settings ) : {},
			actions: kadence_blocks_params.cloud_enabled ? normal_actions : no_connect_actions,
		};
	}
	componentDidMount() {
		if ( this.props.open && this.props.onlyModal ) {
			this.setState( {
				modalOpen: true,
				onlyModal: true,
			} );
		}
		if ( typeof kadence_blocks_params.prebuilt_libraries === 'object' && kadence_blocks_params.prebuilt_libraries !== null ) {
			this.setState( { actions: kadence_blocks_params.prebuilt_libraries.concat( this.state.actions ) } );
		}
	}
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
			this.setState( {
				isSaving: false,
			} );
		} );
	}
	render() {
		const cloudSettings = this.state.cloudSettings;
		const activePanel = KadenceTryParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
		const active_saved_tab = ( activePanel && activePanel['activeTab'] ? activePanel['activeTab'] : 'section' )
		const active_tab = ( this.state.section ? this.state.section : active_saved_tab );
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
						onRequestClose={ () => {
							this.setState( { modalOpen: false } );
							if ( this.state.onlyModal ) {
                                this.props.removeBlock( this.props.clientId );
                            }
						} }
					>
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
													const activeTab = KadenceTryParseJSON( localStorage.getItem( 'kadenceBlocksPrebuilt' ), true );
													activeTab['activeTab'] = action.slug;
													localStorage.setItem( 'kadenceBlocksPrebuilt', JSON.stringify( activeTab ) );
													this.setState( { section: action.slug } );
												} }
											>
												{ action.slug === 'cloud' ? undefined : <span> { action.title } </span> }
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
											onClick={ () => {
												this.setState( { modalOpen: false } );
												if ( this.state.onlyModal ) {
													this.props.removeBlock( this.props.clientId );
												}
											} }
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
							{ 'section' === active_tab && (
								<SectionLibrary
									clientId={ this.props.clientId }
									tab={ active_tab }
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
							{ 'templates' !== active_tab && 'cloud' !== active_tab && 'section' !== active_tab && (
								<CloudSections
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
export default compose(
	withDispatch( ( dispatch ) => {
        const {
            removeBlock,
        } = dispatch( 'core/block-editor' );

        return {
            removeBlock,
        };
    } ),
)( PrebuiltModal );