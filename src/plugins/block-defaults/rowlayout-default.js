import {map} from 'lodash';
import {MeasurementControls} from '@kadence/components';
/**
 * Internal block libraries
 */
import {__} from '@wordpress/i18n';
import {
    Component,
    Fragment,
    useState,
    useEffect
} from '@wordpress/element';
import {
    PanelBody,
    RangeControl,
    ButtonGroup,
    Button,
    TabPanel,
    Dashicon,
    Modal,
    ToggleControl,
    SelectControl,
} from '@wordpress/components';

import {blockRowIcon} from '@kadence/icons';

function KadenceRowLayoutDefault(props) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));

    useEffect(() => {
        // Check for old defaults.
        if (!configuration['kadence/rowlayout']) {
            const blockConfig = kadence_blocks_params.config['kadence/rowlayout'];
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
        if (config['kadence/rowlayout'] === undefined || config['kadence/rowlayout'].length == 0) {
            config['kadence/rowlayout'] = {};
        }
        config['kadence/rowlayout'][key] = value;
        setConfiguration({ ...config });
    }

    const clearDefaults = (key) => {
        const config = configuration;
        if (config['kadence/rowlayout'] === undefined || config['kadence/rowlayout'].length == 0) {
            config['kadence/rowlayout'] = {};
        }
        if (undefined !== config['kadence/rowlayout'][key]) {
            delete config['kadence/rowlayout'][key];
        }
        setConfiguration({ ...config });
    }

    const clearAllDefaults = () => {
        const config = configuration;
        config['kadence/rowlayout'] = {};
        setConfiguration({ ...config });
    }

    const rowConfig = (configuration && configuration['kadence/rowlayout'] ? configuration['kadence/rowlayout'] : {});
    const marginMin = ((undefined !== rowConfig.marginType ? rowConfig.marginType : 'px') === 'em' || (undefined !== rowConfig.marginType ? rowConfig.marginType : 'px') === 'rem' ? 0.1 : 1);
    const marginMax = ((undefined !== rowConfig.marginType ? rowConfig.marginType : 'px') === 'em' || (undefined !== rowConfig.marginType ? rowConfig.marginType : 'px') === 'rem' ? 12 : 100);
    const marginStep = ((undefined !== rowConfig.marginType ? rowConfig.marginType : 'px') === 'em' || (undefined !== rowConfig.marginType ? rowConfig.marginType : 'px') === 'rem' ? 0.1 : 1);
    const paddingMin = ((undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px') === 'em' || (undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px') === 'rem' ? 0 : 0);
    const paddingMax = ((undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px') === 'em' || (undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px') === 'rem' ? 24 : 500);
    const paddingStep = ((undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px') === 'em' || (undefined !== rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px') === 'rem' ? 0.1 : 1);
    const widthTypes = [
        {key: 'px', name: __('px')},
        {key: '%', name: __('%')},
        {key: 'vw', name: __('vw')},
    ];
    const widthMax = ((undefined !== rowConfig.maxWidthUnit ? rowConfig.maxWidthUnit : 'px') === 'px' ? 2000 : 100);
    const mobileControls = (
        <Fragment>
            <MeasurementControls
                reset={() => {
                    clearDefaults('topPaddingM');
                    clearDefaults('rightPaddingM');
                    clearDefaults('bottomPaddingM');
                    clearDefaults('leftPaddingM');
                }}
                label={__('Mobile Padding', 'kadence-blocks')}
                measurement={[(undefined !== rowConfig.topPaddingM ? rowConfig.topPaddingM : ''), (undefined !== rowConfig.rightPaddingM ? rowConfig.rightPaddingM : ''), (undefined !== rowConfig.bottomPaddingM ? rowConfig.bottomPaddingM : ''), (undefined !== rowConfig.leftPaddingM ? rowConfig.leftPaddingM : '')]}
                onChange={(value) => {
                    saveConfigState('topPaddingM', value[0]);
                    saveConfigState('rightPaddingM', value[1]);
                    saveConfigState('bottomPaddingM', value[2]);
                    saveConfigState('leftPaddingM', value[3]);
                }}
                min={paddingMin}
                max={paddingMax}
                step={paddingStep}
                unit={undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px'}
                units={[(undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px')]}
                showUnit={true}
                allowEmpty={true}
            />
            <MeasurementControls
                reset={() => {
                    clearDefaults('topMarginM');
                    clearDefaults('bottomMarginM');
                }}
                label={__('Mobile Margin', 'kadence-blocks')}
                measurement={[(undefined !== rowConfig.topMarginM ? rowConfig.topMarginM : ''), 'auto', (undefined !== rowConfig.bottomMarginM ? rowConfig.bottomMarginM : ''), 'auto']}
                onChange={(value) => {
                    saveConfigState('topMarginM', value[0]);
                    saveConfigState('bottomMarginM', value[2]);
                }}
                min={marginMin}
                max={marginMax}
                step={marginStep}
                unit={undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px'}
                units={[undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px']}
                showUnit={true}
                allowEmpty={true}
            />
        </Fragment>
    );
    const tabletControls = (
        <Fragment>
            <MeasurementControls
                reset={() => clearDefaults('tabletPadding')}
                label={__('Tablet Padding', 'kadence-blocks')}
                measurement={(undefined !== rowConfig.tabletPadding ? rowConfig.tabletPadding : ['', '', '', ''])}
                onChange={(value) => saveConfigState('tabletPadding', value)}
                min={paddingMin}
                max={paddingMax}
                step={paddingStep}
                unit={undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px'}
                units={[(undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px')]}
                showUnit={true}
                allowEmpty={true}
            />
            <MeasurementControls
                reset={() => {
                    clearDefaults('topMarginT');
                    clearDefaults('bottomMarginT');
                }}
                label={__('Tablet Margin', 'kadence-blocks')}
                measurement={[(undefined !== rowConfig.topMarginT ? rowConfig.topMarginT : ''), 'auto', (undefined !== rowConfig.bottomMarginT ? rowConfig.bottomMarginT : ''), 'auto']}
                onChange={(value) => {
                    saveConfigState('topMarginT', value[0]);
                    saveConfigState('bottomMarginT', value[2]);
                }}
                min={marginMin}
                max={marginMax}
                step={marginStep}
                unit={undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px'}
                units={[undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px']}
                showUnit={true}
                allowEmpty={true}
            />
        </Fragment>
    );
    const deskControls = (
        <Fragment>
            <MeasurementControls
                reset={() => {
                    clearDefaults('topPadding');
                    clearDefaults('rightPadding');
                    clearDefaults('bottomPadding');
                    clearDefaults('leftPadding');
                }}
                label={__('Padding', 'kadence-blocks')}
                measurement={[(undefined !== rowConfig.topPadding ? rowConfig.topPadding : ''), (undefined !== rowConfig.rightPadding ? rowConfig.rightPadding : ''), (undefined !== rowConfig.bottomPadding ? rowConfig.bottomPadding : ''), (undefined !== rowConfig.leftPadding ? rowConfig.leftPadding : '')]}
                onChange={(value) => {
                    saveConfigState('topPadding', value[0]);
                    saveConfigState('rightPadding', value[1]);
                    saveConfigState('bottomPadding', value[2]);
                    saveConfigState('leftPadding', value[3]);
                }}
                min={paddingMin}
                max={paddingMax}
                step={paddingStep}
                unit={undefined !== rowConfig.paddingUnit && rowConfig.paddingUnit ? rowConfig.paddingUnit : 'px'}
                units={['px', 'em', 'rem', '%', 'vh', 'vw']}
                onUnit={(value) => saveConfigState('paddingUnit', value)}
                allowEmpty={true}
            />
            <MeasurementControls
                reset={() => {
                    clearDefaults('topMargin');
                    clearDefaults('bottomMargin');
                }}
                label={__('Margin', 'kadence-blocks')}
                measurement={[(undefined !== rowConfig.topMargin ? rowConfig.topMargin : ''), 'auto', (undefined !== rowConfig.bottomMargin ? rowConfig.bottomMargin : ''), 'auto']}
                onChange={(value) => {
                    saveConfigState('topMargin', value[0]);
                    saveConfigState('bottomMargin', value[2]);
                }}
                min={marginMin}
                max={marginMax}
                step={marginStep}
                unit={undefined !== rowConfig.marginUnit && rowConfig.marginUnit ? rowConfig.marginUnit : 'px'}
                units={['px', 'em', 'rem', '%', 'vh']}
                onUnit={(value) => saveConfigState('marginUnit', value)}
                allowEmpty={true}
            />
        </Fragment>
    );
    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true)}>
                <span className="kt-block-icon">{blockRowIcon}</span>
                {__('Row Layout', 'kadence-blocks')}
            </Button>
            {isOpen && (
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Row Layout')}
                    onRequestClose={() => {
                        saveConfig('kadence/rowlayout', rowConfig);
                    }}>
                    <PanelBody
                        title={__('Row Layout Controls', 'kadence-blocks')}
                        initialOpen={true}
                    >
                        <SelectControl
                            label={__('Align', 'kadence-blocks')}
                            value={(undefined !== rowConfig.align ? rowConfig.align : '')}
                            options={[
                                {value: '', label: __('Default', 'kadence-blocks')},
                                {value: 'wide', label: __('Wide', 'kadence-blocks')},
                                {value: 'full', label: __('Fullwidth', 'kadence-blocks')},
                            ]}
                            onChange={(value) => saveConfigState('align', value)}
                        />
                        <SelectControl
                            label={__('Column width Resizing control', 'kadence-blocks')}
                            value={(undefined !== rowConfig.columnsUnlocked ? rowConfig.columnsUnlocked : false)}
                            options={[
                                {value: false, label: __('Step Resizing', 'kadence-blocks')},
                                {value: true, label: __('Fluid Resizing', 'kadence-blocks')},
                            ]}
                            onChange={value => saveConfigState('columnsUnlocked', value)}
                        />
                        <SelectControl
                            label={__('Column Gutter', 'kadence-blocks')}
                            value={(undefined !== rowConfig.columnGutter ? rowConfig.columnGutter : 'default')}
                            options={[
                                {value: 'default', label: __('Standard: 30px', 'kadence-blocks')},
                                {value: 'none', label: __('No Gutter', 'kadence-blocks')},
                                {value: 'skinny', label: __('Skinny: 10px', 'kadence-blocks')},
                                {value: 'narrow', label: __('Narrow: 20px', 'kadence-blocks')},
                                {value: 'wide', label: __('Wide: 40px', 'kadence-blocks')},
                                {value: 'wider', label: __('Wider: 60px', 'kadence-blocks')},
                                {value: 'widest', label: __('Widest: 80px', 'kadence-blocks')},
                            ]}
                            onChange={(value) => saveConfigState('columnGutter', value)}
                        />
                        <SelectControl
                            label={__('Column Collapse Vertical Gutter', 'kadence-blocks')}
                            value={(undefined !== rowConfig.collapseGutter ? rowConfig.collapseGutter : 'default')}
                            options={[
                                {value: 'default', label: __('Standard: 30px', 'kadence-blocks')},
                                {value: 'none', label: __('No Gutter', 'kadence-blocks')},
                                {value: 'skinny', label: __('Skinny: 10px', 'kadence-blocks')},
                                {value: 'narrow', label: __('Narrow: 20px', 'kadence-blocks')},
                                {value: 'wide', label: __('Wide: 40px', 'kadence-blocks')},
                                {value: 'wider', label: __('Wider: 60px', 'kadence-blocks')},
                                {value: 'widest', label: __('Widest: 80px', 'kadence-blocks')},
                            ]}
                            onChange={(value) => saveConfigState('collapseGutter', value)}
                        />
                        <SelectControl
                            label={__('Collapse Order')}
                            value={(undefined !== rowConfig.collapseOrder ? rowConfig.collapseOrder : 'left-to-right')}
                            options={[
                                {value: 'left-to-right', label: __('Left to Right', 'kadence-blocks')},
                                {value: 'right-to-left', label: __('Right to Left', 'kadence-blocks')},
                            ]}
                            onChange={value => saveConfigState('collapseOrder', value)}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('Padding Margin', 'kadence-blocks')}
                        initialOpen={false}
                    >
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
                    </PanelBody>
                    <PanelBody
                        title={__('Structure Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <SelectControl
                            label={__('Container HTML tag', 'kadence-blocks')}
                            value={(undefined !== rowConfig.htmlTag ? rowConfig.htmlTag : 'div')}
                            options={[
                                {value: 'div', label: 'div'},
                                {value: 'header', label: 'header'},
                                {value: 'section', label: 'section'},
                                {value: 'article', label: 'article'},
                                {value: 'main', label: 'main'},
                                {value: 'aside', label: 'aside'},
                                {value: 'footer', label: 'footer'},
                            ]}
                            onChange={(value) => saveConfigState('htmlTag', value)}
                        />
                        <ToggleControl
                            label={__('Content Max Width Inherit from Theme?', 'kadence-blocks')}
                            checked={(undefined !== rowConfig.inheritMaxWidth ? rowConfig.inheritMaxWidth : false)}
                            onChange={(value) => saveConfigState('inheritMaxWidth', value)}
                        />
                        {undefined !== rowConfig.inheritMaxWidth && rowConfig.inheritMaxWidth !== true && (
                            <Fragment>
                                <ButtonGroup className="kt-size-type-options"
                                             aria-label={__('Max Width Type', 'kadence-blocks')}>
                                    {map(widthTypes, ({name, key}) => (
                                        <Button
                                            key={key}
                                            className="kt-size-btn"
                                            isSmall
                                            isPrimary={(undefined !== rowConfig.maxWidthUnit ? rowConfig.maxWidthUnit : 'px') === key}
                                            aria-pressed={(undefined !== rowConfig.maxWidthUnit ? rowConfig.maxWidthUnit : 'px') === key}
                                            onClick={() => saveConfigState('maxWidthUnit', key)}
                                        >
                                            {name}
                                        </Button>
                                    ))}
                                </ButtonGroup>
                                <RangeControl
                                    label={__('Content Max Width', 'kadence-blocks')}
                                    value={(undefined !== rowConfig.maxWidth ? rowConfig.maxWidth : '')}
                                    onChange={(value) => saveConfigState('maxWidth', value)}
                                    min={0}
                                    max={widthMax}
                                />
                            </Fragment>
                        )}
                        <ToggleControl
                            label={__('Inner Column Height 100%', 'kadence-blocks')}
                            checked={(undefined !== rowConfig.columnsInnerHeight ? rowConfig.columnsInnerHeight : false)}
                            onChange={(value) => saveConfigState('columnsInnerHeight', value)}
                        />
                    </PanelBody>
                    <div className="kb-modal-footer">
                        {!resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive
                                    disabled={(JSON.stringify(configuration['kadence/rowlayout']) === JSON.stringify({}) ? true : false)}
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
                            saveConfig('kadence/rowlayout', rowConfig);
                        }}>
                            {__('Save/Close', 'kadence-blocks')}
                        </Button>
                    </div>
                </Modal>
            )}
        </Fragment>
    );
}

export default KadenceRowLayoutDefault;
