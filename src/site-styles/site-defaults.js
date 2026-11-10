/**
 * The site values a block's inspector shows as its defaults in FSE mode. Most
 * site values render through site rules rather than the instance's
 * attributes, so without these a control would show the design token's value
 * while the block renders the site's.
 */
import { getBlockType } from '@wordpress/blocks';
import { useMemo } from '@wordpress/element';
import { presetSlotAt } from '../extension/token-indicators/kinds/dimension';
import { scopeSiteAttributes, siteAttributes } from './store';
import { scopeStyle } from './scope-style';
import { getSupportedBlock, isFseMode } from './supported-blocks';
import { useGlobalStylesRecord } from './use-global-styles-record';
import { isVirtualBlock } from './virtual-blocks';

/**
 * @param {*} value A site value.
 *
 * @since 3.9.0
 *
 * @return {boolean} Whether the value is unset.
 */
function isEmpty(value) {
	if (Array.isArray(value)) {
		return value.every(isEmpty);
	}

	return undefined === value || null === value || '' === value;
}

/**
 * A site measure as the corners a binding's preset value holds, each with its unit.
 *
 * @param {Array|*} value The site value, a list of corners or sides.
 * @param {string}  unit  The unit the value is in.
 *
 * @since 3.9.0
 *
 * @return {Array|undefined} The corners, '' for one the site leaves unset; undefined without a value.
 */
function toMeasure(value, unit) {
	if (isEmpty(value)) {
		return undefined;
	}

	return (Array.isArray(value) ? value : [value, value, value, value]).map((side) =>
		isEmpty(side) ? '' : `${side}${unit}`
	);
}

/**
 * The site values a block instance renders with: the record's values, scoped
 * by the instance's style. Empty outside FSE mode, for an unsupported block,
 * and for the Kadence panel's own blocks, which edit the site values.
 *
 * @param {string} name       Block name.
 * @param {string} clientId   The instance's client ID.
 * @param {Object} attributes The instance's attributes.
 *
 * @since 3.9.0
 *
 * @return {Object<string, *>} Attribute name => site value.
 */
export function useSiteDefaults(name, clientId, attributes) {
	const enabled = isFseMode() && !!getSupportedBlock(name) && !isVirtualBlock(clientId);
	const record = useGlobalStylesRecord(enabled);
	const block = getSupportedBlock(name);
	const style = enabled && block.scope ? scopeStyle(name, attributes, block.scope) : undefined;

	return useMemo(() => {
		if (!enabled || !record) {
			return {};
		}

		const values = siteAttributes(record, name);
		const { scope } = block;

		return scope
			? scopeSiteAttributes(
					values,
					{ [scope.attribute]: style },
					scope,
					getBlockType(name)?.attributes?.[scope.attribute]?.default
				)
			: values;
	}, [enabled, record, name, block, style]);
}

/**
 * Puts site values in place of the design token values a block's controls
 * fall back to. A measure takes the unit the site stores for it, or the
 * block's default unit, and the site's own values per device in place of the
 * preset's. Border entries keep their token values.
 *
 * @param {Object}            binding    attribute => binding entry, from `usePresetBinding()`.
 * @param {Object<string, *>} site       Attribute name => site value, from `useSiteDefaults()`.
 * @param {string}            blockName  Block name.
 *
 * @since 3.9.0
 *
 * @return {Object} The binding, with a site value as the preset value where the site sets one.
 */
export function withSiteDefaults(binding, site, blockName) {
	if (!Object.keys(site).length) {
		return binding;
	}

	const definitions = getBlockType(blockName)?.attributes || {};
	const next = { ...binding };

	Object.entries(binding).forEach(([attr, entry]) => {
		if ('border' === entry.kind) {
			return;
		}

		if ('dimension' !== entry.kind) {
			if (!isEmpty(site[attr])) {
				next[attr] = { ...entry, presetValue: site[attr], bound: false };
			}

			return;
		}

		const unitAttr = `${attr}Unit`;
		const unit = site[unitAttr] || definitions[unitAttr]?.default || 'px';
		const desktop = toMeasure(site[attr], unit);
		const tablet = toMeasure(site[entry.responsiveAttrs?.tablet], unit);
		const mobile = toMeasure(site[entry.responsiveAttrs?.mobile], unit);

		if (!desktop && !tablet && !mobile) {
			return;
		}

		const preset = entry.responsive || {};
		const isSet = (corners, index) => !!corners && '' !== corners[index];
		/*
		 * A breakpoint's corner: the site's own, then unset ('') when the site sets the corner at a wider
		 * device, so the device resolver falls through to it, then the preset's for that breakpoint.
		 */
		const breakpoint = (own, wider, presetCorners) =>
			[0, 1, 2, 3].map((index) => {
				if (isSet(own, index)) {
					return own[index];
				}

				if (wider.some((corners) => isSet(corners, index)) || undefined === presetCorners) {
					return '';
				}

				return presetSlotAt(presetCorners, index);
			});

		next[attr] = {
			...entry,
			// A corner the site leaves unset still falls back to the preset's.
			presetValue: desktop
				? desktop.map((corner, index) => ('' !== corner ? corner : presetSlotAt(entry.presetValue, index)))
				: entry.presetValue,
			responsive: {
				tablet: breakpoint(tablet, [desktop], preset.tablet),
				mobile: breakpoint(mobile, [tablet, desktop], preset.mobile),
			},
			bound: false,
		};
	});

	return next;
}

/**
 * The site's border width and color for a device, as the single defaults a
 * border control shows: the first side the site sets, from the device's own
 * value up through the wider devices', as the site rules cascade.
 *
 * @param {Object<string, *>}                  site       Attribute name => site value, from `useSiteDefaults()`.
 * @param {string}                             attr       The desktop border attribute, e.g. `borderStyle`.
 * @param {{tablet: string, mobile: string}}   responsive The tablet and mobile border attributes.
 * @param {string}                             device     The active preview device ('Desktop' | 'Tablet' | 'Mobile').
 *
 * @since 3.9.0
 *
 * @return {{width: (string|undefined), color: (string|undefined)}} The site's width with its unit, and its color.
 */
export function siteBorderDefaults(site, attr, responsive, device) {
	const attrs =
		'Mobile' === device
			? [responsive.mobile, responsive.tablet, attr]
			: 'Tablet' === device
				? [responsive.tablet, attr]
				: [attr];
	const borders = attrs.map((name) => site[name]?.[0]).filter((border) => border && 'object' === typeof border);
	const first = (index) => {
		for (const border of borders) {
			for (const side of ['top', 'right', 'bottom', 'left']) {
				const value = border[side]?.[index];

				if (!isEmpty(value)) {
					return { value, unit: border.unit || 'px' };
				}
			}
		}

		return undefined;
	};
	const color = first(0);
	const width = first(2);

	return {
		width: width ? `${width.value}${width.unit}` : undefined,
		color: color?.value,
	};
}
