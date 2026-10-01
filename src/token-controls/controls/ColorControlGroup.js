/**
 * A no-gap stacking wrapper for two or more `ColorControl`s, so a group of related color rows (e.g.
 * Text / Background) reads as one bordered box instead of a stack of separately bordered ones.
 *
 * CSS-only, mirroring `.kb-border-control__box`'s pattern in `styles/token-controls.scss`: the
 * border/radius reset lives on this wrapper's stylesheet rule, keyed off `:first-child`/
 * `:last-child`/`:not(:first-child)`, rather than on `ColorControl` itself, so `ColorControl` stays
 * unaware of whether it is grouped.
 */

/**
 * Internal dependencies
 */
import '../styles/token-controls.scss';

/**
 * Render a no-gap group of `ColorControl`s.
 *
 * @param {Object} props          The component props.
 * @param {*}      props.children The `ColorControl`s to stack.
 *
 * @since TBD
 *
 * @return {JSX.Element} The rendered group.
 */
export function ColorControlGroup({ children }) {
	return <div className="kb-color-control-group">{children}</div>;
}
