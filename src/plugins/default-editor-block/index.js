import { __ } from '@wordpress/i18n';
import KadenceSetting from '../settings';
import { PanelBody } from '@wordpress/components';
import { SafeParseJSON } from '@kadence/helpers';
import apiFetch from '@wordpress/api-fetch';

export default function DefaultEditorBlock() {
	function successCallback(key, value) {
		if (value) {
			const config = kadence_blocks_params.configuration
				? SafeParseJSON(kadence_blocks_params.configuration, true)
				: {};
			config['kadence/advancedheading'] = { htmlTag: 'p' };
			apiFetch({
				path: '/wp/v2/settings',
				method: 'POST',
				data: { kadence_blocks_config_blocks: JSON.stringify(config) },
			}).then(() => {
				kadence_blocks_params.configuration = JSON.stringify(config);
			});
		}
	}

	return (
		<PanelBody title={__('Default Editor Block', 'kadence-blocks')} initialOpen={false}>
			<KadenceSetting
				slug={'adv_text_is_default_editor_block'}
				label={__('Set Advanced Text as default block', 'kadence-blocks')}
				type={'toggle'}
				theDefault={false}
				successCallback={successCallback}
			/>
			{__(
				'This will set the Advanced Text block as the default block in the editor and update its default styles to use the paragraph tag.',
				'kadence-blocks'
			)}
			&nbsp;
			{__(
				'If Kadence Blocks is disabled Advanced Text blocks will continue to display, but may lose some of their styling.',
				'kadence-blocks'
			)}
		</PanelBody>
	);
}
