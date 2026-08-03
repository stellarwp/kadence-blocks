/**
 * The generic Style Library screen: a centered, muted "coming soon" panel rendered for every nav
 * entry until its per-screen work lands.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './PlaceholderScreen.scss';

/**
 * Render the placeholder screen.
 *
 * @param {Object} props       The component props.
 * @param {string} props.label The active screen's nav label.
 *
 * @since TBD
 *
 * @return {JSX.Element} The placeholder screen.
 *
 * @todo Replaced per screen by the Style Library per-screen work.
 */
export function PlaceholderScreen({ label }) {
	return (
		<div className="kadence-blocks-style-library__placeholder-screen">
			<h2 className="kadence-blocks-style-library__placeholder-screen-title">{label}</h2>
			<p className="kadence-blocks-style-library__placeholder-screen-copy">
				{__('This screen is coming soon.', 'kadence-blocks')}
			</p>
		</div>
	);
}
