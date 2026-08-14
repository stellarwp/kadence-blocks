/**
 * The list screen any preset screen renders: the Add action, the load/add/reorder notices, the row
 * list with drag-to-reorder, and the live overlay of the open panel's draft onto its row.
 *
 * Nothing here knows which block it is editing. A per-block page supplies the config and a row
 * preview renderer; see `src/style-library/README.md`.
 *
 * Every navigation out of a dirty draft goes through the draft channel's guard — minting a preset,
 * and selecting a different one. Selecting the already-open preset deliberately bypasses it: the
 * draft survives (`useSettingsPanel` only re-seeds on an `itemId` change), so prompting would ask
 * about a change nothing is discarding.
 */

/**
 * WordPress dependencies
 */
import { Button, Notice, Spinner } from '@wordpress/components';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../organisms/ScreenHeader';
import { RowList } from '../templates/RowList';
import { EmptyState } from '../molecules/EmptyState';
import { usePresetScreen } from '../../hooks/use-preset-screen';
import { useDraftChannel } from '../../hooks/use-draft-channel';
import { overlayPresetRows } from '../../helpers/presets';

/**
 * Render a preset list screen for whichever block the config names.
 *
 * @param {Object}   props               The component props.
 * @param {string}   props.label         The PHP-fed nav label, used as the screen title.
 * @param {Object}   props.route         The current route (`{ screen, item }`).
 * @param {Function} props.navigate      The route navigator.
 * @param {Object}   props.library       The design-tokens feed hook's return value.
 * @param {Object}   props.preset        The block's preset config (`presets/<block>-preset.js`),
 *                                       read for its label, preview builders and root class.
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function PresetScreen({ label, route, navigate, library, preset }) {
	const { renderPreview, className = '' } = preset;
	const screen = usePresetScreen(library, preset);
	const channel = useDraftChannel();

	// `createPresetFlow` (`helpers/preset-flows.js`) records the failure via `screen.addError` (the
	// Notice rendered below) and re-throws pessimistically for callers that need the rejection; this
	// `.catch()` only stops that rethrow from surfacing as an unhandled promise rejection, it does
	// not report the error a second time.
	const mintPreset = () =>
		screen
			.addPreset()
			.then((id) => navigate({ item: id }))
			.catch(() => {});
	const addAction = (
		<Button
			icon={plus}
			variant="secondary"
			disabled={screen.isBusy}
			onClick={() => (channel ? channel.guard(mintPreset) : mintPreset())}
		>
			{preset.addLabel}
		</Button>
	);

	// Strictly keyed to the open route item — the `ScaleScreen.js` discipline — so a publication
	// from a panel editing a different preset (or one that already unmounted) can never leak onto
	// this screen's rows.
	const draft =
		channel && channel.publication && channel.publication.itemId === route.item ? channel.publication.draft : null;
	const rows = overlayPresetRows(screen.rows, route.item, draft, library?.values, preset.preview);

	const items = rows.map((row) => ({
		id: row.id,
		label: row.label,
		preview: renderPreview(row),
		isDraggable: true,
	}));

	const selectPreset = (id) => {
		if (id === route.item) {
			return;
		}

		const run = () => navigate({ item: id });

		channel ? channel.guard(run) : run();
	};

	return (
		<div className={`kadence-blocks-style-library__preset-screen ${className}`.trim()}>
			<ScreenHeader title={label} primaryAction={addAction} />
			{screen.loadError && (
				<Notice status="error" isDismissible={false}>
					{screen.loadError.message}
				</Notice>
			)}
			{screen.addError && (
				<Notice status="error" isDismissible onRemove={screen.clearAddError}>
					{screen.addError.message}
				</Notice>
			)}
			{screen.orderError && (
				<Notice status="error" isDismissible onRemove={screen.clearOrderError}>
					{screen.orderError.message}
				</Notice>
			)}
			{screen.isLoading ? (
				<Spinner />
			) : (
				<RowList
					items={items}
					selectedId={route.item}
					onSelect={selectPreset}
					onReorder={screen.reorderPresets}
					empty={<EmptyState title={label} description={preset.addLabel} action={addAction} />}
				/>
			)}
		</div>
	);
}
