/* eslint-env jest */
/**
 * Internal dependencies
 */
import { BUTTON_PRESET } from '../presets/button-preset';

describe('BUTTON_PRESET.preview', () => {
	/**
	 * AC2: every resting-state property the preview can show resolves through the feed's value map,
	 * aliases included — border as its three sibling keys, shadow as a composite,
	 * padding/margin as per-side slot lists.
	 *
	 * @return {void}
	 */
	it('resolves border, shadow, padding and margin alongside the color trio', () => {
		const values = {
			'semantic.color.action-primary': '#3633e1',
			'semantic.color.on-primary': '#ffffff',
			'semantic.border-width.default': '1px',
			'semantic.color.border': '#d0d5dd',
			'primitive.spacing.sm': '0.5rem',
		};
		const tokens = {
			'button-bg': '{semantic.color.action-primary}',
			'button-text': '{semantic.color.on-primary}',
			'button-radius': '0.5rem',
			'button-border-width': '{semantic.border-width.default}',
			'button-border-style': 'solid',
			'button-border-color': '{semantic.color.border}',
			'button-shadow': {
				color: 'rgba(0, 0, 0, 0.2)',
				offsetX: '0px',
				offsetY: '2px',
				blur: '4px',
				spread: '0px',
			},
			'button-padding': ['{primitive.spacing.sm}', '1em', '{primitive.spacing.sm}', '1em'],
			'button-margin': ['0', '0', '0.5rem', '0'],
			'button-bg-hover': '{semantic.color.on-primary}',
			'button-text-hover': '{semantic.color.action-primary}',
		};

		expect(BUTTON_PRESET.preview(tokens, values)).toEqual({
			background: '#3633e1',
			color: '#ffffff',
			borderRadius: '0.5rem',
			borderWidth: '1px',
			borderStyle: 'solid',
			borderColor: '#d0d5dd',
			shadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)',
			padding: '0.5rem 1em 0.5rem 1em',
			margin: '0 0 0.5rem 0',
			hover: {
				background: '#ffffff',
				color: '#3633e1',
				borderRadius: '',
				borderWidth: '',
				borderStyle: '',
				borderColor: '',
				shadow: '',
			},
		});
	});

	/**
	 * AC3: a preset that stores none of the new properties previews them as empty strings, the
	 * same absent-not-invented posture the color trio already takes — hover included.
	 *
	 * @return {void}
	 */
	it('previews unset style properties as empty', () => {
		const preview = BUTTON_PRESET.preview({ 'button-bg': 'transparent' }, {});

		expect(preview.borderWidth).toBe('');
		expect(preview.borderStyle).toBe('');
		expect(preview.borderColor).toBe('');
		expect(preview.shadow).toBe('');
		expect(preview.padding).toBe('');
		expect(preview.margin).toBe('');
		expect(preview.hover).toEqual({
			background: '',
			color: '',
			borderRadius: '',
			borderWidth: '',
			borderStyle: '',
			borderColor: '',
			shadow: '',
		});
	});
});
