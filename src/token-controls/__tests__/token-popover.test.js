/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { TokenPopover } from '../molecules/TokenPopover';

// `jest.config.js` maps `@wordpress/components` to the copy nested under
// `@kadence/components/node_modules`, which resolves its own `react` — a different module instance
// than the top-level `react-dom/client` this test renders with, which trips React's "Invalid hook
// call" guard. Stand-ins sidestep that; this test only needs the tab panel structure.
jest.mock('@wordpress/components', () => ({
	// `isPressed` is dropped rather than spread: it is a `Button`-only prop, and passing it straight
	// through to a DOM `<button>` trips React's "unrecognized DOM attribute" warning under
	// `@wordpress/jest-console`'s strict console assertions.
	Button: ({ children, isPressed, ...props }) => <button {...props}>{children}</button>,
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
	RangeControl: ({ label }) => <div>{label}</div>,
	SelectControl: ({ label }) => <div>{label}</div>,
	TabPanel: ({ children, tabs, initialTabName }) => {
		const initialTab = tabs.find((tab) => tab.name === initialTabName) || tabs[0];
		return <div data-testid="tab-panel">{children(initialTab)}</div>;
	},
	__experimentalNumberControl: ({ label }) => <div>{label}</div>,
}));

jest.mock('@wordpress/icons', () => ({ globe: 'globe', settings: 'settings', undo: 'undo' }));
jest.mock('@wordpress/i18n', () => ({
	__: (text) => text,
	sprintf: (format, ...args) => format.replace(/%s/g, () => args.shift()),
}));

jest.mock('../styles/token-controls.scss', () => ({}), { virtual: true });

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
 * Render TokenPopover with the given props.
 *
 * @param {Object} props The component props.
 *
 * @since TBD
 *
 * @return {void}
 */
function render(props = {}) {
	act(() =>
		root.render(
			createElement(TokenPopover, {
				value: '',
				tokens: [],
				resolvedDefault: '',
				inherited: false,
				initialTab: 'custom',
				custom: { number: '', onNumber: jest.fn() },
				onPick: jest.fn(),
				onClear: jest.fn(),
				onClose: jest.fn(),
				...props,
			})
		)
	);
}

describe('TokenPopover renderCustom prop', () => {
	/**
	 * When renderCustom is absent, the default CustomTab renders with the custom props.
	 *
	 * @return {void}
	 */
	it('renders the default CustomTab when renderCustom is absent', () => {
		const onNumber = jest.fn();
		render({
			custom: { number: '', onNumber },
			renderCustom: undefined,
		});

		// The CustomTab renders a NumberControl with the label "Custom value"
		expect(container.textContent).toContain('Custom value');
	});

	/**
	 * When renderCustom is provided, it is called with the custom object and its output renders
	 * instead of the default CustomTab.
	 *
	 * @return {void}
	 */
	it('renders renderCustom output instead of CustomTab when provided', () => {
		const renderCustom = jest.fn((custom) => createElement('div', { 'data-testid': 'custom-body' }, custom.marker));
		render({
			custom: { marker: 'shadow-editor', onNumber: jest.fn() },
			renderCustom,
		});

		expect(renderCustom).toHaveBeenCalledWith({ marker: 'shadow-editor', onNumber: expect.any(Function) });
		expect(container.querySelector('[data-testid="custom-body"]')).not.toBeNull();
		expect(container.querySelector('[data-testid="custom-body"]').textContent).toBe('shadow-editor');
	});

	/**
	 * Verify that renderCustom is not called when it is absent.
	 *
	 * @return {void}
	 */
	it('does not call renderCustom when it is not provided', () => {
		const renderCustom = jest.fn();
		render({
			renderCustom: undefined,
		});

		expect(renderCustom).not.toHaveBeenCalled();
	});
});

describe('TokenPopover renderList prop', () => {
	/**
	 * When `renderList` is absent — every consumer besides `ColorControl` today — the default
	 * `StyleLibraryTab` renders exactly as before. This is the regression check that the additive
	 * prop leaves existing consumers unchanged.
	 *
	 * @return {void}
	 */
	it('renders the default StyleLibraryTab when renderList is absent', () => {
		const tokens = [{ id: 'md', label: 'Medium', value: '8px', alias: '{primitive.radius.md}' }];

		render({ initialTab: 'style-library', tokens, renderList: undefined });

		expect(container.querySelector('.kadence-token-field__list')).not.toBeNull();
		expect(container.querySelector('.kadence-token-field__item-label').textContent).toBe('Medium');
	});

	/**
	 * When `renderList` is provided, it is called with `{ value, tokens, onPick, onClose }` and its
	 * output renders instead of the default `StyleLibraryTab` — `ColorControl`'s grouped
	 * `ColorGroupList` is the intended consumer.
	 *
	 * @return {void}
	 */
	it('renders renderList output instead of StyleLibraryTab when provided, called with value/tokens/onPick/onClose', () => {
		const onPick = jest.fn();
		const onClose = jest.fn();
		const tokens = [{ id: 'md', label: 'Medium', value: '8px', alias: '{primitive.radius.md}' }];
		const renderList = jest.fn(({ onPick: pick, onClose: close }) =>
			createElement(
				'button',
				{ 'data-testid': 'grouped-list', onClick: () => (pick('{primitive.radius.md}'), close()) },
				'grouped'
			)
		);

		render({ initialTab: 'style-library', value: '{primitive.radius.md}', tokens, onPick, onClose, renderList });

		expect(renderList).toHaveBeenCalledWith({
			value: '{primitive.radius.md}',
			tokens,
			onPick: expect.any(Function),
			onClose: expect.any(Function),
		});
		expect(container.querySelector('.kadence-token-field__list')).toBeNull();

		const button = container.querySelector('[data-testid="grouped-list"]');
		expect(button).not.toBeNull();

		act(() => button.dispatchEvent(new MouseEvent('click', { bubbles: true })));
		expect(onPick).toHaveBeenCalledWith('{primitive.radius.md}');
		expect(onClose).toHaveBeenCalled();
	});
});

describe('TokenPopover showValue prop', () => {
	/**
	 * When `showValue` is omitted — every consumer besides `BoxShadowControl` today — each token row
	 * still shows its resolved value beside its label. This is the regression check that the additive
	 * prop leaves existing consumers unchanged.
	 *
	 * @return {void}
	 */
	it("shows each row's value by default", () => {
		const tokens = [{ id: 'md', label: 'Medium', value: '8px', alias: '{primitive.radius.md}' }];

		render({ initialTab: 'style-library', tokens });

		expect(container.querySelector('.kadence-token-field__item-value').textContent).toBe('8px');
	});

	/**
	 * With `showValue={false}` — `BoxShadowControl`'s own usage — no row renders its resolved value,
	 * only its label.
	 *
	 * @return {void}
	 */
	it("hides every row's value when showValue is false", () => {
		const tokens = [{ id: 'md', label: 'Medium', value: '0px 2px 8px #000', alias: '{primitive.shadow.md}' }];

		render({ initialTab: 'style-library', tokens, showValue: false });

		expect(container.querySelector('.kadence-token-field__item-value')).toBeNull();
		expect(container.querySelector('.kadence-token-field__item-label').textContent).toBe('Medium');
	});
});

describe('TokenPopover renderPreview prop', () => {
	/**
	 * When `renderPreview` is absent — every consumer besides `BoxShadowControl` today, including
	 * radius/spacing/border — no extra preview markup renders on the Style Library tab. This is the
	 * regression check that the additive prop leaves existing consumers unchanged.
	 *
	 * @return {void}
	 */
	it('renders no preview slot when renderPreview is omitted', () => {
		render({ initialTab: 'style-library', tokens: [], renderPreview: undefined });

		expect(container.querySelector('.kadence-token-field__preview')).toBeNull();
	});

	/**
	 * When `renderPreview` is provided, its output renders inside `.kadence-token-field__preview`,
	 * above the `Reset` button, on the Style Library tab.
	 *
	 * @return {void}
	 */
	it('renders renderPreview output above Reset when provided', () => {
		const renderPreview = () => createElement('div', { 'data-testid': 'preview-square' });

		render({ initialTab: 'style-library', tokens: [], renderPreview });

		const list = container.querySelector('.kadence-token-field__list');
		const preview = list.querySelector('.kadence-token-field__preview');
		const reset = list.querySelector('.kadence-token-field__reset');

		expect(preview).not.toBeNull();
		expect(preview.querySelector('[data-testid="preview-square"]')).not.toBeNull();

		const children = Array.from(list.children);
		expect(children.indexOf(preview)).toBeLessThan(children.indexOf(reset));
	});

	/**
	 * `renderPreview` is called with the current slot value and the pickable-token list, so a caller
	 * can resolve either shape (an alias or a literal) into a preview.
	 *
	 * @return {void}
	 */
	it('calls renderPreview with the current value and token list', () => {
		const renderPreview = jest.fn(() => null);
		// An empty pickable list avoids rendering a token row: the mocked `Button` passes `isPressed`
		// straight through to a DOM `<button>`, which React warns about for an unknown DOM attribute —
		// a pre-existing quirk of this test file's stand-in, unrelated to what this assertion checks.
		const tokens = [];

		render({ initialTab: 'style-library', value: '{primitive.shadow.md}', tokens, renderPreview });

		expect(renderPreview).toHaveBeenCalledWith({ value: '{primitive.shadow.md}', tokens, hoveredEntry: null });
	});

	/**
	 * With nothing hovered or focused yet, `renderPreview` receives `hoveredEntry: null` so the
	 * caller falls back to the bound value — the regression check for the pre-hover state.
	 *
	 * @return {void}
	 */
	it('calls renderPreview with a null hoveredEntry before any row is hovered or focused', () => {
		const renderPreview = jest.fn(() => null);
		// An empty pickable list avoids rendering a token row, sidestepping the same mocked-`Button`
		// `isPressed`-on-DOM quirk noted above.
		const tokens = [];

		render({ initialTab: 'style-library', tokens, renderPreview });

		expect(renderPreview).toHaveBeenLastCalledWith({ value: '', tokens, hoveredEntry: null });
	});

	/**
	 * Hovering a token row (mouse enter) passes that entry to `renderPreview` as `{ kind: 'token',
	 * entry }`; leaving it (mouse leave) falls back to `hoveredEntry: null` again.
	 *
	 * @return {void}
	 */
	it('updates hoveredEntry to the token row on mouse enter, and back to null on mouse leave', () => {
		const renderPreview = jest.fn(() => null);
		const entry = { id: 'md', label: 'Medium', value: '0px 2px 8px #000', alias: '{primitive.shadow.md}' };

		render({ initialTab: 'style-library', tokens: [entry], renderPreview });

		const item = container.querySelector('.kadence-token-field__item');

		act(() => item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
		expect(renderPreview).toHaveBeenLastCalledWith({
			value: '',
			tokens: [entry],
			hoveredEntry: { kind: 'token', entry },
		});

		act(() => item.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })));
		expect(renderPreview).toHaveBeenLastCalledWith({ value: '', tokens: [entry], hoveredEntry: null });
	});

	/**
	 * Focusing a token row (keyboard navigation) previews it exactly like a mouse hover does, and
	 * blurring it falls back to `hoveredEntry: null` — so tabbing through the list, not only
	 * pointing at it, drives the live preview.
	 *
	 * @return {void}
	 */
	it('updates hoveredEntry to the token row on focus, and back to null on blur', () => {
		const renderPreview = jest.fn(() => null);
		const entry = { id: 'md', label: 'Medium', value: '0px 2px 8px #000', alias: '{primitive.shadow.md}' };

		render({ initialTab: 'style-library', tokens: [entry], renderPreview });

		const item = container.querySelector('.kadence-token-field__item');

		act(() => item.dispatchEvent(new window.FocusEvent('focusin', { bubbles: true })));
		expect(renderPreview).toHaveBeenLastCalledWith({
			value: '',
			tokens: [entry],
			hoveredEntry: { kind: 'token', entry },
		});

		act(() => item.dispatchEvent(new window.FocusEvent('focusout', { bubbles: true })));
		expect(renderPreview).toHaveBeenLastCalledWith({ value: '', tokens: [entry], hoveredEntry: null });
	});

	/**
	 * Hovering the `Reset` row previews the cleared state as `{ kind: 'reset' }`, distinct from a
	 * token-row hover, so a caller can render what the field looks like once cleared.
	 *
	 * @return {void}
	 */
	it('updates hoveredEntry to the reset kind on hovering the Reset row', () => {
		const renderPreview = jest.fn(() => null);
		const tokens = [{ id: 'md', label: 'Medium', value: '0px 2px 8px #000', alias: '{primitive.shadow.md}' }];

		render({ initialTab: 'style-library', value: '{primitive.shadow.md}', tokens, renderPreview });

		const reset = container.querySelector('.kadence-token-field__reset');

		act(() => reset.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
		expect(renderPreview).toHaveBeenLastCalledWith({
			value: '{primitive.shadow.md}',
			tokens,
			hoveredEntry: { kind: 'reset' },
		});

		act(() => reset.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })));
		expect(renderPreview).toHaveBeenLastCalledWith({
			value: '{primitive.shadow.md}',
			tokens,
			hoveredEntry: null,
		});
	});
});
