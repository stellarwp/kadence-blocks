/**
 * The border token control: width and style per side, one link toggle, color supplied by the
 * caller.
 *
 * Border is not a `BoxControl` the way radius and spacing are — it carries two properties per side
 * (width, style) instead of one, and a third (color) this control deliberately does not touch
 * (color is being reworked separately; see `renderColor`). `SlotGrid` still applies unmodified: its
 * `renderSlot` render-prop was already generic, so this control renders a one-box row per slot
 * instead of `BoxControl`'s single `TokenSelector`.
 *
 * `SlotGrid`'s own `value`/`onChange` props only drive its slot *arrangement* (linked-vs-grid,
 * corner display order, labels) — the `onChange` it would call from inside `renderSlot`'s `onChange`
 * argument is dead here because this `renderSlot` ignores that argument entirely and writes through
 * the `patch` closure instead, since a slot needs to update three parallel axes (width, style, and
 * color), not the one `SlotGrid` knows how to collapse. That also means `SlotGrid`'s own linked-mode
 * behavior — filling every slot with the written value, or returning a bare scalar when `collapse`
 * is set — never runs; this control has to reproduce "write the scalar directly while linked" itself
 * (`applyToAxis` below), or every write while linked would silently turn a scalar axis into a
 * four-element array of identical values, which would then make `isSlotList()` see it as unlinked
 * on the very next render.
 *
 * Border style has no token library (`Style Library`'s Base Styles nav has no "Border Style"
 * screen — only one semantic default exists), so the style field is a plain closed-enum select,
 * not a `TokenSelector`/`TokenPopover` pair. Width reuses `TokenSelector` exactly as radius/spacing
 * do. Color is entirely out of this control's scope — the caller renders it via `renderColor`.
 *
 * Each row shares one control box — a 20px color swatch, a style-preview box, then the width
 * field's label/value — matching Padding/Margin/Radius's row anatomy except for the two pickers up
 * front. `renderColor` keeps its existing `({ value, onChange, label, disabled }) => Element`
 * contract; this control simply calls it once per row (once for the linked row, once per side
 * when unlinked)
 * with that row's own resolved color scalar instead of the whole axis, the same way it already
 * reads `width`/`style` per row. A caller's existing `renderColor` — whether it renders a bare
 * swatch or a small swatch-plus-label field like the Style Library's `TokenColorSelectField` —
 * already renders something compact enough to sit in that slot once it only ever receives a scalar
 * (never a four-element list), so no new render-prop was needed.
 */

/**
 * WordPress dependencies
 */
import { SelectControl } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { ControlShell } from '../templates/ControlShell';
import { SlotGrid } from '../templates/SlotGrid';
import { TokenSelector } from '../organisms/TokenSelector';
import { isSlotList, readSlot, toSlotList, writeSlot } from '../helpers/value-shapes';

/**
 * The border styles offered. The backend accepts all 10 CSS `border-style` keywords
 * (`Literals.php`'s `BORDER_STYLE_KEYWORDS`), but this control deliberately offers a curated 5 —
 * `groove`/`ridge`/`inset`/`outset`/`hidden` are legacy 3D effects nobody designs with here.
 *
 * @since TBD
 */
const STYLES = [
	{ value: 'none', label: __('None', 'kadence-blocks') },
	{ value: 'solid', label: __('Solid', 'kadence-blocks') },
	{ value: 'dashed', label: __('Dashed', 'kadence-blocks') },
	{ value: 'dotted', label: __('Dotted', 'kadence-blocks') },
	{ value: 'double', label: __('Double', 'kadence-blocks') },
];

/**
 * Write one axis (`width`, `style`, or `color`) at a slot position, keeping a linked axis a scalar.
 *
 * `writeSlot()` always returns an array unless every slot ends up identical and `collapse` is on —
 * neither fits the linked case here, where `SlotGrid` reports the write as slot index `null` and the
 * only correct result is the scalar itself, not a four-element array that merely looks uniform.
 *
 * @param {*}      axis  The axis's current scalar or slot list.
 * @param {?number} index The slot `SlotGrid` reported (`null` while linked).
 * @param {*}      next  The value to write.
 *
 * @since TBD
 *
 * @return {*} The axis's next scalar or slot list.
 */
function applyToAxis(axis, index, next) {
	return index === null ? next : writeSlot(axis, index, next, false);
}

/**
 * Render a border token control.
 *
 * @param {Object}    props                      The component props.
 * @param {Object}    props.value                `{ width, style, color }`; width and style are
 *                                                independently a scalar or a
 *                                                `[top, right, bottom, left]` slot list.
 * @param {Function}  props.onChange              Called with the next `{ width, style, color }`.
 * @param {string}    props.label                 The control's label.
 * @param {Array}     [props.widthTokens]         Pickable border-width tokens.
 * @param {?Array}    [props.slotIcons]            Per-slot glyphs, in stored order (matches
 *                                                `BoxControl`'s prop).
 * @param {?Object}   [props.status]              `{ bound, modified }`; omit for no indicator.
 * @param {?JSX.Element} [props.indicator]        Rendered in the header instead of the built-in one.
 * @param {?Function} [props.onReset]             Reset handler, paired with `status`.
 * @param {boolean}   [props.showReset]           Render the matching glyph and reset button.
 * @param {?Array}    [props.breakpoints]         Breakpoint keys; omit for non-responsive.
 * @param {?string}   [props.breakpoint]          The active breakpoint.
 * @param {?Function} [props.onBreakpointChange]  Breakpoint-change handler.
 * @param {?boolean}  [props.isLinked]            Linked state, when the host controls it.
 * @param {?Function} [props.onToggleLink]        Link-toggle handler; omit to let this own the state.
 * @param {?Function} [props.renderColor]         `({ value, onChange, label, disabled }) =>
 *                                                Element` — the caller's existing color field for
 *                                                one side's color. Called once per row with that
 *                                                row's own resolved scalar (the linked row reads
 *                                                slot 0) and that row's bare side name as `label`
 *                                                (`null` while linked) so an unlinked caller can
 *                                                give each of the four swatches a distinct
 *                                                accessible name; ignoring `label` is fine. Renders
 *                                                nothing when omitted.
 * @param {boolean}   [props.stacked]             Header above a full-width body instead of beside it.
 * @param {boolean}   [props.disabled]            Whether the control is read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered control.
 */
export function BorderControl({
	value = {},
	onChange,
	label,
	widthTokens = [],
	slotIcons = null,
	status = null,
	onReset = null,
	showReset = true,
	indicator = null,
	breakpoints = null,
	breakpoint = null,
	onBreakpointChange = null,
	isLinked = null,
	onToggleLink = null,
	renderColor,
	stacked = false,
	disabled = false,
}) {
	const { width = '', style = 'none', color = '' } = value;

	const controlled = typeof onToggleLink === 'function';
	const linked = controlled ? Boolean(isLinked) : !isSlotList(width) && !isSlotList(style);

	const patch = (next) => onChange({ ...value, ...next });

	const toggleLink = controlled
		? onToggleLink
		: () => {
				if (linked) {
					patch({ width: toSlotList(width), style: toSlotList(style) });
					return;
				}

				// Relinking reads slot 0 of each axis — "the first side wins" is predictable, matching
				// BoxControl's own relink rule. It does not require the four slots to already match.
				// `color` folds the same way even though this control never promotes it to a list itself
				// (`toSlotList` above only touches width/style) — a caller's `renderColor` can still widen
				// it into one through `applyToAxis`, and leaving it unfolded here would relink the visible
				// width/style fields while `color` stayed a stale four-element list underneath.
				patch({ width: readSlot(width, 0), style: readSlot(style, 0), color: readSlot(color, 0) });
			};

	return (
		<ControlShell
			label={label}
			status={status}
			onReset={onReset}
			showReset={showReset}
			indicator={indicator}
			breakpoints={breakpoints}
			breakpoint={breakpoint}
			onBreakpointChange={onBreakpointChange}
			isLinked={linked}
			onToggleLink={toggleLink}
			stacked={stacked}
			disabled={disabled}
		>
			<SlotGrid
				value={width}
				onChange={() => {}}
				isLinked={linked}
				role="sides"
				label={label}
				collapse={false}
				renderSlot={({ index, label: slotLabel }) => {
					const slotIndex = index ?? 0;
					const widthSlot = readSlot(width, slotIndex);
					const styleSlot = readSlot(style, slotIndex) || 'none';
					const colorSlot = readSlot(color, slotIndex);
					// Linked mode has one field standing for every side, so the generic label is
					// accurate; unlinked mode names the side so screen readers can tell the four
					// style selectors apart, matching what the width TokenSelector's icon already
					// does visually via `slotIcons`.
					const styleLabel =
						index === null
							? __('Border style', 'kadence-blocks')
							: sprintf(
									/* translators: %s: the side name, e.g. "top". */ __(
										'Border style (%s)',
										'kadence-blocks'
									),
									slotLabel
								);

					return (
						<div className="kb-border-control__box" key={index ?? 'linked'}>
							{renderColor && (
								<span className="kb-border-control__swatch">
									{renderColor({
										value: colorSlot,
										onChange: (next) =>
											!disabled && patch({ color: applyToAxis(color, index, next) }),
										// The bare side name (e.g. "top"), or `null` while linked -- additive, so a
										// caller ignoring it keeps its own default name. Passed unformatted (unlike
										// `styleLabel` below) because each caller already has its own established
										// wording for naming a color field (`singlebtn/edit.js`'s "%s Border Color",
										// `BorderField.js`'s plain field name) and composing a sentence here would
										// fight both.
										label: index === null ? null : slotLabel,
										disabled,
									})}
								</span>
							)}
							<span className="kb-border-control__style-preview">
								<span
									className={`kb-border-control__style-preview-rule kb-border-control__style-preview-rule--${styleSlot}`}
									aria-hidden="true"
								/>
								<SelectControl
									className="kb-border-control__style-select"
									label={styleLabel}
									hideLabelFromVision
									value={styleSlot}
									options={STYLES}
									disabled={disabled}
									onChange={(next) => !disabled && patch({ style: applyToAxis(style, index, next) })}
								/>
							</span>
							<TokenSelector
								value={widthSlot}
								icon={slotIcons?.[slotIndex]}
								tokens={widthTokens}
								disabled={disabled}
								onPick={(alias) => !disabled && patch({ width: applyToAxis(width, index, alias) })}
								onClear={() => !disabled && patch({ width: applyToAxis(width, index, '') })}
								onCustom={(next) => !disabled && patch({ width: applyToAxis(width, index, next) })}
							/>
						</div>
					);
				}}
			/>
		</ControlShell>
	);
}
