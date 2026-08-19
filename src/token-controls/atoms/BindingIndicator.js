/**
 * The per-control design-system mark, in three states: a passive glyph when the value still matches
 * its baseline, a dot plus a reset when it departs from it, and nothing at all when the control is
 * not bound to a token.
 *
 * **Entirely opt-in.** With no `status` this renders nothing, which is the Style Library's case —
 * there is no preset to override there, so neither the glyph nor the reset has anything to say. The
 * block editor passes a status and gets the full mark.
 *
 * "Baseline" is whatever the host compares against; this never computes it. `status` carries the
 * answer, so the same mark serves "overrides the selected preset" and any other comparison a host
 * wants to make.
 *
 * The three states mirror the block editor's own `TokenIndicator` so the two can converge: the dot
 * always shows once modified, while `showReset` gates the glyph and the reset button together — for
 * a control whose own header already carries a reset.
 */

/**
 * WordPress dependencies
 */
import { Button, Tooltip } from '@wordpress/components';
import { undo } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

/**
 * Render the binding indicator.
 *
 * @param {Object}    props              The component props.
 * @param {?Object}   [props.status]     `{ bound, modified }`, or null when the control is unbound
 *                                       or the host has no baseline to compare against.
 * @param {?Function} [props.onReset]    Called to clear the value back to its baseline.
 * @param {boolean}   [props.disabled]   Disable the reset button alongside the control's other
 *                                          affordances, so a disabled control cannot still be reset.
 * @param {boolean}   [props.showReset]  Render the matching glyph and the reset button. False
 *                                       leaves only the dot, for a control that resets elsewhere.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The indicator, or null when there is nothing to show.
 */
export function BindingIndicator({ status = null, onReset = null, showReset = true, disabled = false }) {
	if (!status?.bound) {
		return null;
	}

	if (!status.modified) {
		if (!showReset) {
			return null;
		}

		return (
			<Tooltip text={__('Matches the design system value', 'kadence-blocks')}>
				<span
					className="kb-token-control__indicator-linked"
					role="img"
					aria-label={__('Matches the design system value', 'kadence-blocks')}
				/>
			</Tooltip>
		);
	}

	return (
		<span className="kb-token-control__indicator">
			<Tooltip text={__('Overrides the design system value', 'kadence-blocks')}>
				<span
					className="kb-token-control__indicator-dot"
					role="img"
					aria-label={__('Overrides the design system value', 'kadence-blocks')}
				/>
			</Tooltip>
			{showReset && (
				<Button
					className="kb-token-control__indicator-reset"
					icon={undo}
					size="small"
					onClick={onReset}
					disabled={disabled || !onReset}
					label={__('Reset to the design system value', 'kadence-blocks')}
					showTooltip
				/>
			)}
		</span>
	);
}
