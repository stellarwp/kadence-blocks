/**
 * BLOCK: Kadence Icon
 */
/**
 * Import externals
 */
import {
	PopColorControl,
	KadencePanelBody,
	URLInputControl,
	ResponsiveRangeControls,
	InspectorControlTabs,
	RangeControl,
	KadenceRadioButtons,
	KadenceInspectorControls,
	KadenceBlockDefaults,
	KadenceIconPicker,
	CopyPasteAttributes,
} from '@kadence/components';
import {
	KadenceColorOutput,
	setBlockDefaults,
	uniqueIdHelper,
	getInQueryBlock,
	getPreviewSize,
} from '@kadence/helpers';
import { useSelect, useDispatch } from '@wordpress/data';
import { PreviewIcon } from './preview-icon';
import { AdvancedSettings } from './advanced-settings';
import { tooltip as tooltipIcon } from '@kadence/icons';
import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import { useBlockProps, BlockControls } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import {
	TextControl,
	TextareaControl,
	Dropdown,
	Button,
	SelectControl,
	ToggleControl,
	ToolbarGroup,
} from '@wordpress/components';

function KadenceSingleIcon(props) {
	const { attributes, className, setAttributes, clientId, isSelected, name, context } = props;
	const {
		inQueryBlock,
		icon,
		link,
		target,
		size,
		width,
		title,
		hColor,
		hBackground,
		tabletSize,
		hBorder,
		color,
		background,
		border,
		borderRadius,
		borderWidth,
		style,
		linkTitle,
		mobileSize,
		uniqueID,
		tooltip,
		tooltipPlacement,
		tooltipDash,
	} = attributes;

	const nonTransAttrs = ['icon', 'link', 'target'];

	const [activeTab, setActiveTab] = useState('general');

	const { previewDevice } = useSelect(
		(select) => {
			return {
				previewDevice: select('kadenceblocks/data').getPreviewDeviceType(),
			};
		},
		[clientId]
	);

	const previewSize = getPreviewSize(
		previewDevice,
		undefined !== size ? size : undefined,
		undefined !== tabletSize ? tabletSize : undefined,
		undefined !== mobileSize ? mobileSize : undefined
	);

	uniqueIdHelper(props);
	
	useEffect(() => {
		setBlockDefaults('kadence/single-icon', attributes);

		setAttributes({ inQueryBlock: getInQueryBlock(context, inQueryBlock) });
	}, []);

	const blockProps = useBlockProps({
		className,
	});

	const renderCSS = (
		<style>
			{`.wp-block-kadence-single-icon .kt-svg-item-${uniqueID}:hover .kt-svg-icon {
					${undefined !== hColor && hColor ? 'color:' + KadenceColorOutput(hColor) + '!important;' : ''}
            }
            .wp-block-kadence-single-icon .kt-svg-style-stacked.kt-svg-item-${uniqueID}:hover .kt-svg-icon {
					${undefined !== hBackground && hBackground ? 'background:' + KadenceColorOutput(hBackground) + '!important;' : ''}
					${undefined !== hBorder && hBorder ? 'border-color:' + KadenceColorOutput(hBorder) + '!important;' : ''}
            }`}
		</style>
	);

	return (
		<div {...blockProps}>
			{renderCSS}
			<BlockControls>
				<ToolbarGroup group="tooltip">
					<Dropdown
						className="kb-popover-inline-tooltip-container components-dropdown-menu components-toolbar"
						contentClassName="kb-popover-inline-tooltip"
						placement="bottom"
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								className="components-dropdown-menu__toggle kb-inline-tooltip-toolbar-icon"
								label={__('Tooltip Settings', 'kadence-blocks')}
								icon={tooltipIcon}
								onClick={onToggle}
								aria-expanded={isOpen}
							/>
						)}
						renderContent={() => (
							<>
								<div className="kb-inline-tooltip-control">
									<TextareaControl
										label={__('Tooltip Content', 'kadence-blocks')}
										value={tooltip}
										onChange={(newValue) => setAttributes({ tooltip: newValue })}
									/>
									<SelectControl
										label={__('Placement', 'kadence-blocks')}
										value={tooltipPlacement || 'top'}
										options={[
											{ label: __('Top', 'kadence-blocks'), value: 'top' },
											{ label: __('Top Start', 'kadence-blocks'), value: 'top-start' },
											{ label: __('Top End', 'kadence-blocks'), value: 'top-end' },
											{ label: __('Right', 'kadence-blocks'), value: 'right' },
											{ label: __('Right Start', 'kadence-blocks'), value: 'right-start' },
											{ label: __('Right End', 'kadence-blocks'), value: 'right-end' },
											{ label: __('Bottom', 'kadence-blocks'), value: 'bottom' },
											{ label: __('Bottom Start', 'kadence-blocks'), value: 'bottom-start' },
											{ label: __('Bottom End', 'kadence-blocks'), value: 'bottom-end' },
											{ label: __('Left', 'kadence-blocks'), value: 'left' },
											{ label: __('Left Start', 'kadence-blocks'), value: 'left-start' },
											{ label: __('Left End', 'kadence-blocks'), value: 'left-end' },
											{ label: __('Auto', 'kadence-blocks'), value: 'auto' },
											{ label: __('Auto Start', 'kadence-blocks'), value: 'auto-start' },
											{ label: __('Auto End', 'kadence-blocks'), value: 'auto-end' },
										]}
										onChange={(val) => {
											setAttributes({ tooltipPlacement: val });
										}}
									/>
									<ToggleControl
										label={__('Show indicator underline', 'kadence-blocks')}
										checked={tooltipDash}
										onChange={(value) => {
											setAttributes({ tooltipDash: value });
										}}
									/>
								</div>
							</>
						)}
					/>
				</ToolbarGroup>
				<CopyPasteAttributes
					attributes={attributes}
					excludedAttrs={nonTransAttrs}
					defaultAttributes={metadata.attributes}
					blockSlug={metadata.name}
					onPaste={(attributesToPaste) => setAttributes(attributesToPaste)}
				/>
			</BlockControls>
			<KadenceInspectorControls blockSlug={'kadence/icon'}>
				<InspectorControlTabs
					panelName={'single-icon'}
					allowedTabs={['general', 'advanced']}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>

				{activeTab === 'general' && (
					<>
						<KadencePanelBody
							title={__('Icon Settings', 'kadence-blocks')}
							initialOpen={true}
							panelName={'kb-icon-settings'}
						>
							<KadenceIconPicker
								value={icon}
								onChange={(value) => {
									setAttributes({ icon: value });
								}}
							/>

							<ResponsiveRangeControls
								label={__('Icon Size', 'kadence-blocks')}
								value={previewSize}
								onChange={(value) => {
									setAttributes({ size: value });
								}}
								tabletValue={undefined !== tabletSize ? tabletSize : ''}
								onChangeTablet={(value) => {
									setAttributes({ tabletSize: value });
								}}
								mobileValue={undefined !== mobileSize ? mobileSize : ''}
								onChangeMobile={(value) => {
									setAttributes({ mobileSize: value });
								}}
								min={0}
								max={300}
								step={1}
								unit={'px'}
							/>
							{icon && 'fe' === icon.substring(0, 2) && (
								<RangeControl
									label={__('Line Width', 'kadence-blocks')}
									value={width}
									onChange={(value) => {
										setAttributes({ width: value });
									}}
									step={0.5}
									min={0.5}
									max={4}
								/>
							)}

							<KadenceRadioButtons
								label={__('Icon Style', 'kadence-blocks')}
								value={style}
								options={[
									{ value: 'default', label: __('Default', 'kadence-blocks') },
									{ value: 'stacked', label: __('Stacked', 'kadence-blocks') },
								]}
								onChange={(value) => setAttributes({ style: value })}
							/>
							<PopColorControl
								label={__('Icon Color', 'kadence-blocks')}
								value={color ? color : ''}
								default={''}
								onChange={(value) => {
									setAttributes({ color: value });
								}}
								swatchLabel2={__('Hover Color', 'kadence-blocks')}
								value2={hColor ? hColor : ''}
								default2={''}
								onChange2={(value) => {
									setAttributes({ hColor: value });
								}}
							/>
							{style !== 'default' && (
								<>
									<PopColorControl
										label={__('Background Color', 'kadence-blocks')}
										value={background ? background : ''}
										default={''}
										onChange={(value) => {
											setAttributes({ background: value });
										}}
										swatchLabel2={__('Hover Background', 'kadence-blocks')}
										value2={hBackground ? hBackground : ''}
										default2={''}
										onChange2={(value) => {
											setAttributes({ hBackground: value });
										}}
									/>
									<PopColorControl
										label={__('Border Color', 'kadence-blocks')}
										value={border ? border : ''}
										default={''}
										onChange={(value) => {
											setAttributes({ border: value });
										}}
										swatchLabel2={__('Hover Border', 'kadence-blocks')}
										value2={hBorder ? hBorder : ''}
										default2={''}
										onChange2={(value) => {
											setAttributes({ hBorder: value });
										}}
									/>
									<RangeControl
										label={__('Border Size (px)', 'kadence-blocks')}
										value={borderWidth}
										onChange={(value) => {
											setAttributes({ borderWidth: value });
										}}
										min={0}
										max={20}
									/>
									<RangeControl
										label={__('Border Radius (%)', 'kadence-blocks')}
										value={borderRadius}
										onChange={(value) => {
											setAttributes({ borderRadius: value });
										}}
										min={0}
										max={50}
									/>
								</>
							)}
							<URLInputControl
								label={__('Link', 'kadence-blocks')}
								url={link}
								onChangeUrl={(value) => {
									setAttributes({ link: value });
								}}
								additionalControls={true}
								opensInNewTab={target && '_blank' == target ? true : false}
								onChangeTarget={(value) => {
									if (value) {
										setAttributes({ target: '_blank' });
									} else {
										setAttributes({ target: '_self' });
									}
								}}
								linkTitle={linkTitle}
								onChangeTitle={(value) => {
									setAttributes({ linkTitle: value });
								}}
								dynamicAttribute={'link'}
								allowClear={true}
								isSelected={isSelected}
								attributes={attributes}
								setAttributes={setAttributes}
								name={name}
								clientId={clientId}
								context={context}
							/>
							<TextControl
								label={__('Title for screen readers', 'kadence-blocks')}
								help={__(
									'If no title added screen readers will ignore, good if the icon is purely decorative.',
									'kadence-blocks'
								)}
								value={title}
								onChange={(value) => {
									setAttributes({ title: value });
								}}
							/>
						</KadencePanelBody>
					</>
				)}
				{activeTab === 'advanced' && (
					<>
						<AdvancedSettings attributes={attributes} setAttributes={setAttributes} />

						<KadenceBlockDefaults
							attributes={attributes}
							defaultAttributes={metadata.attributes}
							blockSlug={metadata.name}
							excludedAttrs={nonTransAttrs}
						/>
					</>
				)}
			</KadenceInspectorControls>
			<PreviewIcon attributes={attributes} previewDevice={previewDevice} />
		</div>
	);
}

export default KadenceSingleIcon;
