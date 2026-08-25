/**
 * The two-tab picker a font-family field opens: `Favorites` (the families this site pinned) and
 * `Custom` (the whole searchable font catalog).
 *
 * Deliberately a sibling of `TokenPopover` rather than a mode of it. The shape reads the same on
 * screen, but what it picks is not a token: a favorite carries no alias, resolves through nothing,
 * and emits no CSS variable — both tabs write the same plain family string, and the only difference
 * between them is how short the list is. Folding that into `TokenPopover` would mean teaching the
 * token picker to sometimes not pick tokens, which is exactly the confusion dropping the font-family
 * token layer was meant to end.
 */

/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';
import { Button, Icon, MenuGroup, MenuItem, TabPanel, TextControl } from '@wordpress/components';
import { settings, starFilled, undo } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { filterCatalogOptions } from '../helpers/catalog-filter';

/**
 * The `Favorites` tab body: a `Reset` affordance that clears the family back to the theme's, then
 * the site's favorites, the active one pressed. Every choice closes the popover.
 *
 * An empty favorites list says so and points at the Style Library rather than rendering a blank
 * panel — with no tokens to fall back on, an empty Favorites tab would otherwise look broken.
 *
 * @param {Object}   props
 * @param {string}   props.value     The current family, so the active row renders pressed.
 * @param {Array}    props.favorites The site's favorite families, in display order.
 * @param {Function} props.onPick    Called with a family name when one is chosen.
 * @param {Function} props.onClear   Called when `Reset` is chosen; drops back to the theme's font.
 * @param {Function} props.onClose   Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {Object} The rendered favorites list.
 */
function FavoritesTab({ value, favorites, onPick, onClear, onClose }) {
	const hasOverride = typeof value === 'string' && value !== '';

	return (
		<div className="kadence-token-field__list">
			<Button
				className="kadence-token-field__reset"
				disabled={!hasOverride}
				icon={undo}
				onClick={() => {
					onClear();
					onClose();
				}}
			>
				{__('Reset', 'kadence-blocks')}
			</Button>
			{favorites.map((family) => (
				<Button
					key={family}
					className="kadence-token-field__item"
					isPressed={family === value}
					onClick={() => {
						onPick(family);
						onClose();
					}}
				>
					<span className="kadence-token-field__item-label" style={{ fontFamily: family }}>
						{family}
					</span>
				</Button>
			))}
			{favorites.length === 0 && (
				<p className="kadence-token-field__empty">
					{__('No favorite fonts yet. Add some on the Typography screen.', 'kadence-blocks')}
				</p>
			)}
		</div>
	);
}

/**
 * The `Custom` tab body: a focused search input above the filtered, capped catalog. A footer appears
 * once the match count exceeds the cap, inviting a narrower query rather than ever rendering all
 * ~1,900 families; a query that matches nothing says so instead of leaving the panel blank.
 *
 * @param {Object}   props
 * @param {string}   props.value   The current family, so the active row renders checked.
 * @param {Array}    props.options The full catalog option list, in display order.
 * @param {Function} props.onPick  Called with a family name when one is chosen.
 * @param {Function} props.onClose Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {Object} The rendered catalog search.
 */
export function FontCatalogTab({ value, options, onPick, onClose }) {
	const [query, setQuery] = useState('');
	const { visible, truncated } = useMemo(() => filterCatalogOptions(options, query), [options, query]);

	return (
		<div className="kadence-token-field__catalog">
			<TextControl
				__nextHasNoMarginBottom
				autoFocus
				className="kadence-token-field__search"
				placeholder={__('Search fonts…', 'kadence-blocks')}
				value={query}
				onChange={setQuery}
			/>
			<MenuGroup className="kadence-token-field__catalog-options">
				{visible.map((option) => (
					<MenuItem
						key={option.value}
						role="menuitemradio"
						aria-checked={option.value === value}
						suffix={option.badge && <span className="kadence-token-field__badge">{option.badge}</span>}
						onClick={() => {
							onPick(option.value);
							onClose();
						}}
					>
						{option.label}
					</MenuItem>
				))}
			</MenuGroup>
			{visible.length === 0 && (
				<p className="kadence-token-field__empty">{__('No fonts found', 'kadence-blocks')}</p>
			)}
			{truncated && (
				<p className="kadence-token-field__footer">{__('Keep typing to narrow the list', 'kadence-blocks')}</p>
			)}
		</div>
	);
}

/**
 * Render the two-tab font-family picker.
 *
 * @param {Object}   props
 * @param {string}   props.value          The current family.
 * @param {Array}    props.favorites      The site's favorite families, in display order.
 * @param {Array}    props.catalogOptions The full catalog option list.
 * @param {string}   props.initialTab     Which tab opens first.
 * @param {Function} props.onPick         Called with a family name when one is chosen, from either tab.
 * @param {Function} props.onClear        Called when `Reset` is chosen.
 * @param {Function} props.onClose        Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {Object} The rendered tabs.
 */
export function FontFamilyPopover({ value, favorites, catalogOptions, initialTab, onPick, onClear, onClose }) {
	return (
		<TabPanel
			className="kadence-token-field__tabs"
			initialTabName={initialTab}
			tabs={[
				{
					name: 'favorites',
					title: (
						<span className="kadence-token-field__tab-title">
							<Icon icon={starFilled} size={20} />
							{__('Favorites', 'kadence-blocks')}
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
				tab.name === 'favorites' ? (
					<FavoritesTab
						value={value}
						favorites={favorites}
						onPick={onPick}
						onClear={onClear}
						onClose={onClose}
					/>
				) : (
					<FontCatalogTab value={value} options={catalogOptions} onPick={onPick} onClose={onClose} />
				)
			}
		</TabPanel>
	);
}
