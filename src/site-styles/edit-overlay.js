/**
 * Renders supported blocks in the editor with their site-level values merged
 * in, and keeps those values out of what the block stores.
 */
import { createHigherOrderComponent } from '@wordpress/compose';
import { getBlockType } from '@wordpress/blocks';
import { useCallback, useMemo } from '@wordpress/element';
import { getSupportedBlock, isFseMode } from './supported-blocks';
import { guardWrite, mergeAttributes, siteAttributes } from './store';
import { useGlobalStylesRecord } from './use-global-styles-record';
import { isVirtualBlock } from './virtual-blocks';

/**
 * @param {Object}   props           The block edit props plus the wrapped component.
 * @param {Function} props.BlockEdit The wrapped block edit component.
 * @return {Element} The block edit with merged attributes and a guarded `setAttributes`.
 */
function SiteStylesBlockEdit({ BlockEdit, ...props }) {
	const { name, attributes, setAttributes } = props;
	const record = useGlobalStylesRecord();
	const site = useMemo(() => siteAttributes(record, name), [record, name]);
	const hasSiteValues = Object.keys(site).length > 0;
	const shown = useMemo(
		() => (hasSiteValues ? mergeAttributes(attributes, site, getBlockType(name)?.attributes || {}) : attributes),
		[hasSiteValues, attributes, site, name]
	);
	const guardedSetAttributes = useCallback(
		(written) => {
			const next = typeof written === 'function' ? written(shown) : written;
			const kept = guardWrite(next, shown, attributes, site);

			if (Object.keys(kept).length) {
				setAttributes(kept);
			}
		},
		[shown, attributes, site, setAttributes]
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
