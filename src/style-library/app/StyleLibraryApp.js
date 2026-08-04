/**
 * The Style Library application root.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useMemo } from '@wordpress/element';
import { Spinner } from '@wordpress/components';

/**
 * Internal dependencies
 */
import { AppShell } from '../components/templates/AppShell';
import { AppHeader } from '../components/organisms/AppHeader';
import { AppSidebar } from '../components/organisms/AppSidebar';
import { LibrarySelector } from '../components/organisms/LibrarySelector';
import { DeleteLibraryModal } from '../components/organisms/DeleteLibraryModal';
import { PlaceholderScreen } from '../components/pages/PlaceholderScreen';
import { useDesignTokensFeed } from '../hooks/use-design-tokens-feed';
import { useStyleLibraryRoute } from '../hooks/use-style-library-route';
import { useLibraries } from '../hooks/use-libraries';
import { DEFAULT_SCREEN_ID } from '../constants/screens';
import { buildBaseStylesNav, buildBlockPresetsNav, resolveScreen } from '../helpers/screens';

/**
 * Render the Style Library application: feed gate, route hook, sidebar navigation, and the screen
 * resolved for the active route. The settings panel is still an empty slot — it is filled once
 * the settings panel and field library exist.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The app, or null while the route is being normalized to a known screen.
 */
export function StyleLibraryApp() {
	const feed = useDesignTokensFeed();
	const { route, navigate, replace } = useStyleLibraryRoute();
	const libraries = useLibraries(feed.feed, feed.refreshFeed);

	const baseStylesNav = useMemo(() => buildBaseStylesNav(), []);
	const blockPresetsNav = useMemo(() => buildBlockPresetsNav(feed.feed), [feed.feed]);

	// Every Base Styles id resolves to the placeholder until its per-screen work lands, and the
	// preset fallback is the placeholder until the first real preset screen ships.
	// @todo SOFT-4083 / SOFT-4084: first real preset screens replace this fallback.
	const registry = useMemo(() => {
		const baseStyles = {};

		baseStylesNav.forEach((entry) => {
			baseStyles[entry.id] = PlaceholderScreen;
		});

		return { baseStyles, presetFallback: PlaceholderScreen };
	}, [baseStylesNav]);

	const activeScreenId = route.screen || DEFAULT_SCREEN_ID;
	const resolution = resolveScreen(activeScreenId, registry);

	useEffect(() => {
		if (!resolution) {
			// replace, not navigate — an unknown screen id must not enter browser history.
			replace({ screen: DEFAULT_SCREEN_ID, item: '' });
		}
	}, [resolution, replace]);

	if (!feed.isReady) {
		return (
			<div className="kadence-blocks-style-library__loading">
				<Spinner />
			</div>
		);
	}

	if (!resolution) {
		return null;
	}

	const navEntry = [...baseStylesNav, ...blockPresetsNav].find((entry) => entry.id === activeScreenId);
	const label = navEntry ? navEntry.label : resolution.block || activeScreenId;
	const onNavigate = (id) => navigate({ screen: id, item: '' });
	const activeLibrary = libraries.libraries.find((library) => library.slug === libraries.activeSlug);

	return (
		<AppShell
			header={
				<AppHeader
					librarySlot={
						<LibrarySelector
							libraries={libraries.libraries}
							activeSlug={libraries.activeSlug}
							isBusy={libraries.isBusy}
							error={libraries.error}
							onSwitch={libraries.switchLibrary}
							onCreate={libraries.createLibrary}
							onClearError={libraries.clearError}
						/>
					}
					actionsSlot={
						<DeleteLibraryModal
							activeSlug={libraries.activeSlug}
							activeTitle={activeLibrary?.title}
							isBusy={libraries.isBusy}
							error={libraries.error}
							onDelete={libraries.deleteLibrary}
						/>
					}
				/>
			}
			sidebar={<AppSidebar feed={feed.feed} activeId={activeScreenId} onNavigate={onNavigate} />}
			content={<resolution.Component label={label} />}
			settingsPanel={null}
		/>
	);
}
