/**
 * The Color Palette screen's settings panel: edits one swatch — its display name (a structure edit
 * written to the default palette) and its color (a granular value write on the palette being
 * edited) — and deletes it (also a structure edit, with a best-effort token cleanup after). Mounted
 * by the app when a swatch token is the open route item; see `ColorPaletteScreen.SettingsPanel`.
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
import { useLoadingAnnouncement } from '../../hooks/use-loading-announcement';
import { findSwatch, swatchInitialValues } from '../../helpers/palettes';
import { Skeleton } from '../atoms/Skeleton';

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

	// The skeleton below lives inside its own `role="status"` region, which only announces "Loading…"
	// while it is actually mounted — the moment it is replaced by the real panel, that region is
	// gone too, and nothing is left to tell a screen reader the load finished.
	useLoadingAnnouncement(Boolean(token && palettes.isLoading), __('Settings loaded.', 'kadence-blocks'));

	// Self-heal a stale item the same way the app's unknown-screen route does: a token that does not
	// resolve in the current palette's view (a leftover from another palette, or a hand-edited URL)
	// clears itself instead of rendering an empty panel forever. Waits for loading to settle so a
	// normal load-in-progress tick is never mistaken for a stale token.
	useEffect(() => {
		if (!palettes.isLoading && palettes.palette && !swatch) {
			navigate({ item: '' });
		}
	}, [palettes.isLoading, palettes.palette, swatch, navigate]);

	if (token && palettes.isLoading) {
		return (
			<div className="kadence-blocks-style-library__settings-panel" role="status" aria-busy="true">
				<Skeleton className="kadence-blocks-style-library__settings-panel-field" />
				<Skeleton className="kadence-blocks-style-library__settings-panel-field" />
			</div>
		);
	}

	if (!swatch) {
		return null;
	}

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
			// Renders for every swatch: what Delete removes is a palette row (user-editable document
			// data), not the token — `removeSwatch` decides internally whether the underlying token
			// is user-created and only then best-effort cleans it up (settled decision 8).
			onDelete={() =>
				palettes
					.removeSwatch(token)
					.then(() => navigate({ item: '' }))
					// Swallowed: a row-removal write failure already lands in `saveError`, rendered above.
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
