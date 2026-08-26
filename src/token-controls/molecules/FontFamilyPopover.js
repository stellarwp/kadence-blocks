// cspell:ignore noreferrer .
/**
 * The font-family picker a font field opens: `Favorites` (the families this site pinned) and
 * `Custom` (the whole searchable font catalog).
 *
 * Deliberately a sibling of `TokenPopover` rather than a mode of it. The shape reads the same on
 * screen, but what it picks is not a token: a favorite carries no alias, resolves through nothing,
 * and emits no CSS variable — both tabs write the same plain family string, and the only difference
 * between them is how short the list is. Folding that into `TokenPopover` would mean teaching the
 * token picker to sometimes not pick tokens, which is exactly the confusion dropping the font-family
 * token layer was meant to end.
 *
 * A site with no favorites gets the `Custom` tab alone rather than a two-tab panel whose first tab
 * is empty. That is why `Reset` lives in BOTH tab bodies: with the tabs conditional, neither one can
 * be the place that clears the field.
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
 * The `Reset` affordance both tab bodies open with: clears the field back to whatever it inherits.
 * Inert when nothing is set, so it never reads as an action that would do something.
 *
 * @param {Object}   props
 * @param {string}   props.value   The current family, so the button can gate on there being one.
 * @param {Function} props.onClear Called when `Reset` is chosen.
 * @param {Function} props.onClose Closes the popover after the choice.
 *
 * @since TBD
 *
 * @return {Object} The rendered reset button.
 */
function ResetRow({ value, onClear, onClose }) {
	return (
		<Button
			className="kadence-token-field__reset"
			disabled={typeof value !== 'string' || value === ''}
			icon={undo}
			onClick={() => {
				onClear();
				onClose();
			}}
		>
			{__('Reset', 'kadence-blocks')}
		</Button>
	);
}

/**
 * The `Favorites` tab body: `Reset`, the site's favorites with the active one pressed, and a footer
 * pointing at where favorites are managed. Every choice closes the popover.
 *
 * The footer shows whenever the tab does, not only when the list is empty — "where do I add another
 * one" is the question a user has once they have favorites, not before.
 *
 * @param {Object}   props
 * @param {string}   props.value       The current family, so the active row renders pressed.
 * @param {Array}    props.favorites   The site's favorite families, in display order.
 * @param {string}   [props.manageUrl] Deep link to the screen that manages favorites.
 * @param {Function} props.onPick      Called with a family name when one is chosen.
 * @param {Function} props.onClear     Called when `Reset` is chosen.
 * @param {Function} props.onClose     Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {Object} The rendered favorites list.
 */
function FavoritesTab({ value, favorites, manageUrl, onPick, onClear, onClose }) {
	return (
		<div className="kadence-token-field__list">
			<ResetRow value={value} onClear={onClear} onClose={onClose} />
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
			<p className="kadence-token-field__footer">
				{manageUrl ? (
					<a href={manageUrl} target="_blank" rel="noreferrer">
						{__('Manage favorites in the Style Library', 'kadence-blocks')}
					</a>
				) : (
					__('Manage favorites in the Style Library', 'kadence-blocks')
				)}
			</p>
		</div>
	);
}

/**
 * The `Custom` tab body: `Reset`, then a focused search input above the filtered, capped catalog. A
 * footer appears once the match count exceeds the cap, inviting a narrower query rather than ever
 * rendering all ~1,900 families; a query that matches nothing says so instead of leaving the panel
 * blank.
 *
 * @param {Object}   props
 * @param {string}   props.value   The current family, so the active row renders checked.
 * @param {Array}    props.options The full catalog option list, in display order.
 * @param {Function} props.onPick  Called with a family name when one is chosen.
 * @param {Function} props.onClear Called when `Reset` is chosen.
 * @param {Function} props.onClose Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {Object} The rendered catalog search.
 */
export function FontCatalogTab({ value, options, onPick, onClear, onClose }) {
	const [query, setQuery] = useState('');
	const { visible, truncated } = useMemo(() => filterCatalogOptions(options, query), [options, query]);

	return (
		<div className="kadence-token-field__list">
			<ResetRow value={value} onClear={onClear} onClose={onClose} />
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
 * Render the font-family picker: both tabs when the site has favorites, the catalog alone when it
 * does not.
 *
 * @param {Object}   props
 * @param {string}   props.value          The current family.
 * @param {Array}    props.favorites      The site's favorite families, in display order.
 * @param {Array}    props.catalogOptions The full catalog option list.
 * @param {string}   props.initialTab     Which tab opens first.
 * @param {string}   [props.manageUrl]    Deep link to the screen that manages favorites.
 * @param {Function} props.onPick         Called with a family name when one is chosen, from either tab.
 * @param {Function} props.onClear        Called when `Reset` is chosen.
 * @param {Function} props.onClose        Closes the popover after a choice.
 *
 * @since TBD
 *
 * @return {Object} The rendered picker.
 */
export function FontFamilyPopover({
	value,
	favorites = [],
	catalogOptions,
	initialTab,
	manageUrl,
	onPick,
	onClear,
	onClose,
}) {
	const catalog = (
		<FontCatalogTab value={value} options={catalogOptions} onPick={onPick} onClear={onClear} onClose={onClose} />
	);

	// One tab is not a tab strip. A site with no favorites gets the catalog directly rather than a
	// `Favorites` tab that opens onto nothing, which reads as the picker being broken rather than as
	// the site not having chosen any yet.
	if (favorites.length === 0) {
		return <div className="kadence-token-field__tabs kadence-token-field__tabs--single">{catalog}</div>;
	}

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
						manageUrl={manageUrl}
						onPick={onPick}
						onClear={onClear}
						onClose={onClose}
					/>
				) : (
					catalog
				)
			}
		</TabPanel>
	);
}
