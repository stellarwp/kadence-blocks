/**
 * Copy and Paste Block Styles Component
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
	ToggleControl,
	ToolbarDropdownMenu,
	SelectControl,
} = wp.components;
const {
	localStorage,
} = window;

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	position: 'bottom right',
};
/**
 * Build the copy and paste controls
 * @returns {object} copy and paste settings.
 */
class ColumnStyleCopyPaste extends Component {
	constructor() {
		super( ...arguments );
		this.state = {
			iconOptions: [],
			iconOptionsNames: [],
		};
	}
	componentDidMount() {
	}
	render() {
		const {
			onPaste,
			blockAttributes,
		} = this.props;
		const copyIcon = <svg
			xmlns="http://www.w3.org/2000/svg"
			fillRule="evenodd"
			strokeLinejoin="round"
			strokeMiterlimit="2"
			clipRule="evenodd"
			viewBox="0 0 32 32"
			width="20px"
			height="20px"
		>
			<path
				fillRule="nonzero"
				d="M26 8h-6V6l-6-6H0v24h12v8h20V14l-6-6zm0 2.828L29.172 14H26v-3.172zm-12-8L17.172 6H14V2.828zM2 2h10v6h6v14H2V2zm28 28H14v-6h6V10h4v6h6v14z"
			></path>
		</svg>;
		const headingCopiedStyles = JSON.parse( localStorage.getItem( 'kadenceColumnStyle' ) );
		const copyAction = () => {
			const copyStyles = {};
			if ( blockAttributes.topPadding || blockAttributes.topPadding === 0 ) {
				copyStyles.topPadding = blockAttributes.topPadding;
			}
			if ( blockAttributes.bottomPadding || blockAttributes.bottomPadding === 0 ) {
				copyStyles.bottomPadding = blockAttributes.bottomPadding;
			}
			if ( blockAttributes.leftPadding || blockAttributes.leftPadding === 0 ) {
				copyStyles.leftPadding = blockAttributes.leftPadding;
			}
			if ( blockAttributes.rightPadding || blockAttributes.rightPadding === 0 ) {
				copyStyles.rightPadding = blockAttributes.rightPadding;
			}
			if ( blockAttributes.topPaddingM || blockAttributes.topPaddingM === 0 ) {
				copyStyles.topPaddingM = blockAttributes.topPaddingM;
			}
			if ( blockAttributes.bottomPaddingM || blockAttributes.bottomPaddingM === 0 ) {
				copyStyles.bottomPaddingM = blockAttributes.bottomPaddingM;
			}
			if ( blockAttributes.leftPaddingM || blockAttributes.leftPaddingM === 0 ) {
				copyStyles.leftPaddingM = blockAttributes.leftPaddingM;
			}
			if ( blockAttributes.rightPaddingM || blockAttributes.rightPaddingM === 0 ) {
				copyStyles.rightPaddingM = blockAttributes.rightPaddingM;
			}
			if ( blockAttributes.topMargin || blockAttributes.topMargin === 0 ) {
				copyStyles.topMargin = blockAttributes.topMargin;
			}
			if ( blockAttributes.bottomMargin || blockAttributes.bottomMargin === 0 ) {
				copyStyles.bottomMargin = blockAttributes.bottomMargin;
			}
			if ( blockAttributes.topMarginM || blockAttributes.topMarginM === 0 ) {
				copyStyles.topMarginM = blockAttributes.topMarginM;
			}
			if ( blockAttributes.bottomMarginM || blockAttributes.bottomMarginM === 0 ) {
				copyStyles.bottomMarginM = blockAttributes.bottomMarginM;
			}
			if ( blockAttributes.leftMargin || blockAttributes.leftMargin === 0 ) {
				copyStyles.leftMargin = blockAttributes.leftMargin;
			}
			if ( blockAttributes.rightMargin || blockAttributes.rightMargin === 0 ) {
				copyStyles.rightMargin = blockAttributes.rightMargin;
			}
			if ( blockAttributes.leftMarginM || blockAttributes.leftMarginM === 0 ) {
				copyStyles.leftMarginM = blockAttributes.leftMarginM;
			}
			if ( blockAttributes.rightMarginM || blockAttributes.rightMarginM === 0 ) {
				copyStyles.rightMarginM = blockAttributes.rightMarginM;
			}
			if ( blockAttributes.zIndex ) {
				copyStyles.zIndex = blockAttributes.zIndex;
			}
			if ( blockAttributes.background ) {
				copyStyles.background = blockAttributes.background;
			}
			if ( blockAttributes.backgroundOpacity ) {
				copyStyles.backgroundOpacity = blockAttributes.backgroundOpacity;
			}
			if ( blockAttributes.border ) {
				copyStyles.border = blockAttributes.border;
			}
			if ( blockAttributes.borderOpacity ) {
				copyStyles.borderOpacity = blockAttributes.borderOpacity;
			}
			if ( blockAttributes.borderWidth ) {
				copyStyles.borderWidth = blockAttributes.borderWidth;
			}
			if ( blockAttributes.tabletBorderWidth ) {
				copyStyles.tabletBorderWidth = blockAttributes.tabletBorderWidth;
			}
			if ( blockAttributes.mobileBorderWidth ) {
				copyStyles.mobileBorderWidth = blockAttributes.mobileBorderWidth;
			}
			if ( blockAttributes.borderRadius ) {
				copyStyles.borderRadius = blockAttributes.borderRadius;
			}
			if ( blockAttributes.backgroundImg ) {
				copyStyles.backgroundImg = blockAttributes.backgroundImg;
			}
			if ( blockAttributes.textAlign ) {
				copyStyles.textAlign = blockAttributes.textAlign;
			}
			if ( blockAttributes.textColor ) {
				copyStyles.textColor = blockAttributes.textColor;
			}
			if ( blockAttributes.linkColor ) {
				copyStyles.linkColor = blockAttributes.linkColor;
			}
			if ( blockAttributes.linkHoverColor ) {
				copyStyles.linkHoverColor = blockAttributes.linkHoverColor;
			}
			if ( blockAttributes.topPaddingT || blockAttributes.bottomPadding === 0 ) {
				copyStyles.topPaddingT = blockAttributes.topPaddingT;
			}
			if ( blockAttributes.bottomPaddingT || blockAttributes.bottomPaddingT === 0 ) {
				copyStyles.bottomPaddingT = blockAttributes.bottomPaddingT;
			}
			if ( blockAttributes.leftPaddingT || blockAttributes.leftPaddingT === 0 ) {
				copyStyles.leftPaddingT = blockAttributes.leftPaddingT;
			}
			if ( blockAttributes.rightPaddingT || blockAttributes.rightPaddingT === 0 ) {
				copyStyles.rightPaddingT = blockAttributes.rightPaddingT;
			}
			if ( blockAttributes.topMarginT || blockAttributes.topMarginT === 0 ) {
				copyStyles.topMarginT = blockAttributes.topMarginT;
			}
			if ( blockAttributes.bottomMarginT || blockAttributes.bottomMarginT === 0 ) {
				copyStyles.bottomMarginT = blockAttributes.bottomMarginT;
			}
			if ( blockAttributes.leftMarginT || blockAttributes.leftMarginT === 0 ) {
				copyStyles.leftMarginT = blockAttributes.leftMarginT;
			}
			if ( blockAttributes.rightMarginT || blockAttributes.rightMarginT === 0 ) {
				copyStyles.rightMarginT = blockAttributes.rightMarginT;
			}
			if ( blockAttributes.marginType ) {
				copyStyles.marginType = blockAttributes.marginType;
			}
			if ( blockAttributes.paddingType ) {
				copyStyles.paddingType = blockAttributes.paddingType;
			}
			if ( blockAttributes.displayShadow ) {
				copyStyles.displayShadow = blockAttributes.displayShadow;
			}
			if ( blockAttributes.shadow ) {
				copyStyles.shadow = blockAttributes.shadow;
			}
			if ( blockAttributes.vsdesk ) {
				copyStyles.vsdesk = blockAttributes.vsdesk;
			}
			if ( blockAttributes.vstablet ) {
				copyStyles.vstablet = blockAttributes.vstablet;
			}
			if ( blockAttributes.vsmobile ) {
				copyStyles.vsmobile = blockAttributes.vsmobile;
			}
			if ( blockAttributes.direction ) {
				copyStyles.direction = blockAttributes.direction;
			}
			if ( blockAttributes.gutter ) {
				copyStyles.gutter = blockAttributes.gutter;
			}
			if ( blockAttributes.gutterUnit ) {
				copyStyles.gutterUnit = blockAttributes.gutterUnit;
			}
			if ( blockAttributes.verticalAlignment ) {
				copyStyles.verticalAlignment = blockAttributes.verticalAlignment;
			}
			if ( blockAttributes.justifyContent ) {
				copyStyles.justifyContent = blockAttributes.justifyContent;
			}
			if ( blockAttributes.backgroundImgHover ) {
				copyStyles.backgroundImgHover = blockAttributes.backgroundImgHover;
			}
			if ( blockAttributes.backgroundHover ) {
				copyStyles.backgroundHover = blockAttributes.backgroundHover;
			}
			if ( blockAttributes.borderHover ) {
				copyStyles.borderHover = blockAttributes.borderHover;
			}
			if ( blockAttributes.borderHoverWidth ) {
				copyStyles.borderHoverWidth = blockAttributes.borderHoverWidth;
			}
			if ( blockAttributes.tabletBorderHoverWidth ) {
				copyStyles.tabletBorderHoverWidth = blockAttributes.tabletBorderHoverWidth;
			}
			if ( blockAttributes.mobileBorderHoverWidth ) {
				copyStyles.mobileBorderHoverWidth = blockAttributes.mobileBorderHoverWidth;
			}
			if ( blockAttributes.borderHoverRadius ) {
				copyStyles.borderHoverRadius = blockAttributes.borderHoverRadius;
			}
			if ( blockAttributes.displayHoverShadow ) {
				copyStyles.displayHoverShadow = blockAttributes.displayHoverShadow;
			}
			if ( blockAttributes.shadowHover ) {
				copyStyles.shadowHover = blockAttributes.shadowHover;
			}
			if ( blockAttributes.textColorHover ) {
				copyStyles.textColorHover = blockAttributes.textColorHover;
			}
			if ( blockAttributes.linkColorHover ) {
				copyStyles.linkColorHover = blockAttributes.linkColorHover;
			}
			if ( blockAttributes.linkHoverColorHover ) {
				copyStyles.linkHoverColorHover = blockAttributes.linkHoverColorHover;
			}
			if ( blockAttributes.maxWidth ) {
				copyStyles.maxWidth = blockAttributes.maxWidth;
			}
			if ( blockAttributes.maxWidthUnit ) {
				copyStyles.maxWidthUnit = blockAttributes.maxWidthUnit;
			}
			if ( blockAttributes.height ) {
				copyStyles.height = blockAttributes.height;
			}
			if ( blockAttributes.heightUnit ) {
				copyStyles.heightUnit = blockAttributes.heightUnit;
			}
			if ( blockAttributes.htmlTag ) {
				copyStyles.htmlTag = blockAttributes.htmlTag;
			}
			localStorage.setItem( 'kadenceColumnStyle', JSON.stringify( copyStyles ) );
		};
		const pasteAction = () => {
			const pasteItem = JSON.parse( localStorage.getItem( 'kadenceColumnStyle' ) );
			if ( pasteItem ) {
				onPaste( pasteItem );
			}
		};
		return (
			<Toolbar>
				<DropdownMenu
					className="block-editor-block-settings-menu"
					icon={ copyIcon }
					label={ __( 'Copy/Paste Styles', 'kadence-blocks' ) }
					popoverProps={ POPOVER_PROPS }
				>
					{ ( { onClose } ) => (
						<Fragment>
							<MenuGroup>
								<MenuItem
									icon={ 'clipboard' }
									onClick={ flow( onClose, copyAction ) }
									label={ __( 'Copy Styles', 'kadence-blocks' ) }
								>
									{ __( 'Copy Styles', 'kadence-blocks' ) }
								</MenuItem>
								<MenuItem
									icon={ 'editor-paste-text' }
									onClick={ flow( onClose, pasteAction ) }
									disabled={ ! headingCopiedStyles }
									label={ __( 'Paste Styles', 'kadence-blocks' ) }
								>
									{ __( 'Paste Styles', 'kadence-blocks' ) }
								</MenuItem>
							</MenuGroup>
						</Fragment>
					) }
				</DropdownMenu>
			</Toolbar>
		);
	}
}
export default ( ColumnStyleCopyPaste );
