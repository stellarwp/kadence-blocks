/**
 * The per-control design-system indicator: a red override dot plus a reset affordance when the control
 * has diverged from the selected preset, and nothing otherwise. Purely additive — it renders inside a
 * control's label node and never touches the control's value.
 */

import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { resetIcon } from '../../variant-picker/icons';

/**
 * The design-system indicator for one mapped control. Renders only when the control overrides its preset:
 * a red edit dot (matching the variant button's dot) and, when `showReset` is set, a reset icon that
 * clears the override. A control whose own header already carries the reset passes `showReset={false}` so
 * the dot alone marks the edit.
 *
 * @param {Object}   props             The component props.
 * @param {Object}   [props.state]     The attribute's binding state from useVariantBinding, or undefined when
 *                                     the control is not mapped for the selected preset.
 * @param {Function} props.onReset     Called to clear the control's override back to the preset value.
 * @param {boolean}  [props.showReset] Whether to render the reset icon (default true).
 *
 * @since TBD
 *
 * @return {Object|null} The indicator element, or null when the control is not overridden.
 */
export function TokenIndicator({ state, onReset, showReset = true }) {
	if (!state || !state.bound || !state.overridden) {
		return null;
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
