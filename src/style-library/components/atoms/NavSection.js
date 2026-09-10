/**
 * A labeled group of Style Library sidebar navigation items: an uppercase muted label above the
 * item list.
 */

/**
 * Internal dependencies
 */
import { NavItem } from './NavItem';
import './NavSection.scss';

/**
 * Render a sidebar navigation section. Renders nothing when it has no items, so an empty
 * BLOCK PRESETS section (no labeled preset bindings registered) does not print a stray heading.
 *
 * @param {Object}                          props            The component props.
 * @param {string}                          props.label      The section label.
 * @param {Array<{id: string, label: string}>} props.items      The section's nav entries.
 * @param {string}                          props.activeId   The active screen id.
 * @param {Function}                        props.onNavigate Called with a screen id when an item is clicked.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The section, or null when it has no items.
 */
export function NavSection({ label, items, activeId, onNavigate }) {
	if (!items.length) {
		return null;
	}

	return (
		<div className="kadence-blocks-style-library__nav-section">
			<h2 className="kadence-blocks-style-library__nav-section-label">{label}</h2>
			<ul className="kadence-blocks-style-library__nav-list">
				{items.map((item) => (
					<NavItem
						key={item.id}
						label={item.label}
						active={item.id === activeId}
						onClick={() => onNavigate(item.id)}
					/>
				))}
			</ul>
		</div>
	);
}
