/**
 * A control's value slot as a token field: a trigger that reads like the control's own input,
 * opening a popover with a `Style Library` tab and a `Custom` tab.
 *
 * Moved from the block editor's `component-token-ui.js`, where it was named `TokenFieldControl`.
 * That module was already pure and data-free, so nothing had to change to make it shared — the
 * pickable-token list and every value arrive as props.
 *
 * An unset slot shows its inherited default, muted, rather than reading as empty: the field then
 * names the size actually in effect while still being unset. Keeping "what this slot holds" and
 * "what it falls back to" apart is the point of the two summaries in `helpers/token-summary.js`.
 */

/**
 * WordPress dependencies
 */
import { Button, Dropdown } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import {
	defaultSummary,
	fieldSummary,
	findTokenEntry,
	isTokenAlias,
	resolveDefaultValue,
} from '../helpers/token-summary';
import { parseCssLength } from '../helpers/parse-css-length';
import { TokenPopover } from '../molecules/TokenPopover';
import '../styles/token-controls.scss';

/**
 * A control's numeric slot as a token field: a corner icon plus a trigger that reads like the control's
 * input (showing the bound token or the literal), opening a popover with a `Style Library` tab (pick/clear a
 * token) and a `Custom` tab (edit a literal value + unit with a slider). The `Custom` number seeds from
 * the token's resolved size when a token is bound, so switching to a custom value drops the alias and
 * leaves a usable literal.
 *
 * @param {Object}   props
 * @param {*}        props.value      The current slot value (alias string, literal, or empty).
 * @param {string}   [props.unit]     The control's current unit, for the literal display + switcher.
 * @param {Array}    [props.units]    The control's selectable units; the `Custom` tab shows a unit
 *                                    switcher when this and `onUnit` are present.
 * @param {Function} [props.onUnit]   Writes the control's unit.
 * @param {string}   [props.defaultValue] The inherited default's resolved value, shown on the trigger and
 *                                    tagged in the list when the slot is unset.
 * @param {boolean}  [props.inherited] Whether that default comes from another breakpoint rather than the
 *                                    preset, which reads as `Inherited` instead of the size name.
 * @param {*}        [props.icon]     The control's per-slot corner icon (from the default editor), shown
 *                                    beside the trigger to match the native corner input.
 * @param {number}   [props.min]      The custom slider/number minimum.
 * @param {number}   [props.max]      The custom slider/number maximum; the slider renders when present.
 * @param {number}   [props.step]     The custom slider/number step.
 * @param {Array}    props.tokens     The pickable-token list.
 * @param {Function} props.onPick     Writes a picked token's `alias` to the slot.
 * @param {Function} props.onClear    Clears the slot's override (the `Reset` choice).
 * @param {Function} props.onCustom   Writes a literal number to the slot (used when leaving a token).
 * @param {Function} [props.renderCustom] Overrides the Custom tab body; passed through to `TokenPopover`.
 * @param {boolean}  [props.disabled] Disable the trigger, which is the only control outside the
 *                                      popover — with it inert the popover cannot open, so nothing
 *                                      below it is reachable either. Callers that only guard their
 *                                      write callbacks leave the field looking editable while
 *                                      silently dropping the writes.
 *
 * @since TBD
 *
 * @return {Object} The rendered token field.
 */
export function TokenSelector({
	value,
	unit = '',
	units,
	onUnit,
	defaultValue,
	inherited,
	icon,
	min,
	max,
	step,
	tokens,
	onPick,
	onClear,
	onCustom,
	renderCustom,
	disabled = false,
}) {
	const summary = fieldSummary(value, tokens, unit, __('Custom', 'kadence-blocks'));
	// The inherited default has to be resolved before it is compared or shown — a raw alias or a unitless
	// number would neither match a token row nor read as a value.
	const resolvedDefault = resolveDefaultValue(defaultValue, tokens, unit, inherited);
	// A literal fallback is named for the state it is in, not for what it would be called if someone had
	// typed it. `Custom` is what a value the user actually SET is called, so reusing it here would make
	// "nothing is set" and "a custom value is set" read the same, with only the muting to tell them
	// apart. This matches the tooltip below, which has always drawn that distinction.
	const fallbackState = inherited ? __('Inherited', 'kadence-blocks') : __('Default', 'kadence-blocks');
	const fallback = defaultSummary(resolvedDefault, tokens, fallbackState);
	const inheritedName = inherited
		? sprintf(
				/* translators: %s: the inherited value, e.g. "8px". */ __('Inherited (%s)', 'kadence-blocks'),
				resolvedDefault
			)
		: sprintf(
				/* translators: %s: the default value, e.g. "3px". */ __('Default (%s)', 'kadence-blocks'),
				resolvedDefault
			);
	const triggerName = summary.label
		? `${summary.label}${summary.value ? ` (${summary.value})` : ''}`
		: resolvedDefault
			? inheritedName
			: __('Default', 'kadence-blocks');
	const aliased = isTokenAlias(value);
	const entry = aliased ? findTokenEntry(tokens, value) : null;
	const seed = entry ? parseCssLength(entry.value) : null;
	// An unset slot seeds the Custom tab from whatever it falls back to, so opening the editor starts
	// from the value on screen instead of an empty box the user has to guess at.
	const unset = value === '' || value === undefined || value === null;
	const fallbackNumber = unset ? parseCssLength(resolvedDefault) : null;
	const number = aliased ? (seed ? seed.size : '') : unset ? (fallbackNumber?.size ?? '') : value;

	// Only a slot that HOLDS a literal opens on its editor. An unset slot opens on the token list even
	// when what it falls back to is a literal: the fallback is the block's own value, not a choice the
	// user made, and landing on the Custom tab would nudge them toward hand-typing a number when picking
	// a token is the better move. The Custom tab still seeds from that fallback if they go there.
	const initialTab = !aliased && !unset ? 'custom' : 'style-library';

	const writeNumber = (next) => onCustom(next === '' || next === undefined ? '' : Number(next));

	return (
		<div className="kadence-token-field">
			{icon && (
				<span className="kadence-token-field__icon" aria-hidden="true">
					{icon}
				</span>
			)}
			<Dropdown
				className="kadence-token-field__dropdown"
				contentClassName="kadence-token-field__popover"
				popoverProps={{ placement: 'left-start' }}
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="kadence-token-field__trigger"
						onClick={onToggle}
						disabled={disabled}
						aria-expanded={isOpen}
						label={triggerName}
						showTooltip
					>
						{summary.label && <span className="kadence-token-field__label">{summary.label}</span>}
						{summary.value && <span className="kadence-token-field__value">{summary.value}</span>}
						{!summary.label && !summary.value && fallback.value && (
							<>
								{fallback.label && (
									<span className="kadence-token-field__label kadence-token-field__label--default">
										{fallback.label}
									</span>
								)}
								<span className="kadence-token-field__value">{fallback.value}</span>
							</>
						)}
					</Button>
				)}
				renderContent={({ onClose }) => (
					<TokenPopover
						value={value}
						tokens={tokens}
						resolvedDefault={resolvedDefault}
						inherited={inherited}
						initialTab={initialTab}
						custom={{ number, unit, units, onUnit, min, max, step, onNumber: writeNumber }}
						renderCustom={renderCustom}
						onPick={onPick}
						onClear={onClear}
						onClose={onClose}
					/>
				)}
			/>
		</div>
	);
}
