import {map} from 'lodash';
import {PopColorControl, MeasurementControls} from '@kadence/components';
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
    AlignmentToolbar,
} from '@wordpress/blockEditor';
import {
    Panel,
    PanelBody,
    RangeControl,
    Button,
    TabPanel,
    Dashicon,
    Modal,
} from '@wordpress/components';

import {
    blockColumnIcon,
    bottomRightIcon,
    bottomLeftIcon,
    topRightIcon,
    topLeftIcon,
    radiusIndividualIcon,
    radiusLinkedIcon
} from '@kadence/icons';

function KadenceColumnDefault(props) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const [borderWidthControl, setBorderWidthControl] = useState('individual');
    const [borderRadiusControl, setBorderRadiusControl] = useState('individual');


    useEffect(() => {
        // Check for old defaults.
        if (!configuration['kadence/column']) {
            const blockConfig = kadence_blocks_params.config['kadence/column'];
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
        if (config['kadence/column'] === undefined || config['kadence/column'].length == 0) {
            config['kadence/column'] = {};
        }
        config['kadence/column'][key] = value;
        setConfiguration({ ...config });
    }

    const clearDefaults = (key) => {
        const config = configuration;
        if (config['kadence/column'] === undefined || config['kadence/column'].length == 0) {
            config['kadence/column'] = {};
        }
        if (undefined !== config['kadence/column'][key]) {
            delete config['kadence/column'][key];
        }
        setConfiguration({ ...config });
    }

    const clearAllDefaults = () => {
        const config = configuration;
        config['kadence/column'] = {};
        setConfiguration({ ...config });
    }

    const columnConfig = (configuration && configuration['kadence/column'] ? configuration['kadence/column'] : {});
    const textAlignDefaultStyles = ['', '', ''];
    const textAlign = (undefined !== columnConfig.textAlign && columnConfig.textAlign[0] ? columnConfig.textAlign : textAlignDefaultStyles);
    const mobileControls = (
        <Panel className="components-panel__body is-opened">
            <MeasurementControls
                label={__('Mobile Padding')}
                reset={() => {
                    clearDefaults('topPaddingM');
                    clearDefaults('rightPaddingM');
                    clearDefaults('bottomPaddingM');
                    clearDefaults('leftPaddingM');
                }}
                measurement={[(undefined !== columnConfig.topPaddingM ? columnConfig.topPaddingM : ''), (undefined !== columnConfig.rightPaddingM ? columnConfig.rightPaddingM : ''), (undefined !== columnConfig.bottomPaddingM ? columnConfig.bottomPaddingM : ''), (undefined !== columnConfig.leftPaddingM ? columnConfig.leftPaddingM : '')]}
                onChange={(value) => {
                    saveConfigState('topPaddingM', value[0]);
                    saveConfigState('rightPaddingM', value[1]);
                    saveConfigState('bottomPaddingM', value[2]);
                    saveConfigState('leftPaddingM', value[3]);
                }}
                min={0}
                max={500}
                step={1}
                unit={'px'}
                showUnit={true}
                units={['px']}
                allowEmpty={true}
            />
            <MeasurementControls
                label={__('Mobile Margin')}
                reset={() => {
                    clearDefaults('topMarginM');
                    clearDefaults('rightMarginM');
                    clearDefaults('bottomMarginM');
                    clearDefaults('leftMarginM');
                }}
                measurement={[(undefined !== columnConfig.topMarginM ? columnConfig.topMarginM : ''), (undefined !== columnConfig.rightMarginM ? columnConfig.rightMarginM : ''), (undefined !== columnConfig.bottomMarginM ? columnConfig.bottomMarginM : ''), (undefined !== columnConfig.leftMarginM ? columnConfig.leftMarginM : '')]}
                onChange={(value) => {
                    saveConfigState('topMarginM', value[0]);
                    saveConfigState('rightMarginM', value[1]);
                    saveConfigState('bottomMarginM', value[2]);
                    saveConfigState('leftMarginM', value[3]);
                }}
                min={-200}
                max={200}
                step={1}
                allowEmpty={true}
                unit={'px'}
                showUnit={true}
                units={['px']}
            />
        </Panel>
    );

    const tabletControls = (
        <Panel className="components-panel__body is-opened">
            <MeasurementControls
                label={__('Tablet Padding')}
                reset={() => {
                    clearDefaults('topPaddingT');
                    clearDefaults('rightPaddingT');
                    clearDefaults('bottomPaddingT');
                    clearDefaults('leftPaddingT');
                }}
                measurement={[(undefined !== columnConfig.topPaddingT ? columnConfig.topPaddingT : ''), (undefined !== columnConfig.rightPaddingT ? columnConfig.rightPaddingT : ''), (undefined !== columnConfig.bottomPaddingT ? columnConfig.bottomPaddingT : ''), (undefined !== columnConfig.leftPaddingT ? columnConfig.leftPaddingT : '')]}
                onChange={(value) => {
                    saveConfigState('topPaddingT', value[0]);
                    saveConfigState('rightPaddingT', value[1]);
                    saveConfigState('bottomPaddingT', value[2]);
                    saveConfigState('leftPaddingT', value[3]);
                }}
                min={0}
                max={500}
                step={1}
                unit={'px'}
                showUnit={true}
                units={['px']}
                allowEmpty={true}
            />
            <MeasurementControls
                label={__('Tablet Margin')}
                reset={() => {
                    clearDefaults('topMarginT');
                    clearDefaults('rightMarginT');
                    clearDefaults('bottomMarginT');
                    clearDefaults('leftMarginT');
                }}
                measurement={[(undefined !== columnConfig.topMarginT ? columnConfig.topMarginT : ''), (undefined !== columnConfig.rightMarginT ? columnConfig.rightMarginT : ''), (undefined !== columnConfig.bottomMarginT ? columnConfig.bottomMarginT : ''), (undefined !== columnConfig.leftMarginT ? columnConfig.leftMarginT : '')]}
                onChange={(value) => {
                    saveConfigState('topMarginT', value[0]);
                    saveConfigState('rightMarginT', value[1]);
                    saveConfigState('bottomMarginT', value[2]);
                    saveConfigState('leftMarginT', value[3]);
                }}
                min={-200}
                max={200}
                step={1}
                allowEmpty={true}
                unit={'px'}
                showUnit={true}
                units={['px']}
            />
        </Panel>
    );
    const deskControls = (
        <Panel className="components-panel__body is-opened">
            <MeasurementControls
                label={__('Padding', 'kadence-blocks')}
                reset={() => {
                    clearDefaults('topPadding');
                    clearDefaults('rightPadding');
                    clearDefaults('bottomPadding');
                    clearDefaults('leftPadding');
                }}
                measurement={[(undefined !== columnConfig.topPadding ? columnConfig.topPadding : ''), (undefined !== columnConfig.rightPadding ? columnConfig.rightPadding : ''), (undefined !== columnConfig.bottomPadding ? columnConfig.bottomPadding : ''), (undefined !== columnConfig.leftPadding ? columnConfig.leftPadding : '')]}
                onChange={(value) => {
                    saveConfigState('topPadding', value[0]);
                    saveConfigState('rightPadding', value[1]);
                    saveConfigState('bottomPadding', value[2]);
                    saveConfigState('leftPadding', value[3]);
                }}
                min={0}
                max={500}
                step={1}
                unit={'px'}
                showUnit={true}
                units={['px']}
                allowEmpty={true}
            />
            <MeasurementControls
                label={__('Margin', 'kadence-blocks')}
                reset={() => {
                    clearDefaults('topMargin');
                    clearDefaults('rightMargin');
                    clearDefaults('bottomMargin');
                    clearDefaults('leftMargin');
                }}
                measurement={[(undefined !== columnConfig.topMargin ? columnConfig.topMargin : ''), (undefined !== columnConfig.rightMargin ? columnConfig.rightMargin : ''), (undefined !== columnConfig.bottomMargin ? columnConfig.bottomMargin : ''), (undefined !== columnConfig.leftMargin ? columnConfig.leftMargin : '')]}
                onChange={(value) => {
                    saveConfigState('topMargin', value[0]);
                    saveConfigState('rightMargin', value[1]);
                    saveConfigState('bottomMargin', value[2]);
                    saveConfigState('leftMargin', value[3]);
                }}
                min={-200}
                max={200}
                step={1}
                allowEmpty={true}
                unit={'px'}
                showUnit={true}
                units={['px']}
            />
        </Panel>
    );

    const tabControls = (
        <TabPanel className="kt-inspect-tabs"
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
    );

    const alignDeskControls = (
        <AlignmentToolbar
            isCollapsed={false}
            value={(textAlign && textAlign[0] ? textAlign[0] : '')}
            onChange={(nextAlign) => {
                saveConfigState('textAlign', [nextAlign, textAlign[1], textAlign[2]]);
            }}
        />
    );

    const alignTabletControls = (
        <AlignmentToolbar
            isCollapsed={false}
            value={(textAlign && textAlign[1] ? textAlign[1] : '')}
            onChange={(nextAlign) => {
                saveConfigState('textAlign', [textAlign[0], nextAlign, textAlign[2]]);
            }}
        />
    );

    const alignMobileControls = (
        <AlignmentToolbar
            isCollapsed={false}
            value={(textAlign && textAlign[2] ? textAlign[2] : '')}
            onChange={(nextAlign) => {
                saveConfigState('textAlign', [textAlign[0], textAlign[1], nextAlign]);
            }}
        />
    );

    const textAlignControls = (
        <div className="kb-sidebar-alignment">
            <h2 className="kt-heading-size-title">{__('Text Alignment', 'kadence-blocks')}</h2>
            <TabPanel className="kt-size-tabs"
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
                                tabout = alignMobileControls;
                            } else if ('tablet' === tab.name) {
                                tabout = alignTabletControls;
                            } else {
                                tabout = alignDeskControls;
                            }
                        }
                        return <div>{tabout}</div>;
                    }
                }
            </TabPanel>
        </div>
    );

    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true)}>
                <span className="kt-block-icon">{blockColumnIcon}</span>
                {__('Section', 'kadence-blocks')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Section', 'kadence-blocks')}
                    onRequestClose={() => {
                        saveConfig('kadence/column', columnConfig);
                    }}>
                    <PanelBody
                        title={__('Kadence Section Controls', 'kadence-blocks')}
                        initialOpen={true}
                    >
                        <div className="components-base-control">
                            <PopColorControl
                                label={__('Background Color', 'kadence-blocks')}
                                value={(undefined !== columnConfig.background ? columnConfig.background : '')}
                                default={''}
                                onChange={value => saveConfigState('background', value)}
                                opacityValue={(undefined !== columnConfig.backgroundOpacity ? columnConfig.backgroundOpacity : 1)}
                                onOpacityChange={value => saveConfigState('backgroundOpacity', value)}
                            />
                        </div>
                        <div className="components-base-control">
                            <PopColorControl
                                label={__('Border Color', 'kadence-blocks')}
                                value={(undefined !== columnConfig.border ? columnConfig.border : '')}
                                default={''}
                                onChange={value => saveConfigState('border', value)}
                                opacityValue={(undefined !== columnConfig.borderOpacity ? columnConfig.borderOpacity : 1)}
                                onOpacityChange={value => saveConfigState('borderOpacity', value)}
                            />
                        </div>
                        <MeasurementControls
                            label={__('Border Width', 'kadence-blocks')}
                            reset={() => {
                                clearDefaults('borderWidth');
                            }}
                            measurement={(undefined !== columnConfig.borderWidth ? columnConfig.borderWidth : [0, 0, 0, 0])}
                            control={borderWidthControl}
                            onChange={(value) => saveConfigState('borderWidth', value)}
                            onControl={(value) => setBorderWidthControl(value)}
                            min={0}
                            max={40}
                            step={1}
                        />
                        <MeasurementControls
                            label={__('Border Radius', 'kadence-blocks')}
                            reset={() => {
                                clearDefaults('borderRadius');
                            }}
                            measurement={(undefined !== columnConfig.borderRadius ? columnConfig.borderRadius : [0, 0, 0, 0])}
                            control={borderRadiusControl}
                            onChange={(value) => saveConfigState('borderRadius', value)}
                            onControl={(value) => setBorderRadiusControl(value)}
                            min={0}
                            max={200}
                            step={1}
                            controlTypes={[
                                {key: 'linked', name: __('Linked', 'kadence-blocks'), icon: radiusLinkedIcon},
                                {
                                    key: 'individual',
                                    name: __('Individual', 'kadence-blocks'),
                                    icon: radiusIndividualIcon
                                },
                            ]}
                            firstIcon={topLeftIcon}
                            secondIcon={topRightIcon}
                            thirdIcon={bottomLeftIcon}
                            fourthIcon={bottomRightIcon}
                        />
                        {textAlignControls}
                        <PanelBody
                            title={__('Text Color Settings', 'kadence-blocks')}
                            initialOpen={false}
                        >
                            <div className="components-base-control">
                                <PopColorControl
                                    label={__('Text Color', 'kadence-blocks')}
                                    value={(columnConfig.textColor ? columnConfig.textColor : '')}
                                    default={''}
                                    onChange={value => saveConfigState('textColor', value)}
                                />
                            </div>
                            <div className="components-base-control">
                                <PopColorControl
                                    label={__('Link Color', 'kadence-blocks')}
                                    value={(columnConfig.linkColor ? columnConfig.linkColor : '')}
                                    default={''}
                                    onChange={value => saveConfigState('linkColor', value)}
                                />
                            </div>
                            <div className="components-base-control">
                                <PopColorControl
                                    label={__('Link Hover Color', 'kadence-blocks')}
                                    value={(columnConfig.linkHoverColor ? columnConfig.linkHoverColor : '')}
                                    default={''}
                                    onChange={value => saveConfigState('linkHoverColor', value)}
                                />
                            </div>
                        </PanelBody>
                        <div className="kt-spacer-sidebar-15"></div>
                        {tabControls}
                    </PanelBody>
                    <div className="kb-modal-footer">
                        {!resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive
                                    disabled={(JSON.stringify(configuration['kadence/column']) === JSON.stringify({}) ? true : false)}
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
                            saveConfig('kadence/column', columnConfig);
                        }}>
                            {__('Save/Close', 'kadence-blocks')}
                        </Button>
                    </div>
                </Modal>
            )}
        </Fragment>
    );

}

export default KadenceColumnDefault;
