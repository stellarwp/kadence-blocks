/**
 * The two-tab picker a token field opens: `Style Library` (pick a token, or reset to the inherited
 * default) and `Custom` (a literal number, its unit, and a slider).
 *
 * Moved verbatim from the block editor's `component-token-ui.js`, which was already pure and
 * data-free — labels and preview values come from the pickable-token list the caller passes in.
 * Living here means the Style Library and the editor render the same picker instead of two that
 * drift apart.
 */

/**
 * WordPress dependencies
 */
import {
	Button,
	Icon,
	RangeControl,
	SelectControl,
	TabPanel,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { globe, settings, undo } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { hasValue, isTokenAlias } from '../helpers/token-summary';

/**
 * The `Style Library` tab body: a `Reset` affordance that clears the slot back to its inherited default,
 * followed by the pickable size tokens (each showing its label and resolved value, the active one
 * pressed — the `None` size sits among them). Every choice closes the popover.
 *
 * @param {Object}   props
 * @param {*}        props.value        The current slot value, so the active token renders pressed.
 * @param {Array}    props.tokens       The pickable-token list.
 * @param {string}   [props.defaultValue] The inherited default's resolved value; its size is tagged
 *                                      `Default` and marked active while the slot is unset.
 * @param {boolean}  [props.inherited]  Whether that default comes from another breakpoint, which tags the
 *                                      row `Inherited` instead.
 * @param {Function} props.onPick       Called with an entry's `alias` when a token is chosen.
 * @param {Function} props.onClear      Called when `Reset` is chosen; clears the slot's override.
 * @param {Function} props.onClose      Closes the popover after a choice.
 * @param {boolean}  [props.showValue]  Whether each row shows its resolved value beside its label.
 *                                      Defaults to `true`; a shadow's resolved value is a long CSS
 *                                      shorthand that reads awkwardly next to its label the way a
 *                                      short dimension value does, so `BoxShadowControl` opts out.
 *
 * @since TBD
 *
 * @return {Object} The rendered token list.
 */
function StyleLibraryTab({ value, tokens, defaultValue, inherited, onPick, onClear, onClose, showValue = true }) {
	// Reset clears the slot's override back to the inherited default; it is inert when nothing is set.
	const hasOverride = isTokenAlias(value) || (value !== '' && value !== undefined && value !== null);
	// While unset, the size matching the inherited default reads as the active row.
	const onDefault = !hasOverride && !!defaultValue;

	return (
		<div className="kadence-token-field__list">
			<Button
				className="kadence-token-field__reset"
				disabled={!hasOverride}
				onClick={() => {
					onClear();
					onClose();
				}}
			>
				<span className="kadence-token-field__reset-label">{__('Reset', 'kadence-blocks')}</span>
				<Icon className="kadence-token-field__reset-icon" icon={undo} size={20} />
			</Button>
			{tokens.map((entry) => {
				const isDefault = !!defaultValue && entry.value === defaultValue;
				return (
					<Button
						key={entry.id}
						className="kadence-token-field__item"
						isPressed={entry.alias === value || (onDefault && isDefault)}
						onClick={() => {
							onPick(entry.alias);
							onClose();
						}}
					>
						<span className="kadence-token-field__item-label">{entry.label}</span>
						{isDefault && (
							<span className="kadence-token-field__item-tag">
								{inherited ? __('Inherited', 'kadence-blocks') : __('Default', 'kadence-blocks')}
							</span>
						)}
						{showValue && <span className="kadence-token-field__item-value">{entry.value}</span>}
					</Button>
				);
			})}
		</div>
	);
}

/**
 * The `Custom` tab body: a literal number, an optional unit switcher, and a slider when the field
 * declares an upper bound.
 *
 * @param {Object}   props           The component props.
 * @param {*}        props.number    The current literal, or '' when unset.
 * @param {string}   [props.unit]    The control's current unit.
 * @param {Array}    [props.units]   Selectable units; the switcher needs these and `onUnit`.
 * @param {Function} [props.onUnit]  Writes the control's unit.
 * @param {number}   [props.min]     Slider and number minimum.
 * @param {number}   [props.max]     Slider and number maximum; the slider renders when present.
 * @param {number}   [props.step]    Slider and number step.
 * @param {Function} props.onNumber  Writes a literal number to the slot.
 *
 * @since TBD
 *
 * @return {Object} The rendered tab body.
 */
export function CustomTab({ number, unit, units, onUnit, min, max, step, onNumber }) {
	return (
		<div className="kadence-token-field__custom">
			<NumberControl
				className="kadence-token-field__custom-input"
				label={__('Custom value', 'kadence-blocks')}
				hideLabelFromVision
				value={number}
				min={min}
				max={max}
				step={step}
				onChange={onNumber}
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
					onChange={(next) => onNumber(next)}
				/>
			)}
		</div>
	);
}

/**
 * Render the picker's tab panel.
 *
 * @param {Object}   props                  The component props.
 * @param {*}        props.value            The current slot value.
 * @param {Array}    props.tokens           The pickable-token list.
 * @param {string}   props.resolvedDefault  The inherited default, already resolved to a literal.
 * @param {boolean}  [props.inherited]      Whether that default came from another breakpoint.
 * @param {string}   props.initialTab       Which tab opens first.
 * @param {Object}   props.custom           Props forwarded to the `Custom` tab.
 * @param {Function} [props.renderCustom]   Overrides the Custom tab body; called with `props.custom`.
 *                                          Omit to render the default numeric `CustomTab`.
 * @param {Function} props.onPick           Writes a picked token's alias.
 * @param {Function} props.onClear          Clears the slot's override.
 * @param {Function} props.onClose          Closes the popover after a choice.
 * @param {boolean}  [props.showValue]      Whether each Style Library row shows its resolved value
 *                                          beside its label. Defaults to `true`; additive only, so
 *                                          every existing consumer keeps showing values.
 *
 * @since TBD
 *
 * @return {Object} The rendered tabs.
 */
export function TokenPopover({
	value,
	tokens,
	resolvedDefault,
	inherited,
	initialTab,
	custom,
	renderCustom,
	onPick,
	onClear,
	onClose,
	showValue = true,
}) {
	return (
		<TabPanel
			className="kadence-token-field__tabs"
			initialTabName={initialTab}
			tabs={[
				{
					name: 'style-library',
					title: (
						<span className="kadence-token-field__tab-title">
							<Icon icon={globe} size={20} />
							{__('Style Library', 'kadence-blocks')}
						</span>
					),
				},
				{
					name: 'custom',
					title: (
						<span className="kadence-token-field__tab-title">
							<Icon icon={settings} size={20} />
							{__('Custom', 'kadence-blocks')}
						</span>
					),
				},
			]}
		>
			{(tab) =>
				tab.name === 'style-library' ? (
					<StyleLibraryTab
						value={value}
						tokens={tokens}
						defaultValue={resolvedDefault}
						inherited={inherited}
						onPick={onPick}
						onClear={onClear}
						onClose={onClose}
						showValue={showValue}
					/>
				) : renderCustom ? (
					renderCustom(custom)
				) : (
					<CustomTab {...custom} />
				)
			}
		</TabPanel>
	);
}
