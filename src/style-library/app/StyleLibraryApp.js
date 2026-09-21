/**
 * The Style Library application root.
 */

/**
 * WordPress dependencies
 */
import { useCallback, useEffect, useMemo } from '@wordpress/element';
import { SnackbarList } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { AppShell } from '../components/templates/AppShell';
import { AppShellSkeleton } from '../components/organisms/AppShellSkeleton';
import { AppHeader } from '../components/organisms/AppHeader';
import { AppSidebar } from '../components/organisms/AppSidebar';
import { LibraryActions } from '../components/organisms/LibraryActions';
import { LibrarySelector } from '../components/organisms/LibrarySelector';
import { SettingsPopover } from '../components/templates/SettingsPopover';
import { UnsavedChangesModal } from '../components/organisms/UnsavedChangesModal';
import { PlaceholderScreen } from '../components/pages/PlaceholderScreen';
import { TypographyScreen } from '../components/pages/TypographyScreen';
import { ColorPaletteScreen } from '../components/pages/ColorPaletteScreen';
import { BorderRadiusScreen } from '../components/pages/BorderRadiusScreen';
import { BorderWidthScreen } from '../components/pages/BorderWidthScreen';
import { SpacingScreen } from '../components/pages/SpacingScreen';
import { IconSizesScreen } from '../components/pages/IconSizesScreen';
import { ShadowScreen } from '../components/pages/ShadowScreen';
import '../components/pages/ButtonScreen';
import '../components/pages/SingleIconScreen';
import '../components/pages/RowLayoutScreen';
import '../components/pages/ColumnScreen';
import '../components/pages/ImageScreen';
import '../components/pages/HeadingScreen';
import { useDesignTokensFeed } from '../hooks/use-design-tokens-feed';
import { useStyleLibraryRoute } from '../hooks/use-style-library-route';
import { useLibraries } from '../hooks/use-libraries';
import { ItemAnchorProvider } from '../hooks/use-item-anchor';
import { DraftChannelContext, useDraftChannelState } from '../hooks/use-draft-channel';
import { BreakpointProvider } from '../../token-controls/context/breakpoint';
import { DEFAULT_SCREEN_ID } from '../constants/screens';
import { buildBaseStylesNav, buildBlockPresetsNav, resolveScreen } from '../helpers/screens';
import { libraryDisplayTitle } from '../helpers/libraries';
import { resetWorkspace } from '../helpers/workspace';

/**
 * The Base Styles ids with a real screen component, extended by each subsequent per-screen
 * ticket. Every id not listed here falls back to `PlaceholderScreen` in the registry below.
 *
 * @since TBD
 */
const SCREEN_COMPONENTS = {
	typography: TypographyScreen,
	'border-radius': BorderRadiusScreen,
	'color-palette': ColorPaletteScreen,
	'border-width': BorderWidthScreen,
	spacing: SpacingScreen,
	'icon-sizes': IconSizesScreen,
	shadow: ShadowScreen,
};

/**
 * Render the Style Library application: feed gate, route hook, sidebar navigation, and the screen
 * resolved for the active route. A screen that owns a settings panel exposes it as a static
 * `SettingsPanel` property on its page component (`MyScreen.SettingsPanel = MyScreenSettings`);
 * this is the one place that property is read and mounted into the settings popover.
 * The app itself carries no per-screen knowledge — not the demo, not any real screen's panel
 * contents — so a screen and its panel are siblings that share state only through the server and
 * the route, never through this component.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The app, or null while the route is being normalized to a known screen.
 */
function StyleLibraryAppContent() {
	const feed = useDesignTokensFeed();
	const { route, navigate, replace } = useStyleLibraryRoute();

	// The draft channel (see `hooks/use-draft-channel.js`): built here because this is the one
	// component that already renders both the screen and its settings-panel slot, so it is the only
	// place a provider for the two of them can live. Built before `useLibraries` below because the
	// library flows need to clear it when they replace the feed under an open panel.
	const channel = useDraftChannelState();

	// Pulled out of `channel` rather than depending on `channel` itself: `useDraftChannelState()`
	// returns a fresh object literal on every render, while `clearPublication` is individually
	// stable — the same reasoning `ScaleSettings.js` documents for its own publish effect.
	const clearPublication = channel.clearPublication;
	const libraryReset = useCallback(() => resetWorkspace({ clearPublication, replace }), [clearPublication, replace]);

	const libraries = useLibraries(feed.feed, feed.refreshFeed, libraryReset);

	const snackbarNotices = useSelect(
		(select) =>
			select('core/notices')
				.getNotices()
				.filter((notice) => notice.type === 'snackbar'),
		[]
	);
	const { removeNotice } = useDispatch('core/notices');

	const baseStylesNav = useMemo(() => buildBaseStylesNav(), []);
	const blockPresetsNav = useMemo(() => buildBlockPresetsNav(feed.feed), [feed.feed]);

	// Every Base Styles id without an entry in SCREEN_COMPONENTS resolves to the placeholder until
	// its per-screen work lands, and the preset fallback stays the placeholder for any preset-bound
	// block with no registered screen component on the preset-screens filter.
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
		return <AppShellSkeleton />;
	}

	if (!resolution) {
		return null;
	}

	const navEntry = [...baseStylesNav, ...blockPresetsNav].find((entry) => entry.id === activeScreenId);
	const label = navEntry ? navEntry.label : resolution.block || activeScreenId;
	// `scope` is the PREVIOUS screen's own sub-selection (Color Palette's is a palette id) — it
	// must be cleared on every screen switch alongside `item`, or it leaks onto a screen with no
	// idea what to do with it (e.g. a palette id showing up in Typography's URL).
	// Screen switching loses the open draft exactly like closing the panel (the settings-panel slot
	// unmounts either way), so it is guarded identically.
	const onNavigate = (id) => channel.guard(() => navigate({ screen: id, scope: '', item: '' }));

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
		<DraftChannelContext.Provider value={channel}>
			{/*
			 * Mounted here for the same reason as the draft channel above: the screen and its settings
			 * panel are siblings, and this is the only component that renders both. The row previews
			 * live in the screen while the breakpoint switcher lives in the panel, so a provider any
			 * lower would leave the previews unable to see which breakpoint is active.
			 */}
			<BreakpointProvider>
				<AppShell
					isBlocked={libraries.isSwappingLibrary}
					header={
						<AppHeader
							librarySlot={
								<LibrarySelector
									libraries={libraries.libraries}
									activeSlug={libraries.activeSlug}
									editingSlug={libraries.editingSlug}
									pendingSlug={libraries.pendingSlug}
									editingTitle={editingTitle}
									isBusy={libraries.isBusy}
									isLoading={libraries.isLoading}
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
								<LibraryActions
									editingSlug={libraries.editingSlug}
									editingTitle={editingTitle}
									activeSlug={libraries.activeSlug}
									activeTitle={activeTitle}
									isEditingActive={libraries.isEditingActive}
									libraries={libraries.libraries}
									isBusy={libraries.isBusy}
									errors={{
										rename: libraries.renameError,
										activate: libraries.activateError,
										delete: libraries.deleteError,
									}}
									onClearError={{
										rename: libraries.clearRenameError,
										activate: libraries.clearActivateError,
										delete: libraries.clearDeleteError,
									}}
									onRename={libraries.renameLibrary}
									onActivate={libraries.activateLibrary}
									onDelete={libraries.deleteLibrary}
								/>
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
				/>
				{resolution.Component.SettingsPanel && route.item && (
					<SettingsPopover
						itemId={route.item}
						onClose={() => channel.guard(() => navigate({ item: '' }))}
						ignoreFocusOutside={channel.isGuardOpen}
					>
						<resolution.Component.SettingsPanel route={route} navigate={navigate} library={feed} />
					</SettingsPopover>
				)}
				<UnsavedChangesModal
					isOpen={channel.isGuardOpen}
					label={channel.publication?.label}
					isBusy={channel.isGuardBusy}
					error={channel.guardError}
					onSave={channel.confirmSave}
					onDiscard={channel.confirmDiscard}
					onCancel={channel.cancelGuard}
				/>
				<SnackbarList
					notices={snackbarNotices}
					onRemove={removeNotice}
					className="kadence-blocks-style-library__snackbars"
				/>
			</BreakpointProvider>
		</DraftChannelContext.Provider>
	);
}

/**
 * Render the Style Library application inside the item anchor registry, which the screens write to
 * and the settings popover reads from.
 *
 * @since TBD
 *
 * @return {JSX.Element} The app.
 */
export function StyleLibraryApp() {
	return (
		<ItemAnchorProvider>
			<StyleLibraryAppContent />
		</ItemAnchorProvider>
	);
}
