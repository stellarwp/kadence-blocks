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
import { TokenColorSelectField } from './TokenColorSelectField';

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
	const tokens = pickableTokensForType('shadow').map((token) => ({
		...token,
		alias: `{${token.id}}`,
	}));

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
