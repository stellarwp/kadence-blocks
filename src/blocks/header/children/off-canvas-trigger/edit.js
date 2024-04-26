/**
 * BLOCK: Kadence Off Canvas Trigger
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
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';

import { getUniqueId, getPostOrFseId } from '@kadence/helpers';
import {
	SelectParentBlock,
	IconRender,
	KadenceIconPicker,
	KadencePanelBody,
	PopColorControl,
	ResponsiveMeasureRangeControl,
	ResponsiveRangeControls,
	InspectorControlTabs,
} from '@kadence/components';

/**
 * Internal dependencies
 */
import { useEffect, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

export function Edit(props) {
	const { attributes, setAttributes, clientId } = props;

	const {
		uniqueID,
		icon,
		iconSize,
		iconSizeTablet,
		iconSizeMobile,
		iconColor,
		label,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		margin,
		tabletMargin,
		mobileMargin,
		marginUnit,
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

	const classes = classnames('wp-block-kadence-off-canvas-trigger', {
		[`wp-block-kadence-off-canvas-trigger${uniqueID}`]: uniqueID,
	});

	const blockProps = useBlockProps({
		className: classes,
	});

	return (
		<div {...blockProps}>
			<InspectorControls>
				<SelectParentBlock
					label={__('View Header Settings', 'kadence-blocks')}
					clientId={clientId}
					parentSlug={'kadence/header'}
				/>
				<InspectorControlTabs panelName={'off-canvas'} setActiveTab={setActiveTab} activeTab={activeTab} />
				{activeTab === 'general' && (
					<>
						<KadencePanelBody title={__('Icon Settings', 'kadence-blocks')} initialOpen={true}>
							<KadenceIconPicker
								value={icon}
								onChange={(value) => setAttributes({ icon: value })}
								allowClear={true}
							/>

							<ResponsiveRangeControls
								label={__('Icon Size', 'kadence-blocks')}
								value={iconSize}
								tabletValue={iconSizeTablet ? iconSizeTablet : ''}
								mobileValue={iconSizeMobile ? iconSizeMobile : ''}
								onChange={(value) => setAttributes({ iconSize: value })}
								onChangeTablet={(value) => setAttributes({ iconSizeTablet: value })}
								onChangeMobile={(value) => setAttributes({ iconSizeMobile: value })}
								units={['px']}
								unit={'px'}
								min={5}
								max={250}
								step={1}
							/>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'style' && (
					<>
						<KadencePanelBody title={__('Icon Colors', 'kadence-blocks')} initialOpen={true}>
							<PopColorControl
								label={__('Icon Color', 'kadence-blocks')}
								value={iconColor ? iconColor : ''}
								default={''}
								onChange={(value) => setAttributes({ iconColor: value })}
							/>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={padding}
								tabletValue={tabletPadding}
								mobileValue={mobilePadding}
								onChange={(value) => setAttributes({ padding: value })}
								onChangeTablet={(value) => setAttributes({ tabletPadding: value })}
								onChangeMobile={(value) => setAttributes({ mobilePadding: value })}
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
								tabletValue={tabletMargin}
								mobileValue={mobileMargin}
								onChange={(value) => setAttributes({ margin: value })}
								onChangeTablet={(value) => setAttributes({ tabletMargin: value })}
								onChangeMobile={(value) => setAttributes({ mobileMargin: value })}
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

			<style>
				{`
					.kb-off-canvas-trigger {
						padding: ${padding || 0}${paddingUnit};
					}
					.kb-off-canvas-trigger-icon {
						color: ${iconColor || ''};
					}
				`}
			</style>
			{icon && iconSize && <IconRender className={`kb-off-canvas-trigger-icon`} name={icon} size={iconSize} />}
		</div>
	);
}

export default Edit;
