/**
 * Copy and Paste Block Styles Component
 *
 */
import { flow } from 'lodash';
import { __ } from '@wordpress/i18n';
const { Component, Fragment } = wp.element;
import { DropdownMenu, MenuGroup, MenuItem, ToggleControl, SelectControl } from '@wordpress/components';
const { localStorage } = window;

const POPOVER_PROPS = {
	className: 'block-editor-block-settings-menu__popover',
	placement: 'bottom-end',
};
/**
 * Build the copy and paste controls
 * @returns {object} copy and paste settings.
 */
class ButtonStyleCopyPaste extends Component {
	constructor() {
		super(...arguments);
		this.state = {
			iconOptions: [],
			iconOptionsNames: [],
		};
	}
	componentDidMount() {}
	render() {
		const { onPasteWrap, onPasteButton, blockAttributes, buttonIndex } = this.props;
		const copyIcon = (
			<svg
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
			</svg>
		);
		const buttonCopiedStyles = JSON.parse(localStorage.getItem('kadenceButtonStyle'));
		const copyAction = () => {
			const copyStyles = {};
			if (blockAttributes.btns && blockAttributes.btns[buttonIndex]) {
				copyStyles.btn = [
					{
						size: 'none',
					},
				];
				if (blockAttributes.btns[buttonIndex].size) {
					copyStyles.btn[0].size = blockAttributes.btns[buttonIndex].size;
				}
				if (blockAttributes.btns[buttonIndex].sizeType) {
					copyStyles.btn[0].sizeType = blockAttributes.btns[buttonIndex].sizeType;
				}
				if (blockAttributes.btns[buttonIndex].paddingBT) {
					copyStyles.btn[0].paddingBT = blockAttributes.btns[buttonIndex].paddingBT;
				}
				if (blockAttributes.btns[buttonIndex].paddingLR) {
					copyStyles.btn[0].paddingLR = blockAttributes.btns[buttonIndex].paddingLR;
				}
				if (blockAttributes.btns[buttonIndex].color) {
					copyStyles.btn[0].color = blockAttributes.btns[buttonIndex].color;
				}
				if (blockAttributes.btns[buttonIndex].background) {
					copyStyles.btn[0].background = blockAttributes.btns[buttonIndex].background;
				}
				if (blockAttributes.btns[buttonIndex].border) {
					copyStyles.btn[0].border = blockAttributes.btns[buttonIndex].border;
				}
				if (blockAttributes.btns[buttonIndex].backgroundOpacity) {
					copyStyles.btn[0].backgroundOpacity = blockAttributes.btns[buttonIndex].backgroundOpacity;
				}
				if (blockAttributes.btns[buttonIndex].borderOpacity) {
					copyStyles.btn[0].borderOpacity = blockAttributes.btns[buttonIndex].borderOpacity;
				}
				if (blockAttributes.btns[buttonIndex].borderRadius) {
					copyStyles.btn[0].borderRadius = blockAttributes.btns[buttonIndex].borderRadius;
				}
				if (blockAttributes.btns[buttonIndex].borderWidth) {
					copyStyles.btn[0].borderWidth = blockAttributes.btns[buttonIndex].borderWidth;
				}
				if (blockAttributes.btns[buttonIndex].colorHover) {
					copyStyles.btn[0].colorHover = blockAttributes.btns[buttonIndex].colorHover;
				}
				if (blockAttributes.btns[buttonIndex].backgroundHover) {
					copyStyles.btn[0].backgroundHover = blockAttributes.btns[buttonIndex].backgroundHover;
				}
				if (blockAttributes.btns[buttonIndex].borderHover) {
					copyStyles.btn[0].borderHover = blockAttributes.btns[buttonIndex].borderHover;
				}
				if (blockAttributes.btns[buttonIndex].backgroundHoverOpacity) {
					copyStyles.btn[0].backgroundHoverOpacity = blockAttributes.btns[buttonIndex].backgroundHoverOpacity;
				}
				if (blockAttributes.btns[buttonIndex].borderHoverOpacity) {
					copyStyles.btn[0].borderHoverOpacity = blockAttributes.btns[buttonIndex].borderHoverOpacity;
				}
				if (blockAttributes.btns[buttonIndex].icon) {
					copyStyles.btn[0].icon = blockAttributes.btns[buttonIndex].icon;
				}
				if (blockAttributes.btns[buttonIndex].iconSide) {
					copyStyles.btn[0].iconSide = blockAttributes.btns[buttonIndex].iconSide;
				}
				if (blockAttributes.btns[buttonIndex].iconHover) {
					copyStyles.btn[0].iconHover = blockAttributes.btns[buttonIndex].iconHover;
				}
				if (blockAttributes.btns[buttonIndex].cssClass) {
					copyStyles.btn[0].cssClass = blockAttributes.btns[buttonIndex].cssClass;
				}
				if (blockAttributes.btns[buttonIndex].gap) {
					copyStyles.btn[0].gap = blockAttributes.btns[buttonIndex].gap;
				}
				if (blockAttributes.btns[buttonIndex].responsiveSize) {
					copyStyles.btn[0].responsiveSize = blockAttributes.btns[buttonIndex].responsiveSize;
				}
				if (blockAttributes.btns[buttonIndex].gradient) {
					copyStyles.btn[0].gradient = blockAttributes.btns[buttonIndex].gradient;
				}
				if (blockAttributes.btns[buttonIndex].gradientHover) {
					copyStyles.btn[0].gradientHover = blockAttributes.btns[buttonIndex].gradientHover;
				}
				if (blockAttributes.btns[buttonIndex].btnStyle) {
					copyStyles.btn[0].btnStyle = blockAttributes.btns[buttonIndex].btnStyle;
				}
				if (blockAttributes.btns[buttonIndex].btnSize) {
					copyStyles.btn[0].btnSize = blockAttributes.btns[buttonIndex].btnSize;
				}
				if (blockAttributes.btns[buttonIndex].backgroundType) {
					copyStyles.btn[0].backgroundType = blockAttributes.btns[buttonIndex].backgroundType;
				}
				if (blockAttributes.btns[buttonIndex].backgroundHoverType) {
					copyStyles.btn[0].backgroundHoverType = blockAttributes.btns[buttonIndex].backgroundHoverType;
				}
				if (blockAttributes.btns[buttonIndex].width) {
					copyStyles.btn[0].width = blockAttributes.btns[buttonIndex].width;
				}
				if (blockAttributes.btns[buttonIndex].responsivePaddingBT) {
					copyStyles.btn[0].responsivePaddingBT = blockAttributes.btns[buttonIndex].responsivePaddingBT;
				}
				if (blockAttributes.btns[buttonIndex].responsivePaddingLR) {
					copyStyles.btn[0].responsivePaddingLR = blockAttributes.btns[buttonIndex].responsivePaddingLR;
				}
				if (blockAttributes.btns[buttonIndex].boxShadow) {
					copyStyles.btn[0].boxShadow = blockAttributes.btns[buttonIndex].boxShadow;
				}
				if (blockAttributes.btns[buttonIndex].boxShadowHover) {
					copyStyles.btn[0].boxShadowHover = blockAttributes.btns[buttonIndex].boxShadowHover;
				}
				if (blockAttributes.btns[buttonIndex].tabletGap) {
					copyStyles.btn[0].tabletGap = blockAttributes.btns[buttonIndex].tabletGap;
				}
				if (blockAttributes.btns[buttonIndex].mobileGap) {
					copyStyles.btn[0].mobileGap = blockAttributes.btns[buttonIndex].mobileGap;
				}
				if (blockAttributes.btns[buttonIndex].inheritStyles) {
					copyStyles.btn[0].inheritStyles = blockAttributes.btns[buttonIndex].inheritStyles;
				}
				if (blockAttributes.btns[buttonIndex].iconSize) {
					copyStyles.btn[0].iconSize = blockAttributes.btns[buttonIndex].iconSize;
				}
				if (blockAttributes.btns[buttonIndex].iconSizeType) {
					copyStyles.btn[0].iconSizeType = blockAttributes.btns[buttonIndex].iconSizeType;
				}
				if (blockAttributes.btns[buttonIndex].iconPadding) {
					copyStyles.btn[0].iconPadding = blockAttributes.btns[buttonIndex].iconPadding;
				}
				if (blockAttributes.btns[buttonIndex].iconTabletPadding) {
					copyStyles.btn[0].iconTabletPadding = blockAttributes.btns[buttonIndex].iconTabletPadding;
				}
				if (blockAttributes.btns[buttonIndex].iconMobilePadding) {
					copyStyles.btn[0].iconMobilePadding = blockAttributes.btns[buttonIndex].iconMobilePadding;
				}
				if (blockAttributes.btns[buttonIndex].onlyIcon) {
					copyStyles.btn[0].onlyIcon = blockAttributes.btns[buttonIndex].onlyIcon;
				}
				if (blockAttributes.btns[buttonIndex].iconColor) {
					copyStyles.btn[0].iconColor = blockAttributes.btns[buttonIndex].iconColor;
				}
				if (blockAttributes.btns[buttonIndex].iconColorHover) {
					copyStyles.btn[0].iconColorHover = blockAttributes.btns[buttonIndex].iconColorHover;
				}
				if (blockAttributes.btns[buttonIndex].label) {
					copyStyles.btn[0].label = blockAttributes.btns[buttonIndex].label;
				}
				if (blockAttributes.btns[buttonIndex].anchor) {
					copyStyles.btn[0].anchor = blockAttributes.btns[buttonIndex].anchor;
				}
				if (blockAttributes.btns[buttonIndex].borderStyle) {
					copyStyles.btn[0].borderStyle = blockAttributes.btns[buttonIndex].borderStyle;
				}
				if (blockAttributes.btns[buttonIndex].marginUnit) {
					copyStyles.btn[0].marginUnit = blockAttributes.btns[buttonIndex].marginUnit;
				}
				if (blockAttributes.btns[buttonIndex].margin) {
					copyStyles.btn[0].margin = blockAttributes.btns[buttonIndex].margin;
				}
				if (blockAttributes.btns[buttonIndex].tabletMargin) {
					copyStyles.btn[0].tabletMargin = blockAttributes.btns[buttonIndex].tabletMargin;
				}
				if (blockAttributes.btns[buttonIndex].mobileMargin) {
					copyStyles.btn[0].mobileMargin = blockAttributes.btns[buttonIndex].mobileMargin;
				}
			}
			if (blockAttributes.letterSpacing) {
				copyStyles.letterSpacing = blockAttributes.letterSpacing;
			}
			if (blockAttributes.typography) {
				copyStyles.typography = blockAttributes.typography;
			}
			if (blockAttributes.googleFont) {
				copyStyles.googleFont = blockAttributes.googleFont;
			}
			if (blockAttributes.loadGoogleFont) {
				copyStyles.loadGoogleFont = blockAttributes.loadGoogleFont;
			}
			if (blockAttributes.fontSubset) {
				copyStyles.fontSubset = blockAttributes.fontSubset;
			}
			if (blockAttributes.fontVariant) {
				copyStyles.fontVariant = blockAttributes.fontVariant;
			}
			if (blockAttributes.fontWeight) {
				copyStyles.fontWeight = blockAttributes.fontWeight;
			}
			if (blockAttributes.fontStyle) {
				copyStyles.fontStyle = blockAttributes.fontStyle;
			}
			if (blockAttributes.textTransform) {
				copyStyles.textTransform = blockAttributes.textTransform;
			}
			if (blockAttributes.widthType) {
				copyStyles.widthType = blockAttributes.widthType;
			}
			if (blockAttributes.widthUnit) {
				copyStyles.widthUnit = blockAttributes.widthUnit;
			}
			if (blockAttributes.forceFullwidth) {
				copyStyles.forceFullwidth = blockAttributes.forceFullwidth;
			}
			if (blockAttributes.collapseFullwidth) {
				copyStyles.collapseFullwidth = blockAttributes.collapseFullwidth;
			}
			localStorage.setItem('kadenceButtonStyle', JSON.stringify(copyStyles));
		};
		const pasteAction = () => {
			const pasteItem = JSON.parse(localStorage.getItem('kadenceButtonStyle'));
			if (pasteItem) {
				// For regular paste, we don't reset default values
				// This maintains the current behavior where defaults are not overridden
				if (pasteItem.btn && pasteItem.btn[0]) {
					onPasteButton(pasteItem.btn[0]);
					delete pasteItem.btn;
				}
				if (buttonIndex === 0) {
					onPasteWrap(pasteItem);
				}
			}
		};

		return (
			<DropdownMenu
				className="block-editor-block-settings-menu kadence-blocks-button-item__copy_styles"
				icon={copyIcon}
				label={__('Copy/Paste Styles', 'kadence-blocks')}
				popoverProps={POPOVER_PROPS}
			>
				{({ onClose }) => (
					<Fragment>
						<MenuGroup>
							<MenuItem
								icon={'clipboard'}
								onClick={flow(onClose, copyAction)}
								label={__('Copy Styles', 'kadence-blocks')}
							>
								{__('Copy Styles', 'kadence-blocks')}
							</MenuItem>
							<MenuItem
								icon={'editor-paste-text'}
								onClick={flow(onClose, pasteAction)}
								disabled={!buttonCopiedStyles}
								label={__('Paste Styles', 'kadence-blocks')}
							>
								{__('Paste Styles', 'kadence-blocks')}
							</MenuItem>
							<MenuItem
								icon={'editor-paste-text'}
								onClick={flow(onClose, pasteAction)}
								disabled={!buttonCopiedStyles}
								label={__('Paste and Replace', 'kadence-blocks')}
							>
								{__('Paste and Replace', 'kadence-blocks')}
							</MenuItem>
						</MenuGroup>
					</Fragment>
				)}
			</DropdownMenu>
		);
	}
}
export default ButtonStyleCopyPaste;
