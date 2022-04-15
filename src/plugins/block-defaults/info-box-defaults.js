import { TypographyControls } from '@kadence/components';
import MeasurementControls from '../../measurement-control';
import { IconControl } from '@wordpress/components';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	ColorPalette,
} = wp.blockEditor;
const {
	Button,
	TabPanel,
	PanelBody,
	RangeControl,
	TextControl,
	ToggleControl,
	SelectControl,
	Modal,
} = wp.components;

import { infoboxIcon } from '@kadence/icons';

class KadenceInfoBoxDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.clearDefaults = this.clearDefaults.bind( this );
		this.clearAllDefaults = this.clearAllDefaults.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			resetConfirm: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
			containerPaddingControl: 'linked',
			containerBorderControl: 'linked',
			mediaBorderControl: 'linked',
			mediaPaddingControl: 'linked',
			mediaMarginControl: 'linked',
		};
	}
	componentDidMount() {
		const infoConfig = ( this.state.configuration && this.state.configuration[ 'kadence/infobox' ] ? this.state.configuration[ 'kadence/infobox' ] : {} );
		if ( infoConfig.mediaStyle && infoConfig.mediaStyle[ 0 ] ) {
			if ( infoConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === infoConfig.mediaStyle[ 0 ].borderWidth[ 1 ] && infoConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === infoConfig.mediaStyle[ 0 ].borderWidth[ 2 ] && infoConfig.mediaStyle[ 0 ].borderWidth[ 0 ] === infoConfig.mediaStyle[ 0 ].borderWidth[ 3 ] ) {
				this.setState( { mediaBorderControl: 'linked' } );
			} else {
				this.setState( { mediaBorderControl: 'individual' } );
			}
			if ( infoConfig.mediaStyle[ 0 ].padding[ 0 ] === infoConfig.mediaStyle[ 0 ].padding[ 1 ] && infoConfig.mediaStyle[ 0 ].padding[ 0 ] === infoConfig.mediaStyle[ 0 ].padding[ 2 ] && infoConfig.mediaStyle[ 0 ].padding[ 0 ] === infoConfig.mediaStyle[ 0 ].padding[ 3 ] ) {
				this.setState( { mediaPaddingControl: 'linked' } );
			} else {
				this.setState( { mediaPaddingControl: 'individual' } );
			}
			if ( infoConfig.mediaStyle[ 0 ].margin[ 0 ] === infoConfig.mediaStyle[ 0 ].margin[ 1 ] && infoConfig.mediaStyle[ 0 ].margin[ 0 ] === infoConfig.mediaStyle[ 0 ].margin[ 2 ] && infoConfig.mediaStyle[ 0 ].margin[ 0 ] === infoConfig.mediaStyle[ 0 ].margin[ 3 ] ) {
				this.setState( { mediaMarginControl: 'linked' } );
			} else {
				this.setState( { mediaMarginControl: 'individual' } );
			}
		}
		if ( infoConfig.containerBorderWidth && infoConfig.containerBorderWidth[ 0 ] ) {
			if ( infoConfig.containerBorderWidth[ 0 ] === infoConfig.containerBorderWidth[ 1 ] && infoConfig.containerBorderWidth[ 0 ] === infoConfig.containerBorderWidth[ 2 ] && infoConfig.containerBorderWidth[ 0 ] === infoConfig.containerBorderWidth[ 3 ] ) {
				this.setState( { containerBorderControl: 'linked' } );
			} else {
				this.setState( { containerBorderControl: 'individual' } );
			}
		}
		if ( infoConfig.containerPadding && infoConfig.containerPadding[ 0 ] ) {
			if ( infoConfig.containerPadding[ 0 ] === infoConfig.containerPadding[ 1 ] && infoConfig.containerPadding[ 0 ] === infoConfig.containerPadding[ 2 ] && infoConfig.containerPadding[ 0 ] === infoConfig.containerPadding[ 3 ] ) {
				this.setState( { containerPaddingControl: 'linked' } );
			} else {
				this.setState( { containerPaddingControl: 'individual' } );
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
		if ( config[ 'kadence/infobox' ] === undefined || config[ 'kadence/infobox' ].length == 0 ) {
			config[ 'kadence/infobox' ] = {};
		}
		config[ 'kadence/infobox' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	clearDefaults( key ) {
		const config = this.state.configuration;
		if ( config[ 'kadence/infobox' ] === undefined || config[ 'kadence/infobox' ].length == 0 ) {
			config[ 'kadence/infobox' ] = {};
		}
		if ( undefined !== config[ 'kadence/infobox' ][ key ] ) {
			delete config[ 'kadence/infobox' ][ key ];
		}
		this.setState( { configuration: config } );
	}
	clearAllDefaults() {
		const config = this.state.configuration;
		config[ 'kadence/infobox' ] = {};
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen, containerBorderControl, mediaBorderControl, mediaPaddingControl, mediaMarginControl, containerPaddingControl } = this.state;
		const infoConfig = ( configuration && configuration[ 'kadence/infobox' ] ? configuration[ 'kadence/infobox' ] : {} );
		const mediaImageDefaultStyles = [ {
			url: '',
			id: '',
			alt: '',
			width: '',
			height: '',
			maxWidth: '',
			hoverAnimation: 'none',
			flipUrl: '',
			flipId: '',
			flipAlt: '',
			flipWidth: '',
			flipHeight: '',
			subtype: '',
			flipSubtype: '',
		} ];
		const mediaImage = ( undefined !== infoConfig.mediaImage && infoConfig.mediaImage[ 0 ] ? infoConfig.mediaImage : mediaImageDefaultStyles );
		const saveMediaImage = ( value ) => {
			const newUpdate = mediaImage.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'mediaImage', newUpdate );
		};
		const mediaIconDefaultStyles = [ {
			icon: 'fe_aperture',
			size: 50,
			width: 2,
			title: '',
			color: '#444444',
			hoverColor: '#444444',
			hoverAnimation: 'none',
			flipIcon: '',
		} ];
		const mediaIcon = ( undefined !== infoConfig.mediaIcon && infoConfig.mediaIcon[ 0 ] ? infoConfig.mediaIcon : mediaIconDefaultStyles );
		const saveMediaIcon = ( value ) => {
			const newUpdate = mediaIcon.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'mediaIcon', newUpdate );
		};
		const mediaStyleDefaultStyles = [ {
			background: 'transparent',
			hoverBackground: 'transparent',
			border: '#444444',
			hoverBorder: '#444444',
			borderRadius: 0,
			borderWidth: [ 0, 0, 0, 0 ],
			padding: [ 10, 10, 10, 10 ],
			margin: [ 0, 15, 0, 15 ],
		} ];
		const mediaStyle = ( undefined !== infoConfig.mediaStyle && infoConfig.mediaStyle[ 0 ] ? infoConfig.mediaStyle : mediaStyleDefaultStyles );
		const saveMediaStyle = ( value ) => {
			const newUpdate = mediaStyle.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'mediaStyle', newUpdate );
		};
		const titleFontDefaultStyles = [ {
			level: 2,
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 0, 0, 0, 0 ],
			paddingControl: 'linked',
			margin: [ 5, 0, 10, 0 ],
			marginControl: 'individual',
		} ];
		const titleFont = ( undefined !== infoConfig.titleFont && infoConfig.titleFont[ 0 ] ? infoConfig.titleFont : titleFontDefaultStyles );
		const saveTitleFont = ( value ) => {
			const newUpdate = titleFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'titleFont', newUpdate );
		};
		const textFontDefaultStyles = [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
		} ];
		const textFont = ( undefined !== infoConfig.textFont && infoConfig.textFont[ 0 ] ? infoConfig.textFont : textFontDefaultStyles );
		const saveTextFont = ( value ) => {
			const newUpdate = textFont.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'textFont', newUpdate );
		};
		const learnMoreStylesDefaultStyles = [ {
			size: [ '', '', '' ],
			sizeType: 'px',
			lineHeight: [ '', '', '' ],
			lineType: 'px',
			letterSpacing: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 4, 8, 4, 8 ],
			paddingControl: 'individual',
			margin: [ 10, 0, 10, 0 ],
			marginControl: 'individual',
			color: '',
			background: 'transparent',
			border: '#555555',
			borderRadius: 0,
			borderWidth: [ 0, 0, 0, 0 ],
			borderControl: 'linked',
			colorHover: '#ffffff',
			backgroundHover: '#444444',
			borderHover: '#444444',
			hoverEffect: 'revealBorder',
		} ];
		const learnMoreStyles = ( undefined !== infoConfig.learnMoreStyles && infoConfig.learnMoreStyles[ 0 ] ? infoConfig.learnMoreStyles : learnMoreStylesDefaultStyles );
		const saveLearnMoreStyles = ( value ) => {
			const newUpdate = learnMoreStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'learnMoreStyles', newUpdate );
		};
		const shadowDefaultStyles = [ {
			color: '#000000',
			opacity: 0,
			spread: 0,
			blur: 0,
			hOffset: 0,
			vOffset: 0,
		} ];
		const shadow = ( undefined !== infoConfig.shadow && infoConfig.shadow[ 0 ] ? infoConfig.shadow : shadowDefaultStyles );
		const saveShadow = ( value ) => {
			const newUpdate = shadow.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'shadow', newUpdate );
		};
		const shadowHoverDefaultStyles = [ {
			color: '#000000',
			opacity: 0,
			spread: 0,
			blur: 0,
			hOffset: 0,
			vOffset: 0,
		} ];
		const shadowHover = ( undefined !== infoConfig.shadowHover && infoConfig.shadowHover[ 0 ] ? infoConfig.shadowHover : shadowHoverDefaultStyles );
		const saveHoverShadow = ( value ) => {
			const newUpdate = shadowHover.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'shadowHover', newUpdate );
		};
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ infoboxIcon }</span>
					{ __( 'Info Box' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Info Box' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/infobox', infoConfig );
						} }>
						<PanelBody>
							<ToggleControl
								label={ __( 'Show Presets' ) }
								checked={ ( undefined !== infoConfig.showPresets ? infoConfig.showPresets : true ) }
								onChange={ value => this.saveConfigState( 'showPresets', value ) }
							/>
							<SelectControl
								label={ __( 'Link Target' ) }
								value={ ( undefined !== infoConfig.target ? infoConfig.target : '_self' ) }
								options={ [
									{ value: '_self', label: __( 'Same Window' ) },
									{ value: '_blank', label: __( 'New Window' ) },
								] }
								onChange={ value => this.saveConfigState( 'target', value ) }
							/>
							<SelectControl
								label={ __( 'Link Content' ) }
								value={ ( undefined !== infoConfig.linkProperty ? infoConfig.linkProperty : 'box' ) }
								options={ [
									{ value: 'box', label: __( 'Entire Box' ) },
									{ value: 'learnmore', label: __( 'Only Learn More Text' ) },
								] }
								onChange={ value => this.saveConfigState( 'linkProperty', value ) }
							/>
							<SelectControl
								label={ __( 'Content Align' ) }
								value={ ( undefined !== infoConfig.hAlign ? infoConfig.hAlign : 'center' ) }
								options={ [
									{ value: 'center', label: __( 'Center' ) },
									{ value: 'left', label: __( 'Left' ) },
									{ value: 'right', label: __( 'Right' ) },
								] }
								onChange={ value => this.saveConfigState( 'hAlign', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Container Settings' ) }
							initialOpen={ false }
						>
							<MeasurementControls
								label={ __( 'Container Border Width (px)' ) }
								measurement={ ( undefined !== infoConfig.containerBorderWidth ? infoConfig.containerBorderWidth : [ 0, 0, 0, 0 ] ) }
								control={ containerBorderControl }
								onChange={ ( value ) => this.saveConfigState( 'containerBorderWidth', value ) }
								onControl={ ( value ) => this.setState( { containerBorderControl: value } ) }
								min={ 0 }
								max={ 40 }
								step={ 1 }
							/>
							<RangeControl
								label={ __( 'Container Border Radius (px)' ) }
								value={ ( undefined !== infoConfig.containerBorderRadius ? infoConfig.containerBorderRadius : 0 ) }
								onChange={ value => this.saveConfigState( 'containerBorderRadius', value ) }
								step={ 1 }
								min={ 0 }
								max={ 200 }
							/>
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
														<h2>{ __( 'Container Hover Background' ) }</h2>
														<ColorPalette
															value={ ( undefined !== infoConfig.containerHoverBackground ? infoConfig.containerHoverBackground : '#f2f2f2' ) }
															onChange={ value => this.saveConfigState( 'containerHoverBackground', value ) }
														/>
														<h2>{ __( 'Container Hover Border' ) }</h2>
														<ColorPalette
															value={ ( undefined !== infoConfig.containerHoverBorder ? infoConfig.containerHoverBorder : '#eeeeee' ) }
															onChange={ value => this.saveConfigState( 'containerHoverBorder', value ) }
														/>
													</Fragment>
												);
											} else {
												tabout = (
													<Fragment>
														<h2>{ __( 'Container Background' ) }</h2>
														<ColorPalette
															value={ ( undefined !== infoConfig.containerBackground ? infoConfig.containerBackground : '#f2f2f2' ) }
															onChange={ value => this.saveConfigState( 'containerBackground', value ) }
														/>
														<h2>{ __( 'Container Border' ) }</h2>
														<ColorPalette
															value={ ( undefined !== infoConfig.containerBorder ? infoConfig.containerBorder : '#eeeeee' ) }
															onChange={ value => this.saveConfigState( 'containerBorder', value ) }
														/>
													</Fragment>
												);
											}
										}
										return <div>{ tabout }</div>;
									}
								}
							</TabPanel>
							<MeasurementControls
								label={ __( 'Container Padding' ) }
								measurement={ ( undefined !== infoConfig.containerPadding ? infoConfig.containerPadding : [ 20, 20, 20, 20 ] ) }
								control={ containerPaddingControl }
								onChange={ ( value ) => this.saveConfigState( 'containerPadding', value ) }
								onControl={ ( value ) => this.setState( { containerPaddingControl: value } ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Media Settings' ) }
							initialOpen={ false }
						>
							<SelectControl
								label={ __( 'Media Align' ) }
								value={ ( undefined !== infoConfig.mediaAlign ? infoConfig.mediaAlign : 'top' ) }
								options={ [
									{ value: 'top', label: __( 'Top' ) },
									{ value: 'left', label: __( 'Left' ) },
									{ value: 'right', label: __( 'Right' ) },
								] }
								onChange={ value => this.saveConfigState( 'mediaAlign', value ) }
							/>
							<SelectControl
								label={ __( 'Media Type' ) }
								value={ ( undefined !== infoConfig.mediaType ? infoConfig.mediaType : 'icon' ) }
								options={ [
									{ value: 'icon', label: __( 'Icon' ) },
									{ value: 'image', label: __( 'Image' ) },
								] }
								onChange={ value => this.saveConfigState( 'mediaType', value ) }
							/>
							{ infoConfig.mediaType && 'image' === infoConfig.mediaType && (
								<Fragment>
									<SelectControl
										label={ __( 'Image Size' ) }
										value={ mediaImage[ 0 ].size }
										options={ [
											{ value: 'full', label: __( 'Full', 'kadence' ) },
											{ value: 'large', label: __( 'Large', 'kadence' ) },
											{ value: 'medium_large', label: __( 'Medium Large', 'kadence' ) },
											{ value: 'medium', label: __( 'Medium', 'kadence' ) },
											{ value: 'thumbnail', label: __( 'Thumbnail', 'kadence' ) },
										] }
										onChange={ value => saveMediaImage( { size: value } ) }
									/>
									<RangeControl
										label={ __( 'Max Image Width' ) }
										value={ mediaImage[ 0 ].maxWidth }
										onChange={ value => saveMediaImage( { maxWidth: value } ) }
										min={ 5 }
										max={ 800 }
										step={ 1 }
									/>
									<SelectControl
										label={ __( 'Image Hover Animation' ) }
										value={ mediaImage[ 0 ].hoverAnimation }
										options={ [
											{ value: 'none', label: __( 'None' ) },
											{ value: 'grayscale', label: __( 'Grayscale to Color' ) },
											{ value: 'drawborder', label: __( 'Border Spin In' ) },
											{ value: 'grayscale-border-draw', label: __( 'Grayscale to Color & Border Spin In' ) },
											{ value: 'flip', label: __( 'Flip to Another Image' ) },
										] }
										onChange={ value => saveMediaImage( { hoverAnimation: value } ) }
									/>
									<MeasurementControls
										label={ __( 'Image Border' ) }
										measurement={ mediaStyle[ 0 ].borderWidth }
										control={ mediaBorderControl }
										onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
										onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
										min={ 0 }
										max={ 40 }
										step={ 1 }
									/>
									<RangeControl
										label={ __( 'Image Border Radius (px)' ) }
										value={ mediaStyle[ 0 ].borderRadius }
										onChange={ value => saveMediaStyle( { borderRadius: value } ) }
										step={ 1 }
										min={ 0 }
										max={ 200 }
									/>
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
																{ mediaImage[ 0 ].subtype && 'svg+xml' === mediaImage[ 0 ].subtype && (
																	<Fragment>
																		<h2>{ __( 'SVG Hover Color' ) }</h2>
																		<ColorPalette
																			value={ mediaIcon[ 0 ].hoverColor }
																			onChange={ value => saveMediaIcon( { hoverColor: value } ) }
																		/>
																		<small>{ __( '*you must force inline svg for this to have effect.' ) }</small>
																	</Fragment>
																) }
																<h2>{ __( 'Image Hover Background' ) }</h2>
																<ColorPalette
																	value={ mediaStyle[ 0 ].hoverBackground }
																	onChange={ value => saveMediaStyle( { hoverBackground: value } ) }
																/>
																<h2>{ __( 'Image Hover Border' ) }</h2>
																<ColorPalette
																	value={ mediaStyle[ 0 ].hoverBorder }
																	onChange={ value => saveMediaStyle( { hoverBorder: value } ) }
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																{ mediaImage[ 0 ].subtype && 'svg+xml' === mediaImage[ 0 ].subtype && (
																	<Fragment>
																		<h2>{ __( 'SVG Color' ) }</h2>
																		<ColorPalette
																			value={ mediaIcon[ 0 ].color }
																			onChange={ value => saveMediaIcon( { color: value } ) }
																		/>
																		<small>{ __( '*you must force inline svg for this to have effect.' ) }</small>
																	</Fragment>
																) }
																<h2>{ __( 'Image Background' ) }</h2>
																<ColorPalette
																	value={ mediaStyle[ 0 ].background }
																	onChange={ value => saveMediaStyle( { background: value } ) }
																/>
																<h2>{ __( 'Image Border' ) }</h2>
																<ColorPalette
																	value={ mediaStyle[ 0 ].border }
																	onChange={ value => saveMediaStyle( { border: value } ) }
																/>
															</Fragment>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
								</Fragment>
							) }
							{ ( undefined === infoConfig.mediaType || 'icon' === infoConfig.mediaType ) && (
								<Fragment>
									<IconControl
										value={ mediaIcon[ 0 ].icon }
										onChange={ value => saveMediaIcon( { icon: value } ) }
									/>
									<RangeControl
										label={ __( 'Icon Size' ) }
										value={ mediaIcon[ 0 ].size }
										onChange={ value => saveMediaIcon( { size: value } ) }
										min={ 5 }
										max={ 250 }
										step={ 1 }
									/>
									{ mediaIcon[ 0 ].icon && 'fe' === mediaIcon[ 0 ].icon.substring( 0, 2 ) && (
										<RangeControl
											label={ __( 'Icon Line Width' ) }
											value={ mediaIcon[ 0 ].width }
											onChange={ value => saveMediaIcon( { width: value } ) }
											step={ 0.5 }
											min={ 0.5 }
											max={ 4 }
										/>
									) }
									<MeasurementControls
										label={ __( 'Icon Border' ) }
										measurement={ mediaStyle[ 0 ].borderWidth }
										control={ mediaBorderControl }
										onChange={ ( value ) => saveMediaStyle( { borderWidth: value } ) }
										onControl={ ( value ) => this.setState( { mediaBorderControl: value } ) }
										min={ 0 }
										max={ 40 }
										step={ 1 }
									/>
									<RangeControl
										label={ __( 'Icon Border Radius (px)' ) }
										value={ mediaStyle[ 0 ].borderRadius }
										onChange={ value => saveMediaStyle( { borderRadius: value } ) }
										step={ 1 }
										min={ 0 }
										max={ 200 }
									/>
									<SelectControl
										label={ __( 'Icon Hover Animation' ) }
										value={ mediaIcon[ 0 ].hoverAnimation }
										options={ [
											{ value: 'none', label: __( 'None' ) },
											{ value: 'drawborder', label: __( 'Border Spin In' ) },
											{ value: 'flip', label: __( 'Flip to Another Icon' ) },
										] }
										onChange={ value => saveMediaIcon( { hoverAnimation: value } ) }
									/>
									{ mediaIcon[ 0 ].hoverAnimation === 'flip' && (
										<IconControl
											value={ mediaIcon[ 0 ].flipIcon }
											onChange={ value => saveMediaIcon( { flipIcon: value } ) }
										/>
									) }
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
																<h2>{ __( 'Icon Hover Color' ) }</h2>
																<ColorPalette
																	value={ mediaIcon[ 0 ].hoverColor }
																	onChange={ value => saveMediaIcon( { hoverColor: value } ) }
																/>
																<h2>{ __( 'Icon Hover Background' ) }</h2>
																<ColorPalette
																	value={ mediaStyle[ 0 ].hoverBackground }
																	onChange={ value => saveMediaStyle( { hoverBackground: value } ) }
																/>
																<h2>{ __( 'Icon Hover Border Color' ) }</h2>
																<ColorPalette
																	value={ mediaStyle[ 0 ].hoverBorder }
																	onChange={ value => saveMediaStyle( { hoverBorder: value } ) }
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																<h2>{ __( 'Icon Color' ) }</h2>
																<ColorPalette
																	value={ mediaIcon[ 0 ].color }
																	onChange={ value => saveMediaIcon( { color: value } ) }
																/>
																<h2>{ __( 'Icon Background' ) }</h2>
																<ColorPalette
																	value={ mediaStyle[ 0 ].background }
																	onChange={ value => saveMediaStyle( { background: value } ) }
																/>
																<h2>{ __( 'Icon Border Color' ) }</h2>
																<ColorPalette
																	value={ mediaStyle[ 0 ].border }
																	onChange={ value => saveMediaStyle( { border: value } ) }
																/>
															</Fragment>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
									<TextControl
										label={ __( 'Icon Title for Accessibility' ) }
										value={ mediaIcon[ 0 ].title }
										onChange={ value => saveMediaIcon( { title: value } ) }
									/>
								</Fragment>
							) }
							<MeasurementControls
								label={ __( 'Media Padding' ) }
								measurement={ mediaStyle[ 0 ].padding }
								control={ mediaPaddingControl }
								onChange={ ( value ) => saveMediaStyle( { padding: value } ) }
								onControl={ ( value ) => this.setState( { mediaPaddingControl: value } ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
							<MeasurementControls
								label={ __( 'Media Margin' ) }
								measurement={ mediaStyle[ 0 ].margin }
								control={ mediaMarginControl }
								onChange={ ( value ) => saveMediaStyle( { margin: value } ) }
								onControl={ ( value ) => this.setState( { mediaMarginControl: value } ) }
								min={ -200 }
								max={ 200 }
								step={ 1 }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Title Settings' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Show Title' ) }
								checked={ ( undefined !== infoConfig.displayTitle ? infoConfig.displayTitle : true ) }
								onChange={ ( value ) => this.saveConfigState( 'displayTitle', value ) }
							/>
							{ ( undefined === infoConfig.displayTitle || infoConfig.displayTitle ) && (
								<Fragment>
									<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
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
															<ColorPalette
																value={ ( undefined !== infoConfig.titleHoverColor ? infoConfig.titleHoverColor : '' ) }
																onChange={ value => this.saveConfigState( 'titleHoverColor', value ) }
															/>
														);
													} else {
														tabout = (
															<ColorPalette
																value={ ( undefined !== infoConfig.titleColor ? infoConfig.titleColor : '' ) }
																onChange={ value => this.saveConfigState( 'titleColor', value ) }
															/>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
									<TypographyControls
										tagLevel={ titleFont[ 0 ].level }
										onTagLevel={ ( value ) => saveTitleFont( { level: value } ) }
										fontSize={ titleFont[ 0 ].size }
										onFontSize={ ( value ) => saveTitleFont( { size: value } ) }
										fontSizeType={ titleFont[ 0 ].sizeType }
										onFontSizeType={ ( value ) => saveTitleFont( { sizeType: value } ) }
										lineHeight={ titleFont[ 0 ].lineHeight }
										onLineHeight={ ( value ) => saveTitleFont( { lineHeight: value } ) }
										lineHeightType={ titleFont[ 0 ].lineType }
										onLineHeightType={ ( value ) => saveTitleFont( { lineType: value } ) }
										letterSpacing={ titleFont[ 0 ].letterSpacing }
										onLetterSpacing={ ( value ) => saveTitleFont( { letterSpacing: value } ) }
										fontFamily={ titleFont[ 0 ].family }
										onFontFamily={ ( value ) => saveTitleFont( { family: value } ) }
										onFontChange={ ( select ) => {
											saveTitleFont( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => saveTitleFont( values ) }
										googleFont={ titleFont[ 0 ].google }
										onGoogleFont={ ( value ) => saveTitleFont( { google: value } ) }
										loadGoogleFont={ titleFont[ 0 ].loadGoogle }
										onLoadGoogleFont={ ( value ) => saveTitleFont( { loadGoogle: value } ) }
										fontVariant={ titleFont[ 0 ].variant }
										onFontVariant={ ( value ) => saveTitleFont( { variant: value } ) }
										fontWeight={ titleFont[ 0 ].weight }
										onFontWeight={ ( value ) => saveTitleFont( { weight: value } ) }
										fontStyle={ titleFont[ 0 ].style }
										onFontStyle={ ( value ) => saveTitleFont( { style: value } ) }
										fontSubset={ titleFont[ 0 ].subset }
										onFontSubset={ ( value ) => saveTitleFont( { subset: value } ) }
										padding={ titleFont[ 0 ].padding }
										onPadding={ ( value ) => saveTitleFont( { padding: value } ) }
										paddingControl={ titleFont[ 0 ].paddingControl }
										onPaddingControl={ ( value ) => saveTitleFont( { paddingControl: value } ) }
										margin={ titleFont[ 0 ].margin }
										onMargin={ ( value ) => saveTitleFont( { margin: value } ) }
										marginControl={ titleFont[ 0 ].marginControl }
										onMarginControl={ ( value ) => saveTitleFont( { marginControl: value } ) }
									/>
								</Fragment>
							) }
						</PanelBody>
						<PanelBody
							title={ __( 'Text Settings' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Show Text' ) }
								checked={ ( undefined !== infoConfig.displayText ? infoConfig.displayText : true ) }
								onChange={ ( value ) => this.saveConfigState( 'displayText', value ) }
							/>
							{ ( undefined === infoConfig.displayText || infoConfig.displayText ) && (
								<Fragment>
									<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
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
															<ColorPalette
																value={ ( undefined !== infoConfig.textHoverColor ? infoConfig.textHoverColor : '' ) }
																onChange={ value => this.saveConfigState( 'textHoverColor', value ) }
															/>
														);
													} else {
														tabout = (
															<ColorPalette
																value={ ( undefined !== infoConfig.textColor ? infoConfig.textColor : '#555555' ) }
																onChange={ value => this.saveConfigState( 'textColor', value ) }
															/>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
									<TypographyControls
										fontSize={ textFont[ 0 ].size }
										onFontSize={ ( value ) => saveTextFont( { size: value } ) }
										fontSizeType={ textFont[ 0 ].sizeType }
										onFontSizeType={ ( value ) => saveTextFont( { sizeType: value } ) }
										lineHeight={ textFont[ 0 ].lineHeight }
										onLineHeight={ ( value ) => saveTextFont( { lineHeight: value } ) }
										lineHeightType={ textFont[ 0 ].lineType }
										onLineHeightType={ ( value ) => saveTextFont( { lineType: value } ) }
										letterSpacing={ textFont[ 0 ].letterSpacing }
										onLetterSpacing={ ( value ) => saveTextFont( { letterSpacing: value } ) }
										fontFamily={ textFont[ 0 ].family }
										onFontFamily={ ( value ) => saveTextFont( { family: value } ) }
										onFontChange={ ( select ) => {
											saveTextFont( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => saveTextFont( values ) }
										googleFont={ textFont[ 0 ].google }
										onGoogleFont={ ( value ) => saveTextFont( { google: value } ) }
										loadGoogleFont={ textFont[ 0 ].loadGoogle }
										onLoadGoogleFont={ ( value ) => saveTextFont( { loadGoogle: value } ) }
										fontVariant={ textFont[ 0 ].variant }
										onFontVariant={ ( value ) => saveTextFont( { variant: value } ) }
										fontWeight={ textFont[ 0 ].weight }
										onFontWeight={ ( value ) => saveTextFont( { weight: value } ) }
										fontStyle={ textFont[ 0 ].style }
										onFontStyle={ ( value ) => saveTextFont( { style: value } ) }
										fontSubset={ textFont[ 0 ].subset }
										onFontSubset={ ( value ) => saveTextFont( { subset: value } ) }
									/>
								</Fragment>
							) }
						</PanelBody>
						<PanelBody
							title={ __( 'Learn More Settings' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Show Learn More' ) }
								checked={ ( undefined !== infoConfig.displayLearnMore ? infoConfig.displayLearnMore : false ) }
								onChange={ ( value ) => this.saveConfigState( 'displayLearnMore', value ) }
							/>
							{ ( undefined === infoConfig.displayLearnMore || infoConfig.displayLearnMore ) && (
								<Fragment>
									<h2 className="kt-tab-wrap-title">{ __( 'Color Settings' ) }</h2>
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
																<h2>{ __( 'HOVER: Learn More Color' ) }</h2>
																<ColorPalette
																	value={ learnMoreStyles[ 0 ].colorHover }
																	onChange={ value => saveLearnMoreStyles( { colorHover: value } ) }
																/>
																<h2>{ __( 'HOVER: Learn More Background' ) }</h2>
																<ColorPalette
																	value={ learnMoreStyles[ 0 ].backgroundHover }
																	onChange={ value => saveLearnMoreStyles( { backgroundHover: value } ) }
																/>
																<h2>{ __( 'HOVER: Learn More Border Color' ) }</h2>
																<ColorPalette
																	value={ learnMoreStyles[ 0 ].borderHover }
																	onChange={ value => saveLearnMoreStyles( { borderHover: value } ) }
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																<h2>{ __( 'Learn More Color' ) }</h2>
																<ColorPalette
																	value={ learnMoreStyles[ 0 ].color }
																	onChange={ value => saveLearnMoreStyles( { color: value } ) }
																/>
																<h2>{ __( 'Learn More Background' ) }</h2>
																<ColorPalette
																	value={ learnMoreStyles[ 0 ].background }
																	onChange={ value => saveLearnMoreStyles( { background: value } ) }
																/>
																<h2>{ __( 'Learn More Border Color' ) }</h2>
																<ColorPalette
																	value={ learnMoreStyles[ 0 ].border }
																	onChange={ value => saveLearnMoreStyles( { border: value } ) }
																/>
															</Fragment>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
									<MeasurementControls
										label={ __( 'Learn More Border Width (px)' ) }
										measurement={ learnMoreStyles[ 0 ].borderWidth }
										control={ learnMoreStyles[ 0 ].borderControl }
										onChange={ ( value ) => saveLearnMoreStyles( { borderWidth: value } ) }
										onControl={ ( value ) => saveLearnMoreStyles( { borderControl: value } ) }
										min={ 0 }
										max={ 40 }
										step={ 1 }
									/>
									<RangeControl
										label={ __( 'Learn More Border Radius (px)' ) }
										value={ learnMoreStyles[ 0 ].borderRadius }
										onChange={ value => saveLearnMoreStyles( { borderRadius: value } ) }
										step={ 1 }
										min={ 0 }
										max={ 200 }
									/>
									<TypographyControls
										fontSize={ learnMoreStyles[ 0 ].size }
										onFontSize={ ( value ) => saveLearnMoreStyles( { size: value } ) }
										fontSizeType={ learnMoreStyles[ 0 ].sizeType }
										onFontSizeType={ ( value ) => saveLearnMoreStyles( { sizeType: value } ) }
										lineHeight={ learnMoreStyles[ 0 ].lineHeight }
										onLineHeight={ ( value ) => saveLearnMoreStyles( { lineHeight: value } ) }
										lineHeightType={ learnMoreStyles[ 0 ].lineType }
										onLineHeightType={ ( value ) => saveLearnMoreStyles( { lineType: value } ) }
										letterSpacing={ learnMoreStyles[ 0 ].letterSpacing }
										onLetterSpacing={ ( value ) => saveLearnMoreStyles( { letterSpacing: value } ) }
										fontFamily={ learnMoreStyles[ 0 ].family }
										onFontFamily={ ( value ) => saveLearnMoreStyles( { family: value } ) }
										onFontChange={ ( select ) => {
											saveLearnMoreStyles( {
												family: select.value,
												google: select.google,
											} );
										} }
										onFontArrayChange={ ( values ) => saveLearnMoreStyles( values ) }
										googleFont={ learnMoreStyles[ 0 ].google }
										onGoogleFont={ ( value ) => saveLearnMoreStyles( { google: value } ) }
										loadGoogleFont={ learnMoreStyles[ 0 ].loadGoogle }
										onLoadGoogleFont={ ( value ) => saveLearnMoreStyles( { loadGoogle: value } ) }
										fontVariant={ learnMoreStyles[ 0 ].variant }
										onFontVariant={ ( value ) => saveLearnMoreStyles( { variant: value } ) }
										fontWeight={ learnMoreStyles[ 0 ].weight }
										onFontWeight={ ( value ) => saveLearnMoreStyles( { weight: value } ) }
										fontStyle={ learnMoreStyles[ 0 ].style }
										onFontStyle={ ( value ) => saveLearnMoreStyles( { style: value } ) }
										fontSubset={ learnMoreStyles[ 0 ].subset }
										onFontSubset={ ( value ) => saveLearnMoreStyles( { subset: value } ) }
										padding={ learnMoreStyles[ 0 ].padding }
										onPadding={ ( value ) => saveLearnMoreStyles( { padding: value } ) }
										paddingControl={ learnMoreStyles[ 0 ].paddingControl }
										onPaddingControl={ ( value ) => saveLearnMoreStyles( { paddingControl: value } ) }
										margin={ learnMoreStyles[ 0 ].margin }
										onMargin={ ( value ) => saveLearnMoreStyles( { margin: value } ) }
										marginControl={ learnMoreStyles[ 0 ].marginControl }
										onMarginControl={ ( value ) => saveLearnMoreStyles( { marginControl: value } ) }
									/>
								</Fragment>
							) }
						</PanelBody>
						<PanelBody
							title={ __( 'Container Shadow' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Enable Shadow' ) }
								checked={ ( undefined !== infoConfig.displayShadow ? infoConfig.displayShadow : true ) }
								onChange={ value => this.saveConfigState( 'displayShadow', value ) }
							/>
							{ ( undefined === infoConfig.displayShadow || infoConfig.displayShadow ) && (
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
															<p className="kt-setting-label">{ __( 'Shadow Color' ) }</p>
															<ColorPalette
																value={ shadowHover[ 0 ].color }
																onChange={ value => saveHoverShadow( { color: value } ) }
															/>
															<RangeControl
																label={ __( 'Shadow Opacity' ) }
																value={ shadowHover[ 0 ].opacity }
																onChange={ value => saveHoverShadow( { opacity: value } ) }
																min={ 0 }
																max={ 1 }
																step={ 0.1 }
															/>
															<RangeControl
																label={ __( 'Shadow Blur' ) }
																value={ shadowHover[ 0 ].blur }
																onChange={ value => saveHoverShadow( { blur: value } ) }
																min={ 0 }
																max={ 100 }
																step={ 1 }
															/>
															<RangeControl
																label={ __( 'Shadow Spread' ) }
																value={ shadowHover[ 0 ].spread }
																onChange={ value => saveHoverShadow( { spread: value } ) }
																min={ -100 }
																max={ 100 }
																step={ 1 }
															/>
															<RangeControl
																label={ __( 'Shadow Vertical Offset' ) }
																value={ shadowHover[ 0 ].vOffset }
																onChange={ value => saveHoverShadow( { vOffset: value } ) }
																min={ -100 }
																max={ 100 }
																step={ 1 }
															/>
															<RangeControl
																label={ __( 'Shadow Horizontal Offset' ) }
																value={ shadowHover[ 0 ].hOffset }
																onChange={ value => saveHoverShadow( { hOffset: value } ) }
																min={ -100 }
																max={ 100 }
																step={ 1 }
															/>
														</Fragment>
													);
												} else {
													tabout = (
														<Fragment>
															<p className="kt-setting-label">{ __( 'Shadow Color' ) }</p>
															<ColorPalette
																value={ shadow[ 0 ].color }
																onChange={ value => saveShadow( { color: value } ) }
															/>
															<RangeControl
																label={ __( 'Shadow Opacity' ) }
																value={ shadow[ 0 ].opacity }
																onChange={ value => saveShadow( { opacity: value } ) }
																min={ 0 }
																max={ 1 }
																step={ 0.1 }
															/>
															<RangeControl
																label={ __( 'Shadow Blur' ) }
																value={ shadow[ 0 ].blur }
																onChange={ value => saveShadow( { blur: value } ) }
																min={ 0 }
																max={ 100 }
																step={ 1 }
															/>
															<RangeControl
																label={ __( 'Shadow Spread' ) }
																value={ shadow[ 0 ].spread }
																onChange={ value => saveShadow( { spread: value } ) }
																min={ -100 }
																max={ 100 }
																step={ 1 }
															/>
															<RangeControl
																label={ __( 'Shadow Vertical Offset' ) }
																value={ shadow[ 0 ].vOffset }
																onChange={ value => saveShadow( { vOffset: value } ) }
																min={ -100 }
																max={ 100 }
																step={ 1 }
															/>
															<RangeControl
																label={ __( 'Shadow Horizontal Offset' ) }
																value={ shadow[ 0 ].hOffset }
																onChange={ value => saveShadow( { hOffset: value } ) }
																min={ -100 }
																max={ 100 }
																step={ 1 }
															/>
														</Fragment>
													);
												}
											}
											return <div>{ tabout }</div>;
										}
									}
								</TabPanel>
							) }
						</PanelBody>
						<div className="kb-modal-footer">
							{ ! this.state.resetConfirm && (
								<Button className="kt-defaults-save" isDestructive disabled={ ( JSON.stringify( this.state.configuration[ 'kadence/infobox' ] ) === JSON.stringify( {} ) ? true : false ) } onClick={ () => {
									this.setState( { resetConfirm: true } );
								} }>
									{ __( 'Reset', 'kadence-blocks' ) }
								</Button>
							) }
							{ this.state.resetConfirm && (
								<Button className="kt-defaults-save" isDestructive onClick={ () => {
									this.clearAllDefaults();
									this.setState( { resetConfirm: false } );
								} }>
									{ __( 'Confirm Reset', 'kadence-blocks' ) }
								</Button>
							) }
							<Button className="kt-defaults-save" isPrimary onClick={ () => {
								this.saveConfig( 'kadence/infobox', headingConfig );
							} }>
								{ __( 'Save/Close', 'kadence-blocks' ) }
							</Button>
						</div>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceInfoBoxDefault;
