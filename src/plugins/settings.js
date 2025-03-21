import { useState } from '@wordpress/element';
import { ToggleControl } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

function KadenceSetting(props) {
	const { slug, label, type, theDefault, successCallback, help } = props;

	const [isSaving, setIsSaving] = useState(false);
	const [settings, setSettings] = useState(
		kadence_blocks_params.globalSettings ? JSON.parse(kadence_blocks_params.globalSettings) : {}
	);
	const { createSuccessNotice } = useDispatch(noticesStore);

	const saveConfig = (key, value) => {
		setIsSaving(true);
		// console.log('saveConfig', key, value);
		const config = kadence_blocks_params.globalSettings ? JSON.parse(kadence_blocks_params.globalSettings) : {};
		config[key] = value;
		const settingModel = new wp.api.models.Settings({ kadence_blocks_settings: JSON.stringify(config) });

		settingModel.save().then((response) => {
			createSuccessNotice(__('Settings saved', 'kadence-blocks'), {
				type: 'snackbar',
			});

			setIsSaving(false);
			setSettings(config);
			kadence_blocks_params.globalSettings = JSON.stringify(config);
			successCallback && successCallback(key, value);
		}).then(() => {
			const { getBlocks } = wp.data.select('core/block-editor');
			const allBlocks = getBlocks();
			
			// If block has uniqueId, trigger rerender without marking as changed
			const processBlocks = (blocks) => {
				blocks.forEach((block) => {
					if (block.attributes && block.attributes.uniqueID) {
						const { updateBlockAttributes } = wp.data.dispatch('core/block-editor');
						// Dont pass next change to undo stack
						wp.data.dispatch('core/block-editor').__unstableMarkNextChangeAsNotPersistent();
						updateBlockAttributes(block.clientId, { 
							'data-kb-rerender': Date.now()
						});
					}
					
					if (block.innerBlocks && block.innerBlocks.length) {
						processBlocks(block.innerBlocks);
					}
				});
			};
			
			processBlocks(allBlocks);
		});
	};

	return (
		<>
			{type === 'toggle' && (
				<ToggleControl
					label={label}
					isBusy={isSaving}
					checked={
						undefined !== settings?.[slug] && !theDefault === settings?.[slug] ? !theDefault : theDefault
					}
					onChange={(value) => saveConfig(slug, value)}
					help={help}
				/>
			)}
		</>
	);
}

export default KadenceSetting;
