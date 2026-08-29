/**
 * The pure logic behind a token field's trigger and its list: what the slot currently holds, what it
 * falls back to when unset, and how to name either.
 *
 * Ported from the block editor's `component-token-ui.js` so both hosts share one implementation
 * rather than two that drift. The rules encoded here were worked out against real content and are
 * easy to get subtly wrong:
 *
 * - an **unset** slot summarizes to nothing, and shows its inherited default muted instead — a
 *   placeholder, not a value stored on this breakpoint;
 * - an inherited default arrives in three shapes (a resolved preset literal, a raw alias, or a bare
 *   number whose unit lives elsewhere) and must be normalized before it can be compared or shown;
 * - the unit is appended only to an inherited *number* — a preset value already carries one, and a
 *   unitless token value (`None` is `0`) has to keep comparing equal to itself.
 */

/**
 * A whole-string design-token alias, e.g. `{semantic.dimension.radius-sm}`.
 *
 * @since TBD
 */
const TOKEN_ALIAS_PATTERN = /^\{[\w.-]+\}$/;

/**
 * Whether a slot value is a whole-string token alias.
 *
 * @param {*} value The slot value.
 *
 * @since TBD
 *
 * @return {boolean} True when the value is an alias.
 */
export function isTokenAlias(value) {
	return typeof value === 'string' && TOKEN_ALIAS_PATTERN.test(value);
}

/**
 * Whether a slot holds anything at all.
 *
 * @param {*} value The slot value.
 *
 * @since TBD
 *
 * @return {boolean} True when the slot is set.
 */
export function hasValue(value) {
	return value !== '' && value !== undefined && value !== null;
}

/**
 * The pickable entry whose `alias` matches a value.
 *
 * A regular entry only matches while `value` is alias-shaped (`{dot.path}`) — a plain literal that
 * happens to equal an entry's `alias` string must never resolve to that entry. A `fixed` entry (a
 * sentinel choice with no DTCG registration behind it, e.g. Margin's `Auto`) is the one exception:
 * its `alias` IS the bare value written to the attribute, since it has no bracket form to write
 * instead, so it matches on equality regardless of `isTokenAlias`. This is scoped strictly to
 * entries explicitly marked `fixed: true` — never a general literal-value fallback — so a hand-typed
 * Custom literal that happens to equal a real token's resolved value is never misidentified as that
 * token.
 *
 * A bare Kadence size slug (`sm`, `md`, `lg`, …) is the third case, and it is a match rather than a
 * literal. Those are what blocks stored before tokens existed, and the dimension primitives are
 * PROJECTED into the very slots they name — `primitive.dimension.font-size.md` declares
 * `kb_font_size_slot => md`, so a stored `md` already renders as that token's value. Only the field
 * disagreed, reading it as a hand-typed custom value and leaving the matching option unchecked. The
 * slug is the id's last segment by construction (each primitive is built as
 * `'primitive.dimension.<role>.' . $slug` with that same `$slug` as its projection), so the two are
 * matched on that segment rather than through a second table that could drift from the declarations.
 *
 * Scoped to `primitive.dimension.*` entries, and safe there: every slug is a word (`none`, `xxs`,
 * `sm`, `3xl`), never a valid CSS length, so a Custom literal cannot collide with one. The caller's
 * list is already narrowed to the control's own role, so a stored `md` cannot match a font size on a
 * spacing control.
 *
 * @param {Array}  tokens The pickable-token list.
 * @param {*}      value  The alias, fixed sentinel, or legacy size slug to match.
 *
 * @since TBD
 *
 * @return {?Object} The matching entry, or null.
 */
export function findTokenEntry(tokens, value) {
	const entries = tokens || [];
	const match = entries.find((entry) => entry.alias === value && (entry.fixed || isTokenAlias(value)));

	if (match) {
		return match;
	}

	return entries.find((entry) => isLegacySlugFor(entry, value)) || null;
}

/**
 * Whether a stored value is the Kadence size slug a dimension primitive projects into.
 *
 * @param {Object} entry The pickable entry.
 * @param {*}      value The stored slot value.
 *
 * @since TBD
 *
 * @return {boolean} True when the entry is the primitive that slug names.
 */
function isLegacySlugFor(entry, value) {
	if (typeof value !== 'string' || value === '' || !entry?.id?.startsWith('primitive.dimension.')) {
		return false;
	}

	const segments = entry.id.split('.');

	return segments[segments.length - 1] === value;
}

/**
 * Normalize an inherited default into a comparable, displayable literal.
 *
 * @param {*}       defaultValue The default: a resolved literal, an alias, or a bare number.
 * @param {Array}   tokens       The pickable list, used to resolve an alias.
 * @param {string}  unit         The control's unit, completing an inherited bare number.
 * @param {boolean} [inherited]  Whether the default came from another breakpoint.
 *
 * @since TBD
 *
 * @return {string} The resolved literal, or '' when there is none.
 */
export function resolveDefaultValue(defaultValue, tokens, unit, inherited) {
	if (!hasValue(defaultValue)) {
		return '';
	}

	const entry = findTokenEntry(tokens, defaultValue);

	if (entry) {
		return entry.value;
	}

	if (isTokenAlias(defaultValue)) {
		return '';
	}

	if (inherited && /^-?\d*\.?\d+$/.test(String(defaultValue))) {
		// Zero stays unitless. The `None` token resolves to a bare '0', so appending a unit here would
		// stop the inherited value matching it and the field would read "0px" instead of "None".
		return Number(defaultValue) === 0 ? '0' : `${defaultValue}${unit || ''}`;
	}

	return String(defaultValue);
}

/**
 * Name the inherited default a field falls back to.
 *
 * The default arrives resolved (`'9999px'`), which names a size but not the token it came from, so
 * the pickable list is searched for an entry resolving to the same value.
 *
 * @param {string} resolvedDefault The default, already resolved to a literal.
 * @param {Array}  tokens          The pickable list, used to name it.
 *
 * @since TBD
 *
 * @return {{label: string, value: string}} The label and value, both '' when there is no default.
 */
export function defaultSummary(resolvedDefault, tokens, literalLabel = '') {
	if (!resolvedDefault) {
		return { label: '', value: '' };
	}

	// A `fixed` sentinel (e.g. Margin's "None") is not a real named design choice, so it is excluded
	// here — without this, its label would be borrowed for any field whose literal default
	// coincidentally equals the sentinel's own resolved value (Margin's unset default is the bare
	// string '0', which is also "None"'s resolved value), showing e.g. "None" for a field the user
	// never touched.
	const entry = (tokens || []).find((candidate) => !candidate.fixed && candidate.value === resolvedDefault) || null;

	return { label: entry ? entry.label : literalLabel, value: resolvedDefault };
}

/**
 * What the slot itself holds: a bound token's label and resolved value, `Custom` plus the literal,
 * or nothing when unset.
 *
 * @param {*}      value      The slot value.
 * @param {Array}  tokens     The pickable list.
 * @param {string} unit       The control's unit, appended to a literal for display.
 * @param {string} customName The word for a literal value, translated by the caller.
 *
 * @since TBD
 *
 * @return {{label: string, value: string}} The trigger label and secondary text, both '' when unset.
 */
export function fieldSummary(value, tokens, unit, customName) {
	const entry = findTokenEntry(tokens, value);

	if (entry) {
		return { label: entry.label, value: entry.value };
	}

	if (isTokenAlias(value)) {
		return { label: String(value).slice(1, -1), value: '' };
	}

	if (hasValue(value)) {
		return { label: customName, value: `${value}${unit || ''}` };
	}

	return { label: '', value: '' };
}
