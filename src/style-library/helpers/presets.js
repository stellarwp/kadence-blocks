/**
 * Pure preset payload/row/slug helpers for the Button preset screen (and, unchanged, any preset
 * screen that reuses this contract): mapping a preset GET payload to row view models, the
 * alias<->id codec the preset write surface needs (presets store `{dot.path}` aliases, not bare
 * ids), resolving a stored token value (alias or literal) against the feed's resolved value map,
 * seeding a settings-panel draft, and minting the next free preset slug. No React, no JSX, no
 * REST — see `hooks/use-button-presets.js` for the state binding and `api/client.js` for the REST
 * wrappers this module's output feeds.
 */

/**
 * Internal dependencies
 */
import { nextScaleSlug } from './scale';

/**
 * The frozen bound surface a button preset defines, in the order the panel and previews read it.
 * The single JS spelling of the properties `declarations.php` binds for the button block — every
 * seed, save, and preview walk goes through this list, so this app can never write a property the
 * server's `guard_surface` would reject as unbound.
 *
 * @since TBD
 */
export const BUTTON_PRESET_PROPERTIES = [
	'button-bg',
	'button-text',
	'button-bg-hover',
	'button-text-hover',
	'button-radius',
];

/**
 * Convert a stored alias to its bare dot-path id. A value that is not brace-wrapped (a literal) is
 * returned verbatim.
 *
 * @param {string} value The stored token value, e.g. `'{semantic.color.action-primary}'`.
 *
 * @since TBD
 *
 * @return {string} The bare id, or the literal value unchanged.
 */
export function aliasToId(value) {
	if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
		return value;
	}

	return value.slice(1, -1);
}

/**
 * Whether a bare string is a token dot-path id rather than a literal value. Every registered
 * token id lives under one of the document's two roots (`primitive.*` or `semantic.*` — see the
 * baseline's top-level keys), which a raw literal (a color, a CSS dimension) never starts with,
 * even one that happens to contain a dot (e.g. `'0.5rem'`).
 *
 * @param {string} value The candidate value.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is shaped like a token id.
 */
function looksLikeTokenId(value) {
	return typeof value === 'string' && (value.startsWith('primitive.') || value.startsWith('semantic.'));
}

/**
 * Convert a bare dot-path id to its alias form for writing. A value already brace-wrapped, empty,
 * or not shaped like a token id (a literal color, dimension, etc.) is returned verbatim.
 *
 * @param {string} value A bare dot-path id, e.g. `'semantic.color.action-primary'`.
 *
 * @since TBD
 *
 * @return {string} The alias-wrapped value.
 */
export function idToAlias(value) {
	if (!looksLikeTokenId(value)) {
		return value;
	}

	return `{${value}}`;
}

/**
 * Resolve a stored preset token value against the feed's resolved value map: an alias resolves to
 * its target's resolved value, a literal is returned as-is, and an alias pointing at nothing
 * resolves to an empty string.
 *
 * @param {Record<string, string>} values The feed's resolved value map (`feed.values`).
 * @param {string}                 value  The stored token value (alias or literal).
 *
 * @since TBD
 *
 * @return {string} The resolved value, or `''` for a dangling alias.
 */
export function resolveTokenValue(values, value) {
	if (typeof value !== 'string' || !value.startsWith('{') || !value.endsWith('}')) {
		return value ?? '';
	}

	return values?.[aliasToId(value)] ?? '';
}

/**
 * Map a block's preset GET payload to the row view models a preset screen renders, in payload
 * order.
 *
 * `userCreated` is read fail-closed: a payload with no `userCreated` key (an older server) marks
 * every row baseline, mirroring `helpers/token-capabilities.js`'s fail-closed default.
 *
 * @param {{presets?: Record<string, {label?: string, tokens?: Record<string, string>}>, userCreated?: string[]}} payload The preset GET payload.
 * @param {Record<string, string>}                                                                                 values  The feed's resolved value map.
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string, userCreated: boolean, preview: {background: string, color: string, borderRadius: string}}>} The preset rows.
 */
export function presetRows(payload, values) {
	const presets = payload?.presets ?? {};
	const userCreated = Array.isArray(payload?.userCreated) ? payload.userCreated : [];

	return Object.entries(presets).map(([slug, preset]) => {
		const tokens = preset?.tokens ?? {};

		return {
			id: slug,
			label: preset?.label ?? slug,
			userCreated: userCreated.includes(slug),
			preview: {
				background: resolveTokenValue(values, tokens['button-bg']),
				color: resolveTokenValue(values, tokens['button-text']),
				borderRadius: resolveTokenValue(values, tokens['button-radius']),
			},
		};
	});
}

/**
 * Seed a settings-panel draft for one preset: its label and its bound properties as bare ids
 * (ready for a token picker), or `null` for an unknown slug — the `scaleInitialValues` null
 * contract a stale-open-item self-heal relies on.
 *
 * @param {{presets?: Record<string, {label?: string, tokens?: Record<string, string>}>}} payload The preset GET payload.
 * @param {string}                                                                        slug    The preset slug to seed.
 *
 * @since TBD
 *
 * @return {?{label: string, tokens: Record<string, string>}} The seeded draft, or null.
 */
export function presetInitialValues(payload, slug) {
	const preset = payload?.presets?.[slug];

	if (!preset) {
		return null;
	}

	const tokens = preset.tokens ?? {};

	return {
		label: preset.label ?? slug,
		tokens: BUTTON_PRESET_PROPERTIES.reduce((acc, property) => {
			acc[property] = aliasToId(tokens[property] ?? '');
			return acc;
		}, {}),
	};
}

/**
 * Build the write-side token map from a settings-panel draft: each present entry wrapped as an
 * alias (or passed through when already an alias or a literal). Only the keys present in the
 * draft are sent.
 *
 * @param {Record<string, string>} draftTokens The panel's draft token map (bare ids).
 *
 * @since TBD
 *
 * @return {Record<string, string>} The property => alias-or-literal map ready for the write.
 */
export function presetSaveTokens(draftTokens) {
	return Object.entries(draftTokens ?? {}).reduce((acc, [property, value]) => {
		acc[property] = idToAlias(value);
		return acc;
	}, {});
}

/**
 * Mint the first free preset slug for a new button preset: the bare base first, then the base
 * with a numeric suffix. Delegates to `nextScaleSlug` — a preset slug has no dots, so the
 * terminal-segment extraction that helper performs is the identity, and the collision semantics
 * (sanitize_key's lowercase fixed point) are the same for both.
 *
 * @param {string[]} existingSlugs The preset slugs already taken.
 * @param {string}   base          The slug stem, e.g. `'button'`.
 *
 * @since TBD
 *
 * @return {string} The first free slug.
 */
export function nextPresetSlug(existingSlugs, base) {
	return nextScaleSlug(existingSlugs, base);
}
