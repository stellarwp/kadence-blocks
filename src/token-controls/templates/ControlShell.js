/**
 * The chrome a token control wears: its label, and whichever affordances the control opted into — a
 * breakpoint switcher, a linked/individual toggle, and a binding indicator with reset.
 *
 * Every affordance is opt-in by prop. A color control passes none and gets a bare label; a radius
 * control passes all three.
 *
 * Two deliberate non-responsibilities, both so the same shell serves the Style Library and the
 * block editor:
 *
 * - **It does not resolve breakpoints.** It renders the switcher and reports the choice; the caller
 *   hands it the active breakpoint's value. The two apps store breakpoints differently (one nested
 *   envelope versus sibling attributes) and neither shape belongs in here.
 * - **It does not derive the linked state.** `isLinked` is a prop. The block editor's attribute is
 *   always a four-element array, so shape cannot tell you whether the user is editing sides
 *   together — that is UI state the caller owns.
 */

/**
 * WordPress dependencies
 */
import { Button, ButtonGroup, Dashicon } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { BindingIndicator } from '../atoms/BindingIndicator';

/**
 * The breakpoint switcher's dashicon and item class per breakpoint.
 *
 * Both mirror `@kadence/components`' responsive measurement control exactly — same dashicons, same
 * `kb-desk-tab` / `kb-tablet-tab` / `kb-mobile-tab` hooks — so the two switchers are the same
 * control rather than two that merely resemble each other. The rules moved into this library's own
 * CSS, which both hosts load; the package's `editor.scss` only ever reached the editor.
 *
 * @since TBD
 */
const BREAKPOINT_LABELS = {
	desktop: __('Desktop', 'kadence-blocks'),
	tablet: __('Tablet', 'kadence-blocks'),
	mobile: __('Mobile', 'kadence-blocks'),
};

/**
 * The breakpoint switcher's dashicon and item class per breakpoint.
 *
 * @since TBD
 */
const BREAKPOINTS_UI = {
	desktop: { icon: 'desktop', itemClass: 'kb-desk-tab' },
	tablet: { icon: 'tablet', itemClass: 'kb-tablet-tab' },
	mobile: { icon: 'smartphone', itemClass: 'kb-mobile-tab' },
};

/**
 * Render a control's chrome around its body.
 *
 * @param {Object}          props                      The component props.
 * @param {string|Element}  props.label                The control's label; a node when the caller
 *                                                     supplies its own indicator inline.
 * @param {Element}         props.children             The control body.
 * @param {?Object}         [props.status]             `{ bound, modified }` for the indicator.
 * @param {?Function}       [props.onReset]            Reset handler, shown when `status.modified`.
 * @param {boolean}         [props.showReset]          Render the matching glyph and reset button; false
 *                                                     leaves only the modified dot.
 * @param {?Array}          [props.breakpoints]        Breakpoint keys; omit for a non-responsive control.
 * @param {?string}         [props.breakpoint]         The active breakpoint (controlled).
 * @param {?Function}       [props.onBreakpointChange] Breakpoint-change handler.
 * @param {?boolean}        [props.isLinked]           Whether slots are edited together; omit for a
 *                                                     control with no link concept.
 * @param {?Function}       [props.onToggleLink]       Link-toggle handler.
 * @param {boolean}         [props.stacked]            Put the header above a full-width body instead
 *                                                     of beside it.
 * @param {boolean}         [props.highlight]          Tint the whole row, for a host that flags edited
 *                                                     controls. The host decides when — the editor
 *                                                     reads its own "highlight edits" setting.
 * @param {?Element}        [props.indicator]          A host-supplied mark rendered in place of the
 *                                                     built-in one. The block editor has its own
 *                                                     indicator that predates this library and is used
 *                                                     across controls this shell does not wrap, so it
 *                                                     passes that rather than showing a second mark
 *                                                     that means the same thing but looks different.
 * @param {boolean}         [props.disabled]           Whether every affordance is inert.
 *
 * @since TBD
 *
 * @return {JSX.Element} The wrapped control.
 */
export function ControlShell({
	label,
	children,
	status = null,
	onReset = null,
	showReset = true,
	breakpoints = null,
	breakpoint = null,
	onBreakpointChange = null,
	isLinked = null,
	onToggleLink = null,
	stacked = false,
	highlight = false,
	disabled = false,
	indicator = null,
}) {
	const responsive = Array.isArray(breakpoints) && breakpoints.length > 1;
	const linkable = typeof onToggleLink === 'function';

	// Whether `BindingIndicator` will actually render something. `status` being an object is not
	// enough: `{ bound: false }` is truthy but renders null, as does a bound-and-unmodified status
	// when `showReset` is off.
	const hasIndicator = Boolean(indicator) || Boolean(status?.bound && (status.modified || showReset));

	// A control that carries its own indicator inline needs no header at all — rendering an empty
	// one leaves a gap above it. The wrapper then contributes only the highlight tint, which is how
	// the block editor's rows with and without a header differ.
	const hasHeader = Boolean(label) || linkable || responsive || hasIndicator;

	const className = [
		'kb-token-control',
		stacked ? 'kb-token-control--stacked' : '',
		highlight ? 'kb-token-control--highlight' : '',
	]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={className}>
			{hasHeader && (
				<div className="kb-token-control__header">
					<span className="kb-token-control__label">{label}</span>
					{indicator ?? (
						<BindingIndicator status={status} onReset={onReset} showReset={showReset} disabled={disabled} />
					)}

					<div className="kb-token-control__affordances">
						{responsive && (
							<ButtonGroup
								className="kb-measure-responsive-options"
								aria-label={__('Device', 'kadence-blocks')}
							>
								{breakpoints.map((key) => {
									const ui = BREAKPOINTS_UI[key] ?? BREAKPOINTS_UI.desktop;
									const active = key === breakpoint;

									return (
										<Button
											key={key}
											className={`kb-responsive-btn ${ui.itemClass}${active ? ' is-active' : ''}`}
											isSmall
											// `aria-pressed` rather than `isPressed`, matching the editor:
											// `isPressed` adds WordPress's `is-pressed` class and its dark
											// fill, which then fights the `is-active` color these buttons
											// actually use.
											aria-pressed={active}
											onClick={() => onBreakpointChange?.(key)}
											disabled={disabled}
											// Named, but with the tooltip suppressed. The editor passes no label at all,
											// which leaves a button whose only content is a decorative
											// dashicon with no accessible name; this keeps the name and
											// suppresses the tooltip so the two look identical.
											label={BREAKPOINT_LABELS[key] ?? key}
											showTooltip={false}
										>
											<Dashicon icon={ui.icon} />
										</Button>
									);
								})}
							</ButtonGroup>
						)}

						{linkable && (
							<Button
								// The class contract `@kadence/components`' measure control uses for this
								// toggle, so one set of rules dresses both. `is-tertiary` is the unlinked
								// resting state; `is-pressed` takes the filled treatment.
								className={`kadence-radio-item kadence-control-toggle radio-custom is-single only-icon${
									isLinked ? '' : ' is-tertiary'
								}`}
								icon={isLinked ? link : linkOff}
								isSmall
								isPressed={Boolean(isLinked)}
								onClick={onToggleLink}
								disabled={disabled}
								// Labelled with the state the press moves to, matching the editor's toggle.
								label={isLinked ? __('Individual', 'kadence-blocks') : __('Linked', 'kadence-blocks')}
							/>
						)}
					</div>
				</div>
			)}

			<div className="kb-token-control__body">{children}</div>
		</div>
	);
}
