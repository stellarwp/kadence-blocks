/**
 * The field-library demo schema: one panel per field family, exercising every registered
 * `FIELD_TYPES` entry with realistic labels drawn from the frames, plus a `readOnly: true` TOKEN
 * ID field proving the label-only rename rule. Reachable from `PlaceholderScreen`'s dev-only "Open
 * field-library demo" button — the way the field library and `<SettingsForm>` are provably
 * complete without component-render tests. Kept in `constants/`, not authored inline, so
 * `__tests__/settings-schema.test.js` can assert its field types cover the whole registry.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { cornerAll, lineSolid } from '@wordpress/icons';

/**
 * The `?kb-item=` value `PlaceholderScreen`'s dev-only demo button navigates to; the app answers
 * it by mounting the settings panel with the demo schema instead of resolving a real item.
 *
 * @since TBD
 */
export const DEMO_ITEM_ID = 'demo';

/**
 * The demo settings schema.
 *
 * @since TBD
 */
export const DEMO_SETTINGS_SCHEMA = {
	panels: [
		{
			id: 'identity',
			title: __('Identity', 'kadence-blocks'),
			initialOpen: true,
			fields: [
				{ type: 'text', path: 'label', label: __('Name', 'kadence-blocks') },
				{ type: 'text', path: 'id', label: __('Token ID', 'kadence-blocks'), readOnly: true },
				{
					type: 'select',
					path: 'appearance',
					label: __('Appearance', 'kadence-blocks'),
					options: [
						{ value: 'solid', label: __('Solid', 'kadence-blocks') },
						{ value: 'outline', label: __('Outline', 'kadence-blocks') },
						{ value: 'ghost', label: __('Ghost', 'kadence-blocks') },
					],
				},
			],
		},
		{
			id: 'typography',
			title: __('Typography', 'kadence-blocks'),
			initialOpen: true,
			fields: [
				{
					// Marked responsive, along with Line Height below, to demo two independent switchers.
					type: 'number-unit',
					path: 'fontSize',
					label: __('Font Size', 'kadence-blocks'),
					unit: 'px',
					withRange: true,
					min: 0,
					max: 200,
					responsive: true,
				},
				{
					type: 'range-number',
					path: 'fontSizeSlider',
					label: __('Font Size (slider)', 'kadence-blocks'),
					min: 0,
					max: 200,
				},
				{
					type: 'stepper',
					path: 'lineHeight',
					label: __('Line Height', 'kadence-blocks'),
					step: 0.1,
					min: 0.8,
					max: 3,
					responsive: true,
				},
				{
					// A fixed px suffix, not a switchable unit — `letterSpacingUnit` below demos `unit`.
					type: 'number-unit',
					path: 'letterSpacing',
					label: __('Letter Spacing', 'kadence-blocks'),
					unit: 'px',
					min: -20,
					max: 20,
				},
				{
					type: 'unit',
					path: 'letterSpacingUnit',
					label: __('Unit (example)', 'kadence-blocks'),
					units: [
						{ value: 'em', label: 'em' },
						{ value: 'px', label: 'px' },
					],
				},
			],
		},
		{
			id: 'color',
			title: __('Color', 'kadence-blocks'),
			initialOpen: true,
			fields: [
				{ type: 'color', path: 'background', label: __('Background', 'kadence-blocks') },
				{
					type: 'color-list',
					path: 'stateColors',
					label: __('State Colors', 'kadence-blocks'),
					rows: [
						{ id: 'text', name: __('Text', 'kadence-blocks') },
						{ id: 'bg', name: __('Background', 'kadence-blocks') },
					],
				},
			],
		},
		{
			id: 'spacing',
			title: __('Spacing', 'kadence-blocks'),
			initialOpen: true,
			fields: [
				{
					type: 'box-sides',
					path: 'radius',
					label: __('Radius', 'kadence-blocks'),
					tokenType: 'dimension',
					leadingIcon: cornerAll,
				},
				{
					// Same shape as Radius, different leading glyph — proving the glyph is schema data.
					type: 'box-sides',
					path: 'borderWidth',
					label: __('Border Width', 'kadence-blocks'),
					tokenType: 'dimension',
					leadingIcon: lineSolid,
				},
				{
					type: 'token-select',
					path: 'spacing',
					label: __('Spacing', 'kadence-blocks'),
					tokenType: 'dimension',
				},
				{ type: 'toggle', path: 'enabled', label: __('Enabled', 'kadence-blocks') },
			],
		},
		{
			id: 'shadow',
			title: __('Shadow', 'kadence-blocks'),
			initialOpen: true,
			fields: [{ type: 'shadow', path: 'shadow', label: __('Shadow', 'kadence-blocks') }],
		},
	],
};

/**
 * The demo's initial draft values — plausible defaults for every field in `DEMO_SETTINGS_SCHEMA`.
 *
 * @since TBD
 */
export const DEMO_SETTINGS_VALUES = {
	label: __('Large', 'kadence-blocks'),
	id: 'semantic.font-size.large',
	appearance: 'solid',
	fontSize: 24,
	fontSizeSlider: 24,
	lineHeight: 1.4,
	letterSpacing: 2,
	letterSpacingUnit: '0.02em',
	background: '#2271b1',
	stateColors: { text: '#1e1e1e', bg: '#2271b1' },
	radius: '',
	borderWidth: '',
	spacing: '',
	enabled: true,
	shadow: { color: '#000000', offsetX: 0, offsetY: 4, blur: 8, spread: 0, inset: false },
};
