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
import { SettingsPanel } from '../components/templates/SettingsPanel';
import { SettingsForm } from '../components/organisms/SettingsForm';
import { PlaceholderScreen } from '../components/pages/PlaceholderScreen';
import { useDesignTokensFeed } from '../hooks/use-design-tokens-feed';
import { useStyleLibraryRoute } from '../hooks/use-style-library-route';
import { useLibraries } from '../hooks/use-libraries';
import { useSettingsPanel } from '../hooks/use-settings-panel';
import { DEFAULT_SCREEN_ID } from '../constants/screens';
import { DEMO_ITEM_ID, DEMO_SETTINGS_SCHEMA, DEMO_SETTINGS_VALUES } from '../constants/demo-settings-schema';
import { buildBaseStylesNav, buildBlockPresetsNav, resolveScreen } from '../helpers/screens';
import { libraryDisplayTitle } from '../helpers/libraries';

/**
 * Render the Style Library application: feed gate, route hook, sidebar navigation, and the screen
 * resolved for the active route. The settings panel opens for the dev-only field-library demo
 * item; a real per-screen item is wired up by the per-screen tickets that ship a save/delete
 * implementation.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The app, or null while the route is being normalized to a known screen.
 */
export function StyleLibraryApp() {
	const feed = useDesignTokensFeed();
	const { route, navigate, replace } = useStyleLibraryRoute();
	const libraries = useLibraries(feed.feed, feed.refreshFeed);

	// Dev-only affordance, compiled out of production; see PlaceholderScreen's demo button.
	const isDemoItem = process.env.NODE_ENV === 'development' && route.item === DEMO_ITEM_ID;
	const settingsPanelState = useSettingsPanel({
		route,
		navigate,
		initialValues: isDemoItem ? DEMO_SETTINGS_VALUES : {},
	});

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

	// Two different libraries are named in the header: the one being edited (the selector's value,
	// and the target of rename/delete/activate) and the one the site renders with (named in the
	// activation modal's copy). `libraryDisplayTitle` resolves either from the slug alone, so both
	// stay correct on the first paint before the list has loaded.
	const editingTitle = libraryDisplayTitle(
		libraries.libraries.find((library) => library.slug === libraries.editingSlug) ?? {
			slug: libraries.editingSlug,
			// The feed is assembled for the library being edited, so its title names that library
			// on the first paint, before the list has loaded.
			title: feed.feed?.title ?? '',
		}
	);
	const activeTitle = libraryDisplayTitle(
		libraries.libraries.find((library) => library.slug === libraries.activeSlug) ?? {
			slug: libraries.activeSlug,
			title: '',
		}
	);

	return (
		<AppShell
			header={
				<AppHeader
					librarySlot={
						<LibrarySelector
							libraries={libraries.libraries}
							activeSlug={libraries.activeSlug}
							editingSlug={libraries.editingSlug}
							editingTitle={editingTitle}
							isBusy={libraries.isBusy}
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
			content={
				<resolution.Component label={label} onOpenFieldLibraryDemo={() => navigate({ item: DEMO_ITEM_ID })} />
			}
			settingsPanel={
				isDemoItem ? (
					<SettingsPanel
						onClose={settingsPanelState.close}
						onDelete={() => settingsPanelState.close()}
						onSave={() => settingsPanelState.resetDraft()}
						isDirty={settingsPanelState.isDirty}
					>
						<SettingsForm
							schema={DEMO_SETTINGS_SCHEMA}
							values={settingsPanelState.draft}
							onChange={settingsPanelState.setFieldValue}
						/>
					</SettingsPanel>
				) : null
			}
		/>
	);
}
