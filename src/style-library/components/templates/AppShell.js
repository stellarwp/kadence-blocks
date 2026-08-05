/**
 * The Style Library frame: header bar on top, then sidebar | content | optional settings panel.
 * Pure layout — every region is a slot the caller fills.
 */

/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './AppShell.scss';

/**
 * Render the app shell layout.
 *
 * @param {Object}       props                The component props.
 * @param {JSX.Element}  props.header         The header-bar content.
 * @param {?JSX.Element} props.sidebar        The left navigation content, or null when empty.
 * @param {?JSX.Element} props.content        The active screen, or null when empty.
 * @param {?JSX.Element} props.settingsPanel  The settings panel, or null when closed.
 * @param {boolean}      [props.isBlocked]    Whether to cover the frame with a busy scrim, for a
 *                                            change that replaces the app's whole content rather
 *                                            than one region of it.
 *
 * @since TBD
 *
 * @return {JSX.Element} The shell.
 */
export function AppShell({ header, sidebar, content, settingsPanel, isBlocked }) {
	return (
		<div className="kadence-blocks-style-library__shell">
			<header className="kadence-blocks-style-library__header">{header}</header>
			<div className="kadence-blocks-style-library__body">
				<nav className="kadence-blocks-style-library__sidebar">{sidebar}</nav>
				<main
					className={classnames('kadence-blocks-style-library__content', {
						'kadence-blocks-style-library__content--has-settings': Boolean(settingsPanel),
					})}
				>
					{content}
				</main>
				{settingsPanel && <aside className="kadence-blocks-style-library__settings">{settingsPanel}</aside>}
			</div>
			{isBlocked && (
				/* Covers the header too, not just the content column: while the app is being
				 * repopulated, the header's own controls describe the library that is on its way out,
				 * so leaving them live would let a second change start against stale state. */
				<div
					className="kadence-blocks-style-library__blocker"
					role="status"
					aria-live="polite"
					aria-label={__('Loading library…', 'kadence-blocks')}
				>
					<Spinner />
				</div>
			)}
		</div>
	);
}
