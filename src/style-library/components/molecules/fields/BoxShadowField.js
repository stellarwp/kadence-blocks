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
 * The button's own "no shadow" semantic token, already an invisible transparent zero-shadow — see
 * `declarations.php`'s own comment on `semantic.shadow.button`. Deliberately excluded from the
 * pickable pool's normal listing as a `Brand`-group semantic (`pickableTokensForType`'s primitive
 * narrowing); `shadowNoneEntry` below is the one deliberate exception, re-admitting it under a
 * "None" label instead of its registered "Button Shadow" one.
 *
 * @since TBD
 */
const BUTTON_SHADOW_NONE_TOKEN_ID = 'semantic.shadow.button';

/**
 * The "None" entry for the Button preset's Shadow field: `BUTTON_SHADOW_NONE_TOKEN_ID` relabeled
 * "None". A real registered token, not a synthetic sentinel — see this module's own note on why a
 * composite-valued control can't use a `fixed` entry the way a scalar dimension field's "None"/Auto
 * can (`===` never matches a freshly-built composite object).
 *
 * @since TBD
 *
 * @return {{id: string, alias: string, label: string, value: string, role: string}} The entry.
 */
function shadowNoneEntry() {
	const resolved = pickableTokensForType('shadow').find((token) => token.id === BUTTON_SHADOW_NONE_TOKEN_ID);

	return {
		id: BUTTON_SHADOW_NONE_TOKEN_ID,
		alias: `{${BUTTON_SHADOW_NONE_TOKEN_ID}}`,
		label: __('None', 'kadence-blocks'),
		value: resolved?.value ?? '',
		role: 'shadow',
	};
}

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
	// A bare `type` filter alone returns every `shadow` token, including the two `Brand`-group
	// semantics (`semantic.shadow.media`, `semantic.shadow.button`) that back other blocks' own
	// default CSS and were never meant to be end-user-pickable here. Passing `role: 'shadow'` — every
	// shadow token's derived role — engages the primitive narrowing, matching the three-entry list the
	// Shadow screen itself offers. `boundShadowTokenIds` exempts the currently-bound token from that
	// narrowing so a bound semantic still renders as its own label rather than a raw id.
	//
	// `shadowNoneEntry()` leads the list — the one deliberate re-admission of a Brand-group semantic,
	// under its own "None" label rather than its registered one (see the function's own docblock).
	const tokens = [
		shadowNoneEntry(),
		// `BUTTON_SHADOW_NONE_TOKEN_ID` is dropped here even when it is the bound value the primitive
		// narrowing would otherwise exempt — `shadowNoneEntry()` above already stands for it, under its
		// "None" label; keeping the narrowing's own copy too would list the same id twice, once under
		// each label.
		...pickableTokensForType('shadow', 'shadow', boundShadowTokenIds(value))
			.filter((token) => token.id !== BUTTON_SHADOW_NONE_TOKEN_ID)
			.map((token) => ({
				...token,
				alias: `{${token.id}}`,
			})),
	];

	return (
		<BoxShadowControl
			value={value}
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
