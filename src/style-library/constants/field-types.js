/**
 * The settings-field type vocabulary: the single source of truth mapping a schema field's `type`
 * string to the component that renders it. Every per-screen settings schema authors against these
 * thirteen strings; `helpers/settings-schema.js`'s `fieldComponentFor` is the only reader.
 */

/**
 * Internal dependencies
 */
import { BoxSidesField } from '../components/molecules/fields/BoxSidesField';
import { BoxTokenField } from '../components/molecules/fields/BoxTokenField';
import { ColorField } from '../components/molecules/fields/ColorField';
import { ColorListField } from '../components/molecules/fields/ColorListField';
import { NumberUnitField } from '../components/molecules/fields/NumberUnitField';
import { RangeNumberField } from '../components/molecules/fields/RangeNumberField';
import { SelectField } from '../components/molecules/fields/SelectField';
import { ShadowField } from '../components/molecules/fields/ShadowField';
import { StepperField } from '../components/molecules/fields/StepperField';
import { TextField } from '../components/molecules/fields/TextField';
import { ToggleField } from '../components/molecules/fields/ToggleField';
import { TokenColorSelectField } from '../components/molecules/fields/TokenColorSelectField';
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
	'token-color-select': TokenColorSelectField,
	'box-sides': BoxSidesField,
	radius: RadiusField,
	shadow: ShadowField,
});

/**
 * The field types a schema may mark `responsive: true`, mirroring the backend's
 * `Schema\Vocabulary\Responsive::is_responsive_capable()` gate (`dimension`/`lineHeight` DTCG
 * types). `radius` qualifies: its slots hold `dimension` values, and the envelope stores whatever a
 * slot holds — an alias overrides per breakpoint just as a literal does.
 *
 * `token-select`/`token-color-select`/`box-sides` remain excluded. Those render a single picker with
 * no breakpoint switcher to drive one, so marking them responsive would write an override no part of
 * their UI could read back; the rest are excluded because their DTCG types are never
 * responsive-capable.
 *
 * @since TBD
 */
export const RESPONSIVE_CAPABLE_FIELD_TYPES = Object.freeze([
	'number-unit',
	'radius',
	'range-number',
	'stepper',
	'unit',
]);
