/**
 * Utilities for the icon list block.
 */
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';
export function migrateToInnerblocks( attributes ) {
    const { btns, btnCount } = attributes;

    let buttonInnerBlocks = [];
	btnCount
	times( btnCount, n => {
		let btn = btns[n];
		let newAttrs = { ...btn };
		// 1. Update font size to new format.
		// 2. Update Border to new format.
		// 3. Update padding to new format.
		// 4. Update Gradient to new format.
		// 5. Update colors to single string format.
		// 6. Update Gap to new format. (Gap stored in Parent).
		// 7. Update Animations to inner block.
		// 8. Update Dynamic content to inner block.
		// 9. Update inheritStyles to new default of fill.
		// 10. Update Anchor to new anchor.
		// 11. Update Class to new class.
		// 12. btnsize to sizePreset.

        buttonInnerBlocks.push( createBlock( 'kadence/singlebtn', newAttrs ) );
	} )
	// Clear out attributes no longer needed.
	//   "btns": {
	// 	"type": "array",
	// 	"default": [ {
	// 	  "text": "",
	// 	  "link": "",
	// 	  "target": "_self",
	// 	  "size": "",
	// 	  "paddingBT": "",
	// 	  "paddingLR": "",
	// 	  "color": "#555555",
	// 	  "background": "",
	// 	  "border": "#555555",
	// 	  "backgroundOpacity": 1,
	// 	  "borderOpacity": 1,
	// 	  "borderRadius": "",
	// 	  "borderWidth": "",
	// 	  "colorHover": "#ffffff",
	// 	  "backgroundHover": "#444444",
	// 	  "borderHover": "#444444",
	// 	  "backgroundHoverOpacity": 1,
	// 	  "borderHoverOpacity": 1,
	// 	  "icon": "",
	// 	  "iconSide": "right",
	// 	  "iconHover": false,
	// 	  "cssClass": "",
	// 	  "noFollow": false,
	// 	  "gap": 5,
	// 	  "responsiveSize": [ "", "" ],
	// 	  "gradient": [ "#999999", 1, 0, 100, "linear", 180, "center center" ],
	// 	  "gradientHover": [ "#777777", 1, 0, 100, "linear", 180, "center center" ],
	// 	  "btnStyle": "basic",
	// 	  "btnSize": "standard",
	// 	  "backgroundType": "solid",
	// 	  "backgroundHoverType": "solid",
	// 	  "width": [ "", "", "" ],
	// 	  "responsivePaddingBT": [ "", "" ],
	// 	  "responsivePaddingLR": [ "", "" ],
	// 	  "boxShadow": [ false, "#000000", 0.2, 1, 1, 2, 0, false ],
	// 	  "boxShadowHover": [ false, "#000000", 0.4, 2, 2, 3, 0, false ],
	// 	  "sponsored": false,
	// 	  "download": false,
	// 	  "tabletGap": "",
	// 	  "mobileGap": "",
	// 	  "inheritStyles": "",
	// 	  "iconSize": [ "", "", "" ],
	// 	  "iconPadding": [ "", "", "", "" ],
	// 	  "iconTabletPadding": [ "", "", "", "" ],
	// 	  "iconMobilePadding": [ "", "", "", "" ],
	// 	  "onlyIcon": [ false, "", "" ],
	// 	  "iconColor": "",
	// 	  "iconColorHover": "",
	// 	  "sizeType": "px",
	// 	  "iconSizeType": "px",
	// 	  "label": "",
	// 	  "marginUnit": "px",
	// 	  "margin": [ "", "", "", "" ],
	// 	  "tabletMargin": [ "", "", "", "" ],
	// 	  "mobileMargin": [ "", "", "", "" ],
	// 	  "anchor": "",
	// 	  "borderStyle": ""
	// 	} ]
	//   },
    let buttonParentAttributes = { ...attributes, btns: [], btnCount: 1, typography: '', fontStyle: 'normal', googleFont:false, letterSpacing: '',loadGoogleFont:true, textTransform:'', fontSubset: '',fontWeight:'regular',fontVariant:'', widthType:'auto', widthUnit:'px', forceFullwidth:false, collapseFullwidth:false }

    return [ buttonParentAttributes, buttonInnerBlocks ];
}