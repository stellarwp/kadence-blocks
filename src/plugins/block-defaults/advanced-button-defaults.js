import TypographyControls from '../../typography-control';
import GenIcon from '../../genicon';
import Ico from '../../svgicons';
import IcoNames from '../../svgiconsnames';
import FaIco from '../../faicons';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
/**
 * Internal block libraries
 */
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	ColorPalette,
} = wp.editor;
const {
	Button,
	TabPanel,
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
	ToggleControl,
	Modal,
} = wp.components;

import icons from '../../icons';

class KadenceButtonDefault extends Component {
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
		if ( ! this.state.configuration[ 'kadence/advancedbtn' ] ) {
			const blockConfig = kadence_blocks_params.config[ 'kadence/advancedbtn' ];
			if ( blockConfig !== undefined && typeof blockConfig === 'object' ) {
				Object.keys( blockConfig ).map( ( attribute ) => {
					this.saveConfigState( attribute, blockConfig[ attribute ] );
				} );
			}
		}
	}
	saveConfig( blockID, settingArray ) {
		this.setState( { isSaving: true } );
		const config = this.state.configuration;
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
		if ( ! config[ 'kadence/advancedbtn' ] ) {
			config[ 'kadence/advancedbtn' ] = {};
		}
		config[ 'kadence/advancedbtn' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const buttonConfig = ( configuration && configuration[ 'kadence/advancedbtn' ] ? configuration[ 'kadence/advancedbtn' ] : {} );
		const btnDefaultStyles = [ {
			text: '',
			link: '',
			target: '_self',
			size: 18,
			paddingBT: '',
			paddingLR: '',
			color: '#555555',
			background: 'transparent',
			border: '#555555',
			backgroundOpacity: 1,
			borderOpacity: 1,
			borderRadius: 3,
			borderWidth: 2,
			colorHover: '#ffffff',
			backgroundHover: '#444444',
			borderHover: '#444444',
			backgroundHoverOpacity: 1,
			borderHoverOpacity: 1,
			icon: '',
			iconSide: 'right',
			iconHover: false,
			cssClass: '',
			noFollow: false,
		} ];
		const btns = ( undefined !== buttonConfig.btns && buttonConfig.btns[ 0 ] ? buttonConfig.btns : btnDefaultStyles );
		const saveBtnArray = ( value ) => {
			const newUpdate = btns.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'btns', newUpdate );
		};
		const renderSVG = svg => (
			<GenIcon name={ svg } icon={ ( 'fa' === svg.substring( 0, 2 ) ? FaIco[ svg ] : Ico[ svg ] ) } />
		);
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.advancedbtn }</span>
					{ __( 'Advanced Button' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Advanced Button' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/advancedbtn', buttonConfig );
						} }>
						<PanelBody>
							<SelectControl
								label={ __( 'Link Target' ) }
								value={ btns[ 0 ].target }
								options={ [
									{ value: '_self', label: __( 'Same Window' ) },
									{ value: '_blank', label: __( 'New Window' ) },
									{ value: 'video', label: __( 'Video Popup' ) },
								] }
								onChange={ value => saveBtnArray( { target: value } ) }
							/>
							<ToggleControl
								label={ __( 'Set link to nofollow?' ) }
								checked={ ( undefined !== btns[ 0 ].noFollow ? btns[ 0 ].noFollow : false ) }
								onChange={ ( value ) => saveBtnArray( { noFollow: value } ) }
							/>
							<RangeControl
								beforeIcon="editor-textcolor"
								afterIcon="editor-textcolor"
								label={ __( 'Button Text Size' ) }
								value={ btns[ 0 ].size }
								onChange={ value => {
									saveBtnArray( { size: value } );
								} }
								min={ 10 }
								max={ 100 }
							/>
							<RangeControl
								label={ __( 'Top and Bottom Padding' ) }
								value={ btns[ 0 ].paddingBT }
								onChange={ value => {
									saveBtnArray( { paddingBT: value } );
								} }
								min={ 0 }
								max={ 100 }
							/>
							<RangeControl
								label={ __( 'Left and Right Padding' ) }
								value={ btns[ 0 ].paddingLR }
								onChange={ value => {
									saveBtnArray( { paddingLR: value } );
								} }
								min={ 0 }
								max={ 100 }
							/>
							<RangeControl
								label={ __( 'Border Thickness' ) }
								value={ btns[ 0 ].borderWidth }
								onChange={ value => {
									saveBtnArray( { borderWidth: value } );
								} }
								min={ 0 }
								max={ 20 }
							/>
							<RangeControl
								label={ __( 'Border Radius' ) }
								value={ btns[ 0 ].borderRadius }
								onChange={ value => {
									saveBtnArray( { borderRadius: value } );
								} }
								min={ 0 }
								max={ 50 }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Color Settings' ) }
							initialOpen={ false }
						>
							<TabPanel className="kt-inspect-tabs kt-hover-tabs"
								activeClass="active-tab"
								tabs={ [
									{
										name: 'normal',
										title: __( 'Normal' ),
										className: 'kt-normal-tab',
									},
									{
										name: 'hover',
										title: __( 'Hover' ),
										className: 'kt-hover-tab',
									},
								] }>
								{
									( tab ) => {
										let tabout;
										if ( tab.name ) {
											if ( 'hover' === tab.name ) {
												tabout = (
													<Fragment>
														<p className="kt-setting-label">{ __( 'Hover Font Color' ) }</p>
														<ColorPalette
															value={ btns[ 0 ].colorHover }
															onChange={ value => {
																saveBtnArray( { colorHover: value } );
															} }
														/>
														<p className="kt-setting-label">{ __( 'Hover Background Color' ) }</p>
														<ColorPalette
															value={ btns[ 0 ].backgroundHover }
															onChange={ value => {
																saveBtnArray( { backgroundHover: value } );
															} }
														/>
														<RangeControl
															label={ __( 'Hover Background Opacity' ) }
															value={ btns[ 0 ].backgroundHoverOpacity }
															onChange={ value => {
																saveBtnArray( { backgroundHoverOpacity: value } );
															} }
															min={ 0 }
															max={ 1 }
															step={ 0.01 }
														/>
														<p className="kt-setting-label">{ __( 'Hover Border Color' ) }</p>
														<ColorPalette
															value={ btns[ 0 ].borderHover }
															onChange={ value => {
																saveBtnArray( { borderHover: value } );
															} }
														/>
														<RangeControl
															label={ __( 'Hover Border Opacity' ) }
															value={ btns[ 0 ].borderHoverOpacity }
															onChange={ value => {
																saveBtnArray( { borderHoverOpacity: value } );
															} }
															min={ 0 }
															max={ 1 }
															step={ 0.01 }
														/>
													</Fragment>
												);
											} else {
												tabout = (
													<Fragment>
														<p className="kt-setting-label">{ __( 'Font Color' ) }</p>
														<ColorPalette
															value={ btns[ 0 ].color }
															onChange={ value => {
																saveBtnArray( { color: value } );
															} }
														/>
														<p className="kt-setting-label">{ __( 'Background Color' ) }</p>
														<ColorPalette
															value={ btns[ 0 ].background }
															onChange={ value => {
																saveBtnArray( { background: value } );
															} }
														/>
														<RangeControl
															label={ __( 'Background Opacity' ) }
															value={ btns[ 0 ].backgroundOpacity }
															onChange={ value => {
																saveBtnArray( { backgroundOpacity: value } );
															} }
															min={ 0 }
															max={ 1 }
															step={ 0.01 }
														/>
														<p className="kt-setting-label">{ __( 'Border Color' ) }</p>
														<ColorPalette
															value={ btns[ 0 ].border }
															onChange={ value => {
																saveBtnArray( { border: value } );
															} }
														/>
														<RangeControl
															label={ __( 'Border Opacity' ) }
															value={ btns[ 0 ].borderOpacity }
															onChange={ value => {
																saveBtnArray( { borderOpacity: value } );
															} }
															min={ 0 }
															max={ 1 }
															step={ 0.01 }
														/>
													</Fragment>
												);
											}
										}
										return <div>{ tabout }</div>;
									}
								}
							</TabPanel>
						</PanelBody>
						<PanelBody
							title={ __( 'Icons Settings' ) }
							initialOpen={ false }
						>
							<h2 className="kt-tool">{ __( 'Icon Settings' ) }</h2>
							<FontIconPicker
								icons={ IcoNames }
								value={ btns[ 0 ].icon }
								onChange={ value => {
									saveBtnArray( { icon: value } );
								} }
								appendTo={ false }
								closeOnSelect={ true }
								renderFunc={ renderSVG }
								theme="default"
								isMulti={ false }
							/>
							<SelectControl
								label={ __( 'Icon Location' ) }
								value={ btns[ 0 ].iconSide }
								options={ [
									{ value: 'right', label: __( 'Right' ) },
									{ value: 'left', label: __( 'Left' ) },
								] }
								onChange={ value => {
									saveBtnArray( { iconSide: value } );
								} }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'CSS Class' ) }
							initialOpen={ false }
						>
							<TextControl
								label={ __( 'Add Custom CSS Class' ) }
								value={ ( btns[ 0 ].cssClass ? btns[ 0 ].cssClass : '' ) }
								onChange={ ( value ) => saveBtnArray( { cssClass: value } ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Font Family' ) }
							initialOpen={ false }
							className="kt-font-family-area"
						>
							<TypographyControls
								letterSpacing={ ( undefined !== buttonConfig.letterSpacing ? buttonConfig.letterSpacing : '' ) }
								onLetterSpacing={ ( value ) => this.saveConfigState( 'letterSpacing', value ) }
								fontFamily={ ( undefined !== buttonConfig.typography ? buttonConfig.typography : '' ) }
								onFontFamily={ ( value ) => this.saveConfigState( 'typography', value ) }
								onFontChange={ ( select ) => {
									this.saveConfigState( 'typography', select.value );
									this.saveConfigState( 'googleFont', select.google );
								} }
								googleFont={ ( undefined !== buttonConfig.googleFont ? buttonConfig.googleFont : '' ) }
								onGoogleFont={ ( value ) => this.saveConfigState( 'googleFont', value ) }
								loadGoogleFont={ ( undefined !== buttonConfig.loadGoogleFont ? buttonConfig.loadGoogleFont : true ) }
								onLoadGoogleFont={ ( value ) => this.saveConfigState( 'loadGoogleFont', value ) }
								fontVariant={ ( undefined !== buttonConfig.fontVariant ? buttonConfig.fontVariant : '' ) }
								onFontVariant={ ( value ) => this.saveConfigState( 'fontVariant', value ) }
								fontWeight={ ( undefined !== buttonConfig.fontWeight ? buttonConfig.fontWeight : '' ) }
								onFontWeight={ ( value ) => this.saveConfigState( 'fontWeight', value ) }
								fontStyle={ ( undefined !== buttonConfig.fontStyle ? buttonConfig.fontStyle : '' ) }
								onFontStyle={ ( value ) => this.saveConfigState( 'fontStyle', value ) }
								fontSubset={ ( undefined !== buttonConfig.fontSubset ? buttonConfig.fontSubset : '' ) }
								onFontSubset={ ( value ) => this.saveConfigState( 'fontSubset', value ) }
							/>
						</PanelBody>
						<Button className="kt-defaults-save" isDefault isPrimary onClick={ () => {
							this.saveConfig( 'kadence/advancedbtn', buttonConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceButtonDefault;
