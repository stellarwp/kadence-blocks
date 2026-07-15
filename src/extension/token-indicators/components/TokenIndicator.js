/**
 * The per-control design-system indicator: a design-system icon when the control is bound to the active
 * variant, an override dot plus a reset affordance when the control has diverged from it, and nothing when
 * the control is not mapped for the selected variant. Purely additive — it renders inside a control's
 * label node and never touches the control's value.
 */

import { Button, Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { TOKEN_INDICATORS_STORE } from '../store';

/**
 * The design-system indicator for one mapped control.
 *
 * @param {Object}   props         The component props.
 * @param {Object}   [props.state] The attribute's binding state from useVariantBinding, or undefined when
 *                                 the control is not mapped for the selected variant.
 * @param {Function} props.onReset Called to clear the control's override back to the variant value.
 *
 * @since TBD
 *
 * @return {Object|null} The indicator element, or null when the control is not bound.
 */
export function TokenIndicator({ state, onReset }) {
	const highlighting = useSelect((select) => select(TOKEN_INDICATORS_STORE).isHighlightingEdits(), []);

	if (!state || !state.bound) {
		return null;
	}

	if (!state.overridden) {
		return (
			<Tooltip text={__('Bound to the selected design preset', 'kadence-blocks')}>
				<span
					className="kb-token-indicator kb-token-indicator--bound"
					role="img"
					aria-label={__('Bound to the selected design preset', 'kadence-blocks')}
				/>
			</Tooltip>
		);
	}

	const className =
		'kb-token-indicator kb-token-indicator--overridden' + (highlighting ? ' kb-token-indicator--highlight' : '');

	return (
		<span className={className}>
			<Tooltip text={__('Overrides the selected design preset', 'kadence-blocks')}>
				<span className="kb-token-indicator__dot" aria-hidden="true" />
			</Tooltip>
			<Button
				className="kb-token-indicator__reset"
				variant="tertiary"
				isSmall
				onClick={onReset}
				label={__('Reset to preset value', 'kadence-blocks')}
				showTooltip
			>
				{__('Reset', 'kadence-blocks')}
			</Button>
		</span>
	);
}
