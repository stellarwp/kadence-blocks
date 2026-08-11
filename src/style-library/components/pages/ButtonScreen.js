/**
 * The Button preset screen: self-registers for `kadence/singlebtn` on the preset-screens filter,
 * exactly as a third party would (`constants/screens.js`'s `PRESET_SCREENS_FILTER` docblock). A
 * header with a "+ Add Button" action over a `RowList` of preset rows, each showing a
 * live-rendered Button chip resolved from the preset's bound color and radius tokens.
 *
 * This is a bespoke screen, not a `ScaleScreen` config: a preset row carries a five-property map
 * with two states (Normal/Hover), not one scalar token value, so it composes the shared components
 * directly. Its settings panel is `ButtonSettings`, assigned below as `ButtonScreen.SettingsPanel`.
 */

/**
 * WordPress dependencies
 */
import { Button, Notice, Spinner } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../organisms/ScreenHeader';
import { RowList } from '../templates/RowList';
import { EmptyState } from '../molecules/EmptyState';
import { ButtonSettings } from './ButtonSettings';
import { useButtonScreen } from '../../hooks/use-button-screen';
import { useDraftChannel } from '../../hooks/use-draft-channel';
import { BUTTON_BLOCK, overlayPresetRows } from '../../helpers/presets';
import { PRESET_SCREENS_FILTER } from '../../constants/screens';
import './ButtonScreen.scss';

/**
 * The Button preset row's live preview chip: a non-interactive span reading "Button", styled from
 * the row's resolved background/text/radius. Hover values are never previewed here — a static chip
 * cannot honestly show `:hover`, the panel's Hover tab is the editing surface for that — and an
 * unresolved value renders the property absent rather than an invented fallback.
 *
 * @param {{id: string, label: string, preview: {background: string, color: string, borderRadius: string}}} row The row descriptor.
 *
 * @since TBD
 *
 * @return {JSX.Element} The preview element.
 */
function renderButtonPreview(row) {
	return (
		<span
			className="kadence-blocks-style-library__button-preset-preview"
			style={{
				background: row.preview.background || undefined,
				color: row.preview.color || undefined,
				borderRadius: row.preview.borderRadius || undefined,
			}}
		>
			{__('Button', 'kadence-blocks')}
		</span>
	);
}

/**
 * Render the Button screen body.
 *
 * @param {Object}   props          The component props.
 * @param {string}   props.label    The PHP-fed nav label ("Button").
 * @param {Object}   props.route    The current route (`{ screen, item }`).
 * @param {Function} props.navigate The route navigator.
 * @param {Object}   props.library  The design-tokens feed hook's return value.
 *
 * @since TBD
 *
 * @return {JSX.Element} The screen body.
 */
export function ButtonScreen({ label, route, navigate, library }) {
	const screen = useButtonScreen(library);
	const channel = useDraftChannel();

	// Guarded exactly like the scale mint (`ScaleScreen.js`): a dirty draft in the open panel
	// prompts before a new preset navigates it away.
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
			{__('Add Button', 'kadence-blocks')}
		</Button>
	);

	// Strictly keyed to the open route item — the `ScaleScreen.js` discipline — so a publication
	// from a panel editing a different preset (or one that already unmounted) can never leak onto
	// this screen's rows.
	const draft =
		channel && channel.publication && channel.publication.itemId === route.item ? channel.publication.draft : null;
	const rows = overlayPresetRows(screen.rows, route.item, draft, library?.values);

	const items = rows.map((row) => ({
		id: row.id,
		label: row.label,
		preview: renderButtonPreview(row),
		isDraggable: true,
	}));

	// Selecting the already-open preset is a no-op bypassing the guard entirely (the draft
	// survives — `useSettingsPanel` only re-seeds on itemId change), the `ScaleScreen.js` pattern.
	const selectPreset = (id) => {
		if (id === route.item) {
			return;
		}

		const run = () => navigate({ item: id });

		channel ? channel.guard(run) : run();
	};

	return (
		<div className="kadence-blocks-style-library__button-screen">
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
					empty={
						<EmptyState title={label} description={__('Add Button', 'kadence-blocks')} action={addAction} />
					}
				/>
			)}
		</div>
	);
}

ButtonScreen.SettingsPanel = ButtonSettings;

/**
 * Register the Button screen for `kadence/singlebtn` on the public preset-screens filter, exactly
 * as a third party would — the app never imports this component directly, so this module-scope
 * call is the only registration path. `resolveScreen` (`helpers/screens.js`) applies the filter on
 * every render, so a module-scope `addFilter` is race-free regardless of import order.
 *
 * @since TBD
 */
addFilter(PRESET_SCREENS_FILTER, 'kadence-blocks/style-library-button-screen', (screens) => ({
	...screens,
	[BUTTON_BLOCK]: ButtonScreen,
}));
