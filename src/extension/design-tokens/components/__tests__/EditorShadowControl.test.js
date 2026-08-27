/* eslint-env jest */

/**
 * Internal dependencies
 */
import { EditorShadowControl, combineColorOpacity, splitColorOpacity, toNativeShadow } from '../EditorShadowControl';
import { BoxShadowControl } from '../../../../token-controls/controls/BoxShadowControl';

/**
 * A representative native shadow value — every field a different, distinguishable number/string, so a
 * round-trip that silently dropped or shuffled a field would be caught.
 *
 * @since TBD
 *
 * @type {Array}
 */
const NATIVE_VALUE = [
	{
		color: '#111111',
		opacity: 0.4,
		hOffset: 2,
		vOffset: 3,
		blur: 4,
		spread: 5,
		inset: false,
	},
];

/**
 * Call `EditorShadowControl` as a plain function and return the `BoxShadowControl` element it
 * produced. The component holds no hooks of its own — `TokenControlRow` is referenced in the returned
 * JSX but never invoked by this plain call, since JSX only builds element descriptors — so the
 * returned element tree can be inspected directly instead of mounting it, matching
 * `EditorBorderControl.test.js`'s own harness (before it gained state and needed a real render).
 *
 * @param {Object} overrides Props to override on top of the defaults.
 *
 * @since TBD
 *
 * @return {{root: Object, shadowControl: Object, onChange: Function}} The root element
 *   (`TokenControlRow`), the `BoxShadowControl` element it always renders, and the `onChange` spy
 *   passed in.
 */
function renderEditorShadowControl(overrides = {}) {
	const onChange = jest.fn();

	const props = {
		label: 'Box Shadow',
		value: NATIVE_VALUE,
		onChange,
		tokens: [],
		...overrides,
	};

	const root = EditorShadowControl(props);
	const shadowControl = root.props.children;

	return {
		root,
		shadowControl,
		onChange,
	};
}

describe('EditorShadowControl native <-> BoxShadowControl value bridging', () => {
	/**
	 * `fromNativeShadow` is exercised indirectly through the `value` handed to `BoxShadowControl`: field
	 * names are translated (`hOffset`/`vOffset` to `offsetX`/`offsetY`), numbers become `"Npx"` strings,
	 * and a partially-transparent color folds its `opacity` into an `rgba(...)` string.
	 *
	 * @return {void}
	 */
	it('converts the native shape to the composite BoxShadowControl expects, folding opacity into color', () => {
		const { shadowControl } = renderEditorShadowControl();

		expect(shadowControl.props.value).toEqual({
			color: 'rgba(17, 17, 17, 0.4)',
			offsetX: '2px',
			offsetY: '3px',
			blur: '4px',
			spread: '5px',
			inset: false,
		});
	});

	/**
	 * A fully opaque native color is passed through as a plain hex literal, never wrapped in
	 * `rgba(...)`, matching what a plain `PopColorControl` without opacity would already produce.
	 *
	 * @return {void}
	 */
	it('keeps a fully-opaque color as a plain hex literal, unwrapped', () => {
		const { shadowControl } = renderEditorShadowControl({
			value: [{ color: '#222222', opacity: 1, hOffset: 0, vOffset: 0, blur: 0, spread: 0, inset: false }],
		});

		expect(shadowControl.props.value.color).toBe('#222222');
	});

	/**
	 * A missing native value reads as the composite's default shape rather than crashing on
	 * `undefined[0]`.
	 *
	 * @return {void}
	 */
	it('reads an unset native value as the composite default', () => {
		const { shadowControl } = renderEditorShadowControl({ value: undefined });

		expect(shadowControl.props.value).toEqual({
			color: '#000000',
			offsetX: '0px',
			offsetY: '0px',
			blur: '0px',
			spread: '0px',
			inset: false,
		});
	});

	/**
	 * Editing the composite writes the native shape back with every field translated to its native
	 * name/type — the round-trip must be lossless for a representative value, including the
	 * color/opacity fold-back.
	 *
	 * @return {void}
	 */
	it('round-trips a representative native value losslessly through a composite edit', () => {
		const { shadowControl, onChange } = renderEditorShadowControl();

		shadowControl.props.onChange({
			color: 'rgba(17, 17, 17, 0.4)',
			offsetX: '9px',
			offsetY: '3px',
			blur: '4px',
			spread: '5px',
			inset: false,
		});

		expect(onChange).toHaveBeenCalledWith([
			{
				color: '#111111',
				opacity: 0.4,
				hOffset: 9,
				vOffset: 3,
				blur: 4,
				spread: 5,
				inset: false,
			},
		]);
	});

	/**
	 * Toggling `inset` on writes it through unchanged, alongside the rest of the value.
	 *
	 * @return {void}
	 */
	it('writes an inset edit through to the native attribute', () => {
		const { shadowControl, onChange } = renderEditorShadowControl();

		shadowControl.props.onChange({
			color: 'rgba(17, 17, 17, 0.4)',
			offsetX: '2px',
			offsetY: '3px',
			blur: '4px',
			spread: '5px',
			inset: true,
		});

		const written = onChange.mock.calls[0][0][0];
		expect(written.inset).toBe(true);
	});

	/**
	 * Picking a token alias in the Style Library tab resolves it to its literal composite value
	 * immediately, via the `tokens` list, and writes that literal into the native item — no `alias`
	 * key, no live link back to the token.
	 *
	 * @return {void}
	 */
	it('resolves a picked token alias to its literal composite value, not an alias marker', () => {
		const { shadowControl, onChange } = renderEditorShadowControl({
			tokens: [
				{
					id: 'primitive.shadow.md',
					alias: 'primitive.shadow.md',
					label: 'Medium',
					value: '2px 3px 4px 5px #111111',
					type: 'shadow',
				},
			],
		});

		shadowControl.props.onChange('primitive.shadow.md');

		expect(onChange).toHaveBeenCalledWith([
			{
				color: '#111111',
				opacity: 1,
				hOffset: 2,
				vOffset: 3,
				blur: 4,
				spread: 5,
				inset: false,
			},
		]);
		expect(onChange.mock.calls[0][0][0]).not.toHaveProperty('alias');
	});

	/**
	 * Picking the shared fixed "None" sentinel resolves it to the zero native shadow item, the same
	 * way any other `fixed` tokens-list entry resolves generically by `alias` match — no special-casing
	 * needed in `toNativeShadow` itself.
	 *
	 * @return {void}
	 */
	it('resolves a fixed None pick to the zero native shadow item', () => {
		const noneToken = {
			id: 'ss-none-shadow',
			label: 'None',
			value: '0px 0px 0px 0px transparent',
			alias: '0px 0px 0px 0px transparent',
			fixed: true,
			type: 'shadow',
			role: 'shadow',
		};

		expect(toNativeShadow(noneToken.alias, [noneToken])).toEqual([
			{ color: 'transparent', opacity: 1, hOffset: 0, vOffset: 0, blur: 0, spread: 0, inset: false },
		]);
	});

	/**
	 * An alias that resolves to nothing (a stale or unmapped token id) falls back to the composite
	 * default rather than corrupting the native item or leaving it unwritten.
	 *
	 * @return {void}
	 */
	it('falls back to the composite default when a picked alias matches no pickable token', () => {
		const { shadowControl, onChange } = renderEditorShadowControl({ tokens: [] });

		shadowControl.props.onChange('primitive.shadow.unknown');

		expect(onChange).toHaveBeenCalledWith([
			{
				color: '#000000',
				opacity: 1,
				hOffset: 0,
				vOffset: 0,
				blur: 0,
				spread: 0,
				inset: false,
			},
		]);
	});
});

describe('EditorShadowControl always renders, with no enable toggle', () => {
	/**
	 * `BoxShadowControl` always renders — there is no separate enable toggle gating it, and no
	 * sibling boolean attribute involved.
	 *
	 * @return {void}
	 */
	it('always renders BoxShadowControl, with no enable toggle', () => {
		const { root, shadowControl } = renderEditorShadowControl();

		expect(shadowControl.type).toBe(BoxShadowControl);
		expect(root.props.children).toBe(shadowControl);
	});

	/**
	 * The control's `label` is passed straight through to `BoxShadowControl` — there is no separate
	 * header row that used to carry it alongside the (now removed) enable toggle.
	 *
	 * @return {void}
	 */
	it('passes label straight through to BoxShadowControl', () => {
		const { shadowControl } = renderEditorShadowControl({ label: 'Box Shadow' });

		expect(shadowControl.props.label).toBe('Box Shadow');
	});
});

describe('EditorShadowControl renderColor wiring', () => {
	/**
	 * `renderColor` is passed straight through to `BoxShadowControl` untouched — this component neither
	 * builds nor intercepts it. `BoxShadowControl` calls it with the composite's `color` slot this
	 * component derived from the native value, so the caller's `renderColor` sees the combined
	 * color/opacity string, not the raw native pair.
	 *
	 * @return {void}
	 */
	it('passes renderColor straight through to BoxShadowControl, called with the derived color', () => {
		const renderColor = jest.fn();
		const { shadowControl } = renderEditorShadowControl({ renderColor });

		expect(shadowControl.props.renderColor).toBe(renderColor);

		shadowControl.props.renderColor({ value: shadowControl.props.value.color, onChange: jest.fn() });

		expect(renderColor).toHaveBeenCalledWith({
			value: 'rgba(17, 17, 17, 0.4)',
			onChange: expect.any(Function),
		});
	});
});

describe('combineColorOpacity / splitColorOpacity', () => {
	/**
	 * A partially-transparent color combines into an `rgba(...)` string that `splitColorOpacity`
	 * reads back apart into the exact same hex/opacity pair — the two directions must agree with each
	 * other, not just with `EditorShadowControl`'s own internal use of them.
	 *
	 * @return {void}
	 */
	it('round-trips a partially-transparent color through combine and split', () => {
		const combined = combineColorOpacity('#3182ce', 0.5);

		expect(combined).toBe('rgba(49, 130, 206, 0.5)');
		expect(splitColorOpacity(combined)).toEqual({ color: '#3182ce', opacity: 0.5 });
	});

	/**
	 * A fully opaque color is never wrapped, and splitting a plain hex back reports full opacity.
	 *
	 * @return {void}
	 */
	it('leaves a fully-opaque color unwrapped and reports full opacity on split', () => {
		expect(combineColorOpacity('#3182ce', 1)).toBe('#3182ce');
		expect(splitColorOpacity('#3182ce')).toEqual({ color: '#3182ce', opacity: 1 });
	});

	/**
	 * An empty color combines/splits to an empty color rather than throwing, so a not-yet-set shadow
	 * value renders without a crash.
	 *
	 * @return {void}
	 */
	it('handles an empty color without throwing', () => {
		expect(combineColorOpacity('', 0.5)).toBe('');
		expect(splitColorOpacity('')).toEqual({ color: '', opacity: 1 });
	});

	/**
	 * A non-hex CSS color literal (a custom property reference, `transparent`, or an existing
	 * `rgba(...)` string) is never routed through `hexToRgba` — combining it with a partial opacity
	 * would otherwise read every RGB channel as `NaN || 0` and silently produce black.
	 *
	 * @return {void}
	 */
	it('leaves a color it cannot decode into channels unconverted rather than corrupting it to black', () => {
		expect(combineColorOpacity('var(--palette-color)', 0.5)).toBe('var(--palette-color)');
		expect(combineColorOpacity('transparent', 0.5)).toBe('transparent');
	});

	/**
	 * Unlike `var(...)`/named colors, `rgb(...)` already carries decodable channels, so its opacity
	 * is not lost the way a genuinely opaque-reference color's is — it round-trips through combine and
	 * split exactly like a hex color does.
	 *
	 * @return {void}
	 */
	it('folds opacity into an rgb(...) color and round-trips it losslessly', () => {
		const combined = combineColorOpacity('rgb(10, 20, 30)', 0.5);

		expect(combined).toBe('rgba(10, 20, 30, 0.5)');
		expect(splitColorOpacity(combined)).toEqual({ color: '#0a141e', opacity: 0.5 });
	});

	/**
	 * An 8-digit hex (`#RRGGBBAA`) — the shape a resolved shadow token's color can arrive as — carries
	 * its own alpha in the trailing pair. Splitting it must decode that alpha rather than reporting the
	 * whole 8-digit string as an opaque color.
	 *
	 * @return {void}
	 */
	it('decodes an 8-digit hex color into its base color and embedded alpha', () => {
		expect(splitColorOpacity('#1717171f')).toEqual({ color: '#171717', opacity: 0x1f / 255 });
	});
});
