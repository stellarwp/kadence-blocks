import {PopColorControl} from '@kadence/components';
import {
    Component,
    Fragment,
    useEffect,
    useState
} from '@wordpress/element';
import {
    ToggleControl,
    RangeControl,
    TabPanel,
    Dashicon,
    SelectControl,
    Button,
    Tooltip,
    Modal,
} from '@wordpress/components';

import {spacerIcon} from '@kadence/icons';
/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';

function KadenceSpacerDefault(props) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));

    useEffect(() => {
        // Check for old defaults.
        if (!configuration['kadence/spacer']) {
            const blockConfig = kadence_blocks_params.config['kadence/spacer'];
            if (blockConfig !== undefined && typeof blockConfig === 'object') {
                Object.keys(blockConfig).map((attribute) => {
                    saveConfigState(attribute, blockConfig[attribute]);
                });
            }
        }
    }, []);

    const saveConfig = (blockID, settingArray) => {
        setIsSaving(true);
        const config = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {});
        if (!config[blockID]) {
            config[blockID] = {};
        }
        config[blockID] = settingArray;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});
        settingModel.save().then(response => {
            setIsSaving(false);
            setConfiguration({ ...config });
            setIsOpen(false);

            kadence_blocks_params.configuration = JSON.stringify(config);
        });
    }

    const saveConfigState = (key, value) => {
        const config = configuration;
        if (config['kadence/spacer'] === undefined || config['kadence/spacer'].length == 0) {
            config['kadence/spacer'] = {};
        }
        config['kadence/spacer'][key] = value;
        setConfiguration({ ...config });
    }


    const spacerConfig = (configuration && configuration['kadence/spacer'] ? configuration['kadence/spacer'] : {});
    const deskControls = (
        <RangeControl
            label={__('Height')}
            value={(spacerConfig.spacerHeight ? spacerConfig.spacerHeight : 60)}
            onChange={value => saveConfigState('spacerHeight', value)}
            min={6}
            max={600}
        />
    );
    const tabletControls = (
        <RangeControl
            label={__('Tablet Height')}
            value={(spacerConfig.tabletSpacerHeight ? spacerConfig.tabletSpacerHeight : 60)}
            onChange={value => saveConfigState('tabletSpacerHeight', value)}
            min={6}
            max={600}
        />
    );
    const mobileControls = (
        <RangeControl
            label={__('Mobile Height')}
            value={(spacerConfig.mobileSpacerHeight ? spacerConfig.mobileSpacerHeight : 60)}
            onChange={value => saveConfigState('mobileSpacerHeight', value)}
            min={6}
            max={600}
        />
    );
    return (
        <Fragment>
            <Tooltip text="Block Defaults">
                <Button className="kt-block-defaults" onClick={() => setIsOpen(true)}>
                    <span className="kt-block-icon">{spacerIcon}</span>
                    {__('Spacer/Divider')}
                </Button>
            </Tooltip>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Spacer/Divider')}
                    onRequestClose={() => {
                        saveConfig('kadence/spacer', spacerConfig);
                    }}>
                    <SelectControl
                        label={__('Height Units')}
                        value={(spacerConfig.spacerHeightUnits ? spacerConfig.spacerHeightUnits : 'px')}
                        options={[
                            {value: 'px', label: __('px')},
                            {value: 'vh', label: __('vh')},
                        ]}
                        onChange={value => saveConfigState('spacerHeightUnits', value)}
                    />
                    <TabPanel className="kt-inspect-tabs kt-spacer-tabs"
                              activeClass="active-tab"
                              tabs={[
                                  {
                                      name: 'desk',
                                      title: <Dashicon icon="desktop"/>,
                                      className: 'kt-desk-tab',
                                  },
                                  {
                                      name: 'tablet',
                                      title: <Dashicon icon="tablet"/>,
                                      className: 'kt-tablet-tab',
                                  },
                                  {
                                      name: 'mobile',
                                      title: <Dashicon icon="smartphone"/>,
                                      className: 'kt-mobile-tab',
                                  },
                              ]}>
                        {
                            (tab) => {
                                let tabout;
                                if (tab.name) {
                                    if ('mobile' === tab.name) {
                                        tabout = mobileControls;
                                    } else if ('tablet' === tab.name) {
                                        tabout = tabletControls;
                                    } else {
                                        tabout = deskControls;
                                    }
                                }
                                return <div>{tabout}</div>;
                            }
                        }
                    </TabPanel>
                    <ToggleControl
                        label={__('Enable Divider')}
                        checked={(undefined !== spacerConfig.dividerEnable ? spacerConfig.dividerEnable : true)}
                        onChange={value => saveConfigState('dividerEnable', value)}
                    />
                    {(undefined !== spacerConfig.dividerEnable ? spacerConfig.dividerEnable : true) && (
                        <Fragment>
                            <SelectControl
                                label={__('Divider Style')}
                                value={(spacerConfig.dividerStyle ? spacerConfig.dividerStyle : 'solid')}
                                onChange={value => saveConfigState('dividerStyle', value)}
                                options={[
                                    {value: 'solid', label: __('Solid')},
                                    {value: 'dashed', label: __('Dashed')},
                                    {value: 'dotted', label: __('Dotted')},
                                ]}
                            />
                            <PopColorControl
                                label={__('Divider Color')}
                                value={(spacerConfig.dividerColor ? spacerConfig.dividerColor : '#eeeeee')}
                                default={'#eeeeee'}
                                opacityValue={(spacerConfig.dividerOpacity ? spacerConfig.dividerOpacity : 100)}
                                onChange={value => saveConfigState('dividerColor', value)}
                                onOpacityChange={value => saveConfigState('dividerOpacity', value)}
                                opacityUnit={100}
                            />
                            <RangeControl
                                label={__('Divider Height in px')}
                                value={(spacerConfig.dividerHeight ? spacerConfig.dividerHeight : 1)}
                                onChange={value => saveConfigState('dividerHeight', value)}
                                min={0}
                                max={40}
                            />
                            <RangeControl
                                label={__('Divider Width by %')}
                                value={(spacerConfig.dividerWidth ? spacerConfig.dividerWidth : 1)}
                                onChange={value => saveConfigState('dividerWidth', value)}
                                min={0}
                                max={100}
                            />
                        </Fragment>
                    )}
                    <Button className="kt-defaults-save" isPrimary onClick={() => {
                        saveConfig('kadence/spacer', spacerConfig);
                    }}>
                        {__('Save/Close')}
                    </Button>
                </Modal>
            )}
        </Fragment>
    );

}

export default KadenceSpacerDefault;
