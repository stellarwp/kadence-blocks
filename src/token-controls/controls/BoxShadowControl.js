/**
 * The box-shadow token control: a single trigger opening a Style Library tab (pick a shadow token)
 * and a Custom tab (the composite editor — color, X/Y/blur/spread, inset). The odd one out among
 * this library's controls: no slots, no link toggle, a shadow isn't sided.
 *
 * The Custom tab reuses the exact composite shape `helpers/shadow.js` and `ShadowField` already
 * define for the Shadow token-library screen (`{ color, offsetX, offsetY, blur, spread, inset }`),
 * confirmed against the live screen rather than invented fresh — this control is a token-aware
 * wrapper around that same editing surface, not a new one.
 *
 * Color is out of scope here (see `renderColor`) exactly as in `BorderControl` — this control does
 * not import or build a color picker.
 *
 * The token rows also hide their resolved value (`TokenPopover`'s `showValue={false}`) — a shadow's
 * value is a long CSS shorthand that crowds the row the way a short dimension value does not. Other
 * `TokenPopover` consumers (Radius, Spacing, Border Width) keep the default `showValue={true}` and
 * are unaffected.
 *
 * The wrapper composes `ControlShell` exactly as `BoxControl`/`BorderControl` do, minus the props
 * neither applies to a shadow: no `breakpoints`/`onBreakpointChange` (a shadow field isn't
 * responsive here), no `isLinked`/`onToggleLink` (a shadow is one value, not sided, so there is
 * nothing to link). The body renders one `.kb-token-control__row` — the same control-box chrome
 * `SlotGrid` gives Radius/Spacing's rows — but built directly rather than through `SlotGrid`,
 * because `SlotGrid` always pairs a row with a glyph and a shadow has no side/corner for a glyph to
 * point at.
 */

/**
 * WordPress dependencies
 */
import { __experimentalNumberControl as NumberControl, Button, Dropdown, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ControlShell } from '../templates/ControlShell';
import { TokenPopover } from '../molecules/TokenPopover';
import { fieldSummary, hasValue, isTokenAlias } from '../helpers/token-summary';
import '../styles/token-controls.scss';

/**
 * The four length axes of a shadow, in CSS declaration order.
 *
 * @since TBD
 */
const AXES = [
	{ key: 'offsetX', label: __('X', 'kadence-blocks') },
	{ key: 'offsetY', label: __('Y', 'kadence-blocks') },
	{ key: 'blur', label: __('Blur', 'kadence-blocks') },
	{ key: 'spread', label: __('Spread', 'kadence-blocks') },
];

/**
 * The shadow composite's default shape, matching `ShadowField`'s own fallback.
 *
 * @since TBD
 */
const DEFAULT_SHADOW = { color: '#000000', offsetX: '0px', offsetY: '0px', blur: '0px', spread: '0px', inset: false };

/**
 * Apply a patch to the current shadow composite, writing the result through `onChange` with `inset`
 * omitted entirely when it is not `true` — `helpers/shadow.js`'s `shadowLeafValue()` uses the same
 * convention (an optional-field map where absent means unset), so a value this control emits is
 * indistinguishable from one built there.
 *
 * @param {Object} shadow The current composite shadow value.
 * @param {Object} patch  The fields to overwrite.
 *
 * @since TBD
 *
 * @return {Object} The next composite shadow value, `inset` present only when `true`.
 */
function commitShadow(shadow, patch) {
	const { inset, ...rest } = { ...shadow, ...patch };

	return inset === true ? { ...rest, inset: true } : rest;
}

/**
 * Render a composite shadow's `box-shadow` CSS shorthand for the trigger's value text, matching the
 * dimension order and literal `inset` keyword `Css_Renderer`/`shadowCss()` emit — the value span is
 * otherwise verbatim CSS (units, hex, rgba), so this stays untranslated rather than mixing in a UI
 * word.
 *
 * @param {Object} shadow The composite shadow value, defaults already filled.
 *
 * @since TBD
 *
 * @return {string} The shorthand string, `inset`-prefixed when the composite is inset.
 */
function shadowShorthand(shadow) {
	const shorthand = `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;

	return shadow.inset === true ? `inset ${shorthand}` : shorthand;
}

/**
 * The Custom tab body: the shadow composite editor, matching `ShadowField`'s layout — a color row,
 * four numeric axes, an inset toggle.
 *
 * @param {Object}   props              The component props.
 * @param {Object}   props.shadow       The current composite shadow value (defaults filled).
 * @param {Function} props.onChange     Called with the next composite shadow value.
 * @param {Function} [props.renderColor] `({ value, onChange }) => Element` for the color sub-field.
 * @param {boolean}  [props.disabled]   Whether every sub-field is read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The Custom tab body.
 */
function ShadowCustomTab({ shadow, onChange, renderColor, disabled = false }) {
	const setPart = (key, next) => onChange(commitShadow(shadow, { [key]: next }));

	return (
		<div className="kadence-token-field__custom kb-box-shadow-control__custom">
			{renderColor && renderColor({ value: shadow.color, onChange: (next) => setPart('color', next), disabled })}
			<div className="kb-box-shadow-control__axes">
				{AXES.map(({ key, label }) => (
					<NumberControl
						key={key}
						label={label}
						value={Number.parseFloat(shadow[key]) || 0}
						disabled={disabled}
						onChange={(next) => setPart(key, `${Number(next) || 0}px`)}
					/>
				))}
			</div>
			<ToggleControl
				label={__('Inset', 'kadence-blocks')}
				checked={shadow.inset === true}
				disabled={disabled}
				onChange={(next) => setPart('inset', next)}
			/>
		</div>
	);
}

/**
 * Render a box-shadow token control.
 *
 * @param {Object}    props               The component props.
 * @param {*}         props.value         A token alias string, or a composite shadow object.
 * @param {Function}  props.onChange      Called with the next alias or composite object.
 * @param {string}    props.label         The control's label.
 * @param {Array}     [props.tokens]      Pickable `shadow`-type tokens, `[{id, label, value, alias}]`.
 * @param {Function}  [props.renderColor] `({ value, onChange }) => Element` for the color sub-field.
 * @param {boolean}   [props.disabled]    Whether the control is read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function BoxShadowControl({ value, onChange, label, tokens = [], renderColor, disabled = false }) {
	const aliased = isTokenAlias(value);
	const shadow = { ...DEFAULT_SHADOW, ...(aliased || !value ? {} : value) };
	// Aliased reads the bound token's label/value split exactly as `TokenSelector`'s own trigger does;
	// an unset slot reads as empty, matching `fieldSummary()`'s own unset branch and `TokenSelector`'s
	// resulting empty trigger, rather than fabricating a value for a field that holds nothing; only a
	// genuine composite reads "Custom" plus its own resolved shorthand, which `fieldSummary()`'s
	// literal-plus-unit shape does not fit (it is built for scalars, not an object value).
	const summary = aliased
		? fieldSummary(value, tokens, '', __('Custom', 'kadence-blocks'))
		: !hasValue(value)
			? { label: '', value: '' }
			: { label: __('Custom', 'kadence-blocks'), value: shadowShorthand(shadow) };
	// The unset trigger renders no visible label/value (so the field reads as genuinely empty, not a
	// fabricated custom shadow — see the summary derivation above), which would otherwise leave the
	// Button with no accessible name at all: `ControlShell` renders `label` as a separate header span,
	// not as this button's name. An `aria-label` fills that gap only while the trigger is visibly
	// empty; a set value already names itself through the visible label/value text, so adding one
	// there would be redundant.
	const emptyTriggerLabel = !summary.label && !summary.value ? __('Choose shadow', 'kadence-blocks') : undefined;

	return (
		<ControlShell label={label} disabled={disabled}>
			<div className="kb-token-control__row">
				<div className="kadence-token-field">
					<Dropdown
						className="kadence-token-field__dropdown"
						contentClassName="kadence-token-field__popover"
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								className="kadence-token-field__trigger"
								onClick={onToggle}
								disabled={disabled}
								aria-expanded={isOpen}
								aria-label={emptyTriggerLabel}
							>
								{summary.label && <span className="kadence-token-field__label">{summary.label}</span>}
								{summary.value && <span className="kadence-token-field__value">{summary.value}</span>}
							</Button>
						)}
						renderContent={({ onClose }) => (
							<TokenPopover
								value={value}
								tokens={tokens}
								resolvedDefault=""
								initialTab={aliased || !value ? 'style-library' : 'custom'}
								custom={{ shadow, renderColor, disabled }}
								renderCustom={(custom) => (
									<ShadowCustomTab
										shadow={custom.shadow}
										renderColor={custom.renderColor}
										disabled={custom.disabled}
										onChange={(next) => !disabled && onChange(next)}
									/>
								)}
								onPick={(alias) => !disabled && onChange(alias)}
								onClear={() => !disabled && onChange('')}
								onClose={onClose}
								showValue={false}
							/>
						)}
					/>
				</div>
			</div>
		</ControlShell>
	);
}
