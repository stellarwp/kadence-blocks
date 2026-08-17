/* eslint-env jest */

/**
 * Internal dependencies
 */
import { EditorBoxControl } from '../EditorBoxControl';

/**
 * Call `EditorBoxControl` as a plain function and return the `BoxControl`/`BreakpointProvider`
 * elements it produced. The component holds no hooks of its own, so the returned element tree can
 * be inspected directly instead of mounting it — matching this file's sibling tests, which inspect
 * returned element types/props rather than rendering.
 *
 * @param {Object} overrides Props to override on top of the defaults.
 *
 * @since TBD
 *
 * @return {{provider: Object, boxControl: Object, onDeviceChange: Function}} The provider element,
 *   the `BoxControl` element nested inside it, and the `onDeviceChange` spy passed in.
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

	const provider = EditorBoxControl(props);

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
