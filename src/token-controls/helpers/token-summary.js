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
 * @param {Array}  tokens The pickable-token list.
 * @param {string} value  The alias to match.
 *
 * @since TBD
 *
 * @return {?Object} The matching entry, or null.
 */
export function findTokenEntry(tokens, value) {
	return (tokens || []).find((entry) => entry.alias === value) || null;
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

	if (isTokenAlias(defaultValue)) {
		const entry = findTokenEntry(tokens, defaultValue);

		return entry ? entry.value : '';
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

	const entry = (tokens || []).find((candidate) => candidate.value === resolvedDefault) || null;

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
	if (isTokenAlias(value)) {
		const entry = findTokenEntry(tokens, value);

		return {
			label: entry ? entry.label : String(value).slice(1, -1),
			value: entry ? entry.value : '',
		};
	}

	if (hasValue(value)) {
		return { label: customName, value: `${value}${unit || ''}` };
	}

	return { label: '', value: '' };
}
