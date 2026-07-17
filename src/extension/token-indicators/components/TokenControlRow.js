/**
 * A row wrapper that places the design-system indicator BESIDE a control whose `label` prop is not
 * rendered as visible content (e.g. `PopColorControl`, which forwards `label` to a Button tooltip). The
 * wrapped control is passed through as children with all its own props intact; a header row (the heading
 * plus the indicator) is added above them. The indicator renders only when the attribute is mapped for the
 * selected preset, so an unmapped control shows just its heading with no indicator. With no `heading` the
 * header row is skipped entirely — the wrapper then only contributes the highlight tint, for a control
 * that already carries its indicator inline (via `TokenLabel`). When "highlight edits" is on and this
 * control overrides its preset, the whole row is tinted a warning color so the edit stands out.
 */

import { useSelect } from '@wordpress/data';
import { TOKEN_INDICATORS_STORE } from '../store';
import { TokenIndicator } from './TokenIndicator';

/**
 * A control wrapped with an adjacent design-token indicator.
 *
 * @param {Object}   props           The component props.
 * @param {string}   [props.heading] Heading text shown next to the indicator, above the control; with no
 *                                   heading the header row (and its indicator) is skipped and the wrapper
 *                                   only contributes the highlight tint.
 * @param {string}   props.attr      The attribute the wrapped control writes (the indicator's key).
 * @param {Object}   props.binding   The block's binding map from useVariantBinding.
 * @param {Function} [props.onReset] Called with `attr` to reset that control's override (headed rows only).
 * @param {boolean}  [props.stacked] Stack the header above a full-width control (for block-level controls
 *                                   like the responsive measurement inputs) instead of the side-by-side row.
 * @param {Object}   props.children  The wrapped control element, rendered untouched.
 *
 * @since TBD
 *
 * @return {Object} The wrapped control with its adjacent indicator.
 */
export function TokenControlRow({ heading, attr, binding, onReset, stacked = false, children }) {
	const state = binding ? binding[attr] : undefined;
	const highlighting = useSelect((select) => select(TOKEN_INDICATORS_STORE).isHighlightingEdits(), []);
	const highlight = highlighting && !!state?.overridden;
	const className =
		'kb-token-control-row' +
		(stacked ? ' kb-token-control-row--stacked' : '') +
		(highlight ? ' kb-token-control-row--highlight' : '');

	return (
		<div className={className}>
			{heading ? (
				<div className="kb-token-control-row__header">
					<span className="kb-token-control-row__heading">{heading}</span>
					<TokenIndicator state={state} onReset={() => onReset(attr)} />
				</div>
			) : null}
			{children}
		</div>
	);
}
