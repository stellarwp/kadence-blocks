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
 * @param {Object}        props               The component props.
 * @param {Array<Object>} props.libraries     The ordered library rows (`{ slug, title }`).
 * @param {string}        props.activeSlug    The active library slug.
 * @param {boolean}       props.isBusy        Whether a library operation is in flight.
 * @param {?{message: string}} props.error    The current library-operation error, if any.
 * @param {Function}      props.onSwitch      Called with a slug to switch the active library.
 * @param {Function}      props.onCreate      Called with a title to create a library.
 * @param {Function}      props.onClearError  Dismisses the current error.
 *
 * @since TBD
 *
 * @return {JSX.Element} The selector, and, while open, the create-library modal.
 */
export function LibrarySelector({ libraries, activeSlug, isBusy, error, onSwitch, onCreate, onClearError }) {
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	const options = libraries.map((library) => ({
		value: library.slug,
		label: libraryDisplayTitle(library),
	}));

	// A plain switch from the dropdown has no follow-up action waiting on its result — the
	// `error` state above already surfaces a failure, so the rejection `onSwitch`'s promise carries
	// (there for a caller that chains off it, e.g. the create flow) is swallowed here rather than
	// left unhandled.
	const handleSwitch = (slug) => {
		onSwitch(slug).catch(() => {});
	};

	return (
		<>
			<SelectDropdown
				value={activeSlug}
				options={options}
				// The slug alone is enough to name the active library correctly (see
				// libraryDisplayTitle) — this is what the toggle shows on first paint, before
				// `libraries` has loaded and any option can match `activeSlug`, so it never flashes
				// the raw slug while the list is in flight.
				valueLabel={libraryDisplayTitle({ slug: activeSlug, title: '' })}
				isBusy={isBusy}
				// Suppressed while the create modal is open — it shows the same error inline itself, so
				// surfacing it here too would display it twice.
				error={isCreateOpen ? null : error}
				onClearError={onClearError}
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
					error={error}
					onClose={() => {
						setIsCreateOpen(false);
						onClearError();
					}}
					onCreate={(title) =>
						onCreate(title)
							.then(() => {
								// A successful create is followed by a switch to the new library and a
								// refreshed libraries list (see the hook) — this is the explicit close
								// that used to be moot when the flow ended in a page reload.
								setIsCreateOpen(false);
								onClearError();
							})
							// Swallowed: a validation or request failure already lands in `error` via the
							// hook's setError, which the modal renders inline — nothing further to do
							// here beyond leaving the modal open.
							.catch(() => {})
					}
				/>
			)}
		</>
	);
}
