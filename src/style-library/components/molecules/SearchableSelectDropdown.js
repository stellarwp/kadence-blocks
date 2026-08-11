/**
 * A searchable variant of `SelectDropdown` for a large, flat catalog (the Typography screen's font
 * catalog: 1,916 Google families plus any site custom fonts) where a plain closed-list toggle+menu
 * would render every option and read as visibly slow. `SelectDropdown`'s toggle/chevron/flush-menu
 * geometry is the visual model here, not something this component extends — its contract (a small
 * closed list, radio semantics, three existing callers) would only get more complicated by bolting
 * search and a render cap onto it for one consumer.
 *
 * The menu opens with a search input that is focused automatically, above a filtered, capped option list; a footer
 * row appears once the match count exceeds the cap, inviting the user to keep typing to narrow
 * further rather than ever rendering the full catalog, and a query that matches nothing says so
 * instead of leaving the menu blank. `filterCatalogOptions` — the matching + cap
 * logic — lives in `helpers/catalog-filter.js`, a plain module with no React/JSX, so it is
 * unit-testable without mounting this component or importing its `.scss` (this app's tests are
 * pure-helpers-only for exactly that reason).
 */

/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Button, Dropdown, MenuGroup, MenuItem, TextControl } from '@wordpress/components';
import { Icon, chevronDown } from '@wordpress/icons';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { filterCatalogOptions } from '../../helpers/catalog-filter';
import './SearchableSelectDropdown.scss';

/**
 * Render the searchable catalog dropdown.
 *
 * @param {Object}                                                              props
 * @param {string}                                                              props.value        The current option's value (a catalog family name, never a token id).
 * @param {Array<{value: string, label: string, badge?: string}>}               props.options       The full, unfiltered option list, in display order. An option may carry a short `badge` (the "Custom" tag).
 * @param {Function}                                                            props.onChange      Called with a value when a different option is chosen.
 * @param {boolean}                                                             [props.isBusy]      Whether a change is in flight.
 * @param {string}                                                              [props.className]   Extra class names for the root wrapper.
 * @param {string}                                                              [props.valueLabel]  The label for `value` to show while no option in `options` matches it yet — falls back to the raw `value` when omitted.
 *
 * @since TBD
 *
 * @return {JSX.Element} The dropdown.
 */
export function SearchableSelectDropdown({ value, options, onChange, isBusy, className, valueLabel }) {
	const [query, setQuery] = useState('');
	const { visible, truncated } = useMemo(() => filterCatalogOptions(options, query), [options, query]);

	const activeOption = options.find((option) => option.value === value);
	const activeLabel = activeOption?.label ?? valueLabel ?? value;

	return (
		<div className={classnames('kadence-blocks-style-library__searchable-select-dropdown', className)}>
			<Dropdown
				className="kadence-blocks-style-library__searchable-select-dropdown-dropdown"
				contentClassName="kadence-blocks-style-library__searchable-select-dropdown-menu"
				popoverProps={{ placement: 'bottom-start', offset: 0 }}
				onClose={() => setQuery('')}
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="kadence-blocks-style-library__searchable-select-dropdown-toggle"
						aria-expanded={isOpen}
						disabled={isBusy}
						onClick={onToggle}
					>
						<span className="kadence-blocks-style-library__searchable-select-dropdown-label">
							{activeLabel}
						</span>
						<span className="kadence-blocks-style-library__searchable-select-dropdown-icon">
							<Icon
								className="kadence-blocks-style-library__searchable-select-dropdown-chevron"
								icon={chevronDown}
							/>
						</span>
					</Button>
				)}
				renderContent={({ onClose }) => (
					<>
						<TextControl
							__nextHasNoMarginBottom
							autoFocus
							className="kadence-blocks-style-library__searchable-select-dropdown-search"
							placeholder={__('Search fonts…', 'kadence-blocks')}
							value={query}
							onChange={setQuery}
						/>
						<MenuGroup className="kadence-blocks-style-library__searchable-select-dropdown-options">
							{visible.map((option) => {
								const isCurrent = option.value === value;

								return (
									<MenuItem
										key={option.value}
										role="menuitemradio"
										aria-checked={isCurrent}
										disabled={isBusy}
										suffix={
											option.badge && (
												<span className="kadence-blocks-style-library__searchable-select-dropdown-badge">
													{option.badge}
												</span>
											)
										}
										onClick={() => {
											onClose();
											setQuery('');

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
						{visible.length === 0 && (
							<div className="kadence-blocks-style-library__searchable-select-dropdown-empty">
								{__('No fonts found', 'kadence-blocks')}
							</div>
						)}
						{truncated && (
							<div className="kadence-blocks-style-library__searchable-select-dropdown-footer">
								{__('Keep typing to narrow the list', 'kadence-blocks')}
							</div>
						)}
					</>
				)}
			/>
		</div>
	);
}
