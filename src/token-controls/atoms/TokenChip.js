/**
 * The in-control token display: a bound token's label plus an optional unlink button.
 *
 * Used where a control has no per-slot field to turn into a `TokenSelector` trigger — the
 * whole-value box-shadow control is the case that needs it.
 */

/**
 * WordPress dependencies
 */
import { Button } from '@wordpress/components';
import { linkOff } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { findTokenEntry } from '../helpers/token-summary';
import { StaleTokenHint, staleTokenLabel, staleTokenMessage } from './StaleTokenHint';

/**
 * The in-control token display: the token's label plus an optional unlink button. Used by the
 * whole-value box-shadow control, which has no per-slot field to turn into a `TokenFieldControl`
 * trigger.
 *
 * An alias with no matching entry (its token was deleted after binding) reads as a muted "Reverted to
 * default" with a hint glyph explaining which token went missing. The alias itself is kept, and the
 * unlink button stays as the way to drop it.
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
	const label = entry ? entry.label : staleTokenLabel();
	const labelClass = entry
		? 'kadence-token-chip__label'
		: 'kadence-token-chip__label kadence-token-chip__label--default';

	return (
		<span className="kadence-token-chip">
			{!entry && <StaleTokenHint value={value} />}
			<span className={labelClass} title={entry ? entry.value : staleTokenMessage(value)}>
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
