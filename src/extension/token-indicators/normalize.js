/**
 * Kind-aware value normalization for the design-token indicator's bound-vs-overridden compare.
 *
 * A control's stored attribute value and the selected preset's resolved value are compared after being
 * reduced to a canonical form per `kind`:
 *   - `color`        — a Kadence palette slug (`palette3`) is resolved to its literal via the global
 *                      palette map, then lower-cased; a literal (`#3182CE`, `rgb(...)`) is lower-cased.
 *   - `dimension`    — the numeric value is paired with its unit (`{ value, unit }`), tolerant of the
 *                      4-side array shape a measurement control writes.
 *   - `text`         — trimmed string compare.
 *   - `border-width` \
 *   - `border-style`  | — read ONE axis (width, style or color) out of `EditorBorderControl`'s nested
 *   - `border-color` / per-side native shape (`[{ top: [color, style, size], right: [...], ... }]`),
 *                      compared uniformly across all four sides. The three axes share one native
 *                      attribute (`borderStyle`), so `usePresetBinding` calls each of these once per
 *                      axis and combines the results — see its own docblock.
 *
 * The per-kind logic itself lives in the `kinds/` modules (`kinds/dimension.js`, `kinds/color.js`,
 * `kinds/text.js`, `kinds/border.js`); this module is only the dispatch table plus the two thin wrappers
 * (`isEmptyValue`, `matchesPreset`) every caller reaches it through.
 */

import * as dimension from './kinds/dimension';
import * as border from './kinds/border';
import { normalizeColor } from './kinds/color';
import { normalizeText } from './kinds/text';

export { normalizeColor } from './kinds/color';
export { normalizeText } from './kinds/text';
export {
	dimensionSlots,
	presetSlotAt,
	presetValueForDevice,
	measureAttrsForDevice,
	inheritedMeasureSlots,
	anyCornerInherited,
	deriveMeasureMode,
	normalizeDimension,
} from './kinds/dimension';

/**
 * The `color` kind's `isEmpty`/`matches` pair for the `KINDS` dispatch table below. Empty is the same
 * "nothing resolves for either reading" check the `text` kind uses, since a mapped control's kind can be
 * generic ('color') for a value that is really a bare string — see `isEmptyValue`'s original combined
 * check.
 *
 * @since TBD
 *
 * @type {{ isEmpty: Function, matches: Function }}
 */
const color = {
	isEmpty: (value) => normalizeColor(value) === '' && normalizeText(value) === '',
	matches: (value, unit, presetValue) => normalizeColor(value) === normalizeColor(presetValue),
};

/**
 * The `text` kind's `isEmpty`/`matches` pair for the `KINDS` dispatch table below.
 *
 * @since TBD
 *
 * @type {{ isEmpty: Function, matches: Function }}
 */
const text = {
	isEmpty: (value) => normalizeColor(value) === '' && normalizeText(value) === '',
	matches: (value, unit, presetValue) => normalizeText(value) === normalizeText(presetValue),
};

/**
 * The per-kind `{ isEmpty, matches }` handlers `isEmptyValue`/`matchesPreset` dispatch through. The three
 * border axes share one handler — `EditorBorderControl`'s native shape is axis-agnostic, and `border`'s
 * own `matches` takes the kind as its first argument to know which axis to read.
 *
 * @since TBD
 *
 * @type {Object<string, Object>}
 */
const KINDS = {
	dimension,
	color,
	text,
	'border-width': border,
	'border-style': border,
	'border-color': border,
};

/**
 * The `{ isEmpty, matches }` handler for a kind, falling back to `text` for a kind the localized
 * catalog carries that this dispatch table has no entry for — the catalog's `kind` values come from
 * PHP's registry and are not narrowed to this table's keys at write time, so an unrecognized value must
 * degrade to a safe comparison rather than throw.
 *
 * @param {string} kind The property kind.
 *
 * @since TBD
 *
 * @return {{ isEmpty: Function, matches: Function }} The handler to dispatch through.
 */
function handlerFor(kind) {
	return KINDS[kind] || text;
}

/**
 * Whether a stored attribute value is "empty" (untouched) for its kind — the signal a retarget-bound
 * control uses for `empty => bound`.
 *
 * @param {string} kind  The property kind ('color' | 'dimension' | 'text' | 'border-width' |
 *                       'border-style' | 'border-color').
 * @param {*}      value The stored primary attribute value.
 *
 * An unrecognized `kind` falls back to the `text` kind's handler rather than throwing — PHP's
 * `Preset_Bindings::kind()` can return a kind this module has no `KINDS` entry for yet (e.g.
 * `'shadow'`, before its own dispatch entry lands), and a `TypeError` here would crash the editor
 * render rather than merely mis-marking the indicator.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is unset/empty.
 */
export function isEmptyValue(kind, value) {
	return handlerFor(kind).isEmpty(value);
}

/**
 * Whether a stored value equals the selected preset's resolved value, normalized per kind.
 *
 * @param {string} kind        The property kind.
 * @param {*}      value       The stored primary attribute value.
 * @param {string} unit        The companion unit (dimension only; '' otherwise).
 * @param {string} presetValue The preset's resolved literal for this property.
 *
 * An unrecognized `kind` falls back to the `text` kind's handler, matching `isEmptyValue`'s own
 * fallback — see its docblock for why.
 *
 * @since TBD
 *
 * @return {boolean} True when the stored value matches the preset value.
 */
export function matchesPreset(kind, value, unit, presetValue) {
	if (kind in border.BORDER_AXIS_INDEX) {
		return border.matches(kind, value, unit, presetValue);
	}

	return handlerFor(kind).matches(value, unit, presetValue);
}
