/**
 * Import Css
 */
import './editor.scss';
import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useSelect, useDispatch } from '@wordpress/data';
import { TextControl, ToggleControl, SelectControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
import {
	ResponsiveRangeControls,
	InspectorControlTabs,
	KadenceInspectorControls,
	KadencePanelBody,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
	KadenceRadioButtons,
	PopColorControl,
	TypographyControls,
	ResponsiveMeasurementControls,
	SmallResponsiveControl,
	IconRender,
	HoverToggleControl,
	ResponsiveBorderControl,
	KadenceIconPicker,
	KadenceWebfontLoader,
	BackgroundTypeControl,
	GradientControl,
	BoxShadowControl,
	SelectParentBlock,
	ResponsiveButtonStyleControlsWithStates,
} from '@kadence/components';
import {
	setBlockDefaults,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	getUniqueId,
	getPostOrFseId,
	getPreviewSize,
	KadenceColorOutput,
	showSettings,
	getFontSizeOptionOutput,
	useEditorElement,
	getBorderStyle,
	getBorderColor,
} from '@kadence/helpers';

import { useBlockProps, BlockControls, RichText, useInnerBlocksProps } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import { applyFilters } from '@wordpress/hooks';
import BackendStyles from './backend-styles';

/**
 * External dependencies
 */
import classnames from 'classnames';

export function Edit(props) {
	const { attributes, setAttributes, className, isSelected, context, clientId } = props;

	const {
		uniqueID,
		displayStyle,
		showButton,
		sizePreset,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		inputTypography,
		label,
		marginUnit,
		margin,
		iconSizeUnit,
		tabletMargin,
		mobileMargin,
		hAlign,
		thAlign,
		mhAlign,
		inputPlaceholder,
		inputColor,
		inputBorderRadius,
		tabletInputBorderRadius,
		mobileInputBorderRadius,
		inputBorderRadiusUnit,
		inputPadding,
		inputTabletPadding,
		inputMobilePadding,
		inputPaddingType,
		inputBackgroundType,
		inputFocusBackgroundType,
		inputFocusBackgroundColor,
		inputFocusGradientActive,
		inputFocusBoxShadowActive,
		inputFocusBorderColor,
		inputPlaceholderColor,
		inputBackgroundColor,
		inputGradient,
		inputBoxShadow,
		inputBorderStyles,
		tabletInputBorderStyles,
		mobileInputBorderStyles,
		modalBackgroundColor,
		searchProductsOnly,
	} = attributes;

	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
		(select) => {
			return {
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				parentData: {
					rootBlock: select('core/block-editor').getBlock(
						select('core/block-editor').getBlockHierarchyRootClientId(clientId)
					),
					postId: select('core/editor')?.getCurrentPostId() ? select('core/editor')?.getCurrentPostId() : '',
					reusableParent: select('core/block-editor').getBlockAttributes(
						select('core/block-editor').getBlockParentsByBlockName(clientId, 'core/block').slice(-1)[0]
					),
					editedPostId: select('core/edit-site') ? select('core/edit-site').getEditedPostId() : false,
				},
			};
		},
		[clientId]
	);

	useEffect(() => {
		setBlockDefaults('kadence/search', attributes);

		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueID, clientId);
		}
	}, []);

	const [activeTab, setActiveTab] = useState('general');
	const [isShowingModal, setIsShowingModal] = useState(false);

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const ref = useRef();
	const editorElement = useEditorElement(ref, [previewDevice], 'editor-visual-editor');
	const editorWidth = editorElement?.clientWidth;

	const saveInputTypography = (value) => {
		const newUpdate = inputTypography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setAttributes({
			inputTypography: newUpdate,
		});
	};

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin?.[0] ? margin[0] : '',
		undefined !== tabletMargin?.[0] ? tabletMargin[0] : '',
		undefined !== mobileMargin?.[0] ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin?.[1] ? margin[1] : '',
		undefined !== tabletMargin?.[1] ? tabletMargin[1] : '',
		undefined !== mobileMargin?.[1] ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin?.[2] ? margin[2] : '',
		undefined !== tabletMargin?.[2] ? tabletMargin[2] : '',
		undefined !== mobileMargin?.[2] ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin?.[3] ? margin[3] : '',
		undefined !== tabletMargin?.[3] ? tabletMargin[3] : '',
		undefined !== mobileMargin?.[3] ? mobileMargin[3] : ''
	);
	const previewMarginUnit = marginUnit ? marginUnit : 'px';

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding?.[0] ? padding[0] : '',
		undefined !== tabletPadding?.[0] ? tabletPadding[0] : '',
		undefined !== mobilePadding?.[0] ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding?.[1] ? padding[1] : '',
		undefined !== tabletPadding?.[1] ? tabletPadding[1] : '',
		undefined !== mobilePadding?.[1] ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding?.[2] ? padding[2] : '',
		undefined !== tabletPadding?.[2] ? tabletPadding[2] : '',
		undefined !== mobilePadding?.[2] ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding?.[3] ? padding[3] : '',
		undefined !== tabletPadding?.[3] ? tabletPadding[3] : '',
		undefined !== mobilePadding?.[3] ? mobilePadding[3] : ''
	);

	const previewInputBorderRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== inputBorderRadius ? inputBorderRadius[0] : '',
		undefined !== tabletInputBorderRadius ? tabletInputBorderRadius[0] : '',
		undefined !== mobileInputBorderRadius ? mobileInputBorderRadius[0] : ''
	);
	const previewInputBorderRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== inputBorderRadius ? inputBorderRadius[1] : '',
		undefined !== tabletInputBorderRadius ? tabletInputBorderRadius[1] : '',
		undefined !== mobileInputBorderRadius ? mobileInputBorderRadius[1] : ''
	);
	const previewInputBorderRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== inputBorderRadius ? inputBorderRadius[2] : '',
		undefined !== tabletInputBorderRadius ? tabletInputBorderRadius[2] : '',
		undefined !== mobileInputBorderRadius ? mobileInputBorderRadius[2] : ''
	);
	const previewInputBorderRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== inputBorderRadius ? inputBorderRadius[3] : '',
		undefined !== tabletInputBorderRadius ? tabletInputBorderRadius[3] : '',
		undefined !== mobileInputBorderRadius ? mobileInputBorderRadius[3] : ''
	);

	const previewInputPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[0] : '',
		undefined !== inputTabletPadding ? inputTabletPadding[0] : '',
		undefined !== inputMobilePadding ? inputMobilePadding[0] : ''
	);
	const previewInputPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[1] : '',
		undefined !== inputTabletPadding ? inputTabletPadding[1] : '',
		undefined !== inputMobilePadding ? inputMobilePadding[1] : ''
	);
	const previewInputPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[2] : '',
		undefined !== inputTabletPadding ? inputTabletPadding[2] : '',
		undefined !== inputMobilePadding ? inputMobilePadding[2] : ''
	);
	const previewInputPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== inputPadding ? inputPadding[3] : '',
		undefined !== inputTabletPadding ? inputTabletPadding[3] : '',
		undefined !== inputMobilePadding ? inputMobilePadding[3] : ''
	);

	const nonTransAttrs = ['text'];
	const classes = classnames({
		className,
		[`kb-search`]: true,
		[`kb-search${uniqueID}`]: true,
	});
	const blockProps = useBlockProps({
		className: classes,
	});

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: '',
			style: {},
		},
		{
			templateLock: 'all',
			renderAppender: false,
			template: [
				[
					'kadence/advancedbtn',
					{ lock: { remove: true, move: true } },
					[
						[
							'kadence/singlebtn',
							{
								lock: { remove: true, move: true },
								hideLink: true,
								text: __('Search', 'kadence-blocks'),
								noCustomDefaults: true,
								isSubmit: true,
							},
						],
					],
				],
			],
		}
	);

	const renderInputField = () => {
		return (
			<input
				id={'kb-search-input' + uniqueID}
				className={'kb-search-input'}
				disabled={true}
				type="text"
				placeholder={inputPlaceholder}
				style={{
					color: inputColor ? KadenceColorOutput(inputColor) : undefined,
					fontSize: getFontSizeOptionOutput(inputTypography[0].size, inputTypography[0].sizeType),
					lineHeight:
						inputTypography[0].lineHeight && inputTypography[0].lineHeight[0]
							? inputTypography[0].lineHeight[0] + inputTypography[0].lineType
							: undefined,
					fontWeight: inputTypography[0].weight,
					fontStyle: inputTypography[0].style,
					letterSpacing: inputTypography[0].letterSpacing + 'px',
					textTransform: inputTypography[0].textTransform,
					fontFamily: inputTypography[0].family,
					borderTopLeftRadius: previewInputBorderRadiusTop + (inputBorderRadiusUnit || 'px'),
					borderTopRightRadius: previewInputBorderRadiusRight + (inputBorderRadiusUnit || 'px'),
					borderBottomRightRadius: previewInputBorderRadiusBottom + (inputBorderRadiusUnit || 'px'),
					borderBottomLeftRadius: previewInputBorderRadiusLeft + (inputBorderRadiusUnit || 'px'),
					paddingTop: previewInputPaddingTop + (inputPaddingType || 'px'),
					paddingRight: previewInputPaddingRight + (inputPaddingType || 'px'),
					paddingBottom: previewInputPaddingBottom + (inputPaddingType || 'px'),
					paddingLeft: previewInputPaddingLeft + (inputPaddingType || 'px'),
					// borderTop: getBorderStyle(
					// 	previewDevice,
					// 	'top',
					// 	contentBorderStyle,
					// 	tabletContentBorderStyle,
					// 	mobileContentBorderStyle
					// ),
					// borderRight: getBorderStyle(
					// 	previewDevice,
					// 	'right',
					// 	contentBorderStyle,
					// 	tabletContentBorderStyle,
					// 	mobileContentBorderStyle
					// ),
					// borderBottom: getBorderStyle(
					// 	previewDevice,
					// 	'bottom',
					// 	contentBorderStyle,
					// 	tabletContentBorderStyle,
					// 	mobileContentBorderStyle
					// ),
					// borderLeft: getBorderStyle(
					// 	previewDevice,
					// 	'left',
					// 	contentBorderStyle,
					// 	tabletContentBorderStyle,
					// 	mobileContentBorderStyle
					// ),
				}}
			/>
		);
	};

	const saveStyleBoxShadowActive = (value, index) => {
		const newItems = inputFocusBoxShadowActive.map((item, thisIndex) => {
			if (index === thisIndex) {
				item = value;
			}

			return item;
		});

		setAttributes({ inputFocusBoxShadowActive: newItems });
	};

	const saveInputBoxShadow = (value, index) => {
		const newItems = inputBoxShadow.map((item, thisIndex) => {
			if (index === thisIndex) {
				item = value;
			}

			return item;
		});

		setAttributes({ inputBoxShadow: newItems });
	};

	return (
		<>
			<BackendStyles {...props} previewDevice={previewDevice} />
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
				{displayStyle === 'modal' && (
					<ToolbarGroup>
						<ToolbarButton
							className="components-tab-button"
							isPressed={isShowingModal}
							onClick={() => setIsShowingModal(!isShowingModal)}
						>
							<span>{__('Show Modal', 'kadence-blocks')}</span>
						</ToolbarButton>
					</ToolbarGroup>
				)}
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/search'}>
				<InspectorControlTabs panelName={'kadence-search'} setActiveTab={setActiveTab} activeTab={activeTab} />

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							initialOpen={true}
							panelName={'kadence-search-general'}
							blockSlug={'kadence/search'}
						>
							<KadenceRadioButtons
								label={__('Search Style', 'kadence-blocks')}
								value={displayStyle}
								options={[
									{ value: 'standard', label: __('Standard', 'kadence-blocks') },
									{ value: 'modal', label: __('Modal', 'kadence-blocks') },
								]}
								hideLabel={false}
								onChange={(value) => {
									setAttributes({
										displayStyle: value,
									});
								}}
							/>

							{kadence_blocks_params.hasWoocommerce && (
								<ToggleControl
									label={__('Search products only', 'kadence-blocks')}
									checked={searchProductsOnly}
									onChange={(value) => setAttributes({ searchProductsOnly: value })}
								/>
							)}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<>
						{displayStyle === 'modal' && (
							<KadencePanelBody
								title={__('Modal Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-btn-modal'}
							>
								<PopColorControl
									label={__('Background Color', 'kadence-blocks')}
									value={modalBackgroundColor}
									default={''}
									onChange={(value) => {
										setAttributes({ modalBackgroundColor: value });
									}}
								/>
							</KadencePanelBody>
						)}

						<KadencePanelBody
							title={__('Input Styling', 'kadence-blocks')}
							initialOpen={true}
							panelName={'search-input-settings'}
						>
							<PopColorControl
								label={__('Text Color', 'kadence-blocks')}
								value={inputColor}
								default={''}
								onChange={(value) => {
									setAttributes({ inputColor: value });
								}}
							/>
							<PopColorControl
								label={__('Placeholder Text Color', 'kadence-blocks')}
								value={inputPlaceholderColor}
								default={''}
								onChange={(value) => {
									setAttributes({ inputPlaceholderColor: value });
								}}
							/>

							<TextControl
								label={__('Placeholder Text', 'kadence-blocks')}
								value={inputPlaceholder}
								onChange={(value) => setAttributes({ inputPlaceholder: value })}
							/>

							<TypographyControls
								fontSize={inputTypography[0].size}
								onFontSize={(value) => saveInputTypography({ size: value })}
								fontSizeType={inputTypography[0].sizeType}
								onFontSizeType={(value) => saveInputTypography({ sizeType: value })}
								lineHeight={inputTypography[0].lineHeight}
								onLineHeight={(value) => saveInputTypography({ lineHeight: value })}
								lineHeightType={inputTypography[0].lineType}
								onLineHeightType={(value) => saveInputTypography({ lineType: value })}
								reLetterSpacing={inputTypography[0].letterSpacing}
								onLetterSpacing={(value) => saveInputTypography({ letterSpacing: value })}
								letterSpacingType={inputTypography[0].letterType}
								onLetterSpacingType={(value) => saveInputTypography({ letterType: value })}
								textTransform={inputTypography[0].textTransform}
								onTextTransform={(value) => saveInputTypography({ textTransform: value })}
								fontFamily={inputTypography[0].family}
								onFontFamily={(value) => saveInputTypography({ family: value })}
								onFontChange={(select) => {
									saveInputTypography({
										family: select.value,
										google: select.google,
									});
								}}
								onFontArrayChange={(values) => saveInputTypography(values)}
								googleFont={inputTypography[0].google}
								onGoogleFont={(value) => saveInputTypography({ google: value })}
								loadGoogleFont={inputTypography[0].loadGoogle}
								onLoadGoogleFont={(value) => saveInputTypography({ loadGoogle: value })}
								fontVariant={inputTypography[0].variant}
								onFontVariant={(value) => saveInputTypography({ variant: value })}
								fontWeight={inputTypography[0].weight}
								onFontWeight={(value) => saveInputTypography({ weight: value })}
								fontStyle={inputTypography[0].style}
								onFontStyle={(value) => saveInputTypography({ style: value })}
								fontSubset={inputTypography[0].subset}
								onFontSubset={(value) => saveInputTypography({ subset: value })}
							/>

							<ResponsiveMeasurementControls
								label={__('Border Radius', 'kadence-blocks')}
								value={inputBorderRadius}
								tabletValue={tabletInputBorderRadius}
								mobileValue={mobileInputBorderRadius}
								onChange={(value) => setAttributes({ inputBorderRadius: value })}
								onChangeTablet={(value) => setAttributes({ tabletInputBorderRadius: value })}
								onChangeMobile={(value) => setAttributes({ mobileInputBorderRadius: value })}
								min={0}
								max={inputBorderRadiusUnit === 'em' || inputBorderRadiusUnit === 'rem' ? 24 : 100}
								step={inputBorderRadiusUnit === 'em' || inputBorderRadiusUnit === 'rem' ? 0.1 : 1}
								unit={inputBorderRadiusUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ inputBorderRadiusUnit: value })}
								isBorderRadius={true}
								allowEmpty={true}
							/>

							<HoverToggleControl
								hover={
									<>
										<BackgroundTypeControl
											label={__('Focus Type', 'kadence-blocks')}
											type={inputFocusBackgroundType}
											onChange={(value) => setAttributes({ inputFocusBackgroundType: value })}
											allowedTypes={['normal', 'gradient']}
										/>
										{'gradient' !== inputFocusBackgroundType && (
											<PopColorControl
												label={__('Input Focus Background', 'kadence-blocks')}
												value={inputFocusBackgroundColor}
												default={''}
												onChange={(value) => {
													setAttributes({ inputFocusBackgroundColor: value });
												}}
											/>
										)}
										{'gradient' === inputFocusBackgroundType && (
											<GradientControl
												value={inputFocusGradientActive}
												onChange={(value) => setAttributes({ inputFocusGradientActive: value })}
												gradients={[]}
											/>
										)}
										<BoxShadowControl
											label={__('Input Focus Box Shadow', 'kadence-blocks')}
											enable={
												undefined !== inputFocusBoxShadowActive[0]
													? inputFocusBoxShadowActive[0]
													: false
											}
											color={
												undefined !== inputFocusBoxShadowActive[1]
													? inputFocusBoxShadowActive[1]
													: '#000000'
											}
											default={'#000000'}
											opacity={
												undefined !== inputFocusBoxShadowActive[2]
													? inputFocusBoxShadowActive[2]
													: 0.4
											}
											hOffset={
												undefined !== inputFocusBoxShadowActive[3]
													? inputFocusBoxShadowActive[3]
													: 2
											}
											vOffset={
												undefined !== inputFocusBoxShadowActive[4]
													? inputFocusBoxShadowActive[4]
													: 2
											}
											blur={
												undefined !== inputFocusBoxShadowActive[5]
													? inputFocusBoxShadowActive[5]
													: 3
											}
											spread={
												undefined !== inputFocusBoxShadowActive[6]
													? inputFocusBoxShadowActive[6]
													: 0
											}
											inset={
												undefined !== inputFocusBoxShadowActive[7]
													? inputFocusBoxShadowActive[7]
													: false
											}
											onEnableChange={(value) => {
												saveStyleBoxShadowActive(value, 0);
											}}
											onColorChange={(value) => {
												saveStyleBoxShadowActive(value, 1);
											}}
											onOpacityChange={(value) => {
												saveStyleBoxShadowActive(value, 2);
											}}
											onHOffsetChange={(value) => {
												saveStyleBoxShadowActive(value, 3);
											}}
											onVOffsetChange={(value) => {
												saveStyleBoxShadowActive(value, 4);
											}}
											onBlurChange={(value) => {
												saveStyleBoxShadowActive(value, 5);
											}}
											onSpreadChange={(value) => {
												saveStyleBoxShadowActive(value, 6);
											}}
											onInsetChange={(value) => {
												saveStyleBoxShadowActive(value, 7);
											}}
										/>
										<PopColorControl
											label={__('Input Focus Border', 'kadence-blocks')}
											value={inputFocusBorderColor}
											default={''}
											onChange={(value) => {
												setAttributes({ inputFocusBorderColor: KadenceColorOutput(value) });
											}}
										/>
									</>
								}
								normal={
									<>
										<BackgroundTypeControl
											label={__('Background Type', 'kadence-blocks')}
											type={inputBackgroundType}
											onChange={(value) => setAttributes({ inputBackgroundType: value })}
											allowedTypes={['normal', 'gradient']}
										/>
										{'gradient' !== inputBackgroundType && (
											<PopColorControl
												label={__('Input Background', 'kadence-blocks')}
												value={inputBackgroundColor}
												default={''}
												onChange={(value) => {
													setAttributes({ inputBackgroundColor: value });
												}}
											/>
										)}
										{'gradient' === inputBackgroundType && (
											<GradientControl
												value={inputGradient}
												onChange={(value) => setAttributes({ inputGradient: value })}
												gradients={[]}
											/>
										)}
										<BoxShadowControl
											label={__('Input Box Shadow', 'kadence-blocks')}
											enable={undefined !== inputBoxShadow[0] ? inputBoxShadow[0] : false}
											color={undefined !== inputBoxShadow[1] ? inputBoxShadow[1] : '#000000'}
											default={'#000000'}
											opacity={undefined !== inputBoxShadow[2] ? inputBoxShadow[2] : 0.4}
											hOffset={undefined !== inputBoxShadow[3] ? inputBoxShadow[3] : 2}
											vOffset={undefined !== inputBoxShadow[4] ? inputBoxShadow[4] : 2}
											blur={undefined !== inputBoxShadow[5] ? inputBoxShadow[5] : 3}
											spread={undefined !== inputBoxShadow[6] ? inputBoxShadow[6] : 0}
											inset={undefined !== inputBoxShadow[7] ? inputBoxShadow[7] : false}
											onEnableChange={(value) => {
												saveInputBoxShadow({ enable: value });
											}}
											onColorChange={(value) => {
												saveInputBoxShadow({ color: value });
											}}
											onOpacityChange={(value) => {
												saveInputBoxShadow({ opacity: value });
											}}
											onHOffsetChange={(value) => {
												saveInputBoxShadow({ hOffset: value });
											}}
											onVOffsetChange={(value) => {
												saveInputBoxShadow({ vOffset: value });
											}}
											onBlurChange={(value) => {
												saveInputBoxShadow({ blur: value });
											}}
											onSpreadChange={(value) => {
												saveInputBoxShadow({ spread: value });
											}}
											onInsetChange={(value) => {
												saveInputBoxShadow({ inset: value });
											}}
										/>
										<ResponsiveBorderControl
											label={__('Input Border', 'kadence-blocks')}
											value={inputBorderStyles}
											tabletValue={tabletInputBorderStyles}
											mobileValue={mobileInputBorderStyles}
											onChange={(value) => setAttributes({ inputBorderStyles: value })}
											onChangeTablet={(value) =>
												setAttributes({ tabletInputBorderStyles: value })
											}
											onChangeMobile={(value) =>
												setAttributes({ mobileInputBorderStyles: value })
											}
										/>
									</>
								}
							/>
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						{showSettings('marginSettings', 'kadence/advancedbtn') && (
							<>
								<KadencePanelBody panelName={'kb-single-button-margin-settings'}>
									<ResponsiveMeasureRangeControl
										label={__('Padding', 'kadence-blocks')}
										value={padding}
										onChange={(value) => setAttributes({ padding: value })}
										tabletValue={tabletPadding}
										onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
										mobileValue={mobilePadding}
										onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
										min={paddingUnit === 'em' || paddingUnit === 'rem' ? -2 : -200}
										max={paddingUnit === 'em' || paddingUnit === 'rem' ? 12 : 200}
										step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
										unit={paddingUnit}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({ paddingUnit: value })}
										onMouseOver={paddingMouseOver.onMouseOver}
										onMouseOut={paddingMouseOver.onMouseOut}
									/>
									<ResponsiveMeasureRangeControl
										label={__('Margin', 'kadence-blocks')}
										value={margin}
										onChange={(value) => setAttributes({ margin: value })}
										tabletValue={tabletMargin}
										onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
										mobileValue={mobileMargin}
										onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
										min={marginUnit === 'em' || marginUnit === 'rem' ? -2 : -200}
										max={marginUnit === 'em' || marginUnit === 'rem' ? 12 : 200}
										step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
										unit={marginUnit}
										units={['px', 'em', 'rem']}
										onUnit={(value) => setAttributes({ marginUnit: value })}
										onMouseOver={marginMouseOver.onMouseOver}
										onMouseOut={marginMouseOver.onMouseOut}
									/>
									<TextControl
										label={__('Add Aria Label', 'kadence-blocks')}
										value={label ? label : ''}
										onChange={(value) => setAttributes({ label: value })}
										className={'kb-textbox-style'}
									/>
								</KadencePanelBody>

								<div className="kt-sidebar-settings-spacer"></div>
							</>
						)}

						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={nonTransAttrs}
						/>
					</>
				)}
			</KadenceInspectorControls>
			<div {...blockProps}>
				{displayStyle === 'standard' ? (
					<>
						{renderInputField()}
						<div {...innerBlocksProps} />
					</>
				) : (
					<>
						<div {...innerBlocksProps} />
						<div
							className="kb-search-modal"
							onClick={() => setIsShowingModal(false)}
							style={{ display: isShowingModal ? 'block' : 'none' }}
						>
							<button
								className="kb-search-close-btn"
								aria-label="Close search"
								data-toggle-target="#search-drawer"
								data-toggle-body-class="showing-popup-drawer-from-full"
								aria-expanded="false"
								data-set-focus=".search-toggle-open"
							>
								&times;
							</button>
							<div class="kb-search-modal-content">
								<label className="screen-reader-text" htmlFor={'kb-search-input' + uniqueID}>
									Search for:
								</label>
								{renderInputField()}
							</div>
						</div>
					</>
				)}

				<SpacingVisualizer
					style={{
						marginLeft:
							undefined !== previewMarginLeft
								? getSpacingOptionOutput(previewMarginLeft, marginUnit)
								: undefined,
						marginRight:
							undefined !== previewMarginRight
								? getSpacingOptionOutput(previewMarginRight, marginUnit)
								: undefined,
						marginTop:
							undefined !== previewMarginTop
								? getSpacingOptionOutput(previewMarginTop, marginUnit)
								: undefined,
						marginBottom:
							undefined !== previewMarginBottom
								? getSpacingOptionOutput(previewMarginBottom, marginUnit)
								: undefined,
					}}
					type="inside"
					forceShow={paddingMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewPaddingTop, paddingUnit),
						getSpacingOptionOutput(previewPaddingRight, paddingUnit),
						getSpacingOptionOutput(previewPaddingBottom, paddingUnit),
						getSpacingOptionOutput(previewPaddingLeft, paddingUnit),
					]}
				/>
				<SpacingVisualizer
					type="outside"
					forceShow={marginMouseOver.isMouseOver}
					spacing={[
						getSpacingOptionOutput(previewMarginTop, marginUnit),
						getSpacingOptionOutput(previewMarginRight, marginUnit),
						getSpacingOptionOutput(previewMarginBottom, marginUnit),
						getSpacingOptionOutput(previewMarginLeft, marginUnit),
					]}
				/>
			</div>
		</>
	);
}

export default Edit;
