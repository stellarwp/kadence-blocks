/**
 * The editor side of `Site_Rules`: prints a block's Kadence-only site values
 * with the block's own style component.
 *
 * The component renders off screen with the block's defaults and with the
 * defaults plus the site values, once per style that takes site values. The
 * rules only the second render prints are kept, with the instance classes
 * replaced by the block's site selectors, and written at the end of the head
 * of the document the block renders in: after Kadence's stylesheets, so a site
 * rule wins over a default, and before the instance styles in the body, so an
 * instance rule wins a tie.
 */
import { getBlockType } from '@wordpress/blocks';
import { useRefEffect } from '@wordpress/compose';
import { useSelect } from '@wordpress/data';
import { createRoot, flushSync } from '@wordpress/element';
import { isEmpty, omit } from 'lodash';
import { scopeSiteAttributes, siteAttributes } from './store';
import { getSupportedBlock, isFseMode } from './supported-blocks';
import { useGlobalStylesRecord } from './use-global-styles-record';

/**
 * The unique ID the style component renders under.
 */
export const PLACEHOLDER = 'site-rules';

/**
 * Block name => the last inputs and their CSS, shared by every instance.
 */
const cache = new Map();

/**
 * Splits CSS into rules, each rule inside a media query wrapped in its own.
 *
 * @param {string} css Minified CSS.
 * @return {string[]} The rules.
 */
export function splitRules(css) {
	const rules = [];

	for (const [, media, body, rule] of css.matchAll(/(@media[^{]+)\{((?:[^{}]+\{[^}]*\})*)\}|([^{}@]+\{[^}]*\})/g)) {
		if (rule) {
			rules.push(rule.trim());
			continue;
		}

		for (const [inner] of body.matchAll(/[^{}]+\{[^}]*\}/g)) {
			rules.push(`${media.trim()}{${inner.trim()}}`);
		}
	}

	return rules;
}

/**
 * Keeps the rules the site values add, with the instance classes replaced.
 *
 * @param {string}                 before    CSS with the block's defaults.
 * @param {string}                 after     CSS with the defaults plus the site values.
 * @param {Object<string, string>} selectors Instance selector => site selector.
 * @return {string} The site rules.
 */
export function siteRulesFrom(before, after, selectors) {
	const existing = new Set(splitRules(before));
	let css = splitRules(after)
		.filter((rule) => !existing.has(rule))
		.join('');

	Object.entries(selectors).forEach(([instance, site]) => {
		css = css.split(instance).join(site);
	});

	return css;
}

/**
 * @param {Function} StyleComponent The block's style component.
 * @param {Object}   attributes     The attributes to render.
 * @param {string}   previewDevice  The editor's preview device.
 * @return {string} The CSS the component prints.
 */
function renderedCss(StyleComponent, attributes, previewDevice) {
	const container = document.createElement('div');
	const root = createRoot(container);

	// The component's helpers call hooks, so it is rendered rather than called.
	flushSync(() => root.render(<StyleComponent attributes={attributes} previewDevice={previewDevice} />));
	const css = container.textContent;
	root.unmount();

	return css;
}

/**
 * @param {string}   name           Block name.
 * @param {Function} StyleComponent The block's style component.
 * @param {Function} selectors      (placeholder, style) => instance selector => site selector.
 * @param {Object}   record         The edited Global Styles record.
 * @param {string}   previewDevice  The editor's preview device.
 * @return {string} The block's site rules, empty without Kadence-only site values.
 */
function siteRulesCss(name, StyleComponent, selectors, record, previewDevice) {
	const block = getSupportedBlock(name);
	const site = omit(siteAttributes(record, name), [...block.overlay, ...Object.keys(block.attributesMap)]);
	const key = JSON.stringify([site, previewDevice]);

	if (cache.get(name)?.key === key) {
		return cache.get(name).css;
	}

	let css = '';

	if (!isEmpty(site)) {
		const definitions = getBlockType(name)?.attributes || {};
		const defaults = {};

		Object.entries(definitions).forEach(([attribute, definition]) => {
			if ('default' in definition) {
				defaults[attribute] = definition.default;
			}
		});
		defaults.uniqueID = PLACEHOLDER;

		const { scope } = block;
		const styles = scope
			? [...new Set([definitions[scope.attribute]?.default, ...Object.keys(scope.attributes)])]
			: [undefined];

		styles.forEach((style) => {
			const base = scope ? { ...defaults, [scope.attribute]: style } : defaults;
			const values = scope ? scopeSiteAttributes(site, base, scope, style) : site;

			if (!isEmpty(values)) {
				css += siteRulesFrom(
					renderedCss(StyleComponent, base, previewDevice),
					renderedCss(StyleComponent, { ...base, ...values }, previewDevice),
					selectors(PLACEHOLDER, style)
				);
			}
		});
	}

	cache.set(name, { key, css });

	return css;
}

/**
 * @param {Document} doc The document to write to.
 * @param {string}   id  The style element's ID.
 * @param {string}   css The CSS, empty to remove the element.
 */
function writeToHead(doc, id, css) {
	const existing = doc.getElementById(id);

	if (!css) {
		existing?.remove();
		return;
	}

	const style = existing || doc.createElement('style');
	style.id = id;
	style.textContent = css;
	// Moved to the end on every write, after any stylesheet added since.
	doc.head.appendChild(style);
}

/**
 * @param {Object}   props                The component props.
 * @param {string}   props.name           Block name.
 * @param {Function} props.StyleComponent The block's style component, which takes `attributes` and `previewDevice`.
 * @param {Function} props.selectors      (placeholder, style) => instance selector => site selector.
 * @return {Element} An empty style element that marks the document.
 */
function SiteRulesStyle({ name, StyleComponent, selectors }) {
	const record = useGlobalStylesRecord();
	const previewDevice = useSelect((select) => select('kadenceblocks/data').getPreviewDeviceType(), []);
	const ref = useRefEffect(
		(node) => {
			let active = Boolean(record);

			// After the commit: React can't render the off-screen style component while it commits.
			queueMicrotask(() => {
				if (active) {
					writeToHead(
						node.ownerDocument,
						`kadence-blocks-site-rules-${getSupportedBlock(name).slug}`,
						siteRulesCss(name, StyleComponent, selectors, record, previewDevice)
					);
				}
			});

			return () => {
				active = false;
			};
		},
		[name, StyleComponent, selectors, record, previewDevice]
	);

	return <style ref={ref} />;
}

/**
 * Prints the block's site rules in FSE mode, for a supported block.
 *
 * @param {Object} props The `SiteRulesStyle` props.
 * @return {Element|null} The style marker, or nothing.
 */
export default function SiteRules(props) {
	if (!isFseMode() || !getSupportedBlock(props.name)) {
		return null;
	}

	return <SiteRulesStyle {...props} />;
}
