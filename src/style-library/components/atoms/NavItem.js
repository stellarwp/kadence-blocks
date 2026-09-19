/**
 * A single Style Library sidebar navigation entry. A `<button>`, not an `<a>` — navigation is
 * driven by the History API, not real links.
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { Icon } from '@wordpress/components';

/**
 * Internal dependencies
 */
import './NavItem.scss';

/**
 * Render a sidebar navigation item.
 *
 * @param {Object}   props         The component props.
 * @param {string}   props.label   The item label.
 * @param {?JSX.Element} props.icon The icon shown before the label, if the item has one.
 * @param {boolean}  props.active  Whether this item is the active screen.
 * @param {Function} props.onClick Called when the item is clicked.
 *
 * @since TBD
 *
 * @return {JSX.Element} The nav item.
 */
export function NavItem({ label, icon, active, onClick }) {
	return (
		<li className="kadence-blocks-style-library__nav-item">
			<button
				type="button"
				className={classnames('kadence-blocks-style-library__nav-item-button', {
					'kadence-blocks-style-library__nav-item-button--active': active,
				})}
				aria-current={active ? 'page' : undefined}
				onClick={onClick}
			>
				{icon && <Icon className="kadence-blocks-style-library__nav-item-icon" icon={icon} size={16} />}
				{label}
			</button>
		</li>
	);
}
