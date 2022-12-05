/**
 * Move Icon List Items Component
 *
 */
import { flow } from 'lodash';
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Toolbar,
} from '@wordpress/components';

/**
 * Build the icon list move controls
 */
class MoveItem extends Component {
	constructor() {
		super( ...arguments );
	}
	componentDidMount() {
	}
	render() {
		const {
			onMoveRight,
			onMoveLeft,
			level
		} = this.props;

		return (
			<Toolbar>
				<DropdownMenu
					className="block-editor-block-settings-menu"
					icon={ 'move' }
					label={ __( 'Move items', 'kadence-blocks' ) }
					popoverProps={ {
						className: 'block-editor-block-settings-menu__popover',
						position: 'bottom right',
					} }
				>
					{ ( { onClose } ) => (
						<Fragment>
							<MenuGroup>
								<MenuItem
									icon={ 'arrow-left' }
									disabled={ level === 0}
									onClick={ flow( onClose, onMoveLeft ) }
									label={ __( 'Decrease Indent', 'kadence-blocks' ) }
								>
									{ __( 'Decrease Indent', 'kadence-blocks' ) }
								</MenuItem>
								<MenuItem
									icon={ 'arrow-right' }
									onClick={ flow( onClose, onMoveRight ) }
									disabled={ level === 5 }
									label={ __( 'Increase Indent', 'kadence-blocks' ) }
								>
									{ __( 'Increase Indent', 'kadence-blocks' ) }
								</MenuItem>
							</MenuGroup>
						</Fragment>
					) }
				</DropdownMenu>
			</Toolbar>
		);
	}
}
export default ( MoveItem );
