import {
    ResponsiveMeasureRangeControl,
    KadencePanelBody
} from '@kadence/components';
import {__} from "@wordpress/i18n";

export function AdvancedSettings({ iconCount, icons, index, saveArrayUpdate }) {

    return (
        <KadencePanelBody
            title={ __( 'Icon', 'kadence-blocks' ) + ' ' + ( index + 1 ) + ' ' + __( 'Spacing Settings', 'kadence-blocks' )}
            initialOpen={ ( 1 === iconCount ? true : false ) }
            panelName={'iconSpacing'}
            index={index}
            blockSlug={ 'kadence/icon' }
        >
            { icons[ index ].style !== 'default' && (
                <ResponsiveMeasureRangeControl
                    label={__( 'Icon Padding', 'kadence-blocks' )}
                    value={ ( icons[ index ].padding ? icons[ index ].padding : ['', '', '', ''] ) }
                    onChange={ ( value ) => saveArrayUpdate( { padding: value }, index ) }
                    tabletValue={ ( icons[ index ].tabletPadding ? icons[ index ].tabletPadding : ['', '', '', ''] ) }
                    onChangeTablet={( value ) => saveArrayUpdate( { tabletPadding: value }, index ) }
                    mobileValue={ ( icons[ index ].mobilePadding ? icons[ index ].mobilePadding : ['', '', '', ''] ) }
                    onChangeMobile={( value ) => saveArrayUpdate( { mobilePadding: value }, index ) }
                    min={ 0 }
                    max={ ( ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) === 'em' || ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) === 'rem' ? 12 : 200 ) }
                    step={ ( ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) === 'em' || ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) === 'rem' ? 0.1 : 1 ) }
                    unit={ ( icons[ index ].paddingUnit ? icons[ index ].paddingUnit : 'px' ) }
                    units={ [ 'px', 'em', 'rem' ] }
                    onUnit={ ( value ) => saveArrayUpdate( { paddingUnit: value }, index ) }
                />
            ) }
            <ResponsiveMeasureRangeControl
                label={__( 'Icon Margin', 'kadence-blocks' )}
                value={ ( icons[ index ].margin ? icons[ index ].margin : ['', '', '', ''] ) }
                onChange={ ( value ) => saveArrayUpdate( { margin: value }, index ) }
                tabletValue={ ( icons[ index ].tabletMargin ? icons[ index ].tabletMargin : ['', '', '', ''] ) }
                onChangeTablet={( value ) => saveArrayUpdate( { tabletMargin: value }, index ) }
                mobileValue={ ( icons[ index ].mobileMargin ? icons[ index ].mobileMargin : ['', '', '', ''] ) }
                onChangeMobile={( value ) => saveArrayUpdate( { mobileMargin: value }, index ) }
                min={ ( ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'em' || ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'rem' ? -2 : -200 ) }
                max={ ( ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'em' || ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'rem' ? 12 : 200 ) }
                step={ ( ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'em' || ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) === 'rem' ? 0.1 : 1 ) }
                unit={ ( icons[ index ].marginUnit ? icons[ index ].marginUnit : 'px' ) }
                units={ [ 'px', 'em', 'rem' ] }
                onUnit={ ( value ) => saveArrayUpdate( { marginUnit: value }, index ) }
            />
        </KadencePanelBody>
    );

}