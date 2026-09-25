/**
 * The list screen any preset screen renders: the Add action, the load/add/reorder notices, the card
 * grid with drag-to-reorder, and the live overlay of the open panel's draft onto its card.
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
import { Button, Notice } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
import { plus } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../organisms/ScreenHeader';
import { DormantPresets } from '../organisms/DormantPresets';
import { PresetGrid } from '../templates/PresetGrid';
import { ScreenDescription } from '../molecules/ScreenDescription';
import { EmptyState } from '../molecules/EmptyState';
import { Skeleton } from '../atoms/Skeleton';
import { usePresetScreen } from '../../hooks/use-preset-screen';
import { useDraftChannel } from '../../hooks/use-draft-channel';
import { useLoadingAnnouncement } from '../../hooks/use-loading-announcement';
import { overlayPresetRows } from '../../helpers/presets';
import { pinDefaultFirst } from '../../helpers/preset-grid';
import { useBreakpoint } from '../../../token-controls/context/breakpoint';

const SKELETON_CARD_IDS = [0, 1, 2];

/**
 * The preset-grid loading placeholder: a few card-shaped skeletons in the real `PresetGrid` markup,
 * so the loading shape matches the cards it is about to be replaced by.
 *
 * @param {Object} props       The component props.
 * @param {string} props.label The screen's nav label, used to build the busy-region's accessible name.
 *
 * @since TBD
 *
 * @return {JSX.Element} The card-shaped skeleton grid.
 */
function PresetCardsSkeleton({ label }) {
	return (
		<ul
			className="kadence-blocks-style-library__preset-grid"
			role="status"
			aria-live="polite"
			aria-busy="true"
			aria-label={sprintf(
				// translators: %s: the preset screen's label (e.g. "Button").
				__('Loading %s…', 'kadence-blocks'),
				label
			)}
		>
			{SKELETON_CARD_IDS.map((id) => (
				<li key={id} className="kadence-blocks-style-library__preset-card">
					<div className="kadence-blocks-style-library__preset-card-main">
						<Skeleton className="kadence-blocks-style-library__preset-card-title kadence-blocks-style-library__skeleton--bar" />
						<Skeleton className="kadence-blocks-style-library__preset-card-preview" />
					</div>
				</li>
			))}
		</ul>
	);
}

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

	// The skeleton below lives inside its own `role="status"` region, which only announces "Loading
	// X…" while it is actually mounted — the moment it is replaced by the real list, that region is
	// gone too, and nothing is left to tell a screen reader the load finished.
	useLoadingAnnouncement(
		screen.isLoading,
		// translators: %s: the preset screen's label (e.g. "Button").
		sprintf(__('%s loaded.', 'kadence-blocks'), label)
	);

	const [isAdding, setIsAdding] = useState(false);

	// `createPresetFlow` (`helpers/preset-flows.js`) records the failure via `screen.addError` (the
	// Notice rendered below) and re-throws pessimistically for callers that need the rejection; this
	// `.catch()` only stops that rethrow from surfacing as an unhandled promise rejection, it does
	// not report the error a second time. Disabling the button is a UI guard, not a real one — a
	// stale click (e.g. a keyboard Enter racing the disabled-attribute repaint) could otherwise
	// still start a second create.
	const mintPreset = () => {
		if (screen.isBusy) {
			return Promise.resolve();
		}

		setIsAdding(true);

		return screen
			.addPreset()
			.then((id) => navigate({ item: id }))
			.catch(() => {})
			.finally(() => setIsAdding(false));
	};
	const addAction = (
		<Button
			icon={plus}
			variant="secondary"
			isBusy={isAdding}
			disabled={screen.isBusy}
			onClick={() => (channel ? channel.guard(mintPreset) : mintPreset())}
		>
			{isAdding ? __('Adding…', 'kadence-blocks') : preset.addLabel}
		</Button>
	);

	// Strictly keyed to the open route item — the `ScaleScreen.js` discipline — so a publication
	// from a panel editing a different preset (or one that already unmounted) can never leak onto
	// this screen's rows.
	const draft =
		channel && channel.publication && channel.publication.itemId === route.item ? channel.publication.draft : null;
	const [breakpoint] = useBreakpoint();
	const rows = overlayPresetRows(screen.rows, route.item, draft, library?.values, preset.preview, breakpoint);

	// Only the open card, and only while its panel's Hover tab is the one being edited: the chip
	// then holds the hover state without the pointer, so Hover-tab edits read back immediately.
	const isHoverDraft = Boolean(draft) && channel.publication.activeTab === 'hover';

	const items = rows.map((row) => ({
		id: row.id,
		label: row.label,
		isTheme: row.isTheme === true,
		preview: renderPreview(isHoverDraft && row.id === route.item ? { ...row, showHoverState: true } : row),
	}));

	const defaultId = screen.payload?.default ?? '';
	const hasDefault = rows.some((row) => row.id === defaultId);
	const reorderPresets = (order) => screen.reorderPresets(pinDefaultFirst(order, defaultId, hasDefault));

	const selectPreset = (id) => {
		if (id === route.item) {
			return;
		}

		const run = () => navigate({ item: id });

		channel ? channel.guard(run) : run();
	};

	return (
		<div className={`kadence-blocks-style-library__preset-screen ${className}`.trim()}>
			<ScreenHeader
				title={label}
				description={<ScreenDescription screenId={route.screen} />}
				primaryAction={addAction}
			/>
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
			{screen.dormantError && (
				<Notice status="error" isDismissible onRemove={screen.clearDormantError}>
					{screen.dormantError.message}
				</Notice>
			)}
			{screen.isLoading ? (
				<PresetCardsSkeleton label={label} />
			) : (
				<PresetGrid
					items={items}
					selectedId={route.item}
					defaultId={defaultId}
					onSelect={selectPreset}
					onReorder={reorderPresets}
					empty={<EmptyState title={label} description={preset.addLabel} action={addAction} />}
				/>
			)}
			{!screen.isLoading && (
				<DormantPresets
					dormant={screen.payload?.dormant}
					onKeep={screen.keepAsCustom}
					onDiscard={screen.discardDormant}
					isBusy={screen.isBusy}
				/>
			)}
		</div>
	);
}
