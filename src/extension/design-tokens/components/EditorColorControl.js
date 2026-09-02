/**
 * The block editor's adapter for `src/token-controls`' `ColorControl`.
 *
 * Much thinner than `EditorBorderControl`/`EditorBoxControl`/`EditorShadowControl` — `ColorControl`
 * already takes exactly the value/token contract its callers hold (a bracket alias or literal, the
 * palette's `groups`, `resolveColorLiteral`), so there is no per-device storage shape or unit to
 * bridge. This adapter exists for one reason:
 *
 * - **wraps itself in `TokenControlRow`** (no `heading`, purely for its `.kb-token-control-row`
 *   spacing) — `ColorControl` renders no `ControlShell` (its label and `BindingIndicator` live
 *   inside its own trigger row instead of a header above it; see its own docblock), so unlike
 *   `EditorBoxControl`'s `BoxControl` it never gets `TokenControlRow`'s margin by any other path.
 *   Without this wrapper a standalone color row sits flush against whatever the block renders next,
 *   where every other `Editor*` control keeps a gap. With no `heading` passed, `TokenControlRow`
 *   renders no header of its own (see its docblock: `attr`/`binding` can be omitted for a control
 *   that already carries its own indicator, used purely for the row spacing) — `ColorControl`'s
 *   inline `BindingIndicator` stays the only mark on screen, not a second one layered over it.
 *
 * Every other prop passes through untouched.
 */

/**
 * Internal dependencies
 */
import { ColorControl } from '../../../token-controls';
import { TokenControlRow } from '../../token-indicators/components/TokenControlRow';

/**
 * Render a color token control wrapped in the editor's row spacing.
 *
 * @param {Object} props `ColorControl`'s own props, forwarded untouched.
 *
 * @since TBD
 *
 * @return {JSX.Element} The wrapped control.
 */
export function EditorColorControl(props) {
	return (
		<TokenControlRow stacked>
			<ColorControl {...props} />
		</TokenControlRow>
	);
}
