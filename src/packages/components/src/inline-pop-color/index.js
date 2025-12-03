/**
 * Advanced Color Control.
 *
 */

/**
 * Import Icons
 */
import ColorPicker from '../color-picker';
import { hexToRGBA } from '@kadence/helpers';
import { map } from 'lodash';
import { useSetting } from '@wordpress/block-editor';
import { useState, useMemo } from '@wordpress/element';

/**
 * Internal block libraries
 */
import { __, sprintf } from '@wordpress/i18n';
import { Button, ToolbarGroup, Tooltip, Dashicon, SVG, Dropdown, Path } from '@wordpress/components';
import { DOWN } from '@wordpress/keycodes';

function unConvertOpacity(value) {
	let val = 100;
	if (value) {
		val = value * 100;
	}
	return val;
}

// eslint-disable-next-line camelcase
const ColorSelectorSVGIcon = () => (
	<SVG xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20">
		<Path d="M7.434 5l3.18 9.16H8.538l-.692-2.184H4.628l-.705 2.184H2L5.18 5h2.254zm-1.13 1.904h-.115l-1.148 3.593H7.44L6.304 6.904zM14.348 7.006c1.853 0 2.9.876 2.9 2.374v4.78h-1.79v-.914h-.114c-.362.64-1.123 1.022-2.031 1.022-1.346 0-2.292-.826-2.292-2.108 0-1.27.972-2.006 2.71-2.107l1.696-.102V9.38c0-.584-.42-.914-1.18-.914-.667 0-1.112.228-1.264.647h-1.701c.12-1.295 1.307-2.107 3.066-2.107zm1.079 4.1l-1.416.09c-.793.056-1.18.342-1.18.844 0 .52.45.837 1.091.837.857 0 1.505-.545 1.505-1.256v-.515z" />
	</SVG>
);
export default function InlinePopColorControl({
	label,
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
}) {
	const [classSat, setClassSat] = useState('first');
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
	const paletteIndex = isPalette && colors && colorVal ? colorVal.match(/\d+$/)?.[0] - 1 : null;
	let currentColorString = paletteIndex !== null && colors[paletteIndex] ? colors[paletteIndex].color : colorVal;
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
	const renderToggleComponent =
		() =>
		({ onToggle, isOpen }) => {
			const openOnArrowDown = (event) => {
				if (!isOpen && event.keyCode === DOWN) {
					event.preventDefault();
					event.stopPropagation();
					onToggle();
				}
			};
			return (
				<ToolbarGroup>
					<Button
						className="components-toolbar__control kb-colors-selector__toggle"
						label={label}
						onClick={onToggle}
						onKeyDown={openOnArrowDown}
						icon={
							<div className="kb-colors-selector__icon-container">
								<div
									className={'kb-colors-selector__state-selection'}
									style={{ color: currentColorString }}
								>
									<ColorSelectorSVGIcon />
								</div>
							</div>
						}
					/>
				</ToolbarGroup>
			);
		};
	return (
		<Dropdown
			placement="top"
			className="kb-colors-selector components-dropdown-menu components-toolbar new-kadence-advanced-colors"
			contentClassName="block-library-colors-selector__popover kt-popover-color kadence-pop-color-popover"
			//renderToggle={ renderToggleComponent() }
			renderToggle={({ isOpen, onToggle }) => (
				<>
					<Button
						className="components-toolbar__control components-dropdown-menu__toggle kb-colors-selector__toggle"
						label={label}
						tooltip={label}
						icon={
							<div className="kb-colors-selector__icon-container">
								<div
									className={'kb-colors-selector__state-selection'}
									style={{ color: currentColorString }}
								>
									<ColorSelectorSVGIcon />
								</div>
							</div>
						}
						onClick={onToggle}
						aria-expanded={isOpen}
					></Button>
				</>
			)}
			renderContent={() => (
				<div className="inline-color-popup-inner-wrap block-editor-block-toolbar">
					{classSat === 'first' && (
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
					)}
					{classSat !== 'first' && (
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
					)}
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
				</div>
			)}
		/>
	);
}
