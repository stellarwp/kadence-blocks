/**
 * A control label that carries the design-system indicator. Renders the plain label text with a
 * `<TokenIndicator>` appended, so a Kadence control's `label` prop (which accepts a React node) shows the
 * bound / overridden state for the attribute the control writes. When the attribute is not mapped for the
 * selected variant, only the text renders — identical to today's control.
 */

import { TokenIndicator } from './TokenIndicator';

/**
 * A control label wrapped with the design-token indicator.
 *
 * @param {Object}   props         The component props.
 * @param {string}   props.text    The label text.
 * @param {string}   props.attr    The attribute the control writes (the indicator's key).
 * @param {Object}   props.binding The block's binding map from useVariantBinding.
 * @param {Function} props.onReset Called with `attr` to reset that control's override.
 *
 * @since TBD
 *
 * @return {Object} The label node.
 */
export function TokenLabel({ text, attr, binding, onReset }) {
	const state = binding ? binding[attr] : undefined;

	return (
		<span className="kb-token-label">
			<span className="kb-token-label__text">{text}</span>
			<TokenIndicator state={state} onReset={() => onReset(attr)} />
		</span>
	);
}
