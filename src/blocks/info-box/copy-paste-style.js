/**
 * Copy and Paste Block Styles Component
 *
 */
import flow from 'lodash/flow';
const { __ } = wp.i18n;
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
class InfoBoxStyleCopyPaste extends Component {
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
			onPasteMediaImage,
			onPasteMediaIcon,
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
		const infoboxCopiedStyles = JSON.parse( localStorage.getItem( 'kadenceInfoboxStyle' ) );
		const copyAction = () => {
			const copyStyles = {};
			if ( blockAttributes.linkProperty ) {
				copyStyles.linkProperty = blockAttributes.linkProperty;
			}
			if ( blockAttributes.target ) {
				copyStyles.target = blockAttributes.target;
			}
			if ( blockAttributes.hAlign ) {
				copyStyles.hAlign = blockAttributes.hAlign;
			}
			if ( blockAttributes.hAlignTablet ) {
				copyStyles.hAlignTablet = blockAttributes.hAlignTablet;
			}
			if ( blockAttributes.hAlignMobile ) {
				copyStyles.hAlignMobile = blockAttributes.hAlignMobile;
			}
			if ( blockAttributes.containerBackground ) {
				copyStyles.containerBackground = blockAttributes.containerBackground;
			}
			if ( blockAttributes.containerBackgroundOpacity ) {
				copyStyles.containerBackgroundOpacity = blockAttributes.containerBackgroundOpacity;
			}
			if ( blockAttributes.containerHoverBackground ) {
				copyStyles.containerHoverBackground = blockAttributes.containerHoverBackground;
			}
			if ( blockAttributes.containerHoverBackgroundOpacity ) {
				copyStyles.containerHoverBackgroundOpacity = blockAttributes.containerHoverBackgroundOpacity;
			}
			if ( blockAttributes.containerBorder ) {
				copyStyles.containerBorder = blockAttributes.containerBorder;
			}
			if ( blockAttributes.containerBorderOpacity ) {
				copyStyles.containerBorderOpacity = blockAttributes.containerBorderOpacity;
			}
			if ( blockAttributes.containerHoverBorder ) {
				copyStyles.containerHoverBorder = blockAttributes.containerHoverBorder;
			}
			if ( blockAttributes.containerHoverBorderOpacity ) {
				copyStyles.containerHoverBorderOpacity = blockAttributes.containerHoverBorderOpacity;
			}
			if ( blockAttributes.containerBorderWidth ) {
				copyStyles.containerBorderWidth = blockAttributes.containerBorderWidth;
			}
			if ( undefined !== blockAttributes.containerBorderRadius && ! isNaN( blockAttributes.containerBorderRadius ) ) {
				copyStyles.containerBorderRadius = blockAttributes.containerBorderRadius;
			}
			if ( blockAttributes.containerPadding ) {
				copyStyles.containerPadding = blockAttributes.containerPadding;
			}
			if ( blockAttributes.mediaType ) {
				copyStyles.mediaType = blockAttributes.mediaType;
			}
			if ( blockAttributes.mediaAlign ) {
				copyStyles.mediaAlign = blockAttributes.mediaAlign;
			}
			if ( blockAttributes.mediaImage ) {
				if ( blockAttributes.mediaImage[ 0 ] && blockAttributes.mediaImage[ 0 ].maxWidth ) {
					copyStyles.mediaImage = [ {
						maxWidth: blockAttributes.mediaImage[ 0 ].maxWidth,
					} ];
					if ( blockAttributes.mediaImage[ 0 ].hoverAnimation ) {
						copyStyles.mediaImage[ 0 ].hoverAnimation = blockAttributes.mediaImage[ 0 ].hoverAnimation;
					}
				}
			}
			if ( blockAttributes.mediaIcon ) {
				if ( blockAttributes.mediaIcon[ 0 ] ) {
					copyStyles.mediaIcon = [ {
						hoverAnimation: 'none',
					} ];
					if ( blockAttributes.mediaIcon[ 0 ].size ) {
						copyStyles.mediaIcon[ 0 ].size = blockAttributes.mediaIcon[ 0 ].size;
					}
					if ( blockAttributes.mediaIcon[ 0 ].width ) {
						copyStyles.mediaIcon[ 0 ].width = blockAttributes.mediaIcon[ 0 ].width;
					}
					if ( blockAttributes.mediaIcon[ 0 ].color ) {
						copyStyles.mediaIcon[ 0 ].color = blockAttributes.mediaIcon[ 0 ].color;
					}
					if ( blockAttributes.mediaIcon[ 0 ].hoverColor ) {
						copyStyles.mediaIcon[ 0 ].hoverColor = blockAttributes.mediaIcon[ 0 ].hoverColor;
					}
					if ( blockAttributes.mediaIcon[ 0 ].hoverAnimation ) {
						copyStyles.mediaIcon[ 0 ].hoverAnimation = blockAttributes.mediaIcon[ 0 ].hoverAnimation;
					}
				}
			}
			if ( blockAttributes.mediaStyle ) {
				copyStyles.mediaStyle = blockAttributes.mediaStyle;
			}
			if ( blockAttributes.displayTitle ) {
				copyStyles.displayTitle = blockAttributes.displayTitle;
			}
			if ( blockAttributes.titleColor ) {
				copyStyles.titleColor = blockAttributes.titleColor;
			}
			if ( blockAttributes.titleHoverColor ) {
				copyStyles.titleHoverColor = blockAttributes.titleHoverColor;
			}
			if ( blockAttributes.titleMinHeight ) {
				copyStyles.titleMinHeight = blockAttributes.titleMinHeight;
			}
			if ( blockAttributes.titleFont ) {
				copyStyles.titleFont = blockAttributes.titleFont;
			}
			if ( blockAttributes.displayText ) {
				copyStyles.displayText = blockAttributes.displayText;
			}
			if ( blockAttributes.textColor ) {
				copyStyles.textColor = blockAttributes.textColor;
			}
			if ( blockAttributes.textHoverColor ) {
				copyStyles.textHoverColor = blockAttributes.textHoverColor;
			}
			if ( blockAttributes.textMinHeight ) {
				copyStyles.textMinHeight = blockAttributes.textMinHeight;
			}
			if ( blockAttributes.textFont ) {
				copyStyles.textFont = blockAttributes.textFont;
			}
			if ( blockAttributes.displayLearnMore ) {
				copyStyles.displayLearnMore = blockAttributes.displayLearnMore;
			}
			if ( blockAttributes.learnMoreStyles ) {
				copyStyles.learnMoreStyles = blockAttributes.learnMoreStyles;
			}
			if ( blockAttributes.displayShadow ) {
				copyStyles.displayShadow = blockAttributes.displayShadow;
			}
			if ( blockAttributes.shadow ) {
				copyStyles.shadow = blockAttributes.shadow;
			}
			if ( blockAttributes.shadowHover ) {
				copyStyles.shadowHover = blockAttributes.shadowHover;
			}
			if ( blockAttributes.mediaVAlign ) {
				copyStyles.mediaVAlign = blockAttributes.mediaVAlign;
			}
			if ( blockAttributes.mediaAlignMobile ) {
				copyStyles.mediaAlignMobile = blockAttributes.mediaAlignMobile;
			}
			if ( blockAttributes.mediaAlignTablet ) {
				copyStyles.mediaAlignTablet = blockAttributes.mediaAlignTablet;
			}
			if ( blockAttributes.maxWidth ) {
				copyStyles.maxWidth = blockAttributes.maxWidth;
			}
			if ( blockAttributes.maxWidthUnit ) {
				copyStyles.maxWidthUnit = blockAttributes.maxWidthUnit;
			}
			if ( blockAttributes.containerMargin ) {
				copyStyles.containerMargin = blockAttributes.containerMargin;
			}
			if ( blockAttributes.containerMarginUnit ) {
				copyStyles.containerMarginUnit = blockAttributes.containerMarginUnit;
			}
			localStorage.setItem( 'kadenceInfoboxStyle', JSON.stringify( copyStyles ) );
		};
		const pasteAction = () => {
			const pasteItem = JSON.parse( localStorage.getItem( 'kadenceInfoboxStyle' ) );
			if ( pasteItem ) {
				if ( pasteItem.mediaImage ) {
					onPasteMediaImage( pasteItem.mediaImage[ 0 ] );
					delete pasteItem.mediaImage;
				}
				if ( pasteItem.mediaIcon ) {
					onPasteMediaIcon( pasteItem.mediaIcon[ 0 ] );
					delete pasteItem.mediaIcon;
				}
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
									disabled={ ! infoboxCopiedStyles }
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
export default ( InfoBoxStyleCopyPaste );
