/**
 * Design-token UI injected into the token-agnostic `@kadence/components` control seams.
 *
 * `@kadence/components` controls expose neutral `kadence.components.control.*` `@wordpress/hooks`
 * seams and know nothing about design tokens. This module holds the token vocabulary — the
 * `{dot.alias}` pattern plus the field/picker UI — that Kadence Blocks injects through those seams
 * (see `register-component-filters.js`). Pure and data-free: labels/preview values come from the
 * pickable-token list the caller passes in.
 *
 * The primary surface is `TokenFieldControl`: it turns a control's numeric slot into a single field
 * that reads like the control's own input and, on click, opens a popover with two tabs — `Style Library`
 * (pick a token, or clear to none) and `Custom` (edit a literal value). This matches the sidebar
 * design, where the field itself is the entry point rather than a separate "use token" button.
 * `TokenChip`/`TokenPickerButton` remain for the whole-value box-shadow control, which has no per-slot
 * field to turn into a trigger.
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import {
	Button,
	Dropdown,
	DropdownMenu,
	Icon,
	MenuGroup,
	MenuItem,
	RangeControl,
	SelectControl,
	TabPanel,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { link, linkOff, undo } from '@wordpress/icons';
import { parseCssLength } from '../token-picker/parse-css-length';
import './component-token-ui.scss';

const TOKEN_ALIAS_PATTERN = /^\{[\w.-]+\}$/;

/**
 * Whether a control value is a whole-string design-token alias (e.g. `{semantic.radius.button}`).
 *
 * @param {*} value The control value to test.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is a whole-string token alias.
 */
export function isTokenAlias(value) {
	return typeof value === 'string' && TOKEN_ALIAS_PATTERN.test(value);
}

/**
 * The pickable-token entry whose `alias` matches a value.
 *
 * @param {Array}  tokens The pickable-token list (may be undefined).
 * @param {string} value  The alias string to match against each entry's `alias`.
 *
 * @since TBD
 *
 * @return {?Object} The matching entry, or null when the list is empty/absent or nothing matches.
 */
export function findTokenEntry(tokens, value) {
	return (tokens || []).find((entry) => entry.alias === value) || null;
}

/**
 * The label/value summary a token field shows on its trigger for the current slot value: the token's
 * label + resolved value when aliased (dot-path fallback when no matching entry is found), a `Custom`
 * label + literal (with unit) for a set literal, or an empty placeholder when the slot is unset.
 *
 * @param {*}      value  The current slot value (alias string, literal number/string, or empty).
 * @param {Array}  tokens The pickable-token list, used to resolve an alias to its label/value.
 * @param {string} unit   The control's current unit, appended to a literal for display.
 *
 * @since TBD
 *
 * @return {{label: string, value: string}} The trigger label and its secondary value text.
 */
function fieldSummary(value, tokens, unit) {
	if (isTokenAlias(value)) {
		const entry = findTokenEntry(tokens, value);
		return {
			label: entry ? entry.label : String(value).slice(1, -1),
			value: entry ? entry.value : '',
		};
	}

	if (value !== '' && value !== undefined && value !== null) {
		return { label: __('Custom', 'kadence-blocks'), value: `${value}${unit || ''}` };
	}

	return { label: __('Default', 'kadence-blocks'), value: '' };
}

/**
 * The `Style Library` tab body: a `Reset` affordance, a `None` clear, and the pickable tokens (each showing
 * its label and resolved value, the active one pressed). Every choice closes the popover.
 *
 * @param {Object}   props
 * @param {*}        props.value    The current slot value, so the active token renders pressed.
 * @param {Array}    props.tokens   The pickable-token list.
 * @param {Function} props.onPick   Called with an entry's `alias` when a token is chosen.
 * @param {Function} props.onClear  Called when `None` is chosen.
 * @param {boolean}  props.canReset Whether the `Reset` affordance is enabled.
 * @param {Function} [props.onReset] Called when `Reset` is chosen.
 * @param {Function} props.onClose  Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {Object} The rendered token list.
 */
function StyleLibraryTab({ value, tokens, onPick, onClear, canReset, onReset, onClose }) {
	return (
		<div className="kadence-token-field__list">
			<Button
				className="kadence-token-field__reset"
				disabled={!canReset}
				onClick={() => {
					if (onReset) {
						onReset();
					}
					onClose();
				}}
			>
				<span className="kadence-token-field__reset-label">{__('Reset', 'kadence-blocks')}</span>
				<Icon className="kadence-token-field__reset-icon" icon={undo} size={20} />
			</Button>
			<Button
				className="kadence-token-field__item"
				isPressed={!isTokenAlias(value) && !value}
				onClick={() => {
					onClear();
					onClose();
				}}
			>
				<span className="kadence-token-field__item-label">{__('None', 'kadence-blocks')}</span>
			</Button>
			{tokens.map((entry) => (
				<Button
					key={entry.id}
					className="kadence-token-field__item"
					isPressed={entry.alias === value}
					onClick={() => {
						onPick(entry.alias);
						onClose();
					}}
				>
					<span className="kadence-token-field__item-label">{entry.label}</span>
					{entry.isDefault && (
						<span className="kadence-token-field__item-tag">{__('Default', 'kadence-blocks')}</span>
					)}
					<span className="kadence-token-field__item-value">{entry.value}</span>
				</Button>
			))}
		</div>
	);
}

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
 * @param {*}        [props.icon]     The control's per-slot corner icon (from the default editor), shown
 *                                    beside the trigger to match the native corner input.
 * @param {number}   [props.min]      The custom slider/number minimum.
 * @param {number}   [props.max]      The custom slider/number maximum; the slider renders when present.
 * @param {number}   [props.step]     The custom slider/number step.
 * @param {Array}    props.tokens     The pickable-token list.
 * @param {Function} props.onPick     Writes a picked token's `alias` to the slot.
 * @param {Function} props.onClear    Clears the slot (the `None` choice).
 * @param {Function} props.onCustom   Writes a literal number to the slot (used when leaving a token).
 * @param {boolean}  [props.canReset] Whether the `Reset` affordance is enabled.
 * @param {Function} [props.onReset]  Resets the slot to its bound default.
 *
 * @since TBD
 *
 * @return {Object} The rendered token field.
 */
export function TokenFieldControl({
	value,
	unit = '',
	units,
	onUnit,
	icon,
	min,
	max,
	step,
	tokens,
	onPick,
	onClear,
	onCustom,
	canReset = false,
	onReset,
}) {
	const summary = fieldSummary(value, tokens, unit);
	const aliased = isTokenAlias(value);
	const entry = aliased ? findTokenEntry(tokens, value) : null;
	const seed = entry ? parseCssLength(entry.value) : null;
	const number = aliased
		? seed
			? seed.size
			: ''
		: value === '' || value === undefined || value === null
			? ''
			: value;

	const writeNumber = (next) => onCustom(next === '' || next === undefined ? '' : Number(next));

	// The Custom tab is a value editor (number + unit) plus a slider, seeded from the current literal or
	// the bound token's resolved size — editing it drops the alias and leaves a plain number.
	const customTab = (
		<div className="kadence-token-field__custom">
			<div className="kadence-token-field__custom-row">
				<NumberControl
					className="kadence-token-field__custom-input"
					label={__('Custom value', 'kadence-blocks')}
					hideLabelFromVision
					value={number}
					min={min}
					max={max}
					step={step}
					onChange={writeNumber}
				/>
				{units && units.length > 0 && onUnit && (
					<SelectControl
						className="kadence-token-field__unit"
						label={__('Unit', 'kadence-blocks')}
						hideLabelFromVision
						value={unit}
						options={units.map((option) => ({ label: option, value: option }))}
						onChange={onUnit}
					/>
				)}
			</div>
			{typeof max === 'number' && (
				<RangeControl
					className="kadence-token-field__slider"
					label={__('Custom value', 'kadence-blocks')}
					hideLabelFromVision
					value={number === '' ? undefined : Number(number)}
					initialPosition={typeof min === 'number' ? min : 0}
					min={typeof min === 'number' ? min : 0}
					max={max}
					step={step}
					withInputField={false}
					onChange={(next) => writeNumber(next)}
				/>
			)}
		</div>
	);

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
				popoverProps={{ placement: 'bottom-start' }}
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="kadence-token-field__trigger"
						onClick={onToggle}
						aria-expanded={isOpen}
						label={summary.value ? `${summary.label} (${summary.value})` : summary.label}
						showTooltip
					>
						<span className="kadence-token-field__label">{summary.label}</span>
						{summary.value && <span className="kadence-token-field__value">{summary.value}</span>}
					</Button>
				)}
				renderContent={({ onClose }) => (
					<TabPanel
						className="kadence-token-field__tabs"
						tabs={[
							{ name: 'style-library', title: __('Style Library', 'kadence-blocks') },
							{ name: 'custom', title: __('Custom', 'kadence-blocks') },
						]}
					>
						{(tab) =>
							tab.name === 'style-library' ? (
								<StyleLibraryTab
									value={value}
									tokens={tokens}
									onPick={onPick}
									onClear={onClear}
									canReset={canReset}
									onReset={onReset}
									onClose={onClose}
								/>
							) : (
								customTab
							)
						}
					</TabPanel>
				)}
			/>
		</div>
	);
}

/**
 * The in-control token display: the token's label (dot-path fallback when no matching entry is found)
 * plus an optional unlink button. Used by the whole-value box-shadow control, which has no per-slot
 * field to turn into a `TokenFieldControl` trigger.
 *
 * @param {Object}   props
 * @param {string}   props.value     The alias string currently held by the slot.
 * @param {Array}    [props.tokens]  The pickable-token list, used to resolve the label/preview.
 * @param {Function} [props.onUnlink] Called with no arguments when the unlink button is pressed; the
 *                                    button is hidden when this is not provided.
 *
 * @since TBD
 *
 * @return {Object} The rendered token chip.
 */
export function TokenChip({ value, tokens, onUnlink }) {
	const entry = findTokenEntry(tokens, value);
	const label = entry ? entry.label : String(value).slice(1, -1);

	return (
		<span className="kadence-token-chip">
			<span className="kadence-token-chip__label" title={entry ? entry.value : undefined}>
				{label}
			</span>
			{onUnlink && (
				<Button
					className="kadence-token-chip__unlink"
					icon={linkOff}
					isSmall
					label={__('Unlink token', 'kadence-blocks')}
					onClick={() => onUnlink()}
				/>
			)}
		</span>
	);
}

/**
 * The in-control picker affordance for the whole-value box-shadow control: a header button opening the
 * token list; choosing an entry fires `onSelect(entry.alias)`. Renders nothing when the list is
 * empty/absent or no select handler is provided, so mounting it unconditionally is always safe.
 *
 * @param {Object}   props
 * @param {Array}    [props.tokens]   The pickable-token list.
 * @param {Function} [props.onSelect] Called with the chosen entry's `alias` when a token is picked.
 * @param {boolean}  [props.isActive] Whether the toggle should render pressed.
 *
 * @since TBD
 *
 * @return {?Object} The rendered picker button, or null when there is nothing to pick from.
 */
export function TokenPickerButton({ tokens, onSelect, isActive = false }) {
	if (!tokens || !tokens.length || !onSelect) {
		return null;
	}

	return (
		<DropdownMenu
			className="kadence-token-picker-toggle"
			icon={link}
			label={__('Use design token', 'kadence-blocks')}
			toggleProps={{ isSmall: true, isPressed: isActive }}
		>
			{({ onClose }) => (
				<MenuGroup>
					{tokens.map((entry) => (
						<MenuItem
							key={entry.id}
							onClick={() => {
								onClose();
								onSelect(entry.alias);
							}}
						>
							{entry.label}
							<span className="kadence-token-picker__preview">{entry.value}</span>
						</MenuItem>
					))}
				</MenuGroup>
			)}
		</DropdownMenu>
	);
}
