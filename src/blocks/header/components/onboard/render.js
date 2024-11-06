import { useEntityBlockEditor, useEntityProp } from '@wordpress/core-data';
import { BlockPreview } from '@wordpress/block-editor';
import { get } from 'lodash';

const HeaderRender = ({ id }) => {
	const [blocks] = useEntityBlockEditor('postType', 'kadence_header', { id });
	const [meta] = useEntityProp('postType', 'kadence_header', 'meta', id);

	const desktopBlocks = get(blocks, [0, 'innerBlocks', 0], []);
	// Give transparent headers a background
	const additionalStyles =
		meta?._kad_header_isTransparent && meta?._kad_header_isTransparent === '1'
			? [
					{
						css: '.kadence-header-row-inner { background: linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(135deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(135deg, transparent 75%, #ccc 75%); background-size: 25px 25px; background-position: 0 0, 12.5px 0, 12.5px -12.5px, 0px 12.5px; }',
					},
			  ]
			: [];

	return <BlockPreview blocks={desktopBlocks} viewportWidth={1400} additionalStyles={additionalStyles} />;
};

export default HeaderRender;
