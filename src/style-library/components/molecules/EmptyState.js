/**
 * A centered empty-state panel: optional icon, title, description, and an optional action slot
 * (typically the same primary "+ Add X" button the screen header shows). Used by `RowList` and
 * `SwatchGrid` via their `empty` prop, and directly by a screen for any other empty condition.
 */

/**
 * Internal dependencies
 */
import './EmptyState.scss';

/**
 * Render the empty state.
 *
 * @param {Object}       props          The component props.
 * @param {?JSX.Element} [props.icon]   The icon slot, or null for none.
 * @param {string}       props.title    The empty-state title.
 * @param {string}       [props.description] The supporting description text.
 * @param {?JSX.Element} [props.action] The action slot (e.g. a primary "+ Add X" button), or null.
 *
 * @since TBD
 *
 * @return {JSX.Element} The empty state.
 */
export function EmptyState({ icon = null, title, description, action = null }) {
	return (
		<div className="kadence-blocks-style-library__empty-state">
			{icon && <span className="kadence-blocks-style-library__empty-state-icon">{icon}</span>}
			<p className="kadence-blocks-style-library__empty-state-title">{title}</p>
			{description && <p className="kadence-blocks-style-library__empty-state-description">{description}</p>}
			{action && <div className="kadence-blocks-style-library__empty-state-action">{action}</div>}
		</div>
	);
}
