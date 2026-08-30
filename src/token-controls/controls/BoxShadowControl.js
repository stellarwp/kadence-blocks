/**
 * The box-shadow token control: a single trigger opening a Style Library tab (pick a shadow token)
 * and a Custom tab (the composite editor — color, X/Y/blur/spread, inset). The odd one out among
 * this library's controls: no slots, no link toggle, a shadow isn't sided.
 *
 * The Custom tab reuses the exact composite shape `helpers/shadow.js` and `ShadowField` already
 * define for the Shadow token-library screen (`{ color, offsetX, offsetY, blur, spread, inset }`),
 * confirmed against the live screen rather than invented fresh — this control is a token-aware
 * wrapper around that same editing surface, not a new one. Its visual layout mirrors that same
 * `ShadowField` too — a color row, then the four axes side by side, then Inset — built as plain
 * markup here rather than importing `ShadowField`/its SCSS, since `token-controls` cannot depend on
 * `style-library` (this control also runs in the block editor canvas, which has none of the
 * `--kb-sl-*` custom properties `style-library`'s own SCSS resolves against).
 *
 * Color is out of scope here (see `renderColor`) exactly as in `BorderControl` — this control does
 * not import or build a color picker. The Custom tab's color row wraps whatever `renderColor`
 * renders (the Style Library's swatch-plus-label toggle, the block editor's `PopColorControl`) in
 * plain layout chrome; it does not touch what that render prop returns.
 *
 * The token rows also hide their resolved value (`TokenPopover`'s `showValue={false}`) — a shadow's
 * value is a long CSS shorthand that crowds the row the way a short dimension value does not. Other
 * `TokenPopover` consumers (Radius, Spacing, Border Width) keep the default `showValue={true}` and
 * are unaffected.
 *
 * The Style Library tab shows a live preview square above `Reset`, via `TokenPopover`'s optional
 * `renderPreview` prop — additive there, so every other `TokenPopover` consumer that does not pass
 * it renders unchanged. Only this control opts in for now, per explicit scope. The square tracks
 * whichever row is currently hovered or keyboard-focused (`resolveHoverPreviewCss()`), falling back
 * to the bound value's own shadow (`resolvePreviewCss()`) once hover/focus leaves the list.
 *
 * The trigger itself is icon-plus-label only, never a value — a leading glyph (the `@wordpress/icons`
 * package's own `shadow` artwork, which draws as a sun) followed by the bound token's label or bare
 * "Custom", with no resolved value/shorthand text shown alongside either. Every other field's trigger
 * (`TokenSelector`'s) keeps its label-then-value split; this is a deliberate, shadow-only departure,
 * not a shared-trigger-style change.
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
// `shadow` (renamed to avoid colliding with this file's own `shadow` composite-value variable) draws
// as a sun-with-rays glyph in `@wordpress/icons`' own artwork — an odd name for that shape, but it is
// the package's dedicated "shadow" icon, so it is the intended one rather than a generic substitute.
import { shadow as shadowGlyph } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ControlShell } from '../templates/ControlShell';
import { TokenPopover } from '../molecules/TokenPopover';
import { defaultSummary, fieldSummary, hasValue, isTokenAlias, resolveDefaultValue } from '../helpers/token-summary';
import { DEFAULT_COMPOSITE, parseResolvedShadow } from '../helpers/shadow-shorthand';
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
 * Whether a composite shadow value matches a fixed sentinel entry's own resolved shorthand. A fixed
 * pick (e.g. "None") resolves to a literal composite immediately, at pick time — there is no live
 * alias to compare against the way a real token pick keeps — so this is how the control recognizes
 * "the user picked the sentinel" after the fact, purely from the value's shape.
 *
 * @param {Object} shadow The composite value with defaults already filled.
 * @param {Array}  tokens The pickable-token list.
 *
 * @since TBD
 *
 * @return {?Object} The matching fixed entry, or null.
 */
function matchFixedEntry(shadow, tokens) {
	const shorthand = `${shadow.inset === true ? 'inset ' : ''}${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;

	return (tokens || []).find((entry) => entry.fixed && entry.value === shorthand) || null;
}

/**
 * Resolve the current slot value into `box-shadow` CSS for the Style Library tab's preview square: a
 * bound token's own resolved value string when aliased, or the composite's own shorthand (matching
 * the dimension order and literal `inset` keyword `Css_Renderer`/`shadowCss()` emit) when a literal
 * composite is set. Empty when nothing is set yet, so the preview renders a plain, shadow-less box.
 *
 * @param {*}      value  The current slot value (alias string, composite object, or empty).
 * @param {Array}  tokens The pickable-token list, used to resolve an alias.
 * @param {Object} shadow The composite value with defaults already filled (ignored for an alias).
 *
 * @since TBD
 *
 * @return {string} The resolved `box-shadow` CSS, or '' when unset.
 */
function resolvePreviewCss(value, tokens, shadow) {
	if (isTokenAlias(value)) {
		const entry = tokens.find((candidate) => candidate.alias === value);

		return entry ? entry.value : '';
	}

	if (!hasValue(value)) {
		return '';
	}

	const shorthand = `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur} ${shadow.spread} ${shadow.color}`;

	return shadow.inset === true ? `inset ${shorthand}` : shorthand;
}

/**
 * Resolve the preview square's `box-shadow` CSS for a given hover/focus state: whichever token row
 * the pointer or keyboard focus currently sits on, the "Reset" row's cleared state (this control has
 * no inherited default to fall back to, so cleared reads as shadow-less), or — while nothing is
 * hovered/focused — the bound slot's own resolved shadow via `resolvePreviewCss()`.
 *
 * @param {?Object} hoveredEntry The `TokenPopover` hover/focus state: `null`, `{ kind: 'reset' }`, or
 *                                `{ kind: 'token', entry }`.
 * @param {*}       value        The current slot value, used when nothing is hovered/focused.
 * @param {Array}   tokens       The pickable-token list, used when nothing is hovered/focused.
 * @param {Object}  shadow       The composite value with defaults already filled.
 *
 * @since TBD
 *
 * @return {string} The resolved `box-shadow` CSS, or '' for a shadow-less preview.
 */
function resolveHoverPreviewCss(hoveredEntry, value, tokens, shadow) {
	if (!hoveredEntry) {
		return resolvePreviewCss(value, tokens, shadow);
	}

	return hoveredEntry.kind === 'token' ? hoveredEntry.entry.value : '';
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
			{renderColor && (
				// A plain wrapper, not a rebuilt picker: whatever the caller's `renderColor` already renders
				// (the Style Library's `TokenColorSelectField` swatch-plus-"Color"-label toggle, the block
				// editor's `PopColorControl`) keeps its own click-to-open mechanism and chrome untouched;
				// this only gives it its own row above the axes instead of sitting inline with them.
				<div className="kb-box-shadow-control__color-row">
					{renderColor({ value: shadow.color, onChange: (next) => setPart('color', next), disabled })}
				</div>
			)}
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
 * @param {*}         [props.defaultValue] What an UNSET control falls back to — a token alias or a
 *                                        composite. Shown muted on the trigger and offered as the
 *                                        popover's Reset target, exactly as `TokenSelector` treats its
 *                                        own `defaultValue`. Without one, an unset control reads the
 *                                        bare muted "Default" it always did, so a host with no preset
 *                                        shadow to name is unchanged.
 * @param {Function}  [props.renderColor] `({ value, onChange }) => Element` for the color sub-field.
 * @param {boolean}   [props.disabled]    Whether the control is read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function BoxShadowControl({ value, onChange, label, tokens = [], defaultValue, renderColor, disabled = false }) {
	const aliased = isTokenAlias(value);
	// Only a real object is spread. A shadow can also arrive as a rendered STRING — the editor's capture
	// flow writes one — and spreading a string splays it into indexed character keys, which the Custom
	// tab would then write back as a shadow whose sub-fields are `0`, `p`, `x`. Degrading to the default
	// shape reads as unset, which is wrong but harmless where the alternative cannot be saved at all.
	const custom = typeof value === 'object' && value !== null && !Array.isArray(value) ? value : {};
	// An alias carries no legs of its own, so the Custom tab has nothing to seed from unless it borrows
	// the bound token's own resolved shorthand here — without this, switching to Custom tab reads as
	// an all-zero, transparent shadow and editing one leg discards the token's real value.
	const aliasedEntry = aliased ? (tokens || []).find((entry) => entry.alias === value) : null;
	const shadow = aliased
		? { ...DEFAULT_COMPOSITE, ...(aliasedEntry ? parseResolvedShadow(aliasedEntry.value) : {}) }
		: { ...DEFAULT_COMPOSITE, ...custom };
	// A fixed pick keeps no live alias, so a sentinel is recognized after the fact by its shorthand.
	const fixedMatch = !aliased && hasValue(value) ? matchFixedEntry(shadow, tokens) : null;
	// Display only — `onChange` still sees the real underlying value.
	const displayValue = fixedMatch ? fixedMatch.alias : value;
	// The trigger shows a label, never a value — it has no room for the `value` half `fieldSummary()`
	// also returns. Unset names the shadow it falls back to, or a muted "Default" when there is none.
	//
	// Whether an unset shadow can reach that branch is the host's problem: the button's registered
	// `shadow` default IS the None composite (see `EditorShadowControl`'s `isUnsetShadow()`).
	// `defaultSummary()`, not `fieldSummary()`: a fixed sentinel is not a named design choice, so its
	// label must not be borrowed for a field nobody touched — an all-zero fallback would otherwise read
	// as an explicit "None" pick. See that helper's own docblock.
	const fallback = defaultSummary(resolveDefaultValue(defaultValue, tokens, '', false), tokens);
	const summary =
		aliased || fixedMatch
			? { ...fieldSummary(displayValue, tokens, '', __('Custom', 'kadence-blocks')), value: '' }
			: !hasValue(value)
				? {
						label: fallback.label || __('Default', 'kadence-blocks'),
						value: '',
						muted: true,
					}
				: { label: __('Custom', 'kadence-blocks'), value: '' };

	return (
		<ControlShell label={label} disabled={disabled}>
			<div className="kb-token-control__row">
				<div className="kadence-token-field">
					<Dropdown
						className="kadence-token-field__dropdown"
						contentClassName="kadence-token-field__popover"
						renderToggle={({ isOpen, onToggle }) => (
							<Button
								className="kadence-token-field__trigger kb-box-shadow-control__trigger"
								onClick={onToggle}
								disabled={disabled}
								aria-expanded={isOpen}
							>
								<span className="kadence-token-field__icon" aria-hidden="true">
									{shadowGlyph}
								</span>
								{summary.label && (
									<span
										className={`kadence-token-field__label${summary.muted ? ' kadence-token-field__label--default' : ''}`}
									>
										{summary.label}
									</span>
								)}
							</Button>
						)}
						renderContent={({ onClose }) => (
							<TokenPopover
								value={displayValue}
								tokens={tokens}
								resolvedDefault={resolvePreviewCss(defaultValue, tokens, {
									...DEFAULT_COMPOSITE,
									...(isTokenAlias(defaultValue) || !defaultValue ? {} : defaultValue),
								})}
								initialTab={aliased || fixedMatch || !value ? 'style-library' : 'custom'}
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
								renderPreview={({ value: previewValue, tokens: previewTokens, hoveredEntry }) => (
									<div
										className="kb-box-shadow-control__preview"
										style={{
											boxShadow:
												resolveHoverPreviewCss(
													hoveredEntry,
													previewValue,
													previewTokens,
													shadow
												) || 'none',
										}}
										aria-hidden="true"
									/>
								)}
							/>
						)}
					/>
				</div>
			</div>
		</ControlShell>
	);
}
