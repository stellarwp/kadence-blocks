/**
 * Per-field responsive-value state. When `field.responsive` is true, tracks this field's own
 * breakpoint and resolves `value`/`onChange` through the base-plus-`tablet`/`mobile` slot helpers
 * (`helpers/settings-schema.js`), handing back a `BreakpointSwitcher` for the `FieldLabel` trailing
 * slot. Each responsive-capable field component calls this once, so React's per-instance `useState`
 * is what keeps one field's breakpoint independent of another's — nothing is shared or lifted.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { BreakpointSwitcher } from '../components/atoms/BreakpointSwitcher';
import { BREAKPOINTS, DESKTOP_BREAKPOINT, readResponsiveSlot, writeResponsiveSlot } from '../helpers/settings-schema';

/**
 * Resolve a field's responsive-aware value/onChange/switcher.
 *
 * @param {Object}   field       The normalized field definition ({ responsive, ... }).
 * @param {*}        rawValue    The value `SettingsForm` resolved by dot path (the raw leaf).
 * @param {Function} rawOnChange `SettingsForm`'s plain `(next) => onChange(field.path, next)` callback.
 *
 * @since TBD
 *
 * @return {{value: *, onChange: Function, switcher: ?JSX.Element}} The value/onChange the field
 *         should render with, and the switcher element for the field's `FieldLabel` trailing slot
 *         (null when the field is not responsive-capable/marked).
 */
export function useResponsiveFieldValue(field, rawValue, rawOnChange) {
	const [breakpoint, setBreakpoint] = useState(DESKTOP_BREAKPOINT);

	if (!field.responsive) {
		return { value: rawValue, onChange: rawOnChange, switcher: null };
	}

	return {
		value: readResponsiveSlot(rawValue, breakpoint),
		onChange: (next) => rawOnChange(writeResponsiveSlot(rawValue, breakpoint, next)),
		switcher: <BreakpointSwitcher breakpoints={BREAKPOINTS} breakpoint={breakpoint} onChange={setBreakpoint} />,
	};
}
