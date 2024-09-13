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
import { TextControl, ToggleControl, RangeControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';
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

import { useBlockProps, BlockControls, useInnerBlocksProps } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
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
		tabletInputPadding,
		mobileInputPadding,
		inputPaddingType,
		inputMargin,
		tabletInputMargin,
		mobileInputMargin,
		inputMarginType,
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
		modalGradientActive,
		modalBackgroundType,
		inputMaxWidth,
		inputMaxWidthType,
		inputStyle,
		inputIcon,
		inputIconColor,
		inputIconHoverColor,
		inputIconLineWidth,
		closeIcon,
		closeIconSize,
		closeIconColor,
		closeIconHoverColor,
		closeIconLineWidth,
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
	const editorLeft = editorElement?.getBoundingClientRect().left;

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
			<div className={'kb-search-input-wrapper'}>
				<input
					id={'kb-search-input' + uniqueID}
					className={'kb-search-input'}
					disabled={true}
					type="text"
					placeholder={inputPlaceholder}
				/>
				{inputIcon && (
					<>
						<IconRender
							className={`kb-search-icon kt-svg-icon kt-svg-icon-${inputIcon}`}
							name={inputIcon}
							strokeWidth={'fe' === inputIcon.substring(0, 2) ? inputIconLineWidth : undefined}
							style={{
								color: inputIconColor ? KadenceColorOutput(inputIconColor) : undefined,
							}}
						/>
					</>
				)}
			</div>
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

	const previewCloseIconSize = getPreviewSize(previewDevice, closeIconSize[0], closeIconSize[1], closeIconSize[2]);

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
									if (value === 'modal') {
										saveInputTypography({ size: ['md', '', ''] });
									} else {
										saveInputTypography({ size: ['', '', ''] });
									}
								}}
							/>

							{displayStyle === 'standard' && (
								<KadenceRadioButtons
									label={__('Input Style', 'kadence-blocks')}
									value={inputStyle}
									options={[
										{ value: 'icon', label: __('Field Only', 'kadence-blocks') },
										{ value: 'no-icon', label: __('Field & Button', 'kadence-blocks') },
									]}
									hideLabel={false}
									onChange={(value) => {
										setAttributes({
											inputStyle: value,
										});
									}}
								/>
							)}

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
						<KadencePanelBody
							title={__('Input Icon', 'kadence-blocks')}
							initialOpen={true}
							panelName={'search-input-icon'}
						>
							<KadenceIconPicker
								value={inputIcon}
								allowClear={true}
								onChange={(value) => {
									setAttributes({ inputIcon: value });
								}}
							/>
							{inputIcon && 'fe' === inputIcon.substring(0, 2) && (
								<RangeControl
									label={__('Line Width', 'kadence-blocks')}
									value={inputIconLineWidth}
									onChange={(value) => {
										setAttributes({ inputIconLineWidth: value });
									}}
									step={0.5}
									min={0.5}
									max={4}
								/>
							)}
							<PopColorControl
								label={__('Icon Color', 'kadence-blocks')}
								value={inputIconColor}
								default={''}
								onChange={(value) => {
									setAttributes({ inputIconColor: value });
								}}
								swatchLabel2={__('Hover Color', 'kadence-blocks')}
								value2={inputIconHoverColor}
								default2={''}
								onChange2={(value) => {
									setAttributes({ inputIconHoverColor: value });
								}}
							/>
						</KadencePanelBody>
						{displayStyle === 'modal' && (
							<KadencePanelBody
								title={__('Close Icon', 'kadence-blocks')}
								initialOpen={true}
								panelName={'search-close-icon'}
							>
								<KadenceIconPicker
									value={closeIcon}
									onChange={(value) => {
										setAttributes({ closeIcon: value });
									}}
								/>
								<ResponsiveRangeControls
									label={__('Icon Size', 'kadence-blocks')}
									value={closeIconSize[0]}
									onChange={(value) => {
										setAttributes({ closeIconSize: [value, closeIconSize[1], closeIconSize[2]] });
									}}
									tabletValue={closeIconSize[1]}
									onChangeTablet={(value) => {
										setAttributes({ closeIconSize: [closeIconSize[0], value, closeIconSize[2]] });
									}}
									mobileValue={closeIconSize[2]}
									onChangeMobile={(value) => {
										setAttributes({ closeIconSize: [closeIconSize[0], closeIconSize[1], value] });
									}}
									min={0}
									max={300}
									step={1}
									unit={'px'}
								/>
								{closeIcon && 'fe' === closeIcon.substring(0, 2) && (
									<RangeControl
										label={__('Line Width', 'kadence-blocks')}
										value={closeIconLineWidth}
										onChange={(value) => {
											setAttributes({ closeIconLineWidth: value });
										}}
										step={0.5}
										min={0.5}
										max={4}
									/>
								)}
								<PopColorControl
									label={__('Icon Color', 'kadence-blocks')}
									value={closeIconColor}
									default={''}
									onChange={(value) => {
										setAttributes({ closeIconColor: value });
									}}
									swatchLabel2={__('Hover Color', 'kadence-blocks')}
									value2={closeIconHoverColor}
									default2={''}
									onChange2={(value) => {
										setAttributes({ closeIconHoverColor: value });
									}}
								/>
							</KadencePanelBody>
						)}
						<KadencePanelBody
							title={__('Input Style', 'kadence-blocks')}
							initialOpen={true}
							panelName={'search-input-settings'}
						>
							<ResponsiveRangeControls
								label={__('Max Width', 'kadence-blocks')}
								value={inputMaxWidth[0]}
								onChange={(value) => {
									setAttributes({ inputMaxWidth: [value, inputMaxWidth[1], inputMaxWidth[2]] });
								}}
								tabletValue={inputMaxWidth[1]}
								onChangeTablet={(value) => {
									setAttributes({ inputMaxWidth: [inputMaxWidth[0], value, inputMaxWidth[2]] });
								}}
								mobileValue={inputMaxWidth[2]}
								onChangeMobile={(value) => {
									setAttributes({ inputMaxWidth: [inputMaxWidth[0], inputMaxWidth[1], value] });
								}}
								min={0}
								max={inputMaxWidthType !== 'px' ? 100 : 1500}
								step={1}
								unit={inputMaxWidthType}
								onUnit={(value) => {
									setAttributes({ inputMaxWidthType: value });
								}}
								units={['px', '%']}
							/>
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
								hoverTab={__('Focus', 'kadence-blocks')}
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
												saveInputBoxShadow(value, 0);
											}}
											onColorChange={(value) => {
												saveInputBoxShadow(value, 1);
											}}
											onOpacityChange={(value) => {
												saveInputBoxShadow(value, 2);
											}}
											onHOffsetChange={(value) => {
												saveInputBoxShadow(value, 3);
											}}
											onVOffsetChange={(value) => {
												saveInputBoxShadow(value, 4);
											}}
											onBlurChange={(value) => {
												saveInputBoxShadow(value, 5);
											}}
											onSpreadChange={(value) => {
												saveInputBoxShadow(value, 6);
											}}
											onInsetChange={(value) => {
												saveInputBoxShadow(value, 7);
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

						<KadencePanelBody
							title={__('Input Spacing', 'kadence-blocks')}
							initialOpen={false}
							panelName={'search-input-spacing'}
						>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={inputPadding}
								onChange={(value) => setAttributes({ inputPadding: value })}
								tabletValue={tabletInputPadding}
								onChangeTablet={(value) => setAttributes({ tabletInputPadding: value })}
								mobileValue={mobileInputPadding}
								onChangeMobile={(value) => setAttributes({ mobileInputPadding: value })}
								min={inputPaddingType === 'em' || inputPaddingType === 'rem' ? -2 : -200}
								max={inputPaddingType === 'em' || inputPaddingType === 'rem' ? 12 : 200}
								step={inputPaddingType === 'em' || inputPaddingType === 'rem' ? 0.1 : 1}
								unit={inputPaddingType}
								units={['px', 'em', 'rem']}
								onUnit={(value) => setAttributes({ inputPaddingType: value })}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={inputMargin}
								onChange={(value) => setAttributes({ inputMargin: value })}
								tabletValue={tabletInputMargin}
								onChangeTablet={(value) => setAttributes({ tabletInputMargin: value })}
								mobileValue={mobileInputMargin}
								onChangeMobile={(value) => setAttributes({ mobileInputMargin: value })}
								min={inputMarginType === 'em' || inputMarginType === 'rem' ? -2 : -200}
								max={inputMarginType === 'em' || inputMarginType === 'rem' ? 12 : 200}
								step={inputMarginType === 'em' || inputMarginType === 'rem' ? 0.1 : 1}
								unit={inputMarginType}
								units={['px', 'em', 'rem']}
								onUnit={(value) => setAttributes({ inputMarginType: value })}
							/>
						</KadencePanelBody>

						{displayStyle === 'modal' && (
							<KadencePanelBody
								title={__('Modal Style', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-btn-modal'}
							>
								<BackgroundTypeControl
									label={__('Background Type', 'kadence-blocks')}
									type={modalBackgroundType}
									onChange={(value) => setAttributes({ modalBackgroundType: value })}
									allowedTypes={['normal', 'gradient']}
								/>
								{'gradient' !== modalBackgroundType && (
									<PopColorControl
										label={__('Background Color', 'kadence-blocks')}
										value={modalBackgroundColor}
										default={''}
										onChange={(value) => {
											setAttributes({ modalBackgroundColor: value });
										}}
									/>
								)}
								{'gradient' === modalBackgroundType && (
									<GradientControl
										value={modalGradientActive}
										onChange={(value) => setAttributes({ modalGradientActive: value })}
										gradients={[]}
									/>
								)}
							</KadencePanelBody>
						)}
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
						{inputStyle === 'no-icon' && <div {...innerBlocksProps} />}
					</>
				) : (
					<>
						<div {...innerBlocksProps} />
						{isShowingModal && <style>{`.block-editor-block-popover { display: none; }`}</style>}
						<div
							ref={ref}
							className={'kb-search-modal ' + (isShowingModal ? 'active' : '')}
							onClick={() => setIsShowingModal(false)}
							style={{
								width: editorWidth + 'px',
								left: editorLeft + 'px',
							}}
						>
							<button
								className="kb-search-close-btn"
								aria-label="Close search"
								data-toggle-target="#search-drawer"
								data-toggle-body-class="showing-popup-drawer-from-full"
								aria-expanded="false"
								data-set-focus=".search-toggle-open"
							>
								<IconRender
									className={`kb-search-close-icon kt-svg-icon kt-svg-icon-${closeIcon}`}
									name={inputIcon}
									size={previewCloseIconSize}
									strokeWidth={'fe' === closeIcon.substring(0, 2) ? closeIconLineWidth : undefined}
									style={{
										color: closeIconColor ? KadenceColorOutput(closeIconColor) : undefined,
									}}
								/>
							</button>
							<div
								class="kb-search-modal-content"
								style={{
									width: editorWidth + 'px',
									left: editorLeft + 'px',
								}}
							>
								<label className="screen-reader-text" htmlFor={'kb-search-input' + uniqueID}>
									Search for:
								</label>
								{renderInputField()}
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}

export default Edit;
