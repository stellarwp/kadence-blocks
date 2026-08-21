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
// call" guard. Stand-ins sidestep that; these tests only need the link toggle and the style picker's
// `Dropdown`/`MenuGroup`/`MenuItem`/`NavigableMenu` shells.
//
// `Dropdown` keeps real open/closed state (via its own `useState`, from this same file's already-safe
// top-level `react` import) rather than always rendering its content like `box-shadow-control.test.js`'s
// stand-in does, because `BorderControl`'s style picker specifically needs "closed until clicked" and
// "closes after picking" to be real, observable behavior for the tests below — not something a
// permanently-open mock could exercise. `NavigableMenu` only forwards `role="menu"` — the actual
// arrow-key roving focus that role wires up in production comes from WordPress's own
// `NavigableContainer` (see `BorderStyleSelect.js`'s docblock), which this mock necessarily bypasses
// along with the rest of `@wordpress/components`; the tests below can only verify the structural wiring
// (a real `role="menu"` container holding real, focusable `role="menuitemradio"` buttons), not simulate
// the roving focus itself.
jest.mock('@wordpress/components', () => {
	const { useState } = require('react');

	return {
		Button: ({ children, icon, showTooltip, isSmall, isPressed, ...props }) => (
			<button {...props}>{children}</button>
		),
		ButtonGroup: ({ children, ...props }) => <div {...props}>{children}</div>,
		Dashicon: (props) => <span {...props} />,
		Tooltip: ({ children }) => children,
		Dropdown: ({ className, contentClassName, renderToggle, renderContent }) => {
			const [isOpen, setIsOpen] = useState(false);

			return (
				<div className={className}>
					{renderToggle({ isOpen, onToggle: () => setIsOpen((open) => !open) })}
					{isOpen && (
						<div className={contentClassName}>{renderContent({ onClose: () => setIsOpen(false) })}</div>
					)}
				</div>
			);
		},
		MenuGroup: ({ children }) => <div role="group">{children}</div>,
		NavigableMenu: ({ children, role }) => <div role={role}>{children}</div>,
		MenuItem: ({ children, role, suffix, onClick, ...props }) => (
			<button role={role} onClick={onClick} {...props}>
				{children}
				{suffix}
			</button>
		),
	};
});

jest.mock('@wordpress/icons', () => ({
	undo: 'undo',
	link: 'link',
	linkOff: 'linkOff',
	check: 'check',
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
}));

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
// One per row, whether linked (one, generically labeled "Border style") or unlinked (four, each
// side-named — "Border style (top)", etc.).
const styleTriggers = () => container.querySelectorAll('.kb-border-control__style-trigger');
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

/**
 * Open a row's style picker and pick the option matching `styleValue`, driving the mocked
 * `Dropdown`/`MenuGroup`/`MenuItem` exactly as a user would: click the trigger to open the menu,
 * then click the option whose rule carries that style's modifier class.
 *
 * @param {HTMLElement} trigger    The row's `.kb-border-control__style-trigger` button.
 * @param {string}      styleValue The style keyword to pick — matches `STYLES`' `value` and the
 *                                 option's `kb-border-control__style-preview-rule--{styleValue}`
 *                                 modifier class.
 *
 * @since TBD
 *
 * @return {void}
 */
function pickStyle(trigger, styleValue) {
	click(trigger);

	const option = trigger
		.closest('.kb-border-control__style-preview')
		.querySelector(`.kb-border-control__style-preview-rule--${styleValue}`)
		.closest('[role="menuitemradio"]');

	click(option);
}

describe('BorderControl slot rendering', () => {
	/**
	 * The default, all-scalar value is linked, so only one width/style pair renders.
	 *
	 * @return {void}
	 */
	it('renders one width TokenSelector and one style trigger when value is all-scalar', () => {
		renderControl();

		expect(widthSelectors()).toHaveLength(1);
		expect(styleTriggers()).toHaveLength(1);
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
		expect(styleTriggers()).toHaveLength(4);
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
		expect(styleTriggers()).toHaveLength(4);
	});

	/**
	 * A 4-list on `color` alone — width and style both still scalar — also means the control is
	 * unlinked. `color` can diverge on its own through a caller's `renderColor` writing per row
	 * (via `applyToAxis`), so deriving `linked` from width/style only would render this value as
	 * linked and read just slot 0 of `color`, hiding the other three sides' colors.
	 *
	 * @return {void}
	 */
	it('renders four of each when color is a 4-list, even with scalar width and style', () => {
		renderControl({
			value: {
				width: 'primitive.dimension.border-width.md',
				style: 'solid',
				color: ['red', 'green', 'blue', 'yellow'],
			},
		});

		expect(widthSelectors()).toHaveLength(4);
		expect(styleTriggers()).toHaveLength(4);
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
	 * Picking a style option while linked writes the scalar directly to `style` and leaves
	 * `width`/`color` untouched.
	 *
	 * @return {void}
	 */
	it('calls onChange with only style changed when picking a style option', () => {
		const onChange = jest.fn();
		renderControl({
			value: { width: 'primitive.dimension.border-width.sm', style: 'none', color: 'semantic.color.border' },
			onChange,
		});

		pickStyle(styleTriggers()[0], 'dashed');

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
	 * Toggling while unlinked collapses all three axes back to slot 0's value — a scalar color
	 * folds to itself, a no-op.
	 *
	 * @return {void}
	 */
	it('collapses width, style, and color to slot 0 when toggled while unlinked', () => {
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

	/**
	 * A `color` axis a caller's `renderColor` widened into a four-slot list (via `applyToAxis`,
	 * exactly as `width`/`style` already can be) folds back to slot 0 on relink too, rather than
	 * staying a stale four-element list underneath a linked view that only ever reads slot 0.
	 *
	 * @return {void}
	 */
	it('folds a list-shaped color to slot 0 when toggled while unlinked', () => {
		const onChange = jest.fn();
		renderControl({
			value: {
				width: ['a', 'b', 'c', 'd'],
				style: ['solid', 'dashed', 'dotted', 'double'],
				color: ['red', 'green', 'blue', 'yellow'],
			},
			onChange,
		});

		click(linkToggle());

		expect(onChange).toHaveBeenCalledWith({
			width: 'a',
			style: 'solid',
			color: 'red',
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
	 * Every sub-field — the width stand-in's buttons and the style trigger — is disabled, and
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
		expect(styleTriggers()[0].disabled).toBe(true);

		click(selector.querySelector('.stub-pick'));
		click(selector.querySelector('.stub-clear'));
		click(selector.querySelector('.stub-custom'));

		expect(onChange).not.toHaveBeenCalled();
	});

	/**
	 * `renderColor`'s `onChange` is a write path `BorderControl` doesn't render a disabled
	 * attribute on (the caller owns that field), so it needs its own `disabled` guard — otherwise
	 * a disabled control could still mutate color.
	 *
	 * @return {void}
	 */
	it('fires no onChange from renderColor while disabled', () => {
		const onChange = jest.fn();
		let received;
		renderControl({
			value: { width: '', style: 'none', color: 'semantic.color.border' },
			onChange,
			disabled: true,
			renderColor: (props) => {
				received = props;
				return null;
			},
		});

		received.onChange('semantic.color.accent');

		expect(onChange).not.toHaveBeenCalled();
	});

	/**
	 * `renderColor` receives the control's own `disabled` state, so a caller's color field can
	 * disable itself the same way the width/style fields do rather than staying interactive while
	 * every write it makes is silently discarded.
	 *
	 * @return {void}
	 */
	it('passes disabled through to renderColor', () => {
		let received;
		renderControl({
			value: { width: '', style: 'none', color: 'semantic.color.border' },
			disabled: true,
			renderColor: (props) => {
				received = props;
				return null;
			},
		});

		expect(received.disabled).toBe(true);
	});
});

describe('BorderControl row anatomy', () => {
	/**
	 * The linked row bundles the swatch, style preview, and width field into one control box.
	 *
	 * @return {void}
	 */
	it('renders one control box containing the swatch, style preview, and width field when linked', () => {
		renderControl({
			value: { width: '', style: 'solid', color: 'semantic.color.border' },
			renderColor: ({ value }) => <span className="stub-swatch" data-value={value ?? ''} />,
		});

		const boxes = container.querySelectorAll('.kb-border-control__box');
		expect(boxes).toHaveLength(1);

		const box = boxes[0];
		expect(box.querySelector('.kb-border-control__swatch .stub-swatch')).not.toBeNull();
		expect(box.querySelector('.kb-border-control__style-preview')).not.toBeNull();
		expect(box.querySelector('.stub-token-selector')).not.toBeNull();
	});

	/**
	 * Unlinked mode renders one control box per side, each with its own swatch/style-preview/width
	 * triple.
	 *
	 * @return {void}
	 */
	it('renders four control boxes, each with a swatch and style preview, when unlinked', () => {
		renderControl({
			value: { width: ['a', 'b', 'c', 'd'], style: 'solid', color: '' },
			renderColor: ({ value }) => <span className="stub-swatch" data-value={value ?? ''} />,
		});

		expect(container.querySelectorAll('.kb-border-control__box')).toHaveLength(4);
		expect(container.querySelectorAll('.kb-border-control__swatch')).toHaveLength(4);
		expect(container.querySelectorAll('.kb-border-control__style-preview')).toHaveLength(4);
		expect(container.querySelectorAll('.kb-border-control__box .stub-token-selector')).toHaveLength(4);
	});

	/**
	 * The style preview's rule carries a modifier class naming the side's current style, and the
	 * style picker's own trigger sits inside the preview box rather than as a separate field.
	 *
	 * @return {void}
	 */
	it('marks the style preview with the current style and keeps the picker trigger inside it', () => {
		renderControl({ value: { width: '', style: 'dashed', color: '' } });

		const preview = container.querySelector('.kb-border-control__style-preview');

		expect(preview.querySelector('.kb-border-control__style-preview-rule--dashed')).not.toBeNull();
		expect(preview.querySelector('.kb-border-control__style-trigger')).not.toBeNull();
	});

	/**
	 * `none` hides the preview's rule rather than drawing a muted line.
	 *
	 * @return {void}
	 */
	it('hides the style preview rule when style is none', () => {
		renderControl({ value: { width: '', style: 'none', color: '' } });

		const rule = container.querySelector('.kb-border-control__style-preview-rule');

		expect(rule.classList.contains('kb-border-control__style-preview-rule--none')).toBe(true);
	});

	/**
	 * `renderColor` is called once per row with that row's own color value, and its `onChange`
	 * writes back through the same axis the width/style fields already use — a linked write stays a
	 * scalar, an unlinked write touches only that row's slot.
	 *
	 * @return {void}
	 */
	it('calls renderColor once per row and writes the touched slot when unlinked', () => {
		const onChange = jest.fn();
		renderControl({
			value: { width: ['a', 'b', 'c', 'd'], style: 'solid', color: 'semantic.color.border' },
			onChange,
			renderColor: ({ value, onChange: onColorChange }) => (
				<button
					className="stub-color-write"
					data-value={value ?? ''}
					onClick={() => onColorChange('semantic.color.accent')}
				>
					swatch
				</button>
			),
		});

		const swatches = container.querySelectorAll('.stub-color-write');
		expect(swatches).toHaveLength(4);
		expect(Array.from(swatches).every((el) => el.dataset.value === 'semantic.color.border')).toBe(true);

		click(swatches[2]);

		expect(onChange).toHaveBeenCalledWith({
			width: ['a', 'b', 'c', 'd'],
			style: 'solid',
			color: ['semantic.color.border', 'semantic.color.border', 'semantic.color.accent', 'semantic.color.border'],
		});
	});

	/**
	 * `renderColor` receives the row's own bare side name as `label`, `null` while linked — so an
	 * unlinked caller can give each of the four swatches its own accessible name, the way the width
	 * field's per-slot icon and the style select's own `styleLabel` already do.
	 *
	 * @return {void}
	 */
	it('passes the row side name as label, null while linked', () => {
		const receivedLinked = [];
		renderControl({
			renderColor: (props) => {
				receivedLinked.push(props.label);
				return null;
			},
		});
		expect(receivedLinked).toEqual([null]);

		const receivedUnlinked = [];
		renderControl({
			value: { width: ['a', 'b', 'c', 'd'], style: 'solid', color: '' },
			renderColor: (props) => {
				receivedUnlinked.push(props.label);
				return null;
			},
		});
		expect(receivedUnlinked).toEqual(['top', 'right', 'bottom', 'left']);
	});
});

describe('BorderControl style picker', () => {
	/**
	 * The menu does not exist in the DOM until the trigger opens it — clicking anywhere on the
	 * preview box before that has nothing to click into.
	 *
	 * @return {void}
	 */
	it('does not render the style menu until the trigger is clicked', () => {
		renderControl();

		expect(container.querySelector('.kb-border-control__style-menu')).toBeNull();

		click(styleTriggers()[0]);

		expect(container.querySelector('.kb-border-control__style-menu')).not.toBeNull();
	});

	/**
	 * All five curated styles are listed, each as its own focusable option showing its own rule —
	 * not plain text, which is the whole reason this isn't a native `<select>`.
	 *
	 * @return {void}
	 */
	it('lists all five style options, each with its own rule', () => {
		renderControl();

		click(styleTriggers()[0]);

		const options = container.querySelectorAll('.kb-border-control__style-menu [role="menuitemradio"]');
		expect(options).toHaveLength(5);

		['none', 'solid', 'dashed', 'dotted', 'double'].forEach((styleValue) => {
			expect(
				container.querySelector(
					`.kb-border-control__style-menu .kb-border-control__style-preview-rule--${styleValue}`
				)
			).not.toBeNull();
		});
	});

	/**
	 * The options sit inside a real `role="menu"` container — the integration point WordPress's own
	 * `NavigableMenu`/`NavigableContainer` uses to wire up arrow-key roving focus between them in
	 * production. This file mocks `NavigableMenu` down to a plain `<div role="menu">` (see the
	 * `@wordpress/components` mock's docblock above) alongside the rest of `@wordpress/components`,
	 * so the actual roving-focus keyboard behavior — implemented entirely inside WordPress's own
	 * component, not this one — cannot be driven or re-verified from here; this asserts the
	 * structural wiring `BorderStyleSelect` is responsible for instead.
	 *
	 * @return {void}
	 */
	it('wraps the options in a role="menu" container for arrow-key navigation', () => {
		renderControl();

		click(styleTriggers()[0]);

		const menu = container.querySelector('.kb-border-control__style-menu [role="menu"]');
		expect(menu).not.toBeNull();
		expect(menu.querySelectorAll('[role="menuitemradio"]')).toHaveLength(5);
	});

	/**
	 * Picking an option calls `onChange` with that option's value and closes the menu — clicking an
	 * option is a complete pick-and-dismiss action, not just a write.
	 *
	 * @return {void}
	 */
	it('picking an option calls onChange and closes the menu', () => {
		const onChange = jest.fn();
		renderControl({ value: { width: '', style: 'solid', color: '' }, onChange });

		pickStyle(styleTriggers()[0], 'dotted');

		expect(onChange).toHaveBeenCalledWith({ width: '', style: 'dotted', color: '' });
		expect(container.querySelector('.kb-border-control__style-menu')).toBeNull();
	});

	/**
	 * The active option is marked `aria-checked`, matching the same `role="menuitemradio"` idiom
	 * `TokenColorSelectField` already uses for its own token list.
	 *
	 * @return {void}
	 */
	it('marks the current style option as checked', () => {
		renderControl({ value: { width: '', style: 'dotted', color: '' } });

		click(styleTriggers()[0]);

		const current = container
			.querySelector('.kb-border-control__style-menu .kb-border-control__style-preview-rule--dotted')
			.closest('[role="menuitemradio"]');

		expect(current.getAttribute('aria-checked')).toBe('true');
	});
});

describe('BorderControl style trigger accessible labels', () => {
	/**
	 * Linked mode has one style field standing for every side, so the generic label is accurate.
	 *
	 * @return {void}
	 */
	it('uses the generic label when linked', () => {
		renderControl();

		expect(styleTriggers()[0].getAttribute('aria-label')).toBe('Border style');
	});

	/**
	 * Unlinked mode has four independent style fields; each needs its own side name so a screen
	 * reader can tell them apart, matching the width field's per-slot icon.
	 *
	 * @return {void}
	 */
	it('names each side when unlinked', () => {
		renderControl({
			value: { width: ['', '', '', ''], style: ['none', 'none', 'none', 'none'], color: '' },
		});

		const labels = Array.from(styleTriggers()).map((trigger) => trigger.getAttribute('aria-label'));

		expect(labels).toEqual([
			'Border style (top)',
			'Border style (right)',
			'Border style (bottom)',
			'Border style (left)',
		]);
	});
});
