/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { BoxShadowControl } from '../controls/BoxShadowControl';

// `jest.config.js` maps `@wordpress/components` to the copy nested under
// `@kadence/components/node_modules`, which resolves its own `react` — a different module instance
// than the top-level `react-dom/client` this test renders with, which trips React's "Invalid hook
// call" guard. Stand-ins sidestep that. `Dropdown` always renders both its toggle and its content so
// the popover's tabs are reachable without simulating a real popover open, and `TabPanel` keeps its
// own active-tab state so a test can click between `Style Library` and `Custom`.
jest.mock('@wordpress/components', () => ({
	// `isPressed` is surfaced as `aria-pressed` (rather than dropped) so a test can confirm which row
	// the popover treats as active.
	Button: ({ children, isPressed, showTooltip, ...props }) => (
		<button aria-pressed={isPressed} {...props}>
			{children}
		</button>
	),
	Icon: ({ icon, ...props }) => <span {...props}>{icon}</span>,
	Dropdown: ({ renderToggle, renderContent }) => (
		<>
			{renderToggle({ isOpen: true, onToggle: () => {} })}
			{renderContent({ onClose: () => {} })}
		</>
	),
	TabPanel: ({ children, tabs, initialTabName }) => {
		const { useState: mockUseState } = require('react');
		const [active, setActive] = mockUseState(tabs.find((tab) => tab.name === initialTabName) || tabs[0]);
		return (
			<div data-testid="tab-panel">
				<div data-testid="tab-buttons">
					{tabs.map((tab) => (
						<button key={tab.name} data-testid={`tab-${tab.name}`} onClick={() => setActive(tab)}>
							{tab.title}
						</button>
					))}
				</div>
				{children(active)}
			</div>
		);
	},
	__experimentalNumberControl: ({ label, value, onChange, disabled }) => (
		<label>
			{label}
			<input
				aria-label={label}
				type="number"
				value={value}
				disabled={disabled}
				onChange={(event) => onChange(event.target.value)}
			/>
		</label>
	),
	ToggleControl: ({ label, checked, onChange, disabled }) => (
		<label>
			<input
				aria-label={label}
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={(event) => onChange(event.target.checked)}
			/>
			{label}
		</label>
	),
}));

jest.mock('@wordpress/icons', () => ({ globe: 'globe', settings: 'settings', undo: 'undo', shadow: 'shadow-glyph' }));
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

const TOKENS = [
	{ id: 'md', label: 'Medium', value: '0px 2px 8px 0px #1717171f', alias: '{primitive.shadow.md}' },
	{ id: 'lg', label: 'Large', value: '0px 4px 16px 0px #1717172f', alias: '{primitive.shadow.lg}' },
];

// The fixed "None" sentinel, matching `fixed-tokens.js`'s `noneEntryForRole('shadow')` shape: a
// literal resolved shorthand as its `value`/`alias` rather than a bracket-wrapped token path, since
// it has no DTCG registration behind it.
const NONE_TOKEN = {
	id: 'ss-none-shadow',
	label: 'None',
	value: '0px 0px 0px 0px transparent',
	alias: '0px 0px 0px 0px transparent',
	fixed: true,
};

const TOKENS_WITH_NONE = [...TOKENS, NONE_TOKEN];

/**
 * Render `BoxShadowControl` with the props it needs, plus overrides.
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
			createElement(BoxShadowControl, {
				value: '',
				onChange: jest.fn(),
				label: 'Shadow',
				tokens: TOKENS,
				...props,
			})
		)
	);

	return container;
}

const trigger = () => container.querySelector('.kadence-token-field__trigger');
const resetButton = () => container.querySelector('.kadence-token-field__reset');
const tokenItem = (label) =>
	Array.from(container.querySelectorAll('.kadence-token-field__item')).find((el) => el.textContent.includes(label));
const numberInput = (label) => container.querySelector(`input[aria-label="${label}"][type="number"]`);
const insetCheckbox = () => container.querySelector('input[aria-label="Inset"]');

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
 * Change a text/number input inside `act`.
 *
 * @param {HTMLElement} element The input element.
 * @param {string}      value   The next value.
 *
 * @since TBD
 *
 * @return {void}
 */
function change(element, value) {
	act(() => {
		const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
		setter.call(element, value);
		element.dispatchEvent(new Event('input', { bubbles: true }));
	});
}

describe('BoxShadowControl trigger', () => {
	/**
	 * The trigger always shows a leading glyph, in every value state — the field's own visible
	 * identity, independent of whether anything is set yet.
	 *
	 * @return {void}
	 */
	it('shows a leading icon glyph', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		expect(trigger().querySelector('.kadence-token-field__icon')).not.toBeNull();
	});

	/**
	 * The trigger shows the bound token's label when the value is that token's alias.
	 *
	 * @return {void}
	 */
	it('shows the token label when value is a token alias', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		expect(trigger().querySelector('.kadence-token-field__label').textContent).toBe('Medium');
	});

	/**
	 * The trigger shows no value text alongside the bound token's label — unlike every other field's
	 * `TokenSelector` trigger, this control shows a label only, never a resolved value/shorthand.
	 *
	 * @return {void}
	 */
	it('shows no value text alongside the token label', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		expect(trigger().querySelector('.kadence-token-field__value')).toBeNull();
	});

	/**
	 * The trigger reads "Custom" when the value is a composite shadow object.
	 *
	 * @return {void}
	 */
	it('shows "Custom" when value is a composite object', () => {
		renderControl({ value: { color: '#000000', offsetX: '2px', offsetY: '2px', blur: '4px', spread: '0px' } });

		expect(trigger().querySelector('.kadence-token-field__label').textContent).toBe('Custom');
	});

	/**
	 * A composite value's trigger shows no value text alongside "Custom" either — the Custom tab
	 * itself is one click away and already shows every sub-field, so the trigger does not also spell
	 * out a CSS shorthand.
	 *
	 * @return {void}
	 */
	it('shows no value text alongside "Custom" for a composite value', () => {
		renderControl({ value: { color: '#000000', offsetX: '2px', offsetY: '2px', blur: '4px', spread: '0px' } });

		expect(trigger().querySelector('.kadence-token-field__value')).toBeNull();
	});

	/**
	 * An unset value (the field's actual starting state before a token or a custom shadow is chosen)
	 * shows a muted "Default" label — matching every other control in this library (`TokenSelector`'s
	 * own unset behavior), rather than a blank trigger. Shadow's conceptual default when unset is a
	 * constant ("no shadow"), or, when the host supplies one, the fallback it actually resolves to — only the
	 * muted label itself.
	 *
	 * @return {void}
	 */
	it('shows a muted "Default" label when the value is unset', () => {
		renderControl({ value: '' });

		const label = trigger().querySelector('.kadence-token-field__label');

		expect(label).not.toBeNull();
		expect(label.textContent).toBe('Default');
		expect(label.classList.contains('kadence-token-field__label--default')).toBe(true);
		expect(trigger().querySelector('.kadence-token-field__icon')).not.toBeNull();
	});

	/**
	 * The unset trigger now carries visible label text ("Default"), so it names itself without needing
	 * an `aria-label` on top — the same rule this library applies to a bound token or a composite value.
	 *
	 * @return {void}
	 */
	it('has no aria-label when the value is unset', () => {
		renderControl({ value: '' });

		expect(trigger().hasAttribute('aria-label')).toBe(false);
	});

	/**
	 * A trigger with visible label text names itself through that text, so no `aria-label` is added on
	 * top of it — avoiding a redundant or conflicting accessible name.
	 *
	 * @return {void}
	 */
	it('has no aria-label when a token alias value is set', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		expect(trigger().hasAttribute('aria-label')).toBe(false);
	});

	/**
	 * Same guard for a composite (Custom) value, the other value shape with visible label text.
	 *
	 * @return {void}
	 */
	it('has no aria-label when a composite value is set', () => {
		renderControl({ value: { color: '#000000', offsetX: '2px', offsetY: '2px', blur: '4px', spread: '0px' } });

		expect(trigger().hasAttribute('aria-label')).toBe(false);
	});

	/**
	 * A composite value that matches a `fixed` entry's own resolved shorthand (e.g. picking "None"
	 * resolves to a literal composite immediately, at pick time — there is no live alias kept the way a
	 * real token pick keeps one) shows that entry's label on the trigger, not the generic "Custom" every
	 * other composite gets.
	 *
	 * @return {void}
	 */
	it('shows the fixed entry’s label when the composite value matches its resolved shorthand', () => {
		renderControl({
			value: { color: 'transparent', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			tokens: TOKENS_WITH_NONE,
		});

		expect(trigger().querySelector('.kadence-token-field__label').textContent).toBe('None');
	});

	/**
	 * A composite value that does NOT match any fixed entry's shorthand still reads as "Custom" — the
	 * fixed-entry recognition is scoped to an exact shape match, not any all-zero-looking shadow.
	 *
	 * @return {void}
	 */
	it('still shows "Custom" for a composite value that does not match any fixed entry', () => {
		renderControl({
			value: { color: '#111111', offsetX: '2px', offsetY: '2px', blur: '4px', spread: '0px' },
			tokens: TOKENS_WITH_NONE,
		});

		expect(trigger().querySelector('.kadence-token-field__label').textContent).toBe('Custom');
	});
});

describe('BoxShadowControl row anatomy', () => {
	/**
	 * The control renders exactly one control-box row — matching Border Radius's row anatomy — since
	 * a shadow is a single value with nothing sided to grid.
	 *
	 * @return {void}
	 */
	it('renders exactly one control-box row', () => {
		renderControl();

		expect(container.querySelectorAll('.kb-token-control__row')).toHaveLength(1);
	});

	/**
	 * The row carries no glyph element — a shadow has nothing spatial to point at, unlike a bordered
	 * side or a rounded corner.
	 *
	 * @return {void}
	 */
	it('renders no glyph element', () => {
		renderControl();

		expect(container.querySelector('.kb-token-control__glyph')).toBeNull();
	});

	/**
	 * `ControlShell`'s own header renders the field's label exactly once — the control no longer
	 * builds its own ad-hoc `<span>` label alongside it.
	 *
	 * @return {void}
	 */
	it('renders the label once, via ControlShell’s header', () => {
		renderControl({ label: 'Shadow' });

		const headerLabels = container.querySelectorAll('.kb-token-control__label');

		expect(headerLabels).toHaveLength(1);
		expect(headerLabels[0].textContent).toBe('Shadow');
	});
});

describe('BoxShadowControl initial tab', () => {
	/**
	 * An aliased value opens the popover on the Style Library tab, so the token list is reachable
	 * without switching tabs.
	 *
	 * @return {void}
	 */
	it('opens on the Style Library tab for an aliased value', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		expect(tokenItem('Medium')).not.toBeUndefined();
	});

	/**
	 * A composite value opens the popover on the Custom tab, so the axis fields are reachable
	 * without switching tabs.
	 *
	 * @return {void}
	 */
	it('opens on the Custom tab for a composite value', () => {
		renderControl({ value: { color: '#000000', offsetX: '2px', offsetY: '2px', blur: '4px', spread: '0px' } });

		expect(numberInput('X')).not.toBeNull();
	});

	/**
	 * A composite value matching a fixed entry's resolved shorthand is effectively a token pick, so it
	 * opens on the Style Library tab — where "None" itself lives — not the Custom tab.
	 *
	 * @return {void}
	 */
	it('opens on the Style Library tab for a composite value matching a fixed entry', () => {
		renderControl({
			value: { color: 'transparent', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			tokens: TOKENS_WITH_NONE,
		});

		expect(tokenItem('None')).not.toBeUndefined();
	});
});

describe('BoxShadowControl Style Library tab', () => {
	/**
	 * Picking a token calls onChange with that token's alias.
	 *
	 * @return {void}
	 */
	it('calls onChange with the picked token alias', () => {
		const onChange = jest.fn();
		renderControl({ value: '{primitive.shadow.md}', onChange });

		click(tokenItem('Large'));

		expect(onChange).toHaveBeenCalledWith('{primitive.shadow.lg}');
	});

	/**
	 * A composite value matching a fixed entry's resolved shorthand is recognized as that entry for
	 * display purposes: reopening the popover highlights the "None" row as pressed/active, the same
	 * way a real bound token's row does — rather than leaving every row unpressed the way an ordinary
	 * (non-matching) Custom composite does.
	 *
	 * @return {void}
	 */
	it('highlights the fixed entry’s row as pressed when the composite value matches it', () => {
		renderControl({
			value: { color: 'transparent', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			tokens: TOKENS_WITH_NONE,
		});

		expect(tokenItem('None').getAttribute('aria-pressed')).toBe('true');
	});

	/**
	 * Reset clears an aliased value back to empty.
	 *
	 * @return {void}
	 */
	it('calls onChange with an empty string when Reset is clicked', () => {
		const onChange = jest.fn();
		renderControl({ value: '{primitive.shadow.md}', onChange });

		click(resetButton());

		expect(onChange).toHaveBeenCalledWith('');
	});

	/**
	 * Each token row shows its label but not its resolved `box-shadow` value — a shadow's value is a
	 * long CSS shorthand that would crowd the row.
	 *
	 * @return {void}
	 */
	it("shows each row's label but not its resolved value", () => {
		renderControl({ value: '{primitive.shadow.md}' });

		expect(tokenItem('Large')).not.toBeUndefined();
		expect(container.querySelector('.kadence-token-field__item-value')).toBeNull();
	});

	/**
	 * The Style Library tab shows a live preview square above `Reset`, with the currently bound
	 * token's resolved `box-shadow` value applied — giving a visual sense of the shadow before it is
	 * picked.
	 *
	 * @return {void}
	 */
	it('shows a preview square carrying the bound token’s resolved shadow', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		const preview = container.querySelector('.kadence-token-field__preview .kb-box-shadow-control__preview');

		expect(preview).not.toBeNull();
		expect(preview.style.boxShadow).toBe('0px 2px 8px 0px #1717171f');
	});

	/**
	 * With nothing set yet, the preview square carries no shadow rather than a fabricated one.
	 *
	 * @return {void}
	 */
	it('shows a shadow-less preview square when the value is unset', () => {
		renderControl({ value: '' });

		const preview = container.querySelector('.kadence-token-field__preview .kb-box-shadow-control__preview');

		expect(preview).not.toBeNull();
		expect(preview.style.boxShadow).toBe('none');
	});

	/**
	 * Hovering a different token row previews that row's shadow instead of the bound value's — the
	 * live-hover behavior this control opts into via `TokenPopover`'s `hoveredEntry`.
	 *
	 * @return {void}
	 */
	it('previews the hovered token row’s shadow instead of the bound value', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		const preview = () => container.querySelector('.kadence-token-field__preview .kb-box-shadow-control__preview');

		expect(preview().style.boxShadow).toBe('0px 2px 8px 0px #1717171f');

		act(() => tokenItem('Large').dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));

		expect(preview().style.boxShadow).toBe('0px 4px 16px 0px #1717172f');
	});

	/**
	 * Leaving hover on a token row falls back to the bound value's own shadow again — the preview
	 * does not stay pinned to whatever was last hovered.
	 *
	 * @return {void}
	 */
	it('falls back to the bound value’s shadow once hover leaves the token row', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		const preview = () => container.querySelector('.kadence-token-field__preview .kb-box-shadow-control__preview');
		const large = tokenItem('Large');

		act(() => large.dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));
		expect(preview().style.boxShadow).toBe('0px 4px 16px 0px #1717172f');

		act(() => large.dispatchEvent(new MouseEvent('mouseout', { bubbles: true })));
		expect(preview().style.boxShadow).toBe('0px 2px 8px 0px #1717171f');
	});

	/**
	 * Focusing a token row (keyboard navigation) previews it exactly like a mouse hover — the field
	 * stays keyboard-accessible, not mouse-only.
	 *
	 * @return {void}
	 */
	it('previews the focused token row’s shadow instead of the bound value', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		const preview = () => container.querySelector('.kadence-token-field__preview .kb-box-shadow-control__preview');

		act(() => tokenItem('Large').dispatchEvent(new window.FocusEvent('focusin', { bubbles: true })));

		expect(preview().style.boxShadow).toBe('0px 4px 16px 0px #1717172f');
	});

	/**
	 * Hovering the Reset row previews the cleared state — shadow-less here, since this control has
	 * no inherited default for Reset to fall back to.
	 *
	 * @return {void}
	 */
	it('previews a shadow-less square while hovering Reset', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		const preview = () => container.querySelector('.kadence-token-field__preview .kb-box-shadow-control__preview');

		act(() => resetButton().dispatchEvent(new MouseEvent('mouseover', { bubbles: true })));

		expect(preview().style.boxShadow).toBe('none');
	});
});

describe('BoxShadowControl Custom tab', () => {
	/**
	 * An aliased value seeds the Custom tab from the bound token's own resolved shorthand, not the
	 * all-zero default composite — switching to Custom must show the token's real legs so editing one
	 * of them does not silently discard the rest.
	 *
	 * @return {void}
	 */
	it('seeds the Custom tab’s fields from the bound token’s resolved value for an aliased value', () => {
		renderControl({ value: '{primitive.shadow.md}' });

		click(container.querySelector('[data-testid="tab-custom"]'));

		expect(numberInput('X').value).toBe('0');
		expect(numberInput('Y').value).toBe('2');
		expect(numberInput('Blur').value).toBe('8');
		expect(numberInput('Spread').value).toBe('0');
	});

	/**
	 * A stale alias — no entry in `tokens` resolves it, because the token was deleted after the binding
	 * was saved — seeds the Custom tab from the host's `fallbackShadow` prop instead of the all-zero
	 * default, so switching to Custom does not silently discard the stored legs.
	 *
	 * @return {void}
	 */
	it('seeds the Custom tab’s fields from fallbackShadow for a stale alias', () => {
		renderControl({
			value: '{primitive.shadow.deleted}',
			fallbackShadow: { color: '#222222', offsetX: '3px', offsetY: '5px', blur: '10px', spread: '1px' },
		});

		click(container.querySelector('[data-testid="tab-custom"]'));

		expect(numberInput('X').value).toBe('3');
		expect(numberInput('Y').value).toBe('5');
		expect(numberInput('Blur').value).toBe('10');
		expect(numberInput('Spread').value).toBe('1');
	});

	/**
	 * A stale alias with no `fallbackShadow` supplied still seeds the Custom tab from the plain default
	 * composite (all-zero) — the Style Library host never passes this prop, so it must see unchanged
	 * behavior.
	 *
	 * @return {void}
	 */
	it('seeds the Custom tab’s fields from the default composite for a stale alias with no fallbackShadow', () => {
		renderControl({ value: '{primitive.shadow.deleted}' });

		click(container.querySelector('[data-testid="tab-custom"]'));

		expect(numberInput('X').value).toBe('0');
		expect(numberInput('Y').value).toBe('0');
		expect(numberInput('Blur').value).toBe('0');
		expect(numberInput('Spread').value).toBe('0');
	});

	/**
	 * An alias that DOES resolve against `tokens` still seeds from that token entry, even when a
	 * `fallbackShadow` is also supplied — the fallback only applies to a stale alias, never overriding a
	 * live resolution.
	 *
	 * @return {void}
	 */
	it('prefers the resolved token entry over fallbackShadow when the alias resolves', () => {
		renderControl({
			value: '{primitive.shadow.md}',
			fallbackShadow: { color: '#222222', offsetX: '3px', offsetY: '5px', blur: '10px', spread: '1px' },
		});

		click(container.querySelector('[data-testid="tab-custom"]'));

		expect(numberInput('X').value).toBe('0');
		expect(numberInput('Y').value).toBe('2');
		expect(numberInput('Blur').value).toBe('8');
		expect(numberInput('Spread').value).toBe('0');
	});

	/**
	 * Editing an axis writes the full composite object with only that axis changed, serialized as a
	 * px dimension string, and the rest of the value preserved.
	 *
	 * @return {void}
	 */
	it('calls onChange with the full composite object when an axis changes', () => {
		const onChange = jest.fn();
		renderControl({
			value: { color: '#111111', offsetX: '2px', offsetY: '4px', blur: '8px', spread: '0px' },
			onChange,
		});

		change(numberInput('Blur'), '12');

		expect(onChange).toHaveBeenCalledWith({
			color: '#111111',
			offsetX: '2px',
			offsetY: '4px',
			blur: '12px',
			spread: '0px',
		});
	});

	/**
	 * A fractional stored value (e.g. a sub-pixel offset) must display intact rather than being
	 * truncated to its integer part — `parseInt` would silently drop the `.25`.
	 *
	 * @return {void}
	 */
	it('displays a fractional axis value without truncating it', () => {
		renderControl({
			value: { color: '#111111', offsetX: '1.25px', offsetY: '0px', blur: '0px', spread: '0px' },
		});

		expect(numberInput('X').value).toBe('1.25');
	});

	/**
	 * Turning Inset on writes the composite object with `inset: true`.
	 *
	 * @return {void}
	 */
	it('calls onChange with inset true when the Inset toggle is switched on', () => {
		const onChange = jest.fn();
		renderControl({
			value: { color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			onChange,
		});

		click(insetCheckbox());

		expect(onChange).toHaveBeenCalledWith({
			color: '#111111',
			offsetX: '0px',
			offsetY: '0px',
			blur: '0px',
			spread: '0px',
			inset: true,
		});
	});

	/**
	 * Turning Inset back off writes the composite object with the `inset` key absent entirely,
	 * matching `helpers/shadow.js`'s existing convention rather than writing `inset: false`.
	 *
	 * @return {void}
	 */
	it('calls onChange with the inset key absent when the Inset toggle is switched back off', () => {
		const onChange = jest.fn();
		renderControl({
			value: { color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px', inset: true },
			onChange,
		});

		click(insetCheckbox());

		const next = onChange.mock.calls[0][0];
		expect(next).not.toHaveProperty('inset');
		expect(next).toEqual({ color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' });
	});

	/**
	 * `renderColor` is invoked with the shadow's current color and an onChange that patches only the
	 * color field, leaving every other sub-field untouched.
	 *
	 * @return {void}
	 */
	it('invokes renderColor with the color value and patches only color on change', () => {
		const onChange = jest.fn();
		let received;
		const renderColor = ({ value, onChange: patch }) => {
			received = { value, patch };
			return <div data-testid="color-slot" />;
		};

		renderControl({
			value: { color: '#111111', offsetX: '2px', offsetY: '4px', blur: '8px', spread: '0px' },
			onChange,
			renderColor,
		});

		expect(received.value).toBe('#111111');
		expect(container.querySelector('[data-testid="color-slot"]')).not.toBeNull();

		act(() => received.patch('#ffffff'));

		expect(onChange).toHaveBeenCalledWith({
			color: '#ffffff',
			offsetX: '2px',
			offsetY: '4px',
			blur: '8px',
			spread: '0px',
		});
	});

	/**
	 * The Custom tab's color row sits in its own wrapper, above the axes — matching the Style
	 * Library's `ShadowField` layout — rather than sitting inline with the axis fields the way it
	 * did before this row anatomy existed. `renderColor`'s own rendered element (a bare
	 * `data-testid="color-slot"` stand-in here, standing in for the real swatch-plus-label toggle) is
	 * asserted as a child of that row, proving the wrapper does not alter or replace what the render
	 * prop returns.
	 *
	 * @return {void}
	 */
	it('renders renderColor’s output inside its own color row, above the axes', () => {
		const renderColor = () => <div data-testid="color-slot" />;

		renderControl({
			value: { color: '#111111', offsetX: '2px', offsetY: '4px', blur: '8px', spread: '0px' },
			renderColor,
		});

		const colorRow = container.querySelector('.kb-box-shadow-control__color-row');

		expect(colorRow).not.toBeNull();
		expect(colorRow.querySelector('[data-testid="color-slot"]')).not.toBeNull();

		// The color row renders above the axes: its section index in the Custom tab's own children
		// comes before the axes row's.
		const sections = Array.from(container.querySelector('.kb-box-shadow-control__custom').children);

		expect(sections.indexOf(colorRow)).toBeLessThan(
			sections.indexOf(container.querySelector('.kb-box-shadow-control__axes'))
		);
	});

	/**
	 * The four axis fields render together inside one `.kb-box-shadow-control__axes` row, in X, Y,
	 * Blur, Spread order — the horizontal row anatomy `ShadowField` uses, not a stack.
	 *
	 * @return {void}
	 */
	it('renders the four axis fields together, in X/Y/Blur/Spread order', () => {
		renderControl({
			value: { color: '#111111', offsetX: '2px', offsetY: '4px', blur: '8px', spread: '1px' },
		});

		const axes = container.querySelector('.kb-box-shadow-control__axes');
		const inputs = Array.from(axes.querySelectorAll('input[type="number"]'));

		expect(inputs.map((input) => input.getAttribute('aria-label'))).toEqual(['X', 'Y', 'Blur', 'Spread']);
	});
});

describe('BoxShadowControl disabled state', () => {
	/**
	 * A disabled control's trigger cannot be interacted with.
	 *
	 * @return {void}
	 */
	it('disables the trigger', () => {
		renderControl({ disabled: true });

		expect(trigger().disabled).toBe(true);
	});

	/**
	 * `BoxShadowControl` guards each write path (`onPick`, `onClear`) separately rather than relying
	 * on the trigger's `disabled` attribute alone — a real popover would still be reachable through
	 * assistive tech or a stray click on an already-open panel, so the guards inside `TokenPopover`
	 * are what actually stop a write while disabled. This exercises the Style Library tab's pick and
	 * reset paths directly and confirms neither fires `onChange`, matching `BorderControl`'s sibling
	 * "disables every field and fires no onChange from a disabled sub-field" coverage.
	 *
	 * @return {void}
	 */
	it('fires no onChange from a pick or reset in the Style Library tab while disabled', () => {
		const onChange = jest.fn();
		renderControl({ value: '{primitive.shadow.md}', onChange, disabled: true });

		click(tokenItem('Large'));
		click(resetButton());

		expect(onChange).not.toHaveBeenCalled();
	});

	/**
	 * Same guard, exercised on the Custom tab's axis-edit and inset-toggle paths — the third of the
	 * three `!disabled &&` guards this control relies on.
	 *
	 * @return {void}
	 */
	it('fires no onChange from an axis edit or the Inset toggle in the Custom tab while disabled', () => {
		const onChange = jest.fn();
		renderControl({
			value: { color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			onChange,
			disabled: true,
		});

		change(numberInput('Blur'), '12');
		click(insetCheckbox());

		expect(onChange).not.toHaveBeenCalled();
	});

	/**
	 * The write guard alone leaves the number inputs and Inset toggle interactively enabled, which
	 * reads as editable even though a write does nothing — `disabled` must reach the underlying
	 * fields too, not just gate `onChange`.
	 *
	 * @return {void}
	 */
	it('disables the number inputs and the Inset toggle in the Custom tab', () => {
		renderControl({
			value: { color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			disabled: true,
		});

		expect(numberInput('X').disabled).toBe(true);
		expect(numberInput('Y').disabled).toBe(true);
		expect(numberInput('Blur').disabled).toBe(true);
		expect(numberInput('Spread').disabled).toBe(true);
		expect(insetCheckbox().disabled).toBe(true);
	});

	/**
	 * `renderColor` receives `disabled` as part of its contract so the caller's color field can
	 * disable itself too, the same way the number inputs and Inset toggle do.
	 *
	 * @return {void}
	 */
	it('passes disabled to renderColor', () => {
		let received;
		renderControl({
			value: { color: '#111111', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px' },
			disabled: true,
			renderColor: (props) => {
				received = props;
				return null;
			},
		});

		expect(received.disabled).toBe(true);
	});
});

describe('BoxShadowControl fallback labelling', () => {
	/**
	 * A fallback equal to the fixed sentinel's own resolved value must not borrow its label: an
	 * untouched control would then read as an explicit "None" pick rather than as a default.
	 *
	 * @return {void}
	 */
	it('reads "Default", not "None", when the fallback equals the sentinel value', () => {
		renderControl({ value: '', tokens: TOKENS_WITH_NONE, defaultValue: NONE_TOKEN.value });

		const label = trigger().querySelector('.kadence-token-field__label');

		expect(label.textContent).toBe('Default');
		expect(label.classList.contains('kadence-token-field__label--default')).toBe(true);
	});

	/**
	 * A fallback naming a real token still shows that token's label, so the muted text says what the
	 * field actually falls back to.
	 *
	 * @return {void}
	 */
	it('names a real token fallback by its own label', () => {
		renderControl({ value: '', tokens: TOKENS_WITH_NONE, defaultValue: TOKENS[0].value });

		expect(trigger().querySelector('.kadence-token-field__label').textContent).toBe('Medium');
	});
});
