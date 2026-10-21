/**
 * Site-level values: converting between block attributes and the Global
 * Styles record, and merging them into instance attributes.
 *
 * Pure functions, shared by the editor overlay and the Kadence panel; the
 * merge and the scoping follow the same rules as the PHP overlay (the
 * fixtures in `__tests__/fixtures/` pin both).
 */
import { cloneDeep, escapeRegExp, get, isEmpty, isEqual, kebabCase, omit, pick, pickBy, set, unset } from 'lodash';
import { TOKEN_VAR_PREFIX, isTokenAlias, resolveTokenAlias } from '../extension/design-tokens/alias';
import { getSupportedBlock } from './supported-blocks';

/**
 * A design token's CSS variable, as `resolveTokenAlias()` writes it: `var(--kb-token--<id>)`,
 * with every `.` of the id written as `--`. Token ids never hold `--` themselves.
 *
 * @since TBD
 */
const TOKEN_VAR = new RegExp('^var\\(' + escapeRegExp(TOKEN_VAR_PREFIX) + '([a-z0-9-]+)\\)$');

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
 * preset reference becomes its CSS variable, as the style engine writes it. A
 * design token's CSS variable becomes its `{token}` reference again, so the
 * Kadence control shows the token; any other value is kept.
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

	if (preset) {
		return `var(--wp--preset--color--${kebabCase(preset[1])})`;
	}

	const token = TOKEN_VAR.exec(value);

	return token ? `{${token[1].replace(/--/g, '.')}}` : value;
}

/**
 * Converts a Kadence color attribute value to the form stored in core's style.
 *
 * A design token's `{token}` reference is stored as its CSS variable, since
 * core prints the stored value as is.
 *
 * @param {string} value The Kadence color value.
 * @return {string} `var:preset|color|theme-paletteN` for a palette color, `var(--kb-token--…)` for a design token, the value otherwise.
 */
export function toCoreColor(value) {
	if (isTokenAlias(value)) {
		return resolveTokenAlias(value);
	}

	return /^palette\d+$/.test(value) ? `var:preset|color|theme-${value}` : value;
}

/**
 * Reads a block's site-level values from the Global Styles record, as block
 * attributes: `settings.custom.kadence.<slug>` plus the colors in core's style.
 * Stored values of attributes that can't be site values are ignored, and so
 * are cleared ones.
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
	const attributes =
		custom && typeof custom === 'object' && !Array.isArray(custom)
			? pickBy(custom, (value, name) => undefined !== value && isSiteAttribute(block, name))
			: {};
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
 * that can be site values and differ from the block's defaults; values core
 * also edits go to their path in core's style, the rest to
 * `settings.custom.kadence`. A cleared value isn't stored.
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

	Object.entries(attributes).forEach(([name, value]) => {
		const definition = definitions[name];

		if (undefined === value || !isSiteAttribute(block, name) || !definition || isEqual(value, definition.default)) {
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
 * object it leaves empty, up to `styles.blocks`.
 *
 * `settings.custom.kadence` and `settings.custom` are removed once they are
 * empty too. WordPress saves an empty object as an empty array, which a later
 * write couldn't add a key to, so an empty array already stored on the way to
 * a value, the top-level styles and settings included, is replaced before
 * writing.
 *
 * @param {GlobalStylesRecord}                                 record    The edited Global Styles record.
 * @param {string}                                             blockName Block name.
 * @param {{core: Object<string, string>, custom: Attributes}} stored    The block's stored form, from `toStoredForm()`.
 * @return {{styles: Object, settings: Object}} The edited styles and settings.
 */
export function withStoredForm(record, blockName, stored) {
	const { slug, attributesMap } = getSupportedBlock(blockName);
	const styles = cloneDeep(isEmpty(record.styles) ? {} : record.styles);
	const settings = cloneDeep(isEmpty(record.settings) ? {} : record.settings);

	Object.values(attributesMap).forEach((path) => {
		const target = ['blocks', blockName, ...path.split('.')];

		if (undefined !== stored.core[path]) {
			for (let length = 1; length < target.length; length++) {
				replaceEmptyList(styles, target.slice(0, length));
			}

			set(styles, target, stored.core[path]);
			return;
		}

		unset(styles, target);

		let parent = target.slice(0, -1);
		while (parent.length && isEmpty(get(styles, parent))) {
			unset(styles, parent);
			parent = parent.slice(0, -1);
		}
	});

	if (Object.keys(stored.custom).length) {
		replaceEmptyList(settings, ['custom']);
		replaceEmptyList(settings, ['custom', 'kadence']);
		set(settings, ['custom', 'kadence', slug], stored.custom);
	} else {
		unset(settings, ['custom', 'kadence', slug]);
		unsetIfEmpty(settings, ['custom', 'kadence']);
		unsetIfEmpty(settings, ['custom']);
	}

	return { styles, settings };
}

/**
 * Replaces an empty array at a path with an empty object, so named keys can be
 * set under it. WordPress returns an empty object it saved as an empty array.
 *
 * @param {Object}   object The object to change.
 * @param {string[]} path   The path.
 *
 * @since TBD
 */
function replaceEmptyList(object, path) {
	const value = get(object, path);

	if (Array.isArray(value) && !value.length) {
		set(object, path, {});
	}
}

/**
 * Removes the value at a path when it is an empty object or array.
 *
 * @param {Object}   object The object to change.
 * @param {string[]} path   The path.
 *
 * @since TBD
 */
function unsetIfEmpty(object, path) {
	const value = get(object, path);

	if (value !== null && typeof value === 'object' && isEmpty(value)) {
		unset(object, path);
	}
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
 * Drops the site values of every group the instance sets itself. The instance
 * sets a group when it has a value other than the block's default for any of
 * the group's attributes, the same test `merge()` uses, or when an older
 * attribute that stands in for the group holds a value.
 *
 * @param {Attributes}                    site         The site values.
 * @param {Attributes}                    attributes   The instance's attributes.
 * @param {string[][]}                    groups       Groups of attribute names.
 * @param {Object<string, {default: *}>} definitions  The block type's attribute definitions.
 * @param {Object<string, string[]>}      [legacy]     First attribute of a group => older attributes that stand in for it.
 *
 * @since TBD
 *
 * @return {Attributes} The site values the instance takes.
 */
export function groupSiteAttributes(site, attributes, groups, definitions, legacy = {}) {
	return groups.reduce(
		(kept, group) => (setsGroup(attributes, group, definitions, legacy) ? omit(kept, group) : kept),
		site
	);
}

/**
 * Drops the site values an own value of the instance covers. An own value holds
 * for the narrower devices after it, as in CSS, so the site's value for one of
 * them must not replace it. Values are in one unit: when the instance has an own
 * value or an own unit in a cascade and its unit is not the site's, no site value
 * of the cascade is shown.
 *
 * @param {Attributes}                    site        The site values.
 * @param {Attributes}                    attributes  The instance's attributes.
 * @param {Object<string, {default: *}>} definitions The block type's attribute definitions.
 * @param {import('./supported-blocks').SiteStylesCascade[]} [cascades] The attribute cascades; a block without any keeps every site value.
 *
 * @since TBD
 *
 * @return {Attributes} The site values the instance takes.
 */
export function withoutOverridden(site, attributes, definitions, cascades = []) {
	const isOwn = (name) => {
		const instance = attributes[name];

		return instance !== undefined && instance !== null && !isEqual(instance, definitions[name]?.default);
	};
	let kept = { ...site };

	cascades.forEach(({ unit, values }) => {
		const names = unit ? [...values, unit] : values;
		const instanceUnit = attributes[unit] ?? definitions[unit]?.default;
		const siteUnit = site[unit] ?? definitions[unit]?.default;

		if (unit && names.some(isOwn) && instanceUnit !== siteUnit) {
			kept = omit(kept, names);
			return;
		}

		let overridden = false;

		values.forEach((name) => {
			if (overridden) {
				delete kept[name];
			}

			overridden = overridden || isOwn(name);
		});
	});

	return kept;
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
 * dropped. The values of a cascade keep the unit they were shown in, so a value
 * the user changes while the site's unit is shown is stored with that unit.
 *
 * A write that starts the instance setting one of its block's groups is the
 * exception. The group then takes no site values, so the whole group is
 * stored as shown, with the written values, and the block keeps looking as it
 * did apart from the change.
 *
 * @param {Attributes}                    written       The attributes being written.
 * @param {Attributes}                    shown         The attributes the block was shown.
 * @param {Attributes}                    stored        The instance's stored attributes.
 * @param {Attributes}                    site          The site values.
 * @param {string[][]}                    [groups]      The block's groups of attribute names.
 * @param {Object<string, {default: *}>} [definitions] The block type's attribute definitions.
 * @param {Object<string, string[]>}      [legacy]      First attribute of a group => older attributes that stand in for it.
 * @param {import('./supported-blocks').SiteStylesCascade[]} [cascades] The block's cascades.
 * @return {Attributes} The attributes to store.
 */
export function guardWrite(written, shown, stored, site, groups = [], definitions = {}, legacy = {}, cascades = []) {
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

	groups.forEach((group) => {
		if (
			setsGroup(stored, group, definitions, legacy) ||
			!setsGroup({ ...stored, ...kept }, group, definitions, legacy)
		) {
			return;
		}

		group.forEach((name) => {
			const value = name in written ? written[name] : shown[name];

			if (!isEqual(value, stored[name])) {
				kept[name] = value;
			}
		});
	});

	cascades.forEach(({ unit, values }) => {
		const unitShown = shown[unit] !== undefined && !isEqual(shown[unit], stored[unit]);
		const changed = values.some((name) => name in kept && !isEqual(kept[name], stored[name]));

		if (!unit || unit in kept || !changed) {
			return;
		}

		// A unit written with the values that differs from the one shown was picked, even when it is the stored one.
		if (unit in written && !isEqual(written[unit], shown[unit])) {
			kept[unit] = written[unit];
		} else if (unitShown) {
			kept[unit] = shown[unit];
		}
	});

	return kept;
}

/**
 * The attributes of the Kadence panel's virtual block: the block's defaults
 * and site values, and the current block's values of the attributes never
 * stored site-wide, e.g. its unique ID or an icon's style, so a change to the
 * record doesn't reset them.
 *
 * @param {string}     blockName Block name.
 * @param {Attributes} defaults  The block's default attributes.
 * @param {Attributes} site      The site values.
 * @param {Attributes} current   The current virtual block's attributes, empty before it exists.
 *
 * @since TBD
 *
 * @return {Attributes} The virtual block's attributes.
 */
export function panelAttributes(blockName, defaults, site, current) {
	return { ...defaults, ...site, ...pick(current, getSupportedBlock(blockName)?.exclude || []) };
}

/**
 * Whether an instance sets a group itself: it has a value other than the
 * block's default for any of the group's attributes, or a value in an older
 * attribute that stands in for the group.
 *
 * @param {Attributes}                    attributes  The instance's attributes.
 * @param {string[]}                      group       The group's attribute names.
 * @param {Object<string, {default: *}>} definitions The block type's attribute definitions.
 * @param {Object<string, string[]>}      [legacy]    First attribute of a group => older attributes that stand in for it.
 *
 * @since TBD
 *
 * @return {boolean} Whether the instance sets the group.
 */
function setsGroup(attributes, group, definitions, legacy = {}) {
	const ownsMember = group.some((name) => {
		const value = attributes[name];

		return undefined !== value && null !== value && !isEqual(value, definitions[name]?.default);
	});

	return ownsMember || (legacy[group[0]] || []).some((name) => holdsValue(attributes[name]));
}

/**
 * Whether a value holds a number or a string that isn't empty, anywhere in it.
 *
 * @param {*} value A value.
 *
 * @since TBD
 *
 * @return {boolean} Whether it holds a value.
 */
function holdsValue(value) {
	if (isObjectLike(value)) {
		return Object.values(value).some(holdsValue);
	}

	return 'number' === typeof value || ('string' === typeof value && '' !== value);
}

/**
 * @param {*} value A value.
 * @return {boolean} Whether it's an array or a plain object.
 */
function isObjectLike(value) {
	return value !== null && typeof value === 'object';
}

/**
 * Whether an attribute can be one of a block's site values. An excluded
 * attribute never is. For a block without site rules, scoped or not, only its
 * overlay attributes and the ones core's style stores can show a site value;
 * that also keeps out attributes the server doesn't register, which other
 * scripts add to the block in the editor.
 *
 * @param {import('./supported-blocks').SupportedBlock} block The block's entry.
 * @param {string}                                       name  Attribute name.
 *
 * @since TBD
 *
 * @return {boolean} Whether the attribute can be a site value.
 */
function isSiteAttribute(block, name) {
	if (block.exclude.includes(name)) {
		return false;
	}

	return (
		Boolean(block.siteRules) ||
		block.overlay.includes(name) ||
		Object.prototype.hasOwnProperty.call(block.attributesMap, name)
	);
}
