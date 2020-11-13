
const {
	InnerBlocks
} = wp.blockEditor

const save = ( { attributes } ) => {
	return (
		<Fragment>
			<InnerBlocks.Content />
		</Fragment>
	);
};

export default save;
