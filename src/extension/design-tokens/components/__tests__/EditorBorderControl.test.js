/* eslint-env jest */

/**
 * Internal dependencies
 */
import { EditorBorderControl } from '../EditorBorderControl';

/**
 * A representative native border value: every side different, so a round-trip that silently
 * dropped or shuffled a side would be caught.
 *
 * @since TBD
 *
 * @type {Array}
 */
const NATIVE_VALUE = [
	{
		top: ['#111111', 'solid', 2],
		right: ['#222222', 'dashed', 3],
		bottom: ['#333333', 'dotted', 4],
		left: ['#444444', 'double', 5],
		unit: 'px',
	},
];

/**
 * Call `EditorBorderControl` as a plain function and return the `BorderControl`/`BreakpointProvider`
 * elements it produced. The component holds no hooks of its own, so the returned element tree can be
 * inspected directly instead of mounting it — matching `EditorBoxControl.test.js`'s own harness.
 *
 * @param {Object} overrides Props to override on top of the defaults.
 *
 * @since TBD
 *
 * @return {{provider: Object, borderControl: Object, onChange: Function, onChangeTablet: Function,
 *   onChangeMobile: Function, onDeviceChange: Function}} The provider element, the `BorderControl`
 *   element nested inside it, and the setter spies passed in.
 */
function renderEditorBorderControl(overrides = {}) {
	const onChange = jest.fn();
	const onChangeTablet = jest.fn();
	const onChangeMobile = jest.fn();
	const onDeviceChange = jest.fn();

	const props = {
		label: 'Border',
		value: NATIVE_VALUE,
		tabletValue: undefined,
		mobileValue: undefined,
		onChange,
		onChangeTablet,
		onChangeMobile,
		previewDevice: 'Desktop',
		onDeviceChange,
		widthTokens: [],
		...overrides,
	};

	const provider = EditorBorderControl(props);

	return {
		provider,
		borderControl: provider.props.children,
		onChange,
		onChangeTablet,
		onChangeMobile,
		onDeviceChange,
	};
}

describe('EditorBorderControl native <-> control value bridging', () => {
	/**
	 * `fromNativeBorder` is exercised indirectly through the `value` handed to `BorderControl`: each
	 * side's width becomes a CSS literal (`size` + shared `unit`), style and color pass through
	 * unchanged, and an empty side becomes an empty width rather than the literal string `"undefined"`
	 * with a unit appended to it.
	 *
	 * @return {void}
	 */
	it('converts the native shape to the width/style/color slot lists BorderControl expects', () => {
		const { borderControl } = renderEditorBorderControl();

		expect(borderControl.props.value).toEqual({
			width: ['2px', '3px', '4px', '5px'],
			style: ['solid', 'dashed', 'dotted', 'double'],
			color: ['#111111', '#222222', '#333333', '#444444'],
		});
	});

	/**
	 * A missing device value (no `tabletBorder` yet stored) reads as the empty scalar, not a crash on
	 * `undefined[0]` — a completely unset border has never been unlinked, so it renders linked until
	 * the first write turns every slot into a four-element array.
	 *
	 * @return {void}
	 */
	it('reads an unset native value as an empty scalar', () => {
		const { borderControl } = renderEditorBorderControl({ previewDevice: 'Tablet', tabletValue: undefined });

		expect(borderControl.props.value).toEqual({
			width: '',
			style: 'none',
			color: '',
		});
	});

	/**
	 * Changing a width slot writes the native shape back with the other three sides' width, style,
	 * and color intact — the round-trip must be lossless for a representative value.
	 *
	 * @return {void}
	 */
	it('round-trips a representative native value losslessly through a width edit', () => {
		const { borderControl, onChange } = renderEditorBorderControl();

		borderControl.props.onChange({
			width: ['9px', '3px', '4px', '5px'],
			style: ['solid', 'dashed', 'dotted', 'double'],
			color: ['#111111', '#222222', '#333333', '#444444'],
		});

		expect(onChange).toHaveBeenCalledWith([
			{
				top: ['#111111', 'solid', 9],
				right: ['#222222', 'dashed', 3],
				bottom: ['#333333', 'dotted', 4],
				left: ['#444444', 'double', 5],
				unit: 'px',
			},
		]);
	});

	/**
	 * Writing a token alias into a width slot stores the alias id whole, not split on a trailing unit
	 * it doesn't have, and reading it back out (as `fromNativeBorder` would on the next render) must
	 * not append a spurious unit suffix to it either.
	 *
	 * @return {void}
	 */
	it('stores and reads back a token alias in the width slot without corrupting it', () => {
		const { borderControl, onChange } = renderEditorBorderControl();
		const alias = 'primitive.dimension.border-width.md';

		borderControl.props.onChange({
			width: [alias, '3px', '4px', '5px'],
			style: ['solid', 'dashed', 'dotted', 'double'],
			color: ['#111111', '#222222', '#333333', '#444444'],
		});

		const written = onChange.mock.calls[0][0];
		expect(written[0].top).toEqual(['#111111', 'solid', alias]);

		const { borderControl: rerendered } = renderEditorBorderControl({ value: written });
		expect(rerendered.props.value.width[0]).toBe(alias);
	});

	/**
	 * `BorderControl` never manages color; a width/style edit must read each side's EXISTING color
	 * out of the previous native value and write it back unchanged, or the very next edit would
	 * silently erase every side's color.
	 *
	 * @return {void}
	 */
	it('preserves each side existing color when writing a style edit', () => {
		const { borderControl, onChange } = renderEditorBorderControl();

		borderControl.props.onChange({
			width: ['2px', '3px', '4px', '5px'],
			style: ['none', 'dashed', 'dotted', 'double'],
			color: ['', '', '', ''], // BorderControl never populates color itself.
		});

		const written = onChange.mock.calls[0][0][0];
		expect(written.top[0]).toBe('#111111');
		expect(written.right[0]).toBe('#222222');
		expect(written.bottom[0]).toBe('#333333');
		expect(written.left[0]).toBe('#444444');
	});

	/**
	 * `renderColor` is passed straight through to `BorderControl` untouched — this component neither
	 * builds nor intercepts it. `BorderControl` calls it once with the whole color slot list it read
	 * out of `fromNativeBorder`'s output, so the caller's `renderColor` sees the same per-side colors
	 * this component derived from the native value.
	 *
	 * @return {void}
	 */
	it('passes renderColor straight through to BorderControl, called with the derived color slots', () => {
		const renderColor = jest.fn();
		const { borderControl } = renderEditorBorderControl({ renderColor });

		expect(borderControl.props.renderColor).toBe(renderColor);

		// Reproduce what BorderControl itself does: call renderColor with the color slot list from
		// the value this component built, not a value renderColor computed on its own.
		borderControl.props.renderColor({ value: borderControl.props.value.color, onChange: jest.fn() });

		expect(renderColor).toHaveBeenCalledWith({
			value: ['#111111', '#222222', '#333333', '#444444'],
			onChange: expect.any(Function),
		});
	});

	/**
	 * A genuine color edit — the write a real `renderColor` implementation performs through
	 * `BorderControl`'s `patch()`, landing back at `BorderControl`'s own `onChange` with the whole
	 * `{ width, style, color }` — reaches the native attribute, not just the pass-through value.
	 * Complements the "preserves existing color" test above by covering the write direction: an
	 * actual color change must not be discarded in favor of the stale `previousNative` color.
	 *
	 * @return {void}
	 */
	it('writes a genuine per-side color edit through to the native attribute', () => {
		const { borderControl, onChange } = renderEditorBorderControl();

		borderControl.props.onChange({
			width: ['2px', '3px', '4px', '5px'],
			style: ['solid', 'dashed', 'dotted', 'double'],
			color: ['#ffffff', '#222222', '#333333', '#444444'], // top color changed.
		});

		const written = onChange.mock.calls[0][0][0];
		expect(written.top).toEqual(['#ffffff', 'solid', 2]);
		expect(written.right).toEqual(['#222222', 'dashed', 3]);
	});
});

describe('EditorBorderControl breakpoint switching', () => {
	/**
	 * The switcher rendered by `ControlShell` drives `BorderControl`'s `onBreakpointChange` prop
	 * directly, not the `BreakpointProvider` context above it — matching `EditorBoxControl`'s own
	 * wiring exactly.
	 *
	 * @return {void}
	 */
	it('invokes onDeviceChange with the matching device when onBreakpointChange fires', () => {
		const { borderControl, onDeviceChange } = renderEditorBorderControl();

		borderControl.props.onBreakpointChange('tablet');

		expect(onDeviceChange).toHaveBeenCalledWith('Tablet');
	});

	/**
	 * Every control breakpoint key maps back to its editor device name, not just one.
	 *
	 * @return {void}
	 */
	it('maps every breakpoint key back to its editor device name', () => {
		const { borderControl, onDeviceChange } = renderEditorBorderControl();

		borderControl.props.onBreakpointChange('mobile');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Mobile');

		borderControl.props.onBreakpointChange('desktop');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Desktop');

		borderControl.props.onBreakpointChange('tablet');
		expect(onDeviceChange).toHaveBeenLastCalledWith('Tablet');
	});

	/**
	 * The `BreakpointProvider`'s own `onChange` maps breakpoints back to devices the same way as the
	 * `onBreakpointChange` prop, using the one shared mapping rather than a second copy of it.
	 *
	 * @return {void}
	 */
	it('maps the BreakpointProvider onChange consistently with onBreakpointChange', () => {
		const { provider, onDeviceChange } = renderEditorBorderControl();

		provider.props.onChange('mobile');

		expect(onDeviceChange).toHaveBeenCalledWith('Mobile');
	});

	/**
	 * The editor's `previewDevice` selects which sibling attribute is read and which setter a write
	 * goes through.
	 *
	 * @return {void}
	 */
	it('reads and writes the tablet sibling attribute when previewDevice is Tablet', () => {
		const { borderControl, onChangeTablet, onChange, onChangeMobile } = renderEditorBorderControl({
			previewDevice: 'Tablet',
			tabletValue: NATIVE_VALUE,
		});

		borderControl.props.onChange({
			width: ['9px', '3px', '4px', '5px'],
			style: ['solid', 'dashed', 'dotted', 'double'],
			color: ['#111111', '#222222', '#333333', '#444444'],
		});

		expect(onChangeTablet).toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
		expect(onChangeMobile).not.toHaveBeenCalled();
	});

	/**
	 * An unrecognized device (e.g. a future editor device this component does not know about yet)
	 * degrades to desktop rather than rendering with no breakpoint at all.
	 *
	 * @return {void}
	 */
	it('falls back to desktop for an unknown preview device', () => {
		const { provider } = renderEditorBorderControl({ previewDevice: 'Widescreen' });

		expect(provider.props.value).toBe('desktop');
	});
});

describe('EditorBorderControl unlinked rendering', () => {
	/**
	 * The native attribute is always a four-sided object, so `BorderControl`'s value always arrives
	 * as four-element width/style/color arrays — the control has nothing to collapse and renders
	 * unlinked by construction, matching `BoxControl`'s own docblock for radius.
	 *
	 * @return {void}
	 */
	it('always hands BorderControl four-element slot lists, never a scalar', () => {
		const { borderControl } = renderEditorBorderControl();

		expect(Array.isArray(borderControl.props.value.width)).toBe(true);
		expect(borderControl.props.value.width).toHaveLength(4);
		expect(Array.isArray(borderControl.props.value.style)).toBe(true);
		expect(borderControl.props.value.style).toHaveLength(4);
	});
});
