/**
 * The block editor's adapter for `src/token-controls`' `ColorControlGroup`.
 *
 * A separate component from `EditorColorControl` rather than a prop on it, mirroring
 * `ColorControlGroup` itself living beside `ColorControl` as its own file in `token-controls`: a
 * group wraps several `ColorControl`s at once, so wrapping happens around the group, not around each
 * child — `ColorControlGroup` already collapses the shared border between its children into one box,
 * and a `TokenControlRow` per child would reopen the border AND pad each row apart, undoing that.
 * Reusable across every block that stacks a Color/Hover Color pair (or similar) this way, rather than
 * asking each call site to remember to wrap the group element itself instead of its children.
 *
 * As with `EditorColorControl`, no `heading` is passed — `TokenControlRow` contributes only the
 * `.kb-token-control-row` spacing to whatever follows the group, with no second header or indicator
 * layered over the group's own children.
 */

/**
 * Internal dependencies
 */
import { ColorControlGroup } from '../../../token-controls';
import { TokenControlRow } from '../../token-indicators/components/TokenControlRow';

/**
 * Render a no-gap group of color token controls wrapped in the editor's row spacing.
 *
 * @param {Object} props          The component props.
 * @param {*}      props.children The `ColorControl`s to stack, forwarded untouched.
 *
 * @since TBD
 *
 * @return {JSX.Element} The wrapped group.
 */
export function EditorColorControlGroup({ children }) {
	return (
		<TokenControlRow stacked>
			<ColorControlGroup>{children}</ColorControlGroup>
		</TokenControlRow>
	);
}
