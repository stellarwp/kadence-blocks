/**
 * The Color Palette screen: the palette selector in the screen header and the swatch grid of the
 * current palette's effective view. Palette structure is read here and edited through the palette
 * flows (`helpers/palette-flows.js`) via `hooks/use-palettes.js`; this component never chooses a
 * write target itself, and — this phase — never writes at all: selecting a palette in the header
 * only opens it for viewing, and selecting a swatch only writes `?kb-item=` to the route.
 */

/**
 * WordPress dependencies
 */
import { useMemo } from '@wordpress/element';
import { Spinner } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * External dependencies
 */
import { colord } from 'colord';

/**
 * Internal dependencies
 */
import { ScreenHeader } from '../organisms/ScreenHeader';
import { SwatchGrid } from '../organisms/SwatchGrid';
import { SelectDropdown } from '../molecules/SelectDropdown';
import { EmptyState } from '../molecules/EmptyState';
import { usePalettes } from '../../hooks/use-palettes';
import { mapPaletteToSwatchGroups, paletteDisplayLabel } from '../../helpers/palettes';
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

	const options = useMemo(
		() => palettes.listing.palettes.map((row) => ({ value: row.id, label: paletteDisplayLabel(row) })),
		[palettes.listing.palettes]
	);

	const gridGroups = useMemo(
		() =>
			mapPaletteToSwatchGroups(palettes.palette).map((group) => ({
				...group,
				items: group.items.map((item) => ({
					...item,
					previewStyle: swatchPreviewStyle(item.value),
					// Reordering persists once the default-palette write lands; until then no drag handle
					// renders, so the grid reads as non-reorderable rather than lying.
					isDraggable: false,
				})),
			})),
		[palettes.palette]
	);

	return (
		<div className="kadence-blocks-style-library__color-palette-screen">
			<ScreenHeader
				title={label}
				inlineControl={
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
					/>
				}
				// The "Delete" destructive action and the "+ Add Color Group" primary action both depend
				// on write flows this phase deliberately excludes — both header slots stay empty rather
				// than render a button with nothing behind it.
			/>
			{palettes.isLoading ? (
				<Spinner />
			) : palettes.palette ? (
				<SwatchGrid
					groups={gridGroups}
					selectedId={route.item}
					onSelect={(token) => navigate({ item: token })}
					onAdd={() => {
						// @todo Style Library Color Palette mutations: wire the add-color flow.
					}}
					addLabel={__('Add color', 'kadence-blocks')}
				/>
			) : (
				<EmptyState
					title={palettes.openError?.message || __('This palette could not be loaded.', 'kadence-blocks')}
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
