import { Component, Fragment, useEffect, useState } from '@wordpress/element';
import { ToggleControl, Button, Tooltip, Modal, Dashicon } from '@wordpress/components';

import { applyFilters } from '@wordpress/hooks';
import Select from 'react-select';
import { fontFamilyIcon } from '@kadence/icons';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';

function KadenceTypographyDefault(props) {
	const [isOpen, setIsOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [configuration, setConfiguration] = useState(
		kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}
	);
	const { createSuccessNotice } = useDispatch(noticesStore);

	useEffect(() => {
		// Check for old defaults.
		if (!configuration['kadence/typography']) {
			const blockConfig = kadence_blocks_params.config['kadence/typography'];
			if (blockConfig !== undefined && typeof blockConfig === 'object') {
				Object.keys(blockConfig).map((attribute) => {
					saveConfigState(attribute, blockConfig[attribute]);
				});
			}
		}
	}, []);

	const saveConfig = (blockID, settingArray) => {
		setIsSaving(true);
		const config = kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {};
		if (!config[blockID]) {
			config[blockID] = {};
		}
		config[blockID] = settingArray;
		const settingModel = new wp.api.models.Settings({ kadence_blocks_config_blocks: JSON.stringify(config) });
		settingModel.save().then((response) => {
			createSuccessNotice(__('Block defaults saved!', 'kadence-blocks'), {
				type: 'snackbar',
			});

			setIsSaving(false);
			setConfiguration({ ...config });
			setIsOpen(false);
			kadence_blocks_params.configuration = JSON.stringify(config);
		});
	};

	const saveConfigState = (key, value) => {
		const config = configuration;
		if (config['kadence/typography'] === undefined || config['kadence/typography'].length == 0) {
			config['kadence/typography'] = {};
		}
		config['kadence/typography'][key] = value;
		setConfiguration({ ...config });
	};

	const typoConfig = configuration && configuration['kadence/typography'] ? configuration['kadence/typography'] : {};
	const fontsarray =
		typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.g_font_names
			? kadence_blocks_params.g_font_names.map((name) => {
					return { label: name, value: name, google: true };
			  })
			: {};
	const options = [
		{
			type: 'group',
			label: 'Standard Fonts',
			options: [
				{
					label: 'System Default',
					value: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
					google: false,
				},
				{ label: 'Arial, Helvetica, sans-serif', value: 'Arial, Helvetica, sans-serif', google: false },
				{
					label: '"Arial Black", Gadget, sans-serif',
					value: '"Arial Black", Gadget, sans-serif',
					google: false,
				},
				{ label: 'Helvetica, sans-serif', value: 'Helvetica, sans-serif', google: false },
				{
					label: '"Comic Sans MS", cursive, sans-serif',
					value: '"Comic Sans MS", cursive, sans-serif',
					google: false,
				},
				{ label: 'Impact, Charcoal, sans-serif', value: 'Impact, Charcoal, sans-serif', google: false },
				{
					label: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
					value: '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
					google: false,
				},
				{ label: 'Tahoma, Geneva, sans-serif', value: 'Tahoma, Geneva, sans-serif', google: false },
				{
					label: '"Trebuchet MS", Helvetica, sans-serif',
					value: '"Trebuchet MS", Helvetica, sans-serif',
					google: false,
				},
				{ label: 'Verdana, Geneva, sans-serif', value: 'Verdana, Geneva, sans-serif', google: false },
				{ label: 'Georgia, serif', value: 'Georgia, serif', google: false },
				{
					label: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
					value: '"Palatino Linotype", "Book Antiqua", Palatino, serif',
					google: false,
				},
				{ label: '"Times New Roman", Times, serif', value: '"Times New Roman", Times, serif', google: false },
				{ label: 'Courier, monospace', value: 'Courier, monospace', google: false },
				{
					label: '"Lucida Console", Monaco, monospace',
					value: '"Lucida Console", Monaco, monospace',
					google: false,
				},
			],
		},
		{
			type: 'group',
			label: 'Google Fonts',
			options: fontsarray,
		},
	];
	const typographyOptions = applyFilters('kadence.typography_options', options);
	const onTypoFontChange = (select) => {
		saveConfigState('choiceArray', select);
	};
	return (
		<Fragment>
			<Tooltip text={__('Block Defaults', 'kadence-blocks')}>
				<Button className="kb-block-settings-visibility" onClick={() => setIsOpen(true)}>
					<div className="kt-block-defaults">
						<span className="kt-block-icon">{fontFamilyIcon}</span>
						{__('Font Family Options', 'kadence-blocks')}
					</div>
					<div className="kt-block-settings">
						<Dashicon icon="visibility" />
					</div>
				</Button>
			</Tooltip>

			{isOpen ? (
				<Modal
					className="kt-block-defaults-modal kt-font-family-modal"
					title={__('Kadence Font Family Options', 'kadence-blocks')}
					onRequestClose={() => {
						saveConfig('kadence/typography', typoConfig);
					}}
				>
					<ToggleControl
						label={__('Show All Font Family Options', 'kadence-blocks')}
						checked={undefined !== typoConfig.showAll ? typoConfig.showAll : true}
						onChange={(value) => saveConfigState('showAll', value)}
					/>
					{(undefined !== typoConfig.showAll ? !typoConfig.showAll : false) && (
						<Fragment>
							<div className="typography-family-select-form-row">
								<Select
									options={typographyOptions}
									value={typoConfig.choiceArray ? typoConfig.choiceArray : ''}
									isMulti={true}
									maxMenuHeight={300}
									placeholder={__('Select the font families you want', 'kadence-blocks')}
									onChange={onTypoFontChange}
								/>
							</div>
						</Fragment>
					)}
					<Button
						className="kt-defaults-save"
						isPrimary
						onClick={() => {
							saveConfig('kadence/typography', typoConfig);
						}}
					>
						{__('Save/Close', 'kadence-blocks')}
					</Button>
				</Modal>
			) : null}
		</Fragment>
	);
}

export default KadenceTypographyDefault;
