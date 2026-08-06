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
import { ActivateLibraryButton } from '../components/organisms/ActivateLibraryButton';
import { RenameLibraryModal } from '../components/organisms/RenameLibraryModal';
import { DeleteLibraryModal } from '../components/organisms/DeleteLibraryModal';
import { PlaceholderScreen } from '../components/pages/PlaceholderScreen';
import { ColorPaletteScreen } from '../components/pages/ColorPaletteScreen';
import { BorderRadiusScreen } from '../components/pages/BorderRadiusScreen';
import { BorderWidthScreen } from '../components/pages/BorderWidthScreen';
import { useDesignTokensFeed } from '../hooks/use-design-tokens-feed';
import { useStyleLibraryRoute } from '../hooks/use-style-library-route';
import { useLibraries } from '../hooks/use-libraries';
import { DEFAULT_SCREEN_ID } from '../constants/screens';
import { buildBaseStylesNav, buildBlockPresetsNav, resolveScreen } from '../helpers/screens';
import { libraryDisplayTitle } from '../helpers/libraries';

/**
 * The Base Styles ids with a real screen component, extended by each subsequent per-screen
 * ticket. Every id not listed here falls back to `PlaceholderScreen` in the registry below.
 *
 * @since TBD
 */
const SCREEN_COMPONENTS = {
	'border-radius': BorderRadiusScreen,
	'color-palette': ColorPaletteScreen,
	'border-width': BorderWidthScreen,
};

/**
 * Render the Style Library application: feed gate, route hook, sidebar navigation, and the screen
 * resolved for the active route. A screen that owns a settings panel exposes it as a static
 * `SettingsPanel` property on its page component (`MyScreen.SettingsPanel = MyScreenSettings`);
 * this is the one place that property is read and mounted into `AppShell`'s `settingsPanel` slot.
 * The app itself carries no per-screen knowledge — not the demo, not any real screen's panel
 * contents — so a screen and its panel are siblings that share state only through the server and
 * the route, never through this component.
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

	// Every Base Styles id without an entry in SCREEN_COMPONENTS resolves to the placeholder until
	// its per-screen work lands, and the preset fallback is the placeholder until the first real
	// preset screen ships.
	// @todo SOFT-4083 / SOFT-4084: first real preset screens replace this fallback.
	const registry = useMemo(() => {
		const baseStyles = {};

		baseStylesNav.forEach((entry) => {
			baseStyles[entry.id] = SCREEN_COMPONENTS[entry.id] ?? PlaceholderScreen;
		});

		return { baseStyles, presetFallback: PlaceholderScreen };
	}, [baseStylesNav]);

	const activeScreenId = route.screen || DEFAULT_SCREEN_ID;
	const resolution = resolveScreen(activeScreenId, registry);

	useEffect(() => {
		if (!resolution) {
			// replace, not navigate — an unknown screen id must not enter browser history. Clears
			// `scope` alongside `item`: it is the PREVIOUS screen's own sub-selection (e.g. a
			// palette id), and it would otherwise leak onto whatever screen `DEFAULT_SCREEN_ID`
			// resolves to, which has no reason to expect it.
			replace({ screen: DEFAULT_SCREEN_ID, scope: '', item: '' });
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
	// `scope` is the PREVIOUS screen's own sub-selection (Color Palette's is a palette id) — it
	// must be cleared on every screen switch alongside `item`, or it leaks onto a screen with no
	// idea what to do with it (e.g. a palette id showing up in Typography's URL).
	const onNavigate = (id) => navigate({ screen: id, scope: '', item: '' });

	// Two different libraries are named in the header: the one being edited (the selector's value,
	// and the target of rename/delete/activate) and the one the site renders with (named in the
	// activation modal's copy).
	//
	// The fetched list is preferred over the feed for both, because a rename refreshes the list but
	// deliberately not the feed — reading the feed first would leave the header showing the old
	// name until something else reloaded it. The feed is the fallback, and it is what makes the
	// first paint correct: it is printed inline with the page, so the header names the library
	// immediately instead of showing a slug-derived guess and correcting itself a moment later when
	// the list request lands.
	const editingTitle = libraryDisplayTitle(
		libraries.libraries.find((library) => library.slug === libraries.editingSlug) ?? {
			slug: libraries.editingSlug,
			title: feed.title,
		}
	);

	// No feed fallback here: the feed only ever describes the library being edited, so borrowing its
	// title for a different library would be wrong rather than merely early. Before the list loads
	// these are the same library anyway, and `libraryDisplayTitle` names it from the slug.
	const activeTitle = libraryDisplayTitle(
		libraries.libraries.find((library) => library.slug === libraries.activeSlug) ?? {
			slug: libraries.activeSlug,
			title: libraries.isEditingActive ? feed.title : '',
		}
	);

	return (
		<AppShell
			isBlocked={libraries.isSwappingLibrary}
			header={
				<AppHeader
					librarySlot={
						<LibrarySelector
							libraries={libraries.libraries}
							activeSlug={libraries.activeSlug}
							editingSlug={libraries.editingSlug}
							editingTitle={editingTitle}
							isBusy={libraries.isBusy}
							isSwapping={libraries.isSwappingLibrary}
							openError={libraries.openError}
							createError={libraries.createError}
							onOpen={libraries.openLibrary}
							onCreate={libraries.createLibrary}
							onClearOpenError={libraries.clearOpenError}
							onClearCreateError={libraries.clearCreateError}
						/>
					}
					actionsSlot={
						<>
							<ActivateLibraryButton
								editingSlug={libraries.editingSlug}
								editingTitle={editingTitle}
								activeTitle={activeTitle}
								isEditingActive={libraries.isEditingActive}
								isBusy={libraries.isBusy}
								error={libraries.activateError}
								onClearError={libraries.clearActivateError}
								onActivate={libraries.activateLibrary}
							/>
							<RenameLibraryModal
								slug={libraries.editingSlug}
								currentTitle={editingTitle}
								libraries={libraries.libraries}
								isBusy={libraries.isBusy}
								error={libraries.renameError}
								onClearError={libraries.clearRenameError}
								onRename={libraries.renameLibrary}
							/>
							<DeleteLibraryModal
								editingSlug={libraries.editingSlug}
								editingTitle={editingTitle}
								activeSlug={libraries.activeSlug}
								libraries={libraries.libraries}
								isBusy={libraries.isBusy}
								error={libraries.deleteError}
								onClearError={libraries.clearDeleteError}
								onDelete={libraries.deleteLibrary}
							/>
						</>
					}
				/>
			}
			sidebar={
				<AppSidebar
					baseStylesNav={baseStylesNav}
					blockPresetsNav={blockPresetsNav}
					activeId={activeScreenId}
					onNavigate={onNavigate}
				/>
			}
			content={<resolution.Component label={label} route={route} navigate={navigate} library={feed} />}
			settingsPanel={
				resolution.Component.SettingsPanel && route.item ? (
					<resolution.Component.SettingsPanel route={route} navigate={navigate} library={feed} />
				) : null
			}
		/>
	);
}
