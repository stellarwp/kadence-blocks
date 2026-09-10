/**
 * One screen's helper copy: a short sentence saying what the screen does, with the documentation
 * link inline at the end of it. Renders nothing when the screen has no entry in the copy catalog,
 * so a screen the copy does not cover looks exactly as it did before.
 *
 * Takes a screen id rather than the strings themselves — the copy has one home
 * (`constants/screen-docs.js`), and every caller passes the id it already has on its route.
 */

/**
 * WordPress dependencies
 */
import { ExternalLink } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { screenDoc } from '../../helpers/screen-docs';
import './ScreenDescription.scss';

/**
 * Render a screen's helper copy.
 *
 * @param {Object} props          The component props.
 * @param {string} props.screenId The screen id from the route.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The description paragraph, or null when the screen has no copy.
 */
export function ScreenDescription({ screenId }) {
	const doc = screenDoc(screenId);

	if (!doc) {
		return null;
	}

	return (
		<p className="kadence-blocks-style-library__screen-description">
			{doc.description}
			{doc.docUrl && (
				<>
					{' '}
					<ExternalLink href={doc.docUrl}>{__('Learn more', 'kadence-blocks')}</ExternalLink>
				</>
			)}
		</p>
	);
}
