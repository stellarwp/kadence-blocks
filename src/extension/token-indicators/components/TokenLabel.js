/**
 * A control label that carries the design-system indicator. Renders the plain label text with a
 * `<TokenIndicator>` appended, so a Kadence control's `label` prop (which accepts a React node) shows the
 * override state for the attribute the control writes. Only the edit dot renders here — the reset lives in
 * the control's own header — so nothing is added directly inside the control. When the attribute is not
 * mapped for the selected preset, only the text renders — identical to today's control.
 */

import { TokenIndicator } from './TokenIndicator';

/**
 * A control label wrapped with the design-token indicator (edit dot only; no inline reset).
 *
 * @param {Object} props         The component props.
 * @param {string} props.text    The label text.
 * @param {string} props.attr    The attribute the control writes (the indicator's key).
 * @param {Object} props.binding The block's binding map from useVariantBinding.
 *
 * @since TBD
 *
 * @return {Object} The label node.
 */
export function TokenLabel({ text, attr, binding }) {
	const state = binding ? binding[attr] : undefined;

	return (
		<span className="kb-token-label">
			<span className="kb-token-label__text">{text}</span>
			<TokenIndicator state={state} showReset={false} />
		</span>
	);
}
