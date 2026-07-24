/**
 * Design-token UI injected into the token-agnostic `@kadence/components` control seams.
 *
 * `@kadence/components` controls expose neutral `kadence.components.control.*` `@wordpress/hooks`
 * seams and know nothing about design tokens. This module holds the token vocabulary — the
 * `{dot.alias}` pattern plus the picker and chip UI — that Kadence Blocks injects through those seams
 * (see `register-component-filters.js`). Pure and data-free: labels/preview values come from the
 * pickable-token list the caller passes in.
 */

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';
import { Button, DropdownMenu, MenuGroup, MenuItem } from '@wordpress/components';
import { link, linkOff } from '@wordpress/icons';

const TOKEN_ALIAS_PATTERN = /^\{[\w.-]+\}$/;

/**
 * Whether a control value is a whole-string design-token alias (e.g. `{semantic.radius.button}`).
 *
 * @param {*} value The control value to test.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is a whole-string token alias.
 */
export function isTokenAlias(value) {
	return typeof value === 'string' && TOKEN_ALIAS_PATTERN.test(value);
}

/**
 * The pickable-token entry whose `alias` matches a value.
 *
 * @param {Array}  tokens The pickable-token list (may be undefined).
 * @param {string} value  The alias string to match against each entry's `alias`.
 *
 * @since TBD
 *
 * @return {?Object} The matching entry, or null when the list is empty/absent or nothing matches.
 */
export function findTokenEntry(tokens, value) {
	return (tokens || []).find((entry) => entry.alias === value) || null;
}

/**
 * The in-control token display: the token's label (dot-path fallback when no matching entry is found)
 * plus an optional unlink button. Rendered in place of a numeric editor when the value is an alias.
 *
 * @param {Object}   props
 * @param {string}   props.value     The alias string currently held by the slot.
 * @param {Array}    [props.tokens]  The pickable-token list, used to resolve the label/preview.
 * @param {Function} [props.onUnlink] Called with no arguments when the unlink button is pressed; the
 *                                    button is hidden when this is not provided.
 *
 * @since TBD
 *
 * @return {Object} The rendered token chip.
 */
export function TokenChip({ value, tokens, onUnlink }) {
	const entry = findTokenEntry(tokens, value);
	const label = entry ? entry.label : String(value).slice(1, -1);

	return (
		<span className="kadence-token-chip">
			<span className="kadence-token-chip__label" title={entry ? entry.value : undefined}>
				{label}
			</span>
			{onUnlink && (
				<Button
					className="kadence-token-chip__unlink"
					icon={linkOff}
					isSmall
					label={__('Unlink token', 'kadence-blocks')}
					onClick={() => onUnlink()}
				/>
			)}
		</span>
	);
}

/**
 * The in-control picker affordance: a header button opening the token list; choosing an entry fires
 * `onSelect(entry.alias)`. Renders nothing when the list is empty/absent or no select handler is
 * provided, so mounting it unconditionally is always safe.
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
