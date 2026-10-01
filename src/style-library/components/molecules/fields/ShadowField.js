/**
 * The composite shadow editor: a Color row (round swatch + "Color", opens a popover), four small
 * X/Y/Blur/Spread numeric controls, and an Inset toggle. The value's keys match the PHP shadow
 * composite fields (color, offsetX, offsetY, blur, spread) so a consumer maps field to token
 * without translation.
 */

/**
 * WordPress dependencies
 */
// Experimental API: __experimentalNumberControl's signature can change between WP releases;
// stable fallback is `TextControl type="number"`.
import {
	__experimentalNumberControl as NumberControl,
	ColorIndicator,
	ColorPicker,
	Dropdown,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FieldLabel } from './FieldLabel';
import './ShadowField.scss';

/**
 * The shadow value's default shape when no value is supplied yet.
 *
 * @since TBD
 */
const DEFAULT_SHADOW = { color: '#000000', offsetX: 0, offsetY: 0, blur: 0, spread: 0, inset: false };

/**
 * The four numeric sub-fields, in display order.
 *
 * @since TBD
 */
const NUMERIC_FIELDS = [
	{ key: 'offsetX', label: __('X', 'kadence-blocks') },
	{ key: 'offsetY', label: __('Y', 'kadence-blocks') },
	// Blur is the only field with a floor, for the reason `BoxShadowControl`'s own axis list gives:
	// CSS rejects a negative blur radius, and one invalid component makes the browser drop the whole
	// `box-shadow`, so a stray `-2` removes the shadow rather than softening it.
	{ key: 'blur', label: __('Blur', 'kadence-blocks'), min: 0 },
	{ key: 'spread', label: __('Spread', 'kadence-blocks') },
];

/**
 * Hold a numeric field's value at its own floor, when it has one.
 *
 * @param {number}  value The value being written.
 * @param {?number} min   The field's floor, or undefined when it has none.
 *
 * @since TBD
 *
 * @return {number} The value, never below the floor.
 */
function clampToMin(value, min) {
	return min === undefined ? value : Math.max(value, min);
}

/**
 * Render the shadow field.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.field    The field definition ({ label, readOnly }).
 * @param {?Object}  props.value    The current shadow value ({ color, offsetX, offsetY, blur, spread, inset }).
 * @param {Function} props.onChange Called with the new shadow value on edit; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function ShadowField({ field, value, onChange }) {
	const shadow = { ...DEFAULT_SHADOW, ...(value || {}) };

	const setPart = (key, next) => {
		if (field.readOnly) {
			return;
		}

		// The floor belongs to the value, not to the blur input's own change event: applying it on every
		// write means a negative blur arriving from anywhere is held at zero rather than committed into
		// a shadow CSS refuses to render.
		const merged = { ...shadow, [key]: next };

		onChange({ ...merged, blur: Math.max(Number(merged.blur) || 0, 0) });
	};

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--shadow">
			<FieldLabel>{field.label}</FieldLabel>
			<Dropdown
				className="kadence-blocks-style-library__field-shadow-color"
				renderToggle={({ isOpen, onToggle }) => (
					<button
						type="button"
						className="kadence-blocks-style-library__field-shadow-color-row"
						aria-expanded={isOpen}
						disabled={field.readOnly}
						onClick={onToggle}
					>
						<ColorIndicator
							colorValue={shadow.color}
							className="kadence-blocks-style-library__field-shadow-color-swatch"
						/>
						<span className="kadence-blocks-style-library__field-shadow-color-label">
							{__('Color', 'kadence-blocks')}
						</span>
					</button>
				)}
				renderContent={() => (
					<ColorPicker
						color={shadow.color}
						enableAlpha
						onChange={(next) => setPart('color', next.hex ?? next)}
					/>
				)}
			/>
			<div className="kadence-blocks-style-library__field-shadow-row">
				{NUMERIC_FIELDS.map(({ key, label, min }) => (
					<div key={key} className="kadence-blocks-style-library__field-shadow-number">
						<span className="kadence-blocks-style-library__field-shadow-number-label">{label}</span>
						<NumberControl
							__next40pxDefaultSize
							min={min}
							value={shadow[key]}
							disabled={field.readOnly}
							// `min` stops the spinner and arrow keys; a typed or pasted value still arrives
							// here, so the floor is applied to what gets stored too.
							onChange={(next) => setPart(key, next === '' ? 0 : clampToMin(Number(next), min))}
						/>
					</div>
				))}
			</div>
			<ToggleControl
				label={__('Inset', 'kadence-blocks')}
				checked={Boolean(shadow.inset)}
				disabled={field.readOnly}
				onChange={(next) => setPart('inset', next)}
			/>
		</div>
	);
}
