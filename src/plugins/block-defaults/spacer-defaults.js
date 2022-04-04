import PopColorControl from '../../components/color/pop-color-control';
const {
	Component,
	Fragment,
} = wp.element;
const {
	ColorPalette,
} = wp.blockEditor;
const {
	ToggleControl,
	RangeControl,
	TabPanel,
	Dashicon,
	SelectControl,
	Button,
	Tooltip,
	Modal,
} = wp.components;

import icons from '../../icons';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
class KadenceSpacerDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
		};
	}
	componentDidMount() {
		// Check for old defaults.
		if ( ! this.state.configuration[ 'kadence/spacer' ] ) {
			const blockConfig = kadence_blocks_params.config[ 'kadence/spacer' ];
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
		if ( config[ 'kadence/spacer' ] === undefined || config[ 'kadence/spacer' ].length == 0 ) {
			config[ 'kadence/spacer' ] = {};
		}
		config[ 'kadence/spacer' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const spacerConfig = ( configuration && configuration[ 'kadence/spacer' ] ? configuration[ 'kadence/spacer' ] : {} );
		const deskControls = (
			<RangeControl
				label={ __( 'Height' ) }
				value={ ( spacerConfig.spacerHeight ? spacerConfig.spacerHeight : 60 ) }
				onChange={ value => this.saveConfigState( 'spacerHeight', value ) }
				min={ 6 }
				max={ 600 }
			/>
		);
		const tabletControls = (
			<RangeControl
				label={ __( 'Tablet Height' ) }
				value={ ( spacerConfig.tabletSpacerHeight ? spacerConfig.tabletSpacerHeight : 60 ) }
				onChange={ value => this.saveConfigState( 'tabletSpacerHeight', value ) }
				min={ 6 }
				max={ 600 }
			/>
		);
		const mobileControls = (
			<RangeControl
				label={ __( 'Mobile Height' ) }
				value={ ( spacerConfig.mobileSpacerHeight ? spacerConfig.mobileSpacerHeight : 60 ) }
				onChange={ value => this.saveConfigState( 'mobileSpacerHeight', value ) }
				min={ 6 }
				max={ 600 }
			/>
		);
		return (
			<Fragment>
				<Tooltip text="Block Defaults">
					<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
						<span className="kt-block-icon">{ icons.spacerblock }</span>
						{ __( 'Spacer/Divider' ) }
					</Button>
				</Tooltip>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Spacer/Divider' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/spacer', spacerConfig );
						} }>
						<SelectControl
							label={ __( 'Height Units' ) }
							value={ ( spacerConfig.spacerHeightUnits ? spacerConfig.spacerHeightUnits : 'px' ) }
							options={ [
								{ value: 'px', label: __( 'px' ) },
								{ value: 'vh', label: __( 'vh' ) },
							] }
							onChange={ value => this.saveConfigState( 'spacerHeightUnits', value ) }
						/>
						<TabPanel className="kt-inspect-tabs kt-spacer-tabs"
							activeClass="active-tab"
							tabs={ [
								{
									name: 'desk',
									title: <Dashicon icon="desktop" />,
									className: 'kt-desk-tab',
								},
								{
									name: 'tablet',
									title: <Dashicon icon="tablet" />,
									className: 'kt-tablet-tab',
								},
								{
									name: 'mobile',
									title: <Dashicon icon="smartphone" />,
									className: 'kt-mobile-tab',
								},
							] }>
							{
								( tab ) => {
									let tabout;
									if ( tab.name ) {
										if ( 'mobile' === tab.name ) {
											tabout = mobileControls;
										} else if ( 'tablet' === tab.name ) {
											tabout = tabletControls;
										} else {
											tabout = deskControls;
										}
									}
									return <div>{ tabout }</div>;
								}
							}
						</TabPanel>
						<ToggleControl
							label={ __( 'Enable Divider' ) }
							checked={ ( undefined !== spacerConfig.dividerEnable ? spacerConfig.dividerEnable : true ) }
							onChange={ value => this.saveConfigState( 'dividerEnable', value ) }
						/>
						{ ( undefined !== spacerConfig.dividerEnable ? spacerConfig.dividerEnable : true ) && (
							<Fragment>
								<SelectControl
									label={ __( 'Divider Style' ) }
									value={ ( spacerConfig.dividerStyle ? spacerConfig.dividerStyle : 'solid' ) }
									onChange={ value => this.saveConfigState( 'dividerStyle', value ) }
									options={ [
										{ value: 'solid', label: __( 'Solid' ) },
										{ value: 'dashed', label: __( 'Dashed' ) },
										{ value: 'dotted', label: __( 'Dotted' ) },
									] }
								/>
								<PopColorControl
									label={ __( 'Divider Color' ) }
									value={ ( spacerConfig.dividerColor ? spacerConfig.dividerColor : '#eeeeee' ) }
									default={ '#eeeeee' }
									opacityValue={ ( spacerConfig.dividerOpacity ? spacerConfig.dividerOpacity : 100 ) }
									onChange={ value => this.saveConfigState( 'dividerColor', value ) }
									onOpacityChange={ value => this.saveConfigState( 'dividerOpacity', value ) }
									opacityUnit={ 100 }
								/>
								<RangeControl
									label={ __( 'Divider Height in px' ) }
									value={ ( spacerConfig.dividerHeight ? spacerConfig.dividerHeight : 1 ) }
									onChange={ value => this.saveConfigState( 'dividerHeight', value ) }
									min={ 0 }
									max={ 40 }
								/>
								<RangeControl
									label={ __( 'Divider Width by %' ) }
									value={ ( spacerConfig.dividerWidth ? spacerConfig.dividerWidth : 1 ) }
									onChange={ value => this.saveConfigState( 'dividerWidth', value ) }
									min={ 0 }
									max={ 100 }
								/>
							</Fragment>
						) }
						<Button className="kt-defaults-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/spacer', spacerConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceSpacerDefault;
