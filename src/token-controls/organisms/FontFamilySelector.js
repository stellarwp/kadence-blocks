/**
 * A block's font-family slot as a favorites-aware field: a trigger reading like the control's own
 * input, opening a popover with a `Favorites` tab and a `Custom` tab.
 *
 * The `TokenSelector` shape applied to a value that is not a token. Both tabs write the same plain
 * family string — a favorite is a shortcut to the top of the list, never an alias — so this control
 * takes no `tokens` prop and never calls `resolveToken`. What it shares with its token sibling is
 * the anatomy and the tab-selection rule, not the value model. A theme font reference the catalog no
 * longer offers reads as "Reverted to default" with a hint, the same way `TokenSelector` treats a
 * deleted token.
 */

/**
 * WordPress dependencies
 */
import { Button, Dropdown, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FontFamilyPopover } from '../molecules/FontFamilyPopover';
import { StaleTokenHint, StaleTokenTooltip, staleFamilyMessage, staleTokenLabel } from '../atoms/StaleTokenHint';
import { isThemeFontReference, sameFamily } from '../helpers/font-family';
import '../styles/token-controls.scss';

/**
 * Render the font-family field.
 *
 * An unset family shows the theme's name, muted, rather than reading as empty: a block with no
 * family set still renders in *some* face, and naming it keeps "what this block sets" and "what it
 * falls back to" apart — the same distinction `TokenSelector` draws between a value and its
 * inherited default.
 *
 * @param {Object}   props
 * @param {string}   props.value            The current family, or `''` when unset.
 * @param {Array}    [props.favorites]      The site's favorite families, in display order.
 * @param {Array}    [props.catalogOptions] The full catalog option list (`{ value, label, badge? }`).
 *                                          Also what the trigger reads to name the stored value, so
 *                                          an option whose value is not its own label reads as the
 *                                          label rather than as the raw stored string.
 * @param {string}   [props.inheritedLabel] What an unset family falls back to, for the muted trigger.
 * @param {string}   [props.manageUrl]      Deep link to the screen that manages favorites.
 * @param {Function} props.onPick           Writes a chosen family. May return a promise, in which
 *                                          case the field reads as loading until it settles.
 * @param {Function} props.onClear          Clears the family back to the theme's.
 * @param {boolean}  [props.disabled]       Disable the trigger. It is the only control outside the
 *                                          popover, so with it inert nothing below is reachable —
 *                                          guarding only the write callbacks would leave the field
 *                                          looking editable while silently dropping writes.
 * @param {?Element} [props.indicator]      A host-supplied binding mark, rendered beside the trigger.
 *                                          Same opt-in prop `BoxControl` and `ScalarControl` take, for
 *                                          the same reason: a family is not a token, but a preset can
 *                                          still set one, so the field has a preset value to match or
 *                                          diverge from and the mark says which. It sits inline rather
 *                                          than in a header because the label above this field belongs
 *                                          to the shared typography control, which this only replaces
 *                                          the editor of.
 *
 * @since TBD
 *
 * @return {Object} The rendered font-family field.
 */
export function FontFamilySelector({
	value,
	favorites = [],
	catalogOptions = [],
	inheritedLabel = '',
	manageUrl = '',
	onPick,
	onClear,
	disabled = false,
	indicator = null,
}) {
	// The family a pick is still waiting on. A host that fetches the web font before writing keeps
	// the current font on screen meanwhile, so without this the field would look like the click did
	// nothing for as long as the download takes. It also holds the trigger shut until the pick
	// settles: picking a second family while the first is in flight would let the slower of the two
	// write last and leave the field on the family the user moved off.
	const [pending, setPending] = useState('');

	const handlePick = async (picked) => {
		setPending(picked);

		try {
			await onPick(picked);
		} finally {
			setPending('');
		}
	};

	const family = typeof value === 'string' ? value : '';
	const unset = family === '';
	const isFavorite = favorites.some((entry) => sameFamily(entry, family));

	// What to call a stored value. For a family these are the same string, and this costs nothing. An
	// option can store something that is not a family name, though — the Kadence theme's global font
	// entries store a `var()` reference at the site's typography settings — and printing that raw is
	// a control showing the user CSS instead of the choice they made. A value no option claims (a
	// family the catalog has since dropped, say) still prints as itself rather than disappearing.
	const labelFor = (stored) => catalogOptions.find((option) => sameFamily(option.value, stored))?.label ?? stored;

	// A theme font reference the catalog no longer offers: the Kadence theme was swapped out, the
	// custom property is gone, and the var() already falls back to inherit — the same face an unset
	// field gets. The value stays (switching the theme back makes it work again; Reset is the way to
	// drop it), so the field says why it reads as the default instead of printing the CSS.
	const stale =
		!unset && isThemeFontReference(family) && !catalogOptions.some((option) => sameFamily(option.value, family));

	// A family already in the favorites opens on the short list; anything else opens on the catalog,
	// which is where it was picked from and the only tab that can show it in context. An unset field
	// opens on Favorites, the same nudge `TokenSelector` makes toward the curated list over
	// hand-picking — unless there are none, in which case the popover renders the catalog alone and
	// naming a tab that is not there would leave it opening on nothing.
	const initialTab = favorites.length > 0 && (unset || isFavorite) && !stale ? 'favorites' : 'custom';

	const fallback = inheritedLabel || __('Theme default', 'kadence-blocks');
	const triggerName = stale
		? staleFamilyMessage()
		: unset
			? sprintf(
					/* translators: %s: the inherited font family, e.g. "Inter". */ __(
						'Default (%s)',
						'kadence-blocks'
					),
					fallback
				)
			: labelFor(family);

	return (
		<div className="kadence-token-field kadence-token-field--font-family">
			<Dropdown
				className="kadence-token-field__dropdown"
				contentClassName="kadence-token-field__popover"
				popoverProps={{ placement: 'left-start' }}
				renderToggle={({ isOpen, onToggle }) => (
					<StaleTokenTooltip
						// A pending pick names the family it is fetching; the stale explanation would sit over
						// the spinner for a value the user has already moved off.
						active={stale && !pending}
						text={staleFamilyMessage()}
					>
						<Button
							className="kadence-token-field__trigger"
							onClick={onToggle}
							disabled={disabled || pending !== ''}
							aria-expanded={isOpen}
							label={pending ? labelFor(pending) : triggerName}
							// A stale trigger's tooltip comes from `StaleTokenTooltip` around it instead, which
							// can wrap the longer text; the button's own would render it as one long line.
							showTooltip={!stale}
						>
							{pending ? (
								<span className="kadence-token-field__value kadence-token-field__value--pending">
									<Spinner />
									{labelFor(pending)}
								</span>
							) : stale ? (
								// No fallback name beside the label: the trigger is narrow enough that a second
								// span pushes "Reverted to default" into an ellipsis, cutting the one word that
								// matters. The tooltip already says the default applies.
								<>
									<StaleTokenHint />
									<span className="kadence-token-field__label kadence-token-field__label--default">
										{staleTokenLabel()}
									</span>
								</>
							) : unset ? (
								<span className="kadence-token-field__value kadence-token-field__label--default">
									{fallback}
								</span>
							) : (
								<span className="kadence-token-field__value" style={{ fontFamily: family }}>
									{labelFor(family)}
								</span>
							)}
						</Button>
					</StaleTokenTooltip>
				)}
				renderContent={({ onClose }) => (
					<FontFamilyPopover
						value={family}
						favorites={favorites}
						catalogOptions={catalogOptions}
						initialTab={initialTab}
						stale={stale}
						manageUrl={manageUrl}
						onPick={handlePick}
						onClear={onClear}
						onClose={onClose}
					/>
				)}
			/>
			{indicator}
		</div>
	);
}
