/**
 * Copy and Paste Block Styles Component
 *
 */
import { flow } from 'lodash';
import { __ } from '@wordpress/i18n';
import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Toolbar,
	ToolbarGroup,
	ToolbarDropdownMenu,
	SelectControl,
} from '@wordpress/components';
const {
	localStorage,
} = window;
/**
 * Import Icons
 */
 import {
	copy,
	paste,
} from '@kadence/icons';
import {
	copy as coreCopy,
} from '@wordpress/icons';


/**
 * Build the copy and paste controls
 * @returns {object} copy and paste settings.
 */
function ColumnStyleCopyPaste ( {
	onPaste,
	blockAttributes,
} ) {
	const columnCopiedStyles = JSON.parse( localStorage.getItem( 'kadenceColumnStyle' ) );
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
		if ( blockAttributes.sticky ) {
			copyStyles.sticky = blockAttributes.sticky;
		}
		if ( blockAttributes.stickyOffset ) {
			copyStyles.stickyOffset = blockAttributes.stickyOffset;
		}
		if ( blockAttributes.stickyUnit ) {
			copyStyles.stickyUnit = blockAttributes.stickyUnit;
		}
		if ( blockAttributes.overlay ) {
			copyStyles.overlay = blockAttributes.overlay;
		}
		if ( blockAttributes.overlayHover ) {
			copyStyles.overlayHover = blockAttributes.overlayHover;
		}
		if ( blockAttributes.overlayImg ) {
			copyStyles.overlayImg = blockAttributes.overlayImg;
		}
		if ( blockAttributes.overlayImgHover ) {
			copyStyles.overlayImgHover = blockAttributes.overlayImgHover;
		}
		if ( blockAttributes.overlayType ) {
			copyStyles.overlayType = blockAttributes.overlayType;
		}
		if ( blockAttributes.overlayGradient ) {
			copyStyles.overlayGradient = blockAttributes.overlayGradient;
		}
		if ( blockAttributes.overlayHoverType ) {
			copyStyles.overlayHoverType = blockAttributes.overlayHoverType;
		}
		if ( blockAttributes.overlayGradientHover ) {
			copyStyles.overlayGradientHover = blockAttributes.overlayGradientHover;
		}
		if ( blockAttributes.backgroundType ) {
			copyStyles.backgroundType = blockAttributes.backgroundType;
		}
		if ( blockAttributes.backgroundHoverType ) {
			copyStyles.backgroundHoverType = blockAttributes.backgroundHoverType;
		}
		if ( blockAttributes.gradient ) {
			copyStyles.gradient = blockAttributes.gradient;
		}
		if ( blockAttributes.gradientHover ) {
			copyStyles.gradientHover = blockAttributes.gradientHover;
		}
		if ( blockAttributes.padding ) {
			copyStyles.padding = blockAttributes.padding;
		}
		if ( blockAttributes.tabletPadding ) {
			copyStyles.tabletPadding = blockAttributes.tabletPadding;
		}
		if ( blockAttributes.mobilePadding ) {
			copyStyles.mobilePadding = blockAttributes.mobilePadding;
		}
		if ( blockAttributes.margin ) {
			copyStyles.margin = blockAttributes.margin;
		}
		if ( blockAttributes.tabletMargin ) {
			copyStyles.tabletMargin = blockAttributes.tabletMargin;
		}
		if ( blockAttributes.mobileMargin ) {
			copyStyles.mobileMargin = blockAttributes.mobileMargin;
		}
		if ( blockAttributes.borderStyle ) {
			copyStyles.borderStyle = blockAttributes.borderStyle;
		}
		if ( blockAttributes.tabletBorderStyle ) {
			copyStyles.tabletBorderStyle = blockAttributes.tabletBorderStyle;
		}
		if ( blockAttributes.mobileBorderStyle ) {
			copyStyles.mobileBorderStyle = blockAttributes.mobileBorderStyle;
		}
		if ( blockAttributes.borderHoverStyle ) {
			copyStyles.borderHoverStyle = blockAttributes.borderHoverStyle;
		}
		if ( blockAttributes.tabletBorderHoverStyle ) {
			copyStyles.tabletBorderHoverStyle = blockAttributes.tabletBorderHoverStyle;
		}
		if ( blockAttributes.mobileBorderHoverStyle ) {
			copyStyles.mobileBorderHoverStyle = blockAttributes.mobileBorderHoverStyle;
		}
		if ( blockAttributes.borderRadiusUnit ) {
			copyStyles.borderRadiusUnit = blockAttributes.borderRadiusUnit;
		}
		if ( blockAttributes.borderHoverRadiusUnit ) {
			copyStyles.borderHoverRadiusUnit = blockAttributes.borderHoverRadiusUnit;
		}
		if ( blockAttributes.tabletBorderHoverRadius ) {
			copyStyles.tabletBorderHoverRadius = blockAttributes.tabletBorderHoverRadius;
		}
		if ( blockAttributes.mobileBorderHoverRadius ) {
			copyStyles.mobileBorderHoverRadius = blockAttributes.mobileBorderHoverRadius;
		}
		if ( blockAttributes.tabletBorderRadius ) {
			copyStyles.tabletBorderRadius = blockAttributes.tabletBorderRadius;
		}
		if ( blockAttributes.mobileBorderRadius ) {
			copyStyles.mobileBorderRadius = blockAttributes.mobileBorderRadius;
		}
		if ( undefined !== blockAttributes.overlayOpacity ) {
			copyStyles.overlayOpacity = blockAttributes.overlayOpacity;
		}
		if ( undefined !== blockAttributes.overlayHoverOpacity ) {
			copyStyles.overlayHoverOpacity = blockAttributes.overlayHoverOpacity;
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
		<ToolbarDropdownMenu
			className="kb-copy-paste-styles"
			icon={ coreCopy }
			label={ __( 'Copy/Paste Styles', 'kadence-blocks' ) }
			popoverProps={ {
				className: 'kb-copy-paste-styles__popover',
			} }
		>
			{ ( { onClose } ) => (
				<>
					<MenuGroup>
						<MenuItem
							icon={ copy }
							onClick={ flow( onClose, copyAction ) }
							label={ __( 'Copy Styles', 'kadence-blocks' ) }
						>
							{ __( 'Copy Styles', 'kadence-blocks' ) }
						</MenuItem>
						<MenuItem
							icon={ paste }
							onClick={ flow( onClose, pasteAction ) }
							disabled={ ! columnCopiedStyles }
							label={ __( 'Paste Styles', 'kadence-blocks' ) }
						>
							{ __( 'Paste Styles', 'kadence-blocks' ) }
						</MenuItem>
					</MenuGroup>
				</>
			) }
		</ToolbarDropdownMenu>
	);
}
export default ( ColumnStyleCopyPaste );
