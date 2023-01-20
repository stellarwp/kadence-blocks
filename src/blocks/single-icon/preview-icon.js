import {
    getPreviewSize,
    KadenceColorOutput,
    getSpacingOptionOutput
} from '@kadence/helpers';
import { IconRender } from '@kadence/components';

export function PreviewIcon({ attributes, previewDevice}) {

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
        verticalAlignment
    } = attributes;
    
    const previewSize = getPreviewSize( previewDevice, ( size ? size : undefined ), ( undefined !== tabletSize && tabletSize ? tabletSize : undefined ), ( undefined !== mobileSize && mobileSize ? mobileSize : undefined ) );

    const previewMarginTop = getPreviewSize( previewDevice, ( margin && undefined !== margin[ 0 ] ? margin[ 0 ] : undefined ), ( tabletMargin && undefined !== tabletMargin[ 0 ] ? tabletMargin[ 0 ] : undefined ), ( mobileMargin && undefined !== mobileMargin[ 0 ] ? mobileMargin[ 0 ] : undefined ) );
    const previewMarginRight = getPreviewSize( previewDevice, ( margin && undefined !== margin[ 1 ] ? margin[ 1 ] : undefined ), ( tabletMargin && undefined !== tabletMargin[ 1 ] ? tabletMargin[ 1 ] : undefined ), ( mobileMargin && undefined !== mobileMargin[ 1 ] ? mobileMargin[ 1 ] : undefined ) );
    const previewMarginBottom = getPreviewSize( previewDevice, ( margin && undefined !== margin[ 2 ] ? margin[ 2 ] : undefined ), ( tabletMargin && undefined !== tabletMargin[ 2 ] ? tabletMargin[ 2 ] : undefined ), ( mobileMargin && undefined !== mobileMargin[ 2 ] ? mobileMargin[ 2 ] : undefined ) );
    const previewMarginLeft	 = getPreviewSize( previewDevice, ( margin && undefined !== margin[ 3 ] ? margin[ 3 ] : undefined ), ( tabletMargin && undefined !== tabletMargin[ 3 ] ? tabletMargin[ 3 ] : undefined ), ( mobileMargin && undefined !== mobileMargin[ 3 ] ? mobileMargin[ 3 ] : undefined ) );

    const previewPaddingTop = getPreviewSize( previewDevice, ( padding && undefined !== padding[ 0 ] ? padding[ 0 ] : undefined ), ( tabletPadding && undefined !== tabletPadding[ 0 ] ? tabletPadding[ 0 ] : undefined ), ( mobilePadding && undefined !== mobilePadding[ 0 ] ? mobilePadding[ 0 ] : undefined ) );
    const previewPaddingRight = getPreviewSize( previewDevice, ( padding && undefined !== padding[ 1 ] ? padding[ 1 ] : undefined ), ( tabletPadding && undefined !== tabletPadding[ 1 ] ? tabletPadding[ 1 ] : undefined ), ( mobilePadding && undefined !== mobilePadding[ 1 ] ? mobilePadding[ 1 ] : undefined ) );
    const previewPaddingBottom = getPreviewSize( previewDevice, ( padding && undefined !== padding[ 2 ] ? padding[ 2 ] : undefined ), ( tabletPadding && undefined !== tabletPadding[ 2 ] ? tabletPadding[ 2 ] : undefined ), ( mobilePadding && undefined !== mobilePadding[ 2 ] ? mobilePadding[ 2 ] : undefined ) );
    const previewPaddingLeft	 = getPreviewSize( previewDevice, ( padding && undefined !== padding[ 3 ] ? padding[ 3 ] : undefined ), ( tabletPadding && undefined !== tabletPadding[ 3 ] ? tabletPadding[ 3 ] : undefined ), ( mobilePadding && undefined !== mobilePadding[ 3 ] ? mobilePadding[ 3 ] : undefined ) );

    const previewPaddingUnit = undefined !== paddingUnit && paddingUnit ? paddingUnit : 'px';
    const previewMarginUnit = undefined !== marginUnit && marginUnit ? marginUnit : 'px';

    return (
        <div className={`kt-svg-style-${style} kt-svg-icon-wrap kt-svg-item-${uniqueID}`}>
            {icon && (
                <>
                    <IconRender
                        className={`kt-svg-icon kt-svg-icon-${icon}`} name={icon} size={ previewSize }
                        strokeWidth={( 'fe' === icon.substring( 0, 2 ) ? width : undefined )} title={( title ? title : '' )}
                        style={ {
                            color          : ( color ? KadenceColorOutput( color ) : undefined ),
                            backgroundColor: ( background && style !== 'default' ? KadenceColorOutput( background ) : undefined ),
                            paddingTop        : ( previewPaddingTop && style !== 'default' ? getSpacingOptionOutput( previewPaddingTop, previewPaddingUnit ) : undefined ),
                            paddingRight        : ( previewPaddingRight && style !== 'default' ? getSpacingOptionOutput( previewPaddingRight, previewPaddingUnit ) : undefined ),
                            paddingBottom        : ( previewPaddingBottom && style !== 'default' ? getSpacingOptionOutput( previewPaddingBottom, previewPaddingUnit ) : undefined ),
                            paddingLeft        : ( previewPaddingLeft && style !== 'default' ? getSpacingOptionOutput( previewPaddingLeft, previewPaddingUnit ) : undefined ),
                            borderColor    : ( border && style !== 'default' ? KadenceColorOutput( border ) : undefined ),
                            borderWidth    : ( borderWidth && style !== 'default' ? borderWidth + 'px' : undefined ),
                            borderRadius   : ( borderRadius && style !== 'default' ? borderRadius + '%' : undefined ),
                            marginTop      : ( previewMarginTop ? getSpacingOptionOutput( previewMarginTop, previewMarginUnit ) : undefined ),
                            marginRight    : ( previewMarginRight ? getSpacingOptionOutput( previewMarginRight, previewMarginUnit ) : undefined ),
                            marginBottom   : ( previewMarginBottom ? getSpacingOptionOutput( previewMarginBottom, previewMarginUnit ) : undefined ),
                            marginLeft     : ( previewMarginLeft ? getSpacingOptionOutput( previewMarginLeft, previewMarginUnit ) : undefined ),
                        } }
                    />
                </>
            ) }
        </div>
    );

}