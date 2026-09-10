/**
 * The border-style picker: a trigger that reads as the row's style-preview box — a short rule drawn
 * in the side's current `border-style` — opening a menu of the same options, each showing its own
 * rule next to its name.
 *
 * A native `<select>` can only render plain-text `<option>`s, so it cannot show what "dashed" or
 * "dotted" actually look like; this exists because the reference wants each option's own line style
 * visible in the list, not just its name. Built on the same `Dropdown` + `MenuGroup`/`MenuItem`
 * (`role="menuitemradio"`/`aria-checked`, a `check` suffix on the active option) idiom
 * `TokenColorSelectField` already established in this codebase, rather than the vendor package's
 * `DropdownMenu` — this stays dependency-free (`@wordpress/components`/`@wordpress/icons` only, no
 * store or global coupling), matching what the rest of `token-controls`/`style-library` already use.
 * `MenuGroup`/`MenuItem` alone give no keyboard roving between options (that is what `DropdownMenu`
 * gets from wrapping its menu in `NavigableMenu` internally — see
 * `@wordpress/components/src/dropdown-menu/index.tsx`), so the options here are wrapped in the same
 * `NavigableMenu` directly for arrow-key navigation; `Popover`'s own focus trap already provides
 * Escape-to-close and returns focus to the trigger on close, so neither of those needed reimplementing.
 *
 * Each rule — the trigger's and every option's — reuses `token-controls.scss`'s own
 * `.kb-border-control__style-preview-rule--*` modifier classes, the same ones the row's control box
 * always drew its preview with, so the line each option shows is the identical border-style CSS the
 * row itself uses, not a re-invented set.
 */

/**
 * WordPress dependencies
 */
import { Dropdown, MenuGroup, MenuItem, NavigableMenu } from '@wordpress/components';
import { Icon, check } from '@wordpress/icons';

/**
 * Render a border-style picker.
 *
 * @param {Object}   props            The component props.
 * @param {string}   props.value      The current style keyword (`'none'`, `'solid'`, …).
 * @param {Array}    props.options    `[{ value, label }]` — the pickable styles, in menu order.
 * @param {string}   [props.label]    The trigger's accessible name (e.g. "Border style (top)").
 * @param {boolean}  [props.disabled] Whether the trigger is inert.
 * @param {Function} props.onChange   Called with the picked style's `value`.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered picker.
 */
export function BorderStyleSelect({ value, options, label, disabled = false, onChange }) {
	return (
		<Dropdown
			className="kb-border-control__style-preview"
			contentClassName="kb-border-control__style-menu"
			popoverProps={{ placement: 'left-start' }}
			renderToggle={({ isOpen, onToggle }) => (
				<button
					type="button"
					className="kb-border-control__style-trigger"
					aria-label={label}
					aria-expanded={isOpen}
					disabled={disabled}
					onClick={onToggle}
				>
					<span
						className={`kb-border-control__style-preview-rule kb-border-control__style-preview-rule--${value}`}
						aria-hidden="true"
					/>
				</button>
			)}
			renderContent={({ onClose }) => (
				<NavigableMenu role="menu">
					<MenuGroup>
						{options.map((option) => {
							const isCurrent = option.value === value;

							return (
								<MenuItem
									key={option.value}
									role="menuitemradio"
									aria-checked={isCurrent}
									suffix={isCurrent ? <Icon icon={check} /> : null}
									onClick={() => {
										onClose();

										if (!disabled && !isCurrent) {
											onChange(option.value);
										}
									}}
								>
									<span className="kb-border-control__style-menu-swatch">
										<span
											className={`kb-border-control__style-preview-rule kb-border-control__style-preview-rule--${option.value}`}
											aria-hidden="true"
										/>
									</span>
									<span className="kb-border-control__style-menu-label">{option.label}</span>
								</MenuItem>
							);
						})}
					</MenuGroup>
				</NavigableMenu>
			)}
		/>
	);
}
