/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * The root Style Book admin screen.
 *
 * @return {JSX.Element} The Style Book scaffold.
 */
export function StyleBookApp() {
	return (
		<div className="kadence-blocks-style-book">
			<h1 className="kadence-blocks-style-book__title">{__('Style Book', 'kadence-blocks')}</h1>
			<p className="kadence-blocks-style-book__intro">
				{__('Preview and manage Kadence design tokens from one place.', 'kadence-blocks')}
			</p>
		</div>
	);
}
