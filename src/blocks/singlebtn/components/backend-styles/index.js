import {
	KadenceBlocksCSS,
	getPreviewSize,
	KadenceColorOutput,
	typographyStyle,
	getBorderStyle,
	getBorderColor,
	getSpacingOptionOutput,
} from '@kadence/helpers';
import { activePresetFor, blockPresetValues } from '../../../../extension/preset-picker';
import { tokenPx } from '../../../../extension/design-tokens/token-px';
import { pathOfAlias, resolveTokenAlias } from '../../../../extension/design-tokens/alias';
import { isBackedToken } from '../../../../extension/design-tokens/backed-tokens';
import { boundShadowToken } from '../../../../extension/design-tokens/shadow-token';

/**
 * Whether the button's active preset resolves a padding and/or a margin.
 *
 * Reads the same preset surface the inspector does, so the canvas and the panel cannot disagree about
 * whether a preset carries spacing. A block with no explicit selection — or one naming a preset that no
 * longer exists — follows the block's default preset, exactly as the server's `has_preset()` /
 * `default_preset()` fallback does.
 *
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
 * @return {{padding: boolean, margin: boolean}} Which spacing properties the preset defines.
 */
function presetSpacingProperties(attributes) {
	const preset = activePresetFor('kadence/singlebtn', attributes);
	const tokens = blockPresetValues('kadence/singlebtn')?.[preset] ?? {};

	return {
		padding: 'button-padding' in tokens,
		margin: 'button-margin' in tokens,
	};
}

/**
 * Whether the button's active preset resolves a border width, style, and/or color.
 *
 * Reads the same preset surface the inspector does, so the canvas and the panel cannot disagree
 * about whether a preset carries a border. A block with no explicit selection — or one naming a
 * preset that no longer exists — follows the block's default preset, exactly as the server's
 * `has_preset()` / `default_preset()` fallback does.
 *
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
 * @return {{width: boolean, style: boolean, color: boolean}} Which border properties the preset defines.
 */
export function presetBorderProperties(attributes) {
	const preset = activePresetFor('kadence/singlebtn', attributes);
	const tokens = blockPresetValues('kadence/singlebtn')?.[preset] ?? {};

	return {
		width: 'button-border-width' in tokens,
		style: 'button-border-style' in tokens,
		color: 'button-border-color' in tokens,
	};
}

/**
 * Whether the button's active preset resolves a box-shadow.
 *
 * Reads the same preset surface the inspector does, so the canvas and the panel cannot disagree
 * about whether a preset carries a shadow. A block with no explicit selection — or one naming a
 * preset that no longer exists — follows the block's default preset, exactly as the server's
 * `has_preset()` / `default_preset()` fallback does.
 *
 * @param {Object} attributes The block attributes.
 *
 * @since TBD
 *
 * @return {boolean} Whether the preset defines a box-shadow.
 */
export function presetShadowProperties(attributes) {
	const preset = activePresetFor('kadence/singlebtn', attributes);
	const tokens = blockPresetValues('kadence/singlebtn')?.[preset] ?? {};

	return 'button-shadow' in tokens;
}

/**
 * One shadow axis as a bare pixel number.
 *
 * A {dot.alias} leg is resolved through the token pool the way the PHP renderer's `render_shadow()`
 * does. Concatenated raw it would emit `{alias}px`, which is not valid CSS — and `hasVisibleShadow()`
 * deliberately counts such a leg as visible, so it does reach here.
 *
 * @param {*} raw      The stored axis value.
 * @param {*} fallback What this axis defaults to when unset.
 *
 * @since TBD
 *
 * @return {*} The axis value to serialize.
 */
export function shadowAxisPx(raw, fallback) {
	if (typeof raw === 'string' && raw.trim() !== '' && !Number.isFinite(Number(raw))) {
		const resolved = tokenPx(raw);

		return resolved === null || resolved === undefined ? fallback : resolved;
	}

	return undefined !== raw && null !== raw ? raw : fallback;
}

/**
 * Whether a native shadow item paints anything visible — all-zero offsets, blur, and spread
 * render nothing regardless of color, matching the value the "None" pick now writes and mirroring
 * the PHP renderer's `has_visible_shadow()`.
 *
 * @param {?Object} shadowItem One `shadow[0]`-shaped item.
 *
 * @since TBD
 *
 * @return {boolean} Whether the item has any non-zero offset, blur, or spread.
 */
export function hasVisibleShadow(shadowItem) {
	if (!shadowItem) {
		return false;
	}

	// A bound item's real value lives in the token, which this gate cannot read. Counting it as visible
	// keeps the base rule's `box-shadow: none` reset from erasing a shadow the token does paint —
	// the same reasoning the per-leg alias branch below uses. Mirrors the PHP gate.
	if (boundShadowToken(shadowItem)) {
		return true;
	}

	return ['hOffset', 'vOffset', 'blur', 'spread'].some((axis) => {
		const raw = shadowItem[axis];

		// A {dot.alias} leg resolves to a var() unknown here, so it counts as visible — read as zero, the
		// caller's `box-shadow: none` would erase a shadow the token does paint. Mirrors the PHP gate.
		if (typeof raw === 'string' && raw.trim() !== '' && !Number.isFinite(Number(raw))) {
			return true;
		}

		const value = Number(raw);

		// `Number(undefined)` is `NaN`, which a bare `!== 0` would read as visible; the PHP gate does not.
		return Number.isFinite(value) && value !== 0;
	});
}

/**
 * One shadow item as a `box-shadow` declaration value.
 *
 * A `shadowToken` binding backed by the active library wins outright and the stored legs are never
 * read — that is what keeps the value tracking the token. A binding the library no longer backs (a
 * token deleted after the post was saved) falls back to those legs, which still hold the value the
 * token resolved to when it was picked. That differs on purpose from an unbacked PER-LEG alias, which
 * `shadowAxisPx()` cannot fall back for because the alias replaced the number outright.
 *
 * @param {?Object} shadowItem   One `shadow[0]`-shaped item.
 * @param {number}  blurFallback What `blur` defaults to when unset — 14 on every current caller,
 *                               taken as an argument rather than hard-coded so the historic per-state
 *                               default stays with the call site that owns it.
 *
 * @since TBD
 *
 * @return {string} The `box-shadow` value, or '' when there is no item to render.
 */
export function shadowCss(shadowItem, blurFallback) {
	if (!shadowItem) {
		return '';
	}

	const bound = boundShadowToken(shadowItem);

	if (bound && isBackedToken(pathOfAlias(bound))) {
		return resolveTokenAlias(bound);
	}

	return (
		(shadowItem.inset ? 'inset ' : '') +
		shadowAxisPx(shadowItem.hOffset, 0) +
		'px ' +
		shadowAxisPx(shadowItem.vOffset, 0) +
		'px ' +
		shadowAxisPx(shadowItem.blur, blurFallback) +
		'px ' +
		shadowAxisPx(shadowItem.spread, 0) +
		'px ' +
		KadenceColorOutput(
			undefined !== shadowItem.color ? shadowItem.color : '#000000',
			undefined !== shadowItem.opacity ? shadowItem.opacity : 1
		)
	);
}

export default function BackendStyles(props) {
	const { attributes, isSelected, previewDevice, currentRef, context } = props;

	const {
		uniqueID,
		text,
		link,
		target,
		sponsored,
		download,
		noFollow,
		sizePreset,
		marginUnit,
		margin,
		tabletMargin,
		mobileMargin,
		padding,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		color,
		background,
		backgroundType,
		gradient,
		textBackgroundType,
		textGradient,
		textBackgroundHoverType,
		textGradientHover,
		colorHover,
		backgroundHover,
		backgroundHoverType,
		gradientHover,
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle,
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		typography,
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		borderRadiusUnit,
		borderHoverRadius,
		tabletBorderHoverRadius,
		mobileBorderHoverRadius,
		borderHoverRadiusUnit,
		width,
		widthUnit,
		widthType,
		shadow,
		shadowHover,
		iconColor,
		iconColorHover,
		colorTransparent,
		colorTransparentHover,
		backgroundTransparent,
		backgroundTransparentType,
		gradientTransparent,
		backgroundTransparentHover,
		backgroundTransparentHoverType,
		gradientTransparentHover,
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle,
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		borderTransparentRadius,
		tabletBorderTransparentRadius,
		mobileBorderTransparentRadius,
		borderTransparentRadiusUnit,
		borderTransparentHoverRadius,
		tabletBorderTransparentHoverRadius,
		mobileBorderTransparentHoverRadius,
		borderTransparentHoverRadiusUnit,
		shadowTransparent,
		shadowTransparentHover,
		colorSticky,
		colorStickyHover,
		backgroundSticky,
		backgroundStickyType,
		gradientSticky,
		backgroundStickyHover,
		backgroundStickyHoverType,
		gradientStickyHover,
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle,
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		borderStickyRadius,
		tabletBorderStickyRadius,
		mobileBorderStickyRadius,
		borderStickyRadiusUnit,
		borderStickyHoverRadius,
		tabletBorderStickyHoverRadius,
		mobileBorderStickyHoverRadius,
		borderStickyHoverRadiusUnit,
		shadowSticky,
		shadowStickyHover,
	} = attributes;

	const css = new KadenceBlocksCSS();

	const previewMarginTop = getPreviewSize(
		previewDevice,
		undefined !== margin?.[0] ? margin[0] : '',
		undefined !== tabletMargin?.[0] ? tabletMargin[0] : '',
		undefined !== mobileMargin?.[0] ? mobileMargin[0] : ''
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		undefined !== margin?.[1] ? margin[1] : '',
		undefined !== tabletMargin?.[1] ? tabletMargin[1] : '',
		undefined !== mobileMargin?.[1] ? mobileMargin[1] : ''
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		undefined !== margin?.[2] ? margin[2] : '',
		undefined !== tabletMargin?.[2] ? tabletMargin[2] : '',
		undefined !== mobileMargin?.[2] ? mobileMargin[2] : ''
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		undefined !== margin?.[3] ? margin[3] : '',
		undefined !== tabletMargin?.[3] ? tabletMargin[3] : '',
		undefined !== mobileMargin?.[3] ? mobileMargin[3] : ''
	);
	const previewMarginUnit = marginUnit ? marginUnit : 'px';

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		undefined !== padding?.[0] ? padding[0] : '',
		undefined !== tabletPadding?.[0] ? tabletPadding[0] : '',
		undefined !== mobilePadding?.[0] ? mobilePadding[0] : ''
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		undefined !== padding?.[1] ? padding[1] : '',
		undefined !== tabletPadding?.[1] ? tabletPadding[1] : '',
		undefined !== mobilePadding?.[1] ? mobilePadding[1] : ''
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		undefined !== padding?.[2] ? padding[2] : '',
		undefined !== tabletPadding?.[2] ? tabletPadding[2] : '',
		undefined !== mobilePadding?.[2] ? mobilePadding[2] : ''
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		undefined !== padding?.[3] ? padding[3] : '',
		undefined !== tabletPadding?.[3] ? tabletPadding[3] : '',
		undefined !== mobilePadding?.[3] ? mobilePadding[3] : ''
	);
	const previewPaddingUnit = paddingUnit ? paddingUnit : 'px';

	const previewFixedWidth = getPreviewSize(
		previewDevice,
		undefined !== width?.[0] ? width[0] : '',
		undefined !== width?.[1] ? width[1] : undefined,
		undefined !== width?.[2] ? width[2] : undefined
	);

	const previewBorderTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderTopColor = getBorderColor(
		previewDevice,
		'top',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderRightColor = getBorderColor(
		previewDevice,
		'right',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderBottomColor = getBorderColor(
		previewDevice,
		'bottom',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const previewBorderLeftColor = getBorderColor(
		previewDevice,
		'left',
		borderStyle,
		tabletBorderStyle,
		mobileBorderStyle
	);
	const inheritBorder = [borderStyle, tabletBorderStyle, mobileBorderStyle];
	const previewBorderHoverTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverTopColor = getBorderColor(
		previewDevice,
		'top',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverRightColor = getBorderColor(
		previewDevice,
		'right',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverBottomColor = getBorderColor(
		previewDevice,
		'bottom',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);
	const previewBorderHoverLeftColor = getBorderColor(
		previewDevice,
		'left',
		borderHoverStyle,
		tabletBorderHoverStyle,
		mobileBorderHoverStyle,
		inheritBorder
	);

	const previewHoverRadiusTop = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[0] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[0] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[0] : ''
	);
	const previewHoverRadiusRight = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[1] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[1] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[1] : ''
	);
	const previewHoverRadiusBottom = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[2] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[2] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[2] : ''
	);
	const previewHoverRadiusLeft = getPreviewSize(
		previewDevice,
		undefined !== borderHoverRadius ? borderHoverRadius[3] : '',
		undefined !== tabletBorderHoverRadius ? tabletBorderHoverRadius[3] : '',
		undefined !== mobileBorderHoverRadius ? mobileBorderHoverRadius[3] : ''
	);

	const previewRadiusTransparentTop = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentRadius ? borderTransparentRadius[0] : '',
		undefined !== tabletBorderTransparentRadius ? tabletBorderTransparentRadius[0] : '',
		undefined !== mobileBorderTransparentRadius ? mobileBorderTransparentRadius[0] : ''
	);
	const previewRadiusTransparentRight = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentRadius ? borderTransparentRadius[1] : '',
		undefined !== tabletBorderTransparentRadius ? tabletBorderTransparentRadius[1] : '',
		undefined !== mobileBorderTransparentRadius ? mobileBorderTransparentRadius[1] : ''
	);
	const previewRadiusTransparentBottom = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentRadius ? borderTransparentRadius[2] : '',
		undefined !== tabletBorderTransparentRadius ? tabletBorderTransparentRadius[2] : '',
		undefined !== mobileBorderTransparentRadius ? mobileBorderTransparentRadius[2] : ''
	);
	const previewRadiusTransparentLeft = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentRadius ? borderTransparentRadius[3] : '',
		undefined !== tabletBorderTransparentRadius ? tabletBorderTransparentRadius[3] : '',
		undefined !== mobileBorderTransparentRadius ? mobileBorderTransparentRadius[3] : ''
	);
	const previewBorderTransparentTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle
	);
	const previewBorderTransparentRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle
	);
	const previewBorderTransparentBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle
	);
	const previewBorderTransparentLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle
	);
	const inheritBorderTransparent = [
		borderTransparentStyle,
		tabletBorderTransparentStyle,
		mobileBorderTransparentStyle,
	];
	const previewBorderTransparentHoverTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		inheritBorderTransparent
	);
	const previewBorderTransparentHoverRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		inheritBorderTransparent
	);
	const previewBorderTransparentHoverBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		inheritBorderTransparent
	);
	const previewBorderTransparentHoverLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderTransparentHoverStyle,
		tabletBorderTransparentHoverStyle,
		mobileBorderTransparentHoverStyle,
		inheritBorderTransparent
	);

	const previewHoverRadiusTransparentTop = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentHoverRadius ? borderTransparentHoverRadius[0] : '',
		undefined !== tabletBorderTransparentHoverRadius ? tabletBorderTransparentHoverRadius[0] : '',
		undefined !== mobileBorderTransparentHoverRadius ? mobileBorderTransparentHoverRadius[0] : ''
	);
	const previewHoverRadiusTransparentRight = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentHoverRadius ? borderTransparentHoverRadius[1] : '',
		undefined !== tabletBorderTransparentHoverRadius ? tabletBorderTransparentHoverRadius[1] : '',
		undefined !== mobileBorderTransparentHoverRadius ? mobileBorderTransparentHoverRadius[1] : ''
	);
	const previewHoverRadiusTransparentBottom = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentHoverRadius ? borderTransparentHoverRadius[2] : '',
		undefined !== tabletBorderTransparentHoverRadius ? tabletBorderTransparentHoverRadius[2] : '',
		undefined !== mobileBorderTransparentHoverRadius ? mobileBorderTransparentHoverRadius[2] : ''
	);
	const previewHoverRadiusTransparentLeft = getPreviewSize(
		previewDevice,
		undefined !== borderTransparentHoverRadius ? borderTransparentHoverRadius[3] : '',
		undefined !== tabletBorderTransparentHoverRadius ? tabletBorderTransparentHoverRadius[3] : '',
		undefined !== mobileBorderTransparentHoverRadius ? mobileBorderTransparentHoverRadius[3] : ''
	);

	const previewRadiusStickyTop = getPreviewSize(
		previewDevice,
		undefined !== borderStickyRadius ? borderStickyRadius[0] : '',
		undefined !== tabletBorderStickyRadius ? tabletBorderStickyRadius[0] : '',
		undefined !== mobileBorderStickyRadius ? mobileBorderStickyRadius[0] : ''
	);
	const previewRadiusStickyRight = getPreviewSize(
		previewDevice,
		undefined !== borderStickyRadius ? borderStickyRadius[1] : '',
		undefined !== tabletBorderStickyRadius ? tabletBorderStickyRadius[1] : '',
		undefined !== mobileBorderStickyRadius ? mobileBorderStickyRadius[1] : ''
	);
	const previewRadiusStickyBottom = getPreviewSize(
		previewDevice,
		undefined !== borderStickyRadius ? borderStickyRadius[2] : '',
		undefined !== tabletBorderStickyRadius ? tabletBorderStickyRadius[2] : '',
		undefined !== mobileBorderStickyRadius ? mobileBorderStickyRadius[2] : ''
	);
	const previewRadiusStickyLeft = getPreviewSize(
		previewDevice,
		undefined !== borderStickyRadius ? borderStickyRadius[3] : '',
		undefined !== tabletBorderStickyRadius ? tabletBorderStickyRadius[3] : '',
		undefined !== mobileBorderStickyRadius ? mobileBorderStickyRadius[3] : ''
	);
	const previewBorderStickyTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle
	);
	const previewBorderStickyRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle
	);
	const previewBorderStickyBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle
	);
	const previewBorderStickyLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderStickyStyle,
		tabletBorderStickyStyle,
		mobileBorderStickyStyle
	);
	const inheritBorderSticky = [borderStickyStyle, tabletBorderStickyStyle, mobileBorderStickyStyle];
	const previewBorderStickyHoverTopStyle = getBorderStyle(
		previewDevice,
		'top',
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		inheritBorderSticky
	);
	const previewBorderStickyHoverRightStyle = getBorderStyle(
		previewDevice,
		'right',
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		inheritBorderSticky
	);
	const previewBorderStickyHoverBottomStyle = getBorderStyle(
		previewDevice,
		'bottom',
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		inheritBorderSticky
	);
	const previewBorderStickyHoverLeftStyle = getBorderStyle(
		previewDevice,
		'left',
		borderStickyHoverStyle,
		tabletBorderStickyHoverStyle,
		mobileBorderStickyHoverStyle,
		inheritBorderSticky
	);

	const previewHoverRadiusStickyTop = getPreviewSize(
		previewDevice,
		undefined !== borderStickyHoverRadius ? borderStickyHoverRadius[0] : '',
		undefined !== tabletBorderStickyHoverRadius ? tabletBorderStickyHoverRadius[0] : '',
		undefined !== mobileBorderStickyHoverRadius ? mobileBorderStickyHoverRadius[0] : ''
	);
	const previewHoverRadiusStickyRight = getPreviewSize(
		previewDevice,
		undefined !== borderStickyHoverRadius ? borderStickyHoverRadius[1] : '',
		undefined !== tabletBorderStickyHoverRadius ? tabletBorderStickyHoverRadius[1] : '',
		undefined !== mobileBorderStickyHoverRadius ? mobileBorderStickyHoverRadius[1] : ''
	);
	const previewHoverRadiusStickyBottom = getPreviewSize(
		previewDevice,
		undefined !== borderStickyHoverRadius ? borderStickyHoverRadius[2] : '',
		undefined !== tabletBorderStickyHoverRadius ? tabletBorderStickyHoverRadius[2] : '',
		undefined !== mobileBorderStickyHoverRadius ? mobileBorderStickyHoverRadius[2] : ''
	);
	const previewHoverRadiusStickyLeft = getPreviewSize(
		previewDevice,
		undefined !== borderStickyHoverRadius ? borderStickyHoverRadius[3] : '',
		undefined !== tabletBorderStickyHoverRadius ? tabletBorderStickyHoverRadius[3] : '',
		undefined !== mobileBorderStickyHoverRadius ? mobileBorderStickyHoverRadius[3] : ''
	);

	const previewTypographyCSS = typographyStyle(
		typography,
		`.editor-styles-wrapper .wp-block-kadence-advancedbtn .kb-single-btn-${uniqueID} .kt-button-${uniqueID}`,
		previewDevice
	);

	let btnbg;
	if (undefined !== backgroundType && 'gradient' === backgroundType) {
		btnbg = gradient;
	} else {
		btnbg = 'transparent' === background || undefined === background ? undefined : KadenceColorOutput(background);
	}

	let btnbgTransparent;
	if (undefined !== backgroundTransparentType && 'gradient' === backgroundTransparentType) {
		btnbgTransparent = gradientTransparent;
	} else {
		btnbgTransparent =
			'transparent' === backgroundTransparent || undefined === backgroundTransparent
				? undefined
				: KadenceColorOutput(backgroundTransparent);
	}

	let btnbgSticky;
	if (undefined !== backgroundStickyType && 'gradient' === backgroundStickyType) {
		btnbgSticky = gradientSticky;
	} else {
		btnbgSticky =
			'transparent' === backgroundSticky || undefined === backgroundSticky
				? undefined
				: KadenceColorOutput(backgroundSticky);
	}

	let btnRad = '0';
	// No `none` reset: an unset hover shadow must let the base state's carry through the cascade.
	let btnBox = '';
	let btnBox2 = '';
	const btnbgHover = 'gradient' === backgroundHoverType ? gradientHover : KadenceColorOutput(backgroundHover);
	if (
		hasVisibleShadow(shadowHover?.[0]) &&
		undefined !== shadowHover?.[0].inset &&
		false === shadowHover?.[0].inset
	) {
		btnBox = shadowCss(shadowHover[0], 14);
		btnBox2 = 'none';
		btnRad = '0';
	}
	if (hasVisibleShadow(shadowHover?.[0]) && undefined !== shadowHover?.[0].inset && true === shadowHover?.[0].inset) {
		btnBox2 = shadowCss(shadowHover[0], 14);
		btnRad = undefined !== borderRadius ? borderRadius : '3';
		btnBox = 'none';
	}

	let btnRadTransparent = '0';
	// See btnBox above: hover states skip the declaration when there is no visible shadow.
	let btnBoxTransparent = '';
	let btnBox2Transparent = '';
	const btnbgTransparentHover =
		'gradient' === backgroundTransparentHoverType
			? gradientTransparentHover
			: KadenceColorOutput(backgroundTransparentHover);
	if (
		hasVisibleShadow(shadowTransparentHover?.[0]) &&
		undefined !== shadowTransparentHover?.[0].inset &&
		false === shadowTransparentHover?.[0].inset
	) {
		btnBoxTransparent = shadowCss(shadowTransparentHover[0], 14);
		btnBox2Transparent = 'none';
		btnRadTransparent = '0';
	}
	if (
		hasVisibleShadow(shadowTransparentHover?.[0]) &&
		undefined !== shadowTransparentHover?.[0].inset &&
		true === shadowTransparentHover?.[0].inset
	) {
		btnBox2Transparent = shadowCss(shadowTransparentHover[0], 14);
		btnRadTransparent = undefined !== borderTransparentRadius ? borderTransparentRadius : '3';
		btnBoxTransparent = 'none';
	}

	let btnRadSticky = '0';
	// See btnBox above: hover states skip the declaration when there is no visible shadow.
	let btnBoxSticky = '';
	let btnBox2Sticky = '';
	const btnbgStickyHover =
		'gradient' === backgroundStickyHoverType ? gradientStickyHover : KadenceColorOutput(backgroundStickyHover);
	if (
		hasVisibleShadow(shadowStickyHover?.[0]) &&
		undefined !== shadowStickyHover?.[0].inset &&
		false === shadowStickyHover?.[0].inset
	) {
		btnBoxSticky = shadowCss(shadowStickyHover[0], 14);
		btnBox2Sticky = 'none';
		btnRadSticky = '0';
	}
	if (
		hasVisibleShadow(shadowStickyHover?.[0]) &&
		undefined !== shadowStickyHover?.[0].inset &&
		true === shadowStickyHover?.[0].inset
	) {
		btnBox2Sticky = shadowCss(shadowStickyHover[0], 14);
		btnRadSticky = undefined !== borderStickyRadius ? borderStickyRadius : '3';
		btnBoxSticky = 'none';
	}

	css.add_raw_styles(previewTypographyCSS);
	//global outline styles
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}.kb-btn-global-outline`);
	if (!previewBorderTopStyle) {
		css.add_property('border-top-color', css.render_color(previewBorderTopColor));
	}
	if (!previewBorderRightStyle) {
		css.add_property('border-right-color', css.render_color(previewBorderRightColor));
	}
	if (!previewBorderLeftStyle) {
		css.add_property('border-left-color', css.render_color(previewBorderLeftColor));
	}
	if (!previewBorderBottomStyle) {
		css.add_property('border-bottom-color', css.render_color(previewBorderBottomColor));
	}
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}.kb-btn-global-outline:hover`);
	if (!previewBorderHoverTopStyle) {
		css.add_property('border-top-color', css.render_color(previewBorderHoverTopColor));
	}
	if (!previewBorderHoverRightStyle) {
		css.add_property('border-right-color', css.render_color(previewBorderHoverRightColor));
	}
	if (!previewBorderHoverLeftStyle) {
		css.add_property('border-left-color', css.render_color(previewBorderHoverLeftColor));
	}
	if (!previewBorderHoverBottomStyle) {
		css.add_property('border-bottom-color', css.render_color(previewBorderHoverBottomColor));
	}
	//standard styles
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`);

	/*
	 * Mirrors the front end's gate (`render_preset_spacing` in the block's PHP): point spacing at the
	 * preset variable, but only for a property the active preset actually resolves.
	 *
	 * The condition is load-bearing rather than defensive. `padding: var(--kb-btn-padding)` with the
	 * variable undefined is invalid at computed-value time, which resets padding to 0 instead of letting
	 * the button's size class supply it — so emitting unconditionally would flatten every button that has
	 * no preset spacing. Written before the per-side output below, so an explicit attribute still wins.
	 */
	const presetSpacing = presetSpacingProperties(attributes);

	if (presetSpacing.padding) {
		css.add_property('padding', 'var(--kb-btn-padding)');
	}

	if (presetSpacing.margin) {
		css.add_property('margin', 'var(--kb-btn-margin)');
	}

	if (previewPaddingTop) {
		css.add_property('padding-top', getSpacingOptionOutput(previewPaddingTop, previewPaddingUnit));
	}
	if (previewPaddingRight) {
		css.add_property('padding-right', getSpacingOptionOutput(previewPaddingRight, previewPaddingUnit));
	}
	if (previewPaddingLeft) {
		css.add_property('padding-left', getSpacingOptionOutput(previewPaddingLeft, previewPaddingUnit));
	}
	if (previewPaddingBottom) {
		css.add_property('padding-bottom', getSpacingOptionOutput(previewPaddingBottom, previewPaddingUnit));
	}

	if (previewMarginTop) {
		css.add_property('margin-top', getSpacingOptionOutput(previewMarginTop, previewMarginUnit));
	}
	if (previewMarginRight) {
		css.add_property('margin-right', getSpacingOptionOutput(previewMarginRight, previewMarginUnit));
	}
	if (previewMarginLeft) {
		css.add_property('margin-left', getSpacingOptionOutput(previewMarginLeft, previewMarginUnit));
	}
	if (previewMarginBottom) {
		css.add_property('margin-bottom', getSpacingOptionOutput(previewMarginBottom, previewMarginUnit));
	}
	/*
	 * Mirrors the front end's gate (`render_preset_border` in the block's PHP): point border
	 * width/style/color at the preset variables, but only for a property the active preset actually
	 * resolves. Written before the per-side output below, so an explicit attribute still wins.
	 */
	const presetBorder = presetBorderProperties(attributes);

	if (presetBorder.width) {
		css.add_property('border-width', 'var(--kb-btn-border-width)');
	}

	if (presetBorder.style) {
		css.add_property('border-style', 'var(--kb-btn-border-style)');
	}

	if (presetBorder.color) {
		css.add_property('border-color', 'var(--kb-btn-border-color)');
	}

	if (previewBorderTopStyle) {
		css.add_property('border-top', previewBorderTopStyle);
	}
	if (previewBorderRightStyle) {
		css.add_property('border-right', previewBorderRightStyle);
	}
	if (previewBorderLeftStyle) {
		css.add_property('border-left', previewBorderLeftStyle);
	}
	if (previewBorderBottomStyle) {
		css.add_property('border-bottom', previewBorderBottomStyle);
	}
	// `render_measure_output` rather than four manual `render_size` calls: a corner can now be a
	// design-token alias (the box control's token-pick path), and `render_size` only knows how to
	// concatenate a number with a unit — it would emit `{alias}px`, invalid CSS, for a picked corner.
	// `render_measure_output` runs every side through the `kadence.helpers.dimensionValue` filter
	// first, the same alias-to-`var(--kb-token--…)` resolution the real (PHP-rendered) frontend
	// already uses via `render_measure_side`, so the editor preview stops disagreeing with the page
	// it is previewing.
	css.render_measure_output(
		borderRadius,
		tabletBorderRadius,
		mobileBorderRadius,
		previewDevice,
		'border-radius',
		borderRadiusUnit ? borderRadiusUnit : 'px'
	);
	/*
	 * Mirrors the front end's gate (`render_preset_shadow` in the block's PHP): point box-shadow at
	 * the preset variable, but only when the active preset actually resolves one. Written before the
	 * explicit shadow output below, and the builder appends declarations, so a visible per-block
	 * shadow lands later in the same rule and wins. The flag carries the other half of that
	 * contract: when the block's own shadow is invisible the `box-shadow: none` reset below is
	 * skipped, or the trailing `none` would silence this `var(--kb-btn-shadow)`.
	 */
	const hasPresetShadow = presetShadowProperties(attributes);
	if (hasPresetShadow) {
		css.add_property('box-shadow', 'var(--kb-btn-shadow)');
	}

	// No `color` check: it falls back to '#000000' below, so requiring it would read a colorless but
	// visible shadow as invisible, disagreeing with the PHP gate.
	const hasExplicitShadow = hasVisibleShadow(shadow?.[0]);

	if (hasExplicitShadow || !hasPresetShadow) {
		css.add_property('box-shadow', hasExplicitShadow ? shadowCss(shadow[0], 14) : 'none');
	}

	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID} .kt-button-text`);
	if (textBackgroundType === 'gradient') {
		css.add_property('background', textGradient);
		css.add_property('-webkit-background-clip', 'text');
		css.add_property('-webkit-text-fill-color', 'transparent');
	} else {
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}.kt-button.kt-button`);
		css.add_property('color', css.render_color(color));
	}

	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover .kt-button-text`);
	if (textBackgroundHoverType === 'gradient') {
		css.add_property('background', textGradientHover);
		css.add_property('-webkit-background-clip', 'text');
		css.add_property('-webkit-text-fill-color', 'transparent');
	} else {
		css.add_property('color', css.render_color(colorHover));
	}

	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`);
	css.add_property('background', btnbg);
	css.add_property(
		'width',
		undefined !== widthType &&
			'fixed' === widthType &&
			'px' === (undefined !== widthUnit ? widthUnit : 'px') &&
			'' !== previewFixedWidth
			? previewFixedWidth + (undefined !== widthUnit ? widthUnit : 'px')
			: undefined
	);

	//hover styles
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover`);
	if (previewBorderHoverTopStyle) {
		css.add_property('border-top', previewBorderHoverTopStyle);
	}
	if (previewBorderHoverRightStyle) {
		css.add_property('border-right', previewBorderHoverRightStyle);
	}
	if (previewBorderHoverLeftStyle) {
		css.add_property('border-left', previewBorderHoverLeftStyle);
	}
	if (previewBorderHoverBottomStyle) {
		css.add_property('border-bottom', previewBorderHoverBottomStyle);
	}
	if ('' !== previewHoverRadiusTop) {
		css.add_property(
			'border-top-left-radius',
			previewHoverRadiusTop + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
		);
	}
	if ('' !== previewHoverRadiusRight) {
		css.add_property(
			'border-top-right-radius',
			previewHoverRadiusRight + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
		);
	}
	if ('' !== previewHoverRadiusLeft) {
		css.add_property(
			'border-bottom-left-radius',
			previewHoverRadiusLeft + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
		);
	}
	if ('' !== previewHoverRadiusBottom) {
		css.add_property(
			'border-bottom-right-radius',
			previewHoverRadiusBottom + (borderHoverRadiusUnit ? borderHoverRadiusUnit : 'px')
		);
	}
	css.add_property('box-shadow', btnBox);
	css.add_property('color', css.render_color(colorHover));

	//transparent styles
	if (context?.['kadence/headerIsTransparent'] == '1') {
		//standard transparent styles
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`);
		if (previewBorderTransparentTopStyle) {
			css.add_property('border-top', previewBorderTransparentTopStyle);
		}
		if (previewBorderTransparentRightStyle) {
			css.add_property('border-right', previewBorderTransparentRightStyle);
		}
		if (previewBorderTransparentLeftStyle) {
			css.add_property('border-left', previewBorderTransparentLeftStyle);
		}
		if (previewBorderTransparentBottomStyle) {
			css.add_property('border-bottom', previewBorderTransparentBottomStyle);
		}
		if ('' !== previewRadiusTransparentTop) {
			css.add_property(
				'border-top-left-radius',
				previewRadiusTransparentTop + (borderTransparentRadiusUnit ? borderTransparentRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusTransparentRight) {
			css.add_property(
				'border-top-right-radius',
				previewRadiusTransparentRight + (borderTransparentRadiusUnit ? borderTransparentRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusTransparentLeft) {
			css.add_property(
				'border-bottom-left-radius',
				previewRadiusTransparentLeft + (borderTransparentRadiusUnit ? borderTransparentRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusTransparentBottom) {
			css.add_property(
				'border-bottom-right-radius',
				previewRadiusTransparentBottom + (borderTransparentRadiusUnit ? borderTransparentRadiusUnit : 'px')
			);
		}
		// No `none` fallback: this selector outranks the base rule, which must carry through instead.
		if (hasVisibleShadow(shadowTransparent?.[0])) {
			css.add_property('box-shadow', shadowCss(shadowTransparent[0], 14));
		}
		css.add_property('color', css.render_color(colorTransparent));
		css.add_property('background', btnbgTransparent);

		//hover styles
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover`);
		if (previewBorderTransparentHoverTopStyle) {
			css.add_property('border-top', previewBorderTransparentHoverTopStyle);
		}
		if (previewBorderTransparentHoverRightStyle) {
			css.add_property('border-right', previewBorderTransparentHoverRightStyle);
		}
		if (previewBorderTransparentHoverLeftStyle) {
			css.add_property('border-left', previewBorderTransparentHoverLeftStyle);
		}
		if (previewBorderTransparentHoverBottomStyle) {
			css.add_property('border-bottom', previewBorderTransparentHoverBottomStyle);
		}
		if ('' !== previewHoverRadiusTransparentTop) {
			css.add_property(
				'border-top-left-radius',
				previewHoverRadiusTransparentTop +
					(borderTransparentHoverRadiusUnit ? borderTransparentHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusTransparentRight) {
			css.add_property(
				'border-top-right-radius',
				previewHoverRadiusTransparentRight +
					(borderTransparentHoverRadiusUnit ? borderTransparentHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusTransparentLeft) {
			css.add_property(
				'border-bottom-left-radius',
				previewHoverRadiusTransparentLeft +
					(borderTransparentHoverRadiusUnit ? borderTransparentHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusTransparentBottom) {
			css.add_property(
				'border-bottom-right-radius',
				previewHoverRadiusTransparentBottom +
					(borderTransparentHoverRadiusUnit ? borderTransparentHoverRadiusUnit : 'px')
			);
		}
		css.add_property('box-shadow', btnBoxTransparent);
		css.add_property('color', css.render_color(colorTransparentHover));
	}

	//sticky styles
	if (context?.['kadence/headerIsSticky'] == '1') {
		//standard sticky styles
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}`);
		if (previewBorderStickyTopStyle) {
			css.add_property('border-top', previewBorderStickyTopStyle);
		}
		if (previewBorderStickyRightStyle) {
			css.add_property('border-right', previewBorderStickyRightStyle);
		}
		if (previewBorderStickyLeftStyle) {
			css.add_property('border-left', previewBorderStickyLeftStyle);
		}
		if (previewBorderStickyBottomStyle) {
			css.add_property('border-bottom', previewBorderStickyBottomStyle);
		}
		if ('' !== previewRadiusStickyTop) {
			css.add_property(
				'border-top-left-radius',
				previewRadiusStickyTop + (borderStickyRadiusUnit ? borderStickyRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusStickyRight) {
			css.add_property(
				'border-top-right-radius',
				previewRadiusStickyRight + (borderStickyRadiusUnit ? borderStickyRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusStickyLeft) {
			css.add_property(
				'border-bottom-left-radius',
				previewRadiusStickyLeft + (borderStickyRadiusUnit ? borderStickyRadiusUnit : 'px')
			);
		}
		if ('' !== previewRadiusStickyBottom) {
			css.add_property(
				'border-bottom-right-radius',
				previewRadiusStickyBottom + (borderStickyRadiusUnit ? borderStickyRadiusUnit : 'px')
			);
		}
		// No `none` fallback: this selector outranks the base rule, which must carry through instead.
		if (hasVisibleShadow(shadowSticky?.[0])) {
			css.add_property('box-shadow', shadowCss(shadowSticky[0], 14));
		}
		css.add_property('color', css.render_color(colorSticky));
		css.add_property('background', btnbgSticky);

		//hover styles
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover`);
		if (previewBorderStickyHoverTopStyle) {
			css.add_property('border-top', previewBorderStickyHoverTopStyle);
		}
		if (previewBorderStickyHoverRightStyle) {
			css.add_property('border-right', previewBorderStickyHoverRightStyle);
		}
		if (previewBorderStickyHoverLeftStyle) {
			css.add_property('border-left', previewBorderStickyHoverLeftStyle);
		}
		if (previewBorderStickyHoverBottomStyle) {
			css.add_property('border-bottom', previewBorderStickyHoverBottomStyle);
		}
		if ('' !== previewHoverRadiusStickyTop) {
			css.add_property(
				'border-top-left-radius',
				previewHoverRadiusStickyTop + (borderStickyHoverRadiusUnit ? borderStickyHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusStickyRight) {
			css.add_property(
				'border-top-right-radius',
				previewHoverRadiusStickyRight + (borderStickyHoverRadiusUnit ? borderStickyHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusStickyLeft) {
			css.add_property(
				'border-bottom-left-radius',
				previewHoverRadiusStickyLeft + (borderStickyHoverRadiusUnit ? borderStickyHoverRadiusUnit : 'px')
			);
		}
		if ('' !== previewHoverRadiusStickyBottom) {
			css.add_property(
				'border-bottom-right-radius',
				previewHoverRadiusStickyBottom + (borderStickyHoverRadiusUnit ? borderStickyHoverRadiusUnit : 'px')
			);
		}
		css.add_property('box-shadow', btnBoxSticky);
		css.add_property('color', css.render_color(colorStickyHover));
	}

	//icon styles
	if (iconColor) {
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID} .kt-btn-svg-icon`);
		css.add_property('color', css.render_color(iconColor));
	}
	if (iconColorHover) {
		css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}:hover .kt-btn-svg-icon`);
		css.add_property('color', css.render_color(iconColorHover));
	}
	//pseudo styles
	css.set_selector(`.kb-single-btn-${uniqueID} .kt-button-${uniqueID}::before`);
	css.add_property('background', btnbgHover);
	css.add_property('box-shadow', btnBox2);
	css.add_property('border-radius', btnRad);

	const cssOutput = css.css_output();
	return <style>{`${cssOutput}`}</style>;
}
