/* eslint-env jest */

/**
 * Internal dependencies
 */
import { EditorBoxControl } from '../EditorBoxControl';

/**
 * Call `EditorBoxControl` as a plain function and return the `BoxControl`/`BreakpointProvider`
 * elements it produced. The component holds no hooks of its own — `TokenControlRow` is referenced in
 * the returned JSX but never invoked by this plain call, since JSX only builds element descriptors —
 * so the returned element tree can be inspected directly instead of mounting it, matching this file's
 * sibling tests, which inspect returned element types/props rather than rendering.
 *
 * @param {Object} overrides Props to override on top of the defaults.
 *
 * @since TBD
 *
 * @return {{provider: Object, boxControl: Object, onDeviceChange: Function}} The `BreakpointProvider`
 *   element (one level inside the root `TokenControlRow`), the `BoxControl` element nested inside it,
 *   and the `onDeviceChange` spy passed in.
 */
function renderEditorBoxControl(overrides = {}) {
	const onDeviceChange = jest.fn();

	const props = {
		label: 'Border Radius',
		value: ['', '', '', ''],
		onChange: jest.fn(),
		previewDevice: 'Desktop',
		onDeviceChange,
		tokens: [],
		isLinked: true,
		onToggleLink: jest.fn(),
		...overrides,
	};

	const provider = EditorBoxControl(props).props.children;

	return { provider, boxControl: provider.props.children, onDeviceChange };
}

describe('EditorBoxControl breakpoint switching', () => {
	/**
	 * The switcher rendered by `ControlShell` drives `BoxControl`'s `onBreakpointChange` prop
	 * directly (see `ControlShell`'s `onClick={() => onBreakpointChange?.(key)}`), not the
	 * `BreakpointProvider` context above it. `EditorBoxControl` must wire that prop itself, or the
	 * switcher silently no-ops.
	 *
	 * @return {void}
	 */
	it('invokes onDeviceChange with the matching device when onBreakpointChange fires', () => {
		const { boxControl, onDeviceChange } = renderEditorBoxControl();

		boxControl.props.onBreakpointChange('tablet');

		expect(onDeviceChange).toHaveBeenCalledWith('Tablet');
	});

	/**
	 * Every control breakpoint key maps back to its editor device name, not just one.
	 *
	 * @return {void}
	 */
	it('maps every breakpoint key back to its editor device name', () => {
		const { boxControl, onDeviceChange } = renderEditorBoxControl();

		boxControl.props.onBreakpointChange('mobile');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Mobile');

		boxControl.props.onBreakpointChange('desktop');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Desktop');

		boxControl.props.onBreakpointChange('tablet');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Tablet');
	});

	/**
	 * The `BreakpointProvider`'s own `onChange` maps breakpoints back to devices the same way as the
	 * `onBreakpointChange` prop, using the one shared mapping rather than a second copy of it.
	 *
	 * @return {void}
	 */
	it('maps the BreakpointProvider onChange consistently with onBreakpointChange', () => {
		const { provider, onDeviceChange } = renderEditorBoxControl();

		provider.props.onChange('mobile');

		expect(onDeviceChange).toHaveBeenCalledWith('Mobile');
	});
});

describe('EditorBoxControl device -> breakpoint (forward)', () => {
	/**
	 * The editor's `previewDevice` selects the breakpoint both the provider's value and the control
	 * render at — the direction opposite the switcher callbacks above.
	 *
	 * @return {void}
	 */
	it.each([
		['Desktop', 'desktop'],
		['Tablet', 'tablet'],
		['Mobile', 'mobile'],
	])('renders breakpoint %s for previewDevice %s', (previewDevice, breakpoint) => {
		const { provider, boxControl } = renderEditorBoxControl({ previewDevice });

		expect(provider.props.value).toBe(breakpoint);
		expect(boxControl.props.breakpoint).toBe(breakpoint);
	});

	/**
	 * An unrecognized device (e.g. a future editor device this component does not know about yet)
	 * degrades to desktop rather than rendering with no breakpoint at all.
	 *
	 * @return {void}
	 */
	it('falls back to desktop for an unknown preview device', () => {
		const { provider } = renderEditorBoxControl({ previewDevice: 'Widescreen' });

		expect(provider.props.value).toBe('desktop');
	});
});

describe('EditorBoxControl collapse', () => {
	/**
	 * The block attribute is always a four-element array, so `BoxControl` must never fold a uniform
	 * value down to a scalar the block cannot read back.
	 *
	 * @return {void}
	 */
	it('never collapses a uniform value to a scalar', () => {
		const { boxControl } = renderEditorBoxControl();

		expect(boxControl.props.collapse).toBe(false);
	});
});

describe('EditorBoxControl unset corners', () => {
	/**
	 * A corner with nothing stored stays empty rather than being filled in with the fallback: the
	 * control shows that fallback MUTED (via `defaultValue`) instead, so an unset corner reads as
	 * "Default"/"Inherited" rather than claiming an override nobody made.
	 *
	 * @return {void}
	 */
	it('leaves an empty corner empty and passes the fallback through as the muted default', () => {
		const { boxControl } = renderEditorBoxControl({
			value: ['', '2px', '', ''],
			defaultValue: ['1px', '1px', '1px', '1px'],
		});

		expect(boxControl.props.value).toEqual(['', '2px', '', '']);
		expect(boxControl.props.defaultValue).toEqual(['1px', '1px', '1px', '1px']);
	});

	/**
	 * A stored corner is never overridden by the fallback, even when the two disagree.
	 *
	 * @return {void}
	 */
	it('keeps every stored corner, ignoring the fallback for those', () => {
		const { boxControl } = renderEditorBoxControl({
			value: ['3px', '3px', '3px', '3px'],
			defaultValue: ['1px', '1px', '1px', '1px'],
		});

		expect(boxControl.props.value).toEqual(['3px', '3px', '3px', '3px']);
	});

	/**
	 * With no fallback at all, an empty corner stays empty.
	 *
	 * @return {void}
	 */
	it('leaves an empty corner empty when there is no fallback either', () => {
		const { boxControl } = renderEditorBoxControl({
			value: ['', '', '', ''],
			defaultValue: undefined,
		});

		expect(boxControl.props.value).toEqual(['', '', '', '']);
	});

	/**
	 * The `inherited` flag is forwarded untouched, since it is what decides whether the muted
	 * fallback is labeled "Inherited" (another breakpoint) or "Default" (the preset/baseline).
	 *
	 * @return {void}
	 */
	it('forwards the inherited flag that labels the muted fallback', () => {
		const { boxControl } = renderEditorBoxControl({
			value: ['', '', '', ''],
			defaultValue: ['1px', '1px', '1px', '1px'],
			inherited: true,
		});

		expect(boxControl.props.inherited).toBe(true);
	});
});
