/**
 * The shared label row every field renders above its control: an uppercase label with an optional
 * trailing slot (e.g. `BoxSidesField`'s link/unlink toggle, or a responsive field's breakpoint
 * switcher). Content-agnostic — a caller decides what the trailing slot holds. The label text's own
 * typography is the `small-uppercase-label` mixin (styles/_mixins.scss), shared with `SectionHeading`.
 */

/**
 * Internal dependencies
 */
import './FieldLabel.scss';

/**
 * Render a field label row.
 *
 * @param {Object}                     props           The component props.
 * @param {import('react').ReactNode}  props.children  The label text.
 * @param {?JSX.Element}                [props.trailing] An optional trailing control (e.g. a link/unlink button).
 *
 * @since TBD
 *
 * @return {JSX.Element} The label row.
 */
export function FieldLabel({ children, trailing = null }) {
	return (
		<div className="kadence-blocks-style-library__field-label">
			<span className="kadence-blocks-style-library__field-label-text">{children}</span>
			{trailing && <span className="kadence-blocks-style-library__field-label-trailing">{trailing}</span>}
		</div>
	);
}
