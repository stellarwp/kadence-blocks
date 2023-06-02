/**
 * BLOCK: Kadence Icon
 */
/**
 * Import externals
 */
import {
    PopColorControl,
    KadencePanelBody,
    URLInputControl,
    ResponsiveRangeControls,
    InspectorControlTabs,
    RangeControl,
    KadenceRadioButtons,
    KadenceInspectorControls,
    KadenceBlockDefaults,
    KadenceIconPicker,
    CopyPasteAttributes,
} from '@kadence/components';
import {
    KadenceColorOutput,
	setBlockDefaults,
	getUniqueId,
	getInQueryBlock,
	getPostOrFseId
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
    useBlockProps,
    BlockControls,
} from '@wordpress/block-editor';
import {
    useEffect,
    useState
} from '@wordpress/element';
import {
    TextControl,
} from '@wordpress/components';

function KadenceSingleIcon( props ) {

	const { attributes, className, setAttributes, clientId, isSelected, name, context } = props;
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

    const nonTransAttrs = ['icon', 'link', 'target' ];

    const [ activeTab, setActiveTab ] = useState( 'general' );

    const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
    const { isUniqueID, isUniqueBlock, previewDevice, parentData } = useSelect(
        ( select ) => {
            return {
                isUniqueID: ( value ) => select( 'kadenceblocks/data' ).isUniqueID( value ),
                isUniqueBlock: ( value, clientId ) => select( 'kadenceblocks/data' ).isUniqueBlock( value, clientId ),
                previewDevice: select( 'kadenceblocks/data' ).getPreviewDeviceType(),
				parentData: {
					rootBlock: select( 'core/block-editor' ).getBlock( select( 'core/block-editor' ).getBlockHierarchyRootClientId( clientId ) ),
					postId: select( 'core/editor' ).getCurrentPostId(),
					reusableParent: select('core/block-editor').getBlockAttributes( select('core/block-editor').getBlockParentsByBlockName( clientId, 'core/block' ).slice(-1)[0] ),
					editedPostId: select( 'core/edit-site' ) ? select( 'core/edit-site' ).getEditedPostId() : false
				}
            };
        },
        [ clientId ]
    );

    useEffect( () => {
		setBlockDefaults( 'kadence/single-icon', attributes );

		const postOrFseId = getPostOrFseId( props, parentData );
		let uniqueId = getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock, postOrFseId );
		if ( uniqueId !== uniqueID ) {
			attributes.uniqueID = uniqueId;
			setAttributes( { uniqueID: uniqueId } );
			addUniqueID( uniqueId, clientId );
		} else {
			addUniqueID( uniqueID, clientId );
		}

		setAttributes( { inQueryBlock: getInQueryBlock( context, inQueryBlock ) } );
    }, [] );

    const blockProps = useBlockProps( {
        className: className,
    } );

    const renderCSS = (
        <style>
            {`.wp-block-kadence-single-icon .kt-svg-item-${uniqueID}:hover .kt-svg-icon {
					${( undefined !== hColor && hColor ? 'color:' + KadenceColorOutput( hColor ) + '!important;' : '' )}
            }
            .wp-block-kadence-single-icon .kt-svg-style-stacked.kt-svg-item-${uniqueID}:hover .kt-svg-icon {
					${( undefined !== hBackground && hBackground ? 'background:' + KadenceColorOutput( hBackground ) + '!important;' : '' )}
					${( undefined !== hBorder && hBorder ? 'border-color:' + KadenceColorOutput( hBorder ) + '!important;' : '' )}
            }`}
        </style>
    );

    return (
        <div {...blockProps}>
            {renderCSS}
            <BlockControls>
                <CopyPasteAttributes
                    attributes={ attributes }
                    excludedAttrs={ nonTransAttrs }
                    defaultAttributes={ metadata['attributes'] }
                    blockSlug={ metadata['name'] }
                    onPaste={ attributesToPaste => setAttributes( attributesToPaste ) }
                />
            </BlockControls>
            <KadenceInspectorControls blockSlug={ 'kadence/icon' }>

                <InspectorControlTabs
                    panelName={ 'single-icon' }
                    allowedTabs={ [ 'general', 'advanced' ] }
                    setActiveTab={ ( value ) => setActiveTab( value ) }
                    activeTab={ activeTab }
                />

                {( activeTab === 'general' ) &&
                    <>
                        <KadencePanelBody
                            title={__( 'Icon Settings', 'kadence-blocks' )}
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
                                linkTitle={linkTitle}
                                onChangeTitle={value => {
                                    setAttributes( { linkTitle: value } );
                                }}
                                dynamicAttribute={'link'}
                                allowClear={true}
                                isSelected={ isSelected }
                                attributes={ attributes }
                                setAttributes={ setAttributes }
                                name={ name }
                                clientId={ clientId }
                                context={ context }
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

                        <KadenceBlockDefaults attributes={ attributes } defaultAttributes={ metadata['attributes'] } blockSlug={ metadata['name'] } excludedAttrs={ nonTransAttrs } />
                    </>
                }
            </KadenceInspectorControls>

            <PreviewIcon attributes={ attributes } previewDevice={ previewDevice } />
        </div>
    );
}

export default ( KadenceSingleIcon );
