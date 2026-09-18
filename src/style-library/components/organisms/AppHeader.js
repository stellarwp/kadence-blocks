/**
 * The Style Library header bar: title on the left, then a library-selector slot and an actions
 * slot on the right. Presentational only: the slots are filled by the library selector and the
 * header actions (e.g. delete) elsewhere in the app.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import './AppHeader.scss';

/**
 * Render the app header bar.
 *
 * @param {Object}       props              The component props.
 * @param {?JSX.Element} props.librarySlot  The library selector, or null when empty.
 * @param {?JSX.Element} props.actionsSlot  The header actions (e.g. delete), or null when empty.
 *
 * @since TBD
 *
 * @return {JSX.Element} The header bar.
 */
export function AppHeader({ librarySlot, actionsSlot }) {
	return (
		<div className="kadence-blocks-style-library__header-bar">
			<h1 className="kadence-blocks-style-library__title">{__('Style Library', 'kadence-blocks')}</h1>
			<div className="kadence-blocks-style-library__header-library">{librarySlot}</div>
			<div className="kadence-blocks-style-library__header-actions">{actionsSlot}</div>
		</div>
	);
}
