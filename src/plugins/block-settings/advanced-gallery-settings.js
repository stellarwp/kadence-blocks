const {
	Component,
	Fragment,
} = wp.element;
const {
	Dashicon,
	Tooltip,
	SelectControl,
	Button,
	Modal,
} = wp.components;
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
class KadenceGallerySettings extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			settings: ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} ),
		};
	}
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = ( kadence_blocks_params.settings ? JSON.parse( kadence_blocks_params.settings ) : {} );
		if ( ! config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_settings_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, settings: config, isOpen: false } );
			kadence_blocks_params.settings = JSON.stringify( config );
		} );
	}
	saveConfigState( key, value ) {
		const config = this.state.settings;
		if ( ! config[ 'kadence/advancedgallery' ] ) {
			config[ 'kadence/advancedgallery' ] = {};
		}
		config[ 'kadence/advancedgallery' ][ key ] = value;
		this.setState( { settings: config } );
	}
	render() {
		const { settings, isOpen } = this.state;
		const gallerySettings = ( settings && settings[ 'kadence/advancedgallery' ] ? settings[ 'kadence/advancedgallery' ] : {} );
		return (
			<Fragment>
				<Tooltip text="Block Settings Visibility">
					<Button className="kt-block-settings" onClick={ () => this.setState( { isOpen: true } ) }>
						<Dashicon icon="visibility" />
					</Button>
				</Tooltip>
				{ isOpen ?
					<Modal
						className="kt-block-settings-modal"
						title={ __( 'Advanced Gallery Settings' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/advancedgallery', gallerySettings );
						} }>
						<SelectControl
							label={ __( 'Enabled All Settings For' ) }
							value={ ( gallerySettings.allSettings ? gallerySettings.allSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'allSettings', value ) }
						/>
						<hr />
						<h2>{ __( 'Control Individual Settings' ) }</h2>
						<SelectControl
							label={ __( 'Enable Gutter Settings' ) }
							value={ ( gallerySettings.gutterSettings ? gallerySettings.gutterSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'gutterSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Lightbox Settings' ) }
							value={ ( gallerySettings.lightboxSettings ? gallerySettings.lightboxSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'lightboxSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Image Style Settings' ) }
							value={ ( gallerySettings.styleSettings ? gallerySettings.styleSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'styleSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Caption Settings' ) }
							value={ ( gallerySettings.captionSettings ? gallerySettings.captionSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'captionSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Image Shadow Settings' ) }
							value={ ( gallerySettings.shadowSettings ? gallerySettings.shadowSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'shadowSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Gallery Spacing Settings' ) }
							value={ ( gallerySettings.spacingSettings ? gallerySettings.spacingSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'spacingSettings', value ) }
						/>
						<Button className="kt-settings-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/advancedgallery', gallerySettings );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceGallerySettings;
