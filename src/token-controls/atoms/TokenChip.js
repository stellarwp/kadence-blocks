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

/**
 * The in-control token display: the token's label (dot-path fallback when no matching entry is found)
 * plus an optional unlink button. Used by the whole-value box-shadow control, which has no per-slot
 * field to turn into a `TokenFieldControl` trigger.
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
