/* eslint-env jest */
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { capBoxSides } from '../helpers/preview';
import { BUTTON_PRESET } from '../presets/button-preset';

// Wraps the real `capBoxSides` so its capping math still runs (`preview.test.js` already covers
// that math directly) while letting the chip test below assert it was called with the row's raw
// padding/margin and the chip's cap — the DOM assertion `chip.style.padding` cannot make the same
// point, see the comment at that assertion.
jest.mock('../helpers/preview', () => ({
	...jest.requireActual('../helpers/preview'),
	capBoxSides: jest.fn(jest.requireActual('../helpers/preview').capBoxSides),
}));

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

describe('BUTTON_PRESET.renderPreview', () => {
	let container;
	let root;

	/**
	 * Mounts a chip for one row and returns the rendered span.
	 *
	 * @param {Object} row The row descriptor to render.
	 *
	 * @return {HTMLElement} The chip element.
	 */
	const mountChip = (row) => {
		act(() => root.render(BUTTON_PRESET.renderPreview(row)));

		return container.querySelector('.kadence-blocks-style-library__button-preset-preview');
	};

	beforeEach(() => {
		// Same as `preset-screen.test.js`: mounted tests must declare the act() environment or
		// React warns on every state update.
		global.IS_REACT_ACT_ENVIRONMENT = true;
		container = document.body.appendChild(document.createElement('div'));
		root = createRoot(container);
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
	});

	const preview = {
		background: '#3633e1',
		color: '#ffffff',
		borderRadius: '0.5rem',
		borderWidth: '2px',
		borderStyle: 'dashed',
		borderColor: '#d0d5dd',
		shadow: '0px 2px 4px 0px rgba(0, 0, 0, 0.2)',
		padding: '0.4em 6rem 0.4em 6rem',
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
	};

	/**
	 * AC1/AC4: the chip applies every resolved resting style, with padding and margin capped per
	 * side so one extreme preset cannot blow up its list row.
	 */
	it('applies border, shadow, and capped padding/margin to the chip', () => {
		const chip = mountChip({ id: 'primary', label: 'Primary', preview });

		expect(chip.style.borderWidth).toBe('2px');
		expect(chip.style.borderStyle).toBe('dashed');
		expect(chip.style.boxShadow).toBe('0px 2px 4px 0px rgba(0, 0, 0, 0.2)');
		// jsdom's bundled cssstyle does not implement the CSS `min()` function: any declaration using
		// it is rejected outright (not normalized, the way jsdom rewrites hex colors to `rgb()`), so
		// `chip.style.padding`/`.margin` read back empty here even though a real browser renders the
		// capped value. Assert on the wiring instead — `capBoxSides` gets the row's raw padding/margin
		// and the chip's cap — while `capBoxSides`'s own capping math is covered by `preview.test.js`.
		expect(capBoxSides).toHaveBeenCalledWith(preview.padding, '2rem');
		expect(capBoxSides).toHaveBeenCalledWith(preview.margin, '2rem');
	});

	/**
	 * AC5a: while the pointer is over the chip it swaps to the resolved hover styles, and a hover
	 * property the preset leaves unset keeps its resting value; leaving restores the resting state.
	 */
	it('swaps to hover styles under the pointer and back off it', () => {
		const chip = mountChip({ id: 'primary', label: 'Primary', preview });

		act(() => {
			chip.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
		});

		expect(chip.style.background).toBe('rgb(255, 255, 255)');
		expect(chip.style.color).toBe('rgb(54, 51, 225)');
		// Unset hover values keep the resting style.
		expect(chip.style.borderStyle).toBe('dashed');
		expect(chip.style.borderRadius).toBe('0.5rem');

		act(() => {
			chip.dispatchEvent(new MouseEvent('mouseout', { bubbles: true }));
		});

		expect(chip.style.background).toBe('rgb(54, 51, 225)');
		expect(chip.style.color).toBe('rgb(255, 255, 255)');
	});

	/**
	 * AC5b: `showHoverState` holds the hover styles with no pointer involved — the screen sets it
	 * for the row whose panel is on the Hover tab.
	 */
	it('holds the hover state when the row carries showHoverState', () => {
		const chip = mountChip({ id: 'primary', label: 'Primary', preview, showHoverState: true });

		expect(chip.style.background).toBe('rgb(255, 255, 255)');
		expect(chip.style.color).toBe('rgb(54, 51, 225)');
	});

	/**
	 * AC3: an unresolved value renders the property absent rather than an invented fallback, so
	 * the stylesheet's own chip defaults stay in charge.
	 */
	it('drops every unresolved style', () => {
		const chip = mountChip({
			id: 'primary',
			label: 'Primary',
			preview: {
				background: '',
				color: '',
				borderRadius: '',
				borderWidth: '',
				borderStyle: '',
				borderColor: '',
				shadow: '',
				padding: '',
				margin: '',
				hover: preview.hover,
			},
		});

		expect(chip.getAttribute('style')).toBeFalsy();
	});
});
