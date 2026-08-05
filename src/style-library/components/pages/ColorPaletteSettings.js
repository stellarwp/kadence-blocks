/**
 * The Color Palette screen's settings panel: edits one swatch — its display name (a structure edit
 * written to the default palette) and its color (a granular value write on the palette being
 * edited). Mounted by the app when a swatch token is the open route item; see
 * `ColorPaletteScreen.SettingsPanel`.
 */

/**
 * WordPress dependencies
 */
import { useEffect } from '@wordpress/element';
import { Notice } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { SettingsPanel } from '../templates/SettingsPanel';
import { SettingsForm } from '../organisms/SettingsForm';
import { usePalettes } from '../../hooks/use-palettes';
import { useSettingsPanel } from '../../hooks/use-settings-panel';
import { findSwatch, swatchInitialValues } from '../../helpers/palettes';

/**
 * The swatch panel's schema: a NAME text field and a color-only picker. `colorOnly: true` keeps the
 * Gradient tab unreachable from this screen — see `ColorGradientPicker`'s own docblock for why a
 * picked gradient string would otherwise persist.
 *
 * @since TBD
 */
const SWATCH_SETTINGS_SCHEMA = {
	fields: [
		{ type: 'text', path: 'label', label: __('Name', 'kadence-blocks') },
		{ type: 'color', path: 'value', label: __('Color', 'kadence-blocks'), colorOnly: true },
	],
};

/**
 * Render the Color Palette screen's settings panel.
 *
 * @param {Object}   props          The component props.
 * @param {Object}   props.route    The route from `useStyleLibraryRoute`.
 * @param {Function} props.navigate The route navigator.
 * @param {Object}   props.library  The design-tokens feed surface.
 *
 * @since TBD
 *
 * @return {?JSX.Element} The panel, or null while a stale item normalizes away.
 */
export function ColorPaletteSettings({ route, navigate, library }) {
	const palettes = usePalettes(library.feed, library.refreshFeed);
	const token = route.item;
	const swatch = findSwatch(palettes.palette, token);
	// null, not a computed empty object, while the palette itself hasn't loaded yet — the open item
	// is already known from the route on a cold load, before `usePalettes`'s fetch resolves, and
	// `useSettingsPanel` needs that distinction to seed the draft once real values arrive instead of
	// seeding empty at mount and never re-seeding. See that hook's own docblock for the contract.
	const initialValues = palettes.palette ? swatchInitialValues(palettes.palette, token) : null;
	const panel = useSettingsPanel({ route, navigate, initialValues });

	// Self-heal a stale item the same way the app's unknown-screen route does: a token that does not
	// resolve in the current palette's view (a leftover from another palette, or a hand-edited URL)
	// clears itself instead of rendering an empty panel forever. Waits for loading to settle so a
	// normal load-in-progress tick is never mistaken for a stale token.
	useEffect(() => {
		if (!palettes.isLoading && palettes.palette && !swatch) {
			navigate({ item: '' });
		}
	}, [palettes.isLoading, palettes.palette, swatch, navigate]);

	if (!swatch) {
		return null;
	}

	// Once a real seed has happened for this item, `useSettingsPanel` ignores every later
	// `initialValues` identity change (see that hook's own docblock) — so after a successful save,
	// the reload's fresh `initialValues` alone would not clear the draft. `resetDraft()` here is what
	// makes the panel read as clean again; on failure it is skipped, so the draft (and the Save
	// button) survive.
	const onSave = () =>
		palettes
			.saveSwatchEdits(token, panel.draft, initialValues)
			.then(() => panel.resetDraft())
			.catch(() => {});

	return (
		<SettingsPanel
			onClose={panel.close}
			onSave={onSave}
			onDelete={null /* swatch deletion ships with the default-palette write */}
			isDirty={panel.isDirty}
		>
			{palettes.saveError && (
				<Notice status="error" onRemove={palettes.clearSaveError}>
					{palettes.saveError.message}
				</Notice>
			)}
			<SettingsForm schema={SWATCH_SETTINGS_SCHEMA} values={panel.draft} onChange={panel.setFieldValue} />
		</SettingsPanel>
	);
}
