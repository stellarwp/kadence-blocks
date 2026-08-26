/**
 * A block's font-family slot as a favorites-aware field: a trigger reading like the control's own
 * input, opening a popover with a `Favorites` tab and a `Custom` tab.
 *
 * The `TokenSelector` shape applied to a value that is not a token. Both tabs write the same plain
 * family string — a favorite is a shortcut to the top of the list, never an alias — so this control
 * takes no `tokens` prop and never calls `resolveToken`. What it shares with its token sibling is
 * the anatomy and the tab-selection rule, not the value model.
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
import { sameFamily } from '../helpers/font-family';
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
 * @param {string}   [props.inheritedLabel] What an unset family falls back to, for the muted trigger.
 * @param {string}   [props.manageUrl]      Deep link to the screen that manages favorites.
 * @param {Function} props.onPick           Writes a chosen family. May return a promise, in which
 *                                          case the field reads as loading until it settles.
 * @param {Function} props.onClear          Clears the family back to the theme's.
 * @param {boolean}  [props.disabled]       Disable the trigger. It is the only control outside the
 *                                          popover, so with it inert nothing below is reachable —
 *                                          guarding only the write callbacks would leave the field
 *                                          looking editable while silently dropping writes.
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

	// A family already in the favorites opens on the short list; anything else opens on the catalog,
	// which is where it was picked from and the only tab that can show it in context. An unset field
	// opens on Favorites, the same nudge `TokenSelector` makes toward the curated list over
	// hand-picking — unless there are none, in which case the popover renders the catalog alone and
	// naming a tab that is not there would leave it opening on nothing.
	const initialTab = favorites.length > 0 && (unset || isFavorite) ? 'favorites' : 'custom';

	const fallback = inheritedLabel || __('Theme default', 'kadence-blocks');
	const triggerName = unset
		? sprintf(
				/* translators: %s: the inherited font family, e.g. "Inter". */ __('Default (%s)', 'kadence-blocks'),
				fallback
			)
		: family;

	return (
		<div className="kadence-token-field kadence-token-field--font-family">
			<Dropdown
				className="kadence-token-field__dropdown"
				contentClassName="kadence-token-field__popover"
				popoverProps={{ placement: 'left-start' }}
				renderToggle={({ isOpen, onToggle }) => (
					<Button
						className="kadence-token-field__trigger"
						onClick={onToggle}
						disabled={disabled || pending !== ''}
						aria-expanded={isOpen}
						label={pending || triggerName}
						showTooltip
					>
						{pending ? (
							<span className="kadence-token-field__value kadence-token-field__value--pending">
								<Spinner />
								{pending}
							</span>
						) : unset ? (
							<span className="kadence-token-field__value kadence-token-field__label--default">
								{fallback}
							</span>
						) : (
							<span className="kadence-token-field__value" style={{ fontFamily: family }}>
								{family}
							</span>
						)}
					</Button>
				)}
				renderContent={({ onClose }) => (
					<FontFamilyPopover
						value={family}
						favorites={favorites}
						catalogOptions={catalogOptions}
						initialTab={initialTab}
						manageUrl={manageUrl}
						onPick={handlePick}
						onClear={onClear}
						onClose={onClose}
					/>
				)}
			/>
		</div>
	);
}
