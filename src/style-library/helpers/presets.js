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
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { nextScaleSlug } from './scale';
import { getDesignTokensFeed } from './tokens';

/**
 * The block name the Button preset screen edits — the single JS spelling, so the preset-screens
 * filter registration, the fetch-and-bind hook, and any future preset screen reusing this contract
 * never risk a typo'd duplicate.
 *
 * @since TBD
 */
export const BUTTON_BLOCK = 'kadence/singlebtn';

/**
 * The button's bound property surface, in the order the panel and previews read it. Derived from
 * the localized feed (`feed.presets['kadence/singlebtn'].properties`, itself
 * `array_keys( $bindings->bindings )` off `declarations.php` — see
 * `Design_Tokens\Admin\Feed\Presets::all()`), so this app can never drift from the properties the
 * server's `guard_surface` accepts as bound. On the Style Library screen the feed is always
 * present — it is inline-scripted onto the page before this bundle runs (see
 * `Design_Tokens\Admin\Feed\Localizer`) — so a missing or empty surface here is a genuine bug, not
 * a normal condition. Throwing surfaces that bug immediately instead of letting every preset seed
 * and save silently no-op, which would be data loss with no error.
 *
 * @since TBD
 *
 * @throws {Error} When the feed has no non-empty `properties` array for the button block.
 *
 * @return {string[]} The button's bound property ids, in read order.
 */
export function getButtonPresetProperties() {
	const properties = getDesignTokensFeed()?.presets?.[BUTTON_BLOCK]?.properties;

	if (!Array.isArray(properties) || properties.length === 0) {
		throw new Error(
			`getButtonPresetProperties: feed.presets['${BUTTON_BLOCK}'].properties is missing or empty. Check the Design_Tokens\\Admin\\Feed\\Localizer output for this screen.`
		);
	}

	return properties;
}

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
		tokens: getButtonPresetProperties().reduce((acc, property) => {
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

/**
 * Overlay a live settings-panel draft onto the row it edits: the label and a preview re-resolved
 * from the draft's token map (bare ids), so the row chip always shows what Save would write instead
 * of waiting for it — the preset analog of `overlayDraft` (`helpers/scale.js`), same
 * reference-identity contract. Returns the exact same array reference for a `null`/absent draft or
 * an `itemId` matching no row; every non-matching row keeps its exact object identity either way.
 *
 * @param {Array<{id: string, label: string, preview: {background: string, color: string, borderRadius: string}}>} rows   The rows in payload order.
 * @param {string}                                                                                                   itemId The open route item id.
 * @param {?{label?: string, tokens?: Record<string, string>}}                                                      draft  The open panel's live draft, or null.
 * @param {Record<string, string>}                                                                                   values The feed's resolved value map.
 *
 * @since TBD
 *
 * @return {Array<Object>} The rows, with the matching row's label/preview overlaid.
 */
export function overlayPresetRows(rows, itemId, draft, values) {
	if (!draft || !itemId) {
		return rows;
	}

	const index = rows.findIndex((row) => row.id === itemId);

	if (index === -1) {
		return rows;
	}

	const overlaid = { ...rows[index] };

	if (Object.prototype.hasOwnProperty.call(draft, 'label')) {
		overlaid.label = draft.label;
	}

	if (draft.tokens) {
		const resolveDraftToken = (property) => resolveTokenValue(values, idToAlias(draft.tokens[property] ?? ''));

		overlaid.preview = {
			background: resolveDraftToken('button-bg'),
			color: resolveDraftToken('button-text'),
			borderRadius: resolveDraftToken('button-radius'),
		};
	}

	const next = [...rows];
	next[index] = overlaid;

	return next;
}

/**
 * Resolve the color a `token-color-select` field's swatch should paint for the current value: the
 * matching pickable option's own resolved value first (it already carries the active library's
 * literal), then a direct lookup in the feed's resolved value map for an id outside the pool, then
 * `''` (the caller renders that as transparent).
 *
 * @param {Array<{id: string, value: string}>} options The pickable color options (`pickableTokensForType('color')`).
 * @param {Record<string, string>}             values  The feed's resolved value map.
 * @param {string}                              id      The field's current value (a bare token id).
 *
 * @since TBD
 *
 * @return {string} The resolved swatch color, or `''` when unresolvable.
 */
export function resolveSwatchColor(options, values, id) {
	const match = (options ?? []).find((option) => option.id === id);

	if (match?.value) {
		return match.value;
	}

	return values?.[id] ?? '';
}

/**
 * The Button settings panel's per-tab schema: NAME renders on both tabs (the draft's `label` path
 * is shared), the Normal tab adds a Radius section, and the Hover tab never does — `button-radius`
 * has no hover counterpart, so rendering one there would write a property `guard_surface` rejects.
 *
 * @param {string} tab The active tab name (`'normal'` or `'hover'`).
 *
 * @since TBD
 *
 * @return {{panels: Array<Object>}} The settings-form schema for the active tab.
 */
export function buttonSettingsSchema(tab) {
	const namePanel = {
		id: 'name',
		fields: [{ type: 'text', path: 'label', label: __('Name', 'kadence-blocks') }],
	};

	const isHover = tab === 'hover';
	const textPath = isHover ? 'tokens.button-text-hover' : 'tokens.button-text';
	const bgPath = isHover ? 'tokens.button-bg-hover' : 'tokens.button-bg';

	const colorPanel = {
		id: 'color',
		title: __('Color', 'kadence-blocks'),
		fields: [
			{ type: 'token-color-select', path: textPath, label: __('Text', 'kadence-blocks') },
			{ type: 'token-color-select', path: bgPath, label: __('Background', 'kadence-blocks') },
		],
	};

	if (isHover) {
		return { panels: [namePanel, colorPanel] };
	}

	const radiusPanel = {
		id: 'radius',
		title: __('Radius', 'kadence-blocks'),
		fields: [
			{
				type: 'token-select',
				tokenType: 'dimension',
				role: 'radius',
				path: 'tokens.button-radius',
				label: __('Radius', 'kadence-blocks'),
			},
		],
	};

	return { panels: [namePanel, colorPanel, radiusPanel] };
}
