/**
 * The Style Library's adapter for `src/token-controls`' `BoxShadowControl`.
 *
 * Named `BoxShadowField` rather than reusing the `shadow` field type or `ShadowField.js`: those
 * already back the Shadow token-library screen's own settings panel (`ShadowScreen.js`'s
 * `valueField: { type: 'shadow', ... }`, read through `SettingsForm`/`fieldComponentFor` — the same
 * `FIELD_TYPES` registry this file's field is added to, via `ScaleSettings`'s
 * `scaleValueField(config.valueField)`). `ShadowField` is a raw composite editor with no token
 * concept at all; `BoxShadowControl` is a different, token-aware component. One `FIELD_TYPES` key
 * can only point at one component, so the Button panel's field is registered under a different
 * key — `box-shadow` — instead of overwriting `shadow`. `ShadowField.js` and the Shadow screen it
 * backs are untouched by this change.
 *
 * Not responsive: the Button preset's Border and Shadow panel offers no breakpoint switcher for
 * shadow, so this adapter reads and writes `field.path`'s value directly, with no breakpoint
 * envelope — unlike `BorderField`/`BoxTokenField`.
 *
 * Color is out of this plan's scope, exactly as in `BorderField`: `renderColor` wraps the same
 * `TokenColorSelectField` the Button screen's Color panel already renders.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { pickableTokensForType } from '../../../helpers/tokens';
import { BoxShadowControl } from '../../../../token-controls/controls/BoxShadowControl';
import { boundTokenIds } from './BoxTokenField';
import { isTokenAlias } from '../../../../token-controls/helpers/token-summary';
import { TokenColorSelectField } from './TokenColorSelectField';

/**
 * The bound token id, unwrapped from its brace-wrapped alias, or unset when `value` holds a
 * composite shadow object instead. `boundTokenIds` (shared with `BorderField`) expects the bare
 * `primitive.`/`semantic.`-prefixed id a preset's own `tokens` map stores; this field's `value`
 * carries the brace-wrapped alias `BoxShadowControl` matches against instead (see this file's own
 * docblock — no envelope, no per-slot conversion), so the brace has to come off first. A composite
 * object is not an alias at all and passes through unwrapped, matching `boundTokenIds`'
 * non-string, non-list values with an empty exemption set.
 *
 * @param {*} value The stored value: a token alias, or a composite shadow object.
 *
 * @since TBD
 *
 * @return {Array<string>} The bound token ids, empty when nothing is bound.
 */
function boundShadowTokenIds(value) {
	return boundTokenIds(isTokenAlias(value) ? value.slice(1, -1) : value);
}

/**
 * Whether a stored shadow is bound to a SEMANTIC token, which this field shows as unset rather than
 * as a selection — see the reasoning in `BoxShadowField` below and in `withoutSemanticSlots`.
 *
 * Takes the brace-wrapped alias this field's value carries, unlike `withoutSemanticSlots`, which
 * works on the bare ids a box field's slots hold.
 *
 * @param {*} value The stored value: a token alias, or a composite shadow object.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is a semantic alias.
 */
function isSemanticShadow(value) {
	return isTokenAlias(value) && value.slice(1, -1).startsWith('semantic.');
}

/**
 * Render a box-shadow field from a settings schema entry.
 *
 * @param {Object}  props                  The component props.
 * @param {Object}  props.field            The field definition.
 * @param {?string} [props.field.label]    The control's label.
 * @param {boolean} [props.field.readOnly] Whether the control is non-interactive.
 * @param {*}       props.value            The stored value: a token alias, or a composite shadow object.
 * @param {Function} props.onChange        Called with the next alias or composite object.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function BoxShadowField({ field, value, onChange }) {
	// A semantic-bound shadow is the block's role-based default rather than a selection — the pool
	// offers primitives only — so it is blanked and the field reads as unset. Without this the control
	// found no pool entry for it and labelled the trigger `Custom`, which reads as "someone composed a
	// shadow by hand" when nothing of the sort happened. `BoxShadowControl` takes no `defaultValue`,
	// so the semantic's VALUE cannot be shown the way the box fields show it; unset is the honest
	// reading until that prop exists.
	const shown = isSemanticShadow(value) ? undefined : value;

	// A bare `type` filter alone returns every `shadow` token, including the two `Brand`-group
	// semantics (`semantic.shadow.media`, `semantic.shadow.button`) that back other blocks' own
	// default CSS and were never meant to be end-user-pickable here. Passing `role: 'shadow'` — every
	// shadow token's derived role — engages the primitive narrowing, matching the three-entry list the
	// Shadow screen itself offers.
	const tokens = pickableTokensForType('shadow', 'shadow', boundShadowTokenIds(shown)).map((token) => ({
		...token,
		alias: `{${token.id}}`,
	}));

	return (
		<BoxShadowControl
			value={shown}
			onChange={(next) => !field.readOnly && onChange(next)}
			label={field.label}
			tokens={tokens}
			renderColor={({ value: color, onChange: onColorChange }) => (
				<TokenColorSelectField
					field={{ label: __('Color', 'kadence-blocks'), readOnly: field.readOnly }}
					value={color}
					onChange={onColorChange}
				/>
			)}
			disabled={field.readOnly}
		/>
	);
}
