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
class KadenceRowLayoutSettings extends Component {
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
		const config = this.state.settings;
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
		if ( ! config[ 'kadence/rowlayout' ] ) {
			config[ 'kadence/rowlayout' ] = {};
		}
		config[ 'kadence/rowlayout' ][ key ] = value;
		this.setState( { settings: config } );
	}
	render() {
		const { settings, isOpen } = this.state;
		const rowSettings = ( settings && settings[ 'kadence/rowlayout' ] ? settings[ 'kadence/rowlayout' ] : {} );
		return (
			<Fragment>
				<Tooltip text="Block Settings Visibility">
					<Button className="kt-block-settings" onClick={ () => this.setState( { isOpen: true } ) }>
						<Dashicon icon="admin-settings" />
					</Button>
				</Tooltip>
				{ isOpen ?
					<Modal
						className="kt-block-settings-modal"
						title={ __( 'Row Layout Settings' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/rowlayout', rowSettings );
						} }>
						<SelectControl
							label={ __( 'Enabled All Settings For' ) }
							value={ ( rowSettings.allSettings ? rowSettings.allSettings : 'all' ) }
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
							label={ __( 'Enable Custom Column Resizing' ) }
							value={ ( rowSettings.columnResize ? rowSettings.columnResize : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'columnResize', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Padding/Margin Settings' ) }
							value={ ( rowSettings.paddingMargin ? rowSettings.paddingMargin : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'paddingMargin', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Background Settings' ) }
							value={ ( rowSettings.background ? rowSettings.background : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'background', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Background Overlay Settings' ) }
							value={ ( rowSettings.backgroundOverlay ? rowSettings.backgroundOverlay : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'backgroundOverlay', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Dividers Settings' ) }
							value={ ( rowSettings.dividers ? rowSettings.dividers : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'dividers', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Text Color Settings' ) }
							value={ ( rowSettings.textColor ? rowSettings.textColor : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor' ) },
								{ value: 'author', label: __( 'Minimum User Role Author' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin' ) },
								{ value: 'none', label: __( 'No Users' ) },
							] }
							onChange={ value => this.saveConfigState( 'textColor', value ) }
						/>
						<SelectControl
							label={ __( 'Enable Structure Settings' ) }
							value={ ( rowSettings.structure ? rowSettings.structure : 'all' ) }
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
						<Button className="kt-settings-save" isDefault isPrimary onClick={ () => {
							this.saveConfig( 'kadence/rowlayout', rowSettings );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceRowLayoutSettings;
