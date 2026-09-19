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
import { useCallback, useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { Button, Notice } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { colord } from '../../helpers/colord';
import { InheritancePill } from '../atoms/InheritancePill';
import { ScreenHeader } from '../organisms/ScreenHeader';
import { SwatchGrid } from '../organisms/SwatchGrid';
import { SelectDropdown } from '../molecules/SelectDropdown';
import { ScreenDescription } from '../molecules/ScreenDescription';
import { EmptyState } from '../molecules/EmptyState';
import { PaletteInheritanceNotice } from '../molecules/PaletteInheritanceNotice';
import { Skeleton } from '../atoms/Skeleton';
import { PaletteActions } from '../organisms/PaletteActions';
import { CreatePaletteModal } from '../organisms/CreatePaletteModal';
import { AddColorGroupModal } from '../organisms/AddColorGroupModal';
import { ActionsForm } from '../organisms/ActionsForm';
import { ActionsPopover } from '../organisms/ActionsPopover';
import { checkRename } from '../../helpers/rename';
import { DeleteColorGroupModal } from '../organisms/DeleteColorGroupModal';
import { usePalettes } from '../../hooks/use-palettes';
import { useLoadingAnnouncement } from '../../hooks/use-loading-announcement';
import {
	inheritedSwatchCount,
	isBaselineGroup,
	isUserCreatedPalette,
	mapPaletteToSwatchGroups,
	paletteDisplayLabel,
	paletteShowsInheritance,
	swatchPillVariant,
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
				<div className="kadence-blocks-style-library__swatch-group-grid">
					{SKELETON_SWATCH_IDS.map((id) => (
						<div key={id} className="kadence-blocks-style-library__swatch-card">
							<div className="kadence-blocks-style-library__swatch-card-main">
								<div className="kadence-blocks-style-library__swatch-card-select">
									<Skeleton className="kadence-blocks-style-library__swatch-card-preview" />
									{/* `.swatch-card-name` only declares `max-width: 100%`, never a `width` — a real
									 * swatch name gets its width from its own text, but this shape has none, and its
									 * `align-items: flex-start` parent (`.swatch-card-select`) collapses an unsized
									 * block to 0 width without one. Same fix as the group heading bar above: pin a
									 * plausible literal width. */}
									<span className="kadence-blocks-style-library__swatch-card-details">
										<Skeleton
											className="kadence-blocks-style-library__swatch-card-name kadence-blocks-style-library__skeleton--bar"
											style={{ width: '70%' }}
										/>
									</span>
								</div>
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
	// A snapshot of the palette the delete modal was opened for, not just an open flag: the
	// delete's own response drops the row from the listing before the confirm resolves, which
	// snaps `editingId` back to the default palette while the modal is still open — props derived
	// live at that point would flip its Delete copy to the default palette's Reset copy for the
	// closing frame.
	const [isAddGroupOpen, setIsAddGroupOpen] = useState(false);
	// Carries the whole mapped group entry (`{ id, label, items }`), not just an id, so the modals
	// can seed the label and count the swatches without a second lookup.
	const [deleteGroupTarget, setDeleteGroupTarget] = useState(null);
	const [isGroupPopoverOpen, setIsGroupPopoverOpen] = useState(false);

	const editingRow = palettes.listing.palettes.find((row) => row.id === palettes.editingId);
	const isEditingUserCreated = isUserCreatedPalette(palettes.listing, palettes.editingId);
	const activeRow = palettes.listing.palettes.find((row) => row.id === palettes.activeId);

	// The pills only exist on a palette that has something to inherit FROM, and both the pill and
	// the notice name that palette by its current label — the default palette can be renamed, so
	// the word on the card has to come from the listing rather than from a literal.
	const showsInheritance = paletteShowsInheritance(palettes.listing, palettes.editingId);
	const defaultLabel = paletteDisplayLabel(
		palettes.listing.palettes.find((row) => row.id === palettes.listing.defaultId)
	);

	// The swatch whose settings panel is open, readable at any later moment rather than as of the
	// render a callback closed over — see `handleResetSwatch`, which decides whether to close the
	// panel only once its write has settled.
	//
	// Synced in an effect, never during render: React can start a render and throw it away, and a
	// ref written on the way through would then hold a route the user is not actually on. Only a
	// committed render should move it.
	const openItemRef = useRef(route.item);

	useEffect(() => {
		openItemRef.current = route.item;
	}, [route.item]);

	/**
	 * Reset one swatch's override, then, on success, move focus to that card's own select button —
	 * the pill that was just clicked is about to unmount (the card flips back to the static "From"
	 * pill), and React would otherwise drop focus to `<body>`. The card and its select button are
	 * resolved from the click event up front rather than through a ref, since `card` is only needed
	 * once the promise settles and may be gone from the document by then; a failed reset leaves the
	 * Reset button in place, so focus is left alone on failure.
	 *
	 * @param {Event}  event The click event from the pill's own button.
	 * @param {string} token The swatch token to reset.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	const handleResetSwatch = useCallback(
		(event, token) => {
			if (palettes.isBusy) {
				return;
			}

			const card = event.currentTarget?.closest('.kadence-blocks-style-library__swatch-card');

			palettes
				.resetSwatch(token)
				.then(() => {
					// A settings panel open on THIS swatch is now editing a value that no longer
					// exists: its draft still holds the color the reset undid (`useSettingsPanel`
					// seeds once per item and cannot follow an external write), so its Save would
					// write that color straight back. A panel on any other swatch is untouched.
					//
					// Read through the ref, not this callback's captured `route.item`: a card's
					// select button stays live during a write (only `isPendingDelete` disables it),
					// so the open swatch can change before the reset comes back. The captured value
					// would close whatever the user opened next, and leave open the panel it was
					// supposed to close.
					if (openItemRef.current === token) {
						navigate({ item: '' });
					}

					card?.querySelector('.kadence-blocks-style-library__swatch-card-select')?.focus();
				})
				// Swallowed: a failure already surfaces as a toast from inside `resetSwatch`, and the
				// card simply keeps showing its override.
				.catch(() => {});
		},
		[palettes.isBusy, palettes.resetSwatch, navigate]
	);

	/**
	 * The pill for one mapped grid item, or null when the card carries none. The variant decision
	 * itself lives in `swatchPillVariant`; this only turns it into the element.
	 *
	 * `sourceLabel` is the default palette's own label off the default palette (the pill names the
	 * palette a value follows) and the fixed word "Default" on it (a reset there restores the
	 * shipped color, so that is what the button's accessible name should say it resets to).
	 *
	 * @param {Object} item A mapped grid item from `mapPaletteToSwatchGroups()`.
	 *
	 * @since TBD
	 *
	 * @return {?JSX.Element} The pill, or null.
	 */
	const renderPill = useCallback(
		(item) => {
			const variant = swatchPillVariant({
				isDefault: !showsInheritance,
				isCustom: palettes.isSwatchCustom(item.id),
				overridden: item.overridden,
			});

			// Off the default palette the pill names a palette, so a listing that cannot name one
			// shows nothing rather than a blank source.
			if (!variant || (showsInheritance && !defaultLabel)) {
				return null;
			}

			const sourceLabel = showsInheritance ? defaultLabel : __('Default', 'kadence-blocks');

			if ('reset' === variant) {
				return (
					<InheritancePill
						variant="reset"
						sourceLabel={sourceLabel}
						swatchName={item.name}
						isDisabled={palettes.isBusy || item.pendingDelete}
						onReset={(event) => handleResetSwatch(event, item.id)}
					/>
				);
			}

			return <InheritancePill variant={variant} sourceLabel={sourceLabel} />;
		},
		[showsInheritance, defaultLabel, palettes.isBusy, palettes.isSwatchCustom, handleResetSwatch]
	);

	const options = useMemo(
		() =>
			palettes.listing.palettes.map((row) => {
				const badges = [];

				// The Active badge tracks `$current` independently of which row is being edited —
				// opening a palette never moves it (`usePalettes().openPalette` is a pure
				// navigation that only writes the route's `scope`).
				if (row.id === palettes.activeId) {
					badges.push({ text: __('Active', 'kadence-blocks'), variant: 'state' });
				} else if (row.id === palettes.listing.defaultId) {
					badges.push({ text: __('Default', 'kadence-blocks'), variant: 'muted' });
				}

				return { value: row.id, label: paletteDisplayLabel(row), badges };
			}),
		[palettes.listing.palettes, palettes.listing.defaultId, palettes.activeId]
	);

	const gridGroups = useMemo(
		() =>
			mapPaletteToSwatchGroups(palettes.palette).map((group) => ({
				...group,
				items: group.items.map((item) => ({
					...item,
					previewStyle: swatchPreviewStyle(item.value),
					// The default-palette structure write this needed now exists (`reorderSwatchesFlow`),
					// so the selected card's drag handle renders — except while the swatch is pending
					// delete, where reordering something about to vanish is not meaningful.
					isDraggable: !item.pendingDelete,
					isPendingDelete: item.pendingDelete,
					pill: renderPill(item),
				})),
			})),
		[palettes.palette, renderPill]
	);

	return (
		<div className="kadence-blocks-style-library__color-palette-screen">
			<ScreenHeader
				title={label}
				description={<ScreenDescription screenId={route.screen} />}
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
						<PaletteActions
							editingId={palettes.editingId}
							editingLabel={paletteDisplayLabel(editingRow)}
							activeLabel={paletteDisplayLabel(activeRow)}
							isEditingActive={palettes.isEditingActive}
							isUserCreated={isEditingUserCreated}
							listing={palettes.listing}
							isBusy={palettes.isBusy}
							errors={{
								rename: palettes.renameError,
								activate: palettes.activateError,
								delete: palettes.deleteError,
							}}
							onClearError={{
								rename: palettes.clearRenameError,
								activate: palettes.clearActivateError,
								delete: palettes.clearDeleteError,
							}}
							onRename={palettes.renamePalette}
							onActivate={palettes.activatePalette}
							onDelete={(id, successorId) =>
								palettes.deletePalette(id, successorId).then(() => {
									// Whatever the settings panel had open is stale now: a reset replaced every
									// swatch's value, and a delete took the whole palette away. Either way its
									// draft still holds what was there before — `useSettingsPanel` seeds once
									// per item and cannot follow an external write — so its Save would put that
									// back. Same reasoning as a single swatch's reset, one level up.
									navigate({ item: '' });
								})
							}
						/>
					</>
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
					{!isAddGroupOpen && !deleteGroupTarget && !isGroupPopoverOpen && palettes.structureError && (
						<Notice status="error" onRemove={palettes.clearStructureError}>
							{palettes.structureError.message}
						</Notice>
					)}
					{showsInheritance && (
						<PaletteInheritanceNotice count={inheritedSwatchCount(gridGroups)} sourceLabel={defaultLabel} />
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
								// Opens the new swatch's settings panel the moment it exists in the store as an
								// optimistic addition, not after the write confirms — see `addColor`'s own
								// `onOptimistic` docs.
								.addColor(groupId, (newToken) => navigate({ item: newToken }))
								// Swallowed: a failure already surfaces as a toast via `notifyError`.
								.catch(() => {})
						}
						addLabel={__('Add color', 'kadence-blocks')}
						addingGroupIds={palettes.addingGroupIds}
						groupActions={(group) => (
							<ActionsPopover
								label={sprintf(
									// translators: %s: the color group name.
									__('Edit %s', 'kadence-blocks'),
									group.label
								)}
								isBusy={palettes.isBusy}
								onClose={palettes.clearStructureError}
								onToggle={setIsGroupPopoverOpen}
							>
								{({ close }) => (
									<ActionsForm
										title={__('Color group', 'kadence-blocks')}
										nameLabel={__('Name', 'kadence-blocks')}
										currentName={group.label}
										checkName={(typed) => checkRename(typed, group.label, () => false)}
										duplicateMessage={() => ''}
										// Hidden, not disabled: the server rejects an empty `groups` array
										// (`guard_palette_shape()`) and dropping a baseline group's swatches
										// (`guard_baseline_swatches()`).
										destructiveLabel={
											gridGroups.length > 1 && !isBaselineGroup(palettes.palette, group.id)
												? __('Delete', 'kadence-blocks')
												: undefined
										}
										isBusy={palettes.isBusy}
										error={palettes.structureError}
										onSave={(label) =>
											palettes
												.renameGroup(group.id, label)
												.then(close)
												.catch(() => {})
										}
										onCancel={close}
										onDelete={() => {
											close();
											setDeleteGroupTarget(group);
										}}
									/>
								)}
							</ActionsPopover>
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
			{isAddGroupOpen && (
				<AddColorGroupModal
					palette={palettes.palette}
					error={palettes.structureError}
					onClose={() => {
						setIsAddGroupOpen(false);
						palettes.clearStructureError();
					}}
					onAdd={(groupLabel) =>
						palettes
							// Opens the new group's settings panel the moment the optimistic group and its
							// first swatch exist in the store, not after the write confirms — see `addGroup`'s
							// own `onOptimistic` docs.
							.addGroup(groupLabel, (newToken) => navigate({ item: newToken }))
							// A validation rejection (empty/duplicate name) never reaches here —
							// `AddColorGroupModal` disables its own Add button for both cases before `onAdd`
							// can fire. A real write failure is already surfaced via Snackbar inside
							// `addGroup`.
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
