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
import { useBlockProps, InnerBlocks, useInnerBlocksProps, InspectorControls } from '@wordpress/block-editor';

import { getUniqueId, getPostOrFseId } from '@kadence/helpers';
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
} from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import BackendStyles from './components/backend-styles';

export function Edit(props) {
	const { attributes, setAttributes, clientId, context, isSelected } = props;

	const {
		uniqueID,
		location,
		layout,
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
		height,
		heightTablet,
		heightMobile,
		heightUnit,
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
	} = attributes;

	const [activeTab, setActiveTab] = useState('general');
	const { addUniqueID } = useDispatch('kadenceblocks/data');
	const { isUniqueID, isUniqueBlock, parentData, previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
				isUniqueID: (value) => select('kadenceblocks/data').isUniqueID(value),
				isUniqueBlock: (value, clientId) => select('kadenceblocks/data').isUniqueBlock(value, clientId),
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
		const postOrFseId = getPostOrFseId(props, parentData);
		const uniqueId = getUniqueId(uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId);
		if (uniqueId !== uniqueID) {
			attributes.uniqueID = uniqueId;
			setAttributes({ uniqueID: uniqueId });
			addUniqueID(uniqueId, clientId);
		} else {
			addUniqueID(uniqueId, clientId);
		}
	}, []);

	const innerBlockClasses = classnames({
		'wp-block-kadence-header-row': true,
		[`wp-block-kadence-header-row-${location}`]: location,
		[`wp-block-kadence-header-row${uniqueID}`]: uniqueID,
		[`wp-block-kadence-header-row-layout-${layout}`]: layout,
	});
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: innerBlockClasses,
			style: {
				display: previewDevice === 'Desktop' ? 'block' : 'none',
			},
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
						/>
						<KadenceBackgroundControl
							label={__('Background Image', 'kadence-blocks')}
							hasImage={backgroundValue?.image}
							imageURL={backgroundValue.image ? backgroundValue.image : ''}
							imageID={backgroundValue.imageID}
							imagePosition={backgroundValue.position ? backgroundValue.position : 'center center'}
							imageSize={backgroundValue.size ? backgroundValue.size : 'cover'}
							imageRepeat={backgroundValue.repeat ? backgroundValue.repeat : 'no-repeat'}
							imageAttachment={backgroundValue.attachment ? backgroundValue.attachment : 'scroll'}
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
							disableMediaButtons={backgroundValue.image ? true : false}
							dynamicAttribute={'background' + suffix + size + ':image'}
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
		<>
			<BackendStyles {...props} previewDevice={previewDevice} />
			<InspectorControls>
				<SelectParentBlock
					label={__('View Header Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/header'}
				/>

				<InspectorControlTabs
					panelName={'advanced-header-row'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody>
							<KadenceRadioButtons
								label={__('Layout', 'kadence-blocks')}
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
								max={minHeightUnit == 'px' ? 600 : 100}
								step={1}
								unit={minHeightUnit}
								onUnit={(value) => {
									setAttributes({ minHeightUnit: value });
								}}
								units={['px', 'em', 'vh']}
								showUnit={true}
							/>
							<ResponsiveRangeControls
								label={__('Height', 'kadence-blocks')}
								value={height}
								onChange={(value) => setAttributes({ height: value })}
								tabletValue={heightTablet}
								onChangeTablet={(value) => setAttributes({ heightTablet: value })}
								mobileValue={heightMobile}
								onChangeMobile={(value) => setAttributes({ heightMobile: value })}
								min={0}
								max={heightUnit == 'px' ? 600 : 100}
								step={1}
								unit={heightUnit}
								onUnit={(value) => {
									setAttributes({ heightUnit: value });
								}}
								units={['px', 'em', 'vh']}
								showUnit={true}
							/>
							{layout != 'contained' && layout != 'fullwidth' && (
								<ResponsiveRangeControls
									label={__('Max Width', 'kadence-blocks')}
									value={maxWidth}
									onChange={(value) => setAttributes({ maxWidth: value })}
									tabletValue={maxWidthTablet}
									onChangeTablet={(value) => setAttributes({ maxWidthTablet: value })}
									mobileValue={maxWidthMobile}
									onChangeMobile={(value) => setAttributes({ maxWidthMobile: value })}
									min={0}
									max={maxWidthUnit == 'px' ? 600 : 100}
									step={1}
									unit={maxWidthUnit}
									onUnit={(value) => {
										setAttributes({ maxWidthUnit: value });
									}}
									units={['px', 'em', 'vw', '%']}
									showUnit={true}
								/>
							)}
							<ResponsiveRangeControls
								label={__('Item Gap', 'kadence-blocks')}
								value={itemGap}
								onChange={(value) => setAttributes({ itemGap: value })}
								tabletValue={itemGapTablet}
								onChangeTablet={(value) => setAttributes({ itemGapTablet: value })}
								mobileValue={itemGapMobile}
								onChangeMobile={(value) => setAttributes({ itemGapMobile: value })}
								min={0}
								max={maxWidthUnit === 'px' ? 2000 : 100}
								step={1}
								unit={itemGapUnit}
								onUnit={(value) => {
									setAttributes({ itemGapUnit: value });
								}}
								units={['px', 'em', 'vw']}
								showUnit={true}
							/>

							<ResponsiveAlignControls
								label={__('Vertical Alignment', 'kadence-blocks')}
								value={vAlign ? vAlign : ''}
								tabletValue={vAlignTablet ? vAlignTablet : ''}
								mobileValue={vAlignMobile ? vAlignMobile : ''}
								onChange={(nextAlign) => setAttributes({ vAlign: nextAlign ? nextAlign : 'center' })}
								onChangeTablet={(nextAlign) =>
									setAttributes({ vAlignTablet: nextAlign ? nextAlign : '' })
								}
								onChangeMobile={(nextAlign) =>
									setAttributes({ vAlignMobile: nextAlign ? nextAlign : '' })
								}
								type={'vertical'}
							/>
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
							initialOpen={true}
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
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 25 : 400}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ paddingUnit: value })}
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
								max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : 400}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ marginUnit: value })}
							/>
						</KadencePanelBody>
					</>
				)}
			</InspectorControls>
			<div {...innerBlocksProps} />
		</>
	);
}

export default Edit;
