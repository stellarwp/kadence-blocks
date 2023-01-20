/**
 * BLOCK: Kadence Progress Bar
 */

/**
 * Import Css
 */
import './editor.scss';

import {
	TypographyControls,
	PopColorControl,
	WebfontLoader,
	ResponsiveRangeControls,
	ResponsiveMeasureRangeControl,
	ResponsiveAlignControls,
	InspectorControlTabs,
	KadencePanelBody
} from '@kadence/components';

import {
	KadenceColorOutput,
	getPreviewSize,
	getSpacingOptionOutput,
} from '@kadence/helpers';

import {
	progressIcon,
	lineBar,
	circleBar,
	semiCircleBar,
} from '@kadence/icons';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import {
	useState,
	useEffect,
	useCallback,
	useMemo,
	Fragment,
} from '@wordpress/element';
import { useBlockProps, BlockAlignmentControl } from '@wordpress/block-editor';
import { map } from 'lodash';
import {
	RichText,
	AlignmentToolbar,
	InspectorControls,
	BlockControls,
} from '@wordpress/block-editor';

import {
	PanelBody,
	SelectControl,
	ButtonGroup,
	Button,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';
import {
	Circle,
	SemiCircle,
	Line,
} from 'progressbar.js';
/**
 * Internal dependencies
 */
import classnames from 'classnames';

const ktUniqueIDs = [];

export function Edit( {
						  attributes,
						  setAttributes,
						  className,
						  clientId,
					  } ) {

	/*These are all the variables we have defined in block.json*/
	const {
		uniqueID,
		align,
		paddingTablet,
		paddingDesktop,
		paddingMobile,
		paddingUnit,
		marginTablet,
		marginDesktop,
		marginMobile,
		marginUnit,
		barBackground,
		barBackgroundOpacity,
		progressColor,
		progressOpacity,
		barType,
		containerMaxWidth,
		tabletContainerMaxWidth,
		mobileContainerMaxWidth,
		containerMaxWidthUnits,
		displayLabel,
		labelFont,
		labelHighlightFont,
		labelMinHeight,
		label,
		labelAlign,
		labelPosition,
		progressAmount,
		duration,
		progressWidth,
		progressWidthTablet,
		progressWidthMobile,
		progressWidthType,
		progressBorderRadius,
		easing,

	} = attributes;

	useEffect( () => {
		if ( !uniqueID ) {
			const blockConfigObject = ( kadence_blocks_params.configuration ? JSON.parse( kadence_blocks_params.configuration ) : [] );
			if ( blockConfigObject[ 'kadence/block-template' ] !== undefined && typeof blockConfigObject[ 'kadence/block-template' ] === 'object' ) {
				Object.keys( blockConfigObject[ 'kadence/block-template' ] ).map( ( attribute ) => {
					uniqueID = blockConfigObject[ 'kadence/block-template' ][ attribute ];
				} );
			}
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else if ( ktUniqueIDs.includes( uniqueID ) ) {
			setAttributes( {
				uniqueID: '_' + clientId.substr( 2, 9 ),
			} );
			ktUniqueIDs.push( '_' + clientId.substr( 2, 9 ) );
		} else {
			ktUniqueIDs.push( uniqueID );
		}
	}, [] );

	const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
		( select ) => {
			return {
				isUniqueID   : ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
			};
		},
		[ clientId ],
	);

	const [ activeTab, setActiveTab ] = useState( 'general' );

	/*These const are for the responsive settings, so that we give the correct rpview based on the display type*/
	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 0 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 0 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 1 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 1 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 2 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 2 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== marginDesktop ? marginDesktop[ 3 ] : '' ), ( undefined !== marginTablet ? marginTablet[ 3 ] : '' ), ( undefined !== marginMobile ? marginMobile[ 3 ] : '' ) );

	const previewPaddingTop = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 0 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 0 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 0 ] : '' ) );
	const previewPaddingRight = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 1 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 1 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 1 ] : '' ) );
	const previewPaddingBottom = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 2 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 2 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 2 ] : '' ) );
	const previewPaddingLeft = getPreviewSize( previewDevice, ( undefined !== paddingDesktop ? paddingDesktop[ 3 ] : '' ), ( undefined !== paddingTablet ? paddingTablet[ 3 ] : '' ), ( undefined !== paddingMobile ? paddingMobile[ 3 ] : '' ) );

	const previewProgressWidth = getPreviewSize( previewDevice, ( undefined !== progressWidth ? progressWidth : '' ), ( undefined !== progressWidthTablet ? progressWidthTablet : '' ), ( undefined !== progressWidthMobile ? progressWidthMobile : '' ) );
	const previewProgressBorderRadius = getPreviewSize( previewDevice, ( undefined !== progressBorderRadius[ 0 ] ? progressBorderRadius[ 0 ] : '' ), ( undefined !== progressBorderRadius[ 1 ] ? progressBorderRadius[ 1 ] : '' ), ( undefined !== progressBorderRadius[ 2 ] ? progressBorderRadius[ 2 ] : '' ) );

	const previewContainerMaxWidth = getPreviewSize( previewDevice, ( undefined !== containerMaxWidth ? containerMaxWidth : '' ), ( undefined !== tabletContainerMaxWidth ? tabletContainerMaxWidth : '' ), ( undefined !== mobileContainerMaxWidth ? mobileContainerMaxWidth : '' ) );

	const previewLabelFont = getPreviewSize( previewDevice, ( undefined !== labelFont.size && undefined !== labelFont.size[ 0 ] && '' !== labelFont.size[ 0 ] ? labelFont.size[ 0 ] : '' ), ( undefined !== labelFont.size && undefined !== labelFont.size[ 1 ] && '' !== labelFont.size[ 1 ] ? labelFont.size[ 1 ] : '' ), ( undefined !== labelFont.size && undefined !== labelFont.size[ 2 ] && '' !== labelFont.size[ 2 ] ? labelFont.size[ 2 ] : '' ) );
	const previewLabelLineHeight = getPreviewSize( previewDevice, ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 0 ] && '' !== labelFont.lineHeight[ 0 ] ? labelFont.lineHeight[ 0 ] : '' ), ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 1 ] && '' !== labelFont.lineHeight[ 1 ] ? labelFont.lineHeight[ 1 ] : '' ), ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 2 ] && '' !== labelFont.lineHeight[ 2 ] ? labelFont.lineHeight[ 2 ] : '' ) );

	const previewLabelHighlightFont = getPreviewSize( previewDevice, ( undefined !== labelHighlightFont.size && undefined !== labelHighlightFont.size[ 0 ] && '' !== labelHighlightFont.size[ 0 ] ? labelHighlightFont.size[ 0 ] : '' ), ( undefined !== labelHighlightFont.size && undefined !== labelHighlightFont.size[ 1 ] && '' !== labelHighlightFont.size[ 1 ] ? labelHighlightFont.size[ 1 ] : '' ), ( undefined !== labelHighlightFont.size && undefined !== labelHighlightFont.size[ 2 ] && '' !== labelHighlightFont.size[ 2 ] ? labelHighlightFont.size[ 2 ] : '' ) );
	const previewLabelHighlightLineHeight = getPreviewSize( previewDevice, ( undefined !== labelHighlightFont.lineHeight && undefined !== labelHighlightFont.lineHeight[ 0 ] && '' !== labelHighlightFont.lineHeight[ 0 ] ? labelHighlightFont.lineHeight[ 0 ] : '' ), ( undefined !== labelHighlightFont.lineHeight && undefined !== labelHighlightFont.lineHeight[ 1 ] && '' !== labelHighlightFont.lineHeight[ 1 ] ? labelHighlightFont.lineHeight[ 1 ] : '' ), ( undefined !== labelHighlightFont.lineHeight && undefined !== labelHighlightFont.lineHeight[ 2 ] && '' !== labelHighlightFont.lineHeight[ 2 ] ? labelHighlightFont.lineHeight[ 2 ] : '' ) );
	
	const previewLabelMinHeight = getPreviewSize( previewDevice, ( undefined !== labelMinHeight && undefined !== labelMinHeight[ 0 ] ? labelMinHeight[ 0 ] : '' ), ( undefined !== labelMinHeight && undefined !== labelMinHeight[ 1 ] ? labelMinHeight[ 1 ] : '' ), ( undefined !== labelMinHeight && undefined !== labelMinHeight[ 2 ] ? labelMinHeight[ 2 ] : '' ) );
	const previewLabelAlign = getPreviewSize( previewDevice, ( undefined !== labelAlign[ 0 ] ? labelAlign[ 0 ] : '' ), ( undefined !== labelAlign[ 1 ] ? labelAlign[ 1 ] : '' ), ( undefined !== labelAlign[ 2 ] ? labelAlign[ 2 ] : '' ) );

	const [ marginControl, setMarginControl ] = useState( 'individual' );
	const [ paddingControl, setPaddingControl ] = useState( 'individual' );
	const [ borderControl, setBorderControl ] = useState( 'individual' );

	const classes = classnames( className, {
		[ `kt-block-template${uniqueID}` ]: uniqueID,
	} );

	const containerClasses = classnames( {
		'kb-block-progress-container'               : true,
		[ `kb-block-progress-container${uniqueID}` ]: true,
	} );

	const blockProps = useBlockProps( {
		className: classes,
	} );

	const layoutPresetOptions = [
		{ key: 'line', name: __( 'Line', 'kadence-blocks' ), icon: lineBar },
		{ key: 'circle', name: __( 'Circle', 'kadence-blocks' ), icon: circleBar },
		{ key: 'semicircle', name: __( 'Semicircle', 'kadence-blocks' ), icon: semiCircleBar },

	];
	const labelFontConfigObj = {
		google: {
			families: [ labelFont.family + ( labelFont.variant ? ':' + labelFont.variant : '' ) ],
		},
	};
	const labelFontConfig = ( labelFont.google ? labelFontConfigObj : '' );

	const progressLabelStyles = {
		textAlign    : previewLabelAlign,
		fontWeight   : labelFont.weight,
		fontStyle    : labelFont.style,
		color        : KadenceColorOutput( labelFont.color ),
		fontSize     : ( previewLabelFont ? previewLabelFont + labelFont.sizeType : undefined ),
		lineHeight   : ( previewLabelLineHeight ? previewLabelLineHeight + labelFont.lineType : undefined ),
		letterSpacing: labelFont.letterSpacing + 'px',
		textTransform: ( labelFont.textTransform ? labelFont.textTransform : undefined ),
		fontFamily   : ( labelFont.family ? labelFont.family : '' ),
		padding      : ( labelFont.padding ? labelFont.padding[ 0 ] + 'px ' + labelFont.padding[ 1 ] + 'px ' + labelFont.padding[ 2 ] + 'px ' + labelFont.padding[ 3 ] + 'px' : '' ),
		margin       : ( labelFont.margin ? labelFont.margin[ 0 ] + 'px ' + labelFont.margin[ 1 ] + 'px ' + labelFont.margin[ 2 ] + 'px ' + labelFont.margin[ 3 ] + 'px' : '' ),
	};

	const [ animate, setAnimate ] = useState( 0.0 );
	const container = document.createElement( 'div' );
	const ProgressLine = ( { animate } ) => {
		const line = useMemo( () =>
			new Line( container, {
				color      : KadenceColorOutput( progressColor, progressOpacity ),
				strokeWidth: previewProgressWidth,
				duration   : duration * 1000,
				easing     : easing,
				trailWidth : previewProgressWidth,
				trailColor : KadenceColorOutput( barBackground, barBackgroundOpacity ),
				svgStyle   : {
					borderRadius: previewProgressBorderRadius + 'px',
				},

			} ), [] );
		const node = useCallback( node => {
			if ( node ) {
				node.appendChild( container );
			}
		}, [] );

		useEffect( () => {
			line.animate( animate );
		}, [ animate, line ] );

		return <div ref={node}/>;
	};
	const ProgressCircle = ( { animate } ) => {
		const circle = useMemo( () =>
			new Circle( container, {
				color      : KadenceColorOutput( progressColor, progressOpacity ),
				strokeWidth: previewProgressWidth,
				duration   : duration * 1000,
				easing     : easing,
				trailWidth : previewProgressWidth,
				trailColor : KadenceColorOutput( barBackground, barBackgroundOpacity ),
				svgStyle   : {
					borderRadius: previewProgressBorderRadius + 'px',
				},
			} ), [] );
		const node = useCallback( node => {
			if ( node ) {
				node.appendChild( container );
			}
		}, [] );

		useEffect( () => {
			circle.animate( animate );
		}, [ animate, circle ] );

		return <div ref={node}/>;
	};

	const ProgressSemicircle = ( { animate } ) => {
		const semicircle = useMemo( () =>
			new SemiCircle( container, {
				color      : KadenceColorOutput( progressColor, progressOpacity ),
				strokeWidth: previewProgressWidth,
				duration   : 1200,
				easing     : easing,
				trailWidth : previewProgressWidth,
				trailColor : KadenceColorOutput( barBackground, barBackgroundOpacity ),
				svgStyle   : {
					borderRadius: previewProgressBorderRadius + 'px',
				},
			} ), [] );
		const node = useCallback( node => {
			if ( node ) {
				node.appendChild( container );
			}
		}, [] );

		useEffect( () => {
			semicircle.animate( animate );
		}, [ animate, semicircle ] );

		return <div ref={node}/>;
	};

	const saveLabelFont = ( value ) => {
		setAttributes( {
			labelFont: { ...labelFont, ...value },
		} );
	};
	const saveLabelHighlightFont = ( value ) => {
		setAttributes( {
			labelHighlightFont: { ...labelHighlightFont, ...value },
		} );
	};
	const [ labelPaddingControl, setLabelPaddingControl ] = useState( 'linked' );
	const [ labelMarginControl, setLabelMarginControl ] = useState( 'individual' );

	return (
		<div {...blockProps}>
			<BlockControls group="block">
				<BlockAlignmentControl
					value={align}
					onChange={( value ) => setAttributes( { align: value } )}
				/>
			</BlockControls>
			<InspectorControls>

				<InspectorControlTabs
					panelName={'progress-bar'}
					setActiveTab={setActiveTab}
					activeTab={activeTab}
				/>

				{( activeTab === 'general' ) && (
					<>
						<PanelBody>
							<h2>{__( 'Progress Bar Layout', 'kadence-blocks' )}</h2>
							<ButtonGroup className="kt-style-btn-group kb-info-layouts" aria-label={__( 'Progress Bar Layout', 'kadence-blocks' )}>
								{map( layoutPresetOptions, ( { name, key, icon } ) => (
									<Button
										key={key}
										className="kt-style-btn"
										isSmall
										isPrimary={false}
										aria-pressed={false}
										onClick={
											() => setAttributes( { barType: key } )
										}
									>
										{icon}
									</Button>
								) )}
							</ButtonGroup>
						</PanelBody>

						<KadencePanelBody
							title={__( 'Size Controls', 'kadence-blocks' )}
							initialOpen={false}
						>
							<ResponsiveRangeControls
								label={__( 'Max Width', 'kadence-blocks' )}
								value={containerMaxWidth}
								onChange={value => setAttributes( { containerMaxWidth: value } )}
								tabletValue={( tabletContainerMaxWidth ? tabletContainerMaxWidth : '' )}
								onChangeTablet={( value ) => setAttributes( { tabletContainerMaxWidth: value } )}
								mobileValue={( mobileContainerMaxWidth ? mobileContainerMaxWidth : '' )}
								onChangeMobile={( value ) => setAttributes( { mobileContainerMaxWidth: value } )}
								min={0}
								max={( containerMaxWidthUnits == 'px' ? 3000 : 100 )}
								step={1}
								unit={containerMaxWidthUnits}
								onUnit={( value ) => setAttributes( { containerMaxWidthUnits: value } )}
								reset={() => setAttributes( { containerMaxWidth: 200, tabletContainerMaxWidth: '', mobileContainerMaxWidth: '' } )}
								units={[ 'px', 'vh', '%' ]}
							/>
							<ResponsiveMeasureRangeControl
								label={__( 'Margin', 'kadence-blocks' )}
								value={[ previewMarginTop, previewMarginRight, previewMarginBottom, previewMarginLeft ]}
								tabletValue={marginTablet}
								mobileValue={marginMobile}
								onChange={( value ) => {
									setAttributes( { marginDesktop: value } );
								}}
								onChangeTablet={( value ) => setAttributes( { marginTablet: value } )}
								onChangeMobile={( value ) => setAttributes( { marginMobile: value } )}
								min={( marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200 )}
								max={( marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200 )}
								step={( marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1 )}
								unit={marginUnit}
								units={[ 'px', 'em', 'rem', '%', 'vh' ]}
								onUnit={( value ) => setAttributes( { marginUnit: value } )}
								// onMouseOver={ marginMouseOver.onMouseOver }
								// onMouseOut={ marginMouseOver.onMouseOut }
							/>


						</KadencePanelBody>

						{/* These are the wordpress and Kadence components mostly that are imported at the top */}
						<KadencePanelBody
							title={__( 'Progress Bar Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-testimonials-bar-settings'}
						>

							<PopColorControl
								label={__( 'Progress Background', 'kadence-blocks' )}
								colorValue={( barBackground ? barBackground : '#4A5568' )}
								colorDefault={'#4A5568'}
								opacityValue={barBackgroundOpacity}
								onColorChange={value => setAttributes( { barBackground: value } )}
								onOpacityChange={value => setAttributes( { barBackgroundOpacity: value } )}
							/>
							<PopColorControl
								label={__( 'Progress Color', 'kadence-blocks' )}
								colorValue={( progressColor ? progressColor : '#4A5568' )}
								colorDefault={'#4A5568'}
								opacityValue={progressOpacity}
								onColorChange={value => setAttributes( { progressColor: value } )}
								onOpacityChange={value => setAttributes( { progressOpacity: value } )}
							/>
							<ResponsiveRangeControls
								label={__( 'Progress Thickness', 'kadence-blocks' )}
								value={progressWidth}
								tabletValue={progressWidthTablet}
								mobileValue={progressWidthMobile}
								onChange={( value ) => {
									setAttributes( { progressWidth: value } );
								}}
								onChangeTablet={( value ) => {
									setAttributes( { progressWidthTablet: value } );
								}}
								onChangeMobile={( value ) => {
									setAttributes( { progressWidthMobile: value } );
								}}

								allowEmpty={true}
								min={0}
								max={50}
								step={1}

							/>
							<ResponsiveRangeControls
								label={__( 'Border Radius', 'kadence-blocks' )}
								value={progressBorderRadius[ 0 ]}
								tabletValue={progressBorderRadius[ 1 ]}
								mobileValue={progressBorderRadius[ 2 ]}
								onChange={( value ) => setAttributes( { progressBorderRadius: [ value, ( progressBorderRadius && progressBorderRadius[ 1 ] ? progressBorderRadius[ 1 ] : '' ), ( progressBorderRadius && progressBorderRadius[ 2 ] ? progressBorderRadius[ 2 ] : '' ) ] } )}
								onChangeTablet={( value ) => setAttributes( { progressBorderRadius: [ ( progressBorderRadius && progressBorderRadius[ 0 ] ? progressBorderRadius[ 0 ] : '' ), value, ( progressBorderRadius && progressBorderRadius[ 2 ] ? progressBorderRadius[ 2 ] : '' ) ] } )}
								onChangeMobile={( value ) => setAttributes( { progressBorderRadius: [ ( progressBorderRadius && progressBorderRadius[ 0 ] ? progressBorderRadius[ 0 ] : '' ), ( progressBorderRadius && progressBorderRadius[ 1 ] ? progressBorderRadius[ 1 ] : '' ), value ] } )}


								allowEmpty={true}
								min={0}
								max={50}
								step={1}
								unit={'px'}
							/>
							<RangeControl
								label={__( 'Progress Range', 'kadence-blocks' )}
								value={progressAmount}
								onChange={( value ) => setAttributes( { progressAmount: value } )}
								min={1}
								max={100}
								step={1}
							/>
							<RangeControl
								label={__( 'Animation Duration', 'kadence-blocks' )}
								value={duration}
								onChange={( value ) => setAttributes( { duration: value } )}
								min={0.1}
								max={25}
								step={0.1}
							/>
							<SelectControl
								label={__( 'Animation Type', 'kadence-blocks' )}
								options={
									[ { value: 'linear', label: __( 'Linear', 'kadence-blocks' ) },
									  { value: 'easeIn', label: __( 'Ease In', 'kadence-blocks' ) },
									  { value: 'easeOut', label: __( 'Ease Out', 'kadence-blocks' ) },
									  { value: 'easeInOut', label: __( 'Ease In Out', 'kadence-blocks' ) } ]
								}
								value={easing}
								onChange={( value ) => setAttributes( { easing: value } )}
							/>

						</KadencePanelBody>

					</>

				)}


				{( activeTab === 'style' ) && (

					<Fragment>
						<KadencePanelBody
							title={__( 'Label Settings', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-testimonials-title-settings'}
						>
							<ToggleControl
								label={__( 'Show Label', 'kadence-blocks' )}
								checked={displayLabel}
								onChange={( value ) => setAttributes( { displayLabel: value } )}
							/>

							{displayLabel && (
								<Fragment>
									<SelectControl
										label={__( 'Label Position', 'kadence-blocks' )}
										options={
											[ { value: 'above', label: __( 'Above', 'kadence-blocks' ) },
											{ value: 'below', label: __( 'Below', 'kadence-blocks' ) } ]
										}
										value={labelPosition}
										onChange={( value ) => setAttributes( { labelPosition: value } )}
									/>
									<PopColorControl
										label={__( 'Color Settings', 'kadence-blocks' )}
										value={( labelFont.color ? labelFont.color : '' )}
										default={''}
										onChange={value => saveLabelFont( { color: value } )}
									/>
									<ResponsiveAlignControls
										label={__( 'Text Alignment', 'kadence-blocks' )}
										value={( labelAlign && labelAlign[ 0 ] ? labelAlign[ 0 ] : '' )}
										mobileValue={( labelAlign && labelAlign[ 2 ] ? labelAlign[ 2 ] : '' )}
										tabletValue={( labelAlign && labelAlign[ 1 ] ? labelAlign[ 1 ] : '' )}
										onChange={( nextAlign ) => setAttributes( { labelAlign: [ nextAlign, ( labelAlign && labelAlign[ 1 ] ? labelAlign[ 1 ] : '' ), ( labelAlign && labelAlign[ 2 ] ? labelAlign[ 2 ] : '' ) ] } )}
										onChangeTablet={( nextAlign ) => setAttributes( { labelAlign: [ ( labelAlign && labelAlign[ 0 ] ? labelAlign[ 0 ] : '' ), nextAlign, ( labelAlign && labelAlign[ 2 ] ? labelAlign[ 2 ] : '' ) ] } )}
										onChangeMobile={( nextAlign ) => setAttributes( { labelAlign: [ ( labelAlign && labelAlign[ 0 ] ? labelAlign[ 0 ] : '' ), ( labelAlign && labelAlign[ 1 ] ? labelAlign[ 1 ] : '' ), nextAlign ] } )}
									/>
									<TypographyControls
										fontGroup={'heading'}
										tagLevel={labelFont.level}
										tagLowLevel={1}
										onTagLevel={( value ) => saveLabelFont( { level: value } )}
										fontSize={labelFont.size}
										onFontSize={( value ) => saveLabelFont( { size: value } )}
										fontSizeType={labelFont.sizeType}
										onFontSizeType={( value ) => saveLabelFont( { sizeType: value } )}
										lineHeight={labelFont.lineHeight}
										onLineHeight={( value ) => saveLabelFont( { lineHeight: value } )}
										lineHeightType={labelFont.lineType}
										onLineHeightType={( value ) => saveLabelFont( { lineType: value } )}
										letterSpacing={labelFont.letterSpacing}
										onLetterSpacing={( value ) => saveLabelFont( { letterSpacing: value } )}
										textTransform={labelFont.textTransform}
										onTextTransform={( value ) => saveLabelFont( { textTransform: value } )}
										fontFamily={labelFont.family}
										onFontFamily={( value ) => saveLabelFont( { family: value } )}
										onFontChange={( select ) => {
											saveLabelFont( {
												family: select.value,
												google: select.google,
											} );
										}}
										onFontArrayChange={( values ) => saveLabelFont( values )}
										googleFont={labelFont.google}
										onGoogleFont={( value ) => saveLabelFont( { google: value } )}
										loadGoogleFont={labelFont.loadGoogle}
										onLoadGoogleFont={( value ) => saveLabelFont( { loadGoogle: value } )}
										fontVariant={labelFont.variant}
										onFontVariant={( value ) => saveLabelFont( { variant: value } )}
										fontWeight={labelFont.weight}
										onFontWeight={( value ) => saveLabelFont( { weight: value } )}
										fontStyle={labelFont.style}
										onFontStyle={( value ) => saveLabelFont( { style: value } )}
										fontSubset={labelFont.subset}
										onFontSubset={( value ) => saveLabelFont( { subset: value } )}
										padding={labelFont.padding}
										onPadding={( value ) => saveLabelFont( { padding: value } )}
										paddingControl={labelPaddingControl}
										onPaddingControl={( value ) => setLabelPaddingControl( value )}
										margin={labelFont.margin}
										onMargin={( value ) => saveLabelFont( { margin: value } )}
										marginControl={labelMarginControl}
										onMarginControl={( value ) => setLabelMarginControl( value )}
									/>
									<ResponsiveRangeControls
										label={__( 'Label Min Height', 'kadence-blocks' )}
										value={( labelMinHeight && undefined !== labelMinHeight[ 0 ] ? labelMinHeight[ 0 ] : '' )}
										onChange={value => setAttributes( { labelMinHeight: [ value, ( labelMinHeight && undefined !== labelMinHeight[ 1 ] ? labelMinHeight[ 1 ] : '' ), ( labelMinHeight && undefined !== labelMinHeight[ 2 ] ? labelMinHeight[ 2 ] : '' ) ] } )}
										tabletValue={( labelMinHeight && undefined !== labelMinHeight[ 1 ] ? labelMinHeight[ 1 ] : '' )}
										onChangeTablet={( value ) => setAttributes( { labelMinHeight: [ ( labelMinHeight && undefined !== labelMinHeight[ 0 ] ? labelMinHeight[ 0 ] : '' ), value, ( labelMinHeight && undefined !== labelMinHeight[ 2 ] ? labelMinHeight[ 2 ] : '' ) ] } )}
										mobileValue={( labelMinHeight && undefined !== labelMinHeight[ 2 ] ? labelMinHeight[ 2 ] : '' )}
										onChangeMobile={( value ) => setAttributes( { labelMinHeight: [ ( labelMinHeight && undefined !== labelMinHeight[ 0 ] ? labelMinHeight[ 0 ] : '' ), ( labelMinHeight && undefined !== labelMinHeight[ 1 ] ? labelMinHeight[ 1 ] : '' ), value ] } )}
										min={0}
										max={200}
										step={1}
										unit={'px'}
										showUnit={true}
										units={[ 'px' ]}
									/>
									</Fragment>
							)}
						</KadencePanelBody>
						
						<KadencePanelBody
							title={__( 'Highlight Settings', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-panel-highlight-progress-bar'}
						>
								<PopColorControl
										label={__( 'Color Settings', 'kadence-blocks' )}
										value={( labelFont.color ? labelFont.color : '' )}
										default={''}
										onChange={value => saveLabelHighlightFont( { color: value } )}
									/>
								<TypographyControls
										fontGroup={'heading'}
										tagLevel={labelFont.level}
										tagLowLevel={1}
										onTagLevel={( value ) => saveLabelHighlightFont( { level: value } )}
										fontSize={labelFont.size}
										onFontSize={( value ) => saveLabelHighlightFont( { size: value } )}
										fontSizeType={labelFont.sizeType}
										onFontSizeType={( value ) => saveLabelHighlightFont( { sizeType: value } )}
										lineHeight={labelFont.lineHeight}
										onLineHeight={( value ) => saveLabelHighlightFont( { lineHeight: value } )}
										lineHeightType={labelFont.lineType}
										onLineHeightType={( value ) => saveLabelHighlightFont( { lineType: value } )}
										letterSpacing={labelFont.letterSpacing}
										onLetterSpacing={( value ) => saveLabelHighlightFont( { letterSpacing: value } )}
										textTransform={labelFont.textTransform}
										onTextTransform={( value ) => saveLabelHighlightFont( { textTransform: value } )}
										fontFamily={labelFont.family}
										onFontFamily={( value ) => saveLabelHighlightFont( { family: value } )}
										onFontChange={( select ) => {
											saveLabelHighlightFont( {
												family: select.value,
												google: select.google,
											} );
										}}
										onFontArrayChange={( values ) => saveLabelHighlightFont( values )}
										googleFont={labelFont.google}
										onGoogleFont={( value ) => saveLabelHighlightFont( { google: value } )}
										loadGoogleFont={labelFont.loadGoogle}
										onLoadGoogleFont={( value ) => saveLabelHighlightFont( { loadGoogle: value } )}
										fontVariant={labelFont.variant}
										onFontVariant={( value ) => saveLabelHighlightFont( { variant: value } )}
										fontWeight={labelFont.weight}
										onFontWeight={( value ) => saveLabelHighlightFont( { weight: value } )}
										fontStyle={labelFont.style}
										onFontStyle={( value ) => saveLabelHighlightFont( { style: value } )}
										fontSubset={labelFont.subset}
										onFontSubset={( value ) => saveLabelHighlightFont( { subset: value } )}
										padding={labelFont.padding}
										onPadding={( value ) => saveLabelHighlightFont( { padding: value } )}
										margin={labelFont.margin}
										onMargin={( value ) => saveLabelHighlightFont( { margin: value } )}
										
									/>
						</KadencePanelBody>
					</Fragment>

				)}

			</InspectorControls>
			<div className={containerClasses} style={
				{
					marginTop   : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),
					marginRight : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),
					marginBottom: ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),
					marginLeft  : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),

					maxWidth: ( previewContainerMaxWidth ? previewContainerMaxWidth + containerMaxWidthUnits : 'none' ),

				}
			}>

				{displayLabel && labelPosition === 'above' && (
					<div className="kt-progress-label-wrap" style={{
						minHeight: ( previewLabelMinHeight ? previewLabelMinHeight + 'px' : undefined ),
					}}>
						<RichText
							tagName={'h' + labelFont.level}
							value={label}
							onChange={( value ) => {
								setAttributes( { label: value } );
							}}
							placeholder={__( 'Progress', 'kadence-blocks' )}
							style={progressLabelStyles}
							className={'kt-progress-label'}
						/>
					</div>
				)}

				{( barType === 'line' ) &&
					<div class="line-bars">
						<ProgressLine animate={progressAmount / 100}/>
					</div>
				}

				{( barType === 'circle' ) &&
					<div class="circle-bars">
						<ProgressCircle animate={progressAmount / 100}/>
					</div>
				}

				{( barType === 'semicircle' ) &&
					<div class="semicircle-bars">
						<ProgressSemicircle animate={progressAmount / 100}/>
					</div>
				}
				{displayLabel && labelPosition === 'below' && (
					<div className="kt-progress-label-wrap" style={{
						minHeight: ( previewLabelMinHeight ? previewLabelMinHeight + 'px' : undefined ),
					}}>
						<RichText
							tagName={'h' + labelFont.level}
							value={label}
							onChange={( value ) => {
								setAttributes( { label: value } );
							}}
							placeholder={__( 'Progress', 'kadence-blocks' )}
							style={progressLabelStyles}
							className={'kt-progress-label'}
						/>
					</div>
				)}
			</div>

			{labelFont.google && (
				<WebfontLoader config={ labelFontConfig }>
				</WebfontLoader>
			)}
		</div>
	);
}

export default ( Edit );
