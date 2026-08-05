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
import { Icon, check, chevronDown } from '@wordpress/icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './SelectDropdown.scss';

/**
 * Render the selector dropdown.
 *
 * @param {Object}                               props                 The component props.
 * @param {string}                                props.value           The current option's value.
 * @param {Array<{value: string, label: string}>} props.options         The selectable options, in display order.
 * @param {Function}                              props.onChange        Called with a value when a different option is chosen.
 * @param {boolean}                               [props.isBusy]        Whether a change is in flight.
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
							{options.map((option) => {
								const isCurrent = option.value === value;

								return (
									<MenuItem
										key={option.value}
										role="menuitemradio"
										aria-checked={isCurrent}
										disabled={isBusy}
										suffix={
											isCurrent ? (
												<Icon
													className="kadence-blocks-style-library__select-dropdown-check"
													icon={check}
												/>
											) : null
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
							})}
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
			{isBusy && <Spinner className="kadence-blocks-style-library__select-dropdown-spinner" />}
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
