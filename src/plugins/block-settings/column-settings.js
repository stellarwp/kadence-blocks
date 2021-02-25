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
class KadenceColumnSettings extends Component {
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
		if ( ! config[ 'kadence/column' ] ) {
			config[ 'kadence/column' ] = {};
		}
		config[ 'kadence/column' ][ key ] = value;
		this.setState( { settings: config } );
	}
	render() {
		const { settings, isOpen } = this.state;
		const columnSettings = ( settings && settings[ 'kadence/column' ] ? settings[ 'kadence/column' ] : {} );
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
						title={ __( 'Column Settings', 'kadence-blocks' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/column', columnSettings );
						} }>
						<SelectControl
							label={ __( 'Enabled All Settings For', 'kadence-blocks' ) }
							value={ ( columnSettings.allSettings ? columnSettings.allSettings : 'all' ) }
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
							label={ __( 'Enable Container Settings', 'kadence-blocks' ) }
							value={ ( columnSettings.container ? columnSettings.container : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'container', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Text Align Control', 'kadence-blocks' ) }
							value={ ( columnSettings.textAlign ? columnSettings.textAlign : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'textAlign', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Text Color Control' ) }
							value={ ( columnSettings.textColor ? columnSettings.textColor : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'textColor', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Padding/Margin Control' ) }
							value={ ( columnSettings.paddingMargin ? columnSettings.paddingMargin : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'paddingMargin', value ) }
						/>
						<Button className="kt-settings-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/column', columnSettings );
						} }>
							{ __( 'Save/Close', 'kadence-blocks' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceColumnSettings;
