/**
 * The Style Library header's library selector: a thin composition of the generic
 * `SelectDropdown` molecule over the library list, plus the library-specific "Create Library"
 * modal its trailing action opens. All of the selector's visual behavior (the toggle, the check
 * icon, the divider, the menu geometry) lives in `SelectDropdown` — this component only supplies
 * library data and the create flow.
 *
 * Choosing a library here *opens* it for editing. It does not change which library the site
 * renders with; that is a separate, confirmed action (see `ActivateLibraryButton`).
 *
 * The check icon keeps its ordinary meaning — the row you are on — because that is what a check in
 * a menu reads as, and overloading it to mean "live" made the menu harder to read, not easier.
 * Which library the site is serving is said in words instead, by the `Active` badge.
 */

/**
 * WordPress dependencies
 */
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SelectDropdown } from '../molecules/SelectDropdown';
import { isDefaultLibrary, libraryDisplayTitle } from '../../helpers/libraries';
import { CreateLibraryModal } from './CreateLibraryModal';
import { useDraftChannel } from '../../hooks/use-draft-channel';

/**
 * Render the library selector.
 *
 * @param {Object}        props                    The component props.
 * @param {Array<Object>} props.libraries          The ordered library rows (`{ slug, title }`).
 * @param {string}        props.activeSlug         The slug the site renders with.
 * @param {string}        props.editingSlug        The slug the app is showing.
 * @param {string}        props.editingTitle       That library's display title, already resolved by the caller.
 * @param {boolean}       props.isBusy             Whether a library operation is in flight.
 * @param {boolean}       [props.isLoading]        Whether the libraries list is still loading.
 * @param {boolean}       props.isSwapping         Whether the app is being repopulated for a different library.
 * @param {?{message: string}} props.openError     The current open error, if any.
 * @param {?{message: string}} props.createError   The current create error, if any.
 * @param {Function}      props.onOpen             Called with a slug to open that library for editing.
 * @param {Function}      props.onCreate           Called with a title to create a library.
 * @param {Function}      props.onClearOpenError   Dismisses the current open error.
 * @param {Function}      props.onClearCreateError Dismisses the current create error.
 *
 * @since TBD
 *
 * @return {JSX.Element} The selector, and, while open, the create-library modal.
 */
export function LibrarySelector({
	libraries,
	activeSlug,
	editingSlug,
	editingTitle,
	isBusy,
	isLoading,
	isSwapping,
	openError,
	createError,
	onOpen,
	onCreate,
	onClearOpenError,
	onClearCreateError,
}) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const channel = useDraftChannel();

	const options = libraries.map((library) => {
		const badges = [];

		// Order is fixed — the unchanging property before the one that moves — so a row carrying
		// both does not reshuffle its badges as the active library changes.
		if (isDefaultLibrary(library.slug)) {
			// Answers "why can't I delete this one?" before the user tries: the default library is
			// never removed, only reset to the shipped baseline.
			badges.push({ text: __('Default', 'kadence-blocks'), variant: 'muted' });
		}

		if (library.slug === activeSlug) {
			badges.push({ text: __('Active', 'kadence-blocks'), variant: 'state' });
		}

		return {
			value: library.slug,
			label: libraryDisplayTitle(library),
			badges,
		};
	});

	// A plain open from the dropdown has no follow-up action waiting on its result — the
	// `openError` state above already surfaces a failure, so the rejection `onOpen`'s promise
	// carries (there for a caller that chains off it, e.g. the create flow) is swallowed here
	// rather than left unhandled.
	//
	// Guarded because opening another library replaces the feed under any open settings panel, and
	// that panel's draft cannot survive the swap. Unlike deleting a library — where the draft's
	// target is destroyed and prompting would be nonsense — the token being edited still exists, so
	// the edit is worth offering to save.
	const handleOpen = (slug) => {
		const open = () => onOpen(slug).catch(() => {});

		channel ? channel.guard(open) : open();
	};

	return (
		<>
			<SelectDropdown
				value={editingSlug}
				options={options}
				// What the toggle shows until `libraries` has loaded and an option can match
				// `editingSlug`. The caller resolves it from the inline page feed, so the library is
				// named correctly from the first paint rather than showing a slug-derived guess and
				// silently correcting itself when the list request lands.
				valueLabel={editingTitle}
				isBusy={isBusy}
				isLoading={isLoading}
				// The app draws its own scrim while a library is being opened, so the dropdown's
				// inline spinner would be a second progress indicator for the same wait — and one
				// sitting underneath the scrim at that. The control still disables via `isBusy`.
				showSpinner={!isSwapping}
				// Suppressed while the create modal is open — it shows its own (separately scoped)
				// createError inline instead, so surfacing openError here too would display two
				// unrelated errors at once.
				error={isCreateOpen ? null : openError}
				onClearError={onClearOpenError}
				onChange={handleOpen}
				trailingAction={{
					label: __('Create Library', 'kadence-blocks'),
					// Guarded at the point the modal opens rather than around `onCreate`: creating a
					// library ends by opening it, so it swaps the feed like any other switch, and
					// asking here keeps the prompt from appearing on top of the create modal.
					onClick: () => {
						const openModal = () => setIsCreateOpen(true);

						channel ? channel.guard(openModal) : openModal();
					},
				}}
			/>
			{isCreateOpen && (
				<CreateLibraryModal
					libraries={libraries}
					isBusy={isBusy}
					error={createError}
					onClose={() => {
						setIsCreateOpen(false);
						onClearCreateError();
					}}
					onCreate={(title) =>
						onCreate(title)
							.then(() => {
								// A successful create opens the new library and refreshes the libraries
								// list (see the hook) — this is the explicit close that used to be moot
								// when the flow ended in a page reload.
								setIsCreateOpen(false);
								onClearCreateError();
							})
							// Swallowed: a validation or request failure already lands in `createError` via
							// the hook's setCreateError, which the modal renders inline — nothing further to
							// do here beyond leaving the modal open.
							.catch(() => {})
					}
				/>
			)}
		</>
	);
}
