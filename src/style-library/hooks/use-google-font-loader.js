/**
 * Resolves the currently previewed font, so the Typography screen's sample text renders in the real
 * face instead of the `system-ui` fallback. Nothing else on the Style Library page loads font files.
 *
 * Returns the family only once it is actually usable. The sample renders from that, not from the
 * selection, so switching fonts holds the previous face until the new one can be painted rather than
 * flashing the fallback in between — the same wait the block editor's picker makes, through the same
 * shared helper.
 *
 * System families (e.g. Georgia, Menlo) are not in the Google catalog and are never fetched: they are
 * already present, so they resolve as ready immediately. Custom fonts are not fetched either — the
 * names-only custom-fonts filter carries no file URLs, so loading them is the custom-font provider's
 * job, and a custom preview renders correctly only when the site already loads those files in
 * wp-admin.
 */

/**
 * WordPress dependencies
 */
import { useEffect, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { googleFontHref, loadFontFamily } from '../../token-controls';
import { getFontCatalog } from '../helpers/typography';

/**
 * Wait for a family to become usable, and report which one the page may render in.
 *
 * @param {string} familyName The selected font's family (`fontOptions()`'s `label`), or an empty
 *                             string when nothing is selected yet.
 *
 * @since TBD
 *
 * @return {{readyFamily: string, isLoading: boolean}} The family safe to render in, and whether a
 *         different one is still being fetched.
 */
export function useGoogleFontLoader(familyName) {
	const [readyFamily, setReadyFamily] = useState('');

	useEffect(() => {
		if (!familyName) {
			setReadyFamily('');

			return;
		}

		let current = true;
		const { google } = getFontCatalog();
		const href = google.includes(familyName) ? googleFontHref(familyName) : null;

		loadFontFamily(familyName, { href }).then(() => {
			// A faster switch while this one was in flight already owns the preview; resolving late
			// must not drag it back to the font the user has since moved off.
			if (current) {
				setReadyFamily(familyName);
			}
		});

		return () => {
			current = false;
		};
	}, [familyName]);

	return { readyFamily, isLoading: Boolean(familyName) && readyFamily !== familyName };
}
