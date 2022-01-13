import TypographyControls from '../../components/typography/typography-control';
import map from 'lodash/map';
import BoxShadowControl from '../../components/common/box-shadow-control';
import IconControl from '../../components/icons/icon-control';
import PopColorControl from '../../components/color/pop-color-control';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	Button,
	TabPanel,
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
	ToggleControl,
	ButtonGroup,
	Dashicon,
	Modal,
} = wp.components;

import icons from '../../icons';

class KadenceButtonDefault extends Component {
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
		if ( config[ 'kadence/advancedbtn' ] === undefined || config[ 'kadence/advancedbtn' ].length == 0 ) {
			config[ 'kadence/advancedbtn' ] = {};
		}
		config[ 'kadence/advancedbtn' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	clearDefaults( key ) {
		const config = this.state.configuration;
		if ( config[ 'kadence/advancedbtn' ] === undefined || config[ 'kadence/advancedbtn' ].length == 0 ) {
			config[ 'kadence/advancedbtn' ] = {};
		}
		if ( undefined !== config[ 'kadence/advancedbtn' ][ key ] ) {
			delete config[ 'kadence/advancedbtn' ][ key ];
		}
		this.setState( { configuration: config } );
	}
	clearAllDefaults() {
		const config = this.state.configuration;
		config[ 'kadence/advancedbtn' ] = {};
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen } = this.state;
		const buttonConfig = ( configuration && configuration[ 'kadence/advancedbtn' ] ? configuration[ 'kadence/advancedbtn' ] : {} );
		const btnDefaultStyles = [ {
			text: '',
			link: '',
			target: '_self',
			size: '',
			paddingBT: '',
			paddingLR: '',
			color: '#555555',
			background: '',
			border: '#555555',
			backgroundOpacity: 1,
			borderOpacity: 1,
			borderRadius: '',
			borderWidth: '',
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
			gap: 5,
			responsiveSize: [ '', '' ],
			gradient: [ '#999999', 1, 0, 100, 'linear', 180, 'center center' ],
			gradientHover: [ '#777777', 1, 0, 100, 'linear', 180, 'center center' ],
			btnStyle: 'basic',
			btnSize: 'standard',
			backgroundType: 'solid',
			backgroundHoverType: 'solid',
			width: [ '', '', '' ],
			responsivePaddingBT: [ '', '' ],
			responsivePaddingLR: [ '', '' ],
			boxShadow: [ false, '#000000', 0.2, 1, 1, 2, 0, false ],
			boxShadowHover: [ false, '#000000', 0.4, 2, 2, 3, 0, false ],
		} ];
		const btns = ( undefined !== buttonConfig.btns && buttonConfig.btns[ 0 ] ? buttonConfig.btns : btnDefaultStyles );
		const btnSizes = [
			{ key: 'small', name: __( 'S' ) },
			{ key: 'standard', name: __( 'M' ) },
			{ key: 'large', name: __( 'L' ) },
			{ key: 'custom', name: <Dashicon icon="admin-generic" /> },
		];
		const btnWidths = [
			{ key: 'auto', name: __( 'Auto' ) },
			{ key: 'fixed', name: __( 'Fixed' ) },
			{ key: 'full', name: __( 'Full' ) },
		];
		const gradTypes = [
			{ key: 'linear', name: __( 'Linear' ) },
			{ key: 'radial', name: __( 'Radial' ) },
		];
		const bgType = [
			{ key: 'solid', name: __( 'Solid' ) },
			{ key: 'gradient', name: __( 'Gradient' ) },
		];
		const saveBtnArray = ( value ) => {
			const newUpdate = btns.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'btns', newUpdate );
		};
		const defineWidthType = ( type ) => {
			if ( 'full' === type ) {
				this.saveConfigState( 'forceFullwidth', true );
				this.saveConfigState( 'widthType', type );
			} else {
				this.saveConfigState( 'forceFullwidth', false );
				this.saveConfigState( 'widthType', type );
			}
		};
		const defineWidthTypeToggle = ( value ) => {
			if ( value ) {
				this.saveConfigState( 'forceFullwidth', true )
				this.saveConfigState( 'widthType', 'full' );
			} else {
				this.saveConfigState( 'forceFullwidth', false )
				this.saveConfigState( 'widthType', 'full' );
			}
		};
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
							<h2 className="kt-heading-size-title">{ __( 'Text Size' ) }</h2>
							<TabPanel className="kt-size-tabs"
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
												tabout = (
													<RangeControl
														className="btn-text-size-range"
														beforeIcon="editor-textcolor"
														afterIcon="editor-textcolor"
														value={ ( undefined !== btns[ 0 ].responsiveSize && undefined !== btns[ 0 ].responsiveSize[ 1 ] ? btns[ 0 ].responsiveSize[ 1 ] : '' ) }
														onChange={ value => {
															saveBtnArray( { responsiveSize: [ ( undefined !== btns[ 0 ].responsiveSize && undefined !== btns[ 0 ].responsiveSize[ 0 ] ? btns[ 0 ].responsiveSize[ 0 ] : '' ), value ] } );
														} }
														min={ 4 }
														max={ 100 }
													/>
												);
											} else if ( 'tablet' === tab.name ) {
												tabout = (
													<RangeControl
														className="btn-text-size-range"
														beforeIcon="editor-textcolor"
														afterIcon="editor-textcolor"
														value={ ( undefined !== btns[ 0 ].responsiveSize && undefined !== btns[ 0 ].responsiveSize[ 0 ] ? btns[ 0 ].responsiveSize[ 0 ] : '' ) }
														onChange={ value => {
															saveBtnArray( { responsiveSize: [ value, ( undefined !== btns[ 0 ].responsiveSize && undefined !== btns[ 0 ].responsiveSize[ 1 ] ? btns[ 0 ].responsiveSize[ 1 ] : '' ) ] } );
														} }
														min={ 4 }
														max={ 100 }
													/>
												);
											} else {
												tabout = (
													<RangeControl
														className="btn-text-size-range"
														beforeIcon="editor-textcolor"
														afterIcon="editor-textcolor"
														value={ btns[ 0 ].size }
														onChange={ value => {
															saveBtnArray( { size: value } );
														} }
														min={ 4 }
														max={ 100 }
													/>
												);
											}
										}
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
							<div className="kt-btn-size-settings-container">
								<h2 className="kt-beside-btn-group">{ __( 'Button Size' ) }</h2>
								<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Button Size' ) }>
									{ map( btnSizes, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-btn-size-btn"
											isSmall
											isPrimary={ btns[ 0 ].btnSize === key }
											aria-pressed={ btns[ 0 ].btnSize === key }
											onClick={ () => saveBtnArray( { btnSize: key } ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							{ 'custom' === btns[ 0 ].btnSize && (
								<div className="kt-inner-sub-section">
									<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Padding' ) }</h2>
									<TabPanel className="kt-size-tabs"
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
														tabout = (
															<Fragment>
																<RangeControl
																	label={ __( 'Top and Bottom Padding' ) }
																	value={ ( undefined !== btns[ 0 ].responsivePaddingBT && undefined !== btns[ 0 ].responsivePaddingBT[ 1 ] ? btns[ 0 ].responsivePaddingBT[ 1 ] : '' ) }
																	onChange={ value => {
																		saveBtnArray( { responsivePaddingBT: [ ( undefined !== btns[ 0 ].responsivePaddingBT && undefined !== btns[ 0 ].responsivePaddingBT[ 0 ] ? btns[ 0 ].responsivePaddingBT[ 0 ] : '' ), value ] } );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<RangeControl
																	label={ __( 'Left and Right Padding' ) }
																	value={ ( undefined !== btns[ 0 ].responsivePaddingLR && undefined !== btns[ 0 ].responsivePaddingLR[ 1 ] ? btns[ 0 ].responsivePaddingLR[ 1 ] : '' ) }
																	onChange={ value => {
																		saveBtnArray( { responsivePaddingLR: [ ( undefined !== btns[ 0 ].responsivePaddingLR && undefined !== btns[ 0 ].responsivePaddingLR[ 0 ] ? btns[ 0 ].responsivePaddingLR[ 0 ] : '' ), value ] } );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
															</Fragment>
														);
													} else if ( 'tablet' === tab.name ) {
														tabout = (
															<Fragment>
																<RangeControl
																	label={ __( 'Top and Bottom Padding' ) }
																	value={ ( undefined !== btns[ 0 ].responsivePaddingBT && undefined !== btns[ 0 ].responsivePaddingBT[ 0 ] ? btns[ 0 ].responsivePaddingBT[ 0 ] : '' ) }
																	onChange={ value => {
																		saveBtnArray( { responsivePaddingBT: [ value, ( undefined !== btns[ 0 ].responsivePaddingBT && undefined !== btns[ 0 ].responsivePaddingBT[ 1 ] ? btns[ 0 ].responsivePaddingBT[ 1 ] : '' ) ] } );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<RangeControl
																	label={ __( 'Left and Right Padding' ) }
																	value={ ( undefined !== btns[ 0 ].responsivePaddingLR && undefined !== btns[ 0 ].responsivePaddingLR[ 0 ] ? btns[ 0 ].responsivePaddingLR[ 0 ] : '' ) }
																	onChange={ value => {
																		saveBtnArray( { responsivePaddingLR: [ value, ( undefined !== btns[ 0 ].responsivePaddingLR && undefined !== btns[ 0 ].responsivePaddingLR[ 1 ] ? btns[ 0 ].responsivePaddingLR[ 1 ] : '' ) ] } );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
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
															</Fragment>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
								</div>
							) }
							<div className="kt-btn-size-settings-container">
								<h2 className="kt-beside-btn-group">{ __( 'Button Width' ) }</h2>
								<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Button Width' ) }>
									{ map( btnWidths, ( { name, key } ) => (
										<Button
											key={ key }
											className="kt-btn-size-btn"
											isSmall
											isPrimary={ buttonConfig.widthType === key }
											aria-pressed={ buttonConfig.widthType === key }
											onClick={ () => defineWidthType( key ) }
										>
											{ name }
										</Button>
									) ) }
								</ButtonGroup>
							</div>
							{ 'fixed' === buttonConfig.widthType && (
								<div className="kt-inner-sub-section">
									<h2 className="kt-heading-size-title kt-secondary-color-size">{ __( 'Fixed Width' ) }</h2>
									<TabPanel className="kt-size-tabs"
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
														tabout = (
															<Fragment>
																<RangeControl
																	value={ ( btns[ 0 ].width && undefined !== btns[ 0 ].width[ 2 ] ? btns[ 0 ].width[ 2 ] : undefined ) }
																	onChange={ value => {
																		saveBtnArray( { width: [ ( undefined !== btns[ 0 ].width && undefined !== btns[ 0 ].width[ 0 ] ? btns[ 0 ].width[ 0 ] : '' ), ( undefined !== btns[ 0 ].width && undefined !== btns[ 0 ].width[ 1 ] ? btns[ 0 ].width[ 1 ] : '' ), value ] } );
																	} }
																	min={ 10 }
																	max={ 500 }
																/>
															</Fragment>
														);
													} else if ( 'tablet' === tab.name ) {
														tabout = (
															<Fragment>
																<RangeControl
																	value={ ( btns[ 0 ].width && undefined !== btns[ 0 ].width[ 1 ] ? btns[ 0 ].width[ 1 ] : undefined ) }
																	onChange={ value => {
																		saveBtnArray( { width: [ ( undefined !== btns[ 0 ].width && undefined !== btns[ 0 ].width[ 0 ] ? btns[ 0 ].width[ 0 ] : '' ), value, ( undefined !== btns[ 0 ].width && undefined !== btns[ 0 ].width[ 2 ] ? btns[ 0 ].width[ 2 ] : '' ) ] } );
																	} }
																	min={ 10 }
																	max={ 500 }
																/>
															</Fragment>
														);
													} else {
														tabout = (
															<Fragment>
																<RangeControl
																	value={ ( btns[ 0 ].width && undefined !== btns[ 0 ].width[ 0 ] ? btns[ 0 ].width[ 0 ] : undefined ) }
																	onChange={ value => {
																		saveBtnArray( { width: [ value, ( undefined !== btns[ 0 ].width && undefined !== btns[ 0 ].width[ 1 ] ? btns[ 0 ].width[ 1 ] : '' ), ( undefined !== btns[ 0 ].width && undefined !== btns[ 0 ].width[ 2 ] ? btns[ 0 ].width[ 2 ] : '' ) ] } );
																	} }
																	min={ 10 }
																	max={ 500 }
																/>
															</Fragment>
														);
													}
												}
												return <div>{ tabout }</div>;
											}
										}
									</TabPanel>
								</div>
							) }
						</PanelBody>
						<PanelBody
							title={ __( 'Design Settings' ) }
							initialOpen={ false }
						>
							<h2 className="kt-tab-wrap-title kt-color-settings-title">{ __( 'Color Settings' ) }</h2>
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
														<PopColorControl
															label={ __( 'Hover Text Color' ) }
															value={ ( btns[ 0 ].colorHover ? btns[ 0 ].colorHover : '#ffffff' ) }
															default={ '#ffffff' }
															onChange={ value => {
																saveBtnArray( { colorHover: value } );
															} }
														/>
														<div className="kt-btn-size-settings-container">
															<h2 className="kt-beside-btn-group">{ __( 'Background Type' ) }</h2>
															<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Background Type' ) }>
																{ map( bgType, ( { name, key } ) => (
																	<Button
																		key={ key }
																		className="kt-btn-size-btn"
																		isSmall
																		isPrimary={ ( undefined !== btns[ 0 ].backgroundHoverType ? btns[ 0 ].backgroundHoverType : 'solid' ) === key }
																		aria-pressed={ ( undefined !== btns[ 0 ].backgroundHoverType ? btns[ 0 ].backgroundHoverType : 'solid' ) === key }
																		onClick={ () => saveBtnArray( { backgroundHoverType: key } ) }
																	>
																		{ name }
																	</Button>
																) ) }
															</ButtonGroup>
														</div>
														{ 'gradient' !== btns[ 0 ].backgroundHoverType && (
															<div className="kt-inner-sub-section">
																<PopColorControl
																	label={ __( 'Background Color' ) }
																	value={ ( btns[ 0 ].backgroundHover ? btns[ 0 ].backgroundHover : '#444444' ) }
																	default={ '#444444' }
																	opacityValue={ btns[ 0 ].backgroundHoverOpacity }
																	onChange={ value => {
																		saveBtnArray( { backgroundHover: value } );
																	} }
																	onOpacityChange={ value => {
																		saveBtnArray( { backgroundHoverOpacity: value } );
																	} }
																/>
															</div>
														) }
														{ 'gradient' === btns[ 0 ].backgroundHoverType && (
															<div className="kt-inner-sub-section">
																<PopColorControl
																	label={ __( 'Gradient Color 1' ) }
																	value={ ( btns[ 0 ].backgroundHover ? btns[ 0 ].backgroundHover : '#444444' ) }
																	default={ '#444444' }
																	opacityValue={ btns[ 0 ].backgroundHoverOpacity }
																	onChange={ value => {
																		saveBtnArray( { backgroundHover: value } );
																	} }
																	onOpacityChange={ value => {
																		saveBtnArray( { backgroundHoverOpacity: value } );
																	} }
																/>
																<RangeControl
																	label={ __( 'Location' ) }
																	value={ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 2 ] ? btns[ 0 ].gradientHover[ 2 ] : 0 ) }
																	onChange={ ( value ) => {
																		saveBtnArray( { gradientHover: [ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 0 ] ? btns[ 0 ].gradientHover[ 0 ] : '#777777' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 1 ] ? btns[ 0 ].gradientHover[ 1 ] : 1 ), value, ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 3 ] ? btns[ 0 ].gradientHover[ 3 ] : 100 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 5 ] ? btns[ 0 ].gradientHover[ 5 ] : 180 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 6 ] ? btns[ 0 ].gradientHover[ 6 ] : 'center center' ) ] } );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<PopColorControl
																	label={ __( 'Gradient Color 2' ) }
																	value={ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 0 ] ? btns[ 0 ].gradientHover[ 0 ] : '#777777' ) }
																	default={ '#777777' }
																	opacityValue={ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 1 ] ? btns[ 0 ].gradientHover[ 1 ] : 1 ) }
																	onChange={ value => {
																		saveBtnArray( { gradientHover: [ value, ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 1 ] ? btns[ 0 ].gradientHover[ 1 ] : 1 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 2 ] ? btns[ 0 ].gradientHover[ 2 ] : 0 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 3 ] ? btns[ 0 ].gradientHover[ 3 ] : 100 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 5 ] ? btns[ 0 ].gradientHover[ 5 ] : 180 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 6 ] ? btns[ 0 ].gradientHover[ 6 ] : 'center center' ) ] } );
																	} }
																	onOpacityChange={ value => {
																		saveBtnArray( { gradientHover: [ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 0 ] ? btns[ 0 ].gradientHover[ 0 ] : '#777777' ), value, ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 2 ] ? btns[ 0 ].gradientHover[ 2 ] : 0 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 3 ] ? btns[ 0 ].gradientHover[ 3 ] : 100 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 5 ] ? btns[ 0 ].gradientHover[ 5 ] : 180 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 6 ] ? btns[ 0 ].gradientHover[ 6 ] : 'center center' ) ] } );
																	} }
																/>
																<RangeControl
																	label={ __( 'Location' ) }
																	value={ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 3 ] ? btns[ 0 ].gradientHover[ 3 ] : 100 ) }
																	onChange={ ( value ) => {
																		saveBtnArray( { gradientHover: [ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 0 ] ? btns[ 0 ].gradientHover[ 0 ] : '#777777' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 1 ] ? btns[ 0 ].gradientHover[ 1 ] : 1 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 2 ] ? btns[ 0 ].gradientHover[ 2 ] : 0 ), value, ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 5 ] ? btns[ 0 ].gradientHover[ 5 ] : 180 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 6 ] ? btns[ 0 ].gradientHover[ 6 ] : 'center center' ) ] } );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<div className="kt-btn-size-settings-container">
																	<h2 className="kt-beside-btn-group">{ __( 'Gradient Type' ) }</h2>
																	<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Gradient Type' ) }>
																		{ map( gradTypes, ( { name, key } ) => (
																			<Button
																				key={ key }
																				className="kt-btn-size-btn"
																				isSmall
																				isPrimary={ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ) === key }
																				aria-pressed={ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ) === key }
																				onClick={ () => {
																					saveBtnArray( { gradientHover: [ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 0 ] ? btns[ 0 ].gradientHover[ 0 ] : '#777777' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 1 ] ? btns[ 0 ].gradientHover[ 1 ] : 1 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 2 ] ? btns[ 0 ].gradientHover[ 2 ] : 0 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 3 ] ? btns[ 0 ].gradientHover[ 3 ] : 100 ), key, ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 5 ] ? btns[ 0 ].gradientHover[ 5 ] : 180 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 6 ] ? btns[ 0 ].gradientHover[ 6 ] : 'center center' ) ] } );
																				} }
																			>
																				{ name }
																			</Button>
																		) ) }
																	</ButtonGroup>
																</div>
																{ 'radial' !== ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ) && (
																	<RangeControl
																		label={ __( 'Gradient Angle' ) }
																		value={ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 5 ] ? btns[ 0 ].gradientHover[ 5 ] : 180 ) }
																		onChange={ ( value ) => {
																			saveBtnArray( { gradientHover: [ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 0 ] ? btns[ 0 ].gradientHover[ 0 ] : '#777777' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 1 ] ? btns[ 0 ].gradientHover[ 1 ] : 1 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 2 ] ? btns[ 0 ].gradientHover[ 2 ] : 0 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 3 ] ? btns[ 0 ].gradientHover[ 3 ] : 100 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ), value, ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 6 ] ? btns[ 0 ].gradientHover[ 6 ] : 'center center' ) ] } );
																		} }
																		min={ 0 }
																		max={ 360 }
																	/>
																) }
																{ 'radial' === ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ) && (
																	<SelectControl
																		label={ __( 'Gradient Position' ) }
																		value={ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 6 ] ? btns[ 0 ].gradientHover[ 6 ] : 'center center' ) }
																		options={ [
																			{ value: 'center top', label: __( 'Center Top' ) },
																			{ value: 'center center', label: __( 'Center Center' ) },
																			{ value: 'center bottom', label: __( 'Center Bottom' ) },
																			{ value: 'left top', label: __( 'Left Top' ) },
																			{ value: 'left center', label: __( 'Left Center' ) },
																			{ value: 'left bottom', label: __( 'Left Bottom' ) },
																			{ value: 'right top', label: __( 'Right Top' ) },
																			{ value: 'right center', label: __( 'Right Center' ) },
																			{ value: 'right bottom', label: __( 'Right Bottom' ) },
																		] }
																		onChange={ value => {
																			saveBtnArray( { gradientHover: [ ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 0 ] ? btns[ 0 ].gradientHover[ 0 ] : '#777777' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 1 ] ? btns[ 0 ].gradientHover[ 1 ] : 1 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 2 ] ? btns[ 0 ].gradientHover[ 2 ] : 0 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 3 ] ? btns[ 0 ].gradientHover[ 3 ] : 100 ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 4 ] ? btns[ 0 ].gradientHover[ 4 ] : 'linear' ), ( btns[ 0 ].gradientHover && undefined !== btns[ 0 ].gradientHover[ 5 ] ? btns[ 0 ].gradientHover[ 5 ] : 180 ), value ] } );
																		} }
																	/>
																) }
															</div>
														) }
														<PopColorControl
															label={ __( 'Hover Border Color' ) }
															value={ ( btns[ 0 ].borderHover ? btns[ 0 ].borderHover : '#444444' ) }
															default={ '#444444' }
															opacityValue={ btns[ 0 ].borderHoverOpacity }
															onChange={ value => {
																saveBtnArray( { borderHover: value } );
															} }
															onOpacityChange={ value => {
																saveBtnArray( { borderHoverOpacity: value } );
															} }
														/>
														<BoxShadowControl
															label={ __( 'Hover Box Shadow' ) }
															enable={ ( undefined !== btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 0 ] ? btns[ 0 ].boxShadowHover[ 0 ] : false ) }
															color={ ( undefined !== btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 1 ] ? btns[ 0 ].boxShadowHover[ 1 ] : '#000000' ) }
															colorDefault={ '#000000' }
															onArrayChange={ ( color, opacity ) => {
																saveBtnArray( { boxShadowHover: [ ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 0 ] ? btns[ index ].boxShadowHover[ 0 ] : false ), color, opacity, ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 3 ] ? btns[ index ].boxShadowHover[ 3 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 4 ] ? btns[ index ].boxShadowHover[ 4 ] : 2 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 5 ] ? btns[ index ].boxShadowHover[ 5 ] : 3 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 6 ] ? btns[ index ].boxShadowHover[ 6 ] : 0 ), ( btns[ index ].boxShadowHover && undefined !== btns[ index ].boxShadowHover[ 7 ] ? btns[ index ].boxShadowHover[ 7 ] : false ) ] }, index );
															} }
															opacity={ ( undefined !== btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 2 ] ? btns[ 0 ].boxShadowHover[ 2 ] : 0.4 ) }
															hOffset={ ( undefined !== btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 3 ] ? btns[ 0 ].boxShadowHover[ 3 ] : 2 ) }
															vOffset={ ( undefined !== btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 4 ] ? btns[ 0 ].boxShadowHover[ 4 ] : 2 ) }
															blur={ ( undefined !== btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 5 ] ? btns[ 0 ].boxShadowHover[ 5 ] : 3 ) }
															spread={ ( undefined !== btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 6 ] ? btns[ 0 ].boxShadowHover[ 6 ] : 0 ) }
															inset={ ( undefined !== btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 7 ] ? btns[ 0 ].boxShadowHover[ 7 ] : false ) }
															onEnableChange={ value => {
																saveBtnArray( { boxShadowHover: [ value, ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 1 ] ? btns[ 0 ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 2 ] ? btns[ 0 ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 3 ] ? btns[ 0 ].boxShadowHover[ 3 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 4 ] ? btns[ 0 ].boxShadowHover[ 4 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 5 ] ? btns[ 0 ].boxShadowHover[ 5 ] : 3 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 6 ] ? btns[ 0 ].boxShadowHover[ 6 ] : 0 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 7 ] ? btns[ 0 ].boxShadowHover[ 7 ] : false ) ] } );
															} }
															onColorChange={ value => {
																saveBtnArray( { boxShadowHover: [ ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 0 ] ? btns[ 0 ].boxShadowHover[ 0 ] : false ), value, ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 2 ] ? btns[ 0 ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 3 ] ? btns[ 0 ].boxShadowHover[ 3 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 4 ] ? btns[ 0 ].boxShadowHover[ 4 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 5 ] ? btns[ 0 ].boxShadowHover[ 5 ] : 3 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 6 ] ? btns[ 0 ].boxShadowHover[ 6 ] : 0 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 7 ] ? btns[ 0 ].boxShadowHover[ 7 ] : false ) ] } );
															} }
															onOpacityChange={ value => {
																saveBtnArray( { boxShadowHover: [ ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 0 ] ? btns[ 0 ].boxShadowHover[ 0 ] : false ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 1 ] ? btns[ 0 ].boxShadowHover[ 1 ] : '#000000' ), value, ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 3 ] ? btns[ 0 ].boxShadowHover[ 3 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 4 ] ? btns[ 0 ].boxShadowHover[ 4 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 5 ] ? btns[ 0 ].boxShadowHover[ 5 ] : 3 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 6 ] ? btns[ 0 ].boxShadowHover[ 6 ] : 0 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 7 ] ? btns[ 0 ].boxShadowHover[ 7 ] : false ) ] } );
															} }
															onHOffsetChange={ value => {
																saveBtnArray( { boxShadowHover: [ ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 0 ] ? btns[ 0 ].boxShadowHover[ 0 ] : false ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 1 ] ? btns[ 0 ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 2 ] ? btns[ 0 ].boxShadowHover[ 2 ] : 0.4 ), value, ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 4 ] ? btns[ 0 ].boxShadowHover[ 4 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 5 ] ? btns[ 0 ].boxShadowHover[ 5 ] : 3 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 6 ] ? btns[ 0 ].boxShadowHover[ 6 ] : 0 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 7 ] ? btns[ 0 ].boxShadowHover[ 7 ] : false ) ] } );
															} }
															onVOffsetChange={ value => {
																saveBtnArray( { boxShadowHover: [ ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 0 ] ? btns[ 0 ].boxShadowHover[ 0 ] : false ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 1 ] ? btns[ 0 ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 2 ] ? btns[ 0 ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 3 ] ? btns[ 0 ].boxShadowHover[ 3 ] : 2 ), value, ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 5 ] ? btns[ 0 ].boxShadowHover[ 5 ] : 3 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 6 ] ? btns[ 0 ].boxShadowHover[ 6 ] : 0 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 7 ] ? btns[ 0 ].boxShadowHover[ 7 ] : false ) ] } );
															} }
															onBlurChange={ value => {
																saveBtnArray( { boxShadowHover: [ ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 0 ] ? btns[ 0 ].boxShadowHover[ 0 ] : false ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 1 ] ? btns[ 0 ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 2 ] ? btns[ 0 ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 3 ] ? btns[ 0 ].boxShadowHover[ 3 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 4 ] ? btns[ 0 ].boxShadowHover[ 4 ] : 2 ), value, ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 6 ] ? btns[ 0 ].boxShadowHover[ 6 ] : 0 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 7 ] ? btns[ 0 ].boxShadowHover[ 7 ] : false ) ] } );
															} }
															onSpreadChange={ value => {
																saveBtnArray( { boxShadowHover: [ ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 0 ] ? btns[ 0 ].boxShadowHover[ 0 ] : false ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 1 ] ? btns[ 0 ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 2 ] ? btns[ 0 ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 3 ] ? btns[ 0 ].boxShadowHover[ 3 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 4 ] ? btns[ 0 ].boxShadowHover[ 4 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 5 ] ? btns[ 0 ].boxShadowHover[ 5 ] : 3 ), value, ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 7 ] ? btns[ 0 ].boxShadowHover[ 7 ] : false ) ] } );
															} }
															onInsetChange={ value => {
																saveBtnArray( { boxShadowHover: [ ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 0 ] ? btns[ 0 ].boxShadowHover[ 0 ] : false ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 1 ] ? btns[ 0 ].boxShadowHover[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 2 ] ? btns[ 0 ].boxShadowHover[ 2 ] : 0.4 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 3 ] ? btns[ 0 ].boxShadowHover[ 3 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 4 ] ? btns[ 0 ].boxShadowHover[ 4 ] : 2 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 5 ] ? btns[ 0 ].boxShadowHover[ 5 ] : 3 ), ( btns[ 0 ].boxShadowHover && undefined !== btns[ 0 ].boxShadowHover[ 6 ] ? btns[ 0 ].boxShadowHover[ 6 ] : 0 ), value ] } );
															} }
														/>
													</Fragment>
												);
											} else {
												tabout = (
													<Fragment>
														<PopColorControl
															label={ __( 'Text Color' ) }
															value={ btns[ 0 ].color }
															default={ '#555555' }
															onChange={ value => {
																saveBtnArray( { color: value } );
															} }
														/>
														<div className="kt-btn-size-settings-container">
															<h2 className="kt-beside-btn-group">{ __( 'Background Type' ) }</h2>
															<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Background Type' ) }>
																{ map( bgType, ( { name, key } ) => (
																	<Button
																		key={ key }
																		className="kt-btn-size-btn"
																		isSmall
																		isPrimary={ ( undefined !== btns[ 0 ].backgroundType ? btns[ 0 ].backgroundType : 'solid' ) === key }
																		aria-pressed={ ( undefined !== btns[ 0 ].backgroundType ? btns[ 0 ].backgroundType : 'solid' ) === key }
																		onClick={ () => saveBtnArray( { backgroundType: key } ) }
																	>
																		{ name }
																	</Button>
																) ) }
															</ButtonGroup>
														</div>
														{ 'gradient' !== btns[ 0 ].backgroundType && (
															<div className="kt-inner-sub-section">
																<PopColorControl
																	label={ __( 'Background Color' ) }
																	value={ btns[ 0 ].background }
																	default={ '' }
																	opacityValue={ btns[ 0 ].backgroundOpacity }
																	onChange={ value => {
																		saveBtnArray( { background: value } );
																	} }
																	onOpacityChange={ value => {
																		saveBtnArray( { backgroundOpacity: value } );
																	} }
																/>
															</div>
														) }
														{ 'gradient' === btns[ 0 ].backgroundType && (
															<div className="kt-inner-sub-section">
																<PopColorControl
																	label={ __( 'Gradient Color 1' ) }
																	value={ btns[ 0 ].background }
																	default={ '' }
																	opacityValue={ btns[ 0 ].backgroundOpacity }
																	onChange={ value => {
																		saveBtnArray( { background: value } );
																	} }
																	onOpacityChange={ value => {
																		saveBtnArray( { backgroundOpacity: value } );
																	} }
																/>
																<RangeControl
																	label={ __( 'Location' ) }
																	value={ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 2 ] ? btns[ 0 ].gradient[ 2 ] : 0 ) }
																	onChange={ ( value ) => {
																		saveBtnArray( { gradient: [ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 0 ] ? btns[ 0 ].gradient[ 0 ] : '#999999' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 1 ] ? btns[ 0 ].gradient[ 1 ] : 1 ), value, ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 3 ] ? btns[ 0 ].gradient[ 3 ] : 100 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 5 ] ? btns[ 0 ].gradient[ 5 ] : 180 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 6 ] ? btns[ 0 ].gradient[ 6 ] : 'center center' ) ] } );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<PopColorControl
																	label={ __( 'Gradient Color 2' ) }
																	value={ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 0 ] ? btns[ 0 ].gradient[ 0 ] : '#999999' ) }
																	default={ '#999999' }
																	opacityValue={ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 1 ] ? btns[ 0 ].gradient[ 1 ] : 1 ) }
																	onChange={ value => {
																		saveBtnArray( { gradient: [ value, ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 1 ] ? btns[ 0 ].gradient[ 1 ] : 1 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 2 ] ? btns[ 0 ].gradient[ 2 ] : 0 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 3 ] ? btns[ 0 ].gradient[ 3 ] : 100 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 5 ] ? btns[ 0 ].gradient[ 5 ] : 180 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 6 ] ? btns[ 0 ].gradient[ 6 ] : 'center center' ) ] } );
																	} }
																	onOpacityChange={ value => {
																		saveBtnArray( { gradient: [ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 0 ] ? btns[ 0 ].gradient[ 0 ] : '#999999' ), value, ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 2 ] ? btns[ 0 ].gradient[ 2 ] : 0 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 3 ] ? btns[ 0 ].gradient[ 3 ] : 100 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 5 ] ? btns[ 0 ].gradient[ 5 ] : 180 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 6 ] ? btns[ 0 ].gradient[ 6 ] : 'center center' ) ] } );
																	} }
																/>
																<RangeControl
																	label={ __( 'Location' ) }
																	value={ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 3 ] ? btns[ 0 ].gradient[ 3 ] : 100 ) }
																	onChange={ ( value ) => {
																		saveBtnArray( { gradient: [ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 0 ] ? btns[ 0 ].gradient[ 0 ] : '#999999' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 1 ] ? btns[ 0 ].gradient[ 1 ] : 1 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 2 ] ? btns[ 0 ].gradient[ 2 ] : 0 ), value, ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 5 ] ? btns[ 0 ].gradient[ 5 ] : 180 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 6 ] ? btns[ 0 ].gradient[ 6 ] : 'center center' ) ] } );
																	} }
																	min={ 0 }
																	max={ 100 }
																/>
																<div className="kt-btn-size-settings-container">
																	<h2 className="kt-beside-btn-group">{ __( 'Gradient Type' ) }</h2>
																	<ButtonGroup className="kt-button-size-type-options" aria-label={ __( 'Gradient Type' ) }>
																		{ map( gradTypes, ( { name, key } ) => (
																			<Button
																				key={ key }
																				className="kt-btn-size-btn"
																				isSmall
																				isPrimary={ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ) === key }
																				aria-pressed={ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ) === key }
																				onClick={ () => {
																					saveBtnArray( { gradient: [ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 0 ] ? btns[ 0 ].gradient[ 0 ] : '#999999' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 1 ] ? btns[ 0 ].gradient[ 1 ] : 1 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 2 ] ? btns[ 0 ].gradient[ 2 ] : 0 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 3 ] ? btns[ 0 ].gradient[ 3 ] : 100 ), key, ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 5 ] ? btns[ 0 ].gradient[ 5 ] : 180 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 6 ] ? btns[ 0 ].gradient[ 6 ] : 'center center' ) ] } );
																				} }
																			>
																				{ name }
																			</Button>
																		) ) }
																	</ButtonGroup>
																</div>
																{ 'radial' !== ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ) && (
																	<RangeControl
																		label={ __( 'Gradient Angle' ) }
																		value={ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 5 ] ? btns[ 0 ].gradient[ 5 ] : 180 ) }
																		onChange={ ( value ) => {
																			saveBtnArray( { gradient: [ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 0 ] ? btns[ 0 ].gradient[ 0 ] : '#999999' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 1 ] ? btns[ 0 ].gradient[ 1 ] : 1 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 2 ] ? btns[ 0 ].gradient[ 2 ] : 0 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 3 ] ? btns[ 0 ].gradient[ 3 ] : 100 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ), value, ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 6 ] ? btns[ 0 ].gradient[ 6 ] : 'center center' ) ] } );
																		} }
																		min={ 0 }
																		max={ 360 }
																	/>
																) }
																{ 'radial' === ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ) && (
																	<SelectControl
																		label={ __( 'Gradient Position' ) }
																		value={ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 6 ] ? btns[ 0 ].gradient[ 6 ] : 'center center' ) }
																		options={ [
																			{ value: 'center top', label: __( 'Center Top' ) },
																			{ value: 'center center', label: __( 'Center Center' ) },
																			{ value: 'center bottom', label: __( 'Center Bottom' ) },
																			{ value: 'left top', label: __( 'Left Top' ) },
																			{ value: 'left center', label: __( 'Left Center' ) },
																			{ value: 'left bottom', label: __( 'Left Bottom' ) },
																			{ value: 'right top', label: __( 'Right Top' ) },
																			{ value: 'right center', label: __( 'Right Center' ) },
																			{ value: 'right bottom', label: __( 'Right Bottom' ) },
																		] }
																		onChange={ value => {
																			saveBtnArray( { gradient: [ ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 0 ] ? btns[ 0 ].gradient[ 0 ] : '#999999' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 1 ] ? btns[ 0 ].gradient[ 1 ] : 1 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 2 ] ? btns[ 0 ].gradient[ 2 ] : 0 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 3 ] ? btns[ 0 ].gradient[ 3 ] : 100 ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 4 ] ? btns[ 0 ].gradient[ 4 ] : 'linear' ), ( btns[ 0 ].gradient && undefined !== btns[ 0 ].gradient[ 5 ] ? btns[ 0 ].gradient[ 5 ] : 180 ), value ] } );
																		} }
																	/>
																) }
															</div>
														) }
														<PopColorControl
															label={ __( 'Border Color' ) }
															value={ ( btns[ 0 ].border ? btns[ 0 ].border : '#555555' ) }
															default={ '#555555' }
															opacityValue={ btns[ 0 ].borderOpacity }
															onChange={ value => {
																saveBtnArray( { border: value } );
															} }
															onOpacityChange={ value => {
																saveBtnArray( { borderOpacity: value } );
															} }
														/>
														<BoxShadowControl
															label={ __( 'Box Shadow' ) }
															enable={ ( undefined !== btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 0 ] ? btns[ 0 ].boxShadow[ 0 ] : false ) }
															color={ ( undefined !== btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 1 ] ? btns[ 0 ].boxShadow[ 1 ] : '#000000' ) }
															colorDefault={ '#000000' }
															onArrayChange={ ( color, opacity ) => {
																saveBtnArray( { boxShadow: [ ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 0 ] ? btns[ index ].boxShadow[ 0 ] : false ), color, opacity, ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 3 ] ? btns[ index ].boxShadow[ 3 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 4 ] ? btns[ index ].boxShadow[ 4 ] : 1 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 5 ] ? btns[ index ].boxShadow[ 5 ] : 2 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 6 ] ? btns[ index ].boxShadow[ 6 ] : 0 ), ( btns[ index ].boxShadow && undefined !== btns[ index ].boxShadow[ 7 ] ? btns[ index ].boxShadow[ 7 ] : false ) ] }, index );
															} }
															opacity={ ( undefined !== btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 2 ] ? btns[ 0 ].boxShadow[ 2 ] : 0.2 ) }
															hOffset={ ( undefined !== btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 3 ] ? btns[ 0 ].boxShadow[ 3 ] : 1 ) }
															vOffset={ ( undefined !== btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 4 ] ? btns[ 0 ].boxShadow[ 4 ] : 1 ) }
															blur={ ( undefined !== btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 5 ] ? btns[ 0 ].boxShadow[ 5 ] : 2 ) }
															spread={ ( undefined !== btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 6 ] ? btns[ 0 ].boxShadow[ 6 ] : 0 ) }
															inset={ ( undefined !== btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 7 ] ? btns[ 0 ].boxShadow[ 7 ] : false ) }
															onEnableChange={ value => {
																saveBtnArray( { boxShadow: [ value, ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 1 ] ? btns[ 0 ].boxShadow[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 2 ] ? btns[ 0 ].boxShadow[ 2 ] : 0.2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 3 ] ? btns[ 0 ].boxShadow[ 3 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 4 ] ? btns[ 0 ].boxShadow[ 4 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 5 ] ? btns[ 0 ].boxShadow[ 5 ] : 2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 6 ] ? btns[ 0 ].boxShadow[ 6 ] : 0 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 7 ] ? btns[ 0 ].boxShadow[ 7 ] : false ) ] } );
															} }
															onColorChange={ value => {
																saveBtnArray( { boxShadow: [ ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 0 ] ? btns[ 0 ].boxShadow[ 0 ] : false ), value, ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 2 ] ? btns[ 0 ].boxShadow[ 2 ] : 0.2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 3 ] ? btns[ 0 ].boxShadow[ 3 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 4 ] ? btns[ 0 ].boxShadow[ 4 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 5 ] ? btns[ 0 ].boxShadow[ 5 ] : 2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 6 ] ? btns[ 0 ].boxShadow[ 6 ] : 0 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 7 ] ? btns[ 0 ].boxShadow[ 7 ] : false ) ] } );
															} }
															onOpacityChange={ value => {
																saveBtnArray( { boxShadow: [ ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 0 ] ? btns[ 0 ].boxShadow[ 0 ] : false ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 1 ] ? btns[ 0 ].boxShadow[ 1 ] : '#000000' ), value, ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 3 ] ? btns[ 0 ].boxShadow[ 3 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 4 ] ? btns[ 0 ].boxShadow[ 4 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 5 ] ? btns[ 0 ].boxShadow[ 5 ] : 2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 6 ] ? btns[ 0 ].boxShadow[ 6 ] : 0 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 7 ] ? btns[ 0 ].boxShadow[ 7 ] : false ) ] } );
															} }
															onHOffsetChange={ value => {
																saveBtnArray( { boxShadow: [ ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 0 ] ? btns[ 0 ].boxShadow[ 0 ] : false ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 1 ] ? btns[ 0 ].boxShadow[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 2 ] ? btns[ 0 ].boxShadow[ 2 ] : 0.2 ), value, ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 4 ] ? btns[ 0 ].boxShadow[ 4 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 5 ] ? btns[ 0 ].boxShadow[ 5 ] : 2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 6 ] ? btns[ 0 ].boxShadow[ 6 ] : 0 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 7 ] ? btns[ 0 ].boxShadow[ 7 ] : false ) ] } );
															} }
															onVOffsetChange={ value => {
																saveBtnArray( { boxShadow: [ ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 0 ] ? btns[ 0 ].boxShadow[ 0 ] : false ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 1 ] ? btns[ 0 ].boxShadow[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 2 ] ? btns[ 0 ].boxShadow[ 2 ] : 0.2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 3 ] ? btns[ 0 ].boxShadow[ 3 ] : 1 ), value, ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 5 ] ? btns[ 0 ].boxShadow[ 5 ] : 2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 6 ] ? btns[ 0 ].boxShadow[ 6 ] : 0 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 7 ] ? btns[ 0 ].boxShadow[ 7 ] : false ) ] } );
															} }
															onBlurChange={ value => {
																saveBtnArray( { boxShadow: [ ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 0 ] ? btns[ 0 ].boxShadow[ 0 ] : false ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 1 ] ? btns[ 0 ].boxShadow[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 2 ] ? btns[ 0 ].boxShadow[ 2 ] : 0.2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 3 ] ? btns[ 0 ].boxShadow[ 3 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 4 ] ? btns[ 0 ].boxShadow[ 4 ] : 1 ), value, ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 6 ] ? btns[ 0 ].boxShadow[ 6 ] : 0 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 7 ] ? btns[ 0 ].boxShadow[ 7 ] : false ) ] } );
															} }
															onSpreadChange={ value => {
																saveBtnArray( { boxShadow: [ ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 0 ] ? btns[ 0 ].boxShadow[ 0 ] : false ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 1 ] ? btns[ 0 ].boxShadow[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 2 ] ? btns[ 0 ].boxShadow[ 2 ] : 0.2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 3 ] ? btns[ 0 ].boxShadow[ 3 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 4 ] ? btns[ 0 ].boxShadow[ 4 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 5 ] ? btns[ 0 ].boxShadow[ 5 ] : 2 ), value, ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 7 ] ? btns[ 0 ].boxShadow[ 7 ] : false ) ] } );
															} }
															onInsetChange={ value => {
																saveBtnArray( { boxShadow: [ ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 0 ] ? btns[ 0 ].boxShadow[ 0 ] : false ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 1 ] ? btns[ 0 ].boxShadow[ 1 ] : '#000000' ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 2 ] ? btns[ 0 ].boxShadow[ 2 ] : 0.2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 3 ] ? btns[ 0 ].boxShadow[ 3 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 4 ] ? btns[ 0 ].boxShadow[ 4 ] : 1 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 5 ] ? btns[ 0 ].boxShadow[ 5 ] : 2 ), ( btns[ 0 ].boxShadow && undefined !== btns[ 0 ].boxShadow[ 6 ] ? btns[ 0 ].boxShadow[ 6 ] : 0 ), value ] } );
															} }
														/>
													</Fragment>
												);
											}
										}
										return <div>{ tabout }</div>;
									}
								}
							</TabPanel>
							<RangeControl
								label={ __( 'Border Width' ) }
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
							title={ __( 'Icons Settings' ) }
							initialOpen={ false }
						>
							<h2 className="kt-tool">{ __( 'Icon Settings' ) }</h2>
							<IconControl
								value={ btns[ 0 ].icon }
								onChange={ value => {
									saveBtnArray( { icon: value } );
								} }
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
								textTransform={ ( undefined !== buttonConfig.textTransform ? buttonConfig.textTransform : '' ) }
								onTextTransform={ ( value ) => this.saveConfigState( 'textTransform', value ) }
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
						<div className="kb-modal-footer">
							{ ! this.state.resetConfirm && (
								<Button className="kt-defaults-save" isDestructive disabled={ ( JSON.stringify( this.state.configuration[ 'kadence/advancedbtn' ] ) === JSON.stringify( {} ) ? true : false ) } onClick={ () => {
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
								this.saveConfig( 'kadence/advancedbtn', buttonConfig );
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
export default KadenceButtonDefault;
