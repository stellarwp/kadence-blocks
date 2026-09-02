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
 * Color stays out of scope here — a shadow's color packs opacity into the same value, which the
 * shared color popover has no place for — so `renderColor` still wraps `TokenColorSelectField`.
 * `BorderField` no longer does; this is now the only field that renders it.
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
import { noneEntryForRole, parseResolvedShadow } from '../../../../token-controls';

/**
 * The bare token id a stored shadow holds, or the value unchanged when it holds a composite shadow
 * object instead.
 *
 * A draft carries BARE ids — `presetInitialValues()` runs every seeded value through
 * `aliasToIdDeep()` — while `BoxShadowControl` matches against the brace-wrapped form. Both shapes
 * are accepted here so the helper describes the same token either way.
 *
 * @param {*} value The stored value: a bare token id, an alias, or a composite shadow object.
 *
 * @since TBD
 *
 * @return {*} The bare id, or the value unchanged.
 */
function bareShadowId(value) {
	return isTokenAlias(value) ? value.slice(1, -1) : value;
}

/**
 * The bound token id `pickableTokensForType` must not narrow away, or none when the value holds a
 * composite shadow object. `boundTokenIds` (shared with `BorderField`) expects the bare id a
 * preset's `tokens` map stores, and returns only PRIMITIVES — a semantic is shown as the default
 * rather than offered, so it is never exempted.
 *
 * @param {*} value The stored value: a bare token id, an alias, or a composite shadow object.
 *
 * @since TBD
 *
 * @return {Array<string>} The bound primitive token ids, empty when nothing is bound.
 */
function boundShadowTokenIds(value) {
	return boundTokenIds(bareShadowId(value));
}

/**
 * Convert a stored shadow into what `BoxShadowControl` expects.
 *
 * Three cases, and the first is the one this field exists to get right. A SEMANTIC-bound shadow is
 * the block's role-based default rather than a selection — the pool offers primitives only — so it
 * reads as unset. A primitive-bound one is wrapped into the alias the control matches its list
 * against, the same conversion `toControlValue` performs for a box field's slots; without it the
 * control finds no entry for the bare id and labels the trigger `Custom`, which claims someone
 * composed a shadow by hand when nothing of the sort happened. Anything else — a composite object,
 * or nothing at all — passes through.
 *
 * @param {*} value The stored value: a bare token id, an alias, or a composite shadow object.
 *
 * @since TBD
 *
 * @return {*} The control-shaped value.
 */
export function toControlShadow(value) {
	const id = bareShadowId(value);

	if (typeof id !== 'string' || id === '') {
		return value;
	}

	if (id.startsWith('semantic.')) {
		return undefined;
	}

	return id.startsWith('primitive.') ? `{${id}}` : value;
}

/**
 * Convert what the control writes back into what a preset draft stores: a bare id, matching every
 * other field. A draft holding the brace-wrapped form would never compare equal to the bare id
 * `presetInitialValues` seeds, so the panel's dirty bit could never clear and Save would stay
 * enabled after a successful write — the mismatch `aliasToIdDeep`'s docblock describes.
 *
 * @param {*} next The control-shaped value: an alias, or a composite shadow object.
 *
 * @since TBD
 *
 * @return {*} The value a preset draft stores.
 */
export function toStoredShadow(next) {
	return isTokenAlias(next) ? next.slice(1, -1) : next;
}

/**
 * Resolve a `BoxShadowControl` pick to what this field stores: a `fixed` entry (the shared "None"
 * sentinel; it has no registered token PHP could otherwise resolve later) resolves to its literal
 * composite immediately, the same way a Custom-tab edit already does. A real token's alias, or an
 * already-composite Custom-tab value, passes through unchanged — a real token stays a live alias so
 * a later scale edit still cascades into this preset, matching every other Style Library field.
 *
 * @param {string|Object} picked What `BoxShadowControl.onChange` reported.
 * @param {Array}         tokens The pickable-token list `picked` was chosen from.
 *
 * @since TBD
 *
 * @return {string|Object} What this field writes.
 */
export function resolveShadowPick(picked, tokens) {
	const entry = tokens.find((token) => token.alias === picked);

	return entry?.fixed ? parseResolvedShadow(entry.value) : picked;
}

/**
 * Render a box-shadow field from a settings schema entry.
 *
 * @param {Object}  props                  The component props.
 * @param {Object}  props.field            The field definition.
 * @param {?string} [props.field.label]    The control's label.
 * @param {boolean} [props.field.readOnly] Whether the control is non-interactive.
 * @param {*}       [props.field.defaultValue] What an unset control falls back to, shown muted — now
 *                                         read, since `BoxShadowControl` takes a `defaultValue`.
 * @param {*}       props.value            The stored value: a token alias, or a composite shadow object.
 * @param {Function} props.onChange        Called with the next alias or composite object.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function BoxShadowField({ field, value, onChange }) {
	// `BoxShadowControl` takes no `defaultValue`, so a semantic's VALUE cannot be shown here the way
	// the box fields show it; unset is the honest reading until that prop exists.
	const shown = toControlShadow(value);

	// A bare `type` filter alone returns every `shadow` token, including the two `Brand`-group
	// semantics (`semantic.shadow.media`, `semantic.shadow.button`) that back other blocks' own
	// default CSS and were never meant to be end-user-pickable here. Passing `role: 'shadow'` — every
	// shadow token's derived role — engages the primitive narrowing, matching the three-entry list the
	// Shadow screen itself offers. `boundShadowTokenIds` exempts the currently-bound token from that
	// narrowing so a bound semantic still renders as its own label rather than a raw id.
	const tokens = [
		noneEntryForRole('shadow'),
		...pickableTokensForType('shadow', 'shadow', boundShadowTokenIds(shown)).map((token) => ({
			...token,
			alias: `{${token.id}}`,
		})),
	];

	return (
		<BoxShadowControl
			value={shown}
			onChange={(next) => !field.readOnly && onChange(toStoredShadow(resolveShadowPick(next, tokens)))}
			label={field.label}
			tokens={tokens}
			defaultValue={field.defaultValue}
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
