/**
 * The Color Palette screen's settings panel: edits one swatch — its display name (a structure edit
 * written to the default palette) and its color (a granular value write on the palette being
 * edited) — and offers the matching undo. Mounted by the app when a swatch token is the open route
 * item; see `ColorPaletteScreen.SettingsPanel`.
 *
 * The undo is Reset or Delete depending on where the swatch came from, mirroring the split
 * `ColorPaletteScreen` already makes at palette scope. A swatch the shipped palette defines has a
 * permanent row, so its action only undoes this palette's value for it; a user-added swatch has no
 * shipped value behind it, so its row is removed outright (a structure edit, with a best-effort
 * token cleanup after).
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
		{ type: 'color', path: 'value', colorOnly: true },
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
	// Same `route`/`navigate` threading as `ColorPaletteScreen` — this instance never opens a
	// palette itself, but it must derive `editingId` from the SAME `route.scope` the screen writes,
	// or it independently falls back to `$current` and edits the wrong palette (see
	// `usePalettes`'s own docblock for the bug this closes).
	const palettes = usePalettes(library.feed, library.refreshFeed, route, navigate);
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

	const isBaseline = palettes.isBaselineSwatch(token);

	// Deliberately does NOT call `panel.resetDraft()` on success. `resetDraft` closes over
	// `initialValues` from the render it was created in — by the time this promise resolves, that
	// closure is the PRE-save values, so calling it would silently revert the panel to what the
	// user just replaced (confirmed: the write itself lands correctly; only the UI would regress).
	// Leaving the draft alone is enough: it already holds exactly what was saved, so the picker
	// keeps showing it, and once `saveSwatchEdits`'s `reload()` refreshes `palettes.palette`, the
	// next render's `initialValues` recomputes to the same values, `computeIsDirty` sees them as
	// equal, and the Save button disables itself — no reset step required. On failure the draft
	// (and the Save button) simply survive, which is what we want anyway.
	const onSave = () => palettes.saveSwatchEdits(token, panel.draft, initialValues).catch(() => {});

	return (
		<SettingsPanel
			onClose={panel.close}
			onSave={onSave}
			// Renders for every swatch, but means two different things. For a swatch the shipped palette
			// defines it is a RESET — the row is permanent, and the action only undoes this palette's
			// value for it (to the shipped color on the default palette, to inherited elsewhere) — so it
			// is offered only when there is something to undo. For a user-added swatch it is the DELETE
			// of a palette row (user-editable document data, not the token); `removeSwatch` routes
			// between the two and, for a delete, decides internally whether the underlying token is
			// user-created and only then best-effort cleans it up (settled decision 8).
			isReset={isBaseline}
			isDeleteDisabled={isBaseline && !swatch.overridden}
			onDelete={() =>
				palettes
					.removeSwatch(token)
					// A reset keeps the row, so the panel stays open on it; only a delete leaves nothing
					// behind to show.
					.then(() => {
						if (!isBaseline) {
							navigate({ item: '' });
						}
					})
					// Swallowed: the write failure already lands in `saveError`, rendered above.
					.catch(() => {})
			}
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
