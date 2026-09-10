/**
 * The per-control design-system indicator. When the control overrides its selected preset it shows a red
 * edit dot plus a reset affordance; when it still matches the preset it shows the design-token glyph in the
 * accent color in that same reset slot; nothing otherwise. Purely additive — it renders inside a control's
 * label node and never touches the control's value.
 */

import { Button, Tooltip } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { resetIcon, presetIcon } from '../../preset-picker/icons';

/**
 * The design-system indicator for one mapped control. Three states: overridden shows a red edit dot
 * (matching the preset button's dot) and, when `showReset` is set, a reset icon that clears the override;
 * matching the preset shows the design-token glyph in the accent color, occupying the same reset slot as a
 * non-interactive "linked to the design system" mark; unmapped renders nothing. The matching mark only
 * renders where a reset would (`showReset`), so the dot-only label path is left unchanged. A control whose
 * own header already carries the reset passes `showReset={false}` so the dot alone marks the edit.
 *
 * The two marks read `state` differently, and deliberately: the override dot needs only a divergence from
 * whatever value the preset resolves, while the matching glyph additionally needs the preset to OWN the
 * property (`bound`) — see the gate below.
 *
 * @param {Object}   props             The component props.
 * @param {Object}   [props.state]     The attribute's binding state from usePresetBinding, or undefined when
 *                                     the control is not mapped for the selected preset.
 * @param {Function} props.onReset     Called to clear the control's override back to the preset value.
 * @param {boolean}  [props.showReset] Whether to render the reset icon / matching mark (default true).
 *
 * @since TBD
 *
 * @return {Object|null} The indicator element, or null when the control is unmapped.
 */
export function TokenIndicator({ state, onReset, showReset = true }) {
	if (!state) {
		return null;
	}

	// `bound` is narrower than "the preset resolves a value here": it means the preset has its own STORED
	// override for the property, which a preset shipped in `baseline.json` never does. Every block's
	// `$default` preset is shipped that way, so gating the whole indicator on it hid the override mark on
	// a fresh site — on every block, the Button included — until someone re-saved the preset in the Style
	// Library. A divergence is worth marking wherever the preset resolves a value to diverge FROM, and the
	// reset is meaningful there too: clearing the attribute drops the control back onto the projected CSS
	// that carries exactly that value.
	//
	// The "matches" glyph keeps the stricter gate. It asserts the field is linked to this preset, which is
	// a claim only a preset that genuinely owns the property can make — an inherited baseline value shows
	// as a muted default instead, which is what that display was separated out to do.
	if (!state.overridden && !state.bound) {
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
				<Tooltip text={__('Matches the preset value', 'kadence-blocks')}>
					<span
						className="kb-token-indicator__linked"
						role="img"
						aria-label={__('Matches the preset value', 'kadence-blocks')}
					>
						{presetIcon}
					</span>
				</Tooltip>
			</span>
		);
	}

	return (
		<span className="kb-token-indicator">
			<Tooltip text={__('Overrides the preset value', 'kadence-blocks')}>
				<span
					className="kb-token-indicator__dot"
					role="img"
					aria-label={__('Overrides the preset value', 'kadence-blocks')}
				/>
			</Tooltip>
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
