/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Sidebar } from '../organisms/Sidebar';

/**
 * Two-column shell with sidebar navigation and a scrollable content area.
 *
 * @param {object}      props            Component props.
 * @param {string}      props.section    Active section id.
 * @param {object[]}    props.sections   Sidebar sections.
 * @param {Function}    props.onNavigate Section change handler.
 * @param {string}      [props.version]  Store version label.
 * @param {import('react').ReactNode} props.children Main content.
 * @return {JSX.Element} Style Book layout shell.
 */
export function StyleBookShell( { section, sections, onNavigate, version, children } ) {
	return (
		<div className="kadence-style-book">
			<header className="kadence-style-book__top-bar">
				<div>
					<h1 className="kadence-style-book__title">{ __( 'Style Book', 'kadence-blocks' ) }</h1>
					{ version ? (
						<p className="kadence-style-book__version">
							{ __( 'Store version:', 'kadence-blocks' ) } <code>{ version }</code>
						</p>
					) : null }
				</div>
			</header>

			<div className="kadence-style-book__layout">
				<Sidebar section={ section } sections={ sections } onNavigate={ onNavigate } />
				<main className="kadence-style-book__main">{ children }</main>
			</div>
		</div>
	);
}
