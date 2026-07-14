/**
 * A row wrapper that places the design-system indicator BESIDE a control whose `label` prop is not
 * rendered as visible content (e.g. `PopColorControl`, which forwards `label` to a Button tooltip). The
 * wrapped control is passed through as children with all its own props intact; only an adjacent indicator
 * (and an optional heading) is added. Renders just the children when the attribute is not mapped for the
 * selected variant, so an unmapped control looks identical to today.
 */

import { TokenIndicator } from './TokenIndicator';

/**
 * A control wrapped with an adjacent design-token indicator.
 *
 * @param {Object}   props           The component props.
 * @param {string}   [props.heading] Optional heading text shown next to the indicator, above the control.
 * @param {string}   props.attr      The attribute the wrapped control writes (the indicator's key).
 * @param {Object}   props.binding   The block's binding map from useVariantBinding.
 * @param {Function} props.onReset   Called with `attr` to reset that control's override.
 * @param {Object}   props.children  The wrapped control element, rendered untouched.
 *
 * @since TBD
 *
 * @return {Object} The wrapped control with its adjacent indicator.
 */
export function TokenControlRow({ heading, attr, binding, onReset, children }) {
	const state = binding ? binding[attr] : undefined;

	return (
		<div className="kb-token-control-row">
			<div className="kb-token-control-row__header">
				{heading ? <span className="kb-token-control-row__heading">{heading}</span> : null}
				<TokenIndicator state={state} onReset={() => onReset(attr)} />
			</div>
			{children}
		</div>
	);
}
