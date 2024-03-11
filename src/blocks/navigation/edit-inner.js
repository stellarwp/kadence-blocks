/**
 * BLOCK: Kadence Advanced Navigation
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useState, useCallback, useEffect, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { get, isEqual } from 'lodash';
import { addQueryArgs } from '@wordpress/url';
import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { formBlockIcon } from '@kadence/icons';
import {
	KadencePanelBody,
	InspectorControlTabs,
	SpacingVisualizer,
	ResponsiveMeasureRangeControl,
	RangeControl,
	ResponsiveRangeControls,
	PopColorControl,
	HoverToggleControl,
	TypographyControls,
	ResponsiveSingleBorderControl,
	ResponsiveBorderControl,
	ResponsiveSelectControl,
	SmallResponsiveControl,
} from '@kadence/components';
import { getPreviewSize, getSpacingOptionOutput, mouseOverVisualizer, showSettings } from '@kadence/helpers';

import {
	InspectorControls,
	BlockControls,
	useInnerBlocksProps,
	InspectorAdvancedControls,
	store as editorStore,
} from '@wordpress/block-editor';
import {
	TextControl,
	ToggleControl,
	ToolbarGroup,
	ExternalLink,
	Button,
	Placeholder,
	Modal,
	SelectControl,
} from '@wordpress/components';

import { FormTitle, SelectForm, MenuEditor } from './components';

/**
 * Internal dependencies
 */
import classnames from 'classnames';
import { useEntityPublish } from './hooks';
import { DEFAULT_BLOCK, ALLOWED_BLOCKS, PRIORITIZED_INSERTER_BLOCKS } from './constants';
import BackendStyles from './components/backend-styles';

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;
export function EditInner(props) {
	const { attributes, setAttributes, clientId, direct, id, isSelected } = props;
	const { uniqueID } = attributes;

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	const [activeTab, setActiveTab] = useState('general');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();
	const borderMouseOver = mouseOverVisualizer();

	const [meta, setMeta] = useNavigationProp('meta');

	const metaAttributes = {
		padding: meta?._kad_navigation_padding,
		tabletPadding: meta?._kad_navigation_tabletPadding,
		mobilePadding: meta?._kad_navigation_mobilePadding,
		paddingUnit: meta?._kad_navigation_paddingUnit,
		margin: meta?._kad_navigation_margin,
		tabletMargin: meta?._kad_navigation_tabletMargin,
		mobileMargin: meta?._kad_navigation_mobileMargin,
		marginUnit: meta?._kad_navigation_marginUnit,
		border: meta?._kad_navigation_border,
		borderRadius: meta?._kad_navigation_borderRadius,
		borderColor: meta?._kad_navigation_borderColor,
		borderUnit: meta?._kad_navigation_borderUnit,
		className: meta?._kad_navigation_className,
		anchor: meta?._kad_navigation_anchor,
		orientation: meta?._kad_navigation_orientation,
		orientationTablet: meta?._kad_navigation_orientationTablet,
		orientationMobile: meta?._kad_navigation_orientationMobile,
		style: meta?._kad_navigation_style,
		styleTablet: meta?._kad_navigation_styleTablet,
		styleMobile: meta?._kad_navigation_styleMobile,
		spacing: meta?._kad_navigation_spacing,
		spacingTablet: meta?._kad_navigation_spacingTablet,
		spacingMobile: meta?._kad_navigation_spacingMobile,
		spacingUnit: meta?._kad_navigation_spacingUnit,
		stretch: meta?._kad_navigation_stretch,
		stretchTablet: meta?._kad_navigation_stretchTablet,
		stretchMobile: meta?._kad_navigation_stretchMobile,
		fillStretch: meta?._kad_navigation_fillStretch,
		fillStretchTablet: meta?._kad_navigation_fillStretchTablet,
		fillStretchMobile: meta?._kad_navigation_fillStretchMobile,
		parentActive: meta?._kad_navigation_parentActive,
		parentActiveTablet: meta?._kad_navigation_parentActiveTablet,
		parentActiveMobile: meta?._kad_navigation_parentActiveMobile,
		collapseSubMenus: meta?._kad_navigation_collapseSubMenus,
		collapseSubMenusTablet: meta?._kad_navigation_collapseSubMenusTablet,
		collapseSubMenusMobile: meta?._kad_navigation_collapseSubMenusMobile,
		parentTogglesMenus: meta?._kad_navigation_parentTogglesMenus,
		parentTogglesMenusTablet: meta?._kad_navigation_parentTogglesMenusTablet,
		parentTogglesMenusMobile: meta?._kad_navigation_parentTogglesMenusMobile,
		linkColor: meta?._kad_navigation_linkColor,
		linkColorHover: meta?._kad_navigation_linkColorHover,
		linkColorActive: meta?._kad_navigation_linkColorActive,
		linkColorTablet: meta?._kad_navigation_linkColorTablet,
		linkColorHoverTablet: meta?._kad_navigation_linkColorHoverTablet,
		linkColorActiveTablet: meta?._kad_navigation_linkColorActiveTablet,
		linkColorMobile: meta?._kad_navigation_linkColorMobile,
		linkColorHoveMobiler: meta?._kad_navigation_linkColorHoverMobile,
		linkColorActiveMobile: meta?._kad_navigation_linkColorActiveMobile,
		background: meta?._kad_navigation_link_color,
		backgroundHover: meta?._kad_navigation_backgroundHover,
		backgroundActive: meta?._kad_navigation_backgroundActive,
		backgroundTablet: meta?._kad_navigation_backgroundTablet,
		backgroundHoverTablet: meta?._kad_navigation_backgroundHoverTablet,
		backgroundActiveTablet: meta?._kad_navigation_backgroundActiveTablet,
		backgroundMobile: meta?._kad_navigation_backgroundMobile,
		backgroundHoverMobile: meta?._kad_navigation_backgroundHoverMobile,
		backgroundActiveMobile: meta?._kad_navigation_backgroundActiveMobile,
		typography: meta?._kad_navigation_typography,
		divider: meta?._kad_navigation_divider,
		dividerTablet: meta?._kad_navigation_dividerTablet,
		dividerMobile: meta?._kad_navigation_dividerMobile,
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
		borderRadius,
		borderColor,
		borderUnit,
		className,
		anchor,
		orientation,
		orientationTablet,
		orientationMobile,
		style,
		styleTablet,
		styleMobile,
		spacing,
		spacingTablet,
		spacingMobile,
		spacingUnit,
		stretch,
		stretchTablet,
		stretchMobile,
		fillStretch,
		fillStretchTablet,
		fillStretchMobile,
		parentActive,
		parentActiveTablet,
		parentActiveMobile,
		collapseSubMenus,
		collapseSubMenusTablet,
		collapseSubMenusMobile,
		parentTogglesMenus,
		parentTogglesMenusTablet,
		parentTogglesMenusMobile,
		linkColor,
		linkColorHover,
		linkColorActive,
		linkColorTablet,
		linkColorHoverTablet,
		linkColorActiveTablet,
		linkColorMobile,
		linkColorHoverMobile,
		linkColorActiveMobile,
		background,
		backgroundHover,
		backgroundActive,
		backgroundTablet,
		backgroundHoverTablet,
		backgroundActiveTablet,
		backgroundMobile,
		backgroundHoverMobile,
		backgroundActiveMobile,
		typography,
		divider,
		dividerTablet,
		dividerMobile,
	} = metaAttributes;

	const previewOrientation = getPreviewSize(previewDevice, orientation, orientationTablet, orientationMobile);
	const previewStyle = getPreviewSize(previewDevice, style, styleTablet, styleMobile);
	const previewCollapseSubMenus = getPreviewSize(
		previewDevice,
		collapseSubMenus,
		collapseSubMenusTablet,
		collapseSubMenusMobile
	);

	const setMetaAttribute = (value, key) => {
		setMeta({ ...meta, ['_kad_navigation_' + key]: value });
	};

	const saveTypography = (value) => {
		const newUpdate = typography.map((item, index) => {
			if (0 === index) {
				item = { ...item, ...value };
			}
			return item;
		});
		setMetaAttribute(newUpdate, 'typography');
	};

	const navClasses = classnames('navigation', {
		[`navigation-dropdown-animation-fade-${id}`]: true,
		// [`navigation-desktop-dropdown-animation-fade-${dropdownAnimation}`]: !previewDevice || previewDevice == 'Desktop',
		// [`navigation-tablet-dropdown-animation-fade-${dropdownAnimationTablet}`]: previewDevice == 'Tablet',
		// [`navigation-mobile-dropdown-animation-fade-${dropdownAnimationMobile}`]: previewDevice == 'Mobile',
		[`navigation-desktop-style-${style}`]: !previewDevice || previewDevice == 'Desktop',
		[`navigation-tablet-style-${styleTablet}`]: previewDevice == 'Tablet',
		[`navigation-mobile-style-${styleMobile}`]: previewDevice == 'Mobile',
	});

	const innerNavClasses = classnames('menu', {
		'kb-navigation': true,
		[`kb-navigation-${id}`]: true,
		[`collapse-sub-nav-desktop-${collapseSubMenus}`]: !previewDevice || previewDevice == 'Desktop',
		[`collapse-sub-nav-tablet-${collapseSubMenusTablet}`]: previewDevice == 'Tablet',
		[`collapse-sub-nav-mobile-${collapseSubMenusMobile}`]: previewDevice == 'Mobile',
	});

	const [title, setTitle] = useNavigationProp('title');

	let [blocks, onInput, onChange] = useEntityBlockEditor('postType', 'kadence_navigation', id);
	const { updateBlockAttributes } = useDispatch(editorStore);

	const emptyNavigation = useMemo(() => {
		return [createBlock('kadence/navigation', {})];
	}, [clientId]);

	if (blocks.length === 0) {
		blocks = emptyNavigation;
	}

	const navigationInnerBlocks = useMemo(() => {
		return get(blocks, [0, 'innerBlocks'], []);
	}, [blocks]);

	const newBlock = useMemo(() => {
		return get(blocks, [0], {});
	}, [blocks]);

	const [isAdding, addNew] = useEntityPublish('kadence_navigation', id);
	const onAdd = async (title, template, initialDescription) => {
		try {
			const response = await addNew();

			if (response.id) {
				onChange([{ ...newBlock, innerBlocks: [createBlock('kadence/navigation-link', {})] }], clientId);

				setTitle(title);

				const updatedMeta = meta;
				updatedMeta._kad_navigation_description = initialDescription;

				setMeta({ ...meta, updatedMeta });
				await wp.data.dispatch('core').saveEditedEntityRecord('postType', 'kadence_navigation', id);
			}
		} catch (error) {
			console.error(error);
		}
	};

	const [isOpen, setOpen] = useState(false);
	const openModal = () => setOpen(true);
	const closeModal = () => setOpen(false);

	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerNavClasses,
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			prioritizedInserterBlocks: PRIORITIZED_INSERTER_BLOCKS,
			value: !direct ? navigationInnerBlocks : undefined,
			onInput: !direct ? (a, b) => onInput([{ ...newBlock, innerBlocks: a }], b) : undefined,
			onChange: !direct ? (a, b) => onChange([{ ...newBlock, innerBlocks: a }], b) : undefined,
			templateLock: false,
			defaultBlock: DEFAULT_BLOCK,
			// renderAppender: navigationInnerBlocks.length === 0 ? useFieldBlockAppenderBase : useFieldBlockAppender
		}
	);

	if (navigationInnerBlocks.length === 0) {
		return (
			<>
				<FormTitle onAdd={onAdd} isAdding={isAdding} existingTitle={title} />
				<div className="kb-form-hide-while-setting-up">
					<div {...innerBlocksProps} />
				</div>
			</>
		);
	}

	const generalToggleControls = (size = '') => {
		const collapseSubMenusValue = metaAttributes['collapseSubMenus' + size];
		const parentTogglesMenusValue = metaAttributes['parentTogglesMenus' + size];
		const stretchValue = metaAttributes['stretch' + size];
		const fillStretchValue = metaAttributes['fillStretch' + size];
		const parentActiveValue = metaAttributes['parentActive' + size];
		const orientationValue = metaAttributes['orientation' + size];

		return (
			<>
				{orientationValue == 'vertical' && (
					<ToggleControl
						label={__('Collapse Sub Menus', 'kadence-blocks')}
						checked={collapseSubMenusValue}
						onChange={(value) => setMetaAttribute(value, 'collapseSubMenus' + size)}
					/>
				)}
				{orientationValue == 'vertical' && collapseSubMenusValue && (
					<ToggleControl
						label={__('Entire Item Expands Sub Menu', 'kadence-blocks')}
						checked={parentTogglesMenusValue}
						onChange={(value) => setMetaAttribute(value, 'parentTogglesMenus' + size)}
					/>
				)}
				<ToggleControl
					label={__('Stretch Menu', 'kadence-blocks')}
					checked={stretchValue}
					onChange={(value) => setMetaAttribute(value, 'stretch' + size)}
				/>
				{stretchValue && (
					<ToggleControl
						label={__('Fill andd Center Menu Items?', 'kadence-blocks')}
						checked={fillStretchValue}
						onChange={(value) => setMetaAttribute(value, 'fillStretch' + size)}
					/>
				)}
				<ToggleControl
					label={__('Make Parent of Current Menu item Active', 'kadence-blocks')}
					checked={parentActiveValue}
					onChange={(value) => setMetaAttribute(value, 'parentActive' + size)}
				/>
			</>
		);
	};

	const styleColorControls = (size = '') => {
		const linkColorValue = metaAttributes['linkColor' + size];
		const backgroundValue = metaAttributes['background' + size];
		const linkColorHoverValue = metaAttributes['linkColorHover' + size];
		const backgroundHoverValue = metaAttributes['backgroundHover' + size];
		const linkColorActiveValue = metaAttributes['linkColorActive' + size];
		const backgroundActiveValue = metaAttributes['backgroundActive' + size];
		return (
			<>
				<HoverToggleControl
					normal={
						<>
							<PopColorControl
								label={__('Link Color', 'kadence-blocks')}
								value={linkColorValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'linkColor' + size)}
								key={'normal'}
							/>
							<PopColorControl
								label={__('Background', 'kadence-blocks')}
								value={backgroundValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'background' + size)}
								key={'normalb'}
							/>
						</>
					}
					hover={
						<>
							<PopColorControl
								label={__('Link Color Hover', 'kadence-blocks')}
								value={linkColorHoverValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'linkColorHover' + size)}
								key={'hover'}
							/>
							<PopColorControl
								label={__('Background Hover', 'kadence-blocks')}
								value={backgroundHoverValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'backgroundHover' + size)}
								key={'hoverb'}
							/>
						</>
					}
					active={
						<>
							<PopColorControl
								label={__('Link Color Active', 'kadence-blocks')}
								value={linkColorActiveValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'linkColorActive' + size)}
								key={'active'}
							/>
							<PopColorControl
								label={__('Background Active', 'kadence-blocks')}
								value={backgroundActiveValue}
								default={''}
								onChange={(value) => setMetaAttribute(value, 'backgroundActive' + size)}
								key={'activeb'}
							/>
						</>
					}
				/>
			</>
		);
	};

	if (typeof pagenow !== 'undefined' && ('widgets' === pagenow || 'customize' === pagenow)) {
		const editPostLink = addQueryArgs('post.php', {
			post: id,
			action: 'edit',
		});
		return (
			<>
				<Placeholder
					className="kb-select-or-create-placeholder"
					label={__('Kadence Heading', 'kadence-blocks')}
					icon={formBlockIcon}
				>
					<p style={{ width: '100%', marginBottom: '10px' }}>
						{__('Advanced Navs can not be edited within the widgets screen.', 'kadence-blocks')}
					</p>
					<Button href={editPostLink} variant="primary" className="kb-navigation-edit-link">
						{__('Edit Navigation', 'kadence-blocks')}
					</Button>
				</Placeholder>
				<InspectorControls>
					<KadencePanelBody
						panelName={'kb-advanced-navigation-selected-switch'}
						title={__('Selected Navigation', 'kadence-blocks')}
					>
						<SelectForm
							postType="kadence_navigation"
							label={__('Selected Navigation', 'kadence-blocks')}
							hideLabelFromVision={true}
							onChange={(nextId) => {
								setAttributes({ id: parseInt(nextId) });
							}}
							value={id}
						/>
					</KadencePanelBody>
				</InspectorControls>
			</>
		);
	}

	return (
		<>
			<BackendStyles {...props} metaAttributes={metaAttributes} previewDevice={previewDevice} />
			<InspectorControls>
				<InspectorControlTabs
					panelName={'advanced-navigation'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<>
							<br />

							<Button variant="secondary" onClick={openModal}>
								{__('Open Visual Editor', 'kadence-blocks')}
							</Button>

							{isOpen && (
								<Modal
									title={__('Menu Editor', 'kadence-blocks')}
									onRequestClose={closeModal}
									size={'large'}
									style={{ minWidth: '600px' }}
								>
									<MenuEditor />
								</Modal>
							)}
						</>
						<div className="kt-sidebar-settings-spacer"></div>
						<KadencePanelBody panelName={'kb-navigation-general'}>
							<ResponsiveSelectControl
								label={__('Orientation', 'kadence-blocks')}
								value={orientation}
								tabletValue={orientationTablet}
								mobileValue={orientationMobile}
								options={[
									{ value: 'horizontal', label: __('Horizontal') },
									{ value: 'vertical', label: __('Vertical') },
								]}
								onChange={(value) => setMetaAttribute(value, 'orientation')}
								onChangeTablet={(value) => setMetaAttribute(value, 'orientationTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'orientationMobile')}
							/>
							<ResponsiveRangeControls
								label={__('Horizontal Item Spacing', 'kadence-blocks')}
								value={parseFloat(spacing[1])}
								valueTablet={parseFloat(spacingTablet[1])}
								valueMobile={parseFloat(spacingMobile[1])}
								onChange={(value) =>
									setMetaAttribute(
										[spacing[0], value.toString(), spacing[2], value.toString()],
										'spacing'
									)
								}
								onChangeTablet={(value) =>
									setMetaAttribute(
										[spacingTablet[0], value.toString(), spacingTablet[2], value.toString()],
										'spacingTablet'
									)
								}
								onChangeMobile={(value) =>
									setMetaAttribute(
										[spacingMobile[0], value.toString(), spacingMobile[2], value.toString()],
										'spacingMobile'
									)
								}
								min={0}
								max={spacingUnit === 'em' || spacingUnit === 'rem' ? 24 : 200}
								step={spacingUnit === 'em' || spacingUnit === 'rem' ? 0.1 : 1}
								unit={spacingUnit}
								units={['em', 'rem', 'px', 'vw']}
								onUnit={(value) => setMetaAttribute(value, 'spacingUnit')}
								showUnit={true}
							/>
							{(previewOrientation == 'vertical' ||
								style == 'underline' ||
								style === 'standard' ||
								style === '') && (
								<ResponsiveRangeControls
									label={__('Vertical Item Spacing', 'kadence-blocks')}
									value={parseFloat(spacing[0])}
									valueTablet={parseFloat(spacingTablet[0])}
									valueMobile={parseFloat(spacingMobile[0])}
									onChange={(value) =>
										setMetaAttribute(
											[value.toString(), spacing[1], value.toString(), spacing[3]],
											'spacing'
										)
									}
									onChangeTablet={(value) =>
										setMetaAttribute(
											[
												value.toString(),
												spacingTablet[1],
												value.toString(),
												spaspacingTabletcing[3],
											],
											'spacingTablet'
										)
									}
									onChangeMobile={(value) =>
										setMetaAttribute(
											[value.toString(), spacingMobile[1], value.toString(), spacingMobile[3]],
											'spacingMobile'
										)
									}
									min={0}
									max={spacingUnit === 'em' || spacingUnit === 'rem' ? 24 : 200}
									step={spacingUnit === 'em' || spacingUnit === 'rem' ? 0.1 : 1}
									unit={spacingUnit}
									units={['em', 'rem', 'px', 'vw']}
									onUnit={(value) => setMetaAttribute(value, 'spacingUnit')}
									showUnit={true}
								/>
							)}
							<SmallResponsiveControl
								label={'layout toggles'}
								desktopChildren={generalToggleControls()}
								tabletChildren={generalToggleControls('Tablet')}
								mobileChildren={generalToggleControls('Mobile')}
							></SmallResponsiveControl>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'style' && (
					<>
						<KadencePanelBody panelName={'kb-navigation-style'}>
							<ResponsiveSelectControl
								label={__('Style', 'kadence-blocks')}
								value={style}
								valueTablet={styleTablet}
								valueMobile={styleMobile}
								options={[
									{ value: 'standard', label: __('Standard') },
									{ value: 'fullheight', label: __('Full Height') },
									{ value: 'underline', label: __('Underline') },
									{ value: 'underline-fullheight', label: __('Full Height Underline') },
								]}
								onChange={(value) => setMetaAttribute(value, 'style')}
								onChangeTablet={(value) => setMetaAttribute(value, 'styleTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'styleMobile')}
							/>
							<SmallResponsiveControl
								label={'Colors'}
								desktopChildren={styleColorControls()}
								tabletChildren={styleColorControls('Tablet')}
								mobileChildren={styleColorControls('Mobile')}
							></SmallResponsiveControl>
						</KadencePanelBody>

						<KadencePanelBody
							title={__('Divider Settings', 'kadence-blocks')}
							initialOpen={false}
							panelName={'kb-navigation-divider'}
						>
							<ResponsiveSingleBorderControl
								label={'Divider'}
								value={divider}
								tabletValue={dividerTablet}
								mobileValue={dividerMobile}
								onChange={(value) => setMetaAttribute(value, 'divider')}
								onChangeTablet={(value) => setMetaAttribute(value, 'dividerTablet')}
								onChangeMobile={(value) => setMetaAttribute(value, 'dividerMobile')}
							/>
						</KadencePanelBody>

						{showSettings('fontSettings', 'kadence/navigation') && (
							<KadencePanelBody
								title={__('Typography Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-adv-btn-font-family'}
							>
								<TypographyControls
									fontSize={typography[0].size}
									onFontSize={(value) => saveTypography({ size: value })}
									fontSizeType={typography[0].sizeType}
									onFontSizeType={(value) => saveTypography({ sizeType: value })}
									lineHeight={typography[0].lineHeight}
									onLineHeight={(value) => saveTypography({ lineHeight: value })}
									lineHeightType={typography[0].lineType}
									onLineHeightType={(value) => saveTypography({ lineType: value })}
									reLetterSpacing={typography[0].letterSpacing}
									onLetterSpacing={(value) => saveTypography({ letterSpacing: value })}
									letterSpacingType={typography[0].letterType}
									onLetterSpacingType={(value) => saveTypography({ letterType: value })}
									textTransform={typography[0].textTransform}
									onTextTransform={(value) => saveTypography({ textTransform: value })}
									fontFamily={typography[0].family}
									onFontFamily={(value) => saveTypography({ family: value })}
									onFontChange={(select) => {
										saveTypography({
											family: select.value,
											google: select.google,
										});
									}}
									onFontArrayChange={(values) => saveTypography(values)}
									googleFont={typography[0].google}
									onGoogleFont={(value) => saveTypography({ google: value })}
									loadGoogleFont={typography[0].loadGoogle}
									onLoadGoogleFont={(value) => saveTypography({ loadGoogle: value })}
									fontVariant={typography[0].variant}
									onFontVariant={(value) => saveTypography({ variant: value })}
									fontWeight={typography[0].weight}
									onFontWeight={(value) => saveTypography({ weight: value })}
									fontStyle={typography[0].style}
									onFontStyle={(value) => saveTypography({ style: value })}
									fontSubset={typography[0].subset}
									onFontSubset={(value) => saveTypography({ subset: value })}
								/>
							</KadencePanelBody>
						)}
						<div className="kt-sidebar-settings-spacer"></div>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-row-padding'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
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
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 24 : 200}
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
								onChange={(value) => {
									setMetaAttribute(value.map(String), 'margin');
								}}
								onChangeTablet={(value) => {
									setMetaAttribute(value.map(String), 'tabletMargin');
								}}
								onChangeMobile={(value) => {
									setMetaAttribute(value.map(String), 'mobileMargin');
								}}
								min={0}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 24 : 200}
								step={paddingUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setMetaAttribute(value, 'marginUnit')}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<InspectorAdvancedControls>
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
			<nav className={navClasses}>
				<div className="menu-container">
					<ul {...innerBlocksProps} />
				</div>
			</nav>
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
		</>
	);
}
export default EditInner;

function useNavigationProp(prop) {
	return useEntityProp('postType', 'kadence_navigation', prop);
}

function useNavigationMeta(key) {
	const [meta, setMeta] = useNavigationProp('meta');

	return [
		meta[key],
		useCallback(
			(newValue) => {
				setMeta({ ...meta, [key]: newValue });
			},
			[key, setMeta]
		),
	];
}
