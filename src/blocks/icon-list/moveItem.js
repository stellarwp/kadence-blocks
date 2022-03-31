/**
 * Move Icon List Items Component
 *
 */
import flow from 'lodash/flow';
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Toolbar,
} = wp.components;

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
			onMoveUp,
			onMoveDown,
			onMoveRight,
			onMoveLeft,
			focusIndex,
			itemCount,
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
									icon={ 'arrow-up' }
									disabled={ focusIndex === 0 }
									onClick={ flow( onClose, onMoveUp( focusIndex ) ) }
									label={ __( 'Move Up', 'kadence-blocks' ) }
								>
									{ __( 'Move Up', 'kadence-blocks' ) }
								</MenuItem>
								<MenuItem
									icon={ 'arrow-down' }
									disabled={ focusIndex === itemCount - 1 }
									onClick={ flow( onClose, onMoveDown( focusIndex ) ) }
									label={ __( 'Move Down', 'kadence-blocks' ) }
								>
									{ __( 'Move Down', 'kadence-blocks' ) }
								</MenuItem>
							</MenuGroup>
							<MenuGroup>
								<MenuItem
									icon={ 'arrow-left' }
									disabled={ level === 0}
									onClick={ flow( onClose, onMoveLeft( focusIndex ) ) }
									label={ __( 'Decrease Indent', 'kadence-blocks' ) }
								>
									{ __( 'Decrease Indent', 'kadence-blocks' ) }
								</MenuItem>
								<MenuItem
									icon={ 'arrow-right' }
									onClick={ flow( onClose, onMoveRight( focusIndex ) ) }
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
