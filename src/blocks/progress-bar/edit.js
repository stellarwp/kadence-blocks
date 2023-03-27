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
	KadencePanelBody,
	KadenceRadioButtons
} from '@kadence/components';

import {
	KadenceColorOutput,
	getPreviewSize,
	getSpacingOptionOutput,
	getFontSizeOptionOutput,
	setBlockDefaults,
	getUniqueId,
	getPostOrFseId
} from '@kadence/helpers';

import {
	lineBar,
	circleBar,
	semiCircleBar,
} from '@kadence/icons';
/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
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
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
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

export function Edit( props ) {

	const {
		attributes,
		setAttributes,
		isSelected,
		clientId,
	} = props;

	const {
		uniqueID,
		align,
		labelPadding,
		tabletLabelPadding,
		mobileLabelPadding,
		labelPaddingType,
		margin,
		tabletMargin,
		mobileMargin,
		marginType,
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
		numberFont,
		progressAmount,
		progressMax,
		displayPercent,
		numberSuffix,
		numberPrefix,
		numberIsRelative,
		duration,
		progressWidth,
		progressWidthTablet,
		progressWidthMobile,
		progressBorderRadius,
		easing,
		labelLayout,
		hAlign,
		thAlign,
		mhAlign,
		delayUntilInView,
	} = attributes;

	const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		( select ) => {
			return {
				isUniqueID   : ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
				isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
				previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
				parentData: {
					rootBlock: select( 'core/block-editor' ).getBlock( select( 'core/block-editor' ).getBlockHierarchyRootClientId( clientId ) ),
					postId: select( 'core/editor' ).getCurrentPostId(),
					reusableParent: select('core/block-editor').getBlockAttributes( select('core/block-editor').getBlockParentsByBlockName( clientId, 'core/block' ).slice(-1)[0] ),
					editedPostId: select( 'core/edit-site' ) ? select( 'core/edit-site' ).getEditedPostId() : false
				}
			};
		},
		[ clientId ],
	);

	useEffect( () => {
		setBlockDefaults( 'kadence/progress-bar', attributes );

		const postOrFseId = getPostOrFseId( props, parentData );
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId );
		if ( uniqueId !== uniqueID ) {
			attributes.uniqueID = uniqueId;
			setAttributes( { uniqueID: uniqueId } );
			addUniqueID( uniqueId, clientId );
		} else {
			addUniqueID( uniqueID, clientId );
		}

		if( barType !== 'line' && labelPosition === 'inside' ) {
			setAttributes( { hAlign: 'center', thAlign: '', mhAlign: '' } );
		}

	}, [] );

	const [ activeTab, setActiveTab ] = useState( 'general' );

	const previewMarginTop = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 0 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 0 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 0 ] : '' ) );
	const previewMarginRight = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 1 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 1 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 1 ] : '' ) );
	const previewMarginBottom = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 2 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 2 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 2 ] : '' ) );
	const previewMarginLeft = getPreviewSize( previewDevice, ( undefined !== margin ? margin[ 3 ] : '' ), ( undefined !== tabletMargin ? tabletMargin[ 3 ] : '' ), ( undefined !== mobileMargin ? mobileMargin[ 3 ] : '' ) );

	const previewLabelPaddingTop = getPreviewSize( previewDevice, ( undefined !== labelPadding ? labelPadding[ 0 ] : '' ), ( undefined !== tabletLabelPadding ? tabletLabelPadding[ 0 ] : '' ), ( undefined !== mobileLabelPadding ? mobileLabelPadding[ 0 ] : '' ) );
	const previewLabelPaddingRight = getPreviewSize( previewDevice, ( undefined !== labelPadding ? labelPadding[ 1 ] : '' ), ( undefined !== tabletLabelPadding ? tabletLabelPadding[ 1 ] : '' ), ( undefined !== mobileLabelPadding ? mobileLabelPadding[ 1 ] : '' ) );
	const previewLabelPaddingBottom = getPreviewSize( previewDevice, ( undefined !== labelPadding ? labelPadding[ 2 ] : '' ), ( undefined !== tabletLabelPadding ? tabletLabelPadding[ 2 ] : '' ), ( undefined !== mobileLabelPadding ? mobileLabelPadding[ 2 ] : '' ) );
	const previewLabelPaddingLeft = getPreviewSize( previewDevice, ( undefined !== labelPadding ? labelPadding[ 3 ] : '' ), ( undefined !== tabletLabelPadding ? tabletLabelPadding[ 3 ] : '' ), ( undefined !== mobileLabelPadding ? mobileLabelPadding[ 3 ] : '' ) );

	const previewProgressWidth = getPreviewSize( previewDevice, ( undefined !== progressWidth ? progressWidth : '' ), ( undefined !== progressWidthTablet ? progressWidthTablet : '' ), ( undefined !== progressWidthMobile ? progressWidthMobile : '' ) );
	const previewProgressBorderRadius = getPreviewSize( previewDevice, ( undefined !== progressBorderRadius[ 0 ] ? progressBorderRadius[ 0 ] : '' ), ( undefined !== progressBorderRadius[ 1 ] ? progressBorderRadius[ 1 ] : '' ), ( undefined !== progressBorderRadius[ 2 ] ? progressBorderRadius[ 2 ] : '' ) );

	const previewContainerMaxWidth = getPreviewSize( previewDevice, ( undefined !== containerMaxWidth ? containerMaxWidth : '' ), ( undefined !== tabletContainerMaxWidth ? tabletContainerMaxWidth : '' ), ( undefined !== mobileContainerMaxWidth ? mobileContainerMaxWidth : '' ) );

	const previewLabelFont = getPreviewSize( previewDevice, ( undefined !== labelFont.size && undefined !== labelFont.size[ 0 ] && '' !== labelFont.size[ 0 ] ? labelFont.size[ 0 ] : '' ), ( undefined !== labelFont.size && undefined !== labelFont.size[ 1 ] && '' !== labelFont.size[ 1 ] ? labelFont.size[ 1 ] : '' ), ( undefined !== labelFont.size && undefined !== labelFont.size[ 2 ] && '' !== labelFont.size[ 2 ] ? labelFont.size[ 2 ] : '' ) );
	const previewLabelLineHeight = getPreviewSize( previewDevice, ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 0 ] && '' !== labelFont.lineHeight[ 0 ] ? labelFont.lineHeight[ 0 ] : '' ), ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 1 ] && '' !== labelFont.lineHeight[ 1 ] ? labelFont.lineHeight[ 1 ] : '' ), ( undefined !== labelFont.lineHeight && undefined !== labelFont.lineHeight[ 2 ] && '' !== labelFont.lineHeight[ 2 ] ? labelFont.lineHeight[ 2 ] : '' ) );
	const previewNumberFont = getPreviewSize( previewDevice, ( undefined !== numberFont.size && undefined !== numberFont.size[ 0 ] && '' !== numberFont.size[ 0 ] ? numberFont.size[ 0 ] : '' ), ( undefined !== numberFont.size && undefined !== numberFont.size[ 1 ] && '' !== numberFont.size[ 1 ] ? numberFont.size[ 1 ] : '' ), ( undefined !== numberFont.size && undefined !== numberFont.size[ 2 ] && '' !== numberFont.size[ 2 ] ? numberFont.size[ 2 ] : '' ) );
	const previewNumberLineHeight = getPreviewSize( previewDevice, ( undefined !== numberFont.lineHeight && undefined !== numberFont.lineHeight[ 0 ] && '' !== numberFont.lineHeight[ 0 ] ? numberFont.lineHeight[ 0 ] : '' ), ( undefined !== numberFont.lineHeight && undefined !== numberFont.lineHeight[ 1 ] && '' !== numberFont.lineHeight[ 1 ] ? numberFont.lineHeight[ 1 ] : '' ), ( undefined !== numberFont.lineHeight && undefined !== numberFont.lineHeight[ 2 ] && '' !== numberFont.lineHeight[ 2 ] ? numberFont.lineHeight[ 2 ] : '' ) );
	const previewAlign = getPreviewSize( previewDevice, ( undefined !== hAlign ? hAlign : '' ), ( undefined !== thAlign ? thAlign : '' ), ( undefined !== mhAlign ? mhAlign : '' ) );

	const containerClasses = classnames( {
		'kb-progress-bar-container'               : true,
		[ `kb-progress-bar-container${uniqueID}` ]: true,
		[ `kb-progress-bar-type-${barType}` ]     : true,
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
		fontSize     : ( previewLabelFont ? getFontSizeOptionOutput( previewLabelFont, labelFont.sizeType ) : undefined ),
		lineHeight   : ( previewLabelLineHeight ? previewLabelLineHeight + labelFont.lineType : undefined ),
		letterSpacing: labelFont.letterSpacing + 'px',
		textTransform: ( labelFont.textTransform ? labelFont.textTransform : undefined ),
		fontFamily   : ( labelFont.family ? labelFont.family : '' ),
		padding      : ( labelFont.padding ? labelFont.padding[ 0 ] + 'px ' + labelFont.padding[ 1 ] + 'px ' + labelFont.padding[ 2 ] + 'px ' + labelFont.padding[ 3 ] + 'px' : '' ),
		margin       : ( labelFont.margin ? labelFont.margin[ 0 ] + 'px ' + labelFont.margin[ 1 ] + 'px ' + labelFont.margin[ 2 ] + 'px ' + labelFont.margin[ 3 ] + 'px' : '' ),
	};

	const progressPercentStyles = {
		fontWeight   : numberFont.weight ? numberFont.weight : progressLabelStyles.fontWeight,
		fontStyle    : numberFont.style ? numberFont.style : progressLabelStyles.fontStyle,
		color        : numberFont.color ? KadenceColorOutput( numberFont.color ) : progressLabelStyles.color,
		fontSize     : previewNumberFont ? ( previewNumberFont ? getFontSizeOptionOutput( previewNumberFont, numberFont.sizeType ) : undefined ) : progressLabelStyles.fontSize,
		lineHeight   : previewNumberLineHeight ? previewNumberLineHeight + numberFont.lineType : progressLabelStyles.lineHeight,
		letterSpacing: numberFont.letterSpacing ? numberFont.letterSpacing + 'px' : progressLabelStyles.letterSpacing,
		textTransform: numberFont.textTransform ? numberFont.textTransform : progressLabelStyles.textTransform,
		fontFamily   : ( numberFont.family ? numberFont.family : '' ),
		padding      : ( numberFont.padding ? numberFont.padding[ 0 ] + 'px ' + numberFont.padding[ 1 ] + 'px ' + numberFont.padding[ 2 ] + 'px ' + numberFont.padding[ 3 ] + 'px' : '' ),
		margin       : ( numberFont.margin ? numberFont.margin[ 0 ] + 'px ' + numberFont.margin[ 1 ] + 'px ' + numberFont.margin[ 2 ] + 'px ' + numberFont.margin[ 3 ] + 'px' : '' ),
	};

	const progressAttributes = {
		color      : KadenceColorOutput( progressColor, progressOpacity ),
		strokeWidth: previewProgressWidth,
		duration   : ( duration === 0 ? 1 : duration * 1000 ),
		easing     : easing,
		trailWidth : previewProgressWidth,
		trailColor : KadenceColorOutput( barBackground, barBackgroundOpacity ),
		svgStyle   : {
			borderRadius: ( barType === 'line' ? previewProgressBorderRadius + 'px' : '' ),
		},
		step       : function( state, bar ) {
			let iFrameSelector = document.getElementsByName( 'editor-canvas' );
			let selector = iFrameSelector.length > 0 ? document.getElementsByName( 'editor-canvas' )[ 0 ].contentWindow.document : document;

			let elementAbove = selector.getElementById( 'current-progress-above' + uniqueID );
			let elementInside = selector.getElementById( 'current-progress-inside' + uniqueID );
			let elementBelow = selector.getElementById( 'current-progress-below' + uniqueID );
			let value;

			if ( numberIsRelative ) {
				value = Math.round( bar.value() * 100 );
			} else {
				value = Math.round( bar.value() * progressMax );
			}

			if ( elementAbove && labelPosition === 'above' && displayPercent ) {
				elementAbove.innerHTML = numberPrefix + value + numberSuffix;
			} else if ( elementAbove ) {
				elementAbove.innerHTML = '';
			}

			if ( elementInside && labelPosition === 'inside' && displayPercent ) {
				elementInside.innerHTML = numberPrefix + value + numberSuffix;
			} else if ( elementInside ) {
				elementInside.innerHTML = '';
			}

			if ( elementBelow && labelPosition === 'below' && displayPercent ) {
				elementBelow.innerHTML = numberPrefix + value + numberSuffix;
			} else if ( elementBelow ) {
				elementBelow.innerHTML = '';
			}
		},
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
	}, [ progressAttributes, previewDevice ] );

	const ProgressItem = () => {
		const node = useCallback( node => {
			if ( node ) {
				node.appendChild( container );
			}
		}, [] );

		useEffect( () => {
			progress.animate( progressAmount / progressMax );
		}, [ previewDevice, progressAmount, progressMax ] );

		return <div ref={node}/>;
	};

	const saveLabelFont = ( value ) => {
		setAttributes( {
			labelFont: { ...labelFont, ...value },
		} );
	};

	const saveNumberFont = ( value ) => {
		setAttributes( {
			numberFont: { ...numberFont, ...value },
		} );
	};

	const RenderLabel = ( currentPosition ) => {
		if ( currentPosition !== labelPosition || ( !displayLabel && !displayPercent ) ) {
			return null;
		}

		let wrapperLayoutStyles = {
			paddingTop   : ( '' !== previewLabelPaddingTop ? getSpacingOptionOutput( previewLabelPaddingTop, labelPaddingType ) : undefined ),
			paddingRight : ( '' !== previewLabelPaddingRight ? getSpacingOptionOutput( previewLabelPaddingRight, labelPaddingType ) : undefined ),
			paddingBottom: ( '' !== previewLabelPaddingBottom ? getSpacingOptionOutput( previewLabelPaddingBottom, labelPaddingType ) : undefined ),
			paddingLeft  : ( '' !== previewLabelPaddingLeft ? getSpacingOptionOutput( previewLabelPaddingLeft, labelPaddingType ) : undefined ),
		};

		if ( previewAlign === 'space-between' ) {
			wrapperLayoutStyles.justifyContent = 'space-between';
		} else if ( previewAlign === 'center' ) {
			wrapperLayoutStyles.justifyContent = 'center';
			wrapperLayoutStyles.textAlign = 'center';
		} else if ( previewAlign === 'left' ) {
			wrapperLayoutStyles.justifyContent = 'flex-start';
		} else if ( previewAlign === 'right' ) {
			wrapperLayoutStyles.textAlign = 'right';
			wrapperLayoutStyles.justifyContent = 'flex-end';
		}

		if ( labelLayout === 'lt' || labelLayout === 'lb' ) {
			wrapperLayoutStyles.flexDirection = 'column';
		}

		if ( labelPosition === 'inside' && previewAlign === 'center' ) {
			wrapperLayoutStyles.transform = 'translateX(-50%) translateY(-50%)';
			wrapperLayoutStyles.left = '50%';
		} else if ( labelPosition === 'inside' && previewAlign === 'right' ) {
			wrapperLayoutStyles.right = '0%';
		}

		if ( barType === 'line' && labelPosition === 'inside' && previewAlign === 'space-between' ) {
			wrapperLayoutStyles.width = '100%';
		}

		return (
			<div
				className={'kb-progress-label-wrap ' + ( currentPosition === 'inside' ? 'kt-progress-label-inside' : '' )}
				style={wrapperLayoutStyles}
			>

				{displayPercent && ( labelLayout === 'lb' || labelLayout === 'pl' ) ? <span id={'current-progress-' + currentPosition + uniqueID} style={progressPercentStyles}></span> : null}

				{displayLabel &&
					<RichText
						tagName={'span'}
						value={label}
						onChange={( value ) => {
							setAttributes( { label: value } );
						}}
						placeholder={__( 'Progress', 'kadence-blocks' )}
						style={progressLabelStyles}
						className={'kt-progress-label'}
					/>
				}

				{displayPercent && ( labelLayout === 'lt' || labelLayout === 'lp' ) ? <span id={'current-progress-' + currentPosition + uniqueID} style={progressPercentStyles}></span> : null}

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
							<ButtonGroup className="kt-style-btn-group kb-info-layouts" aria-label={__( 'Progress Bar Layout', 'kadence-blocks' )}>
								{map( layoutPresetOptions, ( { name, key, icon } ) => (
									<Button
										key={key}
										className="kt-style-btn"
										isSmall
										isPrimary={false}
										label={name}
										aria-pressed={false}
										onClick={
											() => setAttributes( { barType: key } )
										}
										style={{
											border     : ( barType === key ? '2px solid #2B6CB0' : '0' ),
											marginRight: '4px',
											width      : '75px',
										}}
									>
										{icon}
									</Button>
								) )}
							</ButtonGroup>
						</PanelBody>

						{/* These are the wordpress and Kadence components mostly that are imported at the top */}
						<KadencePanelBody>
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
							{( 'line' === barType ) && (
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
							)}
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
							title={__( 'Number Settings', 'kadence-blocks' )}
							initialOpen={true}
							panelName={'kb-progress-percentage-settings'}
						>
							<ToggleControl
								label={__( 'Show Number', 'kadence-blocks' )}
								checked={displayPercent}
								onChange={( value ) => setAttributes( { displayPercent: value } )}
							/>

							{displayPercent && (
								<Fragment>
									<TextControl
										label={__( 'Number Prefix', 'kadence-blocks' )}
										value={numberPrefix}
										onChange={( value ) => setAttributes( { numberPrefix: value } )}
									/>
									<TextControl
										label={__( 'Number Suffix', 'kadence-blocks' )}
										value={numberSuffix}
										onChange={( value ) => setAttributes( { numberSuffix: value } )}
									/>
									{progressMax !== 100 && (
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
							title={__( 'Animation', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-progress-bar-timing'}
						>
							<RangeControl
								label={__( 'Duration', 'kadence-blocks' )}
								value={duration}
								onChange={( value ) => setAttributes( { duration: value } )}
								min={0}
								max={25}
								step={0.1}
							/>

							<ToggleControl
								label={__( 'Wait until visible to animate', 'kadence-blocks' )}
								help={__( 'The animation wont start until the progress bar is visible in the viewport. This does not apply in the editor', 'kadence-blocks' )}
								checked={delayUntilInView}
								onChange={( value ) => setAttributes( { delayUntilInView: value } )}
							/>

							<SelectControl
								label={__( 'Type', 'kadence-blocks' )}
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
						<KadencePanelBody>
							<KadenceRadioButtons
								label={__( 'Letter Case', 'kadence-blocks' )}
								value={ labelPosition }
								options={ [
									{ value: 'above', label: __( 'Above', 'kadence-blocks' ) },
									{ value: 'inside', label: __( 'Inside', 'kadence-blocks' ) },
									{ value: 'below', label: __( 'Below', 'kadence-blocks' ) },
								] }
								className={ 'kb-letter-case' }
								allowClear={ false }
								onChange={( value ) => setAttributes( { labelPosition: value } )}
							/>

							{labelPosition !== 'inside' || barType === 'line' ? ( <ResponsiveAlignControls
								label={__( 'Text Alignment', 'kadence-blocks' )}
								value={( hAlign ? hAlign : '' )}
								mobileValue={( mhAlign ? mhAlign : '' )}
								tabletValue={( thAlign ? thAlign : '' )}
								onChange={( nextAlign ) => setAttributes( { hAlign: ( nextAlign ? nextAlign : 'space-between' ) } )}
								onChangeTablet={( nextAlign ) => setAttributes( { thAlign: ( nextAlign ? nextAlign : '' ) } )}
								onChangeMobile={( nextAlign ) => setAttributes( { mhAlign: ( nextAlign ? nextAlign : '' ) } )}
								type={'justify'}
							/> ) : null}

							{displayLabel && displayPercent ? (
								<SelectControl
									label={__( 'Text Layout', 'kadence-blocks' )}
									options={[
										{ value: 'lp', label: __( 'Label then %', 'kadence-blocks' ) },
										{ value: 'pl', label: __( '% then Label', 'kadence-blocks' ) },
										{ value: 'lt', label: __( 'Label above %', 'kadence-blocks' ) },
										{ value: 'lb', label: __( 'Label below %', 'kadence-blocks' ) },
									]}
									value={labelLayout}
									onChange={( value ) => setAttributes( { labelLayout: value } )}
								/>
							) : null}

							<ToggleControl
								label={__( 'Show Label', 'kadence-blocks' )}
								checked={displayLabel}
								onChange={( value ) => setAttributes( { displayLabel: value } )}
							/>

							<ToggleControl
								label={__( 'Show Number', 'kadence-blocks' )}
								checked={displayPercent}
								onChange={( value ) => setAttributes( { displayPercent: value } )}
							/>
						</KadencePanelBody>

						{displayPercent || displayLabel ? (
								<KadencePanelBody
									title={__( 'Text Styling', 'kadence-blocks' )}
									initialOpen={false}
									panelName={'kb-progress-text-settings'}
								>
									<PopColorControl
										label={__( 'Color Settings', 'kadence-blocks' )}
										value={( labelFont.color ? labelFont.color : '' )}
										default={''}
										onChange={value => saveLabelFont( { color: value } )}
									/>
									<TypographyControls
										fontGroup={'heading'}
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

									<ResponsiveMeasureRangeControl
										label={__( 'Padding', 'kadence-blocks' )}
										value={labelPadding}
										tabletValue={tabletLabelPadding}
										mobileValue={mobileLabelPadding}
										onChange={( value ) => {
											setAttributes( { labelPadding: value } );
										}}
										onChangeTablet={( value ) => setAttributes( { tabletLabelPadding: value } )}
										onChangeMobile={( value ) => setAttributes( { mobileLabelPadding: value } )}
										min={( labelPaddingType === 'em' || labelPaddingType === 'rem' ? -12 : -200 )}
										max={( labelPaddingType === 'em' || labelPaddingType === 'rem' ? 24 : 200 )}
										step={( labelPaddingType === 'em' || labelPaddingType === 'rem' ? 0.1 : 1 )}
										unit={labelPaddingType}
										units={[ 'px', 'em', 'rem', '%', 'vh' ]}
										onUnit={( value ) => setAttributes( { labelPaddingType: value } )}
										// onMouseOver={ labelPaddingMouseOver.onMouseOver }
										// onMouseOut={ labelPaddingMouseOver.onMouseOut }
									/>
								</KadencePanelBody> )
							: null}

						{displayPercent && ( <KadencePanelBody
							title={__( 'Number Styling', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-progress-text-settings'}
						>
							<PopColorControl
								label={__( 'Color Settings', 'kadence-blocks' )}
								value={( numberFont.color ? numberFont.color : '' )}
								default={''}
								onChange={value => saveNumberFont( { color: value } )}
							/>
							<TypographyControls
								fontGroup={'heading'}
								fontSize={numberFont.size}
								onFontSize={( value ) => saveNumberFont( { size: value } )}
								fontSizeType={numberFont.sizeType}
								onFontSizeType={( value ) => saveNumberFont( { sizeType: value } )}
								lineHeight={numberFont.lineHeight}
								onLineHeight={( value ) => saveNumberFont( { lineHeight: value } )}
								lineHeightType={numberFont.lineType}
								onLineHeightType={( value ) => saveNumberFont( { lineType: value } )}
								letterSpacing={numberFont.letterSpacing}
								onLetterSpacing={( value ) => saveNumberFont( { letterSpacing: value } )}
								textTransform={numberFont.textTransform}
								onTextTransform={( value ) => saveNumberFont( { textTransform: value } )}
								fontFamily={numberFont.family}
								onFontFamily={( value ) => saveNumberFont( { family: value } )}
								onFontChange={( select ) => {
									saveNumberFont( {
										family: select.value,
										google: select.google,
									} );
								}}
								onFontArrayChange={( values ) => saveNumberFont( values )}
								googleFont={numberFont.google}
								onGoogleFont={( value ) => saveNumberFont( { google: value } )}
								loadGoogleFont={numberFont.loadGoogle}
								onLoadGoogleFont={( value ) => saveNumberFont( { loadGoogle: value } )}
								fontVariant={numberFont.variant}
								onFontVariant={( value ) => saveNumberFont( { variant: value } )}
								fontWeight={numberFont.weight}
								onFontWeight={( value ) => saveNumberFont( { weight: value } )}
								fontStyle={numberFont.style}
								onFontStyle={( value ) => saveNumberFont( { style: value } )}
								fontSubset={numberFont.subset}
								onFontSubset={( value ) => saveNumberFont( { subset: value } )}
								padding={numberFont.padding}
								onPadding={( value ) => saveNumberFont( { padding: value } )}
								margin={numberFont.margin}
								onMargin={( value ) => saveNumberFont( { margin: value } )}
							/>

							<ResponsiveMeasureRangeControl
								label={__( 'Padding', 'kadence-blocks' )}
								value={labelPadding}
								tabletValue={tabletLabelPadding}
								mobileValue={mobileLabelPadding}
								onChange={( value ) => {
									setAttributes( { labelPadding: value } );
								}}
								onChangeTablet={( value ) => setAttributes( { tabletLabelPadding: value } )}
								onChangeMobile={( value ) => setAttributes( { mobileLabelPadding: value } )}
								min={( labelPaddingType === 'em' || labelPaddingType === 'rem' ? -12 : -200 )}
								max={( labelPaddingType === 'em' || labelPaddingType === 'rem' ? 24 : 200 )}
								step={( labelPaddingType === 'em' || labelPaddingType === 'rem' ? 0.1 : 1 )}
								unit={labelPaddingType}
								units={[ 'px', 'em', 'rem', '%', 'vh' ]}
								onUnit={( value ) => setAttributes( { labelPaddingType: value } )}
								// onMouseOver={ labelPaddingMouseOver.onMouseOver }
								// onMouseOut={ labelPaddingMouseOver.onMouseOut }
							/>
						</KadencePanelBody> )}

						<KadencePanelBody
							title={__( 'Progress Color', 'kadence-blocks' )}
							initialOpen={false}
							panelName={'kb-progress-number-settings'}
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
						</KadencePanelBody>
					</Fragment>

				)}

				{activeTab === 'advanced' && (
					<KadencePanelBody>
						<ResponsiveRangeControls
							label={__( 'Width', 'kadence-blocks' )}
							value={containerMaxWidth}
							onChange={value => setAttributes( { containerMaxWidth: value } )}
							tabletValue={( tabletContainerMaxWidth ? tabletContainerMaxWidth : '' )}
							onChangeTablet={( value ) => setAttributes( { tabletContainerMaxWidth: value } )}
							mobileValue={( mobileContainerMaxWidth ? mobileContainerMaxWidth : '' )}
							onChangeMobile={( value ) => setAttributes( { mobileContainerMaxWidth: value } )}
							min={0}
							max={( containerMaxWidthUnits === 'px' ? 3000 : 100 )}
							step={1}
							unit={containerMaxWidthUnits}
							onUnit={( value ) => setAttributes( { containerMaxWidthUnits: value } )}
							reset={() => setAttributes( { containerMaxWidth: 0, tabletContainerMaxWidth: '', mobileContainerMaxWidth: '' } )}
							units={[ 'px', 'vh', '%' ]}
						/>
						<ResponsiveMeasureRangeControl
							label={__( 'Margin', 'kadence-blocks' )}
							value={margin}
							tabletValue={tabletMargin}
							mobileValue={mobileMargin}
							onChange={( value ) => {
								setAttributes( { margin: value } );
							}}
							onChangeTablet={( value ) => setAttributes( { tabletMargin: value } )}
							onChangeMobile={( value ) => setAttributes( { mobileMargin: value } )}
							min={( marginType === 'em' || marginType === 'rem' ? -12 : -200 )}
							max={( marginType === 'em' || marginType === 'rem' ? 24 : 200 )}
							step={( marginType === 'em' || marginType === 'rem' ? 0.1 : 1 )}
							unit={marginType}
							units={[ 'px', 'em', 'rem', '%', 'vh' ]}
							onUnit={( value ) => setAttributes( { marginType: value } )}
							// onMouseOver={ marginMouseOver.onMouseOver }
							// onMouseOut={ marginMouseOver.onMouseOut }
						/>
					</KadencePanelBody>
				)}

			</InspectorControls>
			<div style={
				{
					position    : 'relative',
					marginTop   : ( '' !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginType ) : undefined ),
					marginRight : ( '' !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginType ) : undefined ),
					marginBottom: ( '' !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginType ) : undefined ),
					marginLeft  : ( '' !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginType ) : undefined ),
					width       : ( previewContainerMaxWidth ? previewContainerMaxWidth + containerMaxWidthUnits : 'none' ),
				}
			}>

				{RenderLabel( 'above' )}

				<ProgressItem/>

				{RenderLabel( 'inside' )}

				{RenderLabel( 'below' )}
			</div>

			{labelFont.google && ( <WebfontLoader config={labelFontConfig}></WebfontLoader> )}

			{displayPercent && labelFont.google ?
				( <WebfontLoader config={labelFontConfig}></WebfontLoader> ) : null
			}
		</div>
	);
}

export default ( Edit );
