/**
 * The block editor's adapter for `src/token-controls`' `BoxControl`.
 *
 * The Style Library's adapter bridges a different storage shape; this one bridges the editor's:
 *
 * - **breakpoints are sibling attributes**, not one nested envelope — `borderRadius`,
 *   `tabletBorderRadius`, `mobileBorderRadius` — and which one is being edited is the editor's own
 *   device preview, owned by its store rather than by the control;
 * - **a slot is always a four-element array**, never collapsed to a scalar, so the link state cannot
 *   be read off the value's shape and is caller-owned UI state instead;
 * - **the unit lives in its own attribute** beside the value.
 *
 * Everything the control needs beyond that — the token pool, the inherited preset default, the
 * binding indicator — the block already computes for its existing control, so this takes them as
 * props rather than resolving them again and risking a second answer.
 */

/**
 * Internal dependencies
 */
import { BoxControl, BreakpointProvider } from '../../../token-controls';
import { TokenIndicator } from '../../token-indicators/components/TokenIndicator';

/**
 * The control's breakpoint key for an editor device name.
 *
 * The editor names its devices `Desktop`/`Tablet`/`Mobile`; the shared control speaks the lowercase
 * keys the token vocabulary uses. Mapping here keeps that spelling difference out of both.
 *
 * @since TBD
 *
 * @type {Object<string, string>}
 */
const BREAKPOINT_FOR_DEVICE = {
	Desktop: 'desktop',
	Tablet: 'tablet',
	Mobile: 'mobile',
};

/**
 * The editor device name for a control breakpoint key — the inverse of `BREAKPOINT_FOR_DEVICE`.
 *
 * @param {string} breakpoint The control's breakpoint key (`desktop`/`tablet`/`mobile`).
 *
 * @since TBD
 *
 * @return {string} The matching editor device name, defaulting to `Desktop`.
 */
function deviceForBreakpoint(breakpoint) {
	return Object.keys(BREAKPOINT_FOR_DEVICE).find((name) => BREAKPOINT_FOR_DEVICE[name] === breakpoint) ?? 'Desktop';
}

/**
 * Render a box-shaped token control over the editor's per-device attributes.
 *
 * @param {Object}    props                The component props.
 * @param {string}    props.label          The control's label.
 * @param {Array}     props.value          The active device's four-slot value.
 * @param {Function}  props.onChange       Called with the next four-slot value for the active device.
 * @param {string}    props.previewDevice  The editor's active device (`Desktop`/`Tablet`/`Mobile`).
 * @param {Function}  props.onDeviceChange Called with the next editor device name.
 * @param {Array}     props.tokens         The pickable-token list, already resolved by the block.
 * @param {*}         [props.defaultValue] The inherited preset default for this device.
 * @param {boolean}   [props.inherited]    Whether that default comes from another breakpoint.
 * @param {?Object}   [props.state]        The block's own binding state (`{ bound, overridden }`).
 * @param {?Function} [props.onReset]      Reset handler for the indicator.
 * @param {boolean}   props.isLinked       Whether the slots are edited together.
 * @param {Function}  props.onToggleLink   Toggles the link state.
 * @param {string}    [props.unit]         The unit attribute's current value.
 * @param {Array}     [props.units]        The selectable units.
 * @param {Function}  [props.onUnit]       Writes the unit attribute.
 * @param {number}    [props.min]          Custom tab minimum.
 * @param {number}    [props.max]          Custom tab maximum.
 * @param {number}    [props.step]         Custom tab increment.
 * @param {string}    [props.role]         'corners' or 'sides' — the control's geometry.
 *
 * @since TBD
 *
 * @return {JSX.Element} The control.
 */
export function EditorBoxControl({
	label,
	value,
	onChange,
	previewDevice,
	onDeviceChange,
	tokens,
	defaultValue,
	inherited = false,
	state = null,
	onReset = null,
	isLinked,
	onToggleLink,
	unit = '',
	units,
	onUnit,
	min,
	max,
	step,
	role = 'corners',
}) {
	const breakpoint = BREAKPOINT_FOR_DEVICE[previewDevice] ?? 'desktop';

	// The provider is handed the editor's device rather than holding one of its own: the device
	// preview is global here, so a switcher that tracked its own would disagree with the canvas.
	return (
		<BreakpointProvider value={breakpoint} onChange={(next) => onDeviceChange(deviceForBreakpoint(next))}>
			<BoxControl
				label={label}
				value={value}
				onChange={onChange}
				tokens={tokens}
				defaultValue={defaultValue}
				inherited={inherited}
				// The editor's own mark, not this library's: it is the same indicator the block's other
				// controls show, and two marks meaning the same thing should not look different.
				indicator={<TokenIndicator state={state} onReset={onReset} />}
				isLinked={isLinked}
				onToggleLink={onToggleLink}
				// Never collapse: the attribute is always a four-element array, so folding a uniform
				// value down to a scalar would write a shape the block cannot read back.
				collapse={false}
				role={role}
				breakpoints={Object.values(BREAKPOINT_FOR_DEVICE)}
				breakpoint={breakpoint}
				// The switcher lives in `ControlShell`, driven by this prop directly — it does not read
				// the `BreakpointProvider` context above, so both must map back to a device the same way.
				onBreakpointChange={(next) => onDeviceChange(deviceForBreakpoint(next))}
				unit={unit}
				units={units}
				onUnit={onUnit}
				min={min}
				max={max}
				step={step}
				stacked
			/>
		</BreakpointProvider>
	);
}
