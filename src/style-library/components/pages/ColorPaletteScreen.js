/**
 * The Color Palette screen: the palette selector in the screen header and the swatch grid of the
 * current palette's effective view. Palette structure is read here and edited through the palette
 * flows (`helpers/palette-flows.js`) via `hooks/use-palettes.js`; this component never chooses a
 * write target itself — selecting a palette in the header only opens it for viewing, and every
 * mutation below is a thin binding onto a flow that already encodes its own write routing.
 */

/**
 * WordPress dependencies
 */
import { useMemo, useState } from '@wordpress/element';
import { Button, Notice, Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { colord } from '../../helpers/colord';
import { ScreenHeader } from '../organisms/ScreenHeader';
import { SwatchGrid } from '../organisms/SwatchGrid';
import { SelectDropdown } from '../molecules/SelectDropdown';
import { EmptyState } from '../molecules/EmptyState';
import { ActivatePaletteButton } from '../organisms/ActivatePaletteButton';
import { CreatePaletteModal } from '../organisms/CreatePaletteModal';
import { RenamePaletteModal } from '../organisms/RenamePaletteModal';
import { DeletePaletteModal } from '../organisms/DeletePaletteModal';
import { AddColorGroupModal } from '../organisms/AddColorGroupModal';
import { usePalettes } from '../../hooks/use-palettes';
import { isDefaultPalette, mapPaletteToSwatchGroups, paletteDisplayLabel } from '../../helpers/palettes';
import { ColorPaletteSettings } from './ColorPaletteSettings';
import './ColorPaletteScreen.scss';

/**
 * The fill for a swatch's preview slot: the swatch's raw `$value`, or a neutral gray-100 fallback
 * when the value isn't a color `colord` can parse. A palette swatch is the only place in the app
 * where a `$value` might not be a plain color — an alias-valued swatch written through raw REST is
 * the only way to reach the fallback — and it must not paint garbage.
 *
 * @param {string} value The swatch's raw `$value`.
 *
 * @since TBD
 *
 * @return {Object} The inline style for `SwatchCard`'s `previewStyle`.
 */
function swatchPreviewStyle(value) {
	return { background: colord(value).isValid() ? value : 'var(--kb-sl-color-gray-100)' };
}

/**
 * Render the Color Palette screen.
 *
 * @param {Object}   props          The component props.
 * @param {string}   props.label    The active screen's nav label.
 * @param {Object}   props.route    The route from `useStyleLibraryRoute`.
 * @param {Function} props.navigate The route navigator.
 * @param {Object}   props.library  The design-tokens feed surface (`feed`, `slug`, `version`, `rest`, `refreshFeed`).
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen.
 */
export function ColorPaletteScreen({ label, route, navigate, library }) {
	// `route`/`navigate` are threaded through so `usePalettes` can derive `editingId` from
	// `route.scope` and write it via `openPalette` — see that hook's own docblock for why the
	// route, not another `useState`, has to be the source of truth shared with the settings panel's
	// own separate instance below.
	const palettes = usePalettes(library.feed, library.refreshFeed, route, navigate);

	// Plain UI state, not route state — a half-typed modal must not enter browser history.
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);

	const editingRow = palettes.listing.palettes.find((row) => row.id === palettes.editingId);
	const activeRow = palettes.listing.palettes.find((row) => row.id === palettes.activeId);

	const options = useMemo(
		() =>
			palettes.listing.palettes.map((row) => ({
				value: row.id,
				label: paletteDisplayLabel(row),
				// The Active badge tracks `$current` independently of which row is being edited —
				// opening a palette never moves it (see `openPaletteFlow`).
				badges:
					row.id === palettes.activeId ? [{ text: __('Active', 'kadence-blocks'), variant: 'state' }] : [],
			})),
		[palettes.listing.palettes, palettes.activeId]
	);

	const gridGroups = useMemo(
		() =>
			mapPaletteToSwatchGroups(palettes.palette).map((group) => ({
				...group,
				items: group.items.map((item) => ({
					...item,
					previewStyle: swatchPreviewStyle(item.value),
					// The default-palette structure write this needed now exists (`reorderSwatchesFlow`),
					// so the selected card's drag handle renders.
					isDraggable: true,
				})),
			})),
		[palettes.palette]
	);

	return (
		<div className="kadence-blocks-style-library__color-palette-screen">
			<ScreenHeader
				title={label}
				inlineControl={
					<>
						<SelectDropdown
							value={palettes.editingId}
							options={options}
							// Opens the palette for viewing only — never writes `$current`. A future reader who
							// "fixes" this to also activate would silently re-tint the live site every time
							// someone merely looks at a different palette; see `openPaletteFlow`'s own docblock.
							onChange={(id) => palettes.openPalette(id).catch(() => {})}
							isBusy={palettes.isBusy}
							error={palettes.openError}
							onClearError={palettes.clearOpenError}
							trailingAction={{
								label: __('Create Color Palette', 'kadence-blocks'),
								onClick: () => setIsCreateOpen(true),
							}}
						/>
						<ActivatePaletteButton
							editingId={palettes.editingId}
							editingLabel={paletteDisplayLabel(editingRow)}
							activeLabel={paletteDisplayLabel(activeRow)}
							isEditingActive={palettes.isEditingActive}
							isBusy={palettes.isBusy}
							error={palettes.activateError}
							onClearError={palettes.clearActivateError}
							onActivate={palettes.activatePalette}
						/>
					</>
				}
				secondaryAction={
					// Unlike Delete, available on the default palette too — the server only refuses
					// DELETING it (`delete_item()`'s explicit default-id guard), not relabeling it
					// (`update_item()` carries no such guard). Always targets the palette being edited,
					// exactly like Delete, for the same open/activate-split reason.
					<RenamePaletteModal
						id={palettes.editingId}
						currentLabel={paletteDisplayLabel(editingRow)}
						listing={palettes.listing}
						isBusy={palettes.isBusy}
						error={palettes.renameError}
						onClearError={palettes.clearRenameError}
						onRename={palettes.renamePalette}
					/>
				}
				destructiveAction={
					// The server refuses to delete `$default` (400), so the affordance is absent, not
					// disabled, for it — the same treatment `DeleteLibraryModal`'s precedent sets. Delete
					// always targets the palette being edited, never `activeId`: under the open/activate
					// split you can be editing a palette that isn't live, and deleting the live one instead
					// would silently re-tint the site as a side effect of cleaning up an unrelated draft.
					isDefaultPalette(palettes.listing, palettes.editingId) ? null : (
						<Button
							isDestructive
							variant="link"
							// Reuses DeleteLibraryModal's own styling — the same red text-link treatment, no
							// new rule needed for a class this app already ships.
							className="kadence-blocks-style-library__delete-library-action"
							onClick={() => setIsDeleteOpen(true)}
						>
							{__('Delete', 'kadence-blocks')}
						</Button>
					)
				}
				primaryAction={
					<Button variant="secondary" icon={plus} onClick={() => setIsAddGroupOpen(true)}>
						{__('Add Color Group', 'kadence-blocks')}
					</Button>
				}
			/>
			{palettes.isLoading ? (
				<Spinner />
			) : palettes.palette ? (
				<>
					{/* Suppressed while the add-group modal is open — that flow shares this same
					 * `structureError` slot (per the settled six-slot design) and shows it inline
					 * instead, so surfacing it here too would render the same message twice. */}
					{!isAddGroupOpen && palettes.structureError && (
						<Notice status="error" onRemove={palettes.clearStructureError}>
							{palettes.structureError.message}
						</Notice>
					)}
					<SwatchGrid
						groups={gridGroups}
						selectedId={route.item}
						onSelect={(token) => navigate({ item: token })}
						onReorder={(groupId, orderedTokens) => palettes.reorderSwatches(groupId, orderedTokens)}
						onAdd={(groupId) =>
							palettes
								.addColor(groupId)
								.then((newToken) => navigate({ item: newToken }))
								// Swallowed: a failure already lands in `structureError`, rendered above.
								.catch(() => {})
						}
						addLabel={__('Add color', 'kadence-blocks')}
					/>
				</>
			) : (
				<EmptyState
					title={palettes.openError?.message || __('This palette could not be loaded.', 'kadence-blocks')}
				/>
			)}
			{isCreateOpen && (
				<CreatePaletteModal
					listing={palettes.listing}
					isBusy={palettes.isBusy}
					error={palettes.createError}
					onClose={() => {
						setIsCreateOpen(false);
						palettes.clearCreateError();
					}}
					onCreate={(paletteLabel) =>
						palettes
							.createPalette(paletteLabel)
							.then(() => {
								setIsCreateOpen(false);
								palettes.clearCreateError();
							})
							// Swallowed: an invalid/duplicate label or a request failure already lands in
							// `createError`, rendered inline — the modal stays open on it.
							.catch(() => {})
					}
				/>
			)}
			{isDeleteOpen && (
				<DeletePaletteModal
					label={paletteDisplayLabel(editingRow)}
					isActive={palettes.isEditingActive}
					isBusy={palettes.isBusy}
					error={palettes.deleteError}
					onClose={() => {
						setIsDeleteOpen(false);
						palettes.clearDeleteError();
					}}
					onConfirm={() =>
						palettes
							.deletePalette(palettes.editingId)
							.then(() => {
								setIsDeleteOpen(false);
								palettes.clearDeleteError();
							})
							// Swallowed: a request failure already lands in `deleteError`, rendered inline —
							// the modal stays open on it.
							.catch(() => {})
					}
				/>
			)}
			{isAddGroupOpen && (
				<AddColorGroupModal
					palette={palettes.palette}
					isBusy={palettes.isBusy}
					error={palettes.structureError}
					onClose={() => {
						setIsAddGroupOpen(false);
						palettes.clearStructureError();
					}}
					onAdd={(groupLabel) =>
						palettes
							.addGroup(groupLabel)
							.then((newToken) => {
								setIsAddGroupOpen(false);
								palettes.clearStructureError();

								// Selects the group's new swatch so the panel opens on it, mirroring the
								// grid's own `AddTile` binding above (`addColor(...).then((newToken) =>
								// navigate({ item: newToken }))`) — `addGroupFlow` resolves with the new
								// swatch's token the same way `addColorFlow` does.
								navigate({ item: newToken });
							})
							// Swallowed: an invalid/duplicate label or a request failure already lands in
							// `structureError`, rendered inline — the modal stays open on it.
							.catch(() => {})
					}
				/>
			)}
		</div>
	);
}

/**
 * The screen-panel contract: a screen exposes its settings panel as a static property on its page
 * component, read by `StyleLibraryApp` and mounted into `AppShell`'s `settingsPanel` slot.
 *
 * @since TBD
 */
ColorPaletteScreen.SettingsPanel = ColorPaletteSettings;
