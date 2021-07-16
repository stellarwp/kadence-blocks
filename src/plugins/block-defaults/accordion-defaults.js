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
	PanelBody,
	TabPanel,
	Dashicon,
	ButtonGroup,
	SelectControl,
	Button,
	Tooltip,
	Modal,
} = wp.components;
import map from 'lodash/map';
import MeasurementControls from '../../measurement-control';
import TypographyControls from '../../components/typography/typography-control';
import BorderColorControls from '../../border-color-control';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import icons from '../../icons';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
class KadenceAccordionDefault extends Component {
	constructor() {
		super( ...arguments );
		this.saveConfig = this.saveConfig.bind( this );
		this.saveConfigState = this.saveConfigState.bind( this );
		this.state = {
			isOpen: false,
			isSaving: false,
			configuration: ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ),
			contentPaddingControl: 'linked',
			contentBorderRadiusControl: 'linked',
			contentBorderControl: 'linked',
			titleBorderControl: 'linked',
			titlePaddingControl: 'individual',
			titleBorderRadiusControl: 'linked',
			titleBorderColorControl: 'linked',
			titleBorderHoverColorControl: 'linked',
			titleBorderActiveColorControl: 'linked',
			titleTag: 'div',
		};
	}
	componentDidMount() {
		const accordionConfig = ( this.state.configuration && this.state.configuration[ 'kadence/accordion' ] ? this.state.configuration[ 'kadence/accordion' ] : {} );
		if ( accordionConfig.titleStyles && accordionConfig.titleStyles[ 0 ] ) {
			if ( accordionConfig.titleStyles[ 0 ].padding[ 0 ] === accordionConfig.titleStyles[ 0 ].padding[ 1 ] && accordionConfig.titleStyles[ 0 ].padding[ 0 ] === accordionConfig.titleStyles[ 0 ].padding[ 2 ] && accordionConfig.titleStyles[ 0 ].padding[ 0 ] === accordionConfig.titleStyles[ 0 ].padding[ 3 ] ) {
				this.setState( { titlePaddingControl: 'linked' } );
			} else {
				this.setState( { titlePaddingControl: 'individual' } );
			}
			if ( accordionConfig.titleStyles[ 0 ].borderWidth[ 0 ] === accordionConfig.titleStyles[ 0 ].borderWidth[ 1 ] && accordionConfig.titleStyles[ 0 ].borderWidth[ 0 ] === accordionConfig.titleStyles[ 0 ].borderWidth[ 2 ] && accordionConfig.titleStyles[ 0 ].borderWidth[ 0 ] === accordionConfig.titleStyles[ 0 ].borderWidth[ 3 ] ) {
				this.setState( { titleBorderControl: 'linked' } );
			} else {
				this.setState( { titleBorderControl: 'individual' } );
			}
			if ( accordionConfig.titleStyles[ 0 ].borderRadius[ 0 ] === accordionConfig.titleStyles[ 0 ].borderRadius[ 1 ] && accordionConfig.titleStyles[ 0 ].borderRadius[ 0 ] === accordionConfig.titleStyles[ 0 ].borderRadius[ 2 ] && accordionConfig.titleStyles[ 0 ].borderRadius[ 0 ] === accordionConfig.titleStyles[ 0 ].borderRadius[ 3 ] ) {
				this.setState( { titleBorderRadiusControl: 'linked' } );
			} else {
				this.setState( { titleBorderRadiusControl: 'individual' } );
			}
			if ( accordionConfig.titleStyles[ 0 ].border[ 0 ] === accordionConfig.titleStyles[ 0 ].border[ 1 ] && accordionConfig.titleStyles[ 0 ].border[ 0 ] === accordionConfig.titleStyles[ 0 ].border[ 2 ] && accordionConfig.titleStyles[ 0 ].border[ 0 ] === accordionConfig.titleStyles[ 0 ].border[ 3 ] ) {
				this.setState( { titleBorderColorControl: 'linked' } );
			} else {
				this.setState( { titleBorderColorControl: 'individual' } );
			}
			if ( accordionConfig.titleStyles[ 0 ].borderHover[ 0 ] === accordionConfig.titleStyles[ 0 ].borderHover[ 1 ] && accordionConfig.titleStyles[ 0 ].borderHover[ 0 ] === accordionConfig.titleStyles[ 0 ].borderHover[ 2 ] && accordionConfig.titleStyles[ 0 ].borderHover[ 0 ] === accordionConfig.titleStyles[ 0 ].borderHover[ 3 ] ) {
				this.setState( { titleBorderHoverColorControl: 'linked' } );
			} else {
				this.setState( { titleBorderHoverColorControl: 'individual' } );
			}
			if ( accordionConfig.titleStyles[ 0 ].borderActive[ 0 ] === accordionConfig.titleStyles[ 0 ].borderActive[ 1 ] && accordionConfig.titleStyles[ 0 ].borderActive[ 0 ] === accordionConfig.titleStyles[ 0 ].borderActive[ 2 ] && accordionConfig.titleStyles[ 0 ].borderActive[ 0 ] === accordionConfig.titleStyles[ 0 ].borderActive[ 3 ] ) {
				this.setState( { titleBorderActiveColorControl: 'linked' } );
			} else {
				this.setState( { titleBorderActiveColorControl: 'individual' } );
			}
		}
		if ( accordionConfig.contentBorder && accordionConfig.contentBorder[ 0 ] ) {
			if ( accordionConfig.contentBorder[ 0 ] === accordionConfig.contentBorder[ 1 ] && accordionConfig.contentBorder[ 0 ] === accordionConfig.contentBorder[ 2 ] && accordionConfig.contentBorder[ 0 ] === accordionConfig.contentBorder[ 3 ] ) {
				this.setState( { contentBorderControl: 'linked' } );
			} else {
				this.setState( { contentBorderControl: 'individual' } );
			}
		}
		if ( accordionConfig.contentBorderRadius && accordionConfig.contentBorderRadius[ 0 ] ) {
			if ( accordionConfig.contentBorderRadius[ 0 ] === accordionConfig.contentBorderRadius[ 1 ] && accordionConfig.contentBorderRadius[ 0 ] === accordionConfig.contentBorderRadius[ 2 ] && accordionConfig.contentBorderRadius[ 0 ] === accordionConfig.contentBorderRadius[ 3 ] ) {
				this.setState( { contentBorderRadiusControl: 'linked' } );
			} else {
				this.setState( { contentBorderRadiusControl: 'individual' } );
			}
		}
		if ( accordionConfig.contentPadding && accordionConfig.contentPadding[ 0 ] ) {
			if ( accordionConfig.contentPadding[ 0 ] === accordionConfig.contentPadding[ 1 ] && accordionConfig.contentPadding[ 0 ] === accordionConfig.contentPadding[ 2 ] && accordionConfig.contentPadding[ 0 ] === accordionConfig.contentPadding[ 3 ] ) {
				this.setState( { contentPaddingControl: 'linked' } );
			} else {
				this.setState( { contentPaddingControl: 'individual' } );
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
		if ( config[ 'kadence/accordion' ] === undefined || config[ 'kadence/accordion' ].length == 0 ) {
			config[ 'kadence/accordion' ] = {};
		}
		config[ 'kadence/accordion' ][ key ] = value;
		this.setState( { configuration: config } );
	}
	render() {
		const { configuration, isOpen, contentPaddingControl, contentBorderRadiusControl, contentBorderControl, titleBorderControl, titlePaddingControl, titleBorderRadiusControl, titleBorderColorControl, titleBorderHoverColorControl, titleBorderActiveColorControl, titleTag } = this.state;
		const accordionConfig = ( configuration && configuration[ 'kadence/accordion' ] ? configuration[ 'kadence/accordion' ] : {} );
		const titleDefaultStyles = [ {
			size: [ 18, '', '' ],
			sizeType: 'px',
			lineHeight: [ 24, '', '' ],
			lineType: 'px',
			letterSpacing: '',
			family: '',
			google: '',
			style: '',
			weight: '',
			variant: '',
			subset: '',
			loadGoogle: true,
			padding: [ 10, 14, 10, 14 ],
			marginTop: 8,
			color: '#555555',
			background: '#f2f2f2',
			border: [ '#555555', '#555555', '#555555', '#555555' ],
			borderRadius: [ 0, 0, 0, 0 ],
			borderWidth: [ 0, 0, 0, 0 ],
			colorHover: '#444444',
			backgroundHover: '#eeeeee',
			borderHover: [ '#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee' ],
			colorActive: '#ffffff',
			backgroundActive: '#444444',
			borderActive: [ '#444444', '#444444', '#444444', '#444444' ],
			textTransform: '',
		} ];
		const titleStyles = ( undefined !== accordionConfig.titleStyles && accordionConfig.titleStyles[ 0 ] ? accordionConfig.titleStyles : titleDefaultStyles );
		const saveTitleStyles = ( value ) => {
			const newUpdate = titleStyles.map( ( item, index ) => {
				if ( 0 === index ) {
					item = { ...item, ...value };
				}
				return item;
			} );
			this.saveConfigState( 'titleStyles', newUpdate );
		};
		const normalSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Title Color' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].color }
					onChange={ ( value ) => saveTitleStyles( { color: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Title Background' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].background }
					onChange={ ( value ) => saveTitleStyles( { background: value } ) }
				/>
				<BorderColorControls
					label={ __( 'Title Border Color' ) }
					values={ titleStyles[ 0 ].border }
					control={ titleBorderColorControl }
					onChange={ ( value ) => saveTitleStyles( { border: value } ) }
					onControl={ ( value ) => this.setState( { titleBorderColorControl: value } ) }
				/>
			</Fragment>
		);
		const hoverSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Hover Color' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].colorHover }
					onChange={ ( value ) => saveTitleStyles( { colorHover: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Hover Background' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].backgroundHover }
					onChange={ ( value ) => saveTitleStyles( { backgroundHover: value } ) }
				/>
				<BorderColorControls
					label={ __( 'Hover Border Color' ) }
					values={ titleStyles[ 0 ].borderHover }
					control={ titleBorderHoverColorControl }
					onChange={ ( value ) => saveTitleStyles( { borderHover: value } ) }
					onControl={ ( value ) => this.setState( { titleBorderHoverColorControl: value } ) }
				/>
			</Fragment>
		);
		const activeSettings = (
			<Fragment>
				<p className="kt-setting-label">{ __( 'Active Color' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].colorActive }
					onChange={ ( value ) => saveTitleStyles( { colorActive: value } ) }
				/>
				<p className="kt-setting-label">{ __( 'Active Background' ) }</p>
				<ColorPalette
					value={ titleStyles[ 0 ].backgroundActive }
					onChange={ ( value ) => saveTitleStyles( { backgroundActive: value } ) }
				/>
				<BorderColorControls
					label={ __( 'Active Border Color' ) }
					values={ titleStyles[ 0 ].borderActive }
					control={ titleBorderActiveColorControl }
					onChange={ ( value ) => saveTitleStyles( { borderActive: value } ) }
					onControl={ ( value ) => this.setState( { titleBorderActiveColorControl: value } ) }
				/>
			</Fragment>
		);
		const accordionIconSet = [];
		accordionIconSet.basic = <Fragment><rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444" /><path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" /><path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" /><path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" /></Fragment>;
		accordionIconSet.basiccircle = <Fragment><circle cx="83.723" cy="50" r="50" fill="#444" /><circle cx="322.768" cy="50" r="50" fill="#444" /><rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff" /><path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" /><path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" /><path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" /></Fragment>;
		accordionIconSet.xclose = <Fragment><rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444" /><path d="M353.5,28.432l-9.887,-9.887l-53.023,53.023l9.887,9.887l53.023,-53.023Z" fill="#444" /><path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444" /><path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#444" /></Fragment>;
		accordionIconSet.xclosecircle = <Fragment><circle cx="83.723" cy="50" r="50" fill="#444" /><circle cx="322.768" cy="50" r="50" fill="#444" /><rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff" /><path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#fff" /><path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff" /><path d="M290.59,71.568l9.887,9.887l53.023,-53.023l-9.887,-9.887l-53.023,53.023Z" fill="#fff" /></Fragment>;
		accordionIconSet.arrow = <Fragment><g fill="#444"><path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z" /><path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z" /></g><g fill="#444"><path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z" /><path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z" /></g></Fragment>;
		accordionIconSet.arrowcircle = <Fragment><circle cx="83.723" cy="50" r="50" fill="#444" /><circle cx="322.768" cy="50" r="50" fill="#444" /><g fill="#fff"><path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z" /><path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z" /></g><g fill="#fff"><path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z" /><path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z" /></g></Fragment>;

		const renderIconSet = svg => (
			<svg className="accord-icon" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="1.414" style={ { fill: '#000000' } }>
				{ accordionIconSet[ svg ] }
			</svg>
		);
		return (
			<Fragment>
				<Button className="kt-block-defaults" onClick={ () => this.setState( { isOpen: true } ) }>
					<span className="kt-block-icon">{ icons.accordionBlock }</span>
					{ __( 'Accordions' ) }
				</Button>
				{ isOpen ?
					<Modal
						className="kt-block-defaults-modal"
						title={ __( 'Kadence Accordions' ) }
						onRequestClose={ () => {
							this.saveConfig( 'kadence/accordion', accordionConfig );
						} }>
						<ToggleControl
							label={ __( 'Show Presets' ) }
							checked={ ( undefined !== accordionConfig.showPresets ? accordionConfig.showPresets : true ) }
							onChange={ value => this.saveConfigState( 'showPresets', value ) }
						/>
						<ToggleControl
							label={ __( 'Panes close when another opens' ) }
							checked={ ( undefined !== accordionConfig.linkPaneCollapse ? accordionConfig.linkPaneCollapse : true ) }
							onChange={ value => this.saveConfigState( 'linkPaneCollapse', value ) }
						/>
						<ToggleControl
							label={ __( 'Start with all panes collapsed' ) }
							checked={ ( undefined !== accordionConfig.startCollapsed ? accordionConfig.startCollapsed : false ) }
							onChange={ value => this.saveConfigState( 'startCollapsed', value ) }
						/>
						<PanelBody
							title={ __( 'Pane Title Color Settings' ) }
							initialOpen={ false }
						>
							<TabPanel className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
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
									{
										name: 'active',
										title: __( 'Active' ),
										className: 'kt-active-tab',
									},
								] }>
								{
									( tab ) => {
										let tabout;
										if ( tab.name ) {
											if ( 'hover' === tab.name ) {
												tabout = hoverSettings;
											} else if ( 'active' === tab.name ) {
												tabout = activeSettings;
											} else {
												tabout = normalSettings;
											}
										}
										return <div className={ tab.className } key={ tab.className }>{ tabout }</div>;
									}
								}
							</TabPanel>
						</PanelBody>
						<PanelBody
							title={ __( 'Pane Title Trigger Icon' ) }
							initialOpen={ false }
						>
							<ToggleControl
								label={ __( 'Show Icon' ) }
								checked={ ( undefined !== accordionConfig.showIcon ? accordionConfig.showIcon : true ) }
								onChange={ value => this.saveConfigState( 'showIcon', value ) }
							/>
							<h2>{ __( 'Icon Style' ) }</h2>
							<FontIconPicker
								icons={ [
									'basic',
									'basiccircle',
									'xclose',
									'xclosecircle',
									'arrow',
									'arrowcircle',
								] }
								value={ ( undefined !== accordionConfig.iconStyle ? accordionConfig.iconStyle : 'basic' ) }
								onChange={ value => this.saveConfigState( 'iconStyle', value ) }
								appendTo={ false }
								renderFunc={ renderIconSet }
								closeOnSelect={ true }
								theme="accordion"
								showSearch={ false }
								noSelectedPlaceholder={ __( 'Select Icon Set' ) }
								isMulti={ false }
							/>
							<SelectControl
								label={ __( 'Icon Side' ) }
								value={ ( undefined !== accordionConfig.iconSide ? accordionConfig.iconSide : 'right' ) }
								options={ [
									{ value: 'right', label: __( 'Right' ) },
									{ value: 'left', label: __( 'Left' ) },
								] }
								onChange={ value => this.saveConfigState( 'iconSide', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Pane Title Spacing' ) }
							initialOpen={ false }
						>
							<MeasurementControls
								label={ __( 'Pane Title Padding (px)' ) }
								measurement={ titleStyles[ 0 ].padding }
								control={ titlePaddingControl }
								onChange={ ( value ) => saveTitleStyles( { padding: value } ) }
								onControl={ ( value ) => this.setState( { titlePaddingControl: value } ) }
								min={ 0 }
								max={ 40 }
								step={ 1 }
							/>
							<RangeControl
								label={ __( 'Pane Spacer Between' ) }
								value={ titleStyles[ 0 ].marginTop }
								onChange={ ( value ) => saveTitleStyles( { marginTop: value } ) }
								min={ 1 }
								max={ 120 }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Pane Title Border' ) }
							initialOpen={ false }
						>
							<MeasurementControls
								label={ __( 'Pane Title Border Width (px)' ) }
								measurement={ titleStyles[ 0 ].borderWidth }
								control={ titleBorderControl }
								onChange={ ( value ) => saveTitleStyles( { borderWidth: value } ) }
								onControl={ ( value ) => this.setState( { titleBorderControl: value } ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
							<MeasurementControls
								label={ __( 'Pane Title Border Radius (px)' ) }
								measurement={ titleStyles[ 0 ].borderRadius }
								control={ titleBorderRadiusControl }
								onChange={ ( value ) => saveTitleStyles( { borderRadius: value } ) }
								onControl={ ( value ) => this.setState( { titleBorderRadiusControl: value } ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
								controlTypes={ [
									{ key: 'linked', name: __( 'Linked' ), icon: icons.radiuslinked },
									{ key: 'individual', name: __( 'Individual' ), icon: icons.radiusindividual },
								] }
								firstIcon={ icons.topleft }
								secondIcon={ icons.topright }
								thirdIcon={ icons.bottomright }
								fourthIcon={ icons.bottomleft }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Pane Title Font Settings' ) }
							initialOpen={ false }
						>
							<TypographyControls
								fontSize={ titleStyles[ 0 ].size }
								onFontSize={ ( value ) => saveTitleStyles( { size: value } ) }
								fontSizeType={ titleStyles[ 0 ].sizeType }
								onFontSizeType={ ( value ) => saveTitleStyles( { sizeType: value } ) }
								lineHeight={ titleStyles[ 0 ].lineHeight }
								onLineHeight={ ( value ) => saveTitleStyles( { lineHeight: value } ) }
								lineHeightType={ titleStyles[ 0 ].lineType }
								onLineHeightType={ ( value ) => saveTitleStyles( { lineType: value } ) }
								letterSpacing={ titleStyles[ 0 ].letterSpacing }
								onLetterSpacing={ ( value ) => saveTitleStyles( { letterSpacing: value } ) }
								textTransform={ titleStyles[ 0 ].textTransform }
								onTextTransform={ ( value ) => saveTitleStyles( { textTransform: value } ) }
								fontFamily={ titleStyles[ 0 ].family }
								onFontFamily={ ( value ) => saveTitleStyles( { family: value } ) }
								onFontChange={ ( select ) => {
									saveTitleStyles( {
										family: select.value,
										google: select.google,
									} );
								} }
								onFontArrayChange={ ( values ) => saveTitleStyles( values ) }
								googleFont={ titleStyles[ 0 ].google }
								onGoogleFont={ ( value ) => saveTitleStyles( { google: value } ) }
								loadGoogleFont={ titleStyles[ 0 ].loadGoogle }
								onLoadGoogleFont={ ( value ) => saveTitleStyles( { loadGoogle: value } ) }
								fontVariant={ titleStyles[ 0 ].variant }
								onFontVariant={ ( value ) => saveTitleStyles( { variant: value } ) }
								fontWeight={ titleStyles[ 0 ].weight }
								onFontWeight={ ( value ) => saveTitleStyles( { weight: value } ) }
								fontStyle={ titleStyles[ 0 ].style }
								onFontStyle={ ( value ) => saveTitleStyles( { style: value } ) }
								fontSubset={ titleStyles[ 0 ].subset }
								onFontSubset={ ( value ) => saveTitleStyles( { subset: value } ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Inner Content Settings' ) }
							initialOpen={ false }
						>
							<MeasurementControls
								label={ __( 'Inner Content Padding (px)' ) }
								measurement={ ( undefined !== accordionConfig.contentPadding ? accordionConfig.contentPadding : [ 20, 20, 20, 20 ] ) }
								control={ contentPaddingControl }
								onChange={ ( value ) => this.saveConfigState( 'contentPadding', value ) }
								onControl={ ( value ) => this.setState( { contentPaddingControl: value } ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
							/>
							<p className="kt-setting-label">{ __( 'Inner Content Background' ) }</p>
							<ColorPalette
								value={ ( undefined !== accordionConfig.contentBgColor ? accordionConfig.contentBgColor : '' ) }
								onChange={ ( value ) => this.saveConfigState( 'contentBgColor', value ) }
							/>
							<p className="kt-setting-label">{ __( 'Inner Content Border Color' ) }</p>
							<ColorPalette
								value={ ( undefined !== accordionConfig.contentBorderColor ? accordionConfig.contentBorderColor : '#eeeeee' ) }
								onChange={ ( value ) => this.saveConfigState( 'contentBorderColor', value ) }
							/>
							<MeasurementControls
								label={ __( 'Inner Content Border Width (px)' ) }
								measurement={ ( undefined !== accordionConfig.contentBorder ? accordionConfig.contentBorder : [ 0, 1, 1, 1 ] ) }
								control={ contentBorderControl }
								onChange={ ( value ) => this.saveConfigState( 'contentBorder', value ) }
								onControl={ ( value ) => this.setState( { contentBorderControl: value } ) }
								min={ 0 }
								max={ 40 }
								step={ 1 }
							/>
							<MeasurementControls
								label={ __( 'Inner Content Border Radius (px)' ) }
								measurement={ ( undefined !== accordionConfig.contentBorderRadius ? accordionConfig.contentBorderRadius : [ 0, 0, 0, 0 ] ) }
								control={ contentBorderRadiusControl }
								onChange={ ( value ) => this.saveConfigState( 'contentBorderRadius', value ) }
								onControl={ ( value ) => this.setState( { contentBorderRadiusControl: value } ) }
								min={ 0 }
								max={ 100 }
								step={ 1 }
								controlTypes={ [
									{ key: 'linked', name: __( 'Linked' ), icon: icons.radiuslinked },
									{ key: 'individual', name: __( 'Individual' ), icon: icons.radiusindividual },
								] }
								firstIcon={ icons.topleft }
								secondIcon={ icons.topright }
								thirdIcon={ icons.bottomright }
								fourthIcon={ icons.bottomleft }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Title Tag Settings' ) }
							initialOpen={ false }
						>
							<SelectControl
								label={ __( 'Title Tag' ) }
								value={ ( undefined !== accordionConfig.titleTag ? accordionConfig.titleTag : 'div' ) }
								options={ [
									{ value: 'div', label: __( 'div' ) },
									{ value: 'h2', label: __( 'h2' ) },
									{ value: 'h3', label: __( 'h3' ) },
									{ value: 'h4', label: __( 'h4' ) },
									{ value: 'h5', label: __( 'h5' ) },
									{ value: 'h6', label: __( 'h6' ) },
								] }
								onChange={ value => this.saveConfigState( 'titleTag', value ) }
							/>
						</PanelBody>
						<PanelBody
							title={ __( 'Structure Settings' ) }
							initialOpen={ false }
						>
							<RangeControl
								label={ __( 'Content Minimum Height' ) }
								value={ ( undefined !== accordionConfig.minHeight ? accordionConfig.minHeight : '' ) }
								onChange={ ( value ) => this.saveConfigState( 'minHeight', value ) }
								min={ 0 }
								max={ 1000 }
							/>
							<RangeControl
								label={ __( 'Max Width' ) }
								value={ ( undefined !== accordionConfig.maxWidth ? accordionConfig.maxWidth : '' ) }
								onChange={ ( value ) => this.saveConfigState( 'maxWidth', value ) }
								min={ 0 }
								max={ 2000 }
							/>
						</PanelBody>
						<Button className="kt-defaults-save" isPrimary onClick={ () => {
							this.saveConfig( 'kadence/accordion', accordionConfig );
						} }>
							{ __( 'Save/Close' ) }
						</Button>
					</Modal>
					: null }
			</Fragment>
		);
	}
}
export default KadenceAccordionDefault;
