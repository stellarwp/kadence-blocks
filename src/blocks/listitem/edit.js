/**
 * BLOCK: Kadence Icon
 */

/**
 * Import Kadence Components
 */
import { KadenceColorOutput, setBlockDefaults, getUniqueId, getPostOrFseId } from '@kadence/helpers';

import {
	PopColorControl,
	KadenceIconPicker,
	IconRender,
	KadencePanelBody,
	URLInputControl,
	InspectorControlTabs,
	SelectParentBlock,
	Tooltip,
} from '@kadence/components';

import { applyFilters } from '@wordpress/hooks';

import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { createBlock } from '@wordpress/blocks';

import { InspectorControls, RichText, BlockControls, useBlockProps } from '@wordpress/block-editor';

import { useEffect, useState, useRef } from '@wordpress/element';

import {
	RangeControl,
	ToggleControl,
	SelectControl,
	ToolbarGroup,
	ToolbarButton,
	TextControl,
	Dropdown,
	Button,
	TextareaControl,
} from '@wordpress/components';

import { useSelect, useDispatch } from '@wordpress/data';
import { formatIndent, formatOutdent } from '@wordpress/icons';
import { tooltip as tooltipIcon } from '@kadence/icons';

function KadenceListItem(props) {
	const {
		attributes,
		className,
		setAttributes,
		clientId,
		isSelected,
		name,
		onReplace,
		onRemove,
		mergeBlocks,
		context,
	} = props;
	const {
		uniqueID,
		icon,
		link,
		linkNoFollow,
		linkSponsored,
		target,
		size,
		width,
		text,
		color,
		iconTitle,
		background,
		border,
		borderRadius,
		padding,
		borderWidth,
		style,
		level,
		showIcon,
		tooltipSelection,
		tooltip,
		tooltipPlacement,
		tooltipDash,
	} = attributes;
	const displayIcon = icon ? icon : context['kadence/listIcon'];
	const displayWidth = width ? width : context['kadence/listIconWidth'];
	const [activeTab, setActiveTab] = useState('general');
	const { addUniqueID } = useDispatch('kadenceblocks/data');

	let richTextFormats = applyFilters(
		'kadence.whitelist_richtext_formats',
		[
			'core/bold',
			'core/italic',
			'kadence/mark',
			'kadence/typed',
			'core/strikethrough',
			'core/superscript',
			'core/superscript',
			'toolset/inline-field',
		],
		'kadence/listitem'
	);

	richTextFormats = link ? richTextFormats : undefined;

	const textRef = useRef(clientId);
	const { isUniqueID, isUniqueBlock, parentData } = useSelect(
		(select) => {
			return {
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
		setBlockDefaults('kadence/listitem', attributes);

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

	const blockProps = useBlockProps({
		className,
	});

	const onMoveLeft = () => {
		const newLevel = level - 1;

		setAttributes({ level: Math.max(newLevel, 0) });
	};
	const onMoveRight = () => {
		setAttributes({ level: level + 1 });
	};
	const iconOnlyTooltip = 'icon' === tooltipSelection ? true : false;
	const textOnlyTooltip = 'text' === tooltipSelection ? true : false;
	const WrapTag = link ? 'a' : 'span';
	const listItemOutput = (
		<>
			{displayIcon && showIcon && (
				<Tooltip
					className="kb-icon-list-single-wrap"
					text={tooltip && iconOnlyTooltip ? tooltip : undefined}
					placement={tooltipPlacement || 'top'}
				>
					<IconRender
						className={`kt-svg-icon-list-single kt-svg-icon-list-single-${displayIcon}${
							iconOnlyTooltip && tooltip ? ' kb-icon-list-tooltip' : ''
						}${!tooltipDash && iconOnlyTooltip && tooltip ? ' kb-list-tooltip-no-border' : ''}`}
						name={displayIcon}
						size={size ? size : '1em'}
						strokeWidth={'fe' === displayIcon.substring(0, 2) ? displayWidth : undefined}
						style={{
							color: color ? KadenceColorOutput(color) : undefined,
							backgroundColor:
								background && style === 'stacked' ? KadenceColorOutput(background) : undefined,
							padding: padding && style === 'stacked' ? padding + 'px' : undefined,
							borderColor: border && style === 'stacked' ? KadenceColorOutput(border) : undefined,
							borderWidth: borderWidth && style === 'stacked' ? borderWidth + 'px' : undefined,
							borderRadius: borderRadius && style === 'stacked' ? borderRadius + '%' : undefined,
						}}
					/>
				</Tooltip>
			)}

			{!showIcon && size !== 0 && (
				<div
					style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center' }}
					className={'kt-svg-icon-list-single'}
				>
					<svg
						style={{ display: 'inline-block', verticalAlign: 'middle' }}
						viewBox={'0 0 24 24'}
						height={size ? size : '1em'}
						width={size ? size : '1em'}
						fill={'none'}
						stroke={displayWidth}
						preserveAspectRatio={true ? 'xMinYMin meet' : undefined}
						stroke-width={displayWidth}
					></svg>
				</div>
			)}
			<Tooltip
				className="kb-icon-list-text-wrap"
				text={tooltip && textOnlyTooltip ? tooltip : undefined}
				placement={tooltipPlacement || 'top'}
			>
				<RichText
					tagName="div"
					ref={textRef}
					allowedFormats={richTextFormats ? richTextFormats : undefined}
					identifier="text"
					value={text}
					onChange={(value) => {
						setAttributes({ text: value });
					}}
					onSplit={(value, isOriginal) => {
						const newAttributes = { ...attributes };
						newAttributes.text = value;
						if (!isOriginal) {
							newAttributes.uniqueID = '';
							newAttributes.link = '';
						}

						const block = createBlock('kadence/listitem', newAttributes);

						if (isOriginal) {
							block.clientId = clientId;
						}

						return block;
					}}
					onMerge={mergeBlocks}
					onRemove={onRemove}
					onReplace={onReplace}
					className={`kt-svg-icon-list-text${textOnlyTooltip && tooltip ? ' kb-icon-list-tooltip' : ''}${
						!tooltipDash && textOnlyTooltip && tooltip ? ' kb-list-tooltip-no-border' : ''
					}`}
					data-empty={!text}
				/>
			</Tooltip>
		</>
	);
	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarGroup group="add-indent">
					<ToolbarButton
						icon={formatOutdent}
						title={__('Outdent', 'kadence-blocks')}
						describedBy={__('Outdent list item', 'kadence-blocks')}
						disabled={level === 0}
						onClick={() => onMoveLeft()}
					/>
					<ToolbarButton
						icon={formatIndent}
						title={__('Indent', 'kadence-blocks')}
						describedBy={__('Indent list item', 'kadence-blocks')}
						isDisabled={level === 5}
						onClick={() => onMoveRight()}
					/>
				</ToolbarGroup>
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
									<SelectControl
										label={__('Only apply tooltip to:', 'kadence-blocks')}
										value={tooltipSelection || 'both'}
										options={[
											{ label: __('Text and Icon', 'kadence-blocks'), value: 'both' },
											{ label: __('Text Only', 'kadence-blocks'), value: 'text' },
											{ label: __('Icon Only', 'kadence-blocks'), value: 'icon' },
										]}
										onChange={(val) => {
											setAttributes({ tooltipSelection: val });
										}}
									/>
									{!link && (
										<ToggleControl
											label={__('Show indicator underline', 'kadence-blocks')}
											checked={tooltipDash}
											onChange={(value) => {
												setAttributes({ tooltipDash: value });
											}}
										/>
									)}
								</div>
							</>
						)}
					/>
				</ToolbarGroup>
			</BlockControls>
			<InspectorControls>
				<SelectParentBlock clientId={clientId} />
				<InspectorControlTabs
					panelName={'listitem'}
					setActiveTab={(value) => setActiveTab(value)}
					activeTab={activeTab}
				/>
				{activeTab === 'general' && (
					<KadencePanelBody initialOpen={true} panelName={'kb-icon-item-settings'}>
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
							linkNoFollow={undefined !== linkNoFollow ? linkNoFollow : false}
							onChangeFollow={(value) => setAttributes({ linkNoFollow: value })}
							linkSponsored={undefined !== linkSponsored ? linkSponsored : false}
							onChangeSponsored={(value) => setAttributes({ linkSponsored: value })}
							dynamicAttribute={'link'}
							allowClear={true}
							isSelected={isSelected}
							attributes={attributes}
							setAttributes={setAttributes}
							name={name}
							clientId={clientId}
							context={context}
						/>

						<ToggleControl
							label={__('Hide icon', 'kadence-blocks')}
							checked={!showIcon}
							onChange={(value) => {
								setAttributes({ showIcon: !value });
							}}
						/>

						{showIcon && (
							<>
								<KadenceIconPicker
									value={icon}
									onChange={(value) => {
										setAttributes({ icon: value });
									}}
									allowClear={true}
									placeholder={__('Select Icon', 'kadence-blocks')}
								/>
								<TextControl
									label={__('Icon title for screen readers', 'kadence-blocks')}
									help={__(
										'If no title added screen readers will ignore, good if the icon is purely decorative.',
										'kadence-blocks'
									)}
									value={iconTitle}
									onChange={(value) => {
										setAttributes({ iconTitle: value });
									}}
								/>
							</>
						)}
					</KadencePanelBody>
				)}
				{activeTab === 'style' && (
					<KadencePanelBody initialOpen={true} panelName={'kb-icon-item'}>
						<RangeControl
							label={__('Icon Size', 'kadence-blocks')}
							value={size}
							onChange={(value) => {
								setAttributes({ size: value });
							}}
							min={0}
							max={250}
						/>
						{displayIcon && 'fe' === displayIcon.substring(0, 2) && (
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
						<PopColorControl
							label={__('Icon Color', 'kadence-blocks')}
							value={color ? color : ''}
							default={''}
							onChange={(value) => {
								setAttributes({ color: value });
							}}
						/>
						<SelectControl
							label={__('Icon Style', 'kadence-blocks')}
							value={style}
							options={[
								{ value: '', label: __('Inherit', 'kadence-blocks') },
								{ value: 'default', label: __('Default', 'kadence-blocks') },
								{ value: 'stacked', label: __('Stacked', 'kadence-blocks') },
							]}
							onChange={(value) => {
								setAttributes({ style: value });
							}}
						/>
						{style === 'stacked' && (
							<PopColorControl
								label={__('Icon Background', 'kadence-blocks')}
								value={background ? background : ''}
								default={''}
								onChange={(value) => {
									setAttributes({ background: value });
								}}
							/>
						)}
						{style === 'stacked' && (
							<PopColorControl
								label={__('Border Color', 'kadence-blocks')}
								value={border ? border : ''}
								default={''}
								onChange={(value) => {
									setAttributes({ border: value });
								}}
							/>
						)}
						{style === 'stacked' && (
							<RangeControl
								label={__('Border Size (px)', 'kadence-blocks')}
								value={borderWidth}
								onChange={(value) => {
									setAttributes({ borderWidth: value });
								}}
								min={0}
								max={20}
							/>
						)}
						{style === 'stacked' && (
							<RangeControl
								label={__('Border Radius (%)', 'kadence-blocks')}
								value={borderRadius}
								onChange={(value) => {
									setAttributes({ borderRadius: value });
								}}
								min={0}
								max={50}
							/>
						)}
						{style === 'stacked' && (
							<RangeControl
								label={__('Padding (px)', 'kadence-blocks')}
								value={padding}
								onChange={(value) => {
									setAttributes({ padding: value });
								}}
								min={0}
								max={180}
							/>
						)}
					</KadencePanelBody>
				)}
			</InspectorControls>

			<div
				className={`kt-svg-icon-list-item-wrap kt-svg-icon-list-item-0 kt-svg-icon-list-level-${level}${
					style ? ' kt-svg-icon-list-style-' + style : ''
				}`}
			>
				<Tooltip
					TagName={WrapTag}
					className={`kb-icon-list-tooltip-wrap${
						!link && tooltip && !iconOnlyTooltip && !textOnlyTooltip ? ' kb-icon-list-tooltip' : ''
					}${
						!link && tooltip && !iconOnlyTooltip && !textOnlyTooltip && !tooltipDash
							? ' kb-list-tooltip-no-border'
							: ''
					}${link ? ' kt-svg-icon-link' : ''}`}
					text={tooltip && !iconOnlyTooltip && !textOnlyTooltip ? tooltip : undefined}
					placement={tooltipPlacement || 'top'}
				>
					{listItemOutput}
				</Tooltip>
			</div>
		</div>
	);
}

export default KadenceListItem;
