/**
 * Advanced Color Control.
 *
 */

/**
 * Import Icons
 */
import ColorPicker from '../color-picker';
import ColorIcons from '../color-icons';
import { hexToRGBA } from '@kadence/helpers';

import { get, map } from 'lodash';
import { useSetting } from '@wordpress/block-editor';
import { useState, useMemo } from '@wordpress/element';
/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
import { withSelect } from '@wordpress/data';
import { Button, Popover, ColorIndicator, Tooltip, Dashicon } from '@wordpress/components';

function unConvertOpacity(value) {
	let val = 100;
	if (value) {
		val = value * 100;
	}
	return val;
}

export default function SinglePopColorControl({
	label,
	alpha = true,
	opacityValue = '',
	opacityUnit = '',
	onOpacityChange = null,
	value,
	onChange,
	reload,
	reloaded,
	defaultValue,
	onClassChange,
	onArrayChange = null,
	disableCustomColors = false,
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [currentColor, setCurrentColor] = useState('');
	const [currentOpacity, setCurrentOpacity] = useState(opacityValue !== '' ? opacityValue : 1);
	const [isPalette, setIsPalette] = useState(value && value.startsWith('palette') ? true : false);
	const allColors = useSetting('color.palette');

	// Get Kadence Blocks color configuration
	const kadenceColors = useMemo(() => {
		if (typeof kadence_blocks_params !== 'undefined' && kadence_blocks_params.colors) {
			try {
				return JSON.parse(kadence_blocks_params.colors);
			} catch (e) {
				return { palette: [], override: false };
			}
		}
		return { palette: [], override: false };
	}, []);

	// Filter colors based on override setting
	const colors = useMemo(() => {
		if (!allColors || !Array.isArray(allColors)) {
			return [];
		}

		// If override is enabled, only show custom colors (kb-palette colors)
		if (kadenceColors.override === true) {
			return allColors.filter((color) => color.slug && color.slug.startsWith('kb-palette'));
		}

		// If override is disabled, show all colors (theme + custom)
		return allColors;
	}, [allColors, kadenceColors.override]);
	const toggleVisible = () => {
		setIsVisible(true);
	};
	const toggleClose = () => {
		if (isVisible === true) {
			setIsVisible(false);
		}
	};
	if (reload) {
		reloaded(true);
		setTimeout(() => {
			setCurrentColor('');
			setCurrentOpacity('');
			setIsPalette(false);
		}, 100);
	}
	const convertOpacity = (value) => {
		let val = 1;
		if (value) {
			val = value / 100;
		}
		return val;
	};
	const convertedOpacityValue = 100 === opacityUnit ? convertOpacity(currentOpacity) : currentOpacity;
	const colorVal = currentColor ? currentColor : value;
	let currentColorString =
		isPalette && colors && colorVal && colors[parseInt(colorVal.slice(-1), 10) - 1]
			? colors[parseInt(colorVal.slice(-1), 10) - 1].color
			: colorVal;
	if (!isPalette && currentColorString && currentColorString.startsWith('var(')) {
		currentColorString = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue(value.replace('var(', '').split(',')[0].replace(')', ''));
	}
	if (currentColorString && currentColorString.startsWith('var(')) {
		let temp_currentColorString = window
			.getComputedStyle(document.documentElement)
			.getPropertyValue(currentColorString.replace('var(', '').replace(' ', '').replace(')', ''));
		if ('' === temp_currentColorString) {
			temp_currentColorString = window
				.getComputedStyle(document.documentElement)
				.getPropertyValue(
					currentColorString.replace('var(', '').replace(' ', '').split(',')[0].replace(')', '')
				);
		}
		currentColorString = temp_currentColorString;
	}
	if ('' === currentColorString) {
		currentColorString = defaultValue;
	}
	// if ( '' !== currentColorString && this.props.onOpacityChange && ! this.state.isPalette ) {
	// 	currentColorString = hexToRGBA( ( undefined === currentColorString ? '' : currentColorString ), ( convertedOpacityValue !== undefined && convertedOpacityValue !== '' ? convertedOpacityValue : 1 ) );
	// }
	if (onOpacityChange && !isPalette) {
		if (
			Number(convertedOpacityValue !== undefined && convertedOpacityValue !== '' ? convertedOpacityValue : 1) !==
			1
		) {
			currentColorString = hexToRGBA(
				undefined === currentColorString ? '' : currentColorString,
				convertedOpacityValue !== undefined && convertedOpacityValue !== '' ? convertedOpacityValue : 1
			);
		}
	}
	let previewColorString = currentColorString;
	if (isPalette && colorVal) {
		switch (colorVal) {
			case 'palette1':
				previewColorString = 'var(--global-palette1,#2B6CB0)';
				break;
			case 'palette2':
				previewColorString = 'var(--global-palette2,#215387)';
				break;
			case 'palette3':
				previewColorString = 'var(--global-palette3,#1A202C)';
				break;
			case 'palette4':
				previewColorString = 'var(--global-palette4,#2D3748)';
				break;
			case 'palette5':
				previewColorString = 'var(--global-palette5,#4A5568)';
				break;
			case 'palette6':
				previewColorString = 'var(--global-palette6,#718096)';
				break;
			case 'palette7':
				previewColorString = 'var(--global-palette7,#EDF2F7)';
				break;
			case 'palette8':
				previewColorString = 'var(--global-palette8,#F7FAFC)';
				break;
			case 'palette9':
				previewColorString = 'var(--global-palette9,#ffffff)';
				break;
		}
	}
	const onChangeState = (tempColor, tempPalette) => {
		let newColor;
		let opacity = 100 === opacityUnit ? 100 : 1;
		if (tempPalette) {
			newColor = tempPalette;
		} else if (undefined !== tempColor.rgb && undefined !== tempColor.rgb.a && 1 !== tempColor.rgb.a) {
			if (onOpacityChange) {
				if (tempColor.hex === 'transparent') {
					newColor = '#000000';
				} else {
					newColor = tempColor.hex;
				}
				opacity = 100 === opacityUnit ? unConvertOpacity(tempColor.rgb.a) : tempColor.rgb.a;
			} else {
				newColor =
					'rgba(' +
					tempColor.rgb.r +
					',' +
					tempColor.rgb.g +
					',' +
					tempColor.rgb.b +
					',' +
					tempColor.rgb.a +
					')';
			}
		} else if (undefined !== tempColor.hex) {
			newColor = tempColor.hex;
		} else {
			newColor = tempColor;
		}
		setCurrentColor(newColor);
		setCurrentOpacity(opacity);
		setIsPalette(tempPalette ? true : false);
	};
	const onChangeComplete = (tempColorCom, tempPalettCom) => {
		let newColor;
		let opacity = 100 === opacityUnit ? 100 : 1;
		if (tempPalettCom) {
			newColor = tempPalettCom;
		} else if (undefined !== tempColorCom.rgb && undefined !== tempColorCom.rgb.a && 1 !== tempColorCom.rgb.a) {
			if (onOpacityChange) {
				if (tempColorCom.hex === 'transparent') {
					newColor = '#000000';
				} else {
					newColor = tempColorCom.hex;
				}
				opacity = 100 === opacityUnit ? unConvertOpacity(tempColorCom.rgb.a) : tempColorCom.rgb.a;
			} else {
				newColor =
					'rgba(' +
					tempColorCom.rgb.r +
					',' +
					tempColorCom.rgb.g +
					',' +
					tempColorCom.rgb.b +
					',' +
					tempColorCom.rgb.a +
					')';
			}
		} else if (undefined !== tempColorCom.hex) {
			newColor = tempColorCom.hex;
		} else {
			newColor = tempColorCom;
		}
		setCurrentColor(newColor);
		setCurrentOpacity(opacity);
		setIsPalette(tempPalettCom ? true : false);
		if (null !== onArrayChange) {
			onArrayChange(newColor, opacity);
		} else {
			onChange(newColor);
			if (null !== onOpacityChange) {
				setTimeout(() => {
					onOpacityChange(opacity);
				}, 50);
			}
		}
	};
	return (
		<div className="single-pop-color">
			{isVisible && (
				<Popover position="top left" className="kadence-pop-color-popover" onClose={toggleClose}>
					<ColorPicker
						color={currentColorString}
						onChange={(color) => onChangeState(color, '')}
						onChangeComplete={(color) => {
							onChangeComplete(color, '');
							if (onClassChange) {
								onClassChange('');
							}
						}}
					/>
					{colors && (
						<div className="kadence-pop-color-palette-swatches">
							{map(colors, ({ color, slug, name }) => {
								const style = { color };
								const palette = slug.replace('theme-', '');
								const isActive =
									palette === value || (!slug.startsWith('theme-palette') && value === color);
								return (
									<div key={color} className="kadence-color-palette__item-wrapper">
										<Tooltip
											text={
												name ||
												// translators: %s: color hex code e.g: "#f00".
												sprintf(__('Color code: %s'), color)
											}
										>
											<Button
												type="button"
												className={`kadence-color-palette__item ${isActive ? 'is-active' : ''}`}
												style={style}
												onClick={() => {
													if (slug.startsWith('theme-palette')) {
														onChangeComplete(color, palette);
													} else {
														onChangeComplete(color, false);
													}
													if (onClassChange) {
														onClassChange(slug);
													}
												}}
												aria-label={
													name
														? // translators: %s: The name of the color e.g: "vivid red".
															sprintf(__('Color: %s', 'kadence-blocks'), name)
														: // translators: %s: color hex code e.g: "#f00".
															sprintf(__('Color code: %s', 'kadence-blocks'), color)
												}
												aria-pressed={isActive}
											/>
										</Tooltip>
										{palette === value && <Dashicon icon="admin-site" />}
										{!slug.startsWith('theme-palette') && value === color && (
											<Dashicon icon="saved" />
										)}
									</div>
								);
							})}
						</div>
					)}
				</Popover>
			)}
			{isVisible && (
				<Button
					className={`kadence-pop-color-icon-indicate ${alpha ? 'kadence-has-alpha' : 'kadence-no-alpha'}`}
					onClick={toggleVisible}
					showTooltip={true}
					label={label}
				>
					<ColorIndicator className="kadence-pop-color-indicate" colorValue={previewColorString} />
					{value && value.startsWith('palette') && (
						<span className="color-indicator-icon">{<Dashicon icon="admin-site" />}</span>
					)}
				</Button>
			)}
			{!isVisible && (
				<Button
					className={`kadence-pop-color-icon-indicate ${alpha ? 'kadence-has-alpha' : 'kadence-no-alpha'}`}
					onClick={toggleVisible}
					showTooltip={true}
					label={label}
				>
					<ColorIndicator className="kadence-pop-color-indicate" colorValue={previewColorString} />
					{value && value.startsWith('palette') && (
						<span className="color-indicator-icon">{<Dashicon icon="admin-site" />}</span>
					)}
				</Button>
			)}
		</div>
	);
}
