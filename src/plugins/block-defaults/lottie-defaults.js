import {
    TypographyControls,
    MeasurementControls,
    PopColorControl,
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
import {
    bottomLeftIcon,
    bottomRightIcon,
    topLeftIcon,
    topRightIcon,
} from '@kadence/icons';

import {get, has, isObject} from 'lodash';
import {lottieIcon} from '@kadence/icons';

function KadenceLottie(props) {

    const blockSlug = 'kadence/lottie';
    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const {createErrorNotice} = useDispatch(noticesStore);

    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const [pendingConfig, setPendingConfig] = useState({});
    const tmpConfig = {...get(configuration, [blockSlug], {}), ...pendingConfig};

    const saveConfig = () => {
        setIsSaving(true);
        const config = configuration;

        if (!config[blockSlug]) {
            config[blockSlug] = {};
        }

        config[blockSlug] = tmpConfig;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});

        settingModel.save().then(response => {
            createErrorNotice(__('Lottie block defaults saved!', 'kadence-blocks'), {
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
            <Button className="kt-block-defaults" onClick={() => setIsOpen( true)}>
                <span className="kt-block-icon">{lottieIcon}</span>
                {__('Lottie', 'kadence-blocks')}
            </Button>
            {isOpen ?
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Lottie Defaults', 'kadence-blocks')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    <PanelBody
                        title={ __( 'Playback Settings', 'kadence-blocks' ) }
                        initialOpen={ true }
                        panelName={ 'playbackSettings' }
                        blockSlug={ 'kadence/lottie' }
                    >
                        <ToggleControl
                            label={ __( 'Show Controls', 'kadence-blocks' ) }
                            checked={ get(configuration, [blockSlug, 'showControls'], false) }
                            onChange={ ( value ) => {
                                saveConfigState('showControls', value)
                            }}
                        />
                        <ToggleControl
                            label={ __( 'Autoplay', 'kadence-blocks' ) }
                            checked={ get(configuration, [blockSlug, 'autoplay'], true ) }
                            onChange={ ( value ) => {
                                saveConfigState('autoplay', value)
                                saveConfigState('waitUntilInView', ( value ? get(configuration, [blockSlug, 'waitUntilInView'], false) : false ))
                                saveConfigState('onlyPlayOnHover', (value ? false : get(configuration, [blockSlug, 'onlyPlayOnHover'], false )))
                                saveConfigState('onlyPlayOnScroll', (value ? false : get(configuration, [blockSlug, 'onlyPlayOnScroll'], false )))
                            }}
                        />
                        <ToggleControl
                            label={ __( 'Only play on hover', 'kadence-blocks' ) }
                            checked={ get(configuration, [blockSlug, 'onlyPlayOnHover'], false) }
                            onChange={ ( value ) => {
                                saveConfigState('onlyPlayOnHover', value);
                                saveConfigState('autoplay', (value ? false : get(configuration, [blockSlug, 'autoplay'], true )));
                                saveConfigState('onlyPlayOnScroll', (value ? false : get(configuration, [blockSlug, 'onlyPlayOnScroll'], false )));
                            } }
                        />
                        <ToggleControl
                            label={ __( 'Only play on page scroll', 'kadence-blocks' ) }
                            help={ __( 'This will override most settings such as autoplay, playback speed, bounce, loop, and play on hover. This will not work when previewing in the block editor', 'kadence-blocks' ) }
                            checked={ get(configuration, [blockSlug, 'onlyPlayOnScroll'], false) }
                            onChange={ ( value ) => {
                                saveConfigState('onlyPlayOnScroll', value);
                                saveConfigState('onlyPlayOnHover', (value ? false : get(configuration, [blockSlug, 'onlyPlayOnHover'], false )));
                                saveConfigState('autoplay', (value ? false : get(configuration, [blockSlug, 'autoplay'], true )));
                                saveConfigState('loop', (value ? false : get(configuration, [blockSlug, 'loop'], true )));
                                saveConfigState('bouncePlayback', (value ? false : get(configuration, [blockSlug, 'bouncePlayback'], false )));
                            } }
                        />

                        { get(configuration, [blockSlug, 'onlyPlayOnScroll'], false) ?
                            <>
                                <div style={ { marginBottom: '15px'} }>
                                    <NumberControl
                                        label={ __( 'Starting Frame' ) }
                                        value={ get(configuration, [blockSlug, 'startFrame'], '0') }
                                        onChange={ (value) => saveConfigState('startFrame', parseInt(value)) }
                                        min={ 0 }
                                        isShiftStepEnabled={ true }
                                        shiftStep={ 10 }
                                        help={ __( 'Does not show in preview', 'kadence-blocks' ) }
                                    />
                                </div>

                                <div style={ { marginBottom: '15px'} }>
                                    <NumberControl
                                        label={ __( 'Ending Frame' ) }
                                        value={ get(configuration, [blockSlug, 'endFrame'], '100') }
                                        onChange={ (value) => saveConfigState('endFrame', parseInt(value)) }
                                        min={ 0 }
                                        isShiftStepEnabled={ true }
                                        shiftStep={ 10 }
                                        help={ __( 'Does not show in preview', 'kadence-blocks' ) }
                                    />
                                </div>
                            </>
                            :
                            <div style={ { marginBottom: '15px'} }>
                                <ToggleControl
                                    label={ __( 'Don\'t play until in view', 'kadence-blocks' ) }
                                    help={ __('Prevent playback from starting until animation is in view', 'kadence-blocks') }
                                    checked={ get(configuration, [blockSlug, 'waitUntilInView'], false) }
                                    onChange={ (value) => {
                                        saveConfigState('waitUntilInView', value)
                                        saveConfigState('autoplay', ( value ? true : get(configuration, [blockSlug, 'autoplay'], true ) ))
                                    } }
                                />
                            </div>
                        }

                        <RangeControl
                            label={ __( 'Playback Speed', 'kadence-blocks' ) }
                            value={ get(configuration, [blockSlug, 'playbackSpeed'], 1) }
                            onChange={ ( value ) => { saveConfigState('playbackSpeed', value) } }
                            step={ 0.1 }
                            min={ 0 }
                            max={ 10 }
                        />

                        <h3>{ __( 'Loop Settings', 'kadence-blocks' ) }</h3>
                        <ToggleControl
                            label={ __( 'Loop playback', 'kadence-blocks' ) }
                            checked={ get(configuration, [blockSlug, 'loop'], true) }
                            onChange={ ( value ) => {
                                saveConfigState('loop', value)
                                saveConfigState('onlyPlayOnScroll', (value ? false : get(configuration, [blockSlug, 'onlyPlayOnScroll'], false)))
                            } }
                        />
                        <ToggleControl
                            label={ __( 'Bounce playback', 'kadence-blocks' ) }
                            checked={ get(configuration, [blockSlug, 'bouncePlayback'], false) }
                            onChange={ ( value ) => {
                                saveConfigState('bouncePlayback', value)
                                saveConfigState('loop', (value ? true : get(configuration, [blockSlug, 'loop'], true)))
                                saveConfigState('onlyPlayOnScroll', (value ? false : get(configuration, [blockSlug, 'onlyPlayOnScroll'], false)))
                            } }
                            help={ __( 'Does not show in preview', 'kadence-blocks' ) }
                        />
                        <RangeControl
                            label={ __( 'Delay between loops (seconds)', 'kadence-blocks' ) }
                            value={ get(configuration, [blockSlug, 'delay'], 0) }
                            onChange={ ( value ) => {
                                saveConfigState('delay', value)
                            } }
                            step={ 0.1 }
                            min={ 0 }
                            max={ 60 }
                            help={ __( 'Does not show in preview', 'kadence-blocks' ) }
                        />
                        <RangeControl
                            label={ __( 'Limit Loops', 'kadence-blocks' ) }
                            value={ get(configuration, [blockSlug, 'loopLimit'], 0 ) }
                            onChange={ ( value ) => {
                                saveConfigState('loopLimit', value)
                            } }
                            step={ 1 }
                            min={ 0 }
                            max={ 100 }
                            help={ __( 'Does not show in preview', 'kadence-blocks' ) }
                        />
                    </PanelBody>
                    
                    <PanelBody
                        title={ __( 'Size Controls', 'kadence-blocks' ) }
                    >
                        <ResponsiveMeasurementControls
                            label={ __( 'Padding', 'kadence-blocks' ) }
                            value={ get(configuration, [blockSlug, 'paddingDesktop'], ['', '', '', '']) }
                            tabletValue={ get(configuration, [blockSlug, 'paddingTablet'], ['', '', '', '']) }
                            mobileValue={ get(configuration, [blockSlug, 'paddingMobile'], ['', '', '', '']) }
                            onChange={ ( value ) => saveConfigState('paddingDesktop', value) }
                            onChangeTablet={ ( value ) => saveConfigState('paddingTablet', value) }
                            onChangeMobile={ ( value ) => saveConfigState('paddingMobile', value) }
                            min={ 0 }
                            max={ ( get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'rem' ? 24 : 200 ) }
                            step={ ( get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'rem' ? 0.1 : 1 ) }
                            unit={ get(configuration, [blockSlug, 'paddingUnit'], 'px') }
                            units={ [ 'px', 'em', 'rem', '%' ] }
                            onUnit={ ( value ) => saveConfigState('paddingUnit', value) }
                        />
                        <ResponsiveMeasurementControls
                            label={ __( 'Margin', 'kadence-blocks' ) }
                            value={ get(configuration, [blockSlug, 'marginDesktop'], ['', '', '', '']) }
                            tabletValue={ get(configuration, [blockSlug, 'marginTablet'], ['', '', '', '']) }
                            mobileValue={ get(configuration, [blockSlug, 'marginMobile'], ['', '', '', '']) }
                            onChange={ ( value ) => {
                                saveConfigState('marginDesktop', value)
                            } }
                            onChangeTablet={ ( value ) => saveConfigState('marginTablet', value) }
                            onChangeMobile={ ( value ) => saveConfigState('marginMobile', value) }
                            min={ ( get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? -12 : -200 ) }
                            max={ ( get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? 24 : 200 ) }
                            step={ ( get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? 0.1 : 1 ) }
                            unit={ get(configuration, [blockSlug, 'marginUnit'], 'px') }
                            units={ [ 'px', 'em', 'rem', '%', 'vh' ] }
                            onUnit={ ( value ) => saveConfigState('marginUnit', value) }
                        />

                        <RangeControl
                            label={ __( 'Max Width', 'kadence-blocks' ) }
                            value={ get(configuration, [blockSlug, 'width'], '0') }
                            onChange={ ( value ) => saveConfigState('width', value) }
                            allowReset={ true }
                            step={ 1 }
                            min={ 25 }
                            max={ 1000 }
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

export default KadenceLottie;
