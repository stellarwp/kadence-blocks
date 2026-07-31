/**
 * Capture a block's current visual token values for its preset surface.
 *
 * "Save as a new preset" should persist exactly what the editor shows: the selected preset's values with
 * the block's edits (its mapped attribute overrides) layered on top. This reads each mapped control — its
 * edited value when it has one, else the selected preset's value — and reduces it to the literal a preset
 * token stores.
 */
import { get } from 'lodash';
import { activeLibrary, blockProperties, blockPresetValues, blockDefaultPreset } from './index';
import { normalizeColor, normalizeDimension, normalizeText, isEmptyValue } from '../token-indicators/normalize';
import { isTokenAlias } from '../design-tokens/alias';

/**
 * Reduce a block attribute value to the literal a preset token stores, per kind: a color resolves to its
 * literal, a dimension composes its value and unit (`8` + `px` -> `8px`), text passes through trimmed.
 *
 * @param {string} kind  The property kind ('color' | 'dimension' | 'text').
 * @param {*}      value The stored attribute value.
 * @param {string} unit  The companion unit (dimension only; '' otherwise).
 *
 * @since TBD
 *
 * @return {string} The token literal.
 */
function attrToLiteral(kind, value, unit) {
	if (kind === 'dimension') {
		// A preset token is a single scalar, so a per-corner override (e.g. `['8','8','8','4']`) narrows to
		// its first populated side — matching how the indicator's bound/overridden compare reads a dimension.
		const dimension = normalizeDimension(value, unit);

		if (dimension.value === '') {
			return '';
		}

		// A token alias is a whole-string `{dot.path}` reference — the preset stores it verbatim. Appending
		// the unit would produce `{dot.path}px`, which the server rejects as `alias_malformed` because
		// `Alias::looks_like_alias()` fires on a brace anywhere in the value.
		if (isTokenAlias(dimension.value)) {
			return dimension.value;
		}

		return `${dimension.value}${dimension.unit}`;
	}

	if (kind === 'color') {
		return normalizeColor(value);
	}

	return normalizeText(value);
}

/**
 * The block's current values across its preset surface, as a `{ propertyKey: literal }` token map: each
 * mapped control's edited value when it has one, else the selected preset's value. Feeds the "save as a
 * new preset" write so the new preset matches what the editor currently shows.
 *
 * @param {string} blockName  The block name.
 * @param {string} library    The token library the block is on.
 * @param {Object} attributes The block's current attributes.
 *
 * @since TBD
 *
 * @return {Object} The captured token map keyed by property.
 */
export function capturedTokens(blockName, library, attributes) {
	const resolvedLibrary = library || activeLibrary();
	const selected = get(attributes, 'kbPreset', '');
	const currentSlug = selected || blockDefaultPreset(blockName, resolvedLibrary);
	const presetValues = get(blockPresetValues(blockName, resolvedLibrary), currentSlug, {});

	return blockProperties(blockName, resolvedLibrary).reduce((tokens, property) => {
		const attr = property.control_attr;
		const raw = attr ? get(attributes, attr, '') : '';
		const unit = property.kind === 'dimension' && attr ? get(attributes, `${attr}Unit`, '') : '';
		// "Edited" here is simply "the control carries a value" — we snapshot the current visual state, so a
		// value that happens to equal the preset is captured all the same (no differs-from-preset compare).
		const edited = attr && !isEmptyValue(property.kind, raw);

		tokens[property.key] = edited ? attrToLiteral(property.kind, raw, unit) : get(presetValues, property.key, '');

		return tokens;
	}, {});
}
