import { map, get, uniqueId, findIndex } from 'lodash';
import { AdvancedColorControlPalette } from '@kadence/components';
import { Component, Fragment, useEffect, useState } from '@wordpress/element';
import { ToggleControl, Dashicon, Button, Tooltip } from '@wordpress/components';
import { compose } from '@wordpress/compose';
import { store as noticesStore } from '@wordpress/notices';
import apiFetch from '@wordpress/api-fetch';
import { useDispatch, useSelect } from '@wordpress/data';
import { useSetting, store as blockEditorStore } from '@wordpress/block-editor';

const kbColorUniqueIDs = [];
/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';

export default function KadenceColorDefault() {
	const [isSaving, setIsSaving] = useState(false);
	const [kadenceColors, setKadenceColors] = useState(
		kadence_blocks_params.colors
			? JSON.parse(kadence_blocks_params.colors)
			: {
					palette: [],
					override: false,
				}
	);
	const colorPalette = useSetting('color.palette');
	const disableCustomColors = !useSetting('color.custom');
	const [colors, setColors] = useState('');
	const [themeColors, setThemeColors] = useState([]);
	const [showMessage, setShowMessage] = useState(false);
	const [classSat, setClassSat] = useState('first');
	const { createErrorNotice } = useDispatch(noticesStore);
	const { updateSettings } = useDispatch(blockEditorStore);
	useEffect(() => {
		if (!colors) {
			if (undefined !== kadenceColors.override && true === kadenceColors.override) {
				setColors(kadenceColors.palette || []);
			} else {
				setColors(colorPalette);
			}
		}

		if (undefined !== kadenceColors.palette && undefined !== kadenceColors.palette[0]) {
			map(kadenceColors.palette, ({ slug }) => {
				const theID = slug.substring(11);
				kbColorUniqueIDs.push(theID);
			});
			if (undefined !== kadenceColors.override && true === kadenceColors.override) {
				setShowMessage(true);
			}
		}
	}, []);

	const saveConfig = async (configToSave = null) => {
		if (false === isSaving) {
			setIsSaving(true);
			const config = configToSave || kadenceColors;
			try {
				const response = await apiFetch({
					path: '/wp/v2/settings',
					method: 'POST',
					data: { kadence_blocks_colors: JSON.stringify(config) },
				});

				if (response) {
					setIsSaving(false);
					if (!configToSave) {
						setKadenceColors(config);
					}
					kadence_blocks_params.colors = JSON.stringify(config);
					createErrorNotice(__('Colors saved!', 'kadence-blocks'), {
						type: 'snackbar',
					});
					updateSettings({ colors });
					return true;
				}
			} catch (error) {
				createErrorNotice(__('Failed to save colors', 'kadence-blocks'), {
					type: 'snackbar',
				});

				return false;
			}
			// const settingModel = new wp.api.models.Settings({ kadence_blocks_colors: JSON.stringify(config) });
			// settingModel.save().then((response) => {
			// 	createErrorNotice(__('Block defaults saved!', 'kadence-blocks'), {
			// 		type: 'snackbar',
			// 	});

			// 	setIsSaving(false);
			// 	setKadenceColors(config);

			// 	kadence_blocks_params.colors = JSON.stringify(config);

			// 	props.updateSettings({ colors });
			// });
		}
	};
	const saveKadenceColors = (value, index) => {
		const newItems = kadenceColors.palette.map((item, thisIndex) => {
			if (parseInt(index) === parseInt(thisIndex)) {
				item = { ...item, ...value };
			}

			return item;
		});
		const newPal = kadenceColors;
		newPal.palette = newItems;

		setKadenceColors(newPal);
	};

	const saveColors = (value, index) => {
		const newItems = colors.map((item, thisIndex) => {
			if (parseInt(index) === parseInt(thisIndex)) {
				item = { ...item, ...value };
			}

			return item;
		});

		setColors(newItems);
	};

	const colorRemove = undefined !== kadenceColors.override && true === kadenceColors.override ? 1 : 0;
	return (
		<div className="kt-block-default-palette">
			{colors && (
				<div className={`components-color-palette palette-comp-${classSat}`}>
					{classSat === 'first' &&
						Object.keys(colors).map((index) => {
							let editable = false;
							let theIndex;
							const color = colors[index].color;
							const name = colors[index].name;
							const slug = colors[index].slug;
							if (undefined !== slug && slug.substr(0, 10) === 'kb-palette') {
								theIndex = findIndex(kadenceColors.palette, (c) => c.slug === slug);
								editable = true;
							}
							const style = { color };
							return (
								<div key={index} className="components-color-palette__item-wrapper">
									{editable && undefined !== theIndex && kadenceColors.palette[theIndex].color && (
										<AdvancedColorControlPalette
											nameValue={
												kadenceColors.palette[theIndex].name
													? kadenceColors.palette[theIndex].name
													: __('Color', 'kadence-blocks') + ' ' + theIndex + 1
											}
											colorValue={
												kadenceColors.palette[theIndex].color
													? kadenceColors.palette[theIndex].color
													: '#ffffff'
											}
											onSave={(value, title) => {
												saveKadenceColors(
													{
														color: value,
														name: title,
														slug,
													},
													theIndex
												);

												saveColors({ color: value, name: title, slug }, index);

												saveConfig();
											}}
										/>
									)}
									{!editable && (
										<Tooltip
											text={
												name ||
												// translators: %s: color hex code e.g: "#f00".
												sprintf(__('Color code: %s', 'kadence-blocks'), color)
											}
										>
											<div className="components-color-palette__item" style={style}>
												<Dashicon icon="lock" />
											</div>
										</Tooltip>
									)}
								</div>
							);
						})}
					{classSat === 'second' &&
						Object.keys(colors).map((index) => {
							let editable = false;
							let theIndex;
							const color = colors[index].color;
							const name = colors[index].name;
							const slug = colors[index].slug;
							if (undefined !== slug && slug.substr(0, 10) === 'kb-palette') {
								theIndex = findIndex(kadenceColors.palette, (c) => c.slug === slug);
								editable = true;
							}
							const style = { color };
							return (
								<div key={index} className="components-color-palette__item-wrapper">
									{editable && undefined !== theIndex && kadenceColors.palette[theIndex].color && (
										<AdvancedColorControlPalette
											nameValue={
												kadenceColors.palette[theIndex].name
													? kadenceColors.palette[theIndex].name
													: __('Color') + ' ' + theIndex + 1
											}
											colorValue={
												kadenceColors.palette[theIndex].color
													? kadenceColors.palette[theIndex].color
													: '#ffffff'
											}
											onSave={(value, title) => {
												saveKadenceColors(
													{
														color: value,
														name: title,
														slug,
													},
													theIndex
												);
												saveColors({ color: value, name: title, slug }, index);
												saveConfig();
											}}
										/>
									)}
									{!editable && (
										<Tooltip
											text={
												name ||
												// translators: %s: color hex code e.g: "#f00".
												sprintf(__('Color code: %s', 'kadence-blocks'), color)
											}
										>
											<div className="components-color-palette__item" style={style}>
												<Dashicon icon="lock" />
											</div>
										</Tooltip>
									)}
								</div>
							);
						})}
					{undefined !== kadenceColors.palette &&
						undefined !== kadenceColors.palette[colorRemove] &&
						!disableCustomColors && (
							<div className="kt-colors-remove-last">
								<Tooltip text={__('Remove Last Color', 'kadence-blocks')}>
									<Button
										type="button"
										isDestructive
										onClick={() => {
											const removeKey = kadenceColors.palette.length - 1;
											const removeItem =
												undefined !== kadenceColors.palette[removeKey]
													? kadenceColors.palette[removeKey]
													: kadenceColors.palette[removeKey];
											kadenceColors.palette.pop();
											const theColorIndex = findIndex(colors, (c) => c.slug === removeItem.slug);
											colors.splice(theColorIndex, 1);
											setKadenceColors(kadenceColors);
											setColors(colors);
											saveConfig();
										}}
										aria-label={__('Remove Last Color', 'kadence-blocks')}
									>
										<Dashicon icon="editor-removeformatting" />
									</Button>
								</Tooltip>
							</div>
						)}
				</div>
			)}
			{!disableCustomColors && (
				<div className="kt-colors-add-new">
					<Button
						type="button"
						className={isSaving ? 'kb-add-btn-is-saving' : 'kb-add-btn-is-active'}
						isPrimary
						disabled={isSaving}
						onClick={() => {
							if (isSaving) {
								return;
							}
							if (undefined === kadenceColors.palette) {
								kadenceColors.palette = [];
							}
							let id = uniqueId();
							if (kbColorUniqueIDs.includes(id)) {
								id = kadenceColors.palette.length.toString();
								if (kbColorUniqueIDs.includes(id)) {
									id = uniqueId(id);
									if (kbColorUniqueIDs.includes(id)) {
										id = uniqueId(id);
										if (kbColorUniqueIDs.includes(id)) {
											id = uniqueId(id);
											if (kbColorUniqueIDs.includes(id)) {
												id = uniqueId(id);
												if (kbColorUniqueIDs.includes(id)) {
													id = uniqueId(id);
												}
											}
										}
									}
								}
							}
							kbColorUniqueIDs.push(id);
							kadenceColors.palette.push({
								color: '#888888',
								name: __('Color') + ' ' + id,
								slug: 'kb-palette-' + id,
							});
							colors.push({
								color: '#888888',
								name: __('Color') + ' ' + id,
								slug: 'kb-palette-' + id,
							});

							setKadenceColors(kadenceColors);
							setColors(colors);
							saveConfig();
						}}
						aria-label={__('Add Color', 'kadence-blocks')}
					>
						{__('Add Color', 'kadence-blocks')}
					</Button>
				</div>
			)}
			{undefined !== kadenceColors.palette && undefined !== kadenceColors.palette[0] && !disableCustomColors && (
				<>
					<ToggleControl
						label={__('Use only Custom Colors?', 'kadence-blocks')}
						checked={undefined !== kadenceColors.override ? kadenceColors.override : false}
						onChange={(value) => {
							let newColors;
							const newKadenceColors = { ...kadenceColors };

							if (true === value) {
								newColors = [...(newKadenceColors.palette || [])];
								newKadenceColors.override = true;
								setShowMessage(true);
							} else {
								newKadenceColors.override = false;
								const themeColorsArray = Array.isArray(colorPalette) ? colorPalette : [];
								const customColors = newKadenceColors.palette || [];
								const uniqueCustomColors = customColors.filter(
									(customColor) =>
										!themeColorsArray.some((themeColor) => themeColor.slug === customColor.slug)
								);
								newColors = [...themeColorsArray, ...uniqueCustomColors];
								setShowMessage(true);
							}
							setKadenceColors(newKadenceColors);
							setColors(newColors);
							saveConfig(newKadenceColors);
						}}
					/>
					{undefined !== kadenceColors.override && true === showMessage && (
						<p className="kb-colors-show-notice">
							{__('Refresh page to reload theme defined colors', 'kadence-blocks')}
						</p>
					)}
				</>
			)}
		</div>
	);
}
