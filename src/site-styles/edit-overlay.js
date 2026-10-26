/**
 * Renders supported blocks in the editor with the site-level values they list
 * for the overlay merged in, and keeps those values out of what the block
 * stores. Core's Global Styles and the block's site rules render the rest.
 *
 * The one exception is a change that starts an instance setting one of its
 * block's groups or cascades, such as a button's padding: the whole group or
 * cascade is then stored as shown, so the block keeps looking as it did apart
 * from the change.
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { getBlockType } from '@wordpress/blocks';
import { useRegistry } from '@wordpress/data';
import { useCallback, useMemo } from '@wordpress/element';
import { pick } from 'lodash';
import { getSupportedBlock, isFseMode } from './supported-blocks';
import {
	groupSiteAttributes,
	guardWrite,
	mergeAttributes,
	scopeSiteAttributes,
	siteAttributes,
	withoutOverridden,
} from './store';
import { scopeStyle } from './scope-style';
import { useGlobalStylesRecord } from './use-global-styles-record';
import { isVirtualBlock } from './virtual-blocks';

/**
 * The site values an instance takes: the overlay values in the record, scoped
 * by the instance's style and without the groups it sets itself and the
 * values its own ones cover.
 *
 * @param {Object}            record     The edited Global Styles record.
 * @param {string}            name       Block name.
 * @param {Object<string, *>} attributes The instance's stored attributes.
 *
 * @since TBD
 *
 * @return {Object<string, *>} Attribute name => site value.
 */
function instanceSiteAttributes(record, name, attributes) {
	const { scope, overlay, groups, legacyGroups, cascades } = getSupportedBlock(name);
	const definitions = getBlockType(name)?.attributes || {};
	let values = pick(siteAttributes(record, name), overlay);

	if (scope) {
		values = scopeSiteAttributes(
			values,
			{ [scope.attribute]: scopeStyle(name, attributes, scope) },
			scope,
			definitions[scope.attribute]?.default
		);
	}

	if (groups) {
		values = groupSiteAttributes(values, attributes, groups, definitions, legacyGroups);
	}

	return cascades ? withoutOverridden(values, attributes, definitions, cascades) : values;
}

/**
 * @param {Object}   props           The block edit props plus the wrapped component.
 * @param {Function} props.BlockEdit The wrapped block edit component.
 * @return {Element} The block edit with merged attributes and a guarded `setAttributes`.
 */
function SiteStylesBlockEdit({ BlockEdit, ...props }) {
	const { name, clientId, attributes, setAttributes } = props;
	const record = useGlobalStylesRecord();
	const registry = useRegistry();
	const site = useMemo(() => instanceSiteAttributes(record, name, attributes), [record, name, attributes]);
	const hasSiteValues = Object.keys(site).length > 0;
	const shown = useMemo(
		() => (hasSiteValues ? mergeAttributes(attributes, site, getBlockType(name)?.attributes || {}) : attributes),
		[hasSiteValues, attributes, site, name]
	);
	const guardedSetAttributes = useCallback(
		(written) => {
			// The stored attributes as of this write, not the last render: a second write before a re-render
			// has to see the first, or it would start a group again from the values the first one replaced.
			const stored = registry.select('core/block-editor').getBlockAttributes(clientId) || attributes;
			const definitions = getBlockType(name)?.attributes || {};
			const storedSite = stored === attributes ? site : instanceSiteAttributes(record, name, stored);
			const storedShown = stored === attributes ? shown : mergeAttributes(stored, storedSite, definitions);
			const next = typeof written === 'function' ? written(storedShown) : written;
			const { groups, legacyGroups, cascades } = getSupportedBlock(name);
			const kept = guardWrite(next, storedShown, stored, storedSite, groups, definitions, legacyGroups, cascades);

			if (Object.keys(kept).length) {
				setAttributes(kept);
			}
		},
		[registry, clientId, attributes, site, shown, record, name, setAttributes]
	);

	if (!hasSiteValues) {
		return <BlockEdit {...props} />;
	}

	return <BlockEdit {...props} attributes={shown} setAttributes={guardedSetAttributes} />;
}

/**
 * The `editor.BlockEdit` filter: wraps supported blocks in FSE mode, except
 * the Kadence panel's virtual and preview blocks.
 */
export const withSiteStyles = createHigherOrderComponent(
	(BlockEdit) => (props) => {
		if (!isFseMode() || !getSupportedBlock(props.name) || isVirtualBlock(props.clientId)) {
			return <BlockEdit {...props} />;
		}

		return <SiteStylesBlockEdit {...props} BlockEdit={BlockEdit} />;
	},
	'withSiteStyles'
);
