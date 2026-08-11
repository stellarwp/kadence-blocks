/**
 * The Button preset screen: self-registers for `kadence/singlebtn` on the preset-screens filter,
 * exactly as a third party would (`constants/screens.js`'s `PRESET_SCREENS_FILTER` docblock). A
 * header with a (for now inert) "+ Add Button" action over a `RowList` of preset rows, each showing
 * a live-rendered Button chip resolved from the preset's bound color and radius tokens.
 *
 * This is a bespoke screen, not a `ScaleScreen` config: a preset row carries a five-property map
 * with two states (Normal/Hover), not one scalar token value, so it composes the shared components
 * directly. No settings panel yet — the static lands once the panel exists.
 */

/**
 * WordPress dependencies
 */
import { Button, Notice } from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { addFilter } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../organisms/ScreenHeader';
import { RowList } from '../templates/RowList';
import { EmptyState } from '../molecules/EmptyState';
import { useButtonPresets } from '../../hooks/use-button-presets';
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
	const presets = useButtonPresets(library);
	const channel = useDraftChannel();

	// Disabled with no handler until the mutations flow lands (decision 11): visible intent, not a
	// hidden affordance.
	const addAction = (
		<Button icon={plus} variant="secondary" disabled>
			{__('Add Button', 'kadence-blocks')}
		</Button>
	);

	// Strictly keyed to the open route item — the `ScaleScreen.js` discipline — so a publication
	// from a panel editing a different preset (or one that already unmounted) can never leak onto
	// this screen's rows.
	const draft =
		channel && channel.publication && channel.publication.itemId === route.item ? channel.publication.draft : null;
	const rows = overlayPresetRows(presets.rows, route.item, draft, library?.values);

	const items = rows.map((row) => ({
		id: row.id,
		label: row.label,
		preview: renderButtonPreview(row),
		isDraggable: false,
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
			{presets.loadError && (
				<Notice status="error" isDismissible={false}>
					{presets.loadError.message}
				</Notice>
			)}
			<RowList
				items={items}
				selectedId={route.item}
				onSelect={selectPreset}
				onReorder={() => {}}
				empty={<EmptyState title={label} description={__('Add Button', 'kadence-blocks')} action={addAction} />}
			/>
		</div>
	);
}

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
