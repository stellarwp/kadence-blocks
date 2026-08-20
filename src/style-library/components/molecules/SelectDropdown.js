/**
 * A general-purpose selector control for the Style Library app: a bordered toggle showing the
 * active option's label with a trailing chevron, opening a menu that lists every option (a check
 * icon on the active one) with an optional single trailing action below a divider. Knows nothing
 * about what the options represent — a caller supplies values, labels, and a change handler (the
 * library selector is one caller; the Color Palette screen's palette selector is another, with
 * identical geometry and only different strings).
 */

/**
 * WordPress dependencies
 */
import { Button, Dropdown, MenuGroup, MenuItem, Notice, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { Icon, check, chevronDown } from '@wordpress/icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { Skeleton } from '../atoms/Skeleton';
import './SelectDropdown.scss';

// A fixed placeholder-row count — there is no "expected row count" to read before the real options
// arrive, so this is a plain visual approximation, not a value derived from real data.
const SKELETON_ROW_IDS = [0, 1, 2];

/**
 * Render the selector dropdown.
 *
 * @param {Object}                               props                 The component props.
 * @param {string}                                props.value           The current option's value.
 * @param {Array<{value: string, label: string, badges?: Array<{text: string, variant?: string}>}>} props.options
 *                                                                       The selectable options, in display order. An option may carry short badges
 *                                                                       rendered after its label in the menu (never in the toggle, which is a fixed
 *                                                                       width the label already truncates against). `variant` is `'state'` for a
 *                                                                       condition that changes over time and `'muted'` for an unchanging property —
 *                                                                       this component only maps them to class names, it does not know what any
 *                                                                       badge means.
 * @param {Function}                              props.onChange        Called with a value when a different option is chosen.
 * @param {boolean}                               [props.isBusy]        Whether a change is in flight.
 * @param {boolean}                               [props.isLoading]     Whether the option list itself is still
 *                                                                       loading (as opposed to `isBusy`, which
 *                                                                       covers a write in flight). While true and
 *                                                                       the menu is open, skeleton rows render in
 *                                                                       place of `options`.
 * @param {boolean}                               [props.showSpinner]   Whether the inline busy spinner is drawn. Defaults to true; a caller that
 *                                                                       already shows progress for the same wait elsewhere passes false to avoid a
 *                                                                       second indicator. Independent of `isBusy`, which still disables the control.
 * @param {?{message: string}}                    [props.error]         The current error, if any.
 * @param {Function}                              [props.onClearError]  Dismisses the current error.
 * @param {?{label: string, onClick: Function}}   [props.trailingAction] A single action rendered below a divider, separate from the option list.
 * @param {string}                                [props.className]     Extra class names for the root wrapper.
 * @param {string}                                [props.valueLabel]    The label for `value` to show while no option in `options` matches it yet
 *                                                                       (e.g. options are still loading) — falls back to the raw `value` when omitted.
 *                                                                       Lets a caller that knows how to name its value without the fetched list (the
 *                                                                       library selector does, from the slug alone) avoid a flash of the raw value on
 *                                                                       first paint; this component stays unaware of what that naming rule is.
 * @param {?import('@wordpress/icons').IconType}  [props.leadingIcon]   An optional glyph rendered before the label inside the toggle only (never
 *                                                                       in the menu rows); caller data, omitted for the plain library-selector shape.
 *
 * @since TBD
 *
 * @return {JSX.Element} The dropdown.
 */
export function SelectDropdown({
	value,
	options,
	onChange,
	isBusy,
	isLoading = false,
	showSpinner = true,
	error,
	onClearError,
	trailingAction,
	className,
	valueLabel,
	leadingIcon,
}) {
	const activeOption = options.find((option) => option.value === value);
	const activeLabel = activeOption?.label ?? valueLabel ?? value;

	return (
		<div className={classnames('kadence-blocks-style-library__select-dropdown', className)}>
			<Dropdown
				className="kadence-blocks-style-library__select-dropdown-dropdown"
				contentClassName="kadence-blocks-style-library__select-dropdown-menu"
				// offset: 0 — the design has the menu flush against the toggle's bottom border, and
				// Popover's own default offset would otherwise leave a gap between them.
				popoverProps={{ placement: 'bottom-start', offset: 0 }}
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="kadence-blocks-style-library__select-dropdown-toggle"
						aria-expanded={isOpen}
						disabled={isBusy}
						onClick={onToggle}
					>
						{leadingIcon && (
							<Icon
								className="kadence-blocks-style-library__select-dropdown-leading-icon"
								icon={leadingIcon}
							/>
						)}
						{/* The visible label is the button's accessible name — the active option's label must
						 * be what a screen reader announces, not just the trailing chevron icon. */}
						<span className="kadence-blocks-style-library__select-dropdown-label">{activeLabel}</span>
						<span className="kadence-blocks-style-library__select-dropdown-icon">
							<Icon
								className="kadence-blocks-style-library__select-dropdown-chevron"
								icon={chevronDown}
							/>
						</span>
					</Button>
				)}
				renderContent={({ onClose }) => (
					<>
						<MenuGroup>
							{isLoading ? (
								<div
									className="kadence-blocks-style-library__select-dropdown-skeleton-group"
									role="status"
									aria-live="polite"
									aria-busy="true"
									aria-label={__('Loading options…', 'kadence-blocks')}
								>
									{SKELETON_ROW_IDS.map((id) => (
										<div
											key={id}
											className="kadence-blocks-style-library__select-dropdown-skeleton-row"
										>
											<Skeleton className="kadence-blocks-style-library__select-dropdown-skeleton-label" />
										</div>
									))}
								</div>
							) : (
								options.map((option) => {
									const isCurrent = option.value === value;

									return (
										<MenuItem
											key={option.value}
											role="menuitemradio"
											aria-checked={isCurrent}
											disabled={isBusy}
											// Badges ride in the suffix rather than beside the label, so they and
											// the check are siblings of the label's own box and the button's
											// single `gap` spaces all three identically — no margins of their
											// own to keep in step with it.
											//
											// The check slot is always rendered, empty on the rows without a
											// check, so every row reserves the same trailing column. Without it
											// the check's width exists on one row only, and everything to its
											// left sits at a different right edge there than on its neighbors.
											suffix={
												<>
													{option.badges?.length > 0 && (
														<span className="kadence-blocks-style-library__select-dropdown-badges">
															{option.badges.map((badge) => (
																<span
																	key={badge.text}
																	className={classnames(
																		'kadence-blocks-style-library__select-dropdown-badge',
																		`kadence-blocks-style-library__select-dropdown-badge--${badge.variant ?? 'muted'}`
																	)}
																>
																	{badge.text}
																</span>
															))}
														</span>
													)}
													<span className="kadence-blocks-style-library__select-dropdown-check-slot">
														{isCurrent && (
															<Icon
																className="kadence-blocks-style-library__select-dropdown-check"
																icon={check}
															/>
														)}
													</span>
												</>
											}
											onClick={() => {
												onClose();

												if (!isCurrent) {
													onChange(option.value);
												}
											}}
										>
											{option.label}
										</MenuItem>
									);
								})
							)}
						</MenuGroup>
						{trailingAction && (
							<>
								{/* An explicit divider, not a border on the second MenuGroup: the design insets
								 * the line from the menu edges (12px horizontal / 8px vertical padding around
								 * it), which a full-bleed group border can't express. The wrapper carries that
								 * padding; the line itself is a real child element, not a `::before` — a pseudo
								 * has no separate node to inspect, which is exactly why the line's geometry took
								 * three rounds to get right. */}
								<div
									className="kadence-blocks-style-library__select-dropdown-divider"
									role="separator"
									aria-orientation="horizontal"
								>
									<span className="kadence-blocks-style-library__select-dropdown-divider-line" />
								</div>
								<MenuGroup>
									<MenuItem
										className="kadence-blocks-style-library__select-dropdown-trailing-action"
										disabled={isBusy}
										onClick={() => {
											onClose();
											trailingAction.onClick();
										}}
									>
										{trailingAction.label}
									</MenuItem>
								</MenuGroup>
							</>
						)}
					</>
				)}
			/>
			{isBusy && showSpinner && <Spinner className="kadence-blocks-style-library__select-dropdown-spinner" />}
			{error && (
				<Notice
					status="error"
					className="kadence-blocks-style-library__select-dropdown-error"
					onRemove={onClearError}
				>
					{error.message}
				</Notice>
			)}
		</div>
	);
}
