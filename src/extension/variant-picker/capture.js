/**
 * Capture a block's current visual token values for its preset surface.
 *
 * "Save as a new preset" should persist exactly what the editor shows: the selected preset's values with
 * the block's edits (its mapped attribute overrides) layered on top. This reads each mapped control — its
 * edited value when it has one, else the selected preset's value — and reduces it to the literal a preset
 * token stores.
 */
import { get } from 'lodash';
import { activeSet, blockProperties, blockVariantValues, blockDefaultVariant } from './index';
import { normalizeColor, normalizeDimension, normalizeText, isEmptyValue } from '../token-indicators/normalize';

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
		const dimension = normalizeDimension(value, unit);

		return dimension.value === '' ? '' : `${dimension.value}${dimension.unit}`;
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
 * @param {string} set        The token set the block is on.
 * @param {Object} attributes The block's current attributes.
 *
 * @since TBD
 *
 * @return {Object} The captured token map keyed by property.
 */
export function capturedTokens(blockName, set, attributes) {
	const tokenSet = set || activeSet();
	const selected = get(attributes, 'kbVariant', '');
	const currentSlug = selected || blockDefaultVariant(blockName, tokenSet);
	const presetValues = get(blockVariantValues(blockName, tokenSet), currentSlug, {});

	return blockProperties(blockName, tokenSet).reduce((tokens, property) => {
		const attr = property.control_attr;
		const raw = attr ? get(attributes, attr, '') : '';
		const unit = property.kind === 'dimension' && attr ? get(attributes, `${attr}Unit`, '') : '';
		const edited = attr && !isEmptyValue(property.kind, raw);

		tokens[property.key] = edited ? attrToLiteral(property.kind, raw, unit) : get(presetValues, property.key, '');

		return tokens;
	}, {});
}
