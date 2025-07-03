/**
 * BLOCK: Kadence Header Row
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal block libraries
 */
import { useSelect, useDispatch } from '@wordpress/data';
import { useInnerBlocksProps, InspectorControls, useBlockProps } from '@wordpress/block-editor';

import { uniqueIdHelper, hasKadenceCustomCss } from '@kadence/helpers';
import {
	SelectParentBlock,
	ResponsiveRangeControls,
	ResponsiveBorderControl,
	ResponsiveMeasurementControls,
	ResponsiveMeasureRangeControl,
	BackgroundControl as KadenceBackgroundControl,
	KadenceRadioButtons,
	BackgroundTypeControl,
	PopColorControl,
	GradientControl,
	InspectorControlTabs,
	KadencePanelBody,
	ResponsiveAlignControls,
	ResponsiveGapSizeControl,
	ResponsiveSelectControl,
} from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import BackendStyles from './components/backend-styles';

export function Edit(props) {
	const { attributes, setAttributes, clientId, context, isSelected } = props;

	const {
		uniqueID,
		location,
		layout,
		layoutConfig,
		background,
		backgroundTransparent,
		border,
		borderTablet,
		borderMobile,
		borderRadius,
		borderRadiusTablet,
		borderRadiusMobile,
		borderRadiusUnit,
		padding,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		margin,
		marginTablet,
		marginMobile,
		marginUnit,
		minHeight,
		minHeightTablet,
		minHeightMobile,
		minHeightUnit,
		maxWidth,
		maxWidthTablet,
		maxWidthMobile,
		maxWidthUnit,
		itemGap,
		itemGapTablet,
		itemGapMobile,
		itemGapUnit,
		vAlign,
		vAlignTablet,
		vAlignMobile,
		sectionPriority,
		sectionPriorityTablet,
		sectionPriorityMobile,
		kadenceBlockCSS,
	} = attributes;

	const [activeTab, setActiveTab] = useState('general');
	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	const { innerBlocks } = useSelect((select) => {
		return {
			innerBlocks: select('core/block-editor').getBlock(clientId)?.innerBlocks,
		};
	}, []);

	uniqueIdHelper(props);

	const hasInsertedChildBlocks = useMemo(() => {
		if (innerBlocks) {
			return recursiveHasInsertedChildBlocks(innerBlocks);
		}

		return true;
	}, [innerBlocks]);
	const hasCustomCss = hasKadenceCustomCss(kadenceBlockCSS);
	const blockClasses = classnames({
		'wp-block-kadence-header-row': true,
		[`wp-block-kadence-header-row-${location}`]: location,
		[`wp-block-kadence-header-row${uniqueID}`]: uniqueID,
		[`kb-header-row-layout-${layout}`]: layout,
		[`kb-header-row-layout-standard`]: !layout,
		[`kb-header-row-layout-config-${layoutConfig}`]: layoutConfig,
		'wp-block-kadence-header-row--force-hide': !hasInsertedChildBlocks,
		'kadence-has-custom-css': hasCustomCss,
	});
	const blockProps = useBlockProps({
		className: blockClasses,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'kadence-header-row-inner',
		},
		{
			renderAppender: false,
			templateLock: 'all',
		}
	);

	const backgroundStyleControls = (size = '', suffix = '') => {
		const backgroundValue = attributes['background' + suffix + size];
		return (
			<>
				<BackgroundTypeControl
					label={__('Type', 'kadence-blocks')}
					type={undefined != backgroundValue?.type ? backgroundValue.type : 'normal'}
					onChange={(value) =>
						setAttributes({
							['background' + suffix + size]: { ...backgroundValue, type: value },
						})
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
								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, color: value },
								});
							}}
							defaultValue={suffix === 'Transparent' ? 'transparent' : undefined}
						/>
						<KadenceBackgroundControl
							label={__('Background Image', 'kadence-blocks')}
							hasImage={backgroundValue?.image}
							imageURL={backgroundValue?.image ? backgroundValue.image : ''}
							imageID={backgroundValue?.imageID}
							imagePosition={backgroundValue?.position ? backgroundValue.position : 'center center'}
							imageSize={backgroundValue?.size ? backgroundValue.size : 'cover'}
							imageRepeat={backgroundValue?.repeat ? backgroundValue.repeat : 'no-repeat'}
							imageAttachment={backgroundValue?.attachment ? backgroundValue.attachment : 'scroll'}
							onRemoveImage={() => {
								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, imageID: undefined },
								});

								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, image: undefined },
								});
							}}
							onSaveImage={(value) => {
								setAttributes({
									['background' + suffix + size]: {
										...backgroundValue,
										imageID: value.id.toString(),
									},
								});

								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, image: value.url },
								});
							}}
							onSaveURL={(newURL) => {
								if (newURL !== backgroundValue.image) {
									setAttributes({
										['background' + suffix + size]: { ...backgroundValue, imageID: undefined },
									});

									setAttributes({
										['background' + suffix + size]: { ...backgroundValue, image: newURL },
									});
								}
							}}
							onSavePosition={(value) =>
								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, position: value },
								})
							}
							onSaveSize={(value) =>
								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, size: value },
								})
							}
							onSaveRepeat={(value) =>
								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, repeat: value },
								})
							}
							onSaveAttachment={(value) =>
								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, attachment: value },
								})
							}
							disableMediaButtons={backgroundValue?.image ? true : false}
							isSelected={isSelected}
							attributes={attributes}
							setAttributes={setAttributes}
							name={'kadence/header-row'}
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
								setAttributes({
									['background' + suffix + size]: { ...backgroundValue, gradient: value },
								});
							}}
							gradients={[]}
						/>
					</>
				)}
			</>
		);
	};

	return (
		<div {...blockProps}>
			<BackendStyles {...props} previewDevice={previewDevice} />
			<InspectorControls>
				<SelectParentBlock
					label={__('View Header Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/header'}
				/>
				{!hasInsertedChildBlocks && (
					<KadencePanelBody>
						{__('Alert: This row has no content. Add blocks to display this row.', 'kadence-blocks')}
					</KadencePanelBody>
				)}
				<>
					<InspectorControlTabs
						panelName={'header-row'}
						setActiveTab={(value) => setActiveTab(value)}
						activeTab={activeTab}
					/>

					{activeTab === 'general' && (
						<>
							<KadencePanelBody>
								<KadenceRadioButtons
									label={__('Layout Config', 'kadence-blocks')}
									value={layoutConfig}
									options={[
										{ value: '', label: __('Default', 'kadence-blocks') },
										{ value: 'single', label: __('Single Container', 'kadence-blocks') },
									]}
									hideLabel={false}
									onChange={(value) => {
										setAttributes({ layoutConfig: value });
									}}
									help={
										'single' === layoutConfig
											? __(
													'The Default layout shows 5 containers per row. Switching to Single Container hides containers 2–5, but your content remains saved and will reappear when you switch back to the Default view.',
													'kadence-blocks'
												)
											: ''
									}
								/>
								<KadenceRadioButtons
									label={__('Layout Width', 'kadence-blocks')}
									value={layout}
									options={[
										{ value: '', label: __('Standard', 'kadence-blocks') },
										{ value: 'fullwidth', label: __('Full Width', 'kadence-blocks') },
										{ value: 'contained', label: __('Contained', 'kadence-blocks') },
									]}
									hideLabel={false}
									onChange={(value) => {
										setAttributes({ layout: value });
									}}
								/>
								<ResponsiveRangeControls
									label={__('Min Height', 'kadence-blocks')}
									value={minHeight}
									onChange={(value) => setAttributes({ minHeight: value })}
									tabletValue={minHeightTablet}
									onChangeTablet={(value) => setAttributes({ minHeightTablet: value })}
									mobileValue={minHeightMobile}
									onChangeMobile={(value) => setAttributes({ minHeightMobile: value })}
									min={0}
									max={minHeightUnit === 'px' ? 600 : 100}
									step={1}
									unit={minHeightUnit}
									onUnit={(value) => {
										setAttributes({ minHeightUnit: value });
									}}
									units={['px', 'em', 'vh']}
									reset={() =>
										setAttributes({
											minHeight: null,
											minHeightTablet: null,
											minHeightMobile: null,
										})
									}
									showUnit={true}
								/>
								<ResponsiveGapSizeControl
									label={__('Item Gap', 'kadence-blocks')}
									value={itemGap}
									onChange={(value) => setAttributes({ itemGap: String(value) })}
									tabletValue={itemGapTablet}
									onChangeTablet={(value) => setAttributes({ itemGapTablet: String(value) })}
									mobileValue={itemGapMobile}
									onChangeMobile={(value) => setAttributes({ itemGapMobile: String(value) })}
									min={0}
									max={itemGapUnit === 'px' ? 200 : 12}
									step={itemGapUnit === 'px' ? 1 : 0.1}
									unit={itemGapUnit}
									onUnit={(value) => {
										setAttributes({ itemGapUnit: value });
									}}
									units={['px', 'em', 'rem']}
								/>
								<ResponsiveAlignControls
									label={__('Vertical Alignment', 'kadence-blocks')}
									value={vAlign ? vAlign : ''}
									tabletValue={vAlignTablet ? vAlignTablet : ''}
									mobileValue={vAlignMobile ? vAlignMobile : ''}
									onChange={(nextAlign) =>
										setAttributes({ vAlign: nextAlign ? nextAlign : 'center' })
									}
									onChangeTablet={(nextAlign) =>
										setAttributes({ vAlignTablet: nextAlign ? nextAlign : '' })
									}
									onChangeMobile={(nextAlign) =>
										setAttributes({ vAlignMobile: nextAlign ? nextAlign : '' })
									}
									type={'vertical'}
								/>
								{layoutConfig !== 'single' && (
									<ResponsiveSelectControl
										label={__('Section Priority', 'kadence-blocks')}
										value={sectionPriority}
										tabletValue={sectionPriorityTablet}
										mobileValue={sectionPriorityMobile}
										options={[
											{ value: '', label: __('Default', 'kadence-blocks') },
											{ value: 'center', label: __('Center', 'kadence-blocks') },
											{ value: 'left', label: __('Left', 'kadence-blocks') },
											{ value: 'right', label: __('Right', 'kadence-blocks') },
										]}
										onChange={(value) => setAttributes({ sectionPriority: value })}
										onChangeTablet={(value) => setAttributes({ sectionPriorityTablet: value })}
										onChangeMobile={(value) => setAttributes({ sectionPriorityMobile: value })}
									/>
								)}
							</KadencePanelBody>
						</>
					)}
					{activeTab === 'style' && (
						<>
							<KadencePanelBody
								title={__('Background Settings', 'kadence-blocks')}
								initialOpen={true}
								panelName={'kb-header-row-bg-settings'}
							>
								{backgroundStyleControls()}
							</KadencePanelBody>
							{context?.['kadence/headerIsTransparent'] == '1' && (
								<KadencePanelBody
									title={__('Transparent Background Settings', 'kadence-blocks')}
									initialOpen={false}
									panelName={'kb-header-bg-transparent-settings'}
								>
									{backgroundStyleControls('', 'Transparent')}
								</KadencePanelBody>
							)}
							<KadencePanelBody
								title={__('Border Settings', 'kadence-blocks')}
								initialOpen={false}
								panelName={'kb-header-row-border-settings'}
							>
								<ResponsiveBorderControl
									label={__('Border', 'kadence-blocks')}
									value={border}
									tabletValue={borderTablet}
									mobileValue={borderMobile}
									onChange={(value) => setAttributes({ border: value })}
									onChangeTablet={(value) => setAttributes({ borderTablet: value })}
									onChangeMobile={(value) => setAttributes({ borderMobile: value })}
								/>

								<ResponsiveMeasurementControls
									label={__('Border Radius', 'kadence-blocks')}
									value={borderRadius}
									tabletValue={borderRadiusTablet}
									mobileValue={borderRadiusMobile}
									onChange={(value) => setAttributes({ borderRadius: value })}
									onChangeTablet={(value) => setAttributes({ borderRadiusTablet: value })}
									onChangeMobile={(value) => setAttributes({ borderRadiusMobile: value })}
									min={0}
									max={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 24 : 100}
									step={borderRadiusUnit === 'em' || borderRadiusUnit === 'rem' ? 0.1 : 1}
									unit={borderRadiusUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ borderRadiusUnit: value })}
									isBorderRadius={true}
									allowEmpty={true}
								/>
							</KadencePanelBody>
						</>
					)}
					{activeTab === 'advanced' && (
						<>
							<KadencePanelBody panelName={'kb-header-row-padding'}>
								<ResponsiveMeasureRangeControl
									label={__('Padding', 'kadence-blocks')}
									value={padding}
									tabletValue={paddingTablet}
									mobileValue={paddingMobile}
									onChange={(value) => setAttributes({ padding: value })}
									onChangeTablet={(value) => setAttributes({ paddingTablet: value })}
									onChangeMobile={(value) => setAttributes({ paddingMobile: value })}
									min={0}
									max={
										paddingUnit === 'em' || paddingUnit === 'rem'
											? 25
											: paddingUnit === 'px'
												? 400
												: 100
									}
									step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
									unit={paddingUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ paddingUnit: value })}
									ghostDefault={['', 'sm', '', 'sm']}
								/>
								<ResponsiveMeasureRangeControl
									label={__('Margin', 'kadence-blocks')}
									value={margin}
									tabletValue={marginTablet}
									mobileValue={marginMobile}
									onChange={(value) => setAttributes({ margin: value })}
									onChangeTablet={(value) => setAttributes({ marginTablet: value })}
									onChangeMobile={(value) => setAttributes({ marginMobile: value })}
									min={0}
									max={
										marginUnit === 'em' || marginUnit === 'rem'
											? 25
											: marginUnit === 'px'
												? 400
												: 100
									}
									step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
									unit={marginUnit}
									units={['px', 'em', 'rem', '%']}
									onUnit={(value) => setAttributes({ marginUnit: value })}
								/>
							</KadencePanelBody>
							<KadencePanelBody
								panelName={'kb-header-row-max-width'}
								title={__('Container Width', 'kadence-blocks')}
								initialOpen={false}
							>
								<ResponsiveRangeControls
									label={__('Max Width', 'kadence-blocks')}
									value={maxWidth}
									onChange={(value) => setAttributes({ maxWidth: value })}
									tabletValue={maxWidthTablet}
									onChangeTablet={(value) => setAttributes({ maxWidthTablet: value })}
									mobileValue={maxWidthMobile}
									onChangeMobile={(value) => setAttributes({ maxWidthMobile: value })}
									min={0}
									max={maxWidthUnit === 'px' ? 2000 : 100}
									step={1}
									unit={maxWidthUnit}
									onUnit={(value) => {
										setAttributes({ maxWidthUnit: value });
									}}
									reset={() =>
										setAttributes({
											maxWidth: null,
											maxWidthTablet: null,
											maxWidthMobile: null,
										})
									}
									units={['px', 'em', 'vw', '%']}
									showUnit={true}
								/>
							</KadencePanelBody>
						</>
					)}
				</>
			</InspectorControls>
			<div {...innerBlocksProps} />
		</div>
	);
}

export default Edit;

const recursiveHasInsertedChildBlocks = (blocks) => {
	return blocks.some((block) => {
		if (block.name !== 'kadence/header-column' && block.name !== 'kadence/header-section') {
			return true;
		}

		if (block.innerBlocks.length > 0) {
			return recursiveHasInsertedChildBlocks(block.innerBlocks);
		}

		return false;
	});
};
