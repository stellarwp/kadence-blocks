const {
	Toolbar
} = wp.components

const { BlockControls } = wp.blockEditor;

const {
	Component,
	Fragment,
} = wp.element;

const { __, sprintf } = wp.i18n;

class Controls extends Component {
	constructor() {
		super( ...arguments );
	}

	render () {
		const {
            clientId,
            attributes,
            className,
            isSelected,
            setAttributes,
        } = this.props;


        const {
        	alignItems
        } = attributes


		const toolbarControls = [

			{
				isActive: alignItems == 'left',
				icon: 'align-left',
				title: __( 'Content align left', 'frontrom' ),
				onClick: () => {
					setAttributes({ alignItems: 'left' });
				}
			},

			{
				isActive: alignItems == 'right',
				icon: 'align-right',
				title: __( 'Content align right', 'frontrom' ),
				onClick: () => {
					setAttributes({ alignItems: 'right' });
				}
			},

			{
				isActive: alignItems == 'center',
				icon: 'align-center',
				title: __( 'Content align center', 'frontrom' ),
				onClick: () => {
					setAttributes({ alignItems: 'center' });
				}
			},
		];

		const toolbarControls2 = [
			{
				icon: 'plus',
				title: __( 'Add Row', 'frontrom' ),
				isActive: false,
				onClick: () => {
					let row = createBlock( 'frontrom/row' );
					let block = select( 'core/block-editor' ).getBlock( clientId );
					let index = block.innerBlocks.length;

					dispatch('core/block-editor').insertBlock( row, index+1, clientId );
				}
			}
		];

		return (

			<Fragment>
				<BlockControls>
					<Toolbar
						isCollapsed={ true }
						icon='align-center'
						controls={ toolbarControls }
					/>

				</BlockControls>

			</Fragment>
		)
	}
}

export default Controls;


