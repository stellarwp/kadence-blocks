/**
 * The Style Library application root.
 */

/**
 * WordPress dependencies
 */
import { Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AppShell } from '../components/templates/AppShell';
import { AppHeader } from '../components/organisms/AppHeader';
import { useDesignTokensFeed } from '../hooks/use-design-tokens-feed';
import { useStyleLibraryRoute } from '../hooks/use-style-library-route';

/**
 * Render the Style Library application: the feed gate, the route hook, and the app shell with
 * its header bar. The sidebar, content, and settings panel are still empty slots — they are
 * filled once the navigation, screen registry, and settings panel exist.
 *
 * @since TBD
 *
 * @return {JSX.Element} The app.
 */
export function StyleLibraryApp() {
	const feed = useDesignTokensFeed();

	// Keeps the URL route state alive even though nothing consumes it here yet — the sidebar and
	// screen registry read it once they land.
	useStyleLibraryRoute();

	if (!feed.isReady) {
		return (
			<div className="kadence-blocks-style-library__loading">
				<Spinner />
			</div>
		);
	}

	return (
		<AppShell
			header={<AppHeader librarySlot={null} actionsSlot={null} />}
			sidebar={null}
			content={null}
			settingsPanel={null}
		/>
	);
}
