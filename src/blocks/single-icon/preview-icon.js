import { getPreviewSize, KadenceColorOutput, getSpacingOptionOutput } from '@kadence/helpers';
import { useRef } from '@wordpress/element';
import { IconRender, Tooltip } from '@kadence/components';
import { tokenPx } from '../../extension/design-tokens/token-px';
import { boundTokenAliasForControl } from '../../extension/token-picker';
import metadata from './block.json';

/**
 * Whether a size attribute holds a usable raw number.
 *
 * The attribute accepts a number or a token alias, and the token picker's Reset writes an empty
 * string, so "has a value" cannot be a truthiness check: `0` is a real size, while `''` and an alias
 * the library no longer defines are not numbers at all and would reach the SVG as a broken
 * `width` attribute.
 *
 * @param {*} value The stored size.
 *
 * @since TBD
 *
 * @return {boolean} Whether the value is a finite number this can render with.
 */
function hasIconSize(value) {
	return value !== '' && value !== null && value !== undefined && Number.isFinite(Number(value));
}

export function PreviewIcon({ attributes, previewDevice }) {
	const ref = useRef();
	const {
		inQueryBlock,
		icon,
		link,
		target,
		size,
		width,
		title,
		text,
		hColor,
		hBackground,
		tabletSize,
		hBorder,
		color,
		background,
		border,
		borderRadius,
		padding,
		borderWidth,
		style,
		linkTitle,
		level,
		blockAlignment,
		textAlignment,
		tabletTextAlignment,
		mobileTextAlignment,
		tabletPadding,
		mobilePadding,
		paddingUnit,
		tabletMargin,
		mobileMargin,
		margin,
		marginUnit,
		mobileSize,
		uniqueID,
		verticalAlignment,
		tooltip,
		tooltipPlacement,
		tooltipDash,
	} = attributes;

	const previewSize = getPreviewSize(
		previewDevice,
		undefined !== size ? size : undefined,
		undefined !== tabletSize || tabletSize === 0 ? tabletSize : undefined,
		undefined !== mobileSize || mobileSize === 0 ? mobileSize : undefined
	);
	// `IconRender` writes the size into the SVG's `width`/`height` presentation attributes, and a geometry
	// attribute takes a number — not a `var()`, and not an empty string, which produces `width=""` and an
	// icon with no rendered size at all. The front end has neither problem: it renders the same attribute
	// as a `font-size` declaration, resolving an alias to the token's var() and a cleared size to the
	// icon-size token's fallback rule. Both of those become a number here instead, on the same 16px root
	// assumption PHP uses, so the two render paths agree.
	//
	// A cleared size therefore falls back to the very token the block-default CSS names for it, read from
	// the binding rather than restated. Anything still unresolved after that is left `undefined` so
	// `GenIcon` applies its own default, which is the one shape that renders rather than breaking.
	const previewSizePx =
		tokenPx(previewSize) ??
		(hasIconSize(previewSize)
			? previewSize
			: (tokenPx(boundTokenAliasForControl(metadata.name, 'size')) ?? undefined));
	const previewMarginTop = getPreviewSize(
		previewDevice,
		margin && undefined !== margin[0] ? margin[0] : undefined,
		tabletMargin && undefined !== tabletMargin[0] ? tabletMargin[0] : undefined,
		mobileMargin && undefined !== mobileMargin[0] ? mobileMargin[0] : undefined
	);
	const previewMarginRight = getPreviewSize(
		previewDevice,
		margin && undefined !== margin[1] ? margin[1] : undefined,
		tabletMargin && undefined !== tabletMargin[1] ? tabletMargin[1] : undefined,
		mobileMargin && undefined !== mobileMargin[1] ? mobileMargin[1] : undefined
	);
	const previewMarginBottom = getPreviewSize(
		previewDevice,
		margin && undefined !== margin[2] ? margin[2] : undefined,
		tabletMargin && undefined !== tabletMargin[2] ? tabletMargin[2] : undefined,
		mobileMargin && undefined !== mobileMargin[2] ? mobileMargin[2] : undefined
	);
	const previewMarginLeft = getPreviewSize(
		previewDevice,
		margin && undefined !== margin[3] ? margin[3] : undefined,
		tabletMargin && undefined !== tabletMargin[3] ? tabletMargin[3] : undefined,
		mobileMargin && undefined !== mobileMargin[3] ? mobileMargin[3] : undefined
	);

	const previewPaddingTop = getPreviewSize(
		previewDevice,
		padding && undefined !== padding[0] ? padding[0] : undefined,
		tabletPadding && undefined !== tabletPadding[0] ? tabletPadding[0] : undefined,
		mobilePadding && undefined !== mobilePadding[0] ? mobilePadding[0] : undefined
	);
	const previewPaddingRight = getPreviewSize(
		previewDevice,
		padding && undefined !== padding[1] ? padding[1] : undefined,
		tabletPadding && undefined !== tabletPadding[1] ? tabletPadding[1] : undefined,
		mobilePadding && undefined !== mobilePadding[1] ? mobilePadding[1] : undefined
	);
	const previewPaddingBottom = getPreviewSize(
		previewDevice,
		padding && undefined !== padding[2] ? padding[2] : undefined,
		tabletPadding && undefined !== tabletPadding[2] ? tabletPadding[2] : undefined,
		mobilePadding && undefined !== mobilePadding[2] ? mobilePadding[2] : undefined
	);
	const previewPaddingLeft = getPreviewSize(
		previewDevice,
		padding && undefined !== padding[3] ? padding[3] : undefined,
		tabletPadding && undefined !== tabletPadding[3] ? tabletPadding[3] : undefined,
		mobilePadding && undefined !== mobilePadding[3] ? mobilePadding[3] : undefined
	);

	const previewPaddingUnit = undefined !== paddingUnit && paddingUnit ? paddingUnit : 'px';
	const previewMarginUnit = undefined !== marginUnit && marginUnit ? marginUnit : 'px';
	return (
		<Tooltip text={tooltip} placement={tooltipPlacement || 'top'}>
			<div
				className={`kt-svg-style-${style} kt-svg-icon-wrap kt-svg-item-${uniqueID}${
					tooltipDash && tooltip ? ' kb-icon-tooltip-border' : ''
				}`}
			>
				{icon && (
					<>
						<IconRender
							className={`kt-svg-icon kt-svg-icon-${icon}`}
							name={icon}
							size={previewSizePx}
							strokeWidth={'fe' === icon.substring(0, 2) ? width : undefined}
							title={title ? title : ''}
							style={{
								color: color ? KadenceColorOutput(color) : undefined,
								backgroundColor:
									background && style !== 'default' ? KadenceColorOutput(background) : undefined,
								paddingTop:
									previewPaddingTop && style !== 'default'
										? getSpacingOptionOutput(previewPaddingTop, previewPaddingUnit)
										: undefined,
								paddingRight:
									previewPaddingRight && style !== 'default'
										? getSpacingOptionOutput(previewPaddingRight, previewPaddingUnit)
										: undefined,
								paddingBottom:
									previewPaddingBottom && style !== 'default'
										? getSpacingOptionOutput(previewPaddingBottom, previewPaddingUnit)
										: undefined,
								paddingLeft:
									previewPaddingLeft && style !== 'default'
										? getSpacingOptionOutput(previewPaddingLeft, previewPaddingUnit)
										: undefined,
								borderColor: border && style !== 'default' ? KadenceColorOutput(border) : undefined,
								borderWidth: borderWidth && style !== 'default' ? borderWidth + 'px' : undefined,
								borderRadius: borderRadius && style !== 'default' ? borderRadius + '%' : undefined,
								marginTop: previewMarginTop
									? getSpacingOptionOutput(previewMarginTop, previewMarginUnit)
									: undefined,
								marginRight: previewMarginRight
									? getSpacingOptionOutput(previewMarginRight, previewMarginUnit)
									: undefined,
								marginBottom: previewMarginBottom
									? getSpacingOptionOutput(previewMarginBottom, previewMarginUnit)
									: undefined,
								marginLeft: previewMarginLeft
									? getSpacingOptionOutput(previewMarginLeft, previewMarginUnit)
									: undefined,
							}}
						/>
					</>
				)}
			</div>
		</Tooltip>
	);
}
