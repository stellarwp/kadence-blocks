/**
 * The per-control design-system indicator. When the control overrides its selected preset it shows a red
 * edit dot plus a reset affordance; when it still matches the preset it shows the design-token glyph in the
 * accent color in that same reset slot; nothing otherwise. Purely additive — it renders inside a control's
 * label node and never touches the control's value.
 */

import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { resetIcon, variantIcon } from '../../variant-picker/icons';

/**
 * The design-system indicator for one mapped control. Three states: overridden shows a red edit dot
 * (matching the variant button's dot) and, when `showReset` is set, a reset icon that clears the override;
 * matching the preset shows the design-token glyph in the accent color, occupying the same reset slot as a
 * non-interactive "linked to the design system" mark; unmapped renders nothing. The matching mark only
 * renders where a reset would (`showReset`), so the dot-only label path is left unchanged. A control whose
 * own header already carries the reset passes `showReset={false}` so the dot alone marks the edit.
 *
 * @param {Object}   props             The component props.
 * @param {Object}   [props.state]     The attribute's binding state from useVariantBinding, or undefined when
 *                                     the control is not mapped for the selected preset.
 * @param {Function} props.onReset     Called to clear the control's override back to the preset value.
 * @param {boolean}  [props.showReset] Whether to render the reset icon / matching mark (default true).
 *
 * @since TBD
 *
 * @return {Object|null} The indicator element, or null when the control is unmapped.
 */
export function TokenIndicator({ state, onReset, showReset = true }) {
	if (!state || !state.bound) {
		return null;
	}

	// Matches the selected preset: a non-interactive design-system mark in the reset slot, shown only where
	// a reset would otherwise appear (so the dot-only label path stays as it was).
	if (!state.overridden) {
		if (!showReset) {
			return null;
		}

		return (
			<span className="kb-token-indicator">
				<span
					className="kb-token-indicator__linked"
					role="img"
					aria-label={__('Matches the preset value', 'kadence-blocks')}
				>
					{variantIcon}
				</span>
			</span>
		);
	}

	return (
		<span className="kb-token-indicator">
			<span className="kb-token-indicator__dot" aria-hidden="true" />
			{showReset && (
				<Button
					className="kb-token-indicator__reset"
					icon={resetIcon}
					onClick={onReset}
					label={__('Reset to preset value', 'kadence-blocks')}
					showTooltip
				/>
			)}
		</span>
	);
}
