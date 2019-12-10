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
const { __ } = wp.i18n;
class KadenceTabsSettings extends Component {
	constructor() {
		super( ...arguments );
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
		if ( ! config[ 'kadence/tabs' ] ) {
			config[ 'kadence/tabs' ] = {};
		}
		config[ 'kadence/tabs' ][ key ] = value;
		this.setState( { settings: config } );
	}
	render() {
		const { settings, isOpen } = this.state;
		const tabsSettings = ( settings && settings[ 'kadence/tabs' ] ? settings[ 'kadence/tabs' ] : {} );
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
						title={ __( 'Tabs Settings' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/tabs', tabsSettings );
						} }>
						<SelectControl
							label={ __( 'Enabled All Settings For' ) }
							value={ ( tabsSettings.allSettings ? tabsSettings.allSettings : 'all' ) }
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
						<h2>{ __( 'Control Individual Settings Groups' ) }</h2>
						<SelectControl
							label={ __( 'Enable Layout Settings' ) }
							value={ ( tabsSettings.tabLayout ? tabsSettings.tabLayout : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'tabLayout', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Content Settings' ) }
							value={ ( tabsSettings.tabContent ? tabsSettings.tabContent : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'tabContent', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Title Color Settings' ) }
							value={ ( tabsSettings.titleColor ? tabsSettings.titleColor : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'titleColor', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Title Spacing/Border Settings' ) }
							value={ ( tabsSettings.titleSpacing ? tabsSettings.titleSpacing : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'titleSpacing', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Title Font Settings' ) }
							value={ ( tabsSettings.titleFont ? tabsSettings.titleFont : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'titleFont', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Title Icon Settings' ) }
							value={ ( tabsSettings.titleIcon ? tabsSettings.titleIcon : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'titleIcon', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Structure Settings' ) }
							value={ ( tabsSettings.structure ? tabsSettings.structure : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'structure', value ) }
						/>
						<Button className="kt-settings-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/tabs', tabsSettings );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceTabsSettings;
