/**
 * BLOCK: Kadence Advanced Heading
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, Fragment, useMemo, useRef, useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get } from 'lodash';
import { addQueryArgs } from '@wordpress/url';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import {
	InspectorControls,
	useInnerBlocksProps,
	InspectorAdvancedControls,
	store as editorStore,
	BlockContextProvider,
	BlockControls,
} from '@wordpress/block-editor';
import {
	TextControl,
	ExternalLink,
	Button,
	Placeholder,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
} from '@wordpress/components';
import { headerBlockIcon } from '@kadence/icons';
import {
	KadencePanelBody,
	InspectorControlTabs,
	ResponsiveMeasureRangeControl,
	ResponsiveMeasurementControls,
	ResponsiveBorderControl,
	TypographyControls,
	PopColorControl,
	ColorGroup,
	BackgroundControl as KadenceBackgroundControl,
	HoverToggleControl,
	ResponsiveAlignControls,
	ResponsiveRangeControls,
	BackgroundTypeControl,
	GradientControl,
	ResponsiveSelectControl,
	SmallResponsiveControl,
	BoxShadowControl,
	SelectPostFromPostType,
	CopyPasteAttributes,
} from '@kadence/components';
import { getPreviewSize, mouseOverVisualizer, arrayStringToInt, useElementWidth } from '@kadence/helpers';

import { BackendStyles, PopoverTutorial } from './components';
import { HEADER_ALLOWED_BLOCKS } from './constants';
import { findHeaderBlockClientId } from './helpers';

/**
 * Internal dependencies
 */
import metadata from './block.json';
/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

export function EditInner(props) {
	const { attributes, setAttributes, clientId, context, direct, id, isSelected, justCompletedOnboarding } = props;
	const { setHeaderVisualBuilderOpenId, setHeaderVisualBuilderSelectedId } = useDispatch('kadenceblocks/data');

	const { previewDevice, showVisualBuilder, visualBuilderClientId } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				showVisualBuilder: select('kadenceblocks/data').getOpenHeaderVisualBuilderId() === clientId,
				visualBuilderClientId: select('kadenceblocks/data').getSelectedHeaderVisualBuilderId(),
			};
		},
		[clientId]
	);

	const { childSelected } = useSelect((select) => {
		return {
			childSelected: select('core/block-editor').hasSelectedInnerBlock(clientId, true),
		};
	}, []);

	const [componentRef, setComponentRef] = useState();

	const [activeTab, setActiveTab] = useState('general');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const [meta, setMeta] = useHeaderProp('meta');

	useEffect(() => {
		const setValue = isSelected || childSelected || showVisualBuilder ? clientId : null;

		if (visualBuilderClientId !== setValue) {
			setHeaderVisualBuilderSelectedId(setValue);
		}
	}, [isSelected, childSelected]);

	const metaAttributes = {
		padding: meta?._kad_header_padding,
		tabletPadding: meta?._kad_header_tabletPadding,
		mobilePadding: meta?._kad_header_mobilePadding,
		paddingUnit: meta?._kad_header_paddingUnit,
		margin: meta?._kad_header_margin,
		tabletMargin: meta?._kad_header_tabletMargin,
		mobileMargin: meta?._kad_header_mobileMargin,
		marginUnit: meta?._kad_header_marginUnit,
		border: meta?._kad_header_border,
		borderTablet: meta?._kad_header_borderTablet,
		borderMobile: meta?._kad_header_borderMobile,
		borderUnit: meta?._kad_header_borderUnit,
		borderHover: meta?._kad_header_borderHover,
		borderHoverTablet: meta?._kad_header_borderHoverTablet,
		borderHoverMobile: meta?._kad_header_borderHoverMobile,
		borderHoverUnit: meta?._kad_header_borderHoverUnit,
		borderRadius: meta?._kad_header_borderRadius,
		borderRadiusTablet: meta?._kad_header_borderRadiusTablet,
		borderRadiusMobile: meta?._kad_header_borderRadiusMobile,
		borderRadiusUnit: meta?._kad_header_borderRadiusUnit,
		borderRadiusHover: meta?._kad_header_borderRadiusHover,
		borderRadiusHoverTablet: meta?._kad_header_borderRadiusHoverTablet,
		borderRadiusHoverMobile: meta?._kad_header_borderRadiusHoverMobile,
		borderRadiusHoverUnit: meta?._kad_header_borderRadiusHoverUnit,
		borderTransparent: meta?._kad_header_borderTransparent,
		borderTransparentTablet: meta?._kad_header_borderTransparentTablet,
		borderTransparentMobile: meta?._kad_header_borderTransparentMobile,
		borderTransparentUnit: meta?._kad_header_borderTransparentUnit,
		borderTransparentHover: meta?._kad_header_borderTransparentHover,
		borderTransparentHoverTablet: meta?._kad_header_borderTransparentHoverTablet,
		borderTransparentHoverMobile: meta?._kad_header_borderTransparentHoverMobile,
		borderTransparentHoverUnit: meta?._kad_header_borderTransparentHoverUnit,
		borderRadiusTransparent: meta?._kad_header_borderRadiusTransparent,
		borderRadiusTransparentTablet: meta?._kad_header_borderRadiusTransparentTablet,
		borderRadiusTransparentMobile: meta?._kad_header_borderRadiusTransparentMobile,
		borderRadiusTransparentUnit: meta?._kad_header_borderRadiusTransparentUnit,
		borderRadiusTransparentHover: meta?._kad_header_borderRadiusTransparentHover,
		borderRadiusTransparentHoverTablet: meta?._kad_header_borderRadiusTransparentHoverTablet,
		borderRadiusTransparentHoverMobile: meta?._kad_header_borderRadiusTransparentHoverMobile,
		borderRadiusTransparentHoverUnit: meta?._kad_header_borderRadiusTransparentHoverUnit,
		borderSticky: meta?._kad_header_borderSticky,
		borderStickyTablet: meta?._kad_header_borderStickyTablet,
		borderStickyMobile: meta?._kad_header_borderStickyMobile,
		borderStickyUnit: meta?._kad_header_borderStickyUnit,
		borderStickyHover: meta?._kad_header_borderStickyHover,
		borderStickyHoverTablet: meta?._kad_header_borderStickyHoverTablet,
		borderStickyHoverMobile: meta?._kad_header_borderStickyHoverMobile,
		borderStickyHoverUnit: meta?._kad_header_borderStickyHoverUnit,
		borderRadiusSticky: meta?._kad_header_borderRadiusSticky,
		borderRadiusStickyTablet: meta?._kad_header_borderRadiusStickyTablet,
		borderRadiusStickyMobile: meta?._kad_header_borderRadiusStickyMobile,
		borderRadiusStickyUnit: meta?._kad_header_borderRadiusStickyUnit,
		borderRadiusStickyHover: meta?._kad_header_borderRadiusStickyHover,
		borderRadiusStickyHoverTablet: meta?._kad_header_borderRadiusStickyHoverTablet,
		borderRadiusStickyHoverMobile: meta?._kad_header_borderRadiusStickyHoverMobile,
		borderRadiusStickyHoverUnit: meta?._kad_header_borderRadiusStickyHoverUnit,
		className: meta?._kad_header_className,
		anchor: meta?._kad_header_anchor,
		background: meta?._kad_header_background,
		backgroundHover: meta?._kad_header_backgroundHover,
		backgroundTransparent: meta?._kad_header_backgroundTransparent,
		backgroundTransparentHover: meta?._kad_header_backgroundTransparentHover,
		backgroundSticky: meta?._kad_header_backgroundSticky,
		backgroundStickyHover: meta?._kad_header_backgroundStickyHover,
		typography: meta?._kad_header_typography,
		linkColor: meta?._kad_header_linkColor,
		linkHoverColor: meta?._kad_header_linkHoverColor,
		height: meta?._kad_header_height,
		heightUnit: meta?._kad_header_heightUnit,
		width: meta?._kad_header_width,
		widthUnit: meta?._kad_header_widthUnit,
		isSticky: meta?._kad_header_isSticky,
		isStickyTablet: meta?._kad_header_isStickyTablet,
		isStickyMobile: meta?._kad_header_isStickyMobile,
		isTransparent: meta?._kad_header_isTransparent,
		isTransparentTablet: meta?._kad_header_isTransparentTablet,
		isTransparentMobile: meta?._kad_header_isTransparentMobile,
		autoTransparentSpacing: meta?._kad_header_autoTransparentSpacing,
		stickySection: meta?._kad_header_stickySection,
		stickySectionTablet: meta?._kad_header_stickySectionTablet,
		stickySectionMobile: meta?._kad_header_stickySectionMobile,
		shrinkMain: meta?._kad_header_shrinkMain,
		shrinkMainHeight: meta?._kad_header_shrinkMainHeight,
		shrinkMainHeightTablet: meta?._kad_header_shrinkMainHeightTablet,
		shrinkMainHeightMobile: meta?._kad_header_shrinkMainHeightMobile,
		revealScrollUp: meta?._kad_header_revealScrollUp,
		shadow: meta?._kad_header_shadow,
		headerTag: meta?._kad_header_headerTag,
	};

	const {
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		margin,
		tabletMargin,
		mobileMargin,
		marginUnit,
		border,
		borderTablet,
		borderMobile,
		borderHover,
		borderHoverTablet,
		borderHoverMobile,
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		borderRadiusUnit,
		borderRadiusHover,
		borderRadiusHoverTablet,
		borderRadiusHoverMobile,
		borderRadiusHoverUnit,
		borderTransparent,
		borderTransparentTablet,
		borderTransparentMobile,
		borderTransparentHover,
		borderTransparentHoverTablet,
		borderTransparentHoverMobile,
		borderRadiusTransparent,
		borderRadiusTransparentTablet,
		borderRadiusTransparentMobile,
		borderRadiusTransparentUnit,
		borderRadiusTransparentHover,
		borderRadiusTransparentHoverTablet,
		borderRadiusTransparentHoverMobile,
		borderRadiusTransparentHoverUnit,
		borderSticky,
		borderStickyTablet,
		borderStickyMobile,
		borderStickyHover,
		borderStickyHoverTablet,
		borderStickyHoverMobile,
		borderRadiusSticky,
		borderRadiusStickyTablet,
		borderRadiusStickyMobile,
		borderRadiusStickyUnit,
		borderRadiusStickyHover,
		borderRadiusStickyHoverTablet,
		borderRadiusStickyHoverMobile,
		borderRadiusStickyHoverUnit,
		className,
		anchor,
		background,
		backgroundHover,
		backgroundTransparent,
		backgroundTransparentHover,
		backgroundSticky,
		backgroundStickyHover,
		typography,
		linkColor,
		linkHoverColor,
		height,
		heightUnit,
		width,
		widthUnit,
		isSticky,
		isStickyTablet,
		isStickyMobile,
		isTransparent,
		isTransparentTablet,
		isTransparentMobile,
		autoTransparentSpacing,
		stickySection,
		stickySectionTablet,
		stickySectionMobile,
		shrinkMain,
		shrinkMainHeight,
		shrinkMainHeightTablet,
		shrinkMainHeightMobile,
		revealScrollUp,
		shadow,
		headerTag,
	} = metaAttributes;

	const setMetaAttribute = (value, key) => {
		setMeta({ ...meta, ['_kad_header_' + key]: value });
	};
	const previewIsSticky = getPreviewSize(previewDevice, isSticky, isStickyTablet, isStickyMobile);
	const previewIsTransparent = getPreviewSize(previewDevice, isTransparent, isTransparentTablet, isTransparentMobile);

	const previewStickySection = getPreviewSize(
		previewDevice,
		stickySection ? stickySection : 'main',
		stickySectionTablet,
		stickySectionMobile
	);

	let [blocks, onInput, onChange] = useEntityBlockEditor('postType', 'kadence_header', id);

	// console.log(blocks);

	const emptyHeader = useMemo(() => {
		return [createBlock('kadence/header', {})];
	}, [clientId]);

	if (blocks.length === 0) {
		blocks = emptyHeader;
	}

	const headerInnerBlocks = useMemo(() => {
		const innerBlocks = get(blocks, [0, 'innerBlocks'], []);
		const findHeader = findHeaderBlockClientId(innerBlocks);

		if (findHeader !== null) {
			wp.data.dispatch('core/block-editor').removeBlock(findHeader);
		}
		return innerBlocks;
	}, [blocks]);

	const newBlock = useMemo(() => {
		return get(blocks, [0], {});
	}, [blocks]);

	const backgroundStyleControls = (size = '', suffix = '') => {
		//previously had hover settings in here but didn't end up neededing them for the header container.
		const backgroundValue = metaAttributes['background' + suffix + size];
		const backgroundHoverValue = metaAttributes['background' + suffix + 'Hover' + size];
		return (
			<>
				<BackgroundTypeControl
					label={__('Type', 'kadence-blocks')}
					type={undefined != backgroundValue?.type ? backgroundValue.type : 'normal'}
					onChange={(value) =>
						setMetaAttribute({ ...backgroundValue, type: value }, 'background' + suffix + size)
					}
					allowedTypes={['normal', 'gradient']}
				/>
				{'normal' === backgroundValue?.type && (
					<>
						<PopColorControl
							label={__('Background Color', 'kadence-blocks')}
							value={undefined !== backgroundValue?.color ? backgroundValue.color : ''}
							default={''}
							onChange={(value) => {
								setMetaAttribute({ ...backgroundValue, color: value }, 'background' + suffix + size);
							}}
						/>
						<KadenceBackgroundControl
							label={__('Background Image', 'kadence-blocks')}
							hasImage={
								undefined === backgroundValue.image || '' === backgroundValue.image ? false : true
							}
							imageURL={backgroundValue?.image ? backgroundValue.image : ''}
							imageID={backgroundValue?.imageID}
							imagePosition={backgroundValue?.position ? backgroundValue.position : 'center center'}
							imageSize={backgroundValue?.size ? backgroundValue.size : 'cover'}
							imageRepeat={backgroundValue?.repeat ? backgroundValue.repeat : 'no-repeat'}
							imageAttachment={backgroundValue?.attachment ? backgroundValue.attachment : 'scroll'}
							imageAttachmentParallax={false}
							onRemoveImage={() => {
								setMetaAttribute(
									{ ...backgroundValue, imageID: undefined },
									'background' + suffix + size
								);
								setMetaAttribute(
									{ ...backgroundValue, image: undefined },
									'background' + suffix + size
								);
							}}
							onSaveImage={(value) => {
								setMetaAttribute(
									{ ...backgroundValue, imageID: value.id.toString() },
									'background' + suffix + size
								);
								setMetaAttribute(
									{ ...backgroundValue, image: value.url },
									'background' + suffix + size
								);
							}}
							onSaveURL={(newURL) => {
								if (newURL !== backgroundValue.image) {
									setMetaAttribute(
										{ ...backgroundValue, imageID: undefined },
										'background' + suffix + size
									);
									setMetaAttribute(
										{ ...backgroundValue, image: newURL },
										'background' + suffix + size
									);
								}
							}}
							onSavePosition={(value) =>
								setMetaAttribute({ ...backgroundValue, position: value }, 'background' + suffix + size)
							}
							onSaveSize={(value) =>
								setMetaAttribute({ ...backgroundValue, imageSize: value }, 'background' + suffix + size)
							}
							onSaveRepeat={(value) =>
								setMetaAttribute(
									{ ...backgroundValue, imageRepeat: value },
									'background' + suffix + size
								)
							}
							onSaveAttachment={(value) =>
								setMetaAttribute(
									{ ...backgroundValue, imageAttachment: value },
									'background' + suffix + size
								)
							}
							disableMediaButtons={backgroundValue?.image ? true : false}
							dynamicAttribute={'background' + suffix + size + ':image'}
							isSelected={isSelected}
							attributes={attributes}
							setAttributes={setAttributes}
							name={'kadence/header'}
							clientId={clientId}
							context={context}
						/>
					</>
				)}
				{'gradient' === backgroundValue?.type && (
					<>
						<GradientControl
							value={backgroundValue?.gradient}
							onChange={(value) => {
								setMetaAttribute({ ...backgroundValue, gradient: value }, 'background' + suffix + size);
							}}
							gradients={[]}
						/>
					</>
				)}
			</>
		);
	};

	const saveShadow = (value) => {
		const newUpdate = shadow.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setMetaAttribute(newUpdate, 'shadow');
	};

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: '',
		},
		{
			allowedBlocks: HEADER_ALLOWED_BLOCKS,
			value: !direct ? headerInnerBlocks : undefined,
			onInput: !direct ? (a, b) => onInput([{ ...newBlock, innerBlocks: a }], b) : undefined,
			onChange: !direct ? (a, b) => onChange([{ ...newBlock, innerBlocks: a }], b) : undefined,
			templateLock: 'all',
		}
	);

	const contextValue = useMemo(
		() => ({
			'kadence/headerPostId': id,
			'kadence/headerIsSticky': previewIsSticky,
			'kadence/headerIsTransparent': previewIsTransparent,
		}),
		[id, previewIsSticky, previewIsTransparent]
	);

	if (typeof pagenow !== 'undefined' && ('widgets' === pagenow || 'customize' === pagenow)) {
		const editPostLink = addQueryArgs('post.php', {
			post: id,
			action: 'edit',
		});
		return (
			<>
				<Placeholder
					className="kb-select-or-create-placeholder"
					label={__('Advanced Header', 'kadence-blocks')}
					icon={headerBlockIcon}
				>
					<p style={{ width: '100%', marginBottom: '10px' }}>
						{__('Advanced Headers can not be edited within the widgets screen.', 'kadence-blocks')}
					</p>
					<Button href={editPostLink} variant="primary" className="kb-form-edit-link">
						{__('Edit Header', 'kadence-blocks')}
					</Button>
				</Placeholder>
				<InspectorControls>
					<KadencePanelBody panelName={'kb-advanced-form-selected-switch'}>
						<SelectPostFromPostType
							postType="kadence_header"
							label={__('Selected Header', 'kadence-blocks')}
							onChange={(nextId) => {
								setAttributes({ id: parseInt(nextId) });
							}}
							value={id}
						/>

						<Button
							variant="link"
							onClick={() => {
								setAttributes({ id: 0 });
							}}
							style={{ marginBottom: '10px' }}
						>
							{__('Create a New Header', 'kadence-blocks')}
						</Button>
					</KadencePanelBody>
				</InspectorControls>
			</>
		);
	}
	return (
		<>
			<BackendStyles
				{...props}
				metaAttributes={metaAttributes}
				previewDevice={previewDevice}
				currentRef={componentRef}
			/>
			<BlockControls>
				<CopyPasteAttributes
					attributes={meta}
					excludedAttributes={['_kad_header_description']}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setMeta({ ...meta, ...attributesToPaste })}
				/>
				<ToolbarGroup>
					<ToolbarButton
						className="components-tab-button"
						isPressed={showVisualBuilder}
						onClick={() => setHeaderVisualBuilderOpenId(showVisualBuilder ? null : clientId)}
					>
						<span>{__('Visual Builder', 'kadence-blocks')}</span>
					</ToolbarButton>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<InspectorControlTabs
					panelName={'advanced-header'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody panelName={'kb-header-selected-switch'}>
							{!direct && (
								<>
									<SelectPostFromPostType
										postType="kadence_header"
										label={__('Selected Header', 'kadence-blocks')}
										onChange={(nextId) => {
											setAttributes({ id: parseInt(nextId) });
										}}
										value={id}
									/>

									<Button
										variant="link"
										onClick={() => {
											setAttributes({ id: 0 });
										}}
										style={{ marginBottom: '10px' }}
									>
										{__('Create a New Header', 'kadence-blocks')}
									</Button>
								</>
							)}
						</KadencePanelBody>
						<KadencePanelBody panelName={'kb-header-general-settings'}>
							<ResponsiveSelectControl
								label={__('Sticky Header', 'kadence-blocks')}
								value={isSticky}
								tabletValue={isStickyTablet}
								mobileValue={isStickyMobile}
								options={[
									{ value: '', label: __('-', 'kadence-blocks') },
									{ value: '1', label: __('Yes', 'kadence-blocks') },
									{ value: '0', label: __('No', 'kadence-blocks') },
								]}
								onChange={(value) => setMetaAttribute(value, 'isSticky')}
								onChangeTablet={(value) => setMetaAttribute(value, 'isStickyTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'isStickyMobile')}
							/>
							<ResponsiveSelectControl
								label={__('Transparent Header', 'kadence-blocks')}
								value={isTransparent}
								tabletValue={isTransparentTablet}
								mobileValue={isTransparentMobile}
								options={[
									{ value: '', label: __('-', 'kadence-blocks') },
									{ value: '1', label: __('Yes', 'kadence-blocks') },
									{ value: '0', label: __('No', 'kadence-blocks') },
								]}
								onChange={(value) => setMetaAttribute(value, 'isTransparent')}
								onChangeTablet={(value) => setMetaAttribute(value, 'isTransparentTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'isTransparentMobile')}
							/>
							{/* {previewIsTransparent === '1' && (
								<ToggleControl
									label={__('Auto spacing under', 'kadence-blocks')}
									checked={autoTransparentSpacing}
									onChange={(value) => setMetaAttribute(value, 'autoTransparentSpacing')}
								/>
							)} */}
							{previewIsSticky === '1' && (
								<>
									<ResponsiveSelectControl
										label={__('Sticky Section', 'kadence-blocks')}
										value={stickySection}
										tabletValue={stickySectionTablet}
										mobileValue={stickySectionMobile}
										options={[
											{ value: '', label: __('Whole Header', 'kadence-blocks') },
											{ value: 'main', label: __('Main Row', 'kadence-blocks') },
											{ value: 'top', label: __('Top Row', 'kadence-blocks') },
											{ value: 'bottom', label: __('Bottom Row', 'kadence-blocks') },
											{ value: 'top_main', label: __('Top and Main Row', 'kadence-blocks') },
											{
												value: 'bottom_main',
												label: __('Bottom and Main Row', 'kadence-blocks'),
											},
										]}
										onChange={(value) => setMetaAttribute(value, 'stickySection')}
										onChangeTablet={(value) => setMetaAttribute(value, 'stickySectionTablet')}
										onChangeMobile={(value) => setMetaAttribute(value, 'stickySectionMobile')}
									/>
									<ToggleControl
										label={__('Reveal on scroll up', 'kadence-blocks')}
										checked={revealScrollUp}
										onChange={(value) => setMetaAttribute(value, 'revealScrollUp')}
									/>
									<ToggleControl
										label={__('Shrink Middle Row', 'kadence-blocks')}
										checked={shrinkMain}
										onChange={(value) => setMetaAttribute(value, 'shrinkMain')}
									/>
									{shrinkMain &&
										(previewStickySection.includes('main') || previewStickySection === '') && (
											<ResponsiveRangeControls
												label={__('Middle Row Shrink Height', 'kadence-blocks')}
												value={parseFloat(shrinkMainHeight)}
												valueTablet={parseFloat(shrinkMainHeightTablet)}
												valueMobile={parseFloat(shrinkMainHeightMobile)}
												onChange={(value) =>
													setMetaAttribute(value.toString(), 'shrinkMainHeight')
												}
												onChangeTablet={(value) =>
													setMetaAttribute(value.toString(), 'shrinkMainHeightTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value.toString(), 'shrinkMainHeightMobile')
												}
												min={0}
												max={500}
												step={1}
												unit={'px'}
												units={['px']}
												showUnit={true}
											/>
										)}
								</>
							)}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'style' && (
					<>
						{previewIsTransparent !== '1' && (
							<KadencePanelBody
								title={__('Background Settings', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-header-bg-settings'}
							>
								{backgroundStyleControls()}
							</KadencePanelBody>
						)}
						{previewIsTransparent === '1' && (
							<KadencePanelBody
								title={__('Transparent Background Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-header-bg-transparent-settings'}
							>
								{backgroundStyleControls('', 'Transparent')}
							</KadencePanelBody>
						)}
						{previewIsSticky === '1' && (
							<KadencePanelBody
								title={__('Sticky Background Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-header-bg-styicky-settings'}
							>
								{backgroundStyleControls('', 'Sticky')}
							</KadencePanelBody>
						)}
						<KadencePanelBody
							title={__('Border Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-border'}
						>
							<ResponsiveBorderControl
								label={__('Border', 'kadence-blocks')}
								value={border}
								tabletValue={borderTablet}
								mobileValue={borderMobile}
								onChange={(value) => {
									setMetaAttribute(value, 'border');
								}}
								onChangeTablet={(value) => setMetaAttribute(value, 'borderTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'borderMobile')}
							/>
							<ResponsiveMeasurementControls
								label={__('Border Radius', 'kadence-blocks')}
								value={borderRadius}
								tabletValue={borderRadiusTablet}
								mobileValue={borderRadiusMobile}
								onChange={(value) => setMetaAttribute(value, 'borderRadius')}
								onChangeTablet={(value) => setMetaAttribute(value, 'borderRadiusTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'borderRadiusMobile')}
								unit={borderRadiusUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'borderRadiusUnit')}
								max={
									borderRadiusUnit === 'em' || borderRadiusUnit === 'rem'
										? 24
										: borderRadiusUnit === 'px'
										? 500
										: 100
								}
								step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
								min={0}
								isBorderRadius={true}
								allowEmpty={true}
							/>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Box Shadow', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-shadow'}
						>
							<BoxShadowControl
								label={__('Box Shadow', 'kadence-blocks')}
								enable={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].enable
										? shadow[0].enable
										: true
								}
								color={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].color
										? shadow[0].color
										: '#000000'
								}
								colorDefault={'#000000'}
								onArrayChange={(color, opacity) => {
									saveShadow({ color, opacity });
								}}
								opacity={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].opacity
										? shadow[0].opacity
										: 0.2
								}
								hOffset={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].hOffset
										? shadow[0].hOffset
										: 0
								}
								vOffset={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].vOffset
										? shadow[0].vOffset
										: 0
								}
								blur={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].blur
										? shadow[0].blur
										: 14
								}
								spread={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].spread
										? shadow[0].spread
										: 0
								}
								inset={
									undefined !== shadow && undefined !== shadow[0] && undefined !== shadow[0].inset
										? shadow[0].inset
										: false
								}
								onEnableChange={(value) => {
									saveShadow({ enable: value });
								}}
								onColorChange={(value) => {
									saveShadow({ color: value });
								}}
								onOpacityChange={(value) => {
									saveShadow({ opacity: value });
								}}
								onHOffsetChange={(value) => {
									saveShadow({ hOffset: value });
								}}
								onVOffsetChange={(value) => {
									saveShadow({ vOffset: value });
								}}
								onBlurChange={(value) => {
									saveShadow({ blur: value });
								}}
								onSpreadChange={(value) => {
									saveShadow({ spread: value });
								}}
								onInsetChange={(value) => {
									saveShadow({ inset: value });
								}}
							/>
						</KadencePanelBody>
						{previewIsTransparent === '1' && (
							<KadencePanelBody
								title={__('Transparent Border Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-header-border-transparent'}
							>
								<HoverToggleControl
									normal={
										<>
											<ResponsiveBorderControl
												label={__('Border', 'kadence-blocks')}
												value={borderTransparent}
												tabletValue={borderTransparentTablet}
												mobileValue={borderTransparentMobile}
												onChange={(value) => {
													setMetaAttribute(value, 'borderTransparent');
												}}
												onChangeTablet={(value) =>
													setMetaAttribute(value, 'borderTransparentTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value, 'borderTransparentMobile')
												}
											/>
											<ResponsiveMeasurementControls
												label={__('Border Radius', 'kadence-blocks')}
												value={borderRadiusTransparent}
												tabletValue={borderRadiusTransparentTablet}
												mobileValue={borderRadiusTransparentMobile}
												onChange={(value) => setMetaAttribute(value, 'borderRadiusTransparent')}
												onChangeTablet={(value) =>
													setMetaAttribute(value, 'borderRadiusTransparentTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value, 'borderRadiusTransparentMobile')
												}
												unit={borderRadiusTransparentUnit}
												units={['px', 'em', 'rem', '%']}
												onUnit={(value) =>
													setMetaAttribute(value, 'borderRadiusTransparentUnit')
												}
												max={
													borderRadiusTransparentUnit === 'em' ||
													borderRadiusTransparentUnit === 'rem'
														? 24
														: borderRadiusTransparentUnit === 'px'
														? 500
														: 100
												}
												step={
													borderRadiusTransparentUnit === 'em' ||
													borderRadiusTransparentUnit === 'rem'
														? 0.1
														: 1
												}
												min={0}
												isBorderRadius={true}
												allowEmpty={true}
											/>
										</>
									}
									hover={
										<>
											<ResponsiveBorderControl
												label={__('Hover Border', 'kadence-blocks')}
												value={borderTransparentHover}
												tabletValue={borderTransparentHoverTablet}
												mobileValue={borderTransparentHoverMobile}
												onChange={(value) => {
													setMetaAttribute(value, 'borderTransparentHover');
												}}
												onChangeTablet={(value) =>
													setMetaAttribute(value, 'borderTransparentHoverTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value, 'borderTransparentHoverMobile')
												}
											/>
											<ResponsiveMeasurementControls
												label={__('Border Radius', 'kadence-blocks')}
												value={borderRadiusTransparentHover}
												tabletValue={borderRadiusTransparentHoverTablet}
												mobileValue={borderRadiusTransparentHoverMobile}
												onChange={(value) =>
													setMetaAttribute(value, 'borderRadiusTransparentHover')
												}
												onChangeTablet={(value) =>
													setMetaAttribute(value, 'borderRadiusTransparentHoverTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value, 'borderRadiusTransparentHoverMobile')
												}
												unit={borderRadiusTransparentHoverUnit}
												units={['px', 'em', 'rem', '%']}
												onUnit={(value) =>
													setMetaAttribute(value, 'borderRadiusTransparentHoverUnit')
												}
												max={
													borderRadiusTransparentHoverUnit === 'em' ||
													borderRadiusTransparentHoverUnit === 'rem'
														? 24
														: borderRadiusTransparentHoverUnit === 'px'
														? 500
														: 100
												}
												step={
													borderRadiusTransparentHoverUnit === 'em' ||
													borderRadiusTransparentHoverUnit === 'rem'
														? 0.1
														: 1
												}
												min={0}
												isBorderRadius={true}
												allowEmpty={true}
											/>
										</>
									}
								/>
							</KadencePanelBody>
						)}
						{previewIsSticky === '1' && (
							<KadencePanelBody
								title={__('Sticky Border Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-header-border-sticky'}
							>
								<HoverToggleControl
									normal={
										<>
											<ResponsiveBorderControl
												label={__('Border', 'kadence-blocks')}
												value={borderSticky}
												tabletValue={borderStickyTablet}
												mobileValue={borderStickyMobile}
												onChange={(value) => {
													setMetaAttribute(value, 'borderSticky');
												}}
												onChangeTablet={(value) =>
													setMetaAttribute(value, 'borderStickyTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value, 'borderStickyMobile')
												}
											/>
											<ResponsiveMeasurementControls
												label={__('Border Radius', 'kadence-blocks')}
												value={borderRadiusSticky}
												tabletValue={borderRadiusStickyTablet}
												mobileValue={borderRadiusStickyMobile}
												onChange={(value) => setMetaAttribute(value, 'borderRadiusSticky')}
												onChangeTablet={(value) =>
													setMetaAttribute(value, 'borderRadiusStickyTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value, 'borderRadiusStickyMobile')
												}
												unit={borderRadiusStickyUnit}
												units={['px', 'em', 'rem', '%']}
												onUnit={(value) => setMetaAttribute(value, 'borderRadiusStickyUnit')}
												max={
													borderRadiusStickyUnit === 'em' || borderRadiusStickyUnit === 'rem'
														? 24
														: borderRadiusStickyUnit === 'px'
														? 500
														: 100
												}
												step={
													borderRadiusStickyUnit === 'em' || borderRadiusStickyUnit === 'rem'
														? 0.1
														: 1
												}
												min={0}
												isBorderRadius={true}
												allowEmpty={true}
											/>
										</>
									}
									hover={
										<>
											<ResponsiveBorderControl
												label={__('Hover Border', 'kadence-blocks')}
												value={borderStickyHover}
												tabletValue={borderStickyHoverTablet}
												mobileValue={borderStickyHoverMobile}
												onChange={(value) => {
													setMetaAttribute(value, 'borderStickyHover');
												}}
												onChangeTablet={(value) =>
													setMetaAttribute(value, 'borderStickyHoverTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value, 'borderStickyHoverMobile')
												}
											/>
											<ResponsiveMeasurementControls
												label={__('Border Radius', 'kadence-blocks')}
												value={borderRadiusStickyHover}
												tabletValue={borderRadiusStickyHoverTablet}
												mobileValue={borderRadiusStickyHoverMobile}
												onChange={(value) => setMetaAttribute(value, 'borderRadiusStickyHover')}
												onChangeTablet={(value) =>
													setMetaAttribute(value, 'borderRadiusStickyHoverTablet')
												}
												onChangeMobile={(value) =>
													setMetaAttribute(value, 'borderRadiusStickyHoverMobile')
												}
												unit={borderRadiusStickyHoverUnit}
												units={['px', 'em', 'rem', '%']}
												onUnit={(value) =>
													setMetaAttribute(value, 'borderRadiusStickyHoverUnit')
												}
												max={
													borderRadiusStickyHoverUnit === 'em' ||
													borderRadiusStickyHoverUnit === 'rem'
														? 24
														: borderRadiusStickyHoverUnit === 'px'
														? 500
														: 100
												}
												step={
													borderRadiusStickyHoverUnit === 'em' ||
													borderRadiusStickyHoverUnit === 'rem'
														? 0.1
														: 1
												}
												min={0}
												isBorderRadius={true}
												allowEmpty={true}
											/>
										</>
									}
								/>
							</KadencePanelBody>
						)}
						<KadencePanelBody
							title={__('Typography Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-font-family'}
						>
							<TypographyControls
								fontGroup={'header'}
								fontSize={typography.size}
								onFontSize={(value) => setMetaAttribute({ ...typography, size: value }, 'typography')}
								fontSizeType={typography.sizeType}
								onFontSizeType={(value) =>
									setMetaAttribute({ ...typography, sizeType: value }, 'typography')
								}
								lineHeight={typography.lineHeight}
								onLineHeight={(value) =>
									setMetaAttribute({ ...typography, lineHeight: value }, 'typography')
								}
								lineHeightType={typography.lineType}
								onLineHeightType={(value) =>
									setMetaAttribute({ ...typography, lineType: value }, 'typography')
								}
								reLetterSpacing={typography.letterSpacing}
								onLetterSpacing={(value) =>
									setMetaAttribute({ ...typography, letterSpacing: value }, 'typography')
								}
								letterSpacingType={typography.letterType}
								onLetterSpacingType={(value) =>
									setMetaAttribute({ ...typography, letterType: value }, 'typography')
								}
								textTransform={typography.textTransform}
								onTextTransform={(value) =>
									setMetaAttribute({ ...typography, textTransform: value }, 'typography')
								}
								fontFamily={typography.family}
								onFontFamily={(value) =>
									setMetaAttribute({ ...typography, family: value }, 'typography')
								}
								onFontChange={(select) => {
									setMetaAttribute({ ...typography, ...select }, 'typography');
								}}
								onFontArrayChange={(values) =>
									setMetaAttribute({ ...typography, ...values }, 'typography')
								}
								googleFont={typography.google}
								onGoogleFont={(value) =>
									setMetaAttribute({ ...typography, google: value }, 'typography')
								}
								loadGoogleFont={typography.loadGoogle}
								onLoadGoogleFont={(value) =>
									setMetaAttribute({ ...typography, loadGoogle: value }, 'typography')
								}
								fontVariant={typography.variant}
								onFontVariant={(value) =>
									setMetaAttribute({ ...typography, variant: value }, 'typography')
								}
								fontWeight={typography.weight}
								onFontWeight={(value) =>
									setMetaAttribute({ ...typography, weight: value }, 'typography')
								}
								fontStyle={typography.style}
								onFontStyle={(value) => setMetaAttribute({ ...typography, style: value }, 'typography')}
								fontSubset={typography.subset}
								onFontSubset={(value) =>
									setMetaAttribute({ ...typography, subset: value }, 'typography')
								}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Text Color Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-text-color'}
						>
							<ColorGroup>
								<PopColorControl
									label={__('Text Color', 'kadence-blocks')}
									value={typography.color ? typography.color : ''}
									default={''}
									onChange={(value) =>
										setMetaAttribute({ ...typography, color: value }, 'typography')
									}
								/>
								<PopColorControl
									label={__('Link Color', 'kadence-blocks')}
									value={linkColor ? linkColor : ''}
									default={''}
									onChange={(value) => setMetaAttribute(value, 'linkColor')}
									swatchLabel2={__('Hover Color', 'kadence-blocks')}
									value2={linkHoverColor ? linkHoverColor : ''}
									default2={''}
									onChange2={(value) => setMetaAttribute(value, 'linkHoverColor')}
								/>
							</ColorGroup>
						</KadencePanelBody>
						<div className="kt-sidebar-settings-spacer"></div>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-header-padding'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
								tabletValue={tabletPadding}
								mobileValue={mobilePadding}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'padding');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletPadding');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobilePadding');
								}}
								min={0}
								max={
									paddingUnit === 'em' || paddingUnit === 'rem'
										? 24
										: paddingUnit === 'px'
										? 200
										: 100
								}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'paddingUnit')}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={margin}
								tabletValue={tabletMargin}
								mobileValue={mobileMargin}
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'margin');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletMargin');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobileMargin');
								}}
								min={marginUnit === 'em' || marginUnit === 'rem' ? -12 : -200}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : marginUnit === 'px' ? 200 : 100}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setMetaAttribute(value, 'marginUnit')}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
								allowAuto={true}
							/>
						</KadencePanelBody>
						<KadencePanelBody
							title={__('Container Size Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-header-size-settings'}
						>
							{/* unhooking this control, but will leave the backend styling and everything. done during beta so probably safe to remove the whole chain if we want. */}
							{/* <ResponsiveRangeControls
								label={__('Min Height', 'kadence-blocks')}
								value={height?.[0] ? parseFloat(height[0]) : ''}
								onChange={(value) => {
									setMetaAttribute(
										[
											value.toString(),
											undefined !== height?.[1] ? height[1] : '',
											undefined !== height?.[2] ? height[2] : '',
										],
										'height'
									);
								}}
								tabletValue={height?.[1] ? parseFloat(height[1]) : ''}
								onChangeTablet={(value) => {
									setMetaAttribute(
										[
											undefined !== height?.[0] ? height[0] : '',
											value.toString(),
											undefined !== height?.[2] ? height[2] : '',
										],
										'height'
									);
								}}
								mobileValue={height?.[2] ? parseFloat(height[2]) : ''}
								onChangeMobile={(value) => {
									setMetaAttribute(
										[
											undefined !== height?.[0] ? height[0] : '',
											undefined !== height?.[1] ? height[1] : '',
											value.toString(),
										],
										'height'
									);
								}}
								min={0}
								max={heightUnit === 'px' ? 2000 : 200}
								step={1}
								unit={heightUnit ? heightUnit : 'px'}
								onUnit={(value) => {
									setMetaAttribute(value, 'heightUnit');
								}}
								reset={() => {
									setMetaAttribute(['', '', ''], 'height');
								}}
								units={['px', 'vh', 'vw']}
							/> */}
							<ResponsiveRangeControls
								label={__('Max Width', 'kadence-blocks')}
								value={width?.[0] ? parseFloat(width[0]) : ''}
								onChange={(value) => {
									setMetaAttribute(
										[
											value.toString(),
											undefined !== width?.[1] ? width[1] : '',
											undefined !== width?.[2] ? width[2] : '',
										],
										'width'
									);
								}}
								tabletValue={width?.[1] ? parseFloat(width[1]) : ''}
								onChangeTablet={(value) => {
									setMetaAttribute(
										[
											undefined !== width?.[0] ? width[0] : '',
											value.toString(),
											undefined !== width?.[2] ? width[2] : '',
										],
										'width'
									);
								}}
								mobileValue={width?.[2] ? parseFloat(width[2]) : ''}
								onChangeMobile={(value) => {
									setMetaAttribute(
										[
											undefined !== width?.[0] ? width[0] : '',
											undefined !== width?.[1] ? width[1] : '',
											value.toString(),
										],
										'width'
									);
								}}
								min={0}
								max={widthUnit === 'px' ? 2000 : 200}
								step={1}
								unit={widthUnit ? widthUnit : 'px'}
								onUnit={(value) => {
									setMetaAttribute(value, 'widthUnit');
								}}
								reset={() => {
									setMetaAttribute(['', '', ''], 'width');
								}}
								units={['px', '%', 'vw']}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<InspectorAdvancedControls>
				<SelectControl
					label={__('Header Tag', 'kadence-blocks')}
					value={headerTag}
					options={[
						{ value: '', label: __('<header>', 'kadence-blocks') },
						{ value: 'div', label: __('<div>', 'kadence-blocks') },
					]}
					onChange={(value) => setMetaAttribute(value, 'headerTag')}
				/>
				<TextControl
					__nextHasNoMarginBottom
					className="html-anchor-control"
					label={__('HTML anchor')}
					help={
						<>
							{__(
								'Enter a word or two — without spaces — to make a unique web address just for this block, called an “anchor.” Then, you’ll be able to link directly to this section of your page.'
							)}

							<ExternalLink href={__('https://wordpress.org/documentation/article/page-jumps/')}>
								{__('Learn more about anchors')}
							</ExternalLink>
						</>
					}
					value={anchor}
					placeholder={__('Add an anchor')}
					onChange={(nextValue) => {
						nextValue = nextValue.replace(ANCHOR_REGEX, '-');
						setMetaAttribute(nextValue, 'anchor');
					}}
					autoCapitalize="none"
					autoComplete="off"
				/>

				<TextControl
					__nextHasNoMarginBottom
					autoComplete="off"
					label={__('Additional CSS class(es)')}
					value={className}
					onChange={(nextValue) => {
						setMetaAttribute(nextValue !== '' ? nextValue : undefined, 'className');
					}}
					help={__('Separate multiple classes with spaces.')}
				/>
			</InspectorAdvancedControls>
			<BlockContextProvider value={contextValue}>
				<Fragment {...innerBlocksProps} />
			</BlockContextProvider>
			<span className="placeholder-ref" ref={setComponentRef} />
			{/*<SpacingVisualizer*/}
			{/*	style={ {*/}
			{/*		marginLeft: ( undefined !== previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, marginUnit ) : undefined ),*/}
			{/*		marginRight: ( undefined !== previewMarginRight ? getSpacingOptionOutput( previewMarginRight, marginUnit ) : undefined ),*/}
			{/*		marginTop: ( undefined !== previewMarginTop ? getSpacingOptionOutput( previewMarginTop, marginUnit ) : undefined ),*/}
			{/*		marginBottom: ( undefined !== previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, marginUnit ) : undefined ),*/}
			{/*	} }*/}
			{/*	type="inside"*/}
			{/*	forceShow={ paddingMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewPaddingTop, paddingUnit ), getSpacingOptionOutput( previewPaddingRight, paddingUnit ), getSpacingOptionOutput( previewPaddingBottom, paddingUnit ), getSpacingOptionOutput( previewPaddingLeft, paddingUnit ) ] }*/}
			{/*/>*/}
			{/*<SpacingVisualizer*/}
			{/*	type="inside"*/}
			{/*	forceShow={ marginMouseOver.isMouseOver }*/}
			{/*	spacing={ [ getSpacingOptionOutput( previewMarginTop, marginUnit ), getSpacingOptionOutput( previewMarginRight, marginUnit ), getSpacingOptionOutput( previewMarginBottom, marginUnit ), getSpacingOptionOutput( previewMarginLeft, marginUnit ) ] }*/}
			{/*/>*/}
			{justCompletedOnboarding && <PopoverTutorial {...props} headerRef={componentRef} />}
		</>
	);
}

export default EditInner;

function useHeaderProp(prop) {
	return useEntityProp('postType', 'kadence_header', prop);
}
