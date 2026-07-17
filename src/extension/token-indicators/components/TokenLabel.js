/**
 * A control label that carries the design-system indicator. Renders the plain label text with a
 * `<TokenIndicator>` appended, so a Kadence control's `label` prop (which accepts a React node) shows the
 * override state for the attribute the control writes. By default only the edit dot renders — the reset
 * lives in the control's own header. A control whose header has no other reset passes `showReset` (with
 * `onReset`) so the indicator's reset renders inline, right after the dot, inside the control's own
 * label slot — keeping it on the same row as the control's header furniture (e.g. the responsive device
 * tabs). When the attribute is not mapped for the selected preset, only the text renders — identical to
 * today's control.
 */

import { TokenIndicator } from './TokenIndicator';

/**
 * A control label wrapped with the design-token indicator.
 *
 * @param {Object}   props             The component props.
 * @param {string}   props.text        The label text.
 * @param {string}   props.attr        The attribute the control writes (the indicator's key).
 * @param {Object}   props.binding     The block's binding map from useVariantBinding.
 * @param {Function} [props.onReset]   Called with `attr` to reset that control's override (with `showReset`).
 * @param {boolean}  [props.showReset] Whether to render the reset icon / matching mark inline (default false).
 *
 * @since TBD
 *
 * @return {Object} The label node.
 */
export function TokenLabel({ text, attr, binding, onReset, showReset = false }) {
	const state = binding ? binding[attr] : undefined;

	return (
		<span className="kb-token-label">
			<span className="kb-token-label__text">{text}</span>
			<TokenIndicator state={state} onReset={onReset ? () => onReset(attr) : undefined} showReset={showReset} />
		</span>
	);
}
