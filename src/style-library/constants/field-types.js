/**
 * The settings-field type vocabulary: the single source of truth mapping a schema field's `type`
 * string to the component that renders it. Every per-screen settings schema authors against these
 * seventeen strings; `helpers/settings-schema.js`'s `fieldComponentFor` is the only reader.
 */

/**
 * Internal dependencies
 */
import { BorderField } from '../components/molecules/fields/BorderField';
import { BoxShadowField } from '../components/molecules/fields/BoxShadowField';
import { BoxSidesField } from '../components/molecules/fields/BoxSidesField';
import { BoxTokenField } from '../components/molecules/fields/BoxTokenField';
import { ColorField } from '../components/molecules/fields/ColorField';
import { ColorListField } from '../components/molecules/fields/ColorListField';
import { NumberUnitField } from '../components/molecules/fields/NumberUnitField';
import { ScalarTokenField } from '../components/molecules/fields/ScalarTokenField';
import { RangeNumberField } from '../components/molecules/fields/RangeNumberField';
import { SelectField } from '../components/molecules/fields/SelectField';
import { ShadowField } from '../components/molecules/fields/ShadowField';
import { StepperField } from '../components/molecules/fields/StepperField';
import { TextField } from '../components/molecules/fields/TextField';
import { ToggleField } from '../components/molecules/fields/ToggleField';
import { TokenColorSelectField } from '../components/molecules/fields/TokenColorSelectField';
import { FontFamilyField } from '../components/molecules/fields/FontFamilyField';
import { TokenSelectField } from '../components/molecules/fields/TokenSelectField';
import { UnitField } from '../components/molecules/fields/UnitField';

/**
 * The `radius` field: a box control whose four slots are corners.
 *
 * Bound here rather than in a schema so a schema names the property (`type: 'radius'`) instead of
 * describing an arrangement — geometry is this registry's job, not the author's.
 *
 * @param {Object} props The field props from `SettingsForm`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
const RadiusField = (props) => <BoxTokenField {...props} slots="corners" />;

/**
 * The `spacing` field: a box control whose four slots are sides.
 *
 * Same control as `radius`, different geometry — padding and margin name edges where a radius names
 * corners. Bound here for the same reason: a schema names the property, not the arrangement.
 *
 * @param {Object} props The field props from `SettingsForm`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
const SpacingField = (props) => <BoxTokenField {...props} slots="sides" />;

/**
 * The `border` field: `BorderControl`'s per-side width/style, color deferred to `renderColor`.
 *
 * Bound here for the same reason `radius`/`spacing` are: a schema names the property, this registry
 * owns which control and geometry render it.
 *
 * @param {Object} props The field props from `SettingsForm`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
const BorderTypeField = (props) => <BorderField {...props} />;

/**
 * The `box-shadow` field: `BoxShadowControl`'s single-value, token-aware shadow.
 *
 * A different key from `shadow` — that one is already bound to `ShadowField`, the raw composite
 * editor the Shadow token-library screen's own settings panel uses (see `BoxShadowField.js`'s
 * docblock for why the two cannot share a key).
 *
 * @param {Object} props The field props from `SettingsForm`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
const BoxShadowTypeField = (props) => <BoxShadowField {...props} />;

/**
 * The field-type registry: `type` string => field component. Frozen so a consumer can't mutate the
 * vocabulary at runtime.
 *
 * @since TBD
 */
export const FIELD_TYPES = Object.freeze({
	text: TextField,
	'number-unit': NumberUnitField,
	'range-number': RangeNumberField,
	select: SelectField,
	stepper: StepperField,
	unit: UnitField,
	toggle: ToggleField,
	color: ColorField,
	'color-list': ColorListField,
	'token-select': TokenSelectField,
	'token-scalar': ScalarTokenField,
	'token-color-select': TokenColorSelectField,
	'font-family': FontFamilyField,
	'box-sides': BoxSidesField,
	radius: RadiusField,
	spacing: SpacingField,
	shadow: ShadowField,
	border: BorderTypeField,
	'box-shadow': BoxShadowTypeField,
});

/**
 * The field types a schema may mark `responsive: true`, mirroring the backend's
 * `Schema\Vocabulary\Responsive::is_responsive_capable()` gate (`dimension`/`lineHeight` DTCG
 * types). `radius` and `spacing` qualify: their slots hold `dimension` values, and the envelope stores
 * whatever a slot holds — an alias overrides per breakpoint just as a literal does.
 *
 * `token-select`/`token-color-select`/`box-sides` remain excluded. Those render a single picker with
 * no breakpoint switcher to drive one, so marking them responsive would write an override no part of
 * their UI could read back; the rest are excluded because their DTCG types are never
 * responsive-capable.
 *
 * `token-scalar` is the responsive answer for a single token-backed length, where `token-select` is the
 * non-responsive one: it wraps `ScalarControl`, which carries the breakpoint switcher, so a property
 * whose block control is itself per-device (an icon's size, stored as `size`/`tabletSize`/`mobileSize`)
 * can be given one value per breakpoint from a preset too.
 *
 * `border` qualifies for the same reason `radius`/`spacing` do: its width is a `dimension` value,
 * held in the same per-slot shape. `box-shadow` is excluded — the Button panel's shadow field has no
 * breakpoint switcher (see `BoxShadowField.js`'s docblock).
 *
 * @since TBD
 */
export const RESPONSIVE_CAPABLE_FIELD_TYPES = Object.freeze([
	'number-unit',
	'radius',
	'spacing',
	'token-scalar',
	'range-number',
	'stepper',
	'unit',
	'border',
]);
