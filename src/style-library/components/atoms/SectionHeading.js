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
 * Render a section heading, optionally with a trailing actions slot (e.g. an overflow menu).
 *
 * @param {Object}                     props          The component props.
 * @param {import('react').ReactNode}  props.children The heading text.
 * @param {import('react').ReactNode}  [props.actions] Optional trailing actions, rendered on the
 *                                                     heading row; the heading is unchanged when
 *                                                     unset.
 *
 * @since TBD
 *
 * @return {JSX.Element} The heading.
 */
export function SectionHeading({ children, actions = null }) {
	const heading = <h3 className="kadence-blocks-style-library__section-heading">{children}</h3>;

	if (!actions) {
		return heading;
	}

	return (
		<div className="kadence-blocks-style-library__section-heading-row">
			{heading}
			<div className="kadence-blocks-style-library__section-heading-actions">{actions}</div>
		</div>
	);
}
