/**
 * A pill used to show a short piece of metadata beside a row's label (e.g. a size or a pixel
 * value). Content-agnostic — the caller decides what text it holds.
 *
 * Not yet imported anywhere; its named future consumer is the Typography screen — not dead code.
 */

/**
 * Internal dependencies
 */
import './MetaChip.scss';

/**
 * Render a meta chip.
 *
 * @param {Object}          props          The component props.
 * @param {import('react').ReactNode} props.children The chip's content.
 *
 * @since TBD
 *
 * @return {JSX.Element} The chip.
 */
export function MetaChip({ children }) {
	return <span className="kadence-blocks-style-library__meta-chip">{children}</span>;
}
