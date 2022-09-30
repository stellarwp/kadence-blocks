import {map} from 'lodash';
import {PopColorControl, TypographyControls, HeadingLevelIcon} from '@kadence/components';

/**
 * Internal block libraries
 */
import {__, sprintf} from '@wordpress/i18n';
import {
    Component,
    Fragment,
    useState
} from '@wordpress/element';
import {
    AlignmentToolbar,
} from '@wordpress/blockEditor';
import {
    PanelBody,
    Toolbar,
    RangeControl,
    ButtonGroup,
    Button,
    Dashicon,
    Modal,
    SelectControl,
} from '@wordpress/components';
import {useDispatch} from '@wordpress/data';
import {store as noticesStore} from '@wordpress/notices';

import {advancedHeadingIcon} from '@kadence/icons';

function KadenceAdvancedHeadingDefault(props) {

    const [isOpen, setIsOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [resetConfirm, setResetConfirm] = useState(false);
    const [configuration, setConfiguration] = useState((kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {}));
    const {createErrorNotice} = useDispatch(noticesStore);

    const saveConfig = (blockID, settingArray) => {
        setIsSaving(true);
        const config = (kadence_blocks_params.configuration ? JSON.parse(kadence_blocks_params.configuration) : {});
        if (!config[blockID]) {
            config[blockID] = {};
        }
        config[blockID] = settingArray;
        const settingModel = new wp.api.models.Settings({kadence_blocks_config_blocks: JSON.stringify(config)});
        settingModel.save().then(response => {
            createErrorNotice(__('Block defaults saved!', 'kadence-blocks'), {
                type: 'snackbar',
            });

			setIsSaving(false);
			setConfiguration({ ...config });
			setIsOpen(false);

            kadence_blocks_params.configuration = JSON.stringify(config);
        });
    }

    const saveConfigState = (key, value) => {
        const config = configuration;
        if (config['kadence/advancedheading'] === undefined || config['kadence/advancedheading'].length == 0) {
            config['kadence/advancedheading'] = {};
        }
        config['kadence/advancedheading'][key] = value;
        setConfiguration({ ...config });
    }
    const clearDefaults = (key) => {
        const config = configuration;
        if (config['kadence/advancedheading'] === undefined || config['kadence/advancedheading'].length == 0) {
            config['kadence/advancedheading'] = {};
        }
        if (undefined !== config['kadence/advancedheading'][key]) {
            delete config['kadence/advancedheading'][key];
        }
        setConfiguration({ ...config });
    }
    const clearAllDefaults = () => {
        const config = configuration;
        config['kadence/advancedheading'] = {};
        setConfiguration({ ...config });
    }


    const headingConfig = (configuration && configuration['kadence/advancedheading'] ? configuration['kadence/advancedheading'] : {});
    const marginTypes = [
        {key: 'px', name: __('px')},
        {key: 'em', name: __('em')},
        {key: '%', name: __('%')},
        {key: 'vh', name: __('vh')},
        {key: 'rem', name: __('rem')},
    ];
    const marginMin = ((undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === 'em' || (undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === 'rem' ? 0.1 : 1);
    const marginMax = ((undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === 'em' || (undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === 'rem' ? 12 : 100);
    const marginStep = ((undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === 'em' || (undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === 'rem' ? 0.1 : 1);
    const createLevelControl = (targetLevel) => {
        return [{
            icon: 'heading',
            title: sprintf(
                /* translators: %d: heading level e.g: "1", "2", "3" */
                __('Heading %d', 'kadence-blocks'),
                targetLevel
            ),
            isActive: targetLevel === (undefined !== headingConfig.level ? headingConfig.level : 2),
            onClick: () => saveConfigState('level', targetLevel),
            subscript: String(targetLevel),
        }];
    };
    const level = (undefined !== headingConfig.level ? headingConfig.level : 2);
    const htmlTag = (undefined !== headingConfig.htmlTag ? headingConfig.htmlTag : 'heading');
    const sizeTypes = [
        {key: 'px', name: __('px')},
        {key: 'em', name: __('em')},
        {key: 'rem', name: __('rem')},
    ];
    const headingOptions = [
        [
            {
                icon: <HeadingLevelIcon level={1}
                                        isPressed={(1 === level && htmlTag && htmlTag === 'heading' ? true : false)}/>,
                title: __('Heading 1', 'kadence-blocks'),
                isActive: (1 === level && htmlTag && htmlTag === 'heading' ? true : false),
                onClick: () => {
                    saveConfigState('level', 1);
                    saveConfigState('htmlTag', 'heading');
                },
            },
        ],
        [
            {
                icon: <HeadingLevelIcon level={2}
                                        isPressed={(2 === level && htmlTag && htmlTag === 'heading' ? true : false)}/>,
                title: __('Heading 2', 'kadence-blocks'),
                isActive: (2 === level && htmlTag && htmlTag === 'heading' ? true : false),
                onClick: () => {
                    saveConfigState('level', 2);
                    saveConfigState('htmlTag', 'heading');
                },
            },
        ],
        [
            {
                icon: <HeadingLevelIcon level={3}
                                        isPressed={(3 === level && htmlTag && htmlTag === 'heading' ? true : false)}/>,
                title: __('Heading 3', 'kadence-blocks'),
                isActive: (3 === level && htmlTag && htmlTag === 'heading' ? true : false),
                onClick: () => {
                    saveConfigState('level', 3);
                    saveConfigState('htmlTag', 'heading');
                },
            },
        ],
        [
            {
                icon: <HeadingLevelIcon level={4}
                                        isPressed={(4 === level && htmlTag && htmlTag === 'heading' ? true : false)}/>,
                title: __('Heading 4', 'kadence-blocks'),
                isActive: (4 === level && htmlTag && htmlTag === 'heading' ? true : false),
                onClick: () => {
                    saveConfigState('level', 4);
                    saveConfigState('htmlTag', 'heading');
                },
            },
        ],
        [
            {
                icon: <HeadingLevelIcon level={5}
                                        isPressed={(5 === level && htmlTag && htmlTag === 'heading' ? true : false)}/>,
                title: __('Heading 5', 'kadence-blocks'),
                isActive: (5 === level && htmlTag && htmlTag === 'heading' ? true : false),
                onClick: () => {
                    saveConfigState('level', 5);
                    saveConfigState('htmlTag', 'heading');
                },
            },
        ],
        [
            {
                icon: <HeadingLevelIcon level={6}
                                        isPressed={(6 === level && htmlTag && htmlTag === 'heading' ? true : false)}/>,
                title: __('Heading 6', 'kadence-blocks'),
                isActive: (6 === level && htmlTag && htmlTag === 'heading' ? true : false),
                onClick: () => {
                    saveConfigState('level', 6);
                    saveConfigState('htmlTag', 'heading');
                },
            },
        ],
        [
            {
                icon: <HeadingLevelIcon level={'p'} isPressed={(htmlTag && htmlTag === 'p' ? true : false)}/>,
                title: __('Paragraph', 'kadence-blocks'),
                isActive: (htmlTag && htmlTag === 'p' ? true : false),
                onClick: () => {
                    saveConfigState('htmlTag', 'p');
                },
            },
        ],
    ];
    return (
        <Fragment>
            <Button className="kt-block-defaults" onClick={() => setIsOpen(true) }>
                <span className="kt-block-icon">{advancedHeadingIcon}</span>
                {__('Advanced Text', 'kadence-blocks')}
            </Button>
            {isOpen ?
                <Modal
                    className="kt-block-defaults-modal"
                    title={__('Kadence Advanced Text', 'kadence-blocks')}
                    onRequestClose={() => {
                        saveConfig('kadence/advancedheading', headingConfig);
                    }}>
                    <PanelBody
                        title={__('Advanced Text Controls', 'kadence-blocks')}
                        initialOpen={true}
                    >
                        <div className="components-base-control">
                            <p className="kt-setting-label">{__('HTML Tag', 'kadence-blocks')}</p>
                            <Toolbar controls={headingOptions}/>
                        </div>
                        <div className="components-base-control">
                            <p className="kt-setting-label">{__('Alignment', 'kadence-blocks')}</p>
                            <AlignmentToolbar
                                value={(undefined !== headingConfig.align ? headingConfig.align : '')}
                                onChange={(nextAlign) => {
                                    saveConfigState('align', nextAlign);
                                }}
                            />
                        </div>
                        <div className="components-base-control">
                            <PopColorControl
                                label={__('Color', 'kadence-blocks')}
                                value={(undefined !== headingConfig.color ? headingConfig.color : '')}
                                default={''}
                                onChange={value => saveConfigState('color', value)}
                            />
                        </div>
                        <div className="components-base-control">
                            <p className="kt-setting-label">{__('Font Size Units', 'kadence-blocks')}</p>
                            <ButtonGroup className="kt-size-type-options-defaults" aria-label={__('Size Type')}>
                                {map(sizeTypes, ({name, key}) => (
                                    <Button
                                        key={key}
                                        className="kt-size-btn"
                                        isSmall
                                        isPrimary={(undefined !== headingConfig.sizeType ? headingConfig.sizeType : 'px') === key}
                                        aria-pressed={(undefined !== headingConfig.sizeType ? headingConfig.sizeType : 'px') === key}
                                        onClick={() => saveConfigState('sizeType', key)}
                                    >
                                        {name}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>
                        <div className="components-base-control">
                            <p className="kt-setting-label">{__('Line Heights Units', 'kadence-blocks')}</p>
                            <ButtonGroup className="kt-size-type-options-defaults"
                                         aria-label={__('Size Type', 'kadence-blocks')}>
                                {map(sizeTypes, ({name, key}) => (
                                    <Button
                                        key={key}
                                        className="kt-size-btn"
                                        isSmall
                                        isPrimary={(undefined !== headingConfig.lineType ? headingConfig.lineType : 'px') === key}
                                        aria-pressed={(undefined !== headingConfig.lineType ? headingConfig.lineType : 'px') === key}
                                        onClick={() => saveConfigState('lineType', key)}
                                    >
                                        {name}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>
                    </PanelBody>
                    <PanelBody
                        title={__('Advanced Typography Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <TypographyControls
                            letterSpacing={(undefined !== headingConfig.letterSpacing ? headingConfig.letterSpacing : '')}
                            onLetterSpacing={(value) => saveConfigState('letterSpacing', value)}
                            fontFamily={(undefined !== headingConfig.typography ? headingConfig.typography : '')}
                            onFontFamily={(value) => saveConfigState('typography', value)}
                            onFontChange={(select) => {
                                saveConfigState('typography', select.value);
                                saveConfigState('googleFont', select.google);
                            }}
                            googleFont={(undefined !== headingConfig.googleFont ? headingConfig.googleFont : false)}
                            onGoogleFont={(value) => saveConfigState('googleFont', value)}
                            loadGoogleFont={(undefined !== headingConfig.loadGoogleFont ? headingConfig.loadGoogleFont : true)}
                            onLoadGoogleFont={(value) => saveConfigState('loadGoogleFont', value)}
                            fontVariant={(undefined !== headingConfig.fontVariant ? headingConfig.fontVariant : '')}
                            onFontVariant={(value) => saveConfigState('fontVariant', value)}
                            fontWeight={(undefined !== headingConfig.fontWeight ? headingConfig.fontWeight : 'regular')}
                            onFontWeight={(value) => saveConfigState('fontWeight', value)}
                            fontStyle={(undefined !== headingConfig.fontStyle ? headingConfig.fontStyle : 'normal')}
                            onFontStyle={(value) => saveConfigState('fontStyle', value)}
                            fontSubset={(undefined !== headingConfig.fontSubset ? headingConfig.fontSubset : '')}
                            onFontSubset={(value) => saveConfigState('fontSubset', value)}
                            textTransform={(undefined !== headingConfig.textTransform ? headingConfig.textTransform : '')}
                            onTextTransform={(value) => saveConfigState('textTransform', value)}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('Highlight Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <div className="components-base-control">
                            <PopColorControl
                                label={__('Highlight Color', 'kadence-blocks')}
                                value={(undefined !== headingConfig.markColor ? headingConfig.markColor : '#f76a0c')}
                                default={'#f76a0c'}
                                onChange={value => saveConfigState('markColor', value)}
                            />
                        </div>
                        <div className="components-base-control">
                            <PopColorControl
                                label={__('Highlight Background', 'kadence-blocks')}
                                value={(undefined !== headingConfig.markBG ? headingConfig.markBG : '')}
                                default={''}
                                onChange={value => saveConfigState('markBG', value)}
                                opacityValue={(undefined !== headingConfig.markBGOpacity ? headingConfig.markBGOpacity : 1)}
                                onOpacityChange={value => saveConfigState('markBGOpacity', value)}
                            />
                        </div>
                        <PopColorControl
                            label={__('Highlight Border Color', 'kadence-blocks')}
                            value={(undefined !== headingConfig.markBorder ? headingConfig.markBorder : '')}
                            default={''}
                            onChange={value => saveConfigState('markBorder', value)}
                            opacityValue={(undefined !== headingConfig.markBorderOpacity ? headingConfig.markBorderOpacity : 1)}
                            onOpacityChange={value => saveConfigState('markBorderOpacity', value)}
                        />
                        <SelectControl
                            label={__('Highlight Border Style', 'kadence-blocks')}
                            value={(undefined !== headingConfig.markBorderStyle ? headingConfig.markBorderStyle : 'solid')}
                            options={[
                                {value: 'solid', label: __('Solid')},
                                {value: 'dashed', label: __('Dashed')},
                                {value: 'dotted', label: __('Dotted')},
                            ]}
                            onChange={value => saveConfigState('markBorderStyle', value)}
                        />
                        <RangeControl
                            label={__('Highlight Border Width', 'kadence-blocks')}
                            value={(undefined !== headingConfig.markBorderWidth ? headingConfig.markBorderWidth : 0)}
                            onChange={value => saveConfigState('markBorderWidth', value)}
                            min={0}
                            max={20}
                            step={1}
                        />
                        <div className="components-base-control">
                            <p className="kt-setting-label">{__('Mark Font Size Units', 'kadence-blocks')}</p>
                            <ButtonGroup className="kt-size-type-options-defaults"
                                         aria-label={__('Size Type', 'kadence-blocks')}>
                                {map(sizeTypes, ({name, key}) => (
                                    <Button
                                        key={key}
                                        className="kt-size-btn"
                                        isSmall
                                        isPrimary={(undefined !== headingConfig.markSizeType ? headingConfig.markSizeType : 'px') === key}
                                        aria-pressed={(undefined !== headingConfig.markSizeType ? headingConfig.markSizeType : 'px') === key}
                                        onClick={() => saveConfigState('markSizeType', key)}
                                    >
                                        {name}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>
                        <div className="components-base-control">
                            <p className="kt-setting-label">{__('Mark Line Heights Units', 'kadence-blocks')}</p>
                            <ButtonGroup className="kt-size-type-options-defaults"
                                         aria-label={__('Size Type', 'kadence-blocks')}>
                                {map(sizeTypes, ({name, key}) => (
                                    <Button
                                        key={key}
                                        className="kt-size-btn"
                                        isSmall
                                        isPrimary={(undefined !== headingConfig.markLineType ? headingConfig.markLineType : 'px') === key}
                                        aria-pressed={(undefined !== headingConfig.markLineType ? headingConfig.markLineType : 'px') === key}
                                        onClick={() => saveConfigState('markLineType', key)}
                                    >
                                        {name}
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </div>
                        <TypographyControls
                            letterSpacing={(undefined !== headingConfig.markLetterSpacing ? headingConfig.markLetterSpacing : '')}
                            onLetterSpacing={(value) => saveConfigState('markLetterSpacing', value)}
                            fontFamily={(undefined !== headingConfig.markTypography ? headingConfig.markTypography : '')}
                            onFontFamily={(value) => saveConfigState('markTypography', value)}
                            onFontChange={(select) => {
                                saveConfigState('markTypography', select.value);
                                saveConfigState('markGoogleFont', select.google);
                            }}
                            googleFont={(undefined !== headingConfig.markGoogleFont ? headingConfig.markGoogleFont : false)}
                            onGoogleFont={(value) => saveConfigState('markGoogleFont', value)}
                            loadGoogleFont={(undefined !== headingConfig.markLoadGoogleFont ? headingConfig.markLoadGoogleFont : true)}
                            onLoadGoogleFont={(value) => saveConfigState('markLoadGoogleFont', value)}
                            fontVariant={(undefined !== headingConfig.markFontVariant ? headingConfig.markFontVariant : '')}
                            onFontVariant={(value) => saveConfigState('markFontVariant', value)}
                            fontWeight={(undefined !== headingConfig.markFontWeight ? headingConfig.markFontWeight : 'regular')}
                            onFontWeight={(value) => saveConfigState('markFontWeight', value)}
                            fontStyle={(undefined !== headingConfig.markFontStyle ? headingConfig.markFontStyle : 'normal')}
                            onFontStyle={(value) => saveConfigState('markFontStyle', value)}
                            fontSubset={(undefined !== headingConfig.markFontSubset ? headingConfig.markFontSubset : '')}
                            onFontSubset={(value) => saveConfigState('markFontSubset', value)}
                            padding={(undefined !== headingConfig.markPadding ? headingConfig.markPadding : [0, 0, 0, 0])}
                            onPadding={(value) => saveConfigState('markPadding', value)}
                            paddingControl={(undefined !== headingConfig.markPaddingControl ? headingConfig.markPaddingControl : 'linked')}
                            onPaddingControl={(value) => saveConfigState('markPaddingControl', value)}
                            textTransform={(undefined !== headingConfig.markTextTransform ? headingConfig.markTextTransform : '')}
                            onTextTransform={(value) => saveConfigState('markTextTransform', value)}
                        />
                    </PanelBody>
                    <PanelBody
                        title={__('Margin Settings', 'kadence-blocks')}
                        initialOpen={false}
                    >
                        <ButtonGroup className="kt-size-type-options" aria-label={__('Margin Type', 'kadence-blocks')}>
                            {map(marginTypes, ({name, key}) => (
                                <Button
                                    key={key}
                                    className="kt-size-btn"
                                    isSmall
                                    isPrimary={(undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === key}
                                    aria-pressed={(undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === key}
                                    onClick={() => saveConfigState('marginType', key)}
                                >
                                    {name}
                                </Button>
                            ))}
                        </ButtonGroup>
                        <RangeControl
                            label={__('Top Margin', 'kadence-blocks')}
                            value={(undefined !== headingConfig.topMargin ? headingConfig.topMargin : '')}
                            onChange={(value) => saveConfigState('topMargin', value)}
                            min={marginMin}
                            max={marginMax}
                            step={marginStep}
                        />
                        <ButtonGroup className="kt-size-type-options" aria-label={__('Margin Type', 'kadence-blocks')}>
                            {map(marginTypes, ({name, key}) => (
                                <Button
                                    key={key}
                                    className="kt-size-btn"
                                    isSmall
                                    isPrimary={(undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === key}
                                    aria-pressed={(undefined !== headingConfig.marginType ? headingConfig.marginType : 'px') === key}
                                    onClick={() => saveConfigState('marginType', key)}
                                >
                                    {name}
                                </Button>
                            ))}
                        </ButtonGroup>
                        <RangeControl
                            label={__('Bottom Margin', 'kadence-blocks')}
                            value={(undefined !== headingConfig.bottomMargin ? headingConfig.bottomMargin : '')}
                            onChange={(value) => saveConfigState('bottomMargin', value)}
                            min={marginMin}
                            max={marginMax}
                            step={marginStep}
                        />
                    </PanelBody>
                    <div className="kb-modal-footer">
                        {!resetConfirm && (
                            <Button className="kt-defaults-save" isDestructive
                                    disabled={(JSON.stringify(configuration['kadence/advancedheading']) === JSON.stringify({}) ? true : false)}
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
                            saveConfig('kadence/advancedheading', headingConfig);
                        }}>
                            {__('Save/Close', 'kadence-blocks')}
                        </Button>
                    </div>
                </Modal>
                : null}
        </Fragment>
    );
}

export default KadenceAdvancedHeadingDefault;
