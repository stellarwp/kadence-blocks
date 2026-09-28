/**
 * The Kadence panel's preview: one block with the site values, Normal or Hover.
 */
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import { getBlockType } from '@wordpress/blocks';
import { BlockPreview } from '@wordpress/block-editor';
import {
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import { previewBlocks } from '../../site-styles/preview-blocks';
import { addVirtualBlock, removeVirtualBlock } from '../../site-styles/virtual-blocks';
import { usePreviewHover } from './preview-hover';

/**
 * @param {Object} props            Component props.
 * @param {string} props.blockName  Block name.
 * @param {Object} props.attributes The virtual block's attributes (defaults merged with site values).
 * @return {Element} The preview column.
 */
export default function SiteStylesPreview({ blockName, attributes }) {
	const [hover, setHover] = useState(false);
	const frameRef = useRef(null);
	const { blocks, clientId } = useMemo(() => previewBlocks(blockName, attributes), [blockName, attributes]);

	// The preview block already carries the site values; the editor overlay must skip it.
	useEffect(() => {
		addVirtualBlock(clientId);

		return () => removeVirtualBlock(clientId);
	}, [clientId]);

	usePreviewHover(frameRef, hover, clientId);

	return (
		<div className="kb-site-styles-modal__preview-column">
			<ToggleGroupControl
				label={__('Preview state', 'kadence-blocks')}
				value={hover ? 'hover' : 'normal'}
				onChange={(value) => setHover('hover' === value)}
				isBlock
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			>
				<ToggleGroupControlOption value="normal" label={__('Normal', 'kadence-blocks')} />
				<ToggleGroupControlOption value="hover" label={__('Hover', 'kadence-blocks')} />
			</ToggleGroupControl>
			<div className="kb-site-styles-modal__preview" ref={frameRef}>
				<BlockPreview blocks={blocks} viewportWidth={900} minHeight={160} />
			</div>
			<p className="kb-site-styles-modal__preview-note">
				{sprintf(
					/* translators: %s: block title, e.g. Single Button. */
					__('Every %s on the site without its own value uses these settings.', 'kadence-blocks'),
					getBlockType(blockName)?.title || blockName
				)}
			</p>
		</div>
	);
}
