/* eslint-env jest */

/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { EditorBorderControl } from '../EditorBorderControl';
import { TokenIndicator } from '../../../token-indicators/components/TokenIndicator';

// `BorderControl` now gains its `isLinked`/`onToggleLink` props from state this component owns, so
// it can no longer be exercised by calling `EditorBorderControl` as a plain function the way this file
// used to — hooks only work inside a real render. `BorderControl` itself is stood in for here (rather
// than mocking `@wordpress/components`, the way `border-control.test.js` has to) because these tests
// only care what props reach it, not how it renders them; capturing props on every render keeps the
// rest of this file's assertions the same shape they were before.
let latestBorderControlProps = null;

jest.mock('../../../../token-controls/controls/BorderControl', () => ({
	BorderControl: (props) => {
		latestBorderControlProps = props;
		return null;
	},
}));

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
 * A representative native border value with every side identical — the shape `isUniformBorder`
 * reads as linked.
 *
 * @since TBD
 *
 * @type {Array}
 */
const UNIFORM_NATIVE_VALUE = [
	{
		top: ['#111111', 'solid', 2],
		right: ['#111111', 'solid', 2],
		bottom: ['#111111', 'solid', 2],
		left: ['#111111', 'solid', 2],
		unit: 'px',
	},
];

let container;
let root;

beforeEach(() => {
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
	latestBorderControlProps = null;
});

afterEach(() => {
	act(() => {
		root.unmount();
	});
	container.remove();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Render `EditorBorderControl` and return the props its (stood-in) `BorderControl` received, plus
 * the setter spies passed in.
 *
 * @param {Object} overrides Props to override on top of the defaults.
 *
 * @since TBD
 *
 * @return {{borderControl: {props: Object}, onChange: Function, onChangeTablet: Function,
 *   onChangeMobile: Function, onDeviceChange: Function}} The captured `BorderControl` props (wrapped
 *   to match this file's previous `element.props` shape) and the setter spies passed in.
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

	act(() => {
		root.render(createElement(EditorBorderControl, props));
	});

	return {
		borderControl: { props: latestBorderControlProps },
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

		act(() => {
			borderControl.props.onChange({
				width: ['9px', '3px', '4px', '5px'],
				style: ['solid', 'dashed', 'dotted', 'double'],
				color: ['#111111', '#222222', '#333333', '#444444'],
			});
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
		const alias = '{primitive.dimension.border-width.md}';

		act(() => {
			borderControl.props.onChange({
				width: [alias, '3px', '4px', '5px'],
				style: ['solid', 'dashed', 'dotted', 'double'],
				color: ['#111111', '#222222', '#333333', '#444444'],
			});
		});

		const written = onChange.mock.calls[0][0];
		expect(written[0].top).toEqual(['#111111', 'solid', alias]);

		const { borderControl: rerendered } = renderEditorBorderControl({ value: written });
		expect(rerendered.props.value.width[0]).toBe(alias);
	});

	/**
	 * A width/style-only edit carries `value.color` forward unchanged, because `BorderControl`'s own
	 * `patch()` merges `{ ...value, ...next }` — the width/style write never touches `color`, so the
	 * `next` it hands to `onChange` still has the real colors `fromNativeBorder` derived. This is the
	 * realistic shape of that call (not blanked-out colors — see the clear-color test below for why
	 * that used to matter).
	 *
	 * @return {void}
	 */
	it('preserves each side existing color when writing a style edit', () => {
		const { borderControl, onChange } = renderEditorBorderControl();

		act(() => {
			borderControl.props.onChange({
				width: ['2px', '3px', '4px', '5px'],
				style: ['none', 'dashed', 'dotted', 'double'],
				color: ['#111111', '#222222', '#333333', '#444444'], // Carried forward by BorderControl's merge.
			});
		});

		const written = onChange.mock.calls[0][0][0];
		expect(written.top[0]).toBe('#111111');
		expect(written.right[0]).toBe('#222222');
		expect(written.bottom[0]).toBe('#333333');
		expect(written.left[0]).toBe('#444444');
	});

	/**
	 * Clearing a side's color (a real `renderColor` implementation calling its `onChange` with `''`)
	 * must write `''` to the native attribute, not silently keep the stale color — `value.color` is
	 * always authoritative, so `toNativeBorder` must not fall back to `previousNative`'s color on a
	 * falsy value the way an earlier version of this function did.
	 *
	 * @return {void}
	 */
	it('writes an empty string when a side color is cleared, rather than keeping the stale color', () => {
		const { borderControl, onChange } = renderEditorBorderControl();

		act(() => {
			borderControl.props.onChange({
				width: ['2px', '3px', '4px', '5px'],
				style: ['solid', 'dashed', 'dotted', 'double'],
				color: ['', '#222222', '#333333', '#444444'], // Top color cleared.
			});
		});

		const written = onChange.mock.calls[0][0][0];
		expect(written.top[0]).toBe('');
		expect(written.right[0]).toBe('#222222');
	});

	/**
	 * `defaultValue` is passed straight through to `BorderControl` — the caller (`singlebtn/edit.js`)
	 * resolves the active preset's border width; this component neither computes nor reshapes it.
	 *
	 * @return {void}
	 */
	it('passes defaultValue straight through to BorderControl', () => {
		const { borderControl } = renderEditorBorderControl({ defaultValue: '2px' });

		expect(borderControl.props.defaultValue).toBe('2px');
	});

	/**
	 * A `defaultValue` of `0` (a real, meaningful preset value) passes through unchanged rather than
	 * being falsy-collapsed to `undefined` on the way to `BorderControl`.
	 *
	 * @return {void}
	 */
	it('passes a zero defaultValue through rather than dropping it', () => {
		const { borderControl } = renderEditorBorderControl({ defaultValue: '0px' });

		expect(borderControl.props.defaultValue).toBe('0px');
	});

	/**
	 * `renderColor` is passed straight through to `BorderControl` untouched — this component neither
	 * builds nor intercepts it. `BorderControl` calls it once per row (not once with the whole color
	 * slot list) with that row's own scalar color and its bare side name as `label`, so the caller's
	 * `renderColor` sees the same per-side colors this component derived from the native value, one
	 * side at a time.
	 *
	 * @return {void}
	 */
	it("passes renderColor straight through to BorderControl, called once per row with that row's own color and side label", () => {
		const renderColor = jest.fn();
		const { borderControl } = renderEditorBorderControl({ renderColor });

		expect(borderControl.props.renderColor).toBe(renderColor);

		// Reproduce what BorderControl itself does per row (see BorderControl.js's `renderSlot`): call
		// renderColor once per side with that side's own scalar out of the color slot list this
		// component built, plus the bare side name as `label`, rather than one call with the whole
		// four-element list.
		const colors = borderControl.props.value.color;
		['top', 'right', 'bottom', 'left'].forEach((side, index) => {
			borderControl.props.renderColor({ value: colors[index], onChange: jest.fn(), label: side });
		});

		expect(renderColor).toHaveBeenNthCalledWith(1, {
			value: '#111111',
			onChange: expect.any(Function),
			label: 'top',
		});
		expect(renderColor).toHaveBeenNthCalledWith(2, {
			value: '#222222',
			onChange: expect.any(Function),
			label: 'right',
		});
		expect(renderColor).toHaveBeenNthCalledWith(3, {
			value: '#333333',
			onChange: expect.any(Function),
			label: 'bottom',
		});
		expect(renderColor).toHaveBeenNthCalledWith(4, {
			value: '#444444',
			onChange: expect.any(Function),
			label: 'left',
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

		act(() => {
			borderControl.props.onChange({
				width: ['2px', '3px', '4px', '5px'],
				style: ['solid', 'dashed', 'dotted', 'double'],
				color: ['#ffffff', '#222222', '#333333', '#444444'], // top color changed.
			});
		});

		const written = onChange.mock.calls[0][0][0];
		expect(written.top).toEqual(['#ffffff', 'solid', 2]);
		expect(written.right).toEqual(['#222222', 'dashed', 3]);
	});
});

describe('EditorBorderControl breakpoint switching', () => {
	/**
	 * `BorderControl`'s `onBreakpointChange` and the `BreakpointProvider` context above it are wired
	 * to the same `changeBreakpoint` function, so exercising one exercises the other; invoking it maps
	 * the control breakpoint key back to the matching editor device name.
	 *
	 * @return {void}
	 */
	it('invokes onDeviceChange with the matching device when onBreakpointChange fires', () => {
		const { borderControl, onDeviceChange } = renderEditorBorderControl();

		act(() => {
			borderControl.props.onBreakpointChange('tablet');
		});

		expect(onDeviceChange).toHaveBeenCalledWith('Tablet');
	});

	/**
	 * Every control breakpoint key maps back to its editor device name, not just one.
	 *
	 * @return {void}
	 */
	it('maps every breakpoint key back to its editor device name', () => {
		const { borderControl, onDeviceChange } = renderEditorBorderControl();

		act(() => {
			borderControl.props.onBreakpointChange('mobile');
		});
		expect(onDeviceChange).toHaveBeenLastCalledWith('Mobile');

		act(() => {
			borderControl.props.onBreakpointChange('desktop');
		});
		expect(onDeviceChange).toHaveBeenLastCalledWith('Desktop');

		act(() => {
			borderControl.props.onBreakpointChange('tablet');
		});
		expect(onDeviceChange).toHaveBeenLastCalledWith('Tablet');
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

		act(() => {
			borderControl.props.onChange({
				width: ['9px', '3px', '4px', '5px'],
				style: ['solid', 'dashed', 'dotted', 'double'],
				color: ['#111111', '#222222', '#333333', '#444444'],
			});
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
		const { borderControl } = renderEditorBorderControl({ previewDevice: 'Widescreen' });

		expect(borderControl.props.breakpoint).toBe('desktop');
	});
});

describe('EditorBorderControl unlinked rendering', () => {
	/**
	 * The native attribute is always a four-sided object, so `BorderControl`'s value always arrives
	 * as four-element width/style/color arrays — collapsing them to one row is `isLinked`'s job now,
	 * not a shape the value itself can ever take on.
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

describe('EditorBorderControl linked view', () => {
	/**
	 * A breakpoint that has never stored anything has nothing to differ side to side, so it opens
	 * linked — matching an unlinked-but-uniform value below, and the unset-value test in the bridging
	 * suite above.
	 *
	 * @return {void}
	 */
	it('reads an unset value as linked', () => {
		const { borderControl } = renderEditorBorderControl({ previewDevice: 'Tablet', tabletValue: undefined });

		expect(borderControl.props.isLinked).toBe(true);
	});

	/**
	 * Four sides that already agree on color, style, and width read as linked, even though the native
	 * shape storing them is the same four-element arrays an actually-diverging value would use —
	 * `isLinked` is derived from whether the sides agree, not from the shape alone.
	 *
	 * @return {void}
	 */
	it('reads a uniform four-sided value as linked', () => {
		const { borderControl } = renderEditorBorderControl({ value: UNIFORM_NATIVE_VALUE });

		expect(borderControl.props.isLinked).toBe(true);
	});

	/**
	 * Four sides that disagree on any of color, style, or width read as unlinked.
	 *
	 * @return {void}
	 */
	it('reads a diverging four-sided value as unlinked', () => {
		const { borderControl } = renderEditorBorderControl({ value: NATIVE_VALUE });

		expect(borderControl.props.isLinked).toBe(false);
	});

	/**
	 * Toggling link while unlinked collapses every side to the top side's value — matching
	 * `BorderControl`'s own uncontrolled relink rule — and once that collapsed value comes back
	 * through `value` (as it would from a real `setAttributes` round trip), the control derives
	 * linked from the now-uniform sides on its own, with no override forcing it.
	 *
	 * @return {void}
	 */
	it('collapses every side to the top side value when relinking a diverging border', () => {
		const { borderControl, onChange } = renderEditorBorderControl({ value: NATIVE_VALUE });

		expect(borderControl.props.isLinked).toBe(false);

		act(() => {
			borderControl.props.onToggleLink();
		});

		const collapsed = [
			{
				top: ['#111111', 'solid', 2],
				right: ['#111111', 'solid', 2],
				bottom: ['#111111', 'solid', 2],
				left: ['#111111', 'solid', 2],
				unit: 'px',
			},
		];
		expect(onChange).toHaveBeenCalledWith(collapsed);

		const { borderControl: rerendered } = renderEditorBorderControl({ value: collapsed });
		expect(rerendered.props.isLinked).toBe(true);
	});

	/**
	 * A relink's optimistic override does not survive a value that arrives back still diverging (e.g.
	 * an undo restoring the four original sides right after the relink) — the control must fall back
	 * to deriving from the real value rather than keep insisting the border is linked.
	 *
	 * @return {void}
	 */
	it('stops reporting linked once a relink is followed by a still-diverging value', () => {
		const { borderControl } = renderEditorBorderControl({ value: NATIVE_VALUE });

		act(() => {
			borderControl.props.onToggleLink();
		});

		const { borderControl: rerendered } = renderEditorBorderControl({ value: NATIVE_VALUE, label: 'Border' });
		expect(rerendered.props.isLinked).toBe(false);
	});

	/**
	 * Toggling link while a uniform border is linked switches the view to unlinked without writing
	 * anything — the four sides already agree, so there is nothing to collapse; only the view changes,
	 * exactly the behavior Border Radius's own link toggle already has and this control lacked before.
	 *
	 * @return {void}
	 */
	it('unlinks a uniform border into the per-side grid without writing a change', () => {
		const { borderControl, onChange } = renderEditorBorderControl({ value: UNIFORM_NATIVE_VALUE });

		expect(borderControl.props.isLinked).toBe(true);

		act(() => {
			borderControl.props.onToggleLink();
		});

		expect(onChange).not.toHaveBeenCalled();
		expect(latestBorderControlProps.isLinked).toBe(false);
	});

	/**
	 * The unlinked view, once explicitly chosen, survives an incidental re-render with the same
	 * uniform value (e.g. a parent re-render that changes an unrelated prop) — an explicit choice is
	 * not something a value that merely stayed the same should silently revert.
	 *
	 * @return {void}
	 */
	it('keeps an explicit unlink across a re-render with the same uniform value', () => {
		const { borderControl } = renderEditorBorderControl({ value: UNIFORM_NATIVE_VALUE });

		act(() => {
			borderControl.props.onToggleLink();
		});

		renderEditorBorderControl({ value: UNIFORM_NATIVE_VALUE, label: 'Border' });

		expect(latestBorderControlProps.isLinked).toBe(false);
	});

	/**
	 * Each breakpoint's explicit link choice is independent — unlinking Desktop must not leave Tablet
	 * stuck unlinked too, since the two are edited through entirely separate control instances in
	 * practice and only share this component's state because a test re-renders the same instance.
	 *
	 * @return {void}
	 */
	it('tracks the linked override per breakpoint independently', () => {
		const { borderControl } = renderEditorBorderControl({ value: UNIFORM_NATIVE_VALUE });

		act(() => {
			borderControl.props.onToggleLink();
		});
		expect(latestBorderControlProps.isLinked).toBe(false);

		renderEditorBorderControl({
			previewDevice: 'Tablet',
			value: UNIFORM_NATIVE_VALUE,
			tabletValue: UNIFORM_NATIVE_VALUE,
		});
		expect(latestBorderControlProps.isLinked).toBe(true);
	});
});

describe('EditorBorderControl token indicator', () => {
	/**
	 * `state`/`onReset` are threaded into a `TokenIndicator`, passed to `BorderControl` as its
	 * `indicator` prop — the same wiring `EditorBoxControl` uses for Border Radius — so the block's
	 * own binding state reaches the indicator rather than being dropped on the floor.
	 *
	 * @return {void}
	 */
	it('passes state and onReset through to a TokenIndicator handed to BorderControl as indicator', () => {
		const onReset = jest.fn();
		const state = { bound: true, overridden: true };

		const { borderControl } = renderEditorBorderControl({ state, onReset });

		expect(borderControl.props.indicator.type).toBe(TokenIndicator);
		expect(borderControl.props.indicator.props.state).toBe(state);
		expect(borderControl.props.indicator.props.onReset).toBe(onReset);
	});

	/**
	 * With no `state`/`onReset` passed, the indicator still renders (as `TokenIndicator` renders
	 * nothing for an unbound control), rather than `EditorBorderControl` omitting it altogether.
	 *
	 * @return {void}
	 */
	it('still hands BorderControl a TokenIndicator when state and onReset are omitted', () => {
		const { borderControl } = renderEditorBorderControl();

		expect(borderControl.props.indicator.type).toBe(TokenIndicator);
		expect(borderControl.props.indicator.props.state).toBeNull();
	});
});

describe('EditorBorderControl unset width', () => {
	/**
	 * A completely untouched border stays unset rather than being filled in with the fallback: the
	 * control shows that fallback MUTED (via `defaultValue`) instead, so an unset width reads as
	 * "Default"/"Inherited" rather than claiming an override nobody made.
	 *
	 * @return {void}
	 */
	it('leaves the width unset and passes the fallback through as the muted default', () => {
		const { borderControl } = renderEditorBorderControl({ value: undefined, defaultValue: '1px' });

		expect(borderControl.props.value.width).toBe('');
		expect(borderControl.props.defaultValue).toBe('1px');
	});

	/**
	 * A stored width is never overridden by the fallback, even when the two disagree.
	 *
	 * @return {void}
	 */
	it('keeps a genuinely stored width, ignoring the fallback', () => {
		const { borderControl } = renderEditorBorderControl({ value: NATIVE_VALUE, defaultValue: '1px' });

		expect(borderControl.props.value.width).toEqual(['2px', '3px', '4px', '5px']);
	});

	/**
	 * With no fallback at all, an unset width stays unset.
	 *
	 * @return {void}
	 */
	it('leaves an unset width unset when there is no fallback either', () => {
		const { borderControl } = renderEditorBorderControl({ value: undefined, defaultValue: undefined });

		expect(borderControl.props.value.width).toBe('');
	});
});
