import { __ } from '@wordpress/i18n';
import { useAnchor } from '@wordpress/rich-text';
import { Popover, SelectControl, TextareaControl } from '@wordpress/components';
import { useCachedTruthy } from '@wordpress/block-editor';
import { KadencePanelBody } from '@kadence/components';
import { kadenceToolTips as settings } from './tooltips';

export default function TooltipsPopover({ name, value, updateFormat, onClose, contentRef, activeAttributes }) {
	const defaultAttributes = {
		content: '',
	};
	const getCurrentSettings = () => {
		const response = { ...defaultAttributes, ...activeAttributes };

		try {
			response.strings = JSON.parse(response.strings);
		} catch (e) {
			console.log('Error parsing strings', e);
		}

		return response;
	};
	const tooltipSettings = getCurrentSettings();
	const popoverAnchor = useCachedTruthy(
		useAnchor({
			editableContentElement: contentRef.current,
			value,
			settings,
		})
	);
	return (
		<Popover className="kb-typing-popover" onClose={onClose} anchor={popoverAnchor}>
			<KadencePanelBody initialOpen={true} panelName={'kb-typing-basic-settings'}>
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
		</Popover>
	);
}
