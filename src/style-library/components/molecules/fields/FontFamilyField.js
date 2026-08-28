// cspell:ignore Fatface -- a Google font family named as a concrete example.
/**
 * The Style Library's adapter for `src/token-controls`' `FontFamilySelector` — the same tabbed picker
 * the block editor mounts through the shared typography control's seam, so a family is chosen the same
 * way in both places.
 *
 * The value is a plain family string, not a token reference: the font catalog is a list of real faces
 * rather than a token scale, so there is nothing to alias to. That is why this field speaks none of the
 * alias/id codec `BoxTokenField` and friends do.
 *
 * The editor's own listener builds its option list from editor globals (`kadence_blocks_params`'s
 * Google names, `kadenceDesignTokensFonts`). Those do not exist on this page, so the list is built
 * here from the Style Library's own feed and catalog instead — the same names in the same order,
 * reached through different globals.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { FontFamilySelector, googleFontHref, loadFontFamily } from '../../../../token-controls';
import { fontCatalogOptions, fontOptions, getFontCatalog } from '../../../helpers/typography';
import { getDesignTokensFeed } from '../../../helpers/tokens';
import { useGoogleFontLoader } from '../../../hooks/use-google-font-loader';
import { FieldLabel } from './FieldLabel';

/**
 * Fetch a family's web font, resolving once it is usable.
 *
 * Google membership is decided by the catalog exactly as `useGoogleFontLoader` decides it, so the two
 * paths agree on which families need a stylesheet: a system face and a site-registered custom font are
 * already in the document, and asking Google for either returns a 400 for a font the browser could
 * have painted all along.
 *
 * @param {string} family The family to load.
 *
 * @since TBD
 *
 * @return {Promise} Resolves when the font is usable, or immediately when there is nothing to fetch.
 */
function loadPickedFamily(family) {
	const { google } = getFontCatalog();

	return loadFontFamily(family, { href: google.includes(family) ? googleFontHref(family) : null });
}

/**
 * Render a font-family field from a settings schema entry.
 *
 * A pick WAITS for its web font before writing, matching the editor's listener: the preview switches
 * straight from the old face to the new one instead of flashing a fallback in between, and the field
 * shows the pending family with a spinner meanwhile — `FontFamilySelector` reads a promise-returning
 * `onPick` for exactly this. `loadFontFamily` bounds its own wait, so a font that never arrives still
 * writes rather than leaving the field stuck.
 *
 * @param {Object}   props                   The component props.
 * @param {Object}   props.field                The field definition.
 * @param {?string}  [props.field.label]        The control's label.
 * @param {?Array}   [props.field.favorites]    The library's favorite families. Supplied by a schema
 *                                              with the live feed in hand, so a favorite added on
 *                                              another screen is selectable without a reload; falls
 *                                              back to the page-load global when absent.
 * @param {?Array}   [props.field.catalogOptions] The full option list, on the same terms.
 * @param {?string}  [props.field.inherited] What an unset family falls back to, named on the muted trigger.
 * @param {boolean}  [props.field.readOnly]  Whether the control is non-interactive.
 * @param {string}   props.value             The stored family, or `''` when unset.
 * @param {Function} props.onChange          Called with the chosen family; never called when read-only.
 *
 * @since TBD
 *
 * @return {JSX.Element} The field.
 */
export function FontFamilyField({ field, value, onChange }) {
	// Loads whatever is currently stored, so the row preview and the trigger render in the real face
	// rather than a fallback. A family already present in the document (a system or custom face) is a
	// no-op for the hook.
	useGoogleFontLoader(value);

	const feed = getDesignTokensFeed();

	return (
		<div className="kadence-blocks-style-library__field kadence-blocks-style-library__field--font-family">
			{field.label && <FieldLabel>{field.label}</FieldLabel>}
			<FontFamilySelector
				value={value ?? ''}
				favorites={field.favorites ?? fontOptions(feed).map((font) => font.label)}
				catalogOptions={field.catalogOptions ?? fontCatalogOptions(feed)}
				inheritedLabel={field.inherited ?? __('Theme Font', 'kadence-blocks')}
				onPick={async (family) => {
					if (field.readOnly) {
						return;
					}

					await loadPickedFamily(family);

					onChange(family);
				}}
				onClear={() => !field.readOnly && onChange('')}
				disabled={field.readOnly}
			/>
		</div>
	);
}
