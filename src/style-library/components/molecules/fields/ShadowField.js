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
	{ key: 'blur', label: __('Blur', 'kadence-blocks') },
	{ key: 'spread', label: __('Spread', 'kadence-blocks') },
];

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

		onChange({ ...shadow, [key]: next });
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
				{NUMERIC_FIELDS.map(({ key, label }) => (
					<div key={key} className="kadence-blocks-style-library__field-shadow-number">
						<span className="kadence-blocks-style-library__field-shadow-number-label">{label}</span>
						<NumberControl
							__next40pxDefaultSize
							value={shadow[key]}
							disabled={field.readOnly}
							onChange={(next) => setPart(key, next === '' ? 0 : Number(next))}
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
