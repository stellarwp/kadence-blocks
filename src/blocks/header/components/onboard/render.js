import { InnerBlocks } from '@wordpress/block-editor';
import { useEntityBlockEditor } from '@wordpress/core-data';

const HeaderRender = ({ id }) => {
	const [blocks] = useEntityBlockEditor('postType', 'kadence_header', id);

	return (
		<>
			<InnerBlocks blocks={blocks} />
		</>
	);
};

export default HeaderRender;
