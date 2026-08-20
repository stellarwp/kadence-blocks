/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { BorderControl } from '../controls/BorderControl';

// `jest.config.js` maps `@wordpress/components` to the copy nested under
// `@kadence/components/node_modules`, which resolves its own `react` — a different module instance
// than the top-level `react-dom/client` this test renders with, which trips React's "Invalid hook
// call" guard. Stand-ins sidestep that; these tests only need the link toggle and a plain select.
jest.mock('@wordpress/components', () => ({
	Button: ({ children, icon, showTooltip, isSmall, isPressed, ...props }) => <button {...props}>{children}</button>,
	ButtonGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
	Dashicon: (props) => <span {...props} />,
	Tooltip: ({ children }) => children,
	SelectControl: ({ label, hideLabelFromVision, options, value, onChange, disabled, ...props }) => (
		<select
			aria-label={label}
			value={value}
			disabled={disabled}
			onChange={(event) => onChange(event.target.value)}
			{...props}
		>
			{options.map((option) => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	),
}));

jest.mock('@wordpress/icons', () => ({ undo: 'undo', link: 'link', linkOff: 'linkOff' }));

// `TokenSelector` opens a real popover through `@wordpress/components`' `Dropdown`, which is out of
// scope for these tests — they exercise `BorderControl`'s own width-axis wiring, not the picker
// `TokenSelector` already has coverage for. The stand-in exposes `onPick`/`onClear`/`onCustom`
// directly as buttons so a click can trigger each without driving the popover open first.
jest.mock('../organisms/TokenSelector', () => ({
	TokenSelector: ({ value, disabled, onPick, onClear, onCustom }) => (
		<div className="stub-token-selector" data-value={value ?? ''}>
			<button
				className="stub-pick"
				disabled={disabled}
				onClick={() => onPick('primitive.dimension.border-width.md')}
			>
				pick
			</button>
			<button className="stub-clear" disabled={disabled} onClick={() => onClear()}>
				clear
			</button>
			<button className="stub-custom" disabled={disabled} onClick={() => onCustom('2px')}>
				custom
			</button>
		</div>
	),
}));

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Render `BorderControl` with the props it needs, plus overrides.
 *
 * @param {Object} props Overrides for the defaults below.
 *
 * @since TBD
 *
 * @return {HTMLElement} The container it rendered into.
 */
function renderControl(props = {}) {
	act(() =>
		root.render(
			createElement(BorderControl, {
				value: { width: '', style: 'none', color: '' },
				onChange: jest.fn(),
				label: 'Border',
				...props,
			})
		)
	);

	return container;
}

const widthSelectors = () => container.querySelectorAll('.stub-token-selector');
const styleSelects = () => container.querySelectorAll('select[aria-label="Border style"]');
const linkToggle = () => container.querySelector('.kadence-control-toggle');

/**
 * Click a rendered DOM element inside `act`, so React flushes the resulting state/prop updates
 * before the next assertion reads them.
 *
 * @param {HTMLElement} element The element to click.
 *
 * @since TBD
 *
 * @return {void}
 */
function click(element) {
	act(() => element.click());
}

describe('BorderControl slot rendering', () => {
	/**
	 * The default, all-scalar value is linked, so only one width/style pair renders.
	 *
	 * @return {void}
	 */
	it('renders one width TokenSelector and one style SelectControl when value is all-scalar', () => {
		renderControl();

		expect(widthSelectors()).toHaveLength(1);
		expect(styleSelects()).toHaveLength(1);
	});

	/**
	 * A 4-list on either axis means the control is unlinked, regardless of which axis carries it.
	 *
	 * @return {void}
	 */
	it('renders four of each when width is a 4-list', () => {
		renderControl({
			value: { width: ['a', 'b', 'c', 'd'], style: 'solid', color: '' },
		});

		expect(widthSelectors()).toHaveLength(4);
		expect(styleSelects()).toHaveLength(4);
	});

	/**
	 * Same as above, reached through the style axis instead of width.
	 *
	 * @return {void}
	 */
	it('renders four of each when style is a 4-list', () => {
		renderControl({
			value: {
				width: 'primitive.dimension.border-width.md',
				style: ['solid', 'dashed', 'solid', 'solid'],
				color: '',
			},
		});

		expect(widthSelectors()).toHaveLength(4);
		expect(styleSelects()).toHaveLength(4);
	});
});

describe('BorderControl width and style writes', () => {
	/**
	 * Picking a width token while linked writes the scalar directly to `width` and leaves
	 * `style`/`color` untouched.
	 *
	 * @return {void}
	 */
	it('calls onChange with only width changed when picking a width token', () => {
		const onChange = jest.fn();
		renderControl({
			value: { width: '', style: 'solid', color: 'semantic.color.border' },
			onChange,
		});

		click(widthSelectors()[0].querySelector('.stub-pick'));

		expect(onChange).toHaveBeenCalledWith({
			width: 'primitive.dimension.border-width.md',
			style: 'solid',
			color: 'semantic.color.border',
		});
	});

	/**
	 * Changing the style select while linked writes the scalar directly to `style` and leaves
	 * `width`/`color` untouched.
	 *
	 * @return {void}
	 */
	it('calls onChange with only style changed when changing the style select', () => {
		const onChange = jest.fn();
		renderControl({
			value: { width: 'primitive.dimension.border-width.sm', style: 'none', color: 'semantic.color.border' },
			onChange,
		});

		act(() => {
			const select = styleSelects()[0];
			select.value = 'dashed';
			select.dispatchEvent(new Event('change', { bubbles: true }));
		});

		expect(onChange).toHaveBeenCalledWith({
			width: 'primitive.dimension.border-width.sm',
			style: 'dashed',
			color: 'semantic.color.border',
		});
	});

	/**
	 * Writing one slot of an unlinked width axis updates only that position, leaving the other
	 * three and the style axis untouched.
	 *
	 * @return {void}
	 */
	it('writes only the touched slot when unlinked', () => {
		const onChange = jest.fn();
		renderControl({
			value: { width: ['a', 'b', 'c', 'd'], style: 'solid', color: '' },
			onChange,
		});

		click(widthSelectors()[2].querySelector('.stub-pick'));

		expect(onChange).toHaveBeenCalledWith({
			width: ['a', 'b', 'primitive.dimension.border-width.md', 'd'],
			style: 'solid',
			color: '',
		});
	});
});

describe('BorderControl link toggle (uncontrolled)', () => {
	/**
	 * Toggling while linked promotes both width and style to 4-lists via `toSlotList`, and does
	 * not touch color.
	 *
	 * @return {void}
	 */
	it('promotes width and style to 4-lists when toggled while linked', () => {
		const onChange = jest.fn();
		renderControl({
			value: { width: 'primitive.dimension.border-width.sm', style: 'dashed', color: 'semantic.color.border' },
			onChange,
		});

		click(linkToggle());

		expect(onChange).toHaveBeenCalledWith({
			width: [
				'primitive.dimension.border-width.sm',
				'primitive.dimension.border-width.sm',
				'primitive.dimension.border-width.sm',
				'primitive.dimension.border-width.sm',
			],
			style: ['dashed', 'dashed', 'dashed', 'dashed'],
			color: 'semantic.color.border',
		});
	});

	/**
	 * Toggling while unlinked collapses both axes back to slot 0's value, and does not touch
	 * color, even when the four slots differ.
	 *
	 * @return {void}
	 */
	it('collapses width and style to slot 0 when toggled while unlinked', () => {
		const onChange = jest.fn();
		renderControl({
			value: {
				width: ['a', 'b', 'c', 'd'],
				style: ['solid', 'dashed', 'dotted', 'double'],
				color: 'semantic.color.border',
			},
			onChange,
		});

		click(linkToggle());

		expect(onChange).toHaveBeenCalledWith({
			width: 'a',
			style: 'solid',
			color: 'semantic.color.border',
		});
	});
});

describe('BorderControl link toggle (controlled)', () => {
	/**
	 * With `onToggleLink` supplied, clicking the link toggle calls it instead of computing and
	 * writing a new value directly.
	 *
	 * @return {void}
	 */
	it('calls onToggleLink instead of mutating value directly', () => {
		const onChange = jest.fn();
		const onToggleLink = jest.fn();
		renderControl({
			value: { width: '', style: 'none', color: '' },
			onChange,
			isLinked: true,
			onToggleLink,
		});

		click(linkToggle());

		expect(onToggleLink).toHaveBeenCalledTimes(1);
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe('BorderControl color', () => {
	/**
	 * `renderColor` receives the current color value and a `onChange` that patches only `color`
	 * on the outer value.
	 *
	 * @return {void}
	 */
	it('calls renderColor with the color value and patches only color on change', () => {
		const onChange = jest.fn();
		let received;
		renderControl({
			value: { width: '', style: 'none', color: 'semantic.color.border' },
			onChange,
			renderColor: (props) => {
				received = props;
				return null;
			},
		});

		expect(received.value).toBe('semantic.color.border');

		received.onChange('semantic.color.accent');

		expect(onChange).toHaveBeenCalledWith({
			width: '',
			style: 'none',
			color: 'semantic.color.accent',
		});
	});

	/**
	 * Without `renderColor`, nothing color-related renders and nothing throws.
	 *
	 * @return {void}
	 */
	it('renders nothing and does not throw without renderColor', () => {
		expect(() => renderControl({ renderColor: undefined })).not.toThrow();
	});
});

describe('BorderControl disabled', () => {
	/**
	 * Every sub-field — the width stand-in's buttons and the style select — is disabled, and
	 * clicking/changing them fires no `onChange`.
	 *
	 * @return {void}
	 */
	it('disables every field and fires no onChange from a disabled sub-field', () => {
		const onChange = jest.fn();
		renderControl({
			value: { width: '', style: 'none', color: '' },
			onChange,
			disabled: true,
		});

		const selector = widthSelectors()[0];

		expect(selector.querySelector('.stub-pick').disabled).toBe(true);
		expect(selector.querySelector('.stub-clear').disabled).toBe(true);
		expect(selector.querySelector('.stub-custom').disabled).toBe(true);
		expect(styleSelects()[0].disabled).toBe(true);

		click(selector.querySelector('.stub-pick'));
		click(selector.querySelector('.stub-clear'));
		click(selector.querySelector('.stub-custom'));

		expect(onChange).not.toHaveBeenCalled();
	});
});
