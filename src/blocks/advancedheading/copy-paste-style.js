/**
 * Copy and Paste Block Styles Component
 *
 */
import { flow } from 'lodash';
import { __ } from '@wordpress/i18n';
import {
	Component,
	Fragment,
} from '@wordpress/element';

import {
	DropdownMenu,
	MenuGroup,
	MenuItem,
	Toolbar,
	ToggleControl,
	SelectControl,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from '@wordpress/components';
const {
	localStorage,
} = window;
import {
	copy as coreCopy,
} from '@wordpress/icons';
/**
 * Build the copy and paste controls
 * @returns {object} copy and paste settings.
 */
class HeadingStyleCopyPaste extends Component {
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
		const headingCopiedStyles = JSON.parse( localStorage.getItem( 'kadenceHeadingStyle' ) );
		const copyAction = () => {
			const copyStyles = {};
			if ( blockAttributes.level ) {
				copyStyles.level = blockAttributes.level;
			}
			if ( blockAttributes.align ) {
				copyStyles.align = blockAttributes.align;
			}
			if ( blockAttributes.color ) {
				copyStyles.color = blockAttributes.color;
			}
			if ( blockAttributes.size ) {
				copyStyles.size = blockAttributes.size;
			}
			if ( blockAttributes.fontSize ) {
				copyStyles.fontSize = blockAttributes.fontSize;
			}
			if ( blockAttributes.fontHeight ) {
				copyStyles.fontHeight = blockAttributes.fontHeight;
			}
			if ( blockAttributes.fontHeightType ) {
				copyStyles.fontHeightType = blockAttributes.fontHeightType;
			}
			if ( blockAttributes.maxWidth ) {
				copyStyles.maxWidth = blockAttributes.maxWidth;
			}
			if ( blockAttributes.maxWidthType ) {
				copyStyles.maxWidthType = blockAttributes.maxWidthType;
			}
			if ( blockAttributes.sizeType ) {
				copyStyles.sizeType = blockAttributes.sizeType;
			}
			if ( blockAttributes.lineHeight ) {
				copyStyles.lineHeight = blockAttributes.lineHeight;
			}
			if ( blockAttributes.lineType ) {
				copyStyles.lineType = blockAttributes.lineType;
			}
			if ( blockAttributes.tabSize ) {
				copyStyles.tabSize = blockAttributes.tabSize;
			}
			if ( blockAttributes.tabLineHeight ) {
				copyStyles.tabLineHeight = blockAttributes.tabLineHeight;
			}
			if ( blockAttributes.mobileSize ) {
				copyStyles.mobileSize = blockAttributes.mobileSize;
			}
			if ( blockAttributes.mobileLineHeight ) {
				copyStyles.mobileLineHeight = blockAttributes.mobileLineHeight;
			}
			if ( blockAttributes.letterSpacing ) {
				copyStyles.letterSpacing = blockAttributes.letterSpacing;
			}
			if ( blockAttributes.typography ) {
				copyStyles.typography = blockAttributes.typography;
			}
			if ( blockAttributes.googleFont ) {
				copyStyles.googleFont = blockAttributes.googleFont;
			}
			if ( blockAttributes.loadGoogleFont ) {
				copyStyles.loadGoogleFont = blockAttributes.loadGoogleFont;
			}
			if ( blockAttributes.fontSubset ) {
				copyStyles.fontSubset = blockAttributes.fontSubset;
			}
			if ( blockAttributes.fontVariant ) {
				copyStyles.fontVariant = blockAttributes.fontVariant;
			}
			if ( blockAttributes.fontWeight ) {
				copyStyles.fontWeight = blockAttributes.fontWeight;
			}
			if ( blockAttributes.fontStyle ) {
				copyStyles.fontStyle = blockAttributes.fontStyle;
			}
			if ( undefined !== blockAttributes.topMargin && '' !== blockAttributes.topMargin ) {
				copyStyles.topMargin = blockAttributes.topMargin;
			}
			if ( undefined !== blockAttributes.bottomMargin && '' !== blockAttributes.bottomMargin ) {
				copyStyles.bottomMargin = blockAttributes.bottomMargin;
			}
			if ( undefined !== blockAttributes.leftMargin && '' !== blockAttributes.leftMargin ) {
				copyStyles.leftMargin = blockAttributes.leftMargin;
			}
			if ( undefined !== blockAttributes.rightMargin && '' !== blockAttributes.rightMargin ) {
				copyStyles.rightMargin = blockAttributes.rightMargin;
			}
			if ( blockAttributes.tabletMargin ) {
				copyStyles.tabletMargin = blockAttributes.tabletMargin;
			}
			if ( blockAttributes.mobileMargin ) {
				copyStyles.mobileMargin = blockAttributes.mobileMargin;
			}
			if ( blockAttributes.tabletMarginType ) {
				copyStyles.tabletMarginType = blockAttributes.tabletMarginType;
			}
			if ( blockAttributes.mobileMarginType ) {
				copyStyles.mobileMarginType = blockAttributes.mobileMarginType;
			}
			if ( blockAttributes.marginType ) {
				copyStyles.marginType = blockAttributes.marginType;
			}
			if ( blockAttributes.paddingType ) {
				copyStyles.paddingType = blockAttributes.paddingType;
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
			if ( blockAttributes.markSize ) {
				copyStyles.markSize = blockAttributes.markSize;
			}
			if ( blockAttributes.markSizeType ) {
				copyStyles.markSizeType = blockAttributes.markSizeType;
			}
			if ( blockAttributes.markLineHeight ) {
				copyStyles.markLineHeight = blockAttributes.markLineHeight;
			}
			if ( blockAttributes.markLineType ) {
				copyStyles.markLineType = blockAttributes.markLineType;
			}
			if ( blockAttributes.marginType ) {
				copyStyles.marginType = blockAttributes.marginType;
			}
			if ( blockAttributes.markLetterSpacing ) {
				copyStyles.markLetterSpacing = blockAttributes.markLetterSpacing;
			}
			if ( blockAttributes.markTypography ) {
				copyStyles.markTypography = blockAttributes.markTypography;
			}
			if ( blockAttributes.markGoogleFont ) {
				copyStyles.markGoogleFont = blockAttributes.markGoogleFont;
			}
			if ( blockAttributes.markLoadGoogleFont ) {
				copyStyles.markLoadGoogleFont = blockAttributes.markLoadGoogleFont;
			}
			if ( blockAttributes.markFontSubset ) {
				copyStyles.markFontSubset = blockAttributes.markFontSubset;
			}
			if ( blockAttributes.markFontVariant ) {
				copyStyles.markFontVariant = blockAttributes.markFontVariant;
			}
			if ( blockAttributes.markFontWeight ) {
				copyStyles.markFontWeight = blockAttributes.markFontWeight;
			}
			if ( blockAttributes.markFontStyle ) {
				copyStyles.markFontStyle = blockAttributes.markFontStyle;
			}
			if ( blockAttributes.markColor ) {
				copyStyles.markColor = blockAttributes.markColor;
			}
			if ( blockAttributes.markBG ) {
				copyStyles.markBG = blockAttributes.markBG;
			}
			if ( blockAttributes.markBGOpacity ) {
				copyStyles.markBGOpacity = blockAttributes.markBGOpacity;
			}
			if ( blockAttributes.markPadding ) {
				copyStyles.markPadding = blockAttributes.markPadding;
			}
			if ( blockAttributes.markPaddingControl ) {
				copyStyles.markPaddingControl = blockAttributes.markPaddingControl;
			}
			if ( blockAttributes.markBorder ) {
				copyStyles.markBorder = blockAttributes.markBorder;
			}
			if ( blockAttributes.markBorderOpacity ) {
				copyStyles.markBorderOpacity = blockAttributes.markBorderOpacity;
			}
			if ( blockAttributes.markBorderWidth ) {
				copyStyles.markBorderWidth = blockAttributes.markBorderWidth;
			}
			if ( blockAttributes.markBorderStyle ) {
				copyStyles.markBorderStyle = blockAttributes.markBorderStyle;
			}
			if ( blockAttributes.markBorderStyles ) {
				copyStyles.markBorderStyles = blockAttributes.markBorderStyles;
			}
			if ( blockAttributes.textTransform ) {
				copyStyles.textTransform = blockAttributes.textTransform;
			}
			if ( blockAttributes.markTextTransform ) {
				copyStyles.markTextTransform = blockAttributes.markTextTransform;
			}
			if ( blockAttributes.anchor ) {
				copyStyles.anchor = blockAttributes.anchor;
			}
			if ( blockAttributes.colorClass ) {
				copyStyles.colorClass = blockAttributes.colorClass;
			}
			if ( blockAttributes.tabletAlign ) {
				copyStyles.tabletAlign = blockAttributes.tabletAlign;
			}
			if ( blockAttributes.mobileAlign ) {
				copyStyles.mobileAlign = blockAttributes.mobileAlign;
			}
			if ( blockAttributes.textShadow ) {
				copyStyles.textShadow = blockAttributes.textShadow;
			}
			if ( blockAttributes.background ) {
				copyStyles.background = blockAttributes.background;
			}
			if ( blockAttributes.backgroundColorClass ) {
				copyStyles.backgroundColorClass = blockAttributes.backgroundColorClass;
			}
			localStorage.setItem( 'kadenceHeadingStyle', JSON.stringify( copyStyles ) );
		};
		const pasteAction = () => {
			const pasteItem = JSON.parse( localStorage.getItem( 'kadenceHeadingStyle' ) );
			if ( pasteItem ) {
				onPaste( pasteItem );
			}
		};
		return (
			<ToolbarGroup>
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
						</>
					) }
				</ToolbarDropdownMenu>
			</ToolbarGroup>
		);
	}
}
export default ( HeadingStyleCopyPaste );
