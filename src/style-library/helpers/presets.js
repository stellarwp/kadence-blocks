/**
 * Pure preset payload/row/slug helpers for the Button preset screen (and, unchanged, any preset
 * screen that reuses this contract): mapping a preset GET payload to row view models, the
 * alias<->id codec the preset write surface needs (presets store `{dot.path}` aliases, not bare
 * ids), resolving a stored token value (alias or literal) against the feed's resolved value map,
 * seeding a settings-panel draft, and minting the next free preset slug. No React, no JSX, no
 * REST — see `hooks/use-presets.js` for the state binding and `api/client.js` for the REST
 * wrappers this module's output feeds.
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { isEqual } from './settings-schema';
import {
	isPresetEnvelope,
	PRESET_BREAKPOINTS,
	readPresetBreakpoint,
	resolvePresetBreakpoint,
	writePresetBreakpoint,
} from '../../token-controls/helpers/preset-envelope';
import { nextScaleSlug } from './scale';
import { getDesignTokensFeed } from './tokens';

/**
 * The number of corners a per-corner slot list carries (top-left, top-right, bottom-right,
 * bottom-left) — the sibling per-corner-values work's `Dtcg_Validator::SLOT_LIST_SIDES`.
 *
 * @since TBD
 */
const SLOT_LIST_SIDES = 4;

/**
 * The block name the Button preset screen edits — the single JS spelling, so the preset-screens
 * filter registration, the fetch-and-bind hook, and any future preset screen reusing this contract
 * never risk a typo'd duplicate.
 *
 * @since TBD
 */
export const BUTTON_BLOCK = 'kadence/singlebtn';

/**
 * A block's bound property surface, in the order its panel and previews read it. Derived from the
 * localized feed (`feed.presets[<block>].properties`, itself `array_keys( $bindings->bindings )` off
 * `declarations.php` — see `Design_Tokens\Admin\Feed\Presets::all()`), so this app can never drift from
 * the properties the server's `guard_surface` accepts as bound. On the Style Library screen the feed is
 * always present — it is inline-scripted onto the page before this bundle runs (see
 * `Design_Tokens\Admin\Feed\Localizer`) — so a missing or empty surface here is a genuine bug, not a
 * normal condition. Throwing surfaces that bug immediately instead of letting every preset seed and save
 * silently no-op, which would be data loss with no error.
 *
 * @param {string} block The block name whose surface to read.
 *
 * @since TBD
 *
 * @throws {Error} When the feed has no non-empty `properties` array for that block.
 *
 * @return {string[]} The block's bound property ids, in read order.
 */
export function getPresetProperties(block) {
	const properties = getDesignTokensFeed()?.presets?.[block]?.properties;

	if (!Array.isArray(properties) || properties.length === 0) {
		throw new Error(
			`getPresetProperties: feed.presets['${block}'].properties is missing or empty. Check the Design_Tokens\\Admin\\Feed\\Localizer output for this screen.`
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
 * Whether a stored preset token entry is a per-corner slot list: exactly four entries, each
 * independently an alias or a literal.
 *
 * @param {*} value The stored token entry.
 *
 * @since TBD
 *
 * @return {boolean} True when `value` is a per-corner slot list.
 */
function isSlotList(value) {
	return Array.isArray(value) && value.length === SLOT_LIST_SIDES;
}

/**
 * Whether a stored preset token entry is one of the shapes the single-value token picker cannot
 * represent — a responsive envelope or a per-corner slot list. Both carry more than the picker's
 * one alias-or-literal slot, so editing them through it would silently flatten the value on save;
 * callers use this to render the field read-only instead.
 *
 * @param {*} value The stored (or draft-seeded) token entry.
 *
 * @since TBD
 *
 * @return {boolean} True when `value` is non-scalar.
 */
export function isNonScalarPresetValue(value) {
	return isPresetEnvelope(value) || isSlotList(value);
}

/**
 * Resolve a stored preset token value against the feed's resolved value map, tolerant of every
 * shape a preset property's value can carry: a bare alias or literal (unchanged from the original
 * contract), a responsive envelope (resolved at `breakpoint`, stepping down the cascade to whatever is
 * actually in effect there), or
 * a per-corner slot list (each corner resolved independently and joined with a space, the CSS
 * `border-radius` shorthand order). Anything else unresolvable degrades to `''` rather than a
 * stringified object or array.
 *
 * `breakpoint` is what lets a row preview show what the user is actually looking at: switching the
 * panel to Tablet has to re-render the chip with the tablet override, not keep showing desktop.
 *
 * @param {Record<string, string>} values       The feed's resolved value map (`feed.values`).
 * @param {*}                      value        The stored token entry (alias, literal, envelope, or
 *                                              slot list).
 * @param {string}                 [breakpoint] The breakpoint to resolve at; defaults to desktop.
 *
 * @since TBD
 *
 * @return {string} The resolved value, or `''` when unresolvable.
 */
export function resolveTokenValue(values, value, breakpoint = PRESET_BREAKPOINTS[0]) {
	if (isPresetEnvelope(value)) {
		// Stepped, not flat: an unset mobile renders the tablet value and only falls through to desktop
		// when tablet is unset too, because the projected tablet media query covers mobile widths.
		return resolveTokenValue(values, resolvePresetBreakpoint(value, breakpoint), breakpoint);
	}

	if (isSlotList(value)) {
		const slots = value.map((slot) =>
			typeof slot === 'string' ? resolveTokenValue(values, slot, breakpoint) : ''
		);

		// All four slots or none: joining a partial resolution emits a valid-looking shorthand
		// (`1rem  1rem 1rem`) that silently renders a different radius than the one stored, which is
		// worse than the empty fallback every other unresolvable shape degrades to. Kept here rather
		// than in `isSlotList`, which also decides whether the single-value picker may edit the
		// entry — narrowing that would make a malformed slot list look editable.
		return slots.some((slot) => slot === '') ? '' : slots.join(' ');
	}

	if (typeof value !== 'string') {
		return '';
	}

	if (!value.startsWith('{') || !value.endsWith('}')) {
		return value;
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
 * @param {Function}                                                                                               preview `(tokens, values, breakpoint) => object` — the block's own row preview.
 * @param {string}                                                                                                 [breakpoint] The breakpoint the preview resolves at; defaults to desktop.
 *
 * @since TBD
 *
 * @return {Array<{id: string, label: string, userCreated: boolean, preview: Object}>} The preset rows.
 */
export function presetRows(payload, values, preview, breakpoint = PRESET_BREAKPOINTS[0]) {
	const presets = payload?.presets ?? {};
	const userCreated = Array.isArray(payload?.userCreated) ? payload.userCreated : [];

	return Object.entries(presets).map(([slug, preset]) => {
		const tokens = preset?.tokens ?? {};

		return {
			id: slug,
			label: preset?.label ?? slug,
			userCreated: userCreated.includes(slug),
			preview: preview(tokens, values, breakpoint),
		};
	});
}

/**
 * Seed a settings-panel draft for one preset: its label and its bound properties as bare ids
 * (ready for a token picker), or `null` for an unknown slug — the `scaleInitialValues` null
 * contract a stale-open-item self-heal relies on.
 *
 * @param {{presets?: Record<string, {label?: string, tokens?: Record<string, string>}>}} payload    The preset GET payload.
 * @param {string}                                                                        slug       The preset slug to seed.
 * @param {string[]}                                                                      properties The block's bound property surface.
 *
 * @since TBD
 *
 * @return {?{label: string, tokens: Record<string, string>}} The seeded draft, or null.
 */
export function presetInitialValues(payload, slug, properties) {
	const preset = payload?.presets?.[slug];

	if (!preset) {
		return null;
	}

	const tokens = preset.tokens ?? {};

	return {
		label: preset.label ?? slug,
		tokens: properties.reduce((acc, property) => {
			acc[property] = aliasToIdDeep(tokens[property] ?? '');
			return acc;
		}, {}),
	};
}

/**
 * The preset's raw stored token map — the exact entries `presets.php`'s payload carries for a
 * slug, in whatever shape each property was last written (scalar, per-corner slot list, or
 * responsive envelope). `presetInitialValues` is not a substitute for this: it converts every
 * scalar to a bare id for the picker, which is the wrong shape to write back verbatim.
 *
 * @param {{presets?: Record<string, {tokens?: Record<string, *>}>}} payload The preset GET payload.
 * @param {string}                                                    slug    The preset slug.
 *
 * @since TBD
 *
 * @return {Record<string, *>} The property => stored-value map, or `{}` for an unknown slug.
 */
export function presetStoredTokens(payload, slug) {
	return payload?.presets?.[slug]?.tokens ?? {};
}

/**
 * Whether a preset property's draft value represents "unset" rather than a genuine value to save.
 *
 * A bound property the preset has no stored value for seeds as `''`, and a cleared per-corner field
 * seeds as four `''` slots. Both shapes mean "nothing to write" — see `presetSaveTokens`, which
 * omits such a property rather than sending the empty literal the server's extension-value
 * validator rejects (`Dtcg_Validator::validate_extension_value()`).
 *
 * @param {*} value The draft property value.
 *
 * @since TBD
 *
 * @return {boolean} True when the value carries nothing to save.
 */
function isUnsetPresetValue(value) {
	if (value === '' || value === null || value === undefined) {
		return true;
	}

	if (Array.isArray(value)) {
		return value.every((slot) => slot === '' || slot === null || slot === undefined);
	}

	return false;
}

/**
 * Alias every token id inside a value, whatever shape holds it.
 *
 * `idToAlias` only understands a bare string, which was enough while every editable property was a
 * scalar. A per-corner slot list and a responsive envelope both carry ids *inside* them, and passing
 * either through unchanged writes bare dot-paths where the server expects `{aliases}`. Keys are left
 * alone — only values are candidates — and a non-id string (a literal, a clamp expression) is
 * returned untouched by `idToAlias` itself.
 *
 * @param {*} value A scalar, a slot list, or a responsive envelope.
 *
 * @since TBD
 *
 * @return {*} The same shape, with every token id alias-wrapped.
 */
function aliasDeep(value) {
	if (Array.isArray(value)) {
		return value.map(aliasDeep);
	}

	if (value !== null && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, aliasDeep(entry)]));
	}

	return idToAlias(value);
}

/**
 * Unwrap every alias inside a value back to its bare id, whatever shape holds it.
 *
 * The read-side mirror of `aliasDeep`, and it has to reach just as deep for the panel's dirty bit to
 * ever clear. `isDirty` compares the draft against these seeded values, and the two sides disagree on
 * a nested id unless both are unwrapped: the field writes a bare id into the draft while the stored
 * envelope still carries `{braces}`, so a shallow unwrap leaves them permanently unequal and Save
 * stays enabled forever after a successful write. Both shapes happen to render identically, which is
 * what makes the mismatch invisible until the button never goes quiet.
 *
 * @param {*} value A scalar, a slot list, or a responsive envelope.
 *
 * @since TBD
 *
 * @return {*} The same shape, with every alias unwrapped to a bare id.
 */
function aliasToIdDeep(value) {
	if (Array.isArray(value)) {
		return value.map(aliasToIdDeep);
	}

	if (value !== null && typeof value === 'object') {
		return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, aliasToIdDeep(entry)]));
	}

	return aliasToId(value);
}

/**
 * Build the write-side token map from a settings-panel draft: a property the draft actually
 * changed from its seed is written as a fresh alias-or-literal; every untouched property is
 * carried over from the preset's raw stored map, byte-for-byte, so a save that only edited the
 * label (or a different property) never flattens a per-corner slot list or a responsive envelope
 * the block editor wrote into a bare scalar. A property with no corresponding stored entry (a new
 * preset with `storedTokens` `{}`, or a bound property the draft adds) always counts as touched,
 * since there is nothing to carry over.
 *
 * An unset property (see `isUnsetPresetValue`) is omitted from the map entirely rather than sent as
 * `''`: the server rejects an empty literal outright, and the property's block binding already falls
 * through to its semantic default when nothing is stored for it. This matters as soon as a property
 * is bound but most presets leave it alone — `button-padding` and `button-margin` are the first —
 * because every preset's draft then carries an empty entry for it. Omitting still clears a
 * previously-stored value: the write endpoint (`Presets_Controller::create_item()`) replaces a
 * preset's whole token map wholesale rather than merging it property by property, so this function's
 * output IS the complete desired map — a property this call omits does not survive the write.
 *
 * @param {Record<string, string>} draftTokens   The panel's draft token map (bare ids, or a raw
 *                                                 non-scalar entry the field never let the user
 *                                                 touch — see `isNonScalarPresetValue`).
 * @param {Record<string, string>} [initialTokens] The draft's seed (`presetInitialValues`'s bare-id
 *                                                 map), compared against `draftTokens` to detect a
 *                                                 genuine edit. Defaults to `{}`, under which every
 *                                                 property counts as touched — the create-flow shape.
 * @param {Record<string, *>}      [storedTokens]  The preset's raw stored token map
 *                                                 (`presetStoredTokens`), read verbatim for any
 *                                                 property the draft did not change.
 *
 * @since TBD
 *
 * @return {Record<string, *>} The property => value map ready for the write.
 */
export function presetSaveTokens(draftTokens, initialTokens = {}, storedTokens = {}) {
	return Object.entries(draftTokens ?? {}).reduce((acc, [property, value]) => {
		if (isUnsetPresetValue(value)) {
			return acc;
		}

		const touched = !isEqual(value, initialTokens[property]);

		acc[property] = touched || !(property in storedTokens) ? aliasDeep(value) : storedTokens[property];

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
 * @param {Array<{id: string, label: string, preview: Object}>} rows    The rows in payload order.
 * @param {string}                                              itemId  The open route item id.
 * @param {?{label?: string, tokens?: Record<string, string>}}  draft   The open panel's live draft, or null.
 * @param {Record<string, string>}                              values  The feed's resolved value map.
 * @param {Function}                                            preview `(tokens, values, breakpoint) => object` —
 *                                                                      the same builder `presetRows` used, so an
 *                                                                      overlaid row and a fetched one cannot drift.
 * @param {string} [breakpoint] The breakpoint the preview resolves at; defaults to desktop.
 *
 * @since TBD
 *
 * @return {Array<Object>} The rows, with the matching row's label/preview overlaid.
 */
export function overlayPresetRows(rows, itemId, draft, values, preview, breakpoint = PRESET_BREAKPOINTS[0]) {
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
		// The draft holds bare ids (what the picker writes); the block's preview builder expects the
		// stored alias shape, same as a fetched payload. Re-wrapping here means both paths run the
		// identical builder, so a live overlay can never resolve differently from what lands on save.
		const asStored = Object.entries(draft.tokens).reduce((acc, [property, value]) => {
			acc[property] = aliasDeep(value ?? '');
			return acc;
		}, {});

		overlaid.preview = preview(asStored, values, breakpoint);
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
 * The preset name's own schema, rendered above the tabs rather than inside them.
 *
 * The name belongs to the preset, not to one of its states — a rename applies on Normal and Hover
 * alike, because both write the same `label` path.
 *
 * @since TBD
 *
 * @return {{panels: Array<Object>}} The name-only settings-form schema.
 */
export function presetNameSchema() {
	return {
		panels: [
			{
				id: 'name',
				fields: [{ type: 'text', path: 'label', label: __('Name', 'kadence-blocks') }],
			},
		],
	};
}

export { isPresetEnvelope, PRESET_BREAKPOINTS, readPresetBreakpoint, writePresetBreakpoint };
