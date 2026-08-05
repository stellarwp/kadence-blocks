/**
 * The shared Color/Gradient two-tab picker body: a solid `ColorPicker` and a `GradientPicker`.
 * Composed by both `ColorField` (inline) and `ColorListField` (inside each row's popover) rather
 * than duplicated.
 */

/**
 * WordPress dependencies
 */
import { ColorPicker, GradientPicker, TabPanel } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { colord } from 'colord';

/**
 * The Color/Gradient tabs.
 *
 * @since TBD
 */
const TABS = [
	{ name: 'color', title: __('Color', 'kadence-blocks') },
	{ name: 'gradient', title: __('Gradient', 'kadence-blocks') },
];

/**
 * Whether a value string looks like a CSS gradient rather than a solid color.
 *
 * @param {string} value The value to check.
 *
 * @since TBD
 *
 * @return {boolean} True when the value looks like a gradient.
 */
export function isGradientValue(value) {
	return typeof value === 'string' && value.includes('gradient');
}

/**
 * Render the Color/Gradient picker body.
 *
 * @param {Object}   props             The component props.
 * @param {string}   props.value       The current CSS color or gradient string.
 * @param {Array}    [props.gradients] The gradient presets to offer on the Gradient tab.
 * @param {boolean}  [props.readOnly]  Whether the picker is non-interactive.
 * @param {boolean}  [props.colorOnly] Renders the solid-color tab body with no Gradient tab at all.
 * @param {Function} props.onChange    Called with the new value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The picker body.
 */
export function ColorGradientPicker({ value, gradients = [], readOnly = false, colorOnly = false, onChange }) {
	const handleChange = (next) => !readOnly && onChange(next);

	// A gradient string picked here would persist: `guard_swatches()` accepts function-shaped strings
	// via `Literals::is_color()`'s `is_function()` fallback, so it would then be projected as a color.
	// Until the backend can store gradient tokens, the Gradient tab must not exist on this path — a
	// disabled tab would still let a value through the same fallback, so the tab itself is dropped.
	// @todo SOFT-4114: drop the colorOnly escape and re-enable the Gradient tab once gradient tokens land.
	if (colorOnly) {
		return (
			<ColorPicker
				color={colord(value || '#000000').toHex()}
				enableAlpha
				onChange={(next) => handleChange(next.hex ?? next)}
			/>
		);
	}

	return (
		<TabPanel
			className="kadence-blocks-style-library__color-gradient-picker"
			tabs={TABS}
			initialTabName={isGradientValue(value) ? 'gradient' : 'color'}
		>
			{(tab) =>
				tab.name === 'gradient' ? (
					<GradientPicker
						value={isGradientValue(value) ? value : undefined}
						gradients={gradients}
						disableCustomGradients={readOnly}
						onChange={handleChange}
					/>
				) : (
					<ColorPicker
						color={isGradientValue(value) ? undefined : colord(value || '#000000').toHex()}
						enableAlpha
						onChange={(next) => handleChange(next.hex ?? next)}
					/>
				)
			}
		</TabPanel>
	);
}
