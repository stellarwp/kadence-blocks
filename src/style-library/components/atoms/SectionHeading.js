/**
 * An uppercase group heading, set apart by size and letter-spacing rather than a muted color.
 * Used by `SwatchGrid` to title a group of cards, and available to any screen that groups rows
 * the same way.
 */

/**
 * Internal dependencies
 */
import './SectionHeading.scss';

/**
 * Render a section heading.
 *
 * @param {Object}          props          The component props.
 * @param {import('react').ReactNode} props.children The heading text.
 *
 * @since TBD
 *
 * @return {JSX.Element} The heading.
 */
export function SectionHeading({ children }) {
	return <h3 className="kadence-blocks-style-library__section-heading">{children}</h3>;
}
