import classnames from 'classnames';

const {
	Component,
	Fragment,
} = wp.element;

const {
	InnerBlocks
} = wp.blockEditor

const save = ( { attributes } ) => {
	return (
		<Fragment>
			<div className={ classnames( 'kt-restaurent-menu' ) }>
				<InnerBlocks.Content />
			</div>
		</Fragment>
	);
};

export default save;
