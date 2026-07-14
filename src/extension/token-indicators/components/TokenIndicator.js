/**
 * The per-control design-system indicator: a design-system icon when the control is bound to the active
 * variant, that same icon with a small override dot plus an undo-arrow reset button when the control has
 * diverged from it, and nothing when the control is not mapped for the selected variant. Purely additive —
 * it renders inside a control's label node (or a sibling row) and never touches the control's value.
 *
 * The bound icon reuses `@wordpress/icons`' `styles` glyph — the same mark the block editor uses for
 * Global Styles — as a stand-in design-system/token mark. Swap for the exact Figma glyph (node
 * 160-12291) once design provides that asset as an SVG.
 */

import { Button, Icon, Tooltip } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { styles as designSystemIcon, undo as undoIcon } from '@wordpress/icons';
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
			<Tooltip text={__('Bound to the selected design variant', 'kadence-blocks')}>
				<span
					className="kb-token-indicator kb-token-indicator--bound"
					role="img"
					aria-label={__('Bound to the selected design variant', 'kadence-blocks')}
				>
					<Icon icon={designSystemIcon} size={14} />
				</span>
			</Tooltip>
		);
	}

	const className =
		'kb-token-indicator kb-token-indicator--overridden' + (highlighting ? ' kb-token-indicator--highlight' : '');

	return (
		<span className={className}>
			<Tooltip text={__('Overrides the selected design variant', 'kadence-blocks')}>
				<span
					className="kb-token-indicator__icon-wrap"
					role="img"
					aria-label={__('Overridden — differs from the selected variant', 'kadence-blocks')}
				>
					<Icon icon={designSystemIcon} size={14} />
					<span className="kb-token-indicator__dot" />
				</span>
			</Tooltip>
			<Button
				className="kb-token-indicator__reset"
				icon={undoIcon}
				iconSize={14}
				variant="tertiary"
				isSmall
				onClick={onReset}
				label={__('Reset to variant value', 'kadence-blocks')}
				showTooltip
			/>
		</span>
	);
}
