/**
 * The block editor's adapter for `src/token-controls`' `ScalarControl`.
 *
 * The scalar sibling of `EditorBoxControl`, bridging the same editor storage shape for a property
 * that holds ONE value rather than four:
 *
 * - **breakpoints are sibling attributes**, not one nested envelope — `size`, `tabletSize`,
 *   `mobileSize` — and which one is being edited is the editor's own device preview, owned by its
 *   store rather than by the control;
 * - **there is nothing to link**, so no link state crosses this boundary at all;
 * - **the unit, where a block has one, lives in its own attribute** beside the value. A block whose
 *   attribute stores a bare number in one fixed unit pins it with a single-entry `units` list.
 *
 * Everything the control needs beyond that — the token pool, the inherited preset default, the
 * binding indicator — the block already computes for its existing control, so this takes them as
 * props rather than resolving them again and risking a second answer.
 */

/**
 * Internal dependencies
 */
import { BreakpointProvider, ScalarControl } from '../../../token-controls';
import { TokenIndicator } from '../../token-indicators/components/TokenIndicator';
import { BREAKPOINT_FOR_DEVICE, deviceForBreakpoint } from './breakpoints';

/**
 * Render a scalar token control over the editor's per-device attributes.
 *
 * @param {Object}    props                The component props.
 * @param {string}    props.label          The control's label.
 * @param {*}         props.value          The active device's value.
 * @param {Function}  props.onChange       Called with the next value for the active device.
 * @param {string}    props.previewDevice  The editor's active device (`Desktop`/`Tablet`/`Mobile`).
 * @param {Function}  props.onDeviceChange Called with the next editor device name.
 * @param {Array}     props.tokens         The pickable-token list, already resolved by the block.
 * @param {*}         [props.defaultValue] The inherited default for this device.
 * @param {boolean}   [props.inherited]    Whether that default comes from another breakpoint.
 * @param {?Object}   [props.state]        The block's own binding state (`{ bound, overridden }`).
 * @param {?Function} [props.onReset]      Reset handler for the indicator.
 * @param {string}    [props.unit]         The value's unit.
 * @param {Array}     [props.units]        The selectable units; a single-entry list pins the unit.
 * @param {Function}  [props.onUnit]       Writes the unit attribute.
 * @param {number}    [props.min]          Custom tab minimum.
 * @param {number}    [props.max]          Custom tab maximum.
 * @param {number}    [props.step]         Custom tab increment.
 *
 * @since TBD
 *
 * @return {JSX.Element} The control.
 */
export function EditorScalarControl({
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
	unit = '',
	units,
	onUnit,
	min,
	max,
	step,
}) {
	const breakpoint = BREAKPOINT_FOR_DEVICE[previewDevice] ?? 'desktop';
	// Named once and passed to both `BreakpointProvider` and `ControlShell`'s switcher below, so the
	// two staying in agreement is structural rather than a convention two separate lambdas could drift
	// out of.
	const changeBreakpoint = (next) => onDeviceChange(deviceForBreakpoint(next));

	// The provider is handed the editor's device rather than holding one of its own: the device
	// preview is global here, so a switcher that tracked its own would disagree with the canvas.
	return (
		<BreakpointProvider value={breakpoint} onChange={changeBreakpoint}>
			<ScalarControl
				label={label}
				value={value}
				onChange={onChange}
				tokens={tokens}
				defaultValue={defaultValue}
				inherited={inherited}
				// The editor's own mark, not this library's: it is the same indicator the block's other
				// controls show, and two marks meaning the same thing should not look different.
				indicator={<TokenIndicator state={state} onReset={onReset} />}
				breakpoints={Object.values(BREAKPOINT_FOR_DEVICE)}
				breakpoint={breakpoint}
				// The switcher lives in `ControlShell`, driven by this prop directly — it does not read
				// the `BreakpointProvider` context above, so both must map back to a device the same way.
				onBreakpointChange={changeBreakpoint}
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
