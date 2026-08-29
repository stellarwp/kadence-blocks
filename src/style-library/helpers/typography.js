// cspell:ignore Abril Fatface -- a Google font family named as a concrete example.
/**
 * The Typography screen's pure helpers: mapping the library's favorite families into the FONT
 * selector's options, reading a fluid font-size step's authored scalar out of its resolved
 * `clamp(...)` CSS, and the font-catalog capability (reading the page-load catalog global, matching
 * a catalog pick against a favorite, and deciding the contextual Add/Remove button's state). No
 * React, no JSX, no REST — see `components/pages/TypographyScreen.js` for where these plug into the
 * scale-screen contract and `helpers/font-flows.js` for the favorite write flows.
 *
 * A favorite is a plain catalog family name, not a token: nothing resolves through it and no CSS
 * variable is emitted for it. It only pins a family to the top of a font picker, here and in the
 * block editor, so a site is not searching a ~1,900-name catalog for the same face every time.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Strip a pair of wrapping quotes (single or double) from a font-family name, the same trimming a
 * browser applies when it renders a quoted family in a `font-family` list.
 *
 * @param {string} family A single family name, already trimmed of surrounding whitespace.
 *
 * @since TBD
 *
 * @return {string} The family name with a matching pair of wrapping quotes removed, or the input
 *         verbatim when it carries none.
 */
function unquoteFamily(family) {
	const match = family.match(/^(["'])(.*)\1$/);

	return match ? match[2] : family;
}

/**
 * Map the feed's stored favorite families to the FONT selector's options, in stored order.
 *
 * `id` is the family name itself. A favorite has no token id to key on — there is nothing in the
 * registry to point at — and the family name is already unique within the list, so it doubles as
 * the option's identity. `stack` is the family quoted when it needs to be, which is what a preview
 * assigns to `font-family`; no generic fallback is invented, since the shipped font arrays carry no
 * category data and guessing one would put the wrong face behind a failed load.
 *
 * @param {{ favoriteFonts?: string[] }} feed The design-tokens feed.
 *
 * @since TBD
 *
 * Blank and duplicate entries are dropped. The store already trims and deduplicates on exact
 * strings, but it compares before unquoting: `Inter` and `\"Inter\"` are two entries there and one
 * font here, and both would otherwise render as separate pinned rows.
 *
 * @return {Array<{id: string, label: string, stack: string}>} The font options, or `[]` when the
 *         library has no favorites.
 */
export function fontOptions(feed) {
	const favorites = feed?.favoriteFonts;

	if (!Array.isArray(favorites)) {
		return [];
	}

	const seen = new Set();

	return favorites.reduce((options, family) => {
		if (typeof family !== 'string') {
			return options;
		}

		const label = unquoteFamily(family.trim()).trim();
		// Matched the way `findFontByFamily` matches, so a name that would select an existing option
		// never renders as a second one.
		const key = label.toLowerCase();

		if (label === '' || seen.has(key)) {
			return options;
		}

		seen.add(key);
		options.push({ id: label, label, stack: familyStack(label) });

		return options;
	}, []);
}

/**
 * The `font-family` CSS value for a single family: quoted when the name carries whitespace or a
 * quote, bare otherwise. No generic fallback is appended — the shipped font arrays carry no category
 * data, so guessing one would put the wrong face behind a failed load.
 *
 * Shared because the preview has to render a family the site has NOT kept just as faithfully as
 * one it has; deriving the stack only inside `fontOptions()` is what left every non-favorite pick
 * with no preview at all.
 *
 * @param {string} family A single family name, already unquoted and trimmed.
 *
 * @since TBD
 *
 * @return {string} The `font-family` value.
 */
export function familyStack(family) {
	const name = unquoteFamily(String(family ?? '').trim());

	if (name === '') {
		return '';
	}

	return /[\s"']/.test(name) ? `"${name.replace(/"/g, '\\"')}"` : name;
}

/**
 * The shipped clamp bodies (`baseline.json`'s `Font Size` primitives) contain no nested
 * parentheses, so splitting `clamp(...)`'s inner argument list on top-level commas is safe without
 * a full CSS parser.
 *
 * @since TBD
 */
const CLAMP_PATTERN = /^clamp\((.*)\)$/;

/**
 * Read the authored scalar out of a fluid font-size step's resolved value. Every shipped `Font
 * Size` baseline entry authors its scalar `$value` as the clamp's own `max` argument, so the max IS
 * the value a size chip or a SIZE field should show — the resolved `clamp(...)` string is correct
 * CSS for the sample text but wrong for either of those.
 *
 * @param {string} value The feed's resolved value for a font-size token, a plain dimension or a
 *                        `clamp(min, preferred, max)` string.
 *
 * @since TBD
 *
 * @return {string} The clamp's `max` argument for a `clamp(...)` string, or the value verbatim for
 *         a plain dimension, an empty string, or a `clamp(...)` string this parses no further than
 *         three top-level arguments (the honest fallback).
 */
export function fontSizeDisplayValue(value) {
	if (typeof value !== 'string') {
		return value;
	}

	const match = value.trim().match(CLAMP_PATTERN);

	if (!match) {
		return value;
	}

	const args = match[1].split(',').map((arg) => arg.trim());

	return args.length === 3 ? args[2] : value;
}

/**
 * Read the page-load font catalog global the Localizer emits (Google font names plus site custom
 * fonts). Fail-safe on a missing/malformed global, mirroring `getDesignTokensFeed()`'s posture —
 * a caller never has to null-check before using either list.
 *
 * @since TBD
 *
 * @return {{google: string[], custom: string[], weights: Record<string, string[]>}} The catalog, or
 *         two empty lists and an empty weight map when unavailable.
 */
export function getFontCatalog() {
	const catalog = window.kadenceDesignTokensFontCatalog;

	return {
		google: Array.isArray(catalog?.google) ? catalog.google : [],
		custom: Array.isArray(catalog?.custom) ? catalog.custom : [],
		weights: catalog?.weights && typeof catalog.weights === 'object' ? catalog.weights : {},
	};
}

/**
 * The font-family picker's full option list: the library's favorites first, then every Google family,
 * then every site-registered custom family.
 *
 * Favorites lead and carry a badge, so the faces a site has kept sit at the top of a list otherwise
 * nearly two thousand names long. Every name appears exactly once, matched case-insensitively across
 * all three sources — the custom list is diffed against the Google one server-side by exact string, so
 * a theme registering `inter` alongside Google's `Inter` reaches here as two names for one font.
 *
 * This mirrors the editor's own `fontCatalogOptions()`, which builds the same list from editor globals
 * that do not exist on this page. The theme's "inherit heading/body font" rows are deliberately absent:
 * they resolve through custom properties the block editor's canvas carries, and a preset storing one
 * would name a variable rather than a face.
 *
 * @param {{ favoriteFonts?: string[] }} feed The design-tokens feed.
 *
 * @since TBD
 *
 * @return {Array<{value: string, label: string, badge?: string}>} The option list.
 */
export function fontCatalogOptions(feed) {
	const seen = new Set();
	const unique = (name) => {
		const key = unquoteFamily(String(name ?? '').trim()).toLowerCase();

		if (key === '' || seen.has(key)) {
			return false;
		}

		seen.add(key);

		return true;
	};

	const { google, custom } = getFontCatalog();

	return [
		...fontOptions(feed)
			.map((font) => font.label)
			.filter(unique)
			.map((name) => ({ value: name, label: name, badge: __('Favorite', 'kadence-blocks') })),
		...google.filter(unique).map((name) => ({ value: name, label: name })),
		...custom.filter(unique).map((name) => ({ value: name, label: name, badge: __('Custom', 'kadence-blocks') })),
	];
}

/**
 * The weights a family actually ships, or `null` when the catalog knows nothing about it.
 *
 * `null` and `[]` mean different things and the caller needs both: a custom font contributes no weight
 * data at all (the custom-fonts filter carries none), while a Google family the catalog does know is
 * always listed with at least one weight. A control offering 100-900 for every family promises faces
 * most families do not ship -- Abril Fatface ships only 400 -- and the browser answers with a
 * synthesized approximation rather than the design system's own type.
 *
 * Matched case-insensitively and ignoring wrapping quotes, the way `findFontByFamily` matches, so a
 * stored `"Abril Fatface"` finds the catalog's `Abril Fatface`.
 *
 * @param {string} family The family name.
 *
 * @since TBD
 *
 * @return {?string[]} The family's weights, or null when the catalog does not know it.
 */
export function fontWeightsFor(family) {
	const name = unquoteFamily(String(family ?? '').trim()).toLowerCase();

	if (name === '') {
		return null;
	}

	const { weights } = getFontCatalog();
	const match = Object.keys(weights).find((key) => unquoteFamily(key.trim()).toLowerCase() === name);

	return match ? weights[match] : null;
}

/**
 * Whether a family still offers a weight, which is what decides if an already-stored weight survives
 * a change of family.
 *
 * A family the catalog does not know narrows nothing -- the theme's own font and a site-registered
 * custom face both keep the full 100-900 range -- so every weight stands. So does the empty value,
 * which is the Default option rather than a weight.
 *
 * @param {string} family The family to check against.
 * @param {*}      weight The stored weight.
 *
 * @since TBD
 *
 * @return {boolean} True when `family` can still render `weight`.
 */
export function shipsFontWeight(family, weight) {
	const weights = fontWeightsFor(family);

	if (weights === null || weight === '' || weight === null || weight === undefined) {
		return true;
	}

	return weights.some((shipped) => String(shipped) === String(weight));
}

/**
 * Find the favorite (a `fontOptions()` entry) whose family matches a catalog family name,
 * case-insensitively and ignoring wrapping quotes on either side.
 *
 * @param {Array<{id: string, label: string}>} fonts The library's favorites (`fontOptions()`).
 * @param {string}                              name  The catalog family name to match.
 *
 * @since TBD
 *
 * @return {?{id: string, label: string}} The matching favorite, or `null` when none matches.
 */
export function findFontByFamily(fonts, name) {
	const needle = unquoteFamily(String(name ?? '').trim()).toLowerCase();

	return fonts.find((font) => unquoteFamily(String(font.label ?? '').trim()).toLowerCase() === needle) ?? null;
}

/**
 * Decide the FONT dropdown's contextual button state for a catalog pick: `'add'` when the pick is
 * not yet a favorite, `'remove'` when it already is.
 *
 * Neither is ever disabled for a real pick. Unlike the token model this replaces, there is no
 * shipped-and-therefore-undeletable entry: every favorite was put there by a person, so every
 * favorite can be taken back out. Only an empty dropdown disables the button, since there is
 * nothing to add.
 *
 * @param {Array<{id: string, label: string}>} fonts The library's favorites (`fontOptions()`).
 * @param {string}                              name  The catalog family name currently shown in the
 *                                                    dropdown.
 *
 * @since TBD
 *
 * @return {{type: ('add'|'remove'), disabled: boolean, font: ?Object}} The button state.
 */
export function fontActionFor(fonts, name) {
	const match = findFontByFamily(fonts, name);

	if (!match) {
		return { type: 'add', disabled: String(name ?? '').trim() === '', font: null };
	}

	return { type: 'remove', disabled: false, font: match };
}
