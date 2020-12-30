/* global kadence_blocks_params */
const {
	Component,
	Fragment,
} = wp.element;
const {
	ToggleControl,
	Button,
	Tooltip,
	Modal,
} = wp.components;
const {
	applyFilters,
} = wp.hooks;
import Select from 'react-select';
//import fonts from '../../fonts';

import icons from '../../icons';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
class KadenceTypographyDefault extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
		};
	}
	componentDidMount() {
		// Check for old defaults.
		if ( ! this.state.configuration[ 'kadence/typography' ] ) {
			const blockConfig = kadence_blocks_params.config[ 'kadence/typography' ];
			if ( blockConfig !== undefined && typeof blockConfig === 'object' ) {
				Object.keys( blockConfig ).map( ( attribute ) => {
					this.saveConfigState( attribute, blockConfig[ attribute ] );
				} );
			}
		}
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
		if ( config[ 'kadence/typography' ] === undefined || config[ 'kadence/typography' ].length == 0 ) {
			config[ 'kadence/typography' ] = {};
		}
		config[ 'kadence/typography' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const typoConfig = ( configuration && configuration[ 'kadence/typography' ] ? configuration[ 'kadence/typography' ] : {} );
		const fontsarray = typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_font_names ? kadence_blocks_params.g_font_names.map( ( name ) => {
			return { label: name, value: name, google: true };
		} ) : {};
		const options = [
			{
				type: 'group',
				label: 'Standard Fonts',
				options: [
					{ label: 'System Default', value: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"', google: false },
					{ label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', google: false },
					{ label: '"Arial Black", Gadget, sans-serif', value: '"Arial Black", Gadget, sans-serif', google: false },
					{ label: '"Comic Sans MS", cursive, sans-serif', value: '"Comic Sans MS", cursive, sans-serif', google: false },
					{ label: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', google: false },
					{ label: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif', google: false },
					{ label: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', google: false },
					{ label: '"Trebuchet MS", Helvetica, sans-serif', value: '"Trebuchet MS", Helvetica, sans-serif', google: false },
					{ label: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', google: false },
					{ label: 'Georgia, serif', value: 'Georgia, serif', google: false },
					{ label: '"Palatino Linotype", "Book Antiqua", Palatino, serif', value: '"Palatino Linotype", "Book Antiqua", Palatino, serif', google: false },
					{ label: '"Times New Roman", Times, serif', value: '"Times New Roman", Times, serif', google: false },
					{ label: 'Courier, monospace', value: 'Courier, monospace', google: false },
					{ label: '"Lucida Console", Monaco, monospace', value: '"Lucida Console", Monaco, monospace', google: false },
				],
			},
			{
				type: 'group',
				label: 'Google Fonts',
				options: fontsarray,
			},
		];
		const typographyOptions = applyFilters( 'kadence.typography_options', options );
		const onTypoFontChange = ( select ) => {
			this.saveConfigState( 'choiceArray', select );
		};
		return (
			<Fragment>
				<Tooltip text="Block Defaults">
					<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
						<span className="kt-block-icon">{ icons.fontfamily }</span>
						{ __( 'Font Family Options' ) }
					</Button>
				</Tooltip>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal kt-font-family-modal"
						title={ __( 'Kadence Font Family Options' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/typography', typoConfig );
						} }>
						<ToggleControl
							label={ __( 'Show All Font Family Options' ) }
							checked={ ( undefined !== typoConfig.showAll ? typoConfig.showAll : true ) }
							onChange={ value => this.saveConfigState( 'showAll', value ) }
						/>
						{ ( undefined !== typoConfig.showAll ? ! typoConfig.showAll : false ) && (
							<Fragment>
								<div className="typography-family-select-form-row">
									<Select
										options={ typographyOptions }
										value={ ( typoConfig.choiceArray ? typoConfig.choiceArray : '' ) }
										isMulti={ true }
										maxMenuHeight={ 300 }
										placeholder={ __( 'Select the font families you want' ) }
										onChange={ onTypoFontChange }
									/>
								</div>
							</Fragment>
						) }
						<Button className="kt-defaults-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/typography', typoConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceTypographyDefault;
