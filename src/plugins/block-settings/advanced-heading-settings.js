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
class KadenceHeadingSettings extends Component {
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
		if ( ! config[ 'kadence/advancedheading' ] ) {
			config[ 'kadence/advancedheading' ] = {};
		}
		config[ 'kadence/advancedheading' ][ key ] = value;
		this.setState( { settings: config } );
	}
	render() {
		const { settings, isOpen } = this.state;
		const btnSettings = ( settings && settings[ 'kadence/advancedheading' ] ? settings[ 'kadence/advancedheading' ] : {} );
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
						title={ __( 'Advanced Text Settings', 'kadence-blocks' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/advancedheading', btnSettings );
						} }>
						<SelectControl
							label={ __( 'Enabled All Settings For', 'kadence-blocks' ) }
							value={ ( btnSettings.allSettings ? btnSettings.allSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'allSettings', value ) }
						/>
						<hr />
						<h2>{ __( 'Control Individual Settings', 'kadence-blocks' ) }</h2>
						<SelectControl
							label={ __( 'Enable Typography Settings in Toolbar', 'kadence-blocks' ) }
							value={ ( btnSettings.toolbarTypography ? btnSettings.toolbarTypography : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'toolbarTypography', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Color Settings in Toolbar', 'kadence-blocks' ) }
							value={ ( btnSettings.toolbarColor ? btnSettings.toolbarColor : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'toolbarColor', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Color Settings', 'kadence-blocks' ) }
							value={ ( btnSettings.colorSettings ? btnSettings.colorSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'colorSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Size Settings', 'kadence-blocks' ) }
							value={ ( btnSettings.sizeSettings ? btnSettings.sizeSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'sizeSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Advanced Typography Settings', 'kadence-blocks'  ) }
							value={ ( btnSettings.advancedSettings ? btnSettings.advancedSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'advancedSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Highlight Settings', 'kadence-blocks' ) }
							value={ ( btnSettings.highlightSettings ? btnSettings.highlightSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'highlightSettings', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Margin Settings', 'kadence-blocks' ) }
							value={ ( btnSettings.marginSettings ? btnSettings.marginSettings : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'marginSettings', value ) }
						/>
						<Button className="kt-settings-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/advancedheading', btnSettings );
						} }>
							{ __( 'Save/Close', 'kadence-blocks' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceHeadingSettings;
