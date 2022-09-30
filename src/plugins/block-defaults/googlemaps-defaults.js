import {
    TypographyControls,
    MeasurementControls,
    PopColorControl,
    ResponsiveRangeControls,
    ResponsiveMeasurementControls
} from '@kadence/components';
import {IconControl} from '@wordpress/components';
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
    Modal,
} from '@wordpress/components';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';
import {get} from 'lodash';

import {googleMapsIcon} from '@kadence/icons';

function KadenceGooglemaps(props) {

    const blockSlug = 'kadence/googlemaps';
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const {createErrorNotice} = useDispatch(noticesStore);

    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const [pendingConfig, setPendingConfig] = useState({});
    const tmpConfig = {...get(configuration, [blockSlug], {}), ...pendingConfig};

    const getSaneDefaultForFilter = (filter) => {
        switch (filter) {
            case "standard":
                return 0;
            case "grayscale":
                return 100;
            case "invert":
                return 100;
            case "saturate":
                return 150;
            case "sepia":
                return 30;
            default:
                return 50;
        }
    }

    const saveConfig = () => {
        setIsSaving(true);
        const config = configuration;

        if (!config[blockSlug]) {
            config[blockSlug] = {};
        }

        config[blockSlug] = tmpConfig;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});

        settingModel.save().then(response => {
            createErrorNotice(__('Google Maps block defaults saved!', 'kadence-blocks'), {
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

    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true)}>
                <span className="kt-block-icon">{googleMapsIcon}</span>
                {__('Google Maps', 'kadence-blocks')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Google Maps')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    <PanelBody
                        title={__('Map Location', 'kadence-blocks')}
                        initialOpen={true}
                    >
                        <TextControl
                            label={__('Location', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'location'], '')}
                            onChange={(value) => {
                                saveConfigState('location', value)
                            }}
                        />

                        {get(configuration, [blockSlug, 'apiType'], 'embed') === 'javascript' ?
                            <>
                                <ToggleControl
                                    label={__('Show Marker', 'kadence-blocks')}
                                    checked={get(configuration, [blockSlug, 'showMarker'], true)}
                                    onChange={(value) => {
                                        saveConfigState('showMarker', value)
                                    }}
                                />
                            </>
                            : null}

                        <RangeControl
                            label={__('Zoom', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'zoom'], 11)}
                            onChange={(value) => saveConfigState('zoom', value)}
                            min={1}
                            max={20}
                        />

                        <SelectControl
                            label={__('Map Type', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'mapType'], 'roadmap')}
                            onChange={(value) => saveConfigState('mapType', value)}
                            options={[
                                {
                                    label: __('Road Map', 'kadence-blocks'),
                                    value: 'roadmap'
                                },
                                {
                                    label: __('Satellite', 'kadence-blocks'),
                                    value: 'satellite'
                                }
                            ]}/>

                        <SelectControl
                            label={__('Map Filter', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'mapFilter'], 'standard')}
                            onChange={(value) => {
                                saveConfigState('mapFilter', value);
                                saveConfigState('mapFilterAmount', getSaneDefaultForFilter(value))
                            }
                            }
                            options={[
                                {
                                    label: __('None', 'kadence-blocks'),
                                    value: 'standard'
                                },
                                {
                                    label: __('Grayscale', 'kadence-blocks'),
                                    value: 'grayscale'
                                },
                                {
                                    label: __('Invert', 'kadence-blocks'),
                                    value: 'invert'
                                },
                                {
                                    label: __('Saturate', 'kadence-blocks'),
                                    value: 'saturate'
                                },
                                {
                                    label: __('Sepia', 'kadence-blocks'),
                                    value: 'sepia'
                                }
                            ]}/>

                        {get(configuration, [blockSlug, 'mapFilter'], 'standard') !== 'standard' ?
                            <RangeControl
                                label={__('Map Filter Strength ', 'kadence-blocks')}
                                value={get(configuration, [blockSlug, 'mapFilterAmount'], '50')}
                                onChange={(value) => saveConfigState('mapFilterAmount', value)}
                                min={0}
                                max={(get(configuration, [blockSlug, 'mapFilter'], 'standard') === 'saturate') ? 250 : 100}
                            /> : null}

                        {get(configuration, [blockSlug, 'apiType'], 'embed') === 'javascript' && get(configuration, [blockSlug, 'mapType'], 'roadmap') === 'roadmap' ?
                            <>
                                <SelectControl
                                    label={__('Map Style', 'kadence-blocks')}
                                    value={get(configuration, [blockSlug, 'mapStyle'], 'standard')}
                                    onChange={(value) => saveConfigState('mapStyle', value)}
                                    options={[
                                        {
                                            label: __('None', 'kadence-blocks'),
                                            value: 'standard'
                                        },
                                        {
                                            label: __('Apple Maps Esque', 'kadence-blocks'),
                                            value: 'apple_maps_esque'
                                        },
                                        {
                                            label: __('Avocado', 'kadence-blocks'),
                                            value: 'avocado'
                                        },
                                        {
                                            label: __('Clean Interface', 'kadence-blocks'),
                                            value: 'clean_interface'
                                        },
                                        {
                                            label: __('Cobalt', 'kadence-blocks'),
                                            value: 'cobalt'
                                        },
                                        {
                                            label: __('Midnight Commander', 'kadence-blocks'),
                                            value: 'midnight_commander'
                                        },
                                        {
                                            label: __('Night Mode', 'kadence-blocks'),
                                            value: 'night_mode'
                                        },
                                        {
                                            label: __('No labels, Bright Colors', 'kadence-blocks'),
                                            value: 'no_label_bright_colors'
                                        },
                                        {
                                            label: __('Shades of Grey', 'kadence-blocks'),
                                            value: 'shades_of_grey'
                                        },
                                        {
                                            label: __('Custom Snazzy Map', 'kadence-blocks'),
                                            value: 'custom'
                                        }
                                    ]}/>
                            </> : null}

                        {get(configuration, [blockSlug, 'apiType'], 'embed') === 'javascript' && get(configuration, [blockSlug, 'mapType'], 'roadmap') === 'roadmap' && mapStyle === 'custom' ?
                            <>
                                <TextareaControl
                                    label={__('Custom Map Style', 'kadence-blocks')}
                                    help={__('Copy the "Javascript Style Array" from a Snazzy Maps style', 'kadence-blocks')}
                                    value={get(configuration, [blockSlug, 'customSnazzy'], '')}
                                    onChange={(value) => saveConfigState('customSnazzy', value)}
                                />

                                <a href={'https://snazzymaps.com'}
                                   target={'_blank'}> {__('Visit Snazzy Maps', 'kadence-blocks')} </a>
                            </>
                            : null}

                    </PanelBody>

                    <PanelBody
                        title={__('Container Size', 'kadence-blocks')}
                        initialOpen={true}
                    >
                        <ResponsiveRangeControls
                            label={__('Height', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'heightDesktop'], 450)}
                            onChange={value => saveConfigState('heightDesktop', value)}
                            tabletValue={get(configuration, [blockSlug, 'heightTablet'], '')}
                            onChangeTablet={(value) => saveConfigState('heightTablet', value)}
                            mobileValue={get(configuration, [blockSlug, 'heightMobile'], '')}
                            onChangeMobile={(value) => saveConfigState('heightMobile', value)}
                            min={100}
                            max={1250}
                            step={1}
                            unit={'px'}
                            units={['px']}
                            showUnit={true}
                        />

                        <ResponsiveRangeControls
                            label={__('Max Width', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'widthDesktop'], '')}
                            onChange={value => saveConfigState('widthDesktop', value)}
                            tabletValue={get(configuration, [blockSlug, 'widthTablet'], '')}
                            onChangeTablet={(value) => saveConfigState('widthTablet', value)}
                            mobileValue={get(configuration, [blockSlug, 'widthMobile'], '')}
                            onChangeMobile={(value) => saveConfigState('widthMobile', value)}
                            min={100}
                            max={1250}
                            step={1}
                            unit={'px'}
                            units={['px']}
                            showUnit={true}
                            reset={() => {
                                saveConfigState('widthDesktop', '');
                                saveConfigState('widthTablet', '');
                                saveConfigState('widthMobile', '');
                            }}
                        />
                        {(get(configuration, [blockSlug, 'widthDesktop'], '') || get(configuration, [blockSlug, 'widthTablet'], '') || get(configuration, [blockSlug, 'widthMobile'], '')) && (
                            <ResponsiveAlignControls
                                label={__('Alignment', 'kadence-blocks')}
                                value={get(configuration, [blockSlug, 'textAlign', 0], '')}
                                mobileValue={get(configuration, [blockSlug, 'textAlign', 1], '')}
                                tabletValue={get(configuration, [blockSlug, 'textAlign', 2], '')}
                                onChange={(nextAlign) => saveConfigState('textAlign', [nextAlign, (textAlign && textAlign[1] ? textAlign[1] : ''), (textAlign && textAlign[2] ? textAlign[2] : '')])}
                                onChangeTablet={(nextAlign) => saveConfigState('textAlign', [(textAlign && textAlign[0] ? textAlign[0] : ''), nextAlign, (textAlign && textAlign[2] ? textAlign[2] : '')])}
                                onChangeMobile={(nextAlign) => saveConfigState('textAlign', [(textAlign && textAlign[0] ? textAlign[0] : ''), (textAlign && textAlign[1] ? textAlign[1] : ''), nextAlign])}
                            />
                        )}

                        <ResponsiveMeasurementControls
                            label={__('Padding', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'paddingDesktop'], ['', '', '', ''])}
                            tabletValue={get(configuration, [blockSlug, 'paddingTablet'], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'paddingMobile'], ['', '', '', ''])}
                            onChange={(value) => saveConfigState('paddingDesktop', value)}
                            onChangeTablet={(value) => saveConfigState('paddingTablet', value)}
                            onChangeMobile={(value) => saveConfigState('paddingMobile', value)}
                            onChangeControl={(value) => setPaddingControl(value)}
                            min={0}
                            max={(get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'rem' ? 24 : 200)}
                            step={(get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'rem' ? 0.1 : 1)}
                            unit={get(configuration, [blockSlug, 'paddingUnit'], 'px')}
                            units={['px', 'em', 'rem', '%']}
                            onUnit={(value) => saveConfigState('paddingUnit', value)}
                        />
                        <ResponsiveMeasurementControls
                            label={__('Margin', 'kadence-blocks')}
                            value={get(configuration, [blockSlug, 'marginDesktop'], ['', '', '', ''])}
                            tabletValue={get(configuration, [blockSlug, 'marginTablet'], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'marginMobile'], ['', '', '', ''])}
                            onChange={(value) => saveConfigState('marginDesktop', value)}
                            onChangeTablet={(value) => saveConfigState('marginTablet', value)}
                            onChangeMobile={(value) => saveConfigState('marginMobile', value)}
                            onChangeControl={(value) => setMarginControl(value)}
                            min={(get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? -12 : -200)}
                            max={(get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? 24 : 200)}
                            step={(get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? 0.1 : 1)}
                            unit={get(configuration, [blockSlug, 'marginUnit'], 'px')}
                            units={['px', 'em', 'rem', '%', 'vh']}
                            onUnit={(value) => saveConfigState('marginUnit', value)}
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
            )}
        </Fragment>
    );
}

export default KadenceGooglemaps;
