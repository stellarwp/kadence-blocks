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
	TextControl,
	__experimentalAlignmentMatrixControl as AlignmentMatrixControl
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
		label,
		labelPosition,
		percentPosition,
		progressAmount,
		progressMax,
		displayPercent,
		numberSuffix,
		numberIsRelative,
		duration,
		startDelay,
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

	const containerClasses = classnames( {
		'kb-block-progress-container'               : true,
		[ `kb-block-progress-container${uniqueID}` ]: true,
	} );

	const blockProps = useBlockProps( {
		className: containerClasses,
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


	const progressAttributes = {
		color      : KadenceColorOutput( progressColor, progressOpacity ),
		strokeWidth: previewProgressWidth,
		duration   : duration * 1000,
		easing     : easing,
		trailWidth : previewProgressWidth,
		trailColor : KadenceColorOutput( barBackground, barBackgroundOpacity ),
		svgStyle   : {
			borderRadius: ( barType === 'line' ? previewProgressBorderRadius + 'px' : '' ),
		},
		text: {
			style: {
				transform: {
					prefix: false,
				}
			}
		},
		step: function ( state, bar ) {

			let element = document.getElementById('current-progress');
			let value = 0;

			if( numberIsRelative ) {
				value = Math.round(bar.value() * 100 );
			} else {
				value = Math.round(bar.value() * progressMax);
			}

			if( element ) {
				if ( displayPercent ) {
					// bar.setText( value + '%' );
					element.innerHTML = value + numberSuffix;
				} else {
					element.innerHTML = '';
				}
			}
		}
	};

	const container = document.createElement( 'div' );
	const progress = useMemo( () => {

		if ( barType === 'line' ) {
			return new Line( container, progressAttributes );
		} else if ( barType === 'circle' ) {
			return new Circle( container, progressAttributes );
		} else if ( barType === 'semicircle' ) {
			return new SemiCircle( container, progressAttributes );
		}
	}, [ barType, progressAttributes ] );

	const ProgressItem = ( { animate } ) => {
		const node = useCallback( node => {
			if ( node ) {
				node.appendChild( container );
			}
		}, [] );

		useEffect( () => {
			progress.animate( animate );
		}, [ animate, progress ] );

		return <div ref={node}/>;
	};

	const saveLabelFont = ( value ) => {
		setAttributes( {
			labelFont: { ...labelFont, ...value },
		} );
	};

	const RenderLabels = ( currentPosition ) => {

		let positions = [ 'bottom', 'top' ];

		if( ( !displayLabel && ! displayPercent ) || !positions.filter(s => s.includes(currentPosition))){
			return null;
		}

		return (
			<div className="kt-progress-label-wrap">
				{ displayLabel && labelPosition.includes(currentPosition) && (
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
				) }

				{ displayPercent && percentPosition.includes(currentPosition) && (
					<div id={ 'current-progress'}></div>
				) }
			</div>
		);
	};

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
							<h2>{__( 'Layout', 'kadence-blocks' )}</h2>
							<ButtonGroup className="kt-style-btn-group kb-info-layouts" aria-label={__( 'Progress Bar Layout', 'kadence-blocks' )}>
								{map( layoutPresetOptions, ( { name, key, icon } ) => (
									<Button
										key={key}
										className="kt-style-btn"
										isSmall
										isPrimary={false}
										label={ name }
										aria-pressed={false}
										onClick={
											() => setAttributes( { barType: key } )
										}
										style={ {
											border: ( barType === key ? '2px solid #2B6CB0' : '0' ),
											marginRight: '4px',
											width: '75px'
										} }
									>
										{icon}
									</Button>
								) )}
							</ButtonGroup>
						</PanelBody>

						{/* These are the wordpress and Kadence components mostly that are imported at the top */}
						<KadencePanelBody>

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

								allowEmpty={false}
								min={0.25}
								max={50}
								step={0.25}

							/>
							{ ( 'line' === barType ) && (
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
							) }
							<RangeControl
								label={__( 'Progress', 'kadence-blocks' )}
								value={progressAmount}
								onChange={( value ) => setAttributes( { progressAmount: value } )}
								min={0}
								max={progressMax}
								step={1}
							/>
							<RangeControl
								label={__( 'Max Progress', 'kadence-blocks' )}
								value={progressMax}
								onChange={( value ) => setAttributes( { progressMax: value } )}
								min={1}
								max={1000}
								step={1}
							/>

						</KadencePanelBody>

						<KadencePanelBody
							title={__( 'Progression', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-progress-bar-timing'}
						>
							<RangeControl
								label={__( 'Animation Duration', 'kadence-blocks' )}
								value={duration}
								onChange={( value ) => setAttributes( { duration: value } )}
								min={0.1}
								max={25}
								step={0.1}
							/>

							<RangeControl
								label={__( 'Delay Start', 'kadence-blocks' )}
								value={startDelay}
								onChange={( value ) => setAttributes( { startDelay: value } )}
								min={0}
								max={30}
								step={1}
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
							title={__( 'Percent Settings', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-progress-percentage-settings'}
						>
							<ToggleControl
								label={__( 'Show Percentage', 'kadence-blocks' )}
								checked={displayPercent}
								onChange={( value ) => setAttributes( { displayPercent: value } )}
							/>

							{displayPercent && (
								<Fragment>

									<h3>{ __( 'Percent Position', 'kadence-blocks' ) }</h3>
									<AlignmentMatrixControl
										label={__( 'Percent Position', 'kadence-blocks' )}
										value={percentPosition}
										onChange={ ( value ) => setAttributes( { percentPosition: value } ) }
										width={ 150 }
									/>

									<br/>

									<TextControl
										label={__( 'Number Suffix', 'kadence-blocks' )}
										value={numberSuffix}
										onChange={( value ) => setAttributes( { numberSuffix: value } )}
									/>

									{ progressMax !== 100 && (
										<ToggleControl
											label={__( 'Percentage relative to 100%', 'kadence-blocks' )}
											checked={numberIsRelative}
											onChange={( value ) => setAttributes( { numberIsRelative: value } )}
										/>
									)}


								</Fragment>
							)}

						</KadencePanelBody>
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

									<h3>{ __( 'Percent Position', 'kadence-blocks' ) }</h3>
									<AlignmentMatrixControl
										label={__( 'Label Position', 'kadence-blocks' )}
										value={labelPosition}
										onChange={( value ) => setAttributes( { labelPosition: value } )}
										width={ 150 }
									/>

									<br/>

									<PopColorControl
										label={__( 'Color Settings', 'kadence-blocks' )}
										value={( labelFont.color ? labelFont.color : '' )}
										default={''}
										onChange={value => saveLabelFont( { color: value } )}
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
										margin={labelFont.margin}
										onMargin={( value ) => saveLabelFont( { margin: value } )}
									/>
									</Fragment>
							)}
						</KadencePanelBody>

					</Fragment>

				)}

				{ activeTab === 'advanced' && (
					<KadencePanelBody>
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
							value={marginDesktop}
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
				)}

			</InspectorControls>
			<div style={
				{
					marginTop   : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),
					marginRight : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),
					marginBottom: ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),
					marginLeft  : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),
					maxWidth: ( previewContainerMaxWidth ? previewContainerMaxWidth + containerMaxWidthUnits : 'none' ),
					paddingTop: ( '' !== previewPaddingTop ? getSpacingOptionOutput( previewPaddingTop, paddingUnit ) : undefined ),
					paddingRight: ( '' !== previewPaddingRight ? getSpacingOptionOutput( previewPaddingRight, paddingUnit ) : undefined ),
					paddingBottom: ( '' !== previewPaddingBottom ? getSpacingOptionOutput( previewPaddingBottom, paddingUnit ) : undefined ),
					paddingLeft: ( '' !== previewPaddingLeft ? getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) : undefined ),
				}
			}>

				{ RenderLabels( 'top' ) }

				<ProgressItem animate={ progressAmount / progressMax } />

				{ RenderLabels( 'bottom') }
			</div>

			{labelFont.google && (
				<WebfontLoader config={ labelFontConfig }>
				</WebfontLoader>
			)}
		</div>
	);
}

export default ( Edit );
