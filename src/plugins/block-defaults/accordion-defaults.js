import {
	Fragment,
	useEffect,
	useState,
} from '@wordpress/element';
import {
	ToggleControl,
	RangeControl,
	PanelBody,
	TabPanel,
	SelectControl,
	Button,
	Modal,
} from '@wordpress/components';
import { TypographyControls, BorderColorControls, PopColorControl, MeasurementControls } from '@kadence/components';
import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import {
	accordionBlockIcon,
	bottomLeftIcon,
	bottomRightIcon,
	radiusIndividualIcon,
	radiusLinkedIcon,
	topLeftIcon,
	topRightIcon,
} from '@kadence/icons';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { linkedOrIndividual } from '@kadence/helpers';

function KadenceAccordionDefault( props ) {

	const [ isOpen, setIsOpen ] = useState( false );
	const [ isSaving, setIsSaving ] = useState( false );
	const [ configuration, setConfiguration ] = useState( ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} ) );
	const [ contentPaddingControl, setContentPaddingControl ] = useState( 'linked' );
	const [ contentBorderRadiusControl, setContentBorderRadiusControl ] = useState( 'linked' );
	const [ contentBorderControl, setContentBorderControl ] = useState( 'linked' );
	const [ titleBorderControl, setTitleBorderControl ] = useState( 'linked' );
	const [ titlePaddingControl, setTitlePaddingControl ] = useState( 'individual' );
	const [ titleBorderRadiusControl, setTitleBorderRadiusControl ] = useState( 'linked' );
	const [ titleBorderColorControl, setTitleBorderColorControl ] = useState( 'linked' );
	const [ titleBorderHoverColorControl, setTitleBorderHoverColorControl ] = useState( 'linked' );
	const [ titleBorderActiveColorControl, setTitleBorderActiveColorControl ] = useState( 'linked' );
	const [ titleTag, setTitleTag ] = useState( 'div' );

	useEffect( () => {
		const accordionConfig = ( configuration && configuration[ 'kadence/accordion' ] ? configuration[ 'kadence/accordion' ] : {} );

		if ( accordionConfig.titleStyles ) {
			setTitlePaddingControl( linkedOrIndividual( accordionConfig.titleStyles, 'padding' ) );
			setTitleBorderControl( linkedOrIndividual( accordionConfig.titleStyles, 'borderWidth' ) );
			setTitleBorderRadiusControl( linkedOrIndividual( accordionConfig.titleStyles, 'borderRadius' ) );
			setTitleBorderColorControl( linkedOrIndividual( accordionConfig.titleStyles, 'border' ) );
			setTitleBorderHoverColorControl( linkedOrIndividual( accordionConfig.titleStyles, 'borderHover' ) );
			setTitleBorderActiveColorControl( linkedOrIndividual( accordionConfig.titleStyles, 'borderActive' ) );
		}

		if ( accordionConfig.contentBorder && accordionConfig.contentBorder[ 0 ] ) {
			setContentBorderControl( linkedOrIndividual( accordionConfig, 'contentBorder' ) );
		}

		if ( accordionConfig.contentBorderRadius && accordionConfig.contentBorderRadius[ 0 ] ) {
			setContentBorderRadiusControl( linkedOrIndividual( accordionConfig, 'contentBorderRadius' ) );
		}

		if ( accordionConfig.contentPadding && accordionConfig.contentPadding[ 0 ] ) {
			setContentPaddingControl( linkedOrIndividual( accordionConfig, 'contentPadding' ) );
		}
	}, [] );

	const saveConfig = ( blockID, settingArray ) => {
		setIsSaving( true );

		const config = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : {} );
		if ( !config[ blockID ] ) {
			config[ blockID ] = {};
		}
		config[ blockID ] = settingArray;
		const settingModel = new wp.api.models.Settings( { kadence_blocks_config_blocks: JSON.stringify( config ) } );
		settingModel.save().then( response => {

			setIsSaving( false );
			setConfiguration( config );
			setIsOpen( false );

			kadence_blocks_params.configuration = JSON.stringify( config );
		} );
	};
	const saveConfigState = ( key, value ) => {
		const config = configuration;
		if ( config[ 'kadence/accordion' ] === undefined || config[ 'kadence/accordion' ].length == 0 ) {
			config[ 'kadence/accordion' ] = {};
		}
		config[ 'kadence/accordion' ][ key ] = value;
		setConfiguration( config );
	};

	const accordionConfig = ( configuration && configuration[ 'kadence/accordion' ] ? configuration[ 'kadence/accordion' ] : {} );
	const titleDefaultStyles = [ {
		size            : [ 18, '', '' ],
		sizeType        : 'px',
		lineHeight      : [ 24, '', '' ],
		lineType        : 'px',
		letterSpacing   : '',
		family          : '',
		google          : '',
		style           : '',
		weight          : '',
		variant         : '',
		subset          : '',
		loadGoogle      : true,
		padding         : [ 10, 14, 10, 14 ],
		marginTop       : 8,
		color           : '#555555',
		background      : '#f2f2f2',
		border          : [ '#555555', '#555555', '#555555', '#555555' ],
		borderRadius    : [ 0, 0, 0, 0 ],
		borderWidth     : [ 0, 0, 0, 0 ],
		colorHover      : '#444444',
		backgroundHover : '#eeeeee',
		borderHover     : [ '#eeeeee', '#eeeeee', '#eeeeee', '#eeeeee' ],
		colorActive     : '#ffffff',
		backgroundActive: '#444444',
		borderActive    : [ '#444444', '#444444', '#444444', '#444444' ],
		textTransform   : '',
	} ];

	const titleStyles = ( undefined !== accordionConfig.titleStyles && accordionConfig.titleStyles[ 0 ] ? accordionConfig.titleStyles : titleDefaultStyles );
	const saveTitleStyles = ( value ) => {
		const newUpdate = titleStyles.map( ( item, index ) => {
			if ( 0 === index ) {
				item = { ...item, ...value };
			}
			return item;
		} );
		saveConfigState( 'titleStyles', newUpdate );
	};
	const normalSettings = (
		<Fragment>
			<p className="kt-setting-label">{__( 'Title Color' )}</p>
			<PopColorControl
				value={titleStyles[ 0 ].color}
				onChange={( value ) => saveTitleStyles( { color: value } )}
			/>
			<p className="kt-setting-label">{__( 'Title Background' )}</p>
			<PopColorControl
				value={titleStyles[ 0 ].background}
				onChange={( value ) => saveTitleStyles( { background: value } )}
			/>
			<BorderColorControls
				label={__( 'Title Border Color' )}
				values={titleStyles[ 0 ].border}
				control={titleBorderColorControl}
				onChange={( value ) => saveTitleStyles( { border: value } )}
				onControl={( value ) => setTitleBorderColorControl( value )}
			/>
		</Fragment>
	);
	const hoverSettings = (
		<Fragment>
			<p className="kt-setting-label">{__( 'Hover Color' )}</p>
			<PopColorControl
				value={titleStyles[ 0 ].colorHover}
				onChange={( value ) => saveTitleStyles( { colorHover: value } )}
			/>
			<p className="kt-setting-label">{__( 'Hover Background' )}</p>
			<PopColorControl
				value={titleStyles[ 0 ].backgroundHover}
				onChange={( value ) => saveTitleStyles( { backgroundHover: value } )}
			/>
			<BorderColorControls
				label={__( 'Hover Border Color' )}
				values={titleStyles[ 0 ].borderHover}
				control={titleBorderHoverColorControl}
				onChange={( value ) => saveTitleStyles( { borderHover: value } )}
				onControl={( value ) => setTitleBorderHoverColorControl( value )}
			/>
		</Fragment>
	);
	const activeSettings = (
		<Fragment>
			<p className="kt-setting-label">{__( 'Active Color' )}</p>
			<PopColorControl
				value={titleStyles[ 0 ].colorActive}
				onChange={( value ) => saveTitleStyles( { colorActive: value } )}
			/>
			<p className="kt-setting-label">{__( 'Active Background' )}</p>
			<PopColorControl
				value={titleStyles[ 0 ].backgroundActive}
				onChange={( value ) => saveTitleStyles( { backgroundActive: value } )}
			/>
			<BorderColorControls
				label={__( 'Active Border Color' )}
				values={titleStyles[ 0 ].borderActive}
				control={titleBorderActiveColorControl}
				onChange={( value ) => saveTitleStyles( { borderActive: value } )}
				onControl={( value ) => setTitleBorderActiveColorControl( value )}
			/>
		</Fragment>
	);
	const accordionIconSet = [];
	accordionIconSet.basic = <Fragment>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
	</Fragment>;
	accordionIconSet.basiccircle = <Fragment>
		<circle cx="83.723" cy="50" r="50" fill="#444"/>
		<circle cx="322.768" cy="50" r="50" fill="#444"/>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M359.538,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
	</Fragment>;
	accordionIconSet.xclose = <Fragment>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#444"/>
		<path d="M353.5,28.432l-9.887,-9.887l-53.023,53.023l9.887,9.887l53.023,-53.023Z" fill="#444"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#444"/>
		<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#444"/>
	</Fragment>;
	accordionIconSet.xclosecircle = <Fragment>
		<circle cx="83.723" cy="50" r="50" fill="#444"/>
		<circle cx="322.768" cy="50" r="50" fill="#444"/>
		<rect x="77.002" y="12.507" width="13.982" height="74.986" fill="#fff"/>
		<path d="M343.613,81.455l9.887,-9.887l-53.023,-53.023l-9.887,9.887l53.023,53.023Z" fill="#fff"/>
		<path d="M121.486,56.991l0,-13.982l-74.986,0l0,13.982l74.986,0Z" fill="#fff"/>
		<path d="M290.59,71.568l9.887,9.887l53.023,-53.023l-9.887,-9.887l-53.023,53.023Z" fill="#fff"/>
	</Fragment>;
	accordionIconSet.arrow = <Fragment>
		<g fill="#444">
			<path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z"/>
			<path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z"/>
		</g>
		<g fill="#444">
			<path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z"/>
			<path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z"/>
		</g>
	</Fragment>;
	accordionIconSet.arrowcircle = <Fragment>
		<circle cx="83.723" cy="50" r="50" fill="#444"/>
		<circle cx="322.768" cy="50" r="50" fill="#444"/>
		<g fill="#fff">
			<path d="M122.2,37.371l-9.887,-9.886l-38.887,38.887l9.887,9.887l38.887,-38.888Z"/>
			<path d="M83.18,76.515l9.887,-9.886l-38.92,-38.921l-9.887,9.887l38.92,38.92Z"/>
		</g>
		<g fill="#fff">
			<path d="M283.65,63.629l9.887,9.886l38.887,-38.887l-9.887,-9.887l-38.887,38.888Z"/>
			<path d="M322.67,24.485l-9.887,9.886l38.92,38.921l9.887,-9.887l-38.92,-38.92Z"/>
		</g>
	</Fragment>;

	const renderIconSet = svg => (
		<svg className="accord-icon" viewBox="0 0 400 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round"
			 strokeMiterlimit="1.414" style={{ fill: '#000000' }}>
			{accordionIconSet[ svg ]}
		</svg>
	);
	return (
		<Fragment>
			<Button className="kt-block-defaults" onClick={() => setIsOpen( true )}>
				<span className="kt-block-icon">{accordionBlockIcon}</span>
				{__( 'Accordions' )}
			</Button>
			{isOpen && (
				<Modal
					className="kt-block-defaults-modal"
					title={__( 'Kadence Accordions' )}
					onRequestClose={() => {
						saveConfig( 'kadence/accordion', accordionConfig );
					}}>
					<ToggleControl
						label={__( 'Show Presets' )}
						checked={( undefined !== accordionConfig.showPresets ? accordionConfig.showPresets : true )}
						onChange={value => saveConfigState( 'showPresets', value )}
					/>
					<ToggleControl
						label={__( 'Panes close when another opens' )}
						checked={( undefined !== accordionConfig.linkPaneCollapse ? accordionConfig.linkPaneCollapse : true )}
						onChange={value => saveConfigState( 'linkPaneCollapse', value )}
					/>
					<ToggleControl
						label={__( 'Start with all panes collapsed' )}
						checked={( undefined !== accordionConfig.startCollapsed ? accordionConfig.startCollapsed : false )}
						onChange={value => saveConfigState( 'startCollapsed', value )}
					/>
					<PanelBody
						title={__( 'Pane Title Color Settings' )}
						initialOpen={false}
					>
						<TabPanel className="kt-inspect-tabs kt-no-ho-ac-tabs kt-hover-tabs"
								  activeClass="active-tab"
								  tabs={[
									  {
										  name     : 'normal',
										  title    : __( 'Normal' ),
										  className: 'kt-normal-tab',
									  },
									  {
										  name     : 'hover',
										  title    : __( 'Hover' ),
										  className: 'kt-hover-tab',
									  },
									  {
										  name     : 'active',
										  title    : __( 'Active' ),
										  className: 'kt-active-tab',
									  },
								  ]}>
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
									return <div className={tab.className} key={tab.className}>{tabout}</div>;
								}
							}
						</TabPanel>
					</PanelBody>
					<PanelBody
						title={__( 'Pane Title Trigger Icon' )}
						initialOpen={false}
					>
						<ToggleControl
							label={__( 'Show Icon' )}
							checked={( undefined !== accordionConfig.showIcon ? accordionConfig.showIcon : true )}
							onChange={value => saveConfigState( 'showIcon', value )}
						/>
						<h2>{__( 'Icon Style' )}</h2>
						<FontIconPicker
							icons={[
								'basic',
								'basiccircle',
								'xclose',
								'xclosecircle',
								'arrow',
								'arrowcircle',
							]}
							value={( undefined !== accordionConfig.iconStyle ? accordionConfig.iconStyle : 'basic' )}
							onChange={value => saveConfigState( 'iconStyle', value )}
							appendTo={false}
							renderFunc={renderIconSet}
							closeOnSelect={true}
							theme="accordion"
							showSearch={false}
							noSelectedPlaceholder={__( 'Select Icon Set' )}
							isMulti={false}
						/>
						<SelectControl
							label={__( 'Icon Side' )}
							value={( undefined !== accordionConfig.iconSide ? accordionConfig.iconSide : 'right' )}
							options={[
								{ value: 'right', label: __( 'Right' ) },
								{ value: 'left', label: __( 'Left' ) },
							]}
							onChange={value => saveConfigState( 'iconSide', value )}
						/>
					</PanelBody>
					<PanelBody
						title={__( 'Pane Title Spacing' )}
						initialOpen={false}
					>
						<MeasurementControls
							label={__( 'Pane Title Padding (px)' )}
							measurement={titleStyles[ 0 ].padding}
							control={titlePaddingControl}
							onChange={( value ) => saveTitleStyles( { padding: value } )}
							onControl={( value ) => setTitlePaddingControl( value )}
							min={0}
							max={40}
							step={1}
						/>
						<RangeControl
							label={__( 'Pane Spacer Between' )}
							value={titleStyles[ 0 ].marginTop}
							onChange={( value ) => saveTitleStyles( { marginTop: value } )}
							min={1}
							max={120}
						/>
					</PanelBody>
					<PanelBody
						title={__( 'Pane Title Border' )}
						initialOpen={false}
					>
						<MeasurementControls
							label={__( 'Pane Title Border Width (px)' )}
							measurement={titleStyles[ 0 ].borderWidth}
							control={titleBorderControl}
							onChange={( value ) => saveTitleStyles( { borderWidth: value } )}
							onControl={( value ) => setTitleBorderControl( value )}
							min={0}
							max={100}
							step={1}
						/>
						<MeasurementControls
							label={__( 'Pane Title Border Radius (px)' )}
							measurement={titleStyles[ 0 ].borderRadius}
							control={titleBorderRadiusControl}
							onChange={( value ) => saveTitleStyles( { borderRadius: value } )}
							onControl={( value ) => setTitleBorderRadiusControl( value )}
							min={0}
							max={100}
							step={1}
							controlTypes={[
								{ key: 'linked', name: __( 'Linked' ), icon: radiusLinkedIcon },
								{ key: 'individual', name: __( 'Individual' ), icon: radiusIndividualIcon },
							]}
							firstIcon={topLeftIcon}
							secondIcon={topRightIcon}
							thirdIcon={bottomRightIcon}
							fourthIcon={bottomLeftIcon}
						/>
					</PanelBody>
					<PanelBody
						title={__( 'Pane Title Font Settings' )}
						initialOpen={false}
					>
						<TypographyControls
							fontSize={titleStyles[ 0 ].size}
							onFontSize={( value ) => saveTitleStyles( { size: value } )}
							fontSizeType={titleStyles[ 0 ].sizeType}
							onFontSizeType={( value ) => saveTitleStyles( { sizeType: value } )}
							lineHeight={titleStyles[ 0 ].lineHeight}
							onLineHeight={( value ) => saveTitleStyles( { lineHeight: value } )}
							lineHeightType={titleStyles[ 0 ].lineType}
							onLineHeightType={( value ) => saveTitleStyles( { lineType: value } )}
							letterSpacing={titleStyles[ 0 ].letterSpacing}
							onLetterSpacing={( value ) => saveTitleStyles( { letterSpacing: value } )}
							textTransform={titleStyles[ 0 ].textTransform}
							onTextTransform={( value ) => saveTitleStyles( { textTransform: value } )}
							fontFamily={titleStyles[ 0 ].family}
							onFontFamily={( value ) => saveTitleStyles( { family: value } )}
							onFontChange={( select ) => {
								saveTitleStyles( {
									family: select.value,
									google: select.google,
								} );
							}}
							onFontArrayChange={( values ) => saveTitleStyles( values )}
							googleFont={titleStyles[ 0 ].google}
							onGoogleFont={( value ) => saveTitleStyles( { google: value } )}
							loadGoogleFont={titleStyles[ 0 ].loadGoogle}
							onLoadGoogleFont={( value ) => saveTitleStyles( { loadGoogle: value } )}
							fontVariant={titleStyles[ 0 ].variant}
							onFontVariant={( value ) => saveTitleStyles( { variant: value } )}
							fontWeight={titleStyles[ 0 ].weight}
							onFontWeight={( value ) => saveTitleStyles( { weight: value } )}
							fontStyle={titleStyles[ 0 ].style}
							onFontStyle={( value ) => saveTitleStyles( { style: value } )}
							fontSubset={titleStyles[ 0 ].subset}
							onFontSubset={( value ) => saveTitleStyles( { subset: value } )}
						/>
					</PanelBody>
					<PanelBody
						title={__( 'Inner Content Settings' )}
						initialOpen={false}
					>
						<MeasurementControls
							label={__( 'Inner Content Padding (px)' )}
							measurement={( undefined !== accordionConfig.contentPadding ? accordionConfig.contentPadding : [ 20, 20, 20, 20 ] )}
							control={contentPaddingControl}
							onChange={( value ) => saveConfigState( 'contentPadding', value )}
							onControl={( value ) => setContentPaddingControl( value )}
							min={0}
							max={100}
							step={1}
						/>
						<p className="kt-setting-label">{__( 'Inner Content Background' )}</p>
						<PopColorControl
							value={( undefined !== accordionConfig.contentBgColor ? accordionConfig.contentBgColor : '' )}
							onChange={( value ) => saveConfigState( 'contentBgColor', value )}
						/>
						<p className="kt-setting-label">{__( 'Inner Content Border Color' )}</p>
						<PopColorControl
							value={( undefined !== accordionConfig.contentBorderColor ? accordionConfig.contentBorderColor : '#eeeeee' )}
							onChange={( value ) => saveConfigState( 'contentBorderColor', value )}
						/>
						<MeasurementControls
							label={__( 'Inner Content Border Width (px)' )}
							measurement={( undefined !== accordionConfig.contentBorder ? accordionConfig.contentBorder : [ 0, 1, 1, 1 ] )}
							control={contentBorderControl}
							onChange={( value ) => saveConfigState( 'contentBorder', value )}
							onControl={( value ) => setContentBorderControl( value )}
							min={0}
							max={40}
							step={1}
						/>
						<MeasurementControls
							label={__( 'Inner Content Border Radius (px)' )}
							measurement={( undefined !== accordionConfig.contentBorderRadius ? accordionConfig.contentBorderRadius : [ 0, 0, 0, 0 ] )}
							control={contentBorderRadiusControl}
							onChange={( value ) => saveConfigState( 'contentBorderRadius', value )}
							onControl={( value ) => setContentBorderRadiusControl( value )}
							min={0}
							max={100}
							step={1}
							controlTypes={[
								{ key: 'linked', name: __( 'Linked' ), icon: radiusLinkedIcon },
								{ key: 'individual', name: __( 'Individual' ), icon: radiusIndividualIcon },
							]}
							firstIcon={topLeftIcon}
							secondIcon={topRightIcon}
							thirdIcon={bottomRightIcon}
							fourthIcon={bottomLeftIcon}
						/>
					</PanelBody>
					<PanelBody
						title={__( 'Title Tag Settings' )}
						initialOpen={false}
					>
						<SelectControl
							label={__( 'Title Tag' )}
							value={( undefined !== accordionConfig.titleTag ? accordionConfig.titleTag : 'div' )}
							options={[
								{ value: 'div', label: __( 'div' ) },
								{ value: 'h2', label: __( 'h2' ) },
								{ value: 'h3', label: __( 'h3' ) },
								{ value: 'h4', label: __( 'h4' ) },
								{ value: 'h5', label: __( 'h5' ) },
								{ value: 'h6', label: __( 'h6' ) },
							]}
							onChange={value => saveConfigState( 'titleTag', value )}
						/>
					</PanelBody>
					<PanelBody
						title={__( 'Structure Settings' )}
						initialOpen={false}
					>
						<RangeControl
							label={__( 'Content Minimum Height' )}
							value={( undefined !== accordionConfig.minHeight ? accordionConfig.minHeight : '' )}
							onChange={( value ) => saveConfigState( 'minHeight', value )}
							min={0}
							max={1000}
						/>
						<RangeControl
							label={__( 'Max Width' )}
							value={( undefined !== accordionConfig.maxWidth ? accordionConfig.maxWidth : '' )}
							onChange={( value ) => saveConfigState( 'maxWidth', value )}
							min={0}
							max={2000}
						/>
					</PanelBody>
					<Button className="kt-defaults-save" isPrimary onClick={() => {
						saveConfig( 'kadence/accordion', accordionConfig );
					}}>
						{__( 'Save/Close' )}
					</Button>
				</Modal>
			) }
		</Fragment>
	);
}

export default KadenceAccordionDefault;
