/**
 * The in-control picker affordance for a control with no per-slot field: a header button opening
 * the token list.
 */

/**
 * WordPress dependencies
 */
import { DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { link } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * The in-control picker affordance for the whole-value box-shadow control: a header button opening the
 * token list; choosing an entry fires `onSelect(entry.alias)`. Renders nothing when the list is
 * empty/absent or no select handler is provided, so mounting it unconditionally is always safe.
 *
 * @param {Object}   props
 * @param {Array}    [props.tokens]   The pickable-token list.
 * @param {Function} [props.onSelect] Called with the chosen entry's `alias` when a token is picked.
 * @param {boolean}  [props.isActive] Whether the toggle should render pressed.
 *
 * @since TBD
 *
 * @return {?Object} The rendered picker button, or null when there is nothing to pick from.
 */
export function TokenPickerButton({ tokens, onSelect, isActive = false }) {
	if (!tokens || !tokens.length || !onSelect) {
		return null;
	}

	return (
		<DropdownMenu
			className="kadence-token-picker-toggle"
			icon={link}
			label={__('Use design token', 'kadence-blocks')}
			toggleProps={{ isSmall: true, isPressed: isActive }}
		>
			{({ onClose }) => (
				<MenuGroup>
					{tokens.map((entry) => (
						<MenuItem
							key={entry.id}
							onClick={() => {
								onClose();
								onSelect(entry.alias);
							}}
						>
							{entry.label}
							<span className="kadence-token-picker__preview">{entry.value}</span>
						</MenuItem>
					))}
				</MenuGroup>
			)}
		</DropdownMenu>
	);
}
