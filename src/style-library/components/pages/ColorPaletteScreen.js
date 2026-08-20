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
import { Button, DropdownMenu, MenuGroup, MenuItem, Notice } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { moreVertical, plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { colord } from '../../helpers/colord';
import { ScreenHeader } from '../organisms/ScreenHeader';
import { SwatchGrid } from '../organisms/SwatchGrid';
import { SelectDropdown } from '../molecules/SelectDropdown';
import { EmptyState } from '../molecules/EmptyState';
import { Skeleton } from '../atoms/Skeleton';
import { ActivatePaletteButton } from '../organisms/ActivatePaletteButton';
import { CreatePaletteModal } from '../organisms/CreatePaletteModal';
import { RenamePaletteModal } from '../organisms/RenamePaletteModal';
import { DeletePaletteModal } from '../organisms/DeletePaletteModal';
import { AddColorGroupModal } from '../organisms/AddColorGroupModal';
import { RenameColorGroupModal } from '../organisms/RenameColorGroupModal';
import { DeleteColorGroupModal } from '../organisms/DeleteColorGroupModal';
import { usePalettes } from '../../hooks/use-palettes';
import { useLoadingAnnouncement } from '../../hooks/use-loading-announcement';
import {
	isUserCreatedPalette,
	mapPaletteToSwatchGroups,
	paletteDisplayLabel,
	paletteSuccessorOptions,
} from '../../helpers/palettes';
import { ColorPaletteSettings } from './ColorPaletteSettings';
import './ColorPaletteScreen.scss';

// A fixed count, not derived from anything — there is no "expected swatch count" to read before
// the real palette arrives, so this just needs to fill a group row plausibly.
const SKELETON_SWATCH_IDS = [0, 1, 2, 3, 4, 5];

/**
 * The palette loading placeholder: one group heading and a row of swatch-card-shaped skeletons in
 * the real `SwatchGrid` markup (`.swatch-grid` / `.swatch-group` / `.swatch-card`), so the loading
 * shape matches the grid it is about to be replaced by instead of collapsing the screen to a
 * single centered spinner.
 *
 * @param {Object} props       The component props.
 * @param {string} props.label The screen's nav label, used to build the busy-region's accessible name.
 *
 * @since TBD
 *
 * @return {JSX.Element} The swatch-grid-shaped skeleton.
 */
function SwatchGridSkeleton({ label }) {
	return (
		<div
			className="kadence-blocks-style-library__swatch-grid"
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label={sprintf(
				// translators: %s: the palette screen's label (e.g. "Color Palette").
				__('Loading %s…', 'kadence-blocks'),
				label
			)}
		>
			<div className="kadence-blocks-style-library__swatch-group">
				{/* No real heading class carries a width of its own — `SectionHeading`'s width is
				 * whatever its text measures — so this bar's width is a plain literal, not a reused
				 * layout value. */}
				<Skeleton className="kadence-blocks-style-library__skeleton--bar" style={{ width: '8rem' }} />
				<div className="kadence-blocks-style-library__swatch-group-row">
					{SKELETON_SWATCH_IDS.map((id) => (
						<div key={id} className="kadence-blocks-style-library__swatch-card">
							<div className="kadence-blocks-style-library__swatch-card-main">
								<Skeleton className="kadence-blocks-style-library__swatch-card-preview" />
								{/* `.swatch-card-name` only declares `max-width: 100%`, never a `width` — a real
								 * swatch name gets its width from its own text, but this shape has none, and its
								 * `align-items: flex-start` parent collapses an unsized block to 0 width without
								 * one. Same fix as the group heading bar above: pin a plausible literal width. */}
								<Skeleton
									className="kadence-blocks-style-library__swatch-card-name kadence-blocks-style-library__skeleton--bar"
									style={{ width: '70%' }}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

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

	// The skeleton below lives inside its own `role="status"` region, which only announces "Loading
	// X…" while it is actually mounted — the moment it is replaced by the real grid, that region is
	// gone too, and nothing is left to tell a screen reader the load finished.
	useLoadingAnnouncement(
		palettes.isLoading,
		// translators: %s: the palette screen's label (e.g. "Color Palette").
		sprintf(__('%s loaded.', 'kadence-blocks'), label)
	);

	// Plain UI state, not route state — a half-typed modal must not enter browser history.
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
	// Carries the whole mapped group entry (`{ id, label, items }`), not just an id, so the modals
	// can seed the label and count the swatches without a second lookup.
	const [renameGroupTarget, setRenameGroupTarget] = useState(null);
	const [deleteGroupTarget, setDeleteGroupTarget] = useState(null);

	const editingRow = palettes.listing.palettes.find((row) => row.id === palettes.editingId);
	const isEditingUserCreated = isUserCreatedPalette(palettes.listing, palettes.editingId);
	const activeRow = palettes.listing.palettes.find((row) => row.id === palettes.activeId);

	const options = useMemo(
		() =>
			palettes.listing.palettes.map((row) => ({
				value: row.id,
				label: paletteDisplayLabel(row),
				// The Active badge tracks `$current` independently of which row is being edited —
				// opening a palette never moves it (`usePalettes().openPalette` is a pure
				// navigation that only writes the route's `scope`).
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
							// someone merely looks at a different palette; see `usePalettes().openPalette`'s
							// own comment in `hooks/use-palettes.js`.
							onChange={(id) => palettes.openPalette(id).catch(() => {})}
							isBusy={palettes.isBusy}
							isLoading={palettes.isLoading}
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
					// Always targets the palette being edited, never `activeId`: under the open/activate
					// split you can be editing a palette that isn't live, and acting on the live one instead
					// would silently re-tint the site as a side effect of cleaning up an unrelated draft.
					// The `$default` palette is offered too — as a Reset, since the server refuses to remove
					// it but does drop its overrides.
					<Button
						isDestructive
						variant="link"
						// Reuses DeleteLibraryModal's own styling — the same red text-link treatment, no
						// new rule needed for a class this app already ships.
						className="kadence-blocks-style-library__delete-library-action"
						onClick={() => setIsDeleteOpen(true)}
					>
						{isEditingUserCreated ? __('Delete', 'kadence-blocks') : __('Reset', 'kadence-blocks')}
					</Button>
				}
				primaryAction={
					<Button variant="secondary" icon={plus} onClick={() => setIsAddGroupOpen(true)}>
						{__('Add Color Group', 'kadence-blocks')}
					</Button>
				}
			/>
			{palettes.isLoading ? (
				<SwatchGridSkeleton label={label} />
			) : palettes.palette ? (
				<>
					{/* Suppressed while the add-group, rename-group, or delete-group modal is open —
					 * every one of those flows shares this same `structureError` slot (per the settled
					 * six-slot design) and shows it inline instead, so surfacing it here too would
					 * render the same message twice. */}
					{!isAddGroupOpen && !renameGroupTarget && !deleteGroupTarget && palettes.structureError && (
						<Notice status="error" onRemove={palettes.clearStructureError}>
							{palettes.structureError.message}
						</Notice>
					)}
					<SwatchGrid
						groups={gridGroups}
						selectedId={route.item}
						onSelect={(token) => navigate({ item: token })}
						onReorder={(groupId, orderedTokens) =>
							palettes
								.reorderSwatches(groupId, orderedTokens)
								// Swallowed: a failure already lands in `structureError`, rendered above.
								.catch(() => {})
						}
						onAdd={(groupId) =>
							palettes
								.addColor(groupId)
								.then((newToken) => navigate({ item: newToken }))
								// Swallowed: a failure already lands in `structureError`, rendered above.
								.catch(() => {})
						}
						addLabel={__('Add color', 'kadence-blocks')}
						groupActions={(group) => (
							<DropdownMenu
								icon={moreVertical}
								label={sprintf(
									// translators: %s: the color group name.
									__('Options for %s', 'kadence-blocks'),
									group.label
								)}
								popoverProps={{ placement: 'bottom-end' }}
								toggleProps={{ size: 'small' }}
							>
								{({ onClose }) => (
									<MenuGroup>
										<MenuItem
											onClick={() => {
												setRenameGroupTarget(group);
												onClose();
											}}
										>
											{__('Rename', 'kadence-blocks')}
										</MenuItem>
										{/* Absence, not a disabled item, when only one group remains — the server
										 * rejects an empty `groups` array (`guard_palette_shape()`), and this
										 * screen's ethos throughout is to hide an affordance it cannot honor rather
										 * than disable it. */}
										{gridGroups.length > 1 && (
											<MenuItem
												isDestructive
												onClick={() => {
													setDeleteGroupTarget(group);
													onClose();
												}}
											>
												{__('Delete', 'kadence-blocks')}
											</MenuItem>
										)}
									</MenuGroup>
								)}
							</DropdownMenu>
						)}
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
					isUserCreated={isEditingUserCreated}
					successors={paletteSuccessorOptions(palettes.listing, palettes.editingId)}
					isActive={palettes.isEditingActive}
					isBusy={palettes.isBusy}
					error={palettes.deleteError}
					onClose={() => {
						setIsDeleteOpen(false);
						palettes.clearDeleteError();
					}}
					onConfirm={(successorId) =>
						palettes
							.deletePalette(palettes.editingId, successorId)
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
			{renameGroupTarget && (
				<RenameColorGroupModal
					group={renameGroupTarget}
					isBusy={palettes.isBusy}
					error={palettes.structureError}
					onClose={() => {
						setRenameGroupTarget(null);
						palettes.clearStructureError();
					}}
					onRename={(label) =>
						palettes
							.renameGroup(renameGroupTarget.id, label)
							.then(() => {
								setRenameGroupTarget(null);
								palettes.clearStructureError();
							})
							// Swallowed: a request failure already lands in `structureError`, rendered
							// inline — the modal stays open on it.
							.catch(() => {})
					}
				/>
			)}
			{deleteGroupTarget && (
				<DeleteColorGroupModal
					group={deleteGroupTarget}
					isBusy={palettes.isBusy}
					error={palettes.structureError}
					onClose={() => {
						setDeleteGroupTarget(null);
						palettes.clearStructureError();
					}}
					onConfirm={() => {
						// Captured before the delete resolves: the group is gone from `gridGroups` by
						// then, so this is the only point the selected swatch can still be checked
						// against the group being removed.
						const selectedInGroup = deleteGroupTarget.items.some((item) => item.id === route.item);

						return (
							palettes
								.removeGroup(deleteGroupTarget.id)
								.then(() => {
									setDeleteGroupTarget(null);
									palettes.clearStructureError();

									// The panel must close when its swatch no longer exists in any palette —
									// otherwise it points at a token that was just deleted. A failed best-effort
									// token cleanup never reaches here: the flow resolves once the row removal
									// has settled, regardless of the cleanup outcome.
									if (selectedInGroup) {
										navigate({ item: '' });
									}
								})
								// Swallowed: a request failure already lands in `structureError`, rendered
								// inline — the modal stays open on it.
								.catch(() => {})
						);
					}}
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
