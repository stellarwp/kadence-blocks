import {
    TypographyControls,
    MeasurementControls,
    PopColorControl,
    ResponsiveRangeControls,
    KadenceRadioButtons,
    URLInputControl,
    ResponsiveMeasurementControls,
    IconControl
} from '@kadence/components';
/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';
import {
    Component,
    Fragment,
    useEffect,
    useState
} from '@wordpress/element';
import {
    Button,
    TabPanel,
    PanelBody,
    RangeControl,
    TextControl,
    ToggleControl,
    SelectControl,
    Modal
} from '@wordpress/components';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';

import { iconIcon } from '@kadence/icons';
import {get, has, isObject} from 'lodash';

function KadenceIcon(props) {

    const blockSlug = 'kadence/icon';
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const {createErrorNotice} = useDispatch(noticesStore);

    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const [pendingConfig, setPendingConfig] = useState({});
    const tmpConfig = {...get(configuration, [blockSlug], {}), ...pendingConfig};

    const iconDefault = [
        {
            "icon": "fe_aperture",
            "link": "",
            "target": "_self",
            "size": 50,
            "width": 2,
            "title": "",
            "color": "palette4",
            "background": "transparent",
            "border": "palette4",
            "borderRadius": 0,
            "borderWidth": 2,
            "padding": [ 20, 20, 20, 20 ],
            "paddingUnit" : "px",
            "style": "default",
            "margin": [ "", "", "", "" ],
            "marginUnit" : "px",
            "hColor": "",
            "hBackground": "",
            "hBorder": "",
            "linkTitle": "",
            "tabletSize": "",
            "mobileSize": "",
            "tabletMargin": [ "", "", "", "" ],
            "mobileMargin": [ "", "", "", "" ],
            "tabletPadding": [ "", "", "", "" ],
            "mobilePadding": [ "", "", "", "" ]
        }
    ];

    const saveConfig = () => {
        setIsSaving(true);
        const config = configuration;

        if (!config[blockSlug]) {
            config[blockSlug] = {};
        }

        config[blockSlug] = tmpConfig;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});

        settingModel.save().then(response => {
            createErrorNotice(__('Icon block defaults saved!', 'kadence-blocks'), {
                type: 'snackbar',
            })

            setIsSaving(false);
            setConfiguration({ ...config });
            setIsOpen(false);

            kadence_blocks_params.configuration = JSON.stringify(config);
        });
    }

    const saveConfigState = (key, value) => {
        const config = configuration;
        if (config[blockSlug] === undefined || config[blockSlug].length == 0) {
            config[blockSlug] = {};
        }
        config[blockSlug][key] = value;
        setConfiguration({...config});
    }

    const clearAllDefaults = () => {
        const config = configuration;
        config[blockSlug] = {};
        setConfiguration({...config});
    }

    const setAttributes = ( valueObj ) => {
        Object.keys( valueObj ).forEach( ( key ) => {
            saveConfigState( key, valueObj[ key ] );
        });
    }

    const saveArrayUpdate = ( value, index ) => {
        const config = configuration;

        if (!has(config, [blockSlug])) {
            config[blockSlug] = {};
        }

        if (!has(config, [blockSlug, 'icons', 0])) {
            config[blockSlug].icons = iconDefault;
        }

        config[blockSlug].icons[0] = {...config[blockSlug].icons[0], ...value};

        saveConfigState('icons', config[blockSlug].icons);
    };

    const icons = get(configuration, [blockSlug, 'icons'], iconDefault);
    const iconCount = get(configuration, [blockSlug, 'iconCount'], 1);
    const blockAlignment = get(configuration, [blockSlug, 'blockAlignment'], '');
    const textAlignment = get(configuration, [blockSlug, 'textAlignment'], 'center');
    const tabletTextAlignment = get(configuration, [blockSlug, 'tabletTextAlignment'], '');
    const mobileTextAlignment = get(configuration, [blockSlug, 'mobileTextAlignment'], '');
    const verticalAlignment = get(configuration, [blockSlug, 'verticalAlignment'], '');
    const inQueryBlock = get(configuration, [blockSlug, 'inQueryBlock'], false);

    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen( true)}>
                <span className="kt-block-icon">{iconIcon}</span>
                {__('Icon', 'kadence-blocks')}
            </Button>
            {isOpen ?
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Countdown')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    <PanelBody
                        title={__( 'Icon', 'kadence-blocks' ) + ' ' + __( 'Settings', 'kadence-blocks' )}
                        initialOpen={( 1 === iconCount ? true : false )}
                    >
                        <IconControl
                            value={icons[ 0 ].icon}
                            onChange={ ( value ) => {
                                saveArrayUpdate( { icon: value }, 0 );
                            }}
                        />
                        <ResponsiveRangeControls
                            label={__( 'Icon Size', 'kadence-blocks' )}
                            value={icons[ 0 ].size ? icons[ 0 ].size : ''}
                            onChange={value => {
                                saveArrayUpdate( { size: value }, 0 );
                            }}
                            tabletValue={ ( undefined !== icons[ 0 ].tabletSize ? icons[ 0 ].tabletSize : '' ) }
                            onChangeTablet={( value ) => {
                                saveArrayUpdate( { tabletSize: value }, 0 );
                            }}
                            mobileValue={( undefined !== icons[ 0 ].mobileSize ? icons[ 0 ].mobileSize : '' )}
                            onChangeMobile={( value ) => {
                                saveArrayUpdate( { mobileSize: value }, 0 );
                            }}
                            min={ 0 }
                            max={ 300 }
                            step={1}
                            unit={'px'}
                            showUnit={true}
                        />
                        { icons[ 0 ].icon && 'fe' === icons[ 0 ].icon.substring( 0, 2 ) && (
                            <RangeControl
                                label={__( 'Line Width' )}
                                value={icons[ 0 ].width}
                                onChange={value => {
                                    saveArrayUpdate( { width: value }, 0 );
                                }}
                                step={0.5}
                                min={0.5}
                                max={4}
                            />
                        ) }
                        <KadenceRadioButtons
                            label={__( 'Icon Style', 'kadence-blocks' )}
                            value={icons[ 0 ].style}
                            options={[
                                { value: 'default', label: __( 'Default', 'kadence-blocks' ) },
                                { value: 'stacked', label: __( 'Stacked', 'kadence-blocks' ) },
                            ]}
                            onChange={value => saveArrayUpdate( { style: value }, 0 )}
                        />
                        <PopColorControl
                            label={ __( 'Icon Color', 'kadence-blocks' ) }
                            value={ ( icons[ 0 ].color ? icons[ 0 ].color : '' ) }
                            default={''}
                            onChange={ value => {
                                saveArrayUpdate( { color: value }, 0 );
                            } }
                            swatchLabel2={ __( 'Hover Color', 'kadence-blocks' ) }
                            value2={( icons[ 0 ].hColor ? icons[ 0 ].hColor : '' )}
                            default2={''}
                            onChange2={value => {
                                saveArrayUpdate( { hColor: value }, 0 );
                            }}
                        />
                        {icons[ 0 ].style !== 'default' && (
                            <>
                                <PopColorControl
                                    label={ __( 'Background Color', 'kadence-blocks' ) }
                                    value={ ( icons[ 0 ].background ? icons[ 0 ].background : '' ) }
                                    default={''}
                                    onChange={ value => {
                                        saveArrayUpdate( { background: value }, 0 );
                                    } }
                                    swatchLabel2={ __( 'Hover Background', 'kadence-blocks' ) }
                                    value2={( icons[ 0 ].hBackground ? icons[ 0 ].hBackground : '' )}
                                    default2={''}
                                    onChange2={value => {
                                        saveArrayUpdate( { hBackground: value }, 0 );
                                    }}
                                />
                                <PopColorControl
                                    label={ __( 'Border Color', 'kadence-blocks' ) }
                                    value={ ( icons[ 0 ].border ? icons[ 0 ].border : '' ) }
                                    default={''}
                                    onChange={ value => {
                                        saveArrayUpdate( { border: value }, 0 );
                                    } }
                                    swatchLabel2={ __( 'Hover Border', 'kadence-blocks' ) }
                                    value2={( icons[ 0 ].hBorder ? icons[ 0 ].hBorder : '' )}
                                    default2={''}
                                    onChange2={value => {
                                        saveArrayUpdate( { hBorder: value }, 0 );
                                    }}
                                />
                                <RangeControl
                                    label={__( 'Border Size (px)', 'kadence-blocks' )}
                                    value={icons[ 0 ].borderWidth}
                                    onChange={value => {
                                        saveArrayUpdate( { borderWidth: value }, 0 );
                                    }}
                                    min={0}
                                    max={20}
                                />
                                <RangeControl
                                    label={__( 'Border Radius (%)', 'kadence-blocks' )}
                                    value={icons[ 0 ].borderRadius}
                                    onChange={value => {
                                        saveArrayUpdate( { borderRadius: value }, 0 );
                                    }}
                                    min={0}
                                    max={50}
                                />
                            </>
                        ) }
                        <URLInputControl
                            label={__( 'Link', 'kadence-blocks' )}
                            url={icons[ 0 ].link}
                            onChangeUrl={value => {
                                saveArrayUpdate( { link: value }, 0 );
                            }}
                            additionalControls={true}
                            opensInNewTab={( icons[ 0 ].target && '_blank' == icons[ 0 ].target ? true : false )}
                            onChangeTarget={value => {
                                if ( value ) {
                                    saveArrayUpdate( { target: '_blank' }, 0 );
                                } else {
                                    saveArrayUpdate( { target: '_self' }, 0 );
                                }
                            }}
                            dynamicAttribute={'icons:' + 0 + ':link'}
                            linkTitle={icons[ 0 ].linkTitle}
                            onChangeTitle={value => {
                                saveArrayUpdate( { linkTitle: value }, 0 );
                            }}
                        />
                        <TextControl
                            label={__( 'Title for Accessibility', 'kadence-blocks' )}
                            value={icons[ 0 ].title}
                            onChange={value => {
                                saveArrayUpdate( { title: value }, 0 );
                            }}
                        />
                    </PanelBody>

                    <PanelBody
                        title={ __( 'Icon', 'kadence-blocks' ) + ' ' + ' ' + __( 'Spacing Settings', 'kadence-blocks' )}
                        initialOpen={ ( 1 === iconCount ? true : false ) }
                    >
                        { icons[ 0 ].style !== 'default' && (
                            <ResponsiveMeasurementControls
                                label={__( 'Icon Padding', 'kadence-blocks' )}
                                value={ ( icons[ 0 ].padding ? icons[ 0 ].padding : ['', '', '', ''] ) }
                                onChange={ ( value ) => saveArrayUpdate( { padding: value }, 0 ) }
                                tabletValue={ ( icons[ 0 ].tabletPadding ? icons[ 0 ].tabletPadding : ['', '', '', ''] ) }
                                onChangeTablet={( value ) => saveArrayUpdate( { tabletPadding: value }, 0 ) }
                                mobileValue={ ( icons[ 0 ].mobilePadding ? icons[ 0 ].mobilePadding : ['', '', '', ''] ) }
                                onChangeMobile={( value ) => saveArrayUpdate( { mobilePadding: value }, 0 ) }
                                min={ 0 }
                                max={ ( ( icons[ 0 ].paddingUnit ? icons[ 0 ].paddingUnit : 'px' ) === 'em' || ( icons[ 0 ].paddingUnit ? icons[ 0 ].paddingUnit : 'px' ) === 'rem' ? 12 : 200 ) }
                                step={ ( ( icons[ 0 ].paddingUnit ? icons[ 0 ].paddingUnit : 'px' ) === 'em' || ( icons[ 0 ].paddingUnit ? icons[ 0 ].paddingUnit : 'px' ) === 'rem' ? 0.1 : 1 ) }
                                unit={ ( icons[ 0 ].paddingUnit ? icons[ 0 ].paddingUnit : 'px' ) }
                                units={ [ 'px', 'em', 'rem' ] }
                                onUnit={ ( value ) => saveArrayUpdate( { paddingUnit: value }, 0 ) }
                            />
                        ) }
                        <ResponsiveMeasurementControls
                            label={__( 'Icon Margin', 'kadence-blocks' )}
                            value={ ( icons[ 0 ].margin ? icons[ 0 ].margin : ['', '', '', ''] ) }
                            onChange={ ( value ) => saveArrayUpdate( { margin: value }, 0 ) }
                            tabletValue={ ( icons[ 0 ].tabletMargin ? icons[ 0 ].tabletMargin : ['', '', '', ''] ) }
                            onChangeTablet={( value ) => saveArrayUpdate( { tabletMargin: value }, 0 ) }
                            mobileValue={ ( icons[ 0 ].mobileMargin ? icons[ 0 ].mobileMargin : ['', '', '', ''] ) }
                            onChangeMobile={( value ) => saveArrayUpdate( { mobileMargin: value }, 0 ) }
                            min={ ( ( icons[ 0 ].marginUnit ? icons[ 0 ].marginUnit : 'px' ) === 'em' || ( icons[ 0 ].marginUnit ? icons[ 0 ].marginUnit : 'px' ) === 'rem' ? -2 : -200 ) }
                            max={ ( ( icons[ 0 ].marginUnit ? icons[ 0 ].marginUnit : 'px' ) === 'em' || ( icons[ 0 ].marginUnit ? icons[ 0 ].marginUnit : 'px' ) === 'rem' ? 12 : 200 ) }
                            step={ ( ( icons[ 0 ].marginUnit ? icons[ 0 ].marginUnit : 'px' ) === 'em' || ( icons[ 0 ].marginUnit ? icons[ 0 ].marginUnit : 'px' ) === 'rem' ? 0.1 : 1 ) }
                            unit={ ( icons[ 0 ].marginUnit ? icons[ 0 ].marginUnit : 'px' ) }
                            units={ [ 'px', 'em', 'rem' ] }
                            onUnit={ ( value ) => saveArrayUpdate( { marginUnit: value }, 0 ) }
                        />
                    </PanelBody>

                    <div className="kb-modal-footer">
                        {!resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive
                                    disabled={(JSON.stringify(configuration[blockSlug]) === JSON.stringify({}) ? true : false)}
                                    onClick={() => {
                                        setResetConfirm(true);
                                    }}>
                                {__('Reset', 'kadence-blocks')}
                            </Button>
                        )}
                        {resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive onClick={() => {
                                clearAllDefaults();
                                setResetConfirm(false);
                            }}>
                                {__('Confirm Reset', 'kadence-blocks')}
                            </Button>
                        )}
                        <Button className="kt-defaults-save" isPrimary onClick={() => {
                            saveConfig(configuration);
                        }}>
                            {__('Save/Close', 'kadence-blocks')}
                        </Button>
                    </div>
                </Modal>
                : null}
        </Fragment>
    );
}

export default KadenceIcon;
