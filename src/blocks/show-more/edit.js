/**
 * BLOCK: Kadence Show More Block
 */

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
import { ToggleControl, RangeControl } from '@wordpress/components';
import {
	ResponsiveRangeControls,
	InspectorControlTabs,
	KadenceInspectorControls,
	KadencePanelBody,
	KadenceBlockDefaults,
	ResponsiveMeasureRangeControl,
	SpacingVisualizer,
	CopyPasteAttributes,
} from '@kadence/components';
import {
	setBlockDefaults,
	mouseOverVisualizer,
	getSpacingOptionOutput,
	uniqueIdHelper,
	getInQueryBlock,
} from '@kadence/helpers';

import { useBlockProps, useInnerBlocksProps, BlockControls, store as blockEditorStore } from '@wordpress/block-editor';
import { useEffect, useRef, useState } from '@wordpress/element';
import { uniqueId } from 'lodash';

/**
 * External dependencies
 */
import classnames from 'classnames';

export function Edit(props) {
	const { attributes, setAttributes, clientId, context } = props;

	const {
		uniqueID,
		showHideMore,
		defaultExpandedMobile,
		defaultExpandedTablet,
		defaultExpandedDesktop,
		heightDesktop,
		heightTablet,
		heightMobile,
		heightType,
		marginDesktop,
		marginTablet,
		marginMobile,
		marginUnit,
		paddingDesktop,
		paddingTablet,
		paddingMobile,
		paddingUnit,
		enableFadeOut,
		fadeOutSize,
		inQueryBlock,
	} = attributes;

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	useEffect(() => {
		setBlockDefaults('kadence/show-more', attributes);

		setAttributes({ inQueryBlock: getInQueryBlock(context, inQueryBlock) });
	}, []);

	uniqueIdHelper(props);
	const { updateBlockAttributes } = useDispatch(blockEditorStore);
	const { showMoreBlock } = useSelect(
		(select) => {
			return {
				showMoreBlock: select('core/block-editor').getBlock(clientId),
			};
		},
		[clientId]
	);
	useEffect(() => {
		if (
			showMoreBlock?.innerBlocks?.[0]?.clientId &&
			showMoreBlock?.innerBlocks?.[0]?.name === 'kadence/column' &&
			showMoreBlock?.innerBlocks?.[0]?.attributes &&
			false !== showMoreBlock?.innerBlocks?.[0]?.attributes?.templateLock
		) {
			updateBlockAttributes(showMoreBlock.innerBlocks[0].clientId, {
				templateLock: false,
			});
		}
	}, [clientId]);
	const [activeTab, setActiveTab] = useState('general');

	const paddingMouseOver = mouseOverVisualizer();
	const marginMouseOver = mouseOverVisualizer();

	const getPreviewSize = (device, desktopSize, tabletSize, mobileSize) => {
		if (device === 'Mobile') {
			if (undefined !== mobileSize && '' !== mobileSize && null !== mobileSize) {
				return mobileSize;
			} else if (undefined !== tabletSize && '' !== tabletSize && null !== tabletSize) {
				return tabletSize;
			}
		} else if (device === 'Tablet') {
			if (undefined !== tabletSize && '' !== tabletSize && null !== tabletSize) {
				return tabletSize;
			}
		}
		return desktopSize;
	};

	const childBlocks = wp.data.select('core/block-editor').getBlockOrder(clientId);

	const buttonOneUniqueID = childBlocks[1] ? childBlocks[1].substr(2, 9) : uniqueId('button-one-');

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[0] : '',
		undefined !== marginTablet ? marginTablet[0] : '',
		undefined !== marginMobile ? marginMobile[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[1] : '',
		undefined !== marginTablet ? marginTablet[1] : '',
		undefined !== marginMobile ? marginMobile[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[2] : '',
		undefined !== marginTablet ? marginTablet[2] : '',
		undefined !== marginMobile ? marginMobile[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== marginDesktop ? marginDesktop[3] : '',
		undefined !== marginTablet ? marginTablet[3] : '',
		undefined !== marginMobile ? marginMobile[3] : ''
	);

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[0] : '',
		undefined !== paddingTablet ? paddingTablet[0] : '',
		undefined !== paddingMobile ? paddingMobile[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[1] : '',
		undefined !== paddingTablet ? paddingTablet[1] : '',
		undefined !== paddingMobile ? paddingMobile[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[2] : '',
		undefined !== paddingTablet ? paddingTablet[2] : '',
		undefined !== paddingMobile ? paddingMobile[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== paddingDesktop ? paddingDesktop[3] : '',
		undefined !== paddingTablet ? paddingTablet[3] : '',
		undefined !== paddingMobile ? paddingMobile[3] : ''
	);

	const previewPreviewHeight = getPreviewSize(
		previewDevice,
		undefined !== heightDesktop ? heightDesktop : '',
		undefined !== heightTablet ? heightTablet : '',
		undefined !== heightMobile ? heightMobile : ''
	);
	const isExpanded = getPreviewSize(
		previewDevice,
		defaultExpandedDesktop,
		defaultExpandedTablet,
		defaultExpandedMobile
	);

	const ref = useRef();
	const classes = classnames({
		'kb-block-show-more-container': true,
		[`kb-block-show-more-container${uniqueID}`]: true,
	});
	const blockProps = useBlockProps({
		className: classes,
		ref,
	});
	const innerClasses = classnames({
		'kb-block-show-more-inner-container': true,
	});
	const innerBlockProps = useInnerBlocksProps(
		{
			className: innerClasses,
		},
		{
			templateLock: 'all',
			renderAppender: false,
			template: [
				[
					'kadence/column',
					{
						className: 'kb-show-more-content',
						templateLock: false,
					},
				],
				[
					'kadence/advancedbtn',
					{
						lock: { remove: true, move: true },
						lockBtnCount: true,
						hAlign: 'left',
						uniqueID: buttonOneUniqueID,
						className: 'kb-show-more-buttons',
					},
					[
						[
							'kadence/singlebtn',
							{
								lock: { remove: true, move: true },
								hideLink: true,
								text: __('Show More', 'kadence-blocks'),
								sizePreset: 'small',
								noCustomDefaults: true,
							},
						],
						[
							'kadence/singlebtn',
							{
								lock: { remove: true, move: true },
								hideLink: true,
								text: __('Show Less', 'kadence-blocks'),
								sizePreset: 'small',
								noCustomDefaults: true,
							},
						],
					],
				],
			],
		}
	);

	const FadeOut = () => {
		const fadeSize = enableFadeOut && !isExpanded ? Math.abs(fadeOutSize - 100) : 100;

		return (
			<style>{`
        .kb-block-show-more-container${uniqueID} .kb-show-more-buttons .wp-block-kadence-singlebtn:last-of-type {
       	display: ${showHideMore ? 'inline-flex' : 'none'};
       	}

        .kb-block-show-more-container${uniqueID} .kb-show-more-content:not(.is-selected, .has-child-selected) {
		   max-height: ${isExpanded ? 'none' : previewPreviewHeight + heightType};
		  -webkit-mask-image: linear-gradient(to bottom, black ${fadeSize}%, transparent 100%);
		  mask-image: linear-gradient(to bottom, black ${fadeSize}%, transparent 100%);

        }
      `}</style>
		);
	};

	return (
		<>
			<BlockControls>
				<CopyPasteAttributes
					attributes={attributes}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/show-more'}>
				<InspectorControlTabs
					panelName={'show-more'}
					allowedTabs={['general', 'advanced']}
					setActiveTab={setActiveTab}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Show More Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'showMoreSettings'}
							blockSlug={'kadence/show-more'}
						>
							<ToggleControl
								label={__('Display "hide" button once expanded', 'kadence-blocks')}
								checked={showHideMore}
								onChange={(value) => setAttributes({ showHideMore: value })}
							/>

							<ResponsiveRangeControls
								label={__('Maximum Preview Height', 'kadence-blocks')}
								value={heightDesktop ? heightDesktop : ''}
								onChange={(value) => {
									setAttributes({ heightDesktop: value });
								}}
								tabletValue={undefined !== heightTablet ? heightTablet : ''}
								onChangeTablet={(value) => {
									setAttributes({ heightTablet: value });
								}}
								mobileValue={undefined !== heightMobile ? heightMobile : ''}
								onChangeMobile={(value) => {
									setAttributes({ heightMobile: value });
								}}
								min={0}
								max={(heightType ? heightType : 'px') !== 'px' ? 10 : 2000}
								step={(heightType ? heightType : 'px') !== 'px' ? 0.1 : 1}
								unit={heightType ? heightType : 'px'}
								onUnit={(value) => {
									setAttributes({ heightType: value });
								}}
								units={['px', 'em', 'rem']}
							/>

							<ToggleControl
								label={__('Fade out preview', 'kadence-blocks')}
								checked={enableFadeOut}
								onChange={(value) => setAttributes({ enableFadeOut: value })}
							/>

							{enableFadeOut && (
								<RangeControl
									label={__('Fade Size', 'kadence-blocks')}
									value={fadeOutSize}
									onChange={(value) => setAttributes({ fadeOutSize: value })}
								/>
							)}
						</KadencePanelBody>
					</>
				)}

				{activeTab === 'advanced' && (
					<>
						<KadencePanelBody panelName={'kb-show-more-settings'}>
							<ResponsiveMeasureRangeControl
								label={__('Padding', 'kadence-blocks')}
								value={[
									previewPaddingTop,
									previewPaddingRight,
									previewPaddingBottom,
									previewPaddingLeft,
								]}
								tabletValue={paddingTablet}
								mobileValue={paddingMobile}
								onChange={(value) => setAttributes({ paddingDesktop: value })}
								onChangeTablet={(value) => setAttributes({ paddingTablet: value })}
								onChangeMobile={(value) => setAttributes({ paddingMobile: value })}
								min={0}
								max={paddingUnit === 'em' || paddingUnit === 'rem' ? 25 : 999}
								step={paddingUnit === 'em' || paddingUnit === 'rem' ? 0.1 : 1}
								unit={paddingUnit}
								units={['px', 'em', 'rem', '%']}
								onUnit={(value) => setAttributes({ paddingUnit: value })}
								onMouseOver={paddingMouseOver.onMouseOver}
								onMouseOut={paddingMouseOver.onMouseOut}
							/>
							<ResponsiveMeasureRangeControl
								label={__('Margin', 'kadence-blocks')}
								value={[previewMarginTop, previewMarginRight, previewMarginBottom, previewMarginLeft]}
								tabletValue={marginTablet}
								mobileValue={marginMobile}
								onChange={(value) => {
									setAttributes({ marginDesktop: value });
								}}
								onChangeTablet={(value) => setAttributes({ marginTablet: value })}
								onChangeMobile={(value) => setAttributes({ marginMobile: value })}
								min={marginUnit === 'em' || marginUnit === 'rem' ? -25 : -999}
								max={marginUnit === 'em' || marginUnit === 'rem' ? 25 : 999}
								step={marginUnit === 'em' || marginUnit === 'rem' ? 0.1 : 1}
								unit={marginUnit}
								units={['px', 'em', 'rem', '%', 'vh']}
								onUnit={(value) => setAttributes({ marginUnit: value })}
								onMouseOver={marginMouseOver.onMouseOver}
								onMouseOut={marginMouseOver.onMouseOut}
								allowAuto={true}
							/>
						</KadencePanelBody>

						<div className="kt-sidebar-settings-spacer"></div>

						<KadencePanelBody
							title={__('Expand Settings', 'kadence-blocks')}
							panelName={'expandSettings'}
							blockSlug={'kadence/show-more'}
							initialOpen={false}
						>
							<ToggleControl
								label={__('Default Expanded on Desktop', 'kadence-blocks')}
								checked={defaultExpandedDesktop}
								onChange={(value) => setAttributes({ defaultExpandedDesktop: value })}
							/>
							<ToggleControl
								label={__('Default Expanded on Tablet', 'kadence-blocks')}
								checked={defaultExpandedTablet}
								onChange={(value) => setAttributes({ defaultExpandedTablet: value })}
							/>
							<ToggleControl
								label={__('Default Expanded on Mobile', 'kadence-blocks')}
								checked={defaultExpandedMobile}
								onChange={(value) => setAttributes({ defaultExpandedMobile: value })}
							/>
						</KadencePanelBody>

						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
						/>
					</>
				)}
			</KadenceInspectorControls>
			<FadeOut />
			<div
				{...blockProps}
				style={{
					marginTop:
						'' !== previewMarginTop ? getSpacingOptionOutput(previewMarginTop, marginUnit) : undefined,
					marginRight:
						'' !== previewMarginRight ? getSpacingOptionOutput(previewMarginRight, marginUnit) : undefined,
					marginBottom:
						'' !== previewMarginBottom
							? getSpacingOptionOutput(previewMarginBottom, marginUnit)
							: undefined,
					marginLeft:
						'' !== previewMarginLeft ? getSpacingOptionOutput(previewMarginLeft, marginUnit) : undefined,

					paddingTop:
						'' !== previewPaddingTop ? getSpacingOptionOutput(previewPaddingTop, paddingUnit) : undefined,
					paddingRight:
						'' !== previewPaddingRight
							? getSpacingOptionOutput(previewPaddingRight, paddingUnit)
							: undefined,
					paddingBottom:
						'' !== previewPaddingBottom
							? getSpacingOptionOutput(previewPaddingBottom, paddingUnit)
							: undefined,
					paddingLeft:
						'' !== previewPaddingLeft ? getSpacingOptionOutput(previewPaddingLeft, paddingUnit) : undefined,
				}}
			>
				<div {...innerBlockProps}></div>
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
