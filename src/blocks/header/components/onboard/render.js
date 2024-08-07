import { useEntityBlockEditor } from '@wordpress/core-data';
import { BlockPreview } from '@wordpress/block-editor';
import { get } from 'lodash';

const HeaderRender = ({ id }) => {
	const [blocks] = useEntityBlockEditor('postType', 'kadence_header', { id });

	const desktopBlocks = get(blocks, [0, 'innerBlocks', 0], []);

	return <BlockPreview blocks={desktopBlocks} viewportWidth={1400} />;
};

export default HeaderRender;
