import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, SelectControl, TextareaControl } from '@wordpress/components';
import { useCachedTruthy, __experimentalLinkControl as LinkControl } from '@wordpress/block-editor';
import { KadencePanelBody } from '@kadence/components';
import { useMemo } from '@wordpress/element';
import { kadenceToolTips as settings } from './tooltips';

// Ensure DEFAULT_LINK_SETTINGS is iterable (WP 6.3 compatibility).
const defaultLinkSettings = Array.isArray(LinkControl?.DEFAULT_LINK_SETTINGS)
	? LinkControl.DEFAULT_LINK_SETTINGS
	: [
			{
				id: '"opensInNewTab"',
				title: __('Open in new tab', 'kadence-blocks'),
			},
		];

const LINK_SETTINGS = [
	...defaultLinkSettings,
	{
		id: 'nofollow',
		title: __('Mark as nofollow', 'kadence-blocks'),
	},
];

export default function TooltipsPopover({
	name,
	value,
	updateFormat,
	isActive,
	onClose,
	contentRef,
	activeAttributes,
}) {
	const tooltipSettings = {
		content: activeAttributes.content || '',
		placement: activeAttributes.placement || '',
	};
	const linkValue = useMemo(
		() => ({
			url: activeAttributes.url,
			opensInNewTab: activeAttributes.target === '_blank',
			nofollow: activeAttributes.rel?.includes('nofollow'),
		}),
		[activeAttributes.rel, activeAttributes.target, activeAttributes.url]
	);
	const popoverAnchor = useCachedTruthy(
		useAnchor({
			editableContentElement: contentRef.current,
			settings: {
				...settings,
				isActive,
			},
		})
	);
	function onChangeLink(nextValue) {
		if (!nextValue?.url) {
			updateFormat({ url: '', target: '', rel: '' });
			return;
		}
		// Merge the next value with the current link value.
		nextValue = {
			...linkValue,
			...nextValue,
		};

		const linkAttributes = {
			url: nextValue?.url,
		};

		if (nextValue?.opensInNewTab) {
			linkAttributes.target = '_blank';
			linkAttributes.rel = linkAttributes.rel
				? linkAttributes.rel + ' noreferrer noopener'
				: 'noreferrer noopener';
		}

		if (nextValue?.nofollow) {
			linkAttributes.rel = linkAttributes.rel ? linkAttributes.rel + ' nofollow' : 'nofollow';
		}
		updateFormat(linkAttributes);
	}
	return (
		<Popover className="kb-typing-popover kb-tooltip-popover" onClose={onClose} anchor={popoverAnchor}>
			<KadencePanelBody
				title={__('Tooltip Content', 'kadence-blocks')}
				initialOpen={true}
				panelName={'kb-tooltip-basic-settings'}
			>
				<TextareaControl
					label={__('Content', 'kadence-blocks')}
					value={tooltipSettings.content}
					onChange={(newValue) => updateFormat({ content: newValue })}
				/>
				<SelectControl
					label={__('Placement', 'kadence-blocks')}
					value={tooltipSettings.placement || 'top'}
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
						updateFormat({ placement: val });
					}}
				/>
			</KadencePanelBody>
			<KadencePanelBody
				title={__('Link Settings', 'kadence-blocks')}
				initialOpen={false}
				panelName={'kb-tooltip-link-settings'}
			>
				<LinkControl
					label={__('Link', 'kadence-blocks')}
					onChange={onChangeLink}
					value={linkValue}
					settings={LINK_SETTINGS}
				/>
			</KadencePanelBody>
		</Popover>
	);
}
