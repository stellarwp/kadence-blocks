/* eslint-env jest */

/**
 * Internal dependencies
 */
import { EditorScalarControl } from '../EditorScalarControl';

/**
 * Call `EditorScalarControl` as a plain function and return the `ScalarControl`/`BreakpointProvider`
 * elements it produced. The component holds no hooks of its own, so the returned element tree can
 * be inspected directly instead of mounting it — matching this file's sibling tests, which inspect
 * returned element types/props rather than rendering.
 *
 * @param {Object} overrides Props to override on top of the defaults.
 *
 * @since TBD
 *
 * @return {{provider: Object, scalarControl: Object, onDeviceChange: Function}} The provider element,
 *   the `ScalarControl` element nested inside it, and the `onDeviceChange` spy passed in.
 */
function renderEditorScalarControl(overrides = {}) {
	const onDeviceChange = jest.fn();

	const props = {
		label: 'Icon Size',
		value: '',
		onChange: jest.fn(),
		previewDevice: 'Desktop',
		onDeviceChange,
		tokens: [],
		...overrides,
	};

	const provider = EditorScalarControl(props);

	return { provider, scalarControl: provider.props.children, onDeviceChange };
}

describe('EditorScalarControl breakpoint switching', () => {
	/**
	 * The switcher rendered by `ControlShell` drives `ScalarControl`'s `onBreakpointChange` prop
	 * directly (see `ControlShell`'s `onClick={() => onBreakpointChange?.(key)}`), not the
	 * `BreakpointProvider` context above it. `EditorScalarControl` must wire that prop itself, or the
	 * switcher silently no-ops.
	 *
	 * @return {void}
	 */
	it('invokes onDeviceChange with the matching device when onBreakpointChange fires', () => {
		const { scalarControl, onDeviceChange } = renderEditorScalarControl();

		scalarControl.props.onBreakpointChange('tablet');

		expect(onDeviceChange).toHaveBeenCalledWith('Tablet');
	});

	/**
	 * Every control breakpoint key maps back to its editor device name, not just one.
	 *
	 * @return {void}
	 */
	it('maps every breakpoint key back to its editor device name', () => {
		const { scalarControl, onDeviceChange } = renderEditorScalarControl();

		scalarControl.props.onBreakpointChange('mobile');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Mobile');

		scalarControl.props.onBreakpointChange('desktop');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Desktop');

		scalarControl.props.onBreakpointChange('tablet');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Tablet');
	});

	/**
	 * The `BreakpointProvider`'s own `onChange` maps breakpoints back to devices the same way as the
	 * `onBreakpointChange` prop, using the one shared mapping rather than a second copy of it.
	 *
	 * @return {void}
	 */
	it('maps the BreakpointProvider onChange consistently with onBreakpointChange', () => {
		const { provider, onDeviceChange } = renderEditorScalarControl();

		provider.props.onChange('mobile');

		expect(onDeviceChange).toHaveBeenCalledWith('Mobile');
	});
});

describe('EditorScalarControl device -> breakpoint (forward)', () => {
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
		const { provider, scalarControl } = renderEditorScalarControl({ previewDevice });

		expect(provider.props.value).toBe(breakpoint);
		expect(scalarControl.props.breakpoint).toBe(breakpoint);
	});

	/**
	 * An unrecognized device (e.g. a future editor device this component does not know about yet)
	 * degrades to desktop rather than rendering with no breakpoint at all.
	 *
	 * @return {void}
	 */
	it('falls back to desktop for an unknown preview device', () => {
		const { provider } = renderEditorScalarControl({ previewDevice: 'Widescreen' });

		expect(provider.props.value).toBe('desktop');
	});
});

describe('EditorScalarControl shape', () => {
	/**
	 * A scalar property has nothing to link, so no link state may cross this boundary — passing either
	 * prop is what makes `ControlShell` draw the toggle.
	 *
	 * @return {void}
	 */
	it('passes no link state to the control', () => {
		const { scalarControl } = renderEditorScalarControl();

		expect(scalarControl.props.isLinked).toBeUndefined();
		expect(scalarControl.props.onToggleLink).toBeUndefined();
	});

	/**
	 * The control is responsive: it offers all three breakpoints, which is what makes `ControlShell`
	 * render the switcher at all.
	 *
	 * @return {void}
	 */
	it('offers every editor breakpoint to the switcher', () => {
		const { scalarControl } = renderEditorScalarControl();

		expect(scalarControl.props.breakpoints).toEqual(['desktop', 'tablet', 'mobile']);
	});

	/**
	 * A host that pins the unit (a block whose attribute stores a bare number in one fixed unit) has its
	 * single-entry unit list reach the control untouched.
	 *
	 * @return {void}
	 */
	it('passes a pinned unit list straight through', () => {
		const { scalarControl } = renderEditorScalarControl({ unit: 'px', units: ['px'] });

		expect(scalarControl.props.unit).toBe('px');
		expect(scalarControl.props.units).toEqual(['px']);
	});
});
