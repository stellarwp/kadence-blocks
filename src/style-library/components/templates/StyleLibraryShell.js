/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Sidebar } from '../organisms/Sidebar';
import './style-library-shell.scss';

/**
 * Two-column shell with sidebar navigation and a scrollable content area.
 *
 * @param {object}      props            Component props.
 * @param {string}      props.section    Active section id.
 * @param {object[]}    props.sections   Sidebar sections.
 * @param {Function}    props.onNavigate Section change handler.
 * @param {string}      [props.version]  Store version label.
 * @param {import('react').ReactNode} props.children Main content.
 * @return {JSX.Element} Style Library layout shell.
 */
export function StyleLibraryShell({ section, sections, onNavigate, version, children }) {
	return (
		<div className="kadence-blocks-style-library">
			<header className="kadence-blocks-style-library__top-bar">
				<div>
					<h1 className="kadence-blocks-style-library__title">{__('Style Library', 'kadence-blocks')}</h1>
					{version ? (
						<p className="kadence-blocks-style-library__version">
							{__('Store version:', 'kadence-blocks')} <code>{version}</code>
						</p>
					) : null}
				</div>
			</header>

			<div className="kadence-blocks-style-library__layout">
				<Sidebar section={section} sections={sections} onNavigate={onNavigate} />
				<main className="kadence-blocks-style-library__main">{children}</main>
			</div>
		</div>
	);
}
