/**
 * Utilities for the icon list block.
 */
import { KadenceColorOutput } from '@kadence/helpers';
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';
function convertAlphaColors(hex, alpha) {
	if (null === hex) {
		return '';
	}
	if (undefined === alpha || null === alpha || '' === alpha || 1 === alpha) {
		return hex;
	}

	hex = hex.replace('#', '');
	const r = parseInt(hex.length === 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
	const g = parseInt(hex.length === 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
	const b = parseInt(hex.length === 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
	return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
}
export function migrateToInnerblocks(attributes) {
	const {
		btns,
		btnCount,
		typography,
		googleFont,
		loadGoogleFont,
		fontVariant,
		fontWeight,
		fontSubset,
		fontStyle,
		textTransform,
		letterSpacing,
		widthType,
		collapseFullwidth,
		kadenceAOSOptions,
		kadenceAnimation,
		kadenceDynamic,
		hideLink,
		lockBtnCount,
	} = attributes;
	const newGap = ['xs', '', ''];
	let newOrientation = ['', '', ''];
	const buttonInnerBlocks = [];
	if (btns?.length) {
		times(btnCount, (n) => {
			const btn = btns[n];
			const newAttrs = { ...btn };
			// 1. Update Typography to new format.
			newAttrs.typography = [
				{
					size: ['', '', ''],
					sizeType: 'px',
					lineHeight: ['', '', ''],
					lineType: '',
					letterSpacing: ['', '', ''],
					letterType: 'px',
					family: '',
					google: '',
					style: '',
					weight: '',
					variant: '',
					subset: '',
					textTransform: '',
					loadGoogle: true,
				},
			];
			if (undefined !== newAttrs?.size && '' !== newAttrs.size) {
				newAttrs.typography[0].size[0] = newAttrs.size;
			}
			if (undefined !== newAttrs?.size) {
				delete newAttrs.size;
			}
			if (undefined !== newAttrs?.responsiveSize?.[0] && '' !== newAttrs.responsiveSize[0]) {
				newAttrs.typography[0].size[1] = newAttrs.responsiveSize[0];
			}
			if (undefined !== newAttrs?.responsiveSize?.[1] && '' !== newAttrs.responsiveSize[1]) {
				newAttrs.typography[0].size[2] = newAttrs.responsiveSize[1];
			}
			if (undefined !== newAttrs?.responsiveSize) {
				delete newAttrs.responsiveSize;
			}
			if (undefined !== newAttrs?.sizeType && '' !== newAttrs.sizeType) {
				newAttrs.typography[0].sizeType = newAttrs.sizeType;
			}
			if (undefined !== newAttrs?.sizeType) {
				delete newAttrs.sizeType;
			}
			if (undefined !== typography && '' !== typography) {
				newAttrs.typography[0].family = typography;
			}
			if (undefined !== letterSpacing && '' !== letterSpacing) {
				newAttrs.typography[0].letterSpacing[0] = letterSpacing;
			}
			if (undefined !== googleFont && '' !== googleFont) {
				newAttrs.typography[0].google = googleFont;
			}
			if (undefined !== loadGoogleFont && '' !== loadGoogleFont) {
				newAttrs.typography[0].loadGoogle = loadGoogleFont;
			}
			if (undefined !== fontSubset && '' !== fontSubset) {
				newAttrs.typography[0].subset = fontSubset;
			}
			if (undefined !== fontVariant && '' !== fontVariant) {
				newAttrs.typography[0].variant = fontVariant;
			}
			if (undefined !== fontStyle && '' !== fontStyle) {
				newAttrs.typography[0].style = fontStyle;
			}
			if (undefined !== fontWeight && '' !== fontWeight) {
				newAttrs.typography[0].weight = fontWeight;
			}
			if (undefined !== textTransform && '' !== textTransform) {
				newAttrs.typography[0].textTransform = textTransform;
			}
			// 9. Update inheritStyles to new default of fill.
			if (
				undefined !== newAttrs?.inheritStyles &&
				'' !== newAttrs.inheritStyles &&
				'inherit' === newAttrs.inheritStyles
			) {
				newAttrs.inheritStyles = 'inherit';
			} else if (
				undefined !== newAttrs?.borderWidth &&
				'' !== newAttrs.borderWidth &&
				0 === parseInt(newAttrs.borderWidth) &&
				((undefined !== newAttrs?.background && '' !== newAttrs.background) ||
					(undefined !== newAttrs?.backgroundType && 'gradient' === newAttrs.backgroundType))
			) {
				newAttrs.inheritStyles = 'fill';
			} else {
				newAttrs.inheritStyles = 'outline';
			}
			// 2. Update Border to new format.
			let tempBorderRadius = ['', '', '', ''];
			if (undefined !== newAttrs?.borderRadius && '' !== newAttrs.borderRadius) {
				tempBorderRadius = [
					newAttrs.borderRadius,
					newAttrs.borderRadius,
					newAttrs.borderRadius,
					newAttrs.borderRadius,
				];
			}
			newAttrs.borderRadius = tempBorderRadius;
			const tempBorderStyle = [
				{
					top: ['', '', ''],
					right: ['', '', ''],
					bottom: ['', '', ''],
					left: ['', '', ''],
					unit: 'px',
				},
			];
			if (
				undefined !== newAttrs?.borderStyle &&
				'' !== newAttrs.borderStyle &&
				'solid' !== newAttrs.borderStyle
			) {
				tempBorderStyle[0].top[1] = newAttrs.borderStyle;
				tempBorderStyle[0].right[1] = newAttrs.borderStyle;
				tempBorderStyle[0].bottom[1] = newAttrs.borderStyle;
				tempBorderStyle[0].left[1] = newAttrs.borderStyle;
			}
			newAttrs.borderStyle = tempBorderStyle;
			if (undefined !== newAttrs?.borderWidth && '' !== newAttrs.borderWidth) {
				newAttrs.borderStyle[0].top[2] = newAttrs.borderWidth;
				newAttrs.borderStyle[0].right[2] = newAttrs.borderWidth;
				newAttrs.borderStyle[0].bottom[2] = newAttrs.borderWidth;
				newAttrs.borderStyle[0].left[2] = newAttrs.borderWidth;
			}
			if (undefined !== newAttrs?.borderWidth) {
				delete newAttrs.borderWidth;
			}
			if (undefined !== newAttrs?.border && '' !== newAttrs.border) {
				newAttrs.borderStyle[0].top[0] = convertAlphaColors(newAttrs.border, newAttrs.borderOpacity);
				newAttrs.borderStyle[0].right[0] = convertAlphaColors(newAttrs.border, newAttrs.borderOpacity);
				newAttrs.borderStyle[0].bottom[0] = convertAlphaColors(newAttrs.border, newAttrs.borderOpacity);
				newAttrs.borderStyle[0].left[0] = convertAlphaColors(newAttrs.border, newAttrs.borderOpacity);
			}
			if (undefined !== newAttrs?.border) {
				delete newAttrs.border;
			}
			if (undefined !== newAttrs?.borderOpacity) {
				delete newAttrs.borderOpacity;
			}
			newAttrs.borderHoverStyle = [
				{
					top: ['', '', ''],
					right: ['', '', ''],
					bottom: ['', '', ''],
					left: ['', '', ''],
					unit: 'px',
				},
			];
			if (undefined !== newAttrs?.borderHover && '' !== newAttrs.borderHover) {
				newAttrs.borderHoverStyle[0].top[0] = convertAlphaColors(
					newAttrs.borderHover,
					newAttrs.borderHoverOpacity
				);
				newAttrs.borderHoverStyle[0].right[0] = convertAlphaColors(
					newAttrs.borderHover,
					newAttrs.borderHoverOpacity
				);
				newAttrs.borderHoverStyle[0].bottom[0] = convertAlphaColors(
					newAttrs.borderHover,
					newAttrs.borderHoverOpacity
				);
				newAttrs.borderHoverStyle[0].left[0] = convertAlphaColors(
					newAttrs.borderHover,
					newAttrs.borderHoverOpacity
				);
			}
			if (undefined !== newAttrs?.borderHover) {
				delete newAttrs.borderHover;
			}
			if (undefined !== newAttrs?.borderHoverOpacity) {
				delete newAttrs.borderHoverOpacity;
			}
			// 3. Update padding to new format.
			newAttrs.padding = ['', '', '', ''];
			newAttrs.tabletPadding = ['', '', '', ''];
			newAttrs.mobilePadding = ['', '', '', ''];
			if (undefined !== newAttrs?.btnSize && 'custom' === newAttrs.btnSize) {
				if (undefined !== newAttrs?.paddingBT && '' !== newAttrs.paddingBT) {
					newAttrs.padding[0] = newAttrs?.paddingBT;
					newAttrs.padding[2] = newAttrs?.paddingBT;
				}
				if (undefined !== newAttrs?.paddingLR && '' !== newAttrs.paddingLR) {
					newAttrs.padding[1] = newAttrs?.paddingLR;
					newAttrs.padding[3] = newAttrs?.paddingLR;
				}
				if (undefined !== newAttrs?.responsivePaddingBT?.[0] && '' !== newAttrs.responsivePaddingBT[0]) {
					newAttrs.tabletPadding[0] = newAttrs?.responsivePaddingBT[0];
					newAttrs.tabletPadding[2] = newAttrs?.responsivePaddingBT[0];
				}
				if (undefined !== newAttrs?.responsivePaddingLR?.[0] && '' !== newAttrs.responsivePaddingLR[0]) {
					newAttrs.tabletPadding[1] = newAttrs?.responsivePaddingLR[0];
					newAttrs.tabletPadding[3] = newAttrs?.responsivePaddingLR[0];
				}
				if (undefined !== newAttrs?.responsivePaddingBT?.[1] && '' !== newAttrs.responsivePaddingBT[1]) {
					newAttrs.mobilePadding[0] = newAttrs?.responsivePaddingBT[1];
					newAttrs.mobilePadding[2] = newAttrs?.responsivePaddingBT[1];
				}
				if (undefined !== newAttrs?.responsivePaddingLR?.[1] && '' !== newAttrs.responsivePaddingLR[1]) {
					newAttrs.mobilePadding[1] = newAttrs?.responsivePaddingLR[1];
					newAttrs.mobilePadding[3] = newAttrs?.responsivePaddingLR[1];
				}
			}
			if (undefined !== newAttrs?.paddingBT) {
				delete newAttrs.paddingBT;
			}
			if (undefined !== newAttrs?.paddingLR) {
				delete newAttrs.paddingLR;
			}
			if (undefined !== newAttrs?.responsivePaddingBT) {
				delete newAttrs.responsivePaddingBT;
			}
			if (undefined !== newAttrs?.responsivePaddingLR) {
				delete newAttrs.responsivePaddingLR;
			}
			// 4. Update Gradient to new format.
			if (undefined !== newAttrs?.backgroundType && 'gradient' === newAttrs.backgroundType) {
				let btnbg = '';
				const btnGrad =
					undefined === newAttrs.background
						? KadenceColorOutput(
								'#444444',
								newAttrs.backgroundOpacity !== undefined ? newAttrs.backgroundOpacity : 1
							)
						: KadenceColorOutput(
								newAttrs.background,
								newAttrs.backgroundOpacity !== undefined ? newAttrs.backgroundOpacity : 1
							);
				const btnGrad2 =
					undefined === newAttrs.gradient[0]
						? KadenceColorOutput('#777777', newAttrs.gradient[1] !== undefined ? newAttrs.gradient[1] : 1)
						: KadenceColorOutput(
								newAttrs.gradient[0],
								newAttrs.gradient[1] !== undefined ? newAttrs.gradient[1] : 1
							);
				if (undefined !== newAttrs.gradient && 'radial' === newAttrs.gradient[4]) {
					btnbg = `radial-gradient(at ${
						undefined === newAttrs.gradient[6] ? 'center center' : newAttrs.gradient[6]
					}, ${btnGrad} ${undefined === newAttrs.gradient[2] ? '0' : newAttrs.gradient[2]}%, ${btnGrad2} ${
						undefined === newAttrs.gradient[3] ? '100' : newAttrs.gradient[3]
					}%)`;
				} else if (undefined !== newAttrs.gradient && 'linear' === newAttrs.gradient[4]) {
					btnbg = `linear-gradient(${
						undefined === newAttrs.gradient[5] ? '180' : newAttrs.gradient[5]
					}deg, ${btnGrad} ${undefined === newAttrs.gradient[2] ? '0' : newAttrs.gradient[2]}%, ${btnGrad2} ${
						undefined === newAttrs.gradient[3] ? '100' : newAttrs.gradient[3]
					}%)`;
				}
				newAttrs.gradient = btnbg;
			} else if (undefined !== newAttrs?.gradient) {
				delete newAttrs.gradient;
			}

			if (undefined !== newAttrs?.backgroundHoverType && 'gradient' === newAttrs.backgroundHoverType) {
				let btnbgHover = '';
				const btnGradHover =
					undefined === newAttrs.backgroundHover
						? KadenceColorOutput(
								'#444444',
								newAttrs.backgroundHoverOpacity !== undefined ? newAttrs.backgroundHoverOpacity : 1
							)
						: KadenceColorOutput(
								newAttrs.backgroundHover,
								newAttrs.backgroundHoverOpacity !== undefined ? newAttrs.backgroundHoverOpacity : 1
							);
				if (undefined !== newAttrs.gradientHover) {
					const btnGradHover2 =
						undefined === newAttrs.gradientHover[0]
							? KadenceColorOutput(
									'#777777',
									newAttrs.gradientHover[1] !== undefined ? newAttrs.gradientHover[1] : 1
								)
							: KadenceColorOutput(
									newAttrs.gradientHover[0],
									newAttrs.gradientHover[1] !== undefined ? newAttrs.gradientHover[1] : 1
								);
					if ('radial' === newAttrs.gradientHover[4]) {
						btnbgHover = `radial-gradient(at ${
							undefined === newAttrs.gradientHover[6] ? 'center center' : newAttrs.gradientHover[6]
						}, ${btnGradHover} ${
							undefined === newAttrs.gradientHover[2] ? '0' : newAttrs.gradientHover[2]
						}%, ${btnGradHover2} ${
							undefined === newAttrs.gradientHover[3] ? '100' : newAttrs.gradientHover[3]
						}%)`;
					} else if ('linear' === newAttrs.gradientHover[4]) {
						btnbgHover = `linear-gradient(${
							undefined === newAttrs.gradientHover[5] ? '180' : newAttrs.gradientHover[5]
						}deg, ${btnGradHover} ${
							undefined === newAttrs.gradientHover[2] ? '0' : newAttrs.gradientHover[2]
						}%, ${btnGradHover2} ${
							undefined === newAttrs.gradientHover[3] ? '100' : newAttrs.gradientHover[3]
						}%)`;
					}
				}
				newAttrs.gradientHover = btnbgHover;
			} else if (undefined !== newAttrs?.gradientHover) {
				delete newAttrs.gradientHover;
			}
			// 5.a Update colors to single string format.
			if (undefined !== newAttrs?.background && '' !== newAttrs.background) {
				newAttrs.background = convertAlphaColors(newAttrs.background, newAttrs.backgroundOpacity);
			}
			if (undefined !== newAttrs?.backgroundOpacity) {
				delete newAttrs.backgroundOpacity;
			}
			if (undefined !== newAttrs?.backgroundHover && '' !== newAttrs.backgroundHover) {
				newAttrs.backgroundHover = convertAlphaColors(
					newAttrs.backgroundHover,
					newAttrs.backgroundHoverOpacity
				);
			}
			if (undefined !== newAttrs?.backgroundHoverOpacity) {
				delete newAttrs.backgroundHoverOpacity;
			}
			// 5.b Update default background type.
			if (undefined !== newAttrs?.backgroundType && '' !== newAttrs.backgroundType) {
				newAttrs.backgroundType = 'solid' === newAttrs.backgroundType ? 'normal' : newAttrs.backgroundType;
			}
			if (undefined !== newAttrs?.backgroundHoverType && '' !== newAttrs.backgroundHoverType) {
				newAttrs.backgroundHoverType =
					'solid' === newAttrs.backgroundHoverType ? 'normal' : newAttrs.backgroundHoverType;
			}
			// 5.c Update default btnSize type.
			if (undefined !== newAttrs?.btnSize && '' !== newAttrs.btnSize && 'custom' !== newAttrs.btnSize) {
				newAttrs.sizePreset = newAttrs.btnSize;
			}
			if (undefined !== newAttrs?.btnSize) {
				delete newAttrs.btnSize;
			}
			// 5.d Update default icon size type.
			if (
				undefined !== newAttrs?.iconSizeType &&
				'' !== newAttrs.iconSizeType &&
				'px' !== newAttrs.iconSizeType
			) {
				newAttrs.iconSizeUnit = newAttrs.iconSizeType;
			}
			if (undefined !== newAttrs?.iconSizeType) {
				delete newAttrs.iconSizeType;
			}
			// 5.e remove btnStyle
			if (undefined !== newAttrs?.btnStyle) {
				delete newAttrs.btnStyle;
			}
			// 6. Update Gap to new format. (Gap stored in Parent).
			if (undefined !== newAttrs?.gap && '' !== newAttrs.gap && 5 !== newAttrs.gap) {
				newGap[0] = newAttrs.gap;
			}
			if (undefined !== newAttrs?.gap) {
				delete newAttrs.gap;
			}
			if (undefined !== newAttrs?.tabletGap && '' !== newAttrs.tabletGap) {
				newGap[1] = newAttrs.tabletGap;
			}
			if (undefined !== newAttrs?.tabletGap) {
				delete newAttrs.tabletGap;
			}
			if (undefined !== newAttrs?.mobileGap && '' !== newAttrs.mobileGap) {
				newGap[2] = newAttrs.mobileGap;
			}
			if (undefined !== newAttrs?.mobileGap) {
				delete newAttrs.mobileGap;
			}
			// 7. Update Animations to inner block.
			if (undefined !== kadenceAOSOptions) {
				newAttrs.kadenceAOSOptions = kadenceAOSOptions;
			}
			if (undefined !== kadenceAnimation) {
				newAttrs.kadenceAnimation = kadenceAnimation;
			}
			// 8. Update Dynamic content to inner block.
			if (undefined !== kadenceDynamic?.['btns:' + n + ':link']) {
				newAttrs.kadenceDynamic = {};
				newAttrs.kadenceDynamic.link = kadenceDynamic['btns:' + n + ':link'];
			}
			if (undefined !== kadenceDynamic?.['btns:' + n + ':text']) {
				if (undefined === newAttrs.kadenceDynamic) {
					newAttrs.kadenceDynamic = {};
				}
				newAttrs.kadenceDynamic.text = kadenceDynamic['btns:' + n + ':text'];
			}
			// 10. Update Anchor to new anchor.
			if (undefined !== newAttrs?.anchor && '' !== newAttrs.anchor) {
				newAttrs.anchor = newAttrs.anchor;
			} else {
				delete newAttrs.anchor;
			}
			// 11. Update Class to new class.
			if (undefined !== newAttrs?.cssClass && '' !== newAttrs.cssClass) {
				newAttrs.className = newAttrs.cssClass;
			}
			if (undefined !== newAttrs?.cssClass) {
				delete newAttrs.cssClass;
			}
			// 12. Box Shadow to new format.
			if (undefined !== newAttrs?.boxShadow?.[0] && true === newAttrs.boxShadow[0]) {
				newAttrs.displayShadow = true;
				newAttrs.shadow = [
					{
						color: undefined !== newAttrs?.boxShadow?.[1] ? newAttrs.boxShadow[1] : '#000000',
						opacity: undefined !== newAttrs?.boxShadow?.[2] ? newAttrs.boxShadow[2] : 0.4,
						spread: undefined !== newAttrs?.boxShadow?.[6] ? newAttrs.boxShadow[6] : 0,
						blur: undefined !== newAttrs?.boxShadow?.[5] ? newAttrs.boxShadow[5] : 3,
						hOffset: undefined !== newAttrs?.boxShadow?.[4] ? newAttrs.boxShadow[3] : 2,
						vOffset: undefined !== newAttrs?.boxShadow?.[3] ? newAttrs.boxShadow[4] : 2,
						inset: undefined !== newAttrs?.boxShadow?.[7] ? newAttrs.boxShadow[7] : false,
					},
				];
			}
			// Hover
			if (undefined !== newAttrs?.boxShadowHover?.[0] && true === newAttrs.boxShadowHover[0]) {
				newAttrs.displayHoverShadow = true;
				newAttrs.shadowHover = [
					{
						color: undefined !== newAttrs?.boxShadowHover?.[1] ? newAttrs.boxShadowHover[1] : '#000000',
						opacity: undefined !== newAttrs?.boxShadowHover?.[2] ? newAttrs.boxShadowHover[2] : 0.4,
						spread: undefined !== newAttrs?.boxShadowHover?.[6] ? newAttrs.boxShadowHover[6] : 0,
						blur: undefined !== newAttrs?.boxShadowHover?.[5] ? newAttrs.boxShadowHover[5] : 3,
						hOffset: undefined !== newAttrs?.boxShadowHover?.[4] ? newAttrs.boxShadowHover[3] : 2,
						vOffset: undefined !== newAttrs?.boxShadowHover?.[3] ? newAttrs.boxShadowHover[4] : 2,
						inset: undefined !== newAttrs?.boxShadowHover?.[7] ? newAttrs.boxShadowHover[7] : false,
					},
				];
			}
			if (undefined !== newAttrs?.boxShadow) {
				delete newAttrs.boxShadow;
			}
			if (undefined !== newAttrs?.boxShadowHover) {
				delete newAttrs.boxShadowHover;
			}
			// 13. FullWidth Buttons.
			if (undefined !== widthType && widthType == 'full') {
				newAttrs.widthType = 'full';
				if (collapseFullwidth) {
					newOrientation = ['', '', 'column'];
				}
			} else if (undefined !== widthType && widthType == 'fixed') {
				newAttrs.widthType = 'fixed';
			}
			// 14. Text Convert
			if (undefined !== newAttrs?.text) {
				newAttrs.text = newAttrs.text.toString();
			}
			// 15. Convert hide link attribute to block level.
			if (undefined !== hideLink && hideLink) {
				newAttrs.hideLink = true;
			}
			// Have to use lockBtnCount to support show more.
			if (undefined !== lockBtnCount && lockBtnCount) {
				newAttrs.hideLink = true;
			}
			// 16. No defaults.
			newAttrs.noCustomDefaults = true;
			buttonInnerBlocks.push(createBlock('kadence/singlebtn', newAttrs));
		});
	}
	// Clear out attributes no longer needed.
	//// 	  "text": "",
	//// 	  "link": "",
	//// 	  "target": "_self",
	//// 	  "size": "",
	//// 	  "paddingBT": "",
	//// 	  "paddingLR": "",
	//// 	  "color": "#555555",
	//// 	  "background": "",
	//// 	  "border": "#555555",
	//// 	  "backgroundOpacity": 1,
	//// 	  "borderOpacity": 1,
	//// 	  "borderRadius": "",
	//// 	  "borderWidth": "",
	//// 	  "colorHover": "#ffffff",
	//// 	  "backgroundHover": "#444444",
	//// 	  "borderHover": "#444444",
	//// 	  "backgroundHoverOpacity": 1,
	//// 	  "borderHoverOpacity": 1,
	//// 	  "icon": "",
	//// 	  "iconSide": "right",
	//// 	  "iconHover": false,
	//// 	  "cssClass": "",
	//// 	  "noFollow": false,
	//// 	  "gap": 5,
	//// 	  "responsiveSize": [ "", "" ],
	//// 	  "gradient": [ "#999999", 1, 0, 100, "linear", 180, "center center" ],
	//// 	  "gradientHover": [ "#777777", 1, 0, 100, "linear", 180, "center center" ],
	//// 	  "btnStyle": "basic",
	//// 	  "btnSize": "standard",
	//// 	  "backgroundType": "solid",
	//// 	  "backgroundHoverType": "solid",
	//// 	  "width": [ "", "", "" ],
	//// 	  "responsivePaddingBT": [ "", "" ],
	//// 	  "responsivePaddingLR": [ "", "" ],
	//// 	  "boxShadow": [ false, "#000000", 0.2, 1, 1, 2, 0, false ],
	//// 	  "boxShadowHover": [ false, "#000000", 0.4, 2, 2, 3, 0, false ],
	//// 	  "sponsored": false,
	//// 	  "download": false,
	//// 	  "tabletGap": "",
	//// 	  "mobileGap": "",
	//// 	  "inheritStyles": "",
	//// 	  "iconSize": [ "", "", "" ],
	//// 	  "iconPadding": [ "", "", "", "" ],
	//// 	  "iconTabletPadding": [ "", "", "", "" ],
	//// 	  "iconMobilePadding": [ "", "", "", "" ],
	//// 	  "onlyIcon": [ false, "", "" ],
	//// 	  "iconColor": "",
	//// 	  "iconColorHover": "",
	//// 	  "sizeType": "px",
	//// 	  "iconSizeType": "px",
	//// 	  "label": "",
	//// 	  "marginUnit": "px",
	//// 	  "margin": [ "", "", "", "" ],
	//// 	  "tabletMargin": [ "", "", "", "" ],
	//// 	  "mobileMargin": [ "", "", "", "" ],
	//// 	  "anchor": "",
	//// 	  "borderStyle": ""
	const buttonParentAttributes = {
		...attributes,
		btns: [],
		btnCount: 1,
		typography: '',
		fontStyle: 'normal',
		googleFont: false,
		letterSpacing: '',
		loadGoogleFont: true,
		textTransform: '',
		fontSubset: '',
		fontWeight: 'regular',
		fontVariant: '',
		widthType: 'auto',
		widthUnit: 'px',
		orientation: newOrientation,
		forceFullwidth: false,
		collapseFullwidth: false,
		gap: newGap,
	};

	return [buttonParentAttributes, buttonInnerBlocks];
}
