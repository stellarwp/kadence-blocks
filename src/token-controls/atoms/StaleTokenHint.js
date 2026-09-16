/**
 * The in-field explanation for a stale token alias.
 *
 * A slot bound to a Style Library step keeps that step's alias. Deleting the step later leaves the alias
 * with nothing to resolve to: the block renders its default, but the attribute still holds the alias,
 * so the control keeps reporting an edit. The value is deliberately NOT cleared — the token may come
 * back under the same id, and the divergence dot's reset is the user's own way to drop it — so the
 * field has to say why it reads as the default while still flagged as edited. This atom is that
 * explanation, shared by every surface that can show a stale alias.
 */

/**
 * WordPress dependencies
 */
import { Icon, Tooltip } from '@wordpress/components';
import { caution } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { findTokenEntry, isTokenAlias } from '../helpers/token-summary';

/**
 * Whether a slot value is an alias the pickable list no longer carries.
 *
 * @param {*}     value  The slot value.
 * @param {Array} tokens The pickable-token list.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is a stale alias.
 */
export function isStaleAlias(value, tokens) {
	return isTokenAlias(value) && !findTokenEntry(tokens, value);
}

/**
 * The label a stale field shows in place of a token name.
 *
 * @since TBD
 *
 * @return {string} The translated label.
 */
export function staleTokenLabel() {
	return __('Reverted to default', 'kadence-blocks');
}

/**
 * The explanation for a stale alias.
 *
 * @since TBD
 *
 * @return {string} The translated message.
 */
export function staleTokenMessage() {
	return __(
		'This token was deleted from the Style Library. The default applies until you pick a new value or reset.',
		'kadence-blocks'
	);
}

/**
 * A caution glyph carrying the stale-alias explanation as a tooltip.
 *
 * @since TBD
 *
 * @return {JSX.Element} The glyph.
 */
export function StaleTokenHint() {
	const message = staleTokenMessage();

	return (
		<Tooltip text={message}>
			<span className="kadence-token-field__stale" role="img" aria-label={message}>
				<Icon icon={caution} size={16} />
			</span>
		</Tooltip>
	);
}
