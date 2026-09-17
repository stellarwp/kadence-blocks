/**
 * The in-field explanation for a stale token alias.
 *
 * A slot bound to a Style Library step keeps that step's alias. Deleting the step later leaves the alias
 * with nothing to resolve to: the block renders its default, but the attribute still holds the alias,
 * so the control keeps reporting an edit. The value is deliberately NOT cleared — the token may come
 * back under the same id, and the divergence dot's reset is the user's own way to drop it — so the
 * field has to say why it reads as the default while still flagged as edited. This atom is that
 * explanation, shared by every surface that can show a stale alias. A theme font reference stored
 * while the Kadence theme was active goes stale the same way once another theme takes over, and
 * reuses the atom with its own message.
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
 * The explanation for a theme font reference on a theme that does not provide it.
 *
 * @since TBD
 *
 * @return {string} The translated message.
 */
export function staleFamilyMessage() {
	return __(
		'This option came from the Kadence theme, which is no longer active. The default applies until you pick a new value or reset.',
		'kadence-blocks'
	);
}

/**
 * The wrapped tooltip a stale field's trigger wears: the full explanation, allowed to wrap instead of
 * running the sidebar's width as one line. Renders the children untouched when not active, so a
 * trigger can be wrapped unconditionally.
 *
 * @param {Object}      props          The component props.
 * @param {boolean}     props.active   Whether the field holds a stale value.
 * @param {string}      [props.text]   The explanation to show. Defaults to the stale-alias one; a
 *                                     field whose value went stale for another reason (a theme font
 *                                     reference, say) passes its own.
 * @param {JSX.Element} props.children The trigger.
 *
 * @since TBD
 *
 * @return {JSX.Element} The trigger, wrapped in the tooltip when active.
 */
export function StaleTokenTooltip({ active, text = staleTokenMessage(), children }) {
	if (!active) {
		return children;
	}

	return (
		<Tooltip text={text} className="kadence-token-field__stale-tooltip">
			{children}
		</Tooltip>
	);
}

/**
 * The caution glyph shown beside a stale field's label. Decorative: the trigger it sits in already
 * carries the explanation as its tooltip and accessible name.
 *
 * @since TBD
 *
 * @return {JSX.Element} The glyph.
 */
export function StaleTokenHint() {
	return (
		<span className="kadence-token-field__stale" aria-hidden="true">
			<Icon icon={caution} size={16} />
		</span>
	);
}
