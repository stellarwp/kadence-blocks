/**
 * The Style Library header's library selector: a thin composition of the generic
 * `SelectDropdown` molecule over the library list, plus the library-specific "Create Library"
 * modal its trailing action opens. All of the selector's visual behavior (the toggle, the check
 * icon, the divider, the menu geometry) lives in `SelectDropdown` — this component only supplies
 * library data and the create flow.
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
import { libraryDisplayTitle } from '../../helpers/libraries';
import { CreateLibraryModal } from './CreateLibraryModal';

/**
 * Render the library selector.
 *
 * @param {Object}        props                    The component props.
 * @param {Array<Object>} props.libraries          The ordered library rows (`{ slug, title }`).
 * @param {string}        props.activeSlug         The active library slug.
 * @param {string}        [props.activeTitle]      The active library's display name, from the feed, so
 *                                                 the toggle can name it before `libraries` loads.
 * @param {boolean}       props.isBusy             Whether a library operation is in flight.
 * @param {?{message: string}} props.switchError   The current switch error, if any.
 * @param {?{message: string}} props.createError   The current create error, if any.
 * @param {Function}      props.onSwitch           Called with a slug to switch the active library.
 * @param {Function}      props.onCreate           Called with a title to create a library.
 * @param {Function}      props.onClearSwitchError Dismisses the current switch error.
 * @param {Function}      props.onClearCreateError Dismisses the current create error.
 *
 * @since TBD
 *
 * @return {JSX.Element} The selector, and, while open, the create-library modal.
 */
export function LibrarySelector({
	libraries,
	activeSlug,
	activeTitle,
	isBusy,
	switchError,
	createError,
	onSwitch,
	onCreate,
	onClearSwitchError,
	onClearCreateError,
}) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const options = libraries.map((library) => ({
		value: library.slug,
		label: libraryDisplayTitle(library),
	}));

	// A plain switch from the dropdown has no follow-up action waiting on its result — the
	// `switchError` state above already surfaces a failure, so the rejection `onSwitch`'s promise
	// carries (there for a caller that chains off it, e.g. the create flow) is swallowed here
	// rather than left unhandled.
	const handleSwitch = (slug) => {
		onSwitch(slug).catch(() => {});
	};

	return (
		<>
			<SelectDropdown
				value={activeSlug}
				options={options}
				// What the toggle shows on first paint, before `libraries` has loaded and any option can
				// match `activeSlug`. The feed carries the active library's name for exactly this moment,
				// so the toggle never flashes the raw slug while the list is in flight.
				valueLabel={libraryDisplayTitle({ slug: activeSlug, title: activeTitle })}
				isBusy={isBusy}
				// Suppressed while the create modal is open — it shows its own (separately scoped)
				// createError inline instead, so surfacing switchError here too would display two
				// unrelated errors at once.
				error={isCreateOpen ? null : switchError}
				onClearError={onClearSwitchError}
				onChange={handleSwitch}
				trailingAction={{
					label: __('Create Library', 'kadence-blocks'),
					onClick: () => setIsCreateOpen(true),
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
								// A successful create is followed by a switch to the new library and a
								// refreshed libraries list (see the hook) — this is the explicit close
								// that used to be moot when the flow ended in a page reload.
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
