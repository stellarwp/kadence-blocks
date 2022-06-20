/* global kadence_blocks_params */

const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	Tooltip,
	Modal,
	SelectControl,
} = wp.components;
/**
 * Internal dependencies
 */
import { kadenceCatNewIcon } from '@kadence/icons';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
class KadenceDesignLibrarySettings extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
		};
	}
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} );
		if ( ! config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_config_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {
			this.setState( { isSaving: false, configuration: config, isOpen: false } );
			kadence_blocks_params.configuration = JSON.stringify( config );
		} );
	}
	saveConfigState( key, value ) {
		const config = this.state.configuration;
		if ( config[ 'kadence/designlibrary' ] === undefined || config[ 'kadence/designlibrary' ].length == 0 ) {
			config[ 'kadence/designlibrary' ] = {};
		}
		config[ 'kadence/designlibrary' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const designConfig = ( configuration && configuration[ 'kadence/designlibrary' ] ? configuration[ 'kadence/designlibrary' ] : {} );
		return (
			<Fragment>
				<Tooltip text="Block Defaults">
					<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
						<span className="kt-block-icon">{ kadenceCatNewIcon }</span>
						{ __( 'Design Library', 'kadence-blocks' ) }
					</Button>
				</Tooltip>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal kt-font-family-modal"
						title={ __( 'Design Library Button Options', 'kadence-blocks' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/designlibrary', designConfig );
						} }>
						<SelectControl
							label={ __( 'Show Design Library Button For', 'kadence-blocks' ) }
							value={ ( designConfig.show ? designConfig.show : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'show', value ) }
						/>
						<SelectControl
							label={ __( 'Show Wireframe Library For', 'kadence-blocks' ) }
							value={ ( designConfig.wire ? designConfig.wire : 'all' ) }
							options={ [
								{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
								{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
								{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
								{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
								{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
								{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
							] }
							onChange={ value => this.saveConfigState( 'wire', value ) }
						/>
						{ kadence_blocks_params.pro === 'true' && (
							<Fragment>
								<SelectControl
									label={ __( 'Show Sections Library For', 'kadence-blocks' ) }
									value={ ( designConfig.section ? designConfig.section : 'all' ) }
									options={ [
										{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
										{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
										{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
										{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
										{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
										{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
									] }
									onChange={ value => this.saveConfigState( 'section', value ) }
								/>
								<SelectControl
									label={ __( 'Show Starter Packs Library For', 'kadence-blocks' ) }
									value={ ( designConfig.templates ? designConfig.templates : 'all' ) }
									options={ [
										{ value: 'all', label: __( 'All Users', 'kadence-blocks' ) },
										{ value: 'contributor', label: __( 'Minimum User Role Contributor', 'kadence-blocks' ) },
										{ value: 'author', label: __( 'Minimum User Role Author', 'kadence-blocks' ) },
										{ value: 'editor', label: __( 'Minimum User Role Editor', 'kadence-blocks' ) },
										{ value: 'admin', label: __( 'Minimum User Role Admin', 'kadence-blocks' ) },
										{ value: 'none', label: __( 'No Users', 'kadence-blocks' ) },
									] }
									onChange={ value => this.saveConfigState( 'templates', value ) }
								/>
							</Fragment>
						) }
						<Button className="kt-defaults-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/designlibrary', designConfig );
						} }>
							{ __( 'Save/Close', 'kadence-blocks' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceDesignLibrarySettings;
