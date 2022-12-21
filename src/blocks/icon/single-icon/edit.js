/**
 * BLOCK: Kadence Icon
 */
/**
 * Import externals
 */
import { times, map } from 'lodash';
import {
    PopColorControl,
    StepControls,
    IconRender,
    KadencePanelBody,
    URLInputControl,
    ResponsiveRangeControls,
    InspectorControlTabs,
    RangeControl,
    KadenceRadioButtons,
    ResponsiveAlignControls,
    KadenceInspectorControls,
    KadenceBlockDefaults,
    KadenceIconPicker,
    ResponsiveMeasureRangeControl,
    SpacingVisualizer
} from '@kadence/components';
import {
    KadenceColorOutput,
    getPreviewSize,
    setBlockDefaults,
    getSpacingOptionOutput,
} from '@kadence/helpers';
import { useSelect, useDispatch } from '@wordpress/data';
import { PreviewIcon } from './preview-icon';
import { AdvancedSettings } from './advanced-settings';


import metadata from './block.json';

/**
 * Internal block libraries
 */
import { __ } from '@wordpress/i18n';

import {
    useBlockProps
} from '@wordpress/block-editor';
import {
    Fragment,
    useEffect,
    useState
} from '@wordpress/element';
import {
    TextControl,
    SelectControl,
    Button,
    Dashicon,
    TabPanel,
    ToolbarGroup,
} from '@wordpress/components';

function KadenceSingleIcon( { attributes, className, setAttributes, clientId, context } ) {

    const index = 0;

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
        tabletPadding,
        mobilePadding,
        paddingUnit,
        tabletMargin,
        mobileMargin,
        margin,
        marginUnit,
        mobileSize,
        uniqueID
    } = attributes;

    const icons = {
        icon,
        link,
        target,
        title,
        size,
        width,
        text,
        color,
        background,
        hColor,
        hBackground,
        hBorder,
        border,
        borderRadius,
        linkTitle,
        padding,
        tabletSize,
        borderWidth,
        tabletMargin,
        mobileSize,
        style,
        level
    };

    const [ activeTab, setActiveTab ] = useState( 'general' );

    const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
    const { isUniqueID, isUniqueBlock, previewDevice } = useSelect(
        ( select ) => {
            return {
                isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
                isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
                previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
            };
        },
        [ clientId ]
    );

    useEffect( () => {
        let smallID = '_' + clientId.substr( 2, 9 );
        if ( ! uniqueID ) {
            attributes = setBlockDefaults( 'kadence/icon', attributes);

            if ( ! isUniqueID( uniqueID ) ) {
                smallID = uniqueId( smallID );
            }
            setAttributes( {
                uniqueID: smallID,
            } );
            addUniqueID( smallID, clientId );
        } else if ( ! isUniqueID( uniqueID ) ) {
            // This checks if we are just switching views, client ID the same means we don't need to update.
            if ( ! isUniqueBlock( uniqueID, clientId ) ) {
                attributes.uniqueID = smallID;
                addUniqueID( smallID, clientId );
            }
        } else {
            addUniqueID( uniqueID, clientId );
        }
        if ( context && ( context.queryId || Number.isFinite( context.queryId ) ) && context.postId ) {
            if ( ! attributes.inQueryBlock ) {
                setAttributes( {
                    inQueryBlock: true,
                } );
            }
        } else if ( attributes.inQueryBlock ) {
            setAttributes( {
                inQueryBlock: false,
            } );
        }
    }, [] );

    const blockProps = useBlockProps( {
        className: className,
    } );

    const renderCSS = (
        <style>
            {`.kt-svg-icons-${uniqueID} .kt-svg-icons-${uniqueID}:hover .kt-svg-icon {
					${( undefined !== hColor && hColor ? 'color:' + KadenceColorOutput( hColor ) + '!important;' : '' )}
					${( undefined !== hBackground && hBackground ? 'background:' + KadenceColorOutput( hBackground ) + '!important;' : '' )}
					${( undefined !== hBorder && hBorder ? 'border-color:' + KadenceColorOutput( hBorder ) + '!important;' : '' )}
            }`}
        </style>
    );

    return (
        <div {...blockProps}>
            {renderCSS}
            <KadenceInspectorControls blockSlug={ 'kadence/icon' }>

                <InspectorControlTabs
                    panelName={ 'single-icon' }
                    allowedTabs={ [ 'general', 'advanced' ] }
                    setActiveTab={ ( value ) => setActiveTab( value ) }
                    activeTab={ activeTab }
                />

                {( activeTab === 'general' ) &&
                    <>
                        {/*<KadencePanelBody*/}
                        {/*    title={__( 'Icon Count', 'kadence-blocks' )}*/}
                        {/*    initialOpen={true}*/}
                        {/*    panelName={'kb-icon-count'}*/}
                        {/*>*/}
                        {/*    <ResponsiveAlignControls*/}
                        {/*        label={__( 'Icons Alignment', 'kadence-blocks' )}*/}
                        {/*        value={( textAlignment ? textAlignment : '' )}*/}
                        {/*        mobileValue={( mobileTextAlignment ? mobileTextAlignment : '' )}*/}
                        {/*        tabletValue={( tabletTextAlignment ? tabletTextAlignment : '' )}*/}
                        {/*        onChange={( nextAlign ) => setAttributes( { textAlignment: nextAlign } )}*/}
                        {/*        onChangeTablet={( nextAlign ) => setAttributes( { tabletTextAlignment: nextAlign } )}*/}
                        {/*        onChangeMobile={( nextAlign ) => setAttributes( { mobileTextAlignment: nextAlign } )}*/}
                        {/*    />*/}
                        {/*</KadencePanelBody>*/}

                        <KadencePanelBody
                            title={__( 'Icon', 'kadence-blocks' ) + ' ' + ' ' + __( 'Settings', 'kadence-blocks' )}
                            initialOpen={ true }
                            panelName={'kb-icon-settings'}
                        >

                            <KadenceIconPicker
                                value={icon}
                                onChange={value => {
                                    setAttributes( { icon: value } );
                                }}
                            />

                            <ResponsiveRangeControls
                                label={__( 'Icon Size', 'kadence-blocks' )}
                                value={size ? size : ''}
                                onChange={value => {
                                    setAttributes( { size: value } );
                                }}
                                tabletValue={ ( undefined !== tabletSize ? tabletSize : '' ) }
                                onChangeTablet={( value ) => {
                                    setAttributes( { tabletSize: value } );
                                }}
                                mobileValue={( undefined !== mobileSize ? mobileSize : '' )}
                                onChangeMobile={( value ) => {
                                    setAttributes( { mobileSize: value } );
                                }}
                                min={ 0 }
                                max={ 300 }
                                step={1}
                                unit={'px'}
                                showUnit={true}
                            />
                            { icon && 'fe' === icon.substring( 0, 2 ) && (
                                <RangeControl
                                    label={__( 'Line Width' )}
                                    value={width}
                                    onChange={value => {
                                        setAttributes( { width: value } );
                                    }}
                                    step={0.5}
                                    min={0.5}
                                    max={4}
                                />
                            ) }

                            <KadenceRadioButtons
                                label={__( 'Icon Style', 'kadence-blocks' )}
                                value={style}
                                options={[
                                    { value: 'default', label: __( 'Default', 'kadence-blocks' ) },
                                    { value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
                                ]}
                                onChange={value => setAttributes( { style: value } )}
                            />
                            <PopColorControl
                                label={ __( 'Icon Color', 'kadence-blocks' ) }
                                value={ ( color ? color : '' ) }
                                default={''}
                                onChange={ value => {
                                    setAttributes( { color: value } );
                                } }
                                swatchLabel2={ __( 'Hover Color', 'kadence-blocks' ) }
                                value2={( hColor ? hColor : '' )}
                                default2={''}
                                onChange2={value => {
                                    setAttributes( { hColor: value } );
                                }}
                            />
                            {style !== 'default' && (
                                <>
                                    <PopColorControl
                                        label={ __( 'Background Color', 'kadence-blocks' ) }
                                        value={ ( background ? background : '' ) }
                                        default={''}
                                        onChange={ value => {
                                            setAttributes( { background: value } );
                                        } }
                                        swatchLabel2={ __( 'Hover Background', 'kadence-blocks' ) }
                                        value2={( hBackground ? hBackground : '' )}
                                        default2={''}
                                        onChange2={value => {
                                            setAttributes( { hBackground: value } );
                                        }}
                                    />
                                    <PopColorControl
                                        label={ __( 'Border Color', 'kadence-blocks' ) }
                                        value={ ( border ? border : '' ) }
                                        default={''}
                                        onChange={ value => {
                                            setAttributes( { border: value } );
                                        } }
                                        swatchLabel2={ __( 'Hover Border', 'kadence-blocks' ) }
                                        value2={( hBorder ? hBorder : '' )}
                                        default2={''}
                                        onChange2={value => {
                                            setAttributes( { hBorder: value } );
                                        }}
                                    />
                                    <RangeControl
                                        label={__( 'Border Size (px)', 'kadence-blocks' )}
                                        value={borderWidth}
                                        onChange={value => {
                                            setAttributes( { borderWidth: value } );
                                        }}
                                        min={0}
                                        max={20}
                                    />
                                    <RangeControl
                                        label={__( 'Border Radius (%)', 'kadence-blocks' )}
                                        value={borderRadius}
                                        onChange={value => {
                                            setAttributes( { borderRadius: value } );
                                        }}
                                        min={0}
                                        max={50}
                                    />
                                </>
                            ) }
                            <URLInputControl
                                label={__( 'Link', 'kadence-blocks' )}
                                url={link}
                                onChangeUrl={value => {
                                    setAttributes( { link: value } );
                                }}
                                additionalControls={true}
                                opensInNewTab={( target && '_blank' == target ? true : false )}
                                onChangeTarget={value => {
                                    if ( value ) {
                                        setAttributes( { target: '_blank' } );
                                    } else {
                                        setAttributes( { target: '_self' } );
                                    }
                                }}
                                dynamicAttribute={'icons:' + index + ':link'}
                                linkTitle={linkTitle}
                                onChangeTitle={value => {
                                    setAttributes( { linkTitle: value } );
                                }}
                                {...attributes}
                            />
                            <TextControl
                                label={__( 'Title for Accessibility', 'kadence-blocks' )}
                                value={title}
                                onChange={value => {
                                    setAttributes( { title: value } );
                                }}
                            />
                        </KadencePanelBody>

                    </>
                }
                { ( activeTab === 'advanced' ) &&
                    <>
                        <AdvancedSettings attributes={ attributes } setAttributes={ setAttributes } />

                        <KadenceBlockDefaults attributes={ attributes } defaultAttributes={ metadata['attributes'] } blockSlug={ 'kadence/icon' } />
                    </>
                }
            </KadenceInspectorControls>

            <PreviewIcon attributes={ attributes } previewDevice={ previewDevice } />
        </div>
    );
}

export default ( KadenceSingleIcon );
