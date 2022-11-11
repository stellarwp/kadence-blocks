import {
    getPreviewSize,
    KadenceColorOutput,
    getSpacingOptionOutput
} from '@kadence/helpers';
import { IconRender } from '@kadence/components';

export function PreviewIcon({ icons, index, previewDevice}) {

    const previewSize = getPreviewSize( previewDevice, ( icons[ index ].size ? icons[ index ].size : undefined ), ( undefined !== icons[ index ].tabletSize && icons[ index ].tabletSize ? icons[ index ].tabletSize : undefined ), ( undefined !== icons[ index ].mobileSize && icons[ index ].mobileSize ? icons[ index ].mobileSize : undefined ) );

    const previewMarginTop = getPreviewSize( previewDevice, ( icons[ index ].margin && undefined !== icons[ index ].margin[ 0 ] ? icons[ index ].margin[ 0 ] : undefined ), ( icons[ index ].tabletMargin && undefined !== icons[ index ].tabletMargin[ 0 ] ? icons[ index ].tabletMargin[ 0 ] : undefined ), ( icons[ index ].mobileMargin && undefined !== icons[ index ].mobileMargin[ 0 ] ? icons[ index ].mobileMargin[ 0 ] : undefined ) );
    const previewMarginRight = getPreviewSize( previewDevice, ( icons[ index ].margin && undefined !== icons[ index ].margin[ 1 ] ? icons[ index ].margin[ 1 ] : undefined ), ( icons[ index ].tabletMargin && undefined !== icons[ index ].tabletMargin[ 1 ] ? icons[ index ].tabletMargin[ 1 ] : undefined ), ( icons[ index ].mobileMargin && undefined !== icons[ index ].mobileMargin[ 1 ] ? icons[ index ].mobileMargin[ 1 ] : undefined ) );
    const previewMarginBottom = getPreviewSize( previewDevice, ( icons[ index ].margin && undefined !== icons[ index ].margin[ 2 ] ? icons[ index ].margin[ 2 ] : undefined ), ( icons[ index ].tabletMargin && undefined !== icons[ index ].tabletMargin[ 2 ] ? icons[ index ].tabletMargin[ 2 ] : undefined ), ( icons[ index ].mobileMargin && undefined !== icons[ index ].mobileMargin[ 2 ] ? icons[ index ].mobileMargin[ 2 ] : undefined ) );
    const previewMarginLeft	 = getPreviewSize( previewDevice, ( icons[ index ].margin && undefined !== icons[ index ].margin[ 3 ] ? icons[ index ].margin[ 3 ] : undefined ), ( icons[ index ].tabletMargin && undefined !== icons[ index ].tabletMargin[ 3 ] ? icons[ index ].tabletMargin[ 3 ] : undefined ), ( icons[ index ].mobileMargin && undefined !== icons[ index ].mobileMargin[ 3 ] ? icons[ index ].mobileMargin[ 3 ] : undefined ) );

    const previewPaddingTop = getPreviewSize( previewDevice, ( icons[ index ].padding && undefined !== icons[ index ].padding[ 0 ] ? icons[ index ].padding[ 0 ] : undefined ), ( icons[ index ].tabletPadding && undefined !== icons[ index ].tabletPadding[ 0 ] ? icons[ index ].tabletPadding[ 0 ] : undefined ), ( icons[ index ].mobilePadding && undefined !== icons[ index ].mobilePadding[ 0 ] ? icons[ index ].mobilePadding[ 0 ] : undefined ) );
    const previewPaddingRight = getPreviewSize( previewDevice, ( icons[ index ].padding && undefined !== icons[ index ].padding[ 1 ] ? icons[ index ].padding[ 1 ] : undefined ), ( icons[ index ].tabletPadding && undefined !== icons[ index ].tabletPadding[ 1 ] ? icons[ index ].tabletPadding[ 1 ] : undefined ), ( icons[ index ].mobilePadding && undefined !== icons[ index ].mobilePadding[ 1 ] ? icons[ index ].mobilePadding[ 1 ] : undefined ) );
    const previewPaddingBottom = getPreviewSize( previewDevice, ( icons[ index ].padding && undefined !== icons[ index ].padding[ 2 ] ? icons[ index ].padding[ 2 ] : undefined ), ( icons[ index ].tabletPadding && undefined !== icons[ index ].tabletPadding[ 2 ] ? icons[ index ].tabletPadding[ 2 ] : undefined ), ( icons[ index ].mobilePadding && undefined !== icons[ index ].mobilePadding[ 2 ] ? icons[ index ].mobilePadding[ 2 ] : undefined ) );
    const previewPaddingLeft	 = getPreviewSize( previewDevice, ( icons[ index ].padding && undefined !== icons[ index ].padding[ 3 ] ? icons[ index ].padding[ 3 ] : undefined ), ( icons[ index ].tabletPadding && undefined !== icons[ index ].tabletPadding[ 3 ] ? icons[ index ].tabletPadding[ 3 ] : undefined ), ( icons[ index ].mobilePadding && undefined !== icons[ index ].mobilePadding[ 3 ] ? icons[ index ].mobilePadding[ 3 ] : undefined ) );

    const previewPaddingUnit = undefined !== icons[ index ].paddingUnit && icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px';
    const previewMarginUnit = undefined !== icons[ index ].marginUnit && icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px';

    return (
        <div className={`kt-svg-style-${icons[ index ].style} kt-svg-icon-wrap kt-svg-item-${index}`}>
            {icons[ index ].icon && (
                <>
                    <IconRender
                        className={`kt-svg-icon kt-svg-icon-${icons[ index ].icon}`} name={icons[ index ].icon} size={ previewSize }
                        strokeWidth={( 'fe' === icons[ index ].icon.substring( 0, 2 ) ? icons[ index ].width : undefined )} title={( icons[ index ].title ? icons[ index ].title : '' )}
                        style={ {
                            color          : ( icons[ index ].color ? KadenceColorOutput( icons[ index ].color ) : undefined ),
                            backgroundColor: ( icons[ index ].background && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].background ) : undefined ),
                            paddingTop        : ( previewPaddingTop && icons[ index ].style !== 'default' ? getSpacingOptionOutput( previewPaddingTop, previewPaddingUnit ) : undefined ),
                            paddingRight        : ( previewPaddingRight && icons[ index ].style !== 'default' ? getSpacingOptionOutput( previewPaddingRight, previewPaddingUnit ) : undefined ),
                            paddingBottom        : ( previewPaddingBottom && icons[ index ].style !== 'default' ? getSpacingOptionOutput( previewPaddingBottom, previewPaddingUnit ) : undefined ),
                            paddingLeft        : ( previewPaddingLeft && icons[ index ].style !== 'default' ? getSpacingOptionOutput( previewPaddingLeft, previewPaddingUnit ) : undefined ),
                            borderColor    : ( icons[ index ].border && icons[ index ].style !== 'default' ? KadenceColorOutput( icons[ index ].border ) : undefined ),
                            borderWidth    : ( icons[ index ].borderWidth && icons[ index ].style !== 'default' ? icons[ index ].borderWidth + 'px' : undefined ),
                            borderRadius   : ( icons[ index ].borderRadius && icons[ index ].style !== 'default' ? icons[ index ].borderRadius + '%' : undefined ),
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