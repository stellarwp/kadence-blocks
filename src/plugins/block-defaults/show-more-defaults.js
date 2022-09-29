import {
    TypographyControls,
    MeasurementControls,
    PopColorControl,
    ResponsiveMeasurementControls,
    ResponsiveRangeControls
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
import {showMoreIcon} from '@kadence/icons';

function KadenceShowMore(props) {

    const blockSlug = 'kadence/show-more';
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
            createErrorNotice(__('Show More block defaults saved!', 'kadence-blocks'), {
                type: 'snackbar',
            })

            setIsSaving(false);
            setConfiguration(config);
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
                <span className="kt-block-icon">{showMoreIcon}</span>
                {__('Show More', 'kadence-blocks')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Show More', 'kadence-blocks')}
                    onRequestClose={() => {
                        saveConfig(configuration);
                    }}>

                    <PanelBody
                        title={__( 'Show More Settings', 'kadence-blocks' )}
                        initialOpen={true}
                        panelName={ 'showMoreSettings'}
                        blockSlug={ 'kadence/show-more' }
                    >
                        <ToggleControl
                            label={__( 'Display "hide" button once expanded', 'kadence-blocks' )}
                            checked={ get(configuration, [blockSlug, 'showHideMore'], true ) }
                            onChange={( value ) => saveConfigState('showHideMore', value)}
                        />

                        <ResponsiveRangeControls
                            label={__( 'Maximum Preview Height', 'kadence-blocks' )}
                            value={get(configuration, [blockSlug, 'heightDesktop'], 250) }
                            onChange={value => {
                                saveConfigState('heightDesktop', value)
                            }}
                            tabletValue={ get(configuration, [blockSlug, 'heightTablet'], '') }
                            onChangeTablet={( value ) => {
                                saveConfigState('heightTablet', value)
                            }}
                            mobileValue={ get(configuration, [blockSlug, 'heightMobile'], '') }
                            onChangeMobile={( value ) => {
                                saveConfigState('heightMobile', value)
                            }}
                            min={0}
                            max={( get(configuration, [blockSlug, 'heightType'], 'px') !== 'px' ? 10 : 2000 )}
                            step={( get(configuration, [blockSlug, 'heightType'], 'px') !== 'px' ? 0.1 : 1 )}
                            unit={ get(configuration, [blockSlug, 'heightType'], 'px')  }
                            onUnit={( value ) => {
                                saveConfigState('heightType', value)
                            }}
                            units={[ 'px', 'em', 'rem' ]}
                        />

                        <ToggleControl label={__( 'Fade out preview', 'kadence-blocks' )}
                                       checked={get(configuration, [blockSlug, 'enableFadeOut'], false)}
                                       onChange={( value ) => saveConfigState('enableFadeOut', value)}
                        />

                        {get(configuration, [blockSlug, 'enableFadeOut'], false) && (
                            <RangeControl label={__( 'Fade Size', 'kadence-blocks' )}
                                          value={get(configuration, [blockSlug, 'fadeOutSize'], 50)}
                                          onChange={( value ) => saveConfigState('fadeOutSize', value)}
                            />
                        )}

                    </PanelBody>

                    <PanelBody
                        title={__( 'Spacing Settings', 'kadence-blocks' )}
                        panelName={ 'spacingSettings'}
                        blockSlug={ 'kadence/show-more' }
                    >
                        <ResponsiveMeasurementControls
                            label={__( 'Padding', 'kadence-blocks' )}
                            value={get(configuration, [blockSlug, 'paddingDesktop'], ['', '', '', ''])}
                            tabletValue={get(configuration, [blockSlug, 'paddingTablet'], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'paddingMobile'], ['', '', '', ''])}
                            onChange={( value ) => saveConfigState('paddingDesktop', value)}
                            onChangeTablet={( value ) => saveConfigState('paddingTablet', value)}
                            onChangeMobile={( value ) => saveConfigState('paddingMobile', value)}
                            min={0}
                            max={( ( get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'rem' ) ? 24 : 200 )}
                            step={( ( get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'paddingUnit'], 'px') === 'rem' ) ? 0.1 : 1 )}
                            unit={ get(configuration, [blockSlug, 'paddingUnit'], 'px')}
                            units={[ 'px', 'em', 'rem', '%' ]}
                            onUnit={( value ) => saveConfigState('paddingUnit', value) }
                        />
                        <ResponsiveMeasurementControls
                            label={__( 'Margin', 'kadence-blocks' )}
                            value={ get(configuration, [blockSlug, 'marginDesktop'], ['', '', '', '']) }
                            tabletValue={ get(configuration, [blockSlug, 'marginTablet'], ['', '', '', ''])}
                            mobileValue={get(configuration, [blockSlug, 'marginMobile'], ['', '', '', '']) }
                            onChange={( value ) => {
                                saveConfigState('marginDesktop', value)
                            }}
                            onChangeTablet={( value ) => saveConfigState('marginTablet', value)}
                            onChangeMobile={( value ) => saveConfigState('marginMobile', value)}
                            min={( get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? -12 : -200 )}
                            max={( get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? 24 : 200 )}
                            step={( get(configuration, [blockSlug, 'marginUnit'], 'px') === 'em' || get(configuration, [blockSlug, 'marginUnit'], 'px') === 'rem' ? 0.1 : 1 )}
                            unit={get(configuration, [blockSlug, 'marginUnit'], 'px')}
                            units={[ 'px', 'em', 'rem', '%', 'vh' ]}
                            onUnit={( value ) => saveConfigState('marginUnit', value)}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__( 'Expand Settings', 'kadence-blocks' )}
                        panelName={ 'expandSettings'}
                        blockSlug={ 'kadence/show-more' }
                    >
                        <ToggleControl
                            label={__( 'Default Expanded on Desktop', 'kadence-blocks' )}
                            checked={get(configuration, [blockSlug, 'defaultExpandedDesktop'], false)}
                            onChange={( value ) => saveConfigState('defaultExpandedDesktop', value) }
                        />
                        <ToggleControl
                            label={__( 'Default Expanded on Tablet', 'kadence-blocks' )}
                            checked={get(configuration, [blockSlug, 'defaultExpandedTablet'], false)}
                            onChange={( value ) => saveConfigState('defaultExpandedTablet', value) }
                        />
                        <ToggleControl
                            label={__( 'Default Expanded on Mobile', 'kadence-blocks' )}
                            checked={get(configuration, [blockSlug, 'defaultExpandedMobile'], false)}
                            onChange={( value ) => saveConfigState('defaultExpandedMobile', value) }
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

export default KadenceShowMore;
