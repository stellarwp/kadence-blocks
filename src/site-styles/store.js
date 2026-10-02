/**
 * Site-level values: converting between block attributes and the Global
 * Styles record, and merging them into instance attributes.
 *
 * Pure functions, shared by the editor overlay and the Kadence panel; the
 * merge and the scoping follow the same rules as the PHP overlay (the
 * fixtures in `__tests__/fixtures/` pin both).
 */
import { cloneDeep, get, isEmpty, isEqual, kebabCase, pick, set, unset } from 'lodash';
import { getSupportedBlock } from './supported-blocks';

/**
 * Attributes no site-level value may set, whatever the block. The same list
 * `getTransferableAttributes()` in `@kadence/helpers` always leaves out.
 */
const ALWAYS_EXCLUDED = ['uniqueID', 'inQueryBlock', 'anchor', 'noCustomDefaults'];

/**
 * @typedef {Object<string, *>} Attributes Block attribute name => value.
 */

/**
 * @typedef {Object} GlobalStylesRecord The parts of the edited `globalStyles` record this module reads.
 * @property {Object} [settings] Global Styles settings; `custom.kadence.<slug>` holds the site-level values.
 * @property {Object} [styles]   Global Styles styles; `blocks.<name>` holds, at the mapped paths, the values core also edits.
 */

/**
 * Converts a color from core's style to a Kadence color attribute value.
 *
 * A Kadence palette reference becomes `paletteN`, rendered by Kadence as
 * `var(--global-paletteN)`: core's preset variables aren't defined in every
 * editor frame. Both stored forms are accepted, the `var:preset` reference and
 * the `var(--wp--preset--color--…)` value the edited record can hold. Another
 * preset reference becomes its CSS variable, as the style engine writes it;
 * any other value is kept.
 *
 * @param {string} value The stored color.
 * @return {string} The Kadence color value.
 */
export function toKadenceColor(value) {
	const palette =
		/^var:preset\|color\|theme-(palette\d+)$/.exec(value) ||
		/^var\(--wp--preset--color--theme-(palette\d+)\)$/.exec(value);

	if (palette) {
		return palette[1];
	}

	const preset = /^var:preset\|color\|(.+)$/.exec(value);

	return preset ? `var(--wp--preset--color--${kebabCase(preset[1])})` : value;
}

/**
 * Converts a Kadence color attribute value to the form stored in core's style.
 *
 * @param {string} value The Kadence color value.
 * @return {string} `var:preset|color|theme-paletteN` for a palette color, the value otherwise.
 */
export function toCoreColor(value) {
	return /^palette\d+$/.test(value) ? `var:preset|color|theme-${value}` : value;
}

/**
 * Reads a block's site-level values from the Global Styles record, as block
 * attributes: `settings.custom.kadence.<slug>` plus the colors in core's style.
 *
 * @param {GlobalStylesRecord|undefined} record    The edited Global Styles record.
 * @param {string}                       blockName Block name.
 * @return {Attributes} Attribute name => site value; empty for an unsupported block.
 */
export function siteAttributes(record, blockName) {
	const block = getSupportedBlock(blockName);

	if (!block || !record) {
		return {};
	}

	const custom = record.settings?.custom?.kadence?.[block.slug];
	const attributes = custom && typeof custom === 'object' && !Array.isArray(custom) ? { ...custom } : {};
	const styles = record.styles?.blocks?.[blockName] || {};

	// Every mapped path is `color.<key>`: the server keeps no other.
	Object.entries(block.attributesMap).forEach(([attribute, path]) => {
		const value = get(styles, path);

		if (typeof value === 'string' && value !== '') {
			attributes[attribute] = toKadenceColor(value);
		}
	});

	return attributes;
}

/**
 * Splits a block's attributes into what Global Styles stores: only settings
 * that differ from the block's defaults, without content attributes; values
 * core also edits go to their path in core's style, the rest to
 * `settings.custom.kadence`.
 *
 * @param {Attributes}                    attributes The block's attributes.
 * @param {Object<string, {default: *}>} definitions The block type's attribute definitions.
 * @param {string}                        blockName  Block name.
 * @return {{core: Object<string, string>, custom: Attributes}} Core style path => value, and the custom values.
 */
export function toStoredForm(attributes, definitions, blockName) {
	const block = getSupportedBlock(blockName);
	const core = {};
	const custom = {};

	if (!block) {
		return { core, custom };
	}

	const excluded = [...ALWAYS_EXCLUDED, ...block.exclude];

	Object.entries(attributes).forEach(([name, value]) => {
		const definition = definitions[name];

		if (excluded.includes(name) || !definition || isEqual(value, definition.default)) {
			return;
		}

		if (block.attributesMap[name] && typeof value === 'string') {
			core[block.attributesMap[name]] = toCoreColor(value);
		} else {
			custom[name] = value;
		}
	});

	return { core, custom };
}

/**
 * Writes a block's stored form into a copy of the Global Styles record's
 * styles and settings. A mapped path without a value is removed, with any
 * object it leaves empty inside the block's styles.
 *
 * @param {GlobalStylesRecord}                                 record    The edited Global Styles record.
 * @param {string}                                             blockName Block name.
 * @param {{core: Object<string, string>, custom: Attributes}} stored    The block's stored form, from `toStoredForm()`.
 * @return {{styles: Object, settings: Object}} The edited styles and settings.
 */
export function withStoredForm(record, blockName, stored) {
	const { slug, attributesMap } = getSupportedBlock(blockName);
	const styles = cloneDeep(record.styles || {});
	const settings = cloneDeep(record.settings || {});

	Object.values(attributesMap).forEach((path) => {
		const target = ['blocks', blockName, ...path.split('.')];

		if (undefined !== stored.core[path]) {
			set(styles, target, stored.core[path]);
			return;
		}

		unset(styles, target);

		// Up to, not including, the block's own entry.
		let parent = target.slice(0, -1);
		while (parent.length > 2 && isEmpty(get(styles, parent))) {
			unset(styles, parent);
			parent = parent.slice(0, -1);
		}
	});

	if (Object.keys(stored.custom).length) {
		set(settings, ['custom', 'kadence', slug], stored.custom);
	} else {
		unset(settings, ['custom', 'kadence', slug]);
	}

	return { styles, settings };
}

/**
 * Merges one attribute's site value into the instance value, leaf by leaf: an
 * instance leaf that differs from the block's default wins.
 *
 * @param {*} instance     The instance value, undefined or null when the instance doesn't have it.
 * @param {*} site         The site value.
 * @param {*} defaultValue The block's default value.
 * @return {*} The merged value.
 */
export function merge(instance, site, defaultValue) {
	if (instance === undefined || instance === null || isEqual(instance, defaultValue)) {
		return site;
	}

	if (isObjectLike(instance) && isObjectLike(site) && isObjectLike(defaultValue)) {
		const merged = Array.isArray(instance) ? [...instance] : { ...instance };

		Object.keys(site).forEach((key) => {
			merged[key] = merge(instance[key], site[key], defaultValue[key]);
		});

		return merged;
	}

	return instance;
}

/**
 * Keeps the site values the instance's style takes. The style is the
 * instance's own value of the scope attribute, or the block's default. A style
 * that isn't listed takes every site value.
 *
 * @param {Attributes}                                            site         The site values.
 * @param {Attributes}                                            attributes   The instance's attributes.
 * @param {import('./supported-blocks').SiteStylesScope} scope        The block's scope.
 * @param {*}                                                     defaultStyle The scope attribute's default.
 * @return {Attributes} The site values the instance takes.
 */
export function scopeSiteAttributes(site, attributes, scope, defaultStyle) {
	const style = attributes[scope.attribute] ?? defaultStyle;

	if (typeof style !== 'string' || !Object.prototype.hasOwnProperty.call(scope.attributes, style)) {
		return site;
	}

	return pick(site, scope.attributes[style]);
}

/**
 * Merges a block's site values into its attributes.
 *
 * @param {Attributes}                    attributes  The instance's attributes.
 * @param {Attributes}                    site        The site values.
 * @param {Object<string, {default: *}>} definitions The block type's attribute definitions.
 * @return {Attributes} The attributes with the site values merged in.
 */
export function mergeAttributes(attributes, site, definitions) {
	const merged = { ...attributes };

	Object.keys(site).forEach((name) => {
		merged[name] = merge(attributes[name], site[name], definitions[name]?.default);
	});

	return merged;
}

/**
 * Keeps only what the user changed in a write to an attribute shown with the
 * site value merged in, merged onto the instance's stored value, leaf by leaf.
 *
 * @param {*} next   The value written.
 * @param {*} shown  The value the block was shown (instance merged with site).
 * @param {*} stored The instance's stored value.
 * @return {*} The value to store.
 */
export function unmerge(next, shown, stored) {
	if (isEqual(next, shown)) {
		return stored;
	}

	if (isObjectLike(next) && isObjectLike(shown) && Array.isArray(next) === Array.isArray(shown)) {
		const base = isObjectLike(stored) ? stored : {};
		const result = Array.isArray(next) ? [...(Array.isArray(stored) ? stored : [])] : { ...base };

		Object.keys(next).forEach((key) => {
			result[key] = unmerge(next[key], shown[key], base[key]);
		});

		return result;
	}

	return next;
}

/**
 * Filters a write from a block shown with site values merged in, so no site
 * value is stored in the instance: for each written attribute that has a site
 * value, only the changed leaves are kept, and an unchanged attribute is
 * dropped.
 *
 * @param {Attributes} written The attributes being written.
 * @param {Attributes} shown   The attributes the block was shown.
 * @param {Attributes} stored  The instance's stored attributes.
 * @param {Attributes} site    The site values.
 * @return {Attributes} The attributes to store.
 */
export function guardWrite(written, shown, stored, site) {
	const kept = {};

	Object.keys(written).forEach((name) => {
		if (!(name in site)) {
			kept[name] = written[name];
			return;
		}

		const value = unmerge(written[name], shown[name], stored[name]);

		if (!isEqual(value, stored[name])) {
			kept[name] = value;
		}
	});

	return kept;
}

/**
 * @param {*} value A value.
 * @return {boolean} Whether it's an array or a plain object.
 */
function isObjectLike(value) {
	return value !== null && typeof value === 'object';
}
